import {
  EasingFunction,
  engine,
  InputAction,
  PlayerIdentityData,
  pointerEventsSystem,
  Transform,
  Tween
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { PollState } from './polls/pollEntity'
import { triggerPollQuestion } from './polls/pollQuestionUi'
import { showPollResultsUI } from './polls/pollResults'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from './syncEntities'

export function popupAttendeePanelAndResultsButton(): void {
  const attendeePanelEntity = engine.getEntityOrNullByName('AttendeePanel')
  const showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')

  // tweens that spawn and make visible both entities
  for (const entity of [attendeePanelEntity, showResultsButtonEntity]) {
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

export function setupAttendeePanelAndResultsButton(): void {
  setAttendeePanelInteractable()
  setupShowResultsButton()
}

function setAttendeePanelInteractable(): void {
  const attendeePanelEntity = engine.getEntityOrNullByName('AttendeePanel')
  const interactableMonitor = engine.getEntityOrNullByName('Interactable')

  if (interactableMonitor !== null) {
    pointerEventsSystem.onPointerDown(
      {
        entity: interactableMonitor,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Vote' }
      },
      runCurrentActivityAsAttendee
    )
  }

  if (attendeePanelEntity !== null && Array.from(engine.getEntitiesWith(PlayerIdentityData)).length < 2) {
    // if first player
    Transform.getMutable(attendeePanelEntity).scale = Vector3.Zero()
  }

  if (attendeePanelEntity !== null) {
    syncEntity(attendeePanelEntity, [Transform.componentId], SyncEntityEnumId.INTERACTABLE)
  }
}

function setupShowResultsButton(): void {
  const showResultsButtonEntity = engine.getEntityOrNullByName('ShowResultsButton')

  if (showResultsButtonEntity !== null) {
    pointerEventsSystem.onPointerDown(
      {
        entity: showResultsButtonEntity,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Show Results' }
      },
      showResultsFromCurrentActivity
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

function runCurrentActivityAsAttendee(): void {
  const allPollEntities = Array.from(engine.getEntitiesWith(PollState))
  if (allPollEntities.length <= 0) return
  const lastOpenedPoll = allPollEntities[allPollEntities.length - 1]

  if (lastOpenedPoll !== null) {
    triggerPollQuestion(lastOpenedPoll[0])
  }
}

function showResultsFromCurrentActivity(): void {
  const allPollEntities = Array.from(engine.getEntitiesWith(PollState))
  if (allPollEntities.length <= 0) return
  const lastOpenedPoll = allPollEntities[allPollEntities.length - 1]

  if (lastOpenedPoll !== null) {
    showPollResultsUI(lastOpenedPoll[1].pollId)
  }
}
