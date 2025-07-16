import * as utils from '@dcl-sdk/utils'
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
import { type GameController } from '../controllers/game.controller'
import { pushSyncedMessage } from '../messagebus/messagebus'
import { PollState } from '../polls/pollEntity'
import { PollQuestion } from '../polls/pollQuestionUi'
import { SurveyState } from '../surveys/surveyEntity'
import { SyncEntityEnumId } from '../syncEntities'
import { withPlayerInfo } from '../utils'
import { ActivityType, getCurrentActivity, listenToActivities } from './activitiesEntity'

export class PopupAttendeePanelAndResultsButton {
  public attendeePanelEntity = engine.getEntityOrNullByName('AttendeePanel')
  public showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')
  public interactableMonitor: Entity | null = null
  public attendeePanelEntityA: Entity | null = null

  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController

    listenToActivities(this.gameController.activitiesEntity, (activity) => {
      if (activity !== undefined) {
        this.create()
      }
    })
  }

  popupEntity(entity: Entity | null, endScale: Vector3 = Vector3.One()): void {
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

  create(): void {
    this.attendeePanelEntity = engine.getEntityOrNullByName('AttendeePanel')
    this.showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')
    this.interactableMonitor = engine.getEntityOrNullByName('Interactable')

    this.popupEntity(this.attendeePanelEntity)
    this.popupEntity(this.interactableMonitor, Vector3.create(2, 2, 2))

    withPlayerInfo((player) => {
      if (this.gameController.hostsController.isHost(player.userId)) {
        this.popupEntity(this.showResultsButtonEntity)
      }
    })
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
    const currentActivity = getCurrentActivity(this.gameController.activitiesEntity)

    if (currentActivity === undefined) return

    const { entity } = currentActivity

    if (PollState.has(entity)) {
      this.runPollAsAtendee(entity)
    }

    if (SurveyState.has(entity)) {
      this.runSurveyAsAtendee(entity)
    }
  }

  runSurveyAsAtendee(surveyEntity: Entity): void {
    this.gameController.surveyQuestionUI.isVisible = true
  }

  runPollAsAtendee(pollEntity: Entity): void {
    const pollState = PollState.get(pollEntity)

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
          this.gameController.hostsController.doIfHost(() => {
            pushSyncedMessage('showCurrentActivityResults', {})
          })
        }
      )
    }

    if (showResultsButtonEntity !== null && Array.from(engine.getEntitiesWith(PlayerIdentityData)).length < 2) {
      // if first player
      Transform.getMutable(showResultsButtonEntity).scale = Vector3.Zero()
    }
  }

  showResultsFromCurrentActivity(): void {
    const currentActivity = getCurrentActivity(this.gameController.activitiesEntity)
    if (currentActivity !== undefined) {
      switch (currentActivity.type) {
        case ActivityType.POLL:
          this.showPollResults(currentActivity.entity)
          break
        case ActivityType.SURVEY:
          this.showSurveyResults(currentActivity.entity)
          break
      }
    }
  }

  showSurveyResults(entity: Entity): void {
    this.gameController.surveyResultsUI.isVisible = true
  }

  showPollResults(pollEntity: Entity): void {
    const pollState = PollState.getOrNull(pollEntity)

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

    this.gameController.pollResultsUI.setData({
      question: pollState.question,
      anonymous: pollState.anonymous,
      results,
      votes: pollState.votes.map((vote) => ({ option: vote.option, userId: vote.userId }))
    })

    this.gameController.pollResultsUI.openUI()
  }

  remove(): void {
    for (const entity of [this.attendeePanelEntity, this.interactableMonitor]) {
      if (entity !== null) {
        this.animateOutAndRemove(entity)
      }
    }
  }

  animateOutAndRemove(entity: Entity, duration = 500): void {
    Tween.createOrReplace(entity, {
      mode: Tween.Mode.Scale({
        start: Vector3.One(),
        end: Vector3.Zero()
      }),
      duration,
      easingFunction: EasingFunction.EF_EASEOUTBOUNCE
    })
    utils.timers.setTimeout(() => {
      // engine.removeEntity(entity)
    }, duration)
  }
}
