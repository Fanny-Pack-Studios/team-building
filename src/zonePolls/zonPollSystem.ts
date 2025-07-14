import { engine, type Entity } from '@dcl/sdk/ecs'
import { ZonePollState } from './pollEntity'

import { type GameController } from '../controllers/game.controller'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { OptionZone } from './optionZone'

export class ZonePollSystem {
  private readonly trackedEntities = new Set<Entity>()
  private readonly gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  public start(): void {
    engine.addSystem(this.update)
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

  public reset(): void {
    this.trackedEntities.clear()
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
    Vector3.create(2, 0, 4),
    Vector3.create(6, 0, 4),
    Vector3.create(10, 0, 4),
    Vector3.create(14, 0, 4)
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
  })

  gameController.zonePollQuestionUI.show(zonePoll.question, zonePoll.options)

  let elapsed = 0
  const duration = 60

  const pollSystem = (dt: number): void => {
    elapsed += dt
    if (elapsed >= duration) {
      gameController.zonePollQuestionUI.hide()

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

  engine.addSystem(pollSystem)
  gameController.timerUI.show(1)
}
