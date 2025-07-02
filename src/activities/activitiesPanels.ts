import {
  EasingFunction,
  engine,
  type Entity,
  InputAction,
  PlayerIdentityData,
  pointerEventsSystem,
  Transform,
  Tween
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { syncEntity } from '@dcl/sdk/network'
import { PollState } from '../polls/pollEntity'
import { PollQuestion } from '../polls/pollQuestionUi'
import { SyncEntityEnumId } from '../syncEntities'
import { type GameController } from '../controllers/game.controller'

export class PopupAttendeePanelAndResultsButton {
  public attendeePanelEntity = engine.getEntityOrNullByName('AttendeePanel')
  public showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')
  public interactableMonitor: Entity | null = null
  public attendeePanelEntityA: Entity | null = null
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  create(): void {
    for (const entity of [this.attendeePanelEntity, this.showResultsButtonEntity]) {
      if (entity !== null) {
        Tween.createOrReplace(entity, {
          mode: Tween.Mode.Scale({
            start: Vector3.Zero(),
            end: Vector3.One()
          }),
          duration: 500,
          easingFunction: EasingFunction.EF_EASEINBOUNCE
        })
      }
    }
  }

  setupAttendeePanelAndResultsButton(): void {
    this.setAttendeePanelInteractable()
    this.setupShowResultsButton()
  }

  setAttendeePanelInteractable(): void {
    this.attendeePanelEntityA = engine.getEntityOrNullByName('AttendeePanelA')
    this.interactableMonitor = engine.getEntityOrNullByName('Interactable')

    if (this.interactableMonitor !== null) {
      pointerEventsSystem.onPointerDown(
        {
          entity: this.interactableMonitor,
          opts: { button: InputAction.IA_POINTER, hoverText: 'Vote' }
        },
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        () => this.runCurrentActivityAsAttendee()
      )
    }
    if (this.attendeePanelEntity !== null && Array.from(engine.getEntitiesWith(PlayerIdentityData)).length < 2) {
      // if first player
      Transform.getMutable(this.attendeePanelEntity).scale = Vector3.Zero()
    }

    if (this.attendeePanelEntity !== null) {
      syncEntity(this.attendeePanelEntity, [Transform.componentId], SyncEntityEnumId.INTERACTABLE)
    }
  }

  runCurrentActivityAsAttendee(): void {
    const allPollEntities = Array.from(engine.getEntitiesWith(PollState))
    if (allPollEntities.length <= 0) return

    const lastOpenedPoll = allPollEntities[allPollEntities.length - 1]
    const pollEntity = lastOpenedPoll?.[0]
    const pollState = PollState.getOrNull(pollEntity)

    if (pollState == null) {
      console.log('No PollState found.')
      return
    }

    if (pollState.closed) {
      console.log('THE POLL IS CLOSED')
      return
    }

    const triggerPollQuestion = new PollQuestion(this.gameController, pollEntity)
    console.log(triggerPollQuestion)
  }

  setupShowResultsButton(): void {
    const showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')

    if (showResultsButtonEntity !== null) {
      pointerEventsSystem.onPointerDown(
        {
          entity: showResultsButtonEntity,
          opts: { button: InputAction.IA_POINTER, hoverText: 'Show Results' }
        },
        () => {
          this.showResultsFromCurrentActivity()
        }
      )
    }

    if (showResultsButtonEntity !== null && Array.from(engine.getEntitiesWith(PlayerIdentityData)).length < 2) {
      // if first player
      Transform.getMutable(showResultsButtonEntity).scale = Vector3.Zero()
    }

    if (showResultsButtonEntity !== null) {
      syncEntity(showResultsButtonEntity, [Transform.componentId], SyncEntityEnumId.SHOW_RESULTS_BUTTON)
    }
  }

  showResultsFromCurrentActivity(): void {
    const allPollEntities = Array.from(engine.getEntitiesWith(PollState))
    if (allPollEntities.length <= 0) return

    const lastOpenedPoll = allPollEntities[allPollEntities.length - 1]
    const entity = lastOpenedPoll?.[0]
    const pollState = PollState.getOrNull(entity)

    if (pollState == null) {
      console.log('No PollState found for last entity.')
      return
    }

    const counts = new Map<string, number>()
    for (const opt of pollState.options) counts.set(opt, 0)
    for (const vote of pollState.votes) {
      counts.set(vote.option, (counts.get(vote.option) ?? 0) + 1)
    }

    const totalVotes = pollState.votes.length
    const results = pollState.options.map((option) => {
      const count = counts.get(option) ?? 0
      const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
      return { option, count, percentage }
    })

    this.gameController.resultsUI.setData({
      question: pollState.question,
      anonymous: pollState.anonymous,
      results,
      votes: pollState.anonymous
        ? undefined
        : pollState.votes.map((vote) => ({
            option: vote.option,
            userId: vote.userId
          }))
    })

    this.gameController.resultsUI.openUI()
  }
}
