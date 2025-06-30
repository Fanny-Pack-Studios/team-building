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
import { showPollResultsUI } from '../polls/pollResults'
import { SyncEntityEnumId } from '../syncEntities'
import { type GameController } from '../controllers/game.controller'

// export function popupAttendeePanelAndResultsButton(): void {
//   const attendeePanelEntity = engine.getEntityOrNullByName('AttendeePanel')
//   const showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')

//   // tweens that spawn and make visible both entities
//   for (const entity of [attendeePanelEntity, showResultsButtonEntity]) {
//     if (entity !== null) {
//       Tween.createOrReplace(entity, {
//         mode: Tween.Mode.Scale({
//           start: Vector3.Zero(),
//           end: Vector3.One()
//         }),
//         duration: 500,
//         easingFunction: EasingFunction.EF_EASEINBOUNCE
//       })
//     }
//   }
// }

// export function setupAttendeePanelAndResultsButton(): void {
//   setAttendeePanelInteractable()
//   setupShowResultsButton()
// }

// function setAttendeePanelInteractable(): void {
//   const attendeePanelEntity = engine.getEntityOrNullByName('AttendeePanel')
//   const interactableMonitor = engine.getEntityOrNullByName('Interactable')

//   if (interactableMonitor !== null) {
//     pointerEventsSystem.onPointerDown(
//       {
//         entity: interactableMonitor,
//         opts: { button: InputAction.IA_POINTER, hoverText: 'Vote' }
//       },
//       runCurrentActivityAsAttendee
//     )
//   }

//   if (attendeePanelEntity !== null && Array.from(engine.getEntitiesWith(PlayerIdentityData)).length < 2) {
//     // if first player
//     Transform.getMutable(attendeePanelEntity).scale = Vector3.Zero()
//   }

//   if (attendeePanelEntity !== null) {
//     syncEntity(attendeePanelEntity, [Transform.componentId], SyncEntityEnumId.INTERACTABLE)
//   }
// }

// function setupShowResultsButton(): void {
//   const showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')

//   if (showResultsButtonEntity !== null) {
//     pointerEventsSystem.onPointerDown(
//       {
//         entity: showResultsButtonEntity,
//         opts: { button: InputAction.IA_POINTER, hoverText: 'Show Results' }
//       },
//       showResultsFromCurrentActivity
//     )
//   }

//   if (showResultsButtonEntity !== null && Array.from(engine.getEntitiesWith(PlayerIdentityData)).length < 2) {
//     // if first player
//     Transform.getMutable(showResultsButtonEntity).scale = Vector3.Zero()
//   }

//   if (showResultsButtonEntity !== null) {
//     syncEntity(showResultsButtonEntity, [Transform.componentId], SyncEntityEnumId.SHOW_RESULTS_BUTTON)
//   }
// }

// function runCurrentActivityAsAttendee(): void {
//   const allPollEntities = Array.from(engine.getEntitiesWith(PollState))
//   if (allPollEntities.length <= 0) return
//   const lastOpenedPoll = allPollEntities[allPollEntities.length - 1]

//   if (lastOpenedPoll !== null) {
//     triggerPollQuestion(lastOpenedPoll[0])
//     // triggerPollQuestion  = new PollQuestion()
//   }
// }

// function showResultsFromCurrentActivity(): void {
//   const allPollEntities = Array.from(engine.getEntitiesWith(PollState))
//   if (allPollEntities.length <= 0) return
//   const lastOpenedPoll = allPollEntities[allPollEntities.length - 1]

//   if (lastOpenedPoll !== null) {
//     showPollResultsUI(lastOpenedPoll[1].pollId)
//   }
// }

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

    if (lastOpenedPoll !== null) {
      // triggerPollQuestion(lastOpenedPoll[0])

      const triggerPollQuestion = new PollQuestion(this.gameController, lastOpenedPoll[0])
      console.log(triggerPollQuestion)
    }
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

    if (lastOpenedPoll !== null) {
      showPollResultsUI(lastOpenedPoll[1].pollId)
    }
  }
}
