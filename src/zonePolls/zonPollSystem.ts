import { engine, type Entity } from '@dcl/sdk/ecs'
import { ZonePollState } from './pollEntity'

import { type GameController } from '../controllers/game.controller'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { OptionZone } from './optionZone'
import { ActivityType, getCurrentActivity } from '../activities/activitiesEntity'
import { type VotingDoorNumber, openVotingDoors, closeAllOpenedDoors } from '../auditorium/votingDoors'
import * as utils from '@dcl-sdk/utils'
import { pushSyncedMessage } from '../messagebus/messagebus'
export class ZonePollSystem {
  private readonly trackedEntities = new Set<Entity>()
  private readonly gameController: GameController
  private lastClosed = false

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  public start(): void {
    engine.addSystem(this.update)

    engine.addSystem(() => {
      const activity = getCurrentActivity(this.gameController.activitiesEntity)
      if (activity?.type === ActivityType.ZONEPOLL) {
        if (activity.state.closed && !this.lastClosed) {
          this.close()
        } else if (!activity.state.closed) {
          this.lastClosed = false
        }
      } else {
        this.lastClosed = false
      }
    })
  }

  private readonly update = (): void => {
    const entities = engine.getEntitiesWith(ZonePollState)
    for (const [entity, zonePoll] of entities) {
      if (!this.trackedEntities.has(entity)) {
        this.trackedEntities.add(entity)
        createZonesForPoll(zonePoll, entity, this.gameController)
      }
    }
  }

  private clearZones(): void {
    for (const key of ['zone1', 'zone2', 'zone3', 'zone4'] as const) {
      const zone = this.gameController[key]
      if (zone != null) {
        zone.destroy()
        this.gameController[key] = null
      }
    }

    for (const system of this.gameController.zoneUpdateSystems) {
      engine.removeSystem(system)
    }

    this.gameController.zoneUpdateSystems.clear()
  }

  public reset(): void {
    this.trackedEntities.clear()
    this.clearZones()

    if (this.gameController.zonePollElapsed != null) {
      engine.removeSystem(this.gameController.zonePollElapsed)
      this.gameController.zonePollElapsed = undefined
    }
    if (this.gameController.zonePollDataEntity != null) {
      engine.removeEntity(this.gameController.zonePollDataEntity)
      this.gameController.zonePollDataEntity = null
    }
  }

  public close(): void {
    this.lastClosed = true
    this.clearZones()
    this.gameController.zonePollQuestionUI.hide()
    this.gameController.timerUI.hide()
    this.gameController.closePollUi.hide()
    closeAllOpenedDoors()
    const dataEntity = this.gameController.zonePollDataEntity

    if (dataEntity !== null) {
      const pollState = ZonePollState.get(dataEntity)
      const counts = pollState.zoneCounts
      const maxVotes = Math.max(...counts)
      const winnerIndexes = counts.map((count, i) => ({ count, i })).filter((entry) => entry.count === maxVotes)

      if (maxVotes === 0 || winnerIndexes.length > 1) {
        pushSyncedMessage('showZonePollResults', {
          question: pollState.question,
          winnerOption: "It's a tie!"
        })
      } else {
        const winnerOption = pollState.options[winnerIndexes[0].i]
        pushSyncedMessage('showZonePollResults', {
          question: pollState.question,
          winnerOption
        })
      }
      engine.removeEntity(dataEntity)
      this.gameController.zonePollDataEntity = null
    }
    this.reset()
  }
}

function createZonesForPoll(
  zonePoll: {
    pollId: string
    question: string
    options: string[]
    zoneCounts: number[]
  },
  entity: Entity,
  gameController: GameController
): void {
  console.log('Created zones for:', zonePoll.pollId)
  console.log(`Question: ${zonePoll.question}`)
  console.log('Options', zonePoll.options)

  const zoneColors = [Color4.Red(), Color4.Green(), Color4.Yellow(), Color4.Blue()]

  const positions = [
    Vector3.create(13.1, 0.2, 6.64),
    Vector3.create(10.54, 0.2, 3.21),
    Vector3.create(2.83, 0.14, 6.64),
    Vector3.create(6, 0.18, 3.4)
  ]

  const zoneKeys = ['zone1', 'zone2', 'zone3', 'zone4'] as const

  zonePoll.options.forEach((option, index) => {
    if (index >= positions.length) {
      console.log('Too many options, skipping:', option)
      return
    }

    const position = positions[index]
    const color = zoneColors[index] ?? Color4.White()

    const zone = new OptionZone(position, color, index, entity, gameController)

    const key = zoneKeys[index]
    gameController[key] = zone

    const updateSystem = (dt: number): void => {
      zone.update(dt)
    }

    engine.addSystem(updateSystem)
    gameController.zoneUpdateSystems.add(updateSystem)
    const doorsToOpen = zonePoll.options.map((_, index) => (index + 1) as VotingDoorNumber)
    utils.timers.setTimeout(() => {
      openVotingDoors(doorsToOpen)
    }, 800)
  })

  gameController.zonePollQuestionUI.show(zonePoll.question, zonePoll.options)

  let elapsed = 0
  // TODO : Should come from the UI's

  const duration = 30

  const pollSystem = (dt: number): void => {
    elapsed += dt
    if (elapsed >= duration) {
      closeZonePoll(entity)
      engine.removeSystem(pollSystem)

      for (const key of zoneKeys) {
        const zone = gameController[key]
        if (zone != null) zone.destroy()
      }

      for (const system of gameController.zoneUpdateSystems) {
        engine.removeSystem(system)
      }

      gameController.zoneUpdateSystems.clear()
      engine.removeSystem(pollSystem)
    }
  }
  gameController.zonePollElapsed = pollSystem
  engine.addSystem(pollSystem)
  gameController.timerUI.show(0.5)
}

export function closeZonePoll(zonePollEntity: Entity): void {
  if (!ZonePollState.has(zonePollEntity)) {
    console.log(`ZonePollState not found for entity ${zonePollEntity}`)
    return
  }

  const mutable = ZonePollState.getMutable(zonePollEntity)
  console.log(mutable.id)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (mutable) {
    mutable.closed = true
    console.log('Poll closed:', mutable)
  }
}
