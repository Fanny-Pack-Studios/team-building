import { engine, inputSystem, InputAction, PointerEventType, pointerEventsSystem, type Entity } from '@dcl/sdk/ecs'
import { createPollAdminUi } from './pollAdminUi'
import { onChangePollState, PollState } from './pollEntity'
import { triggerPollQuestion } from './pollQuestionUi'

const registeredPollEntities = new Set<Entity>()

export function addPollsSystem(): void {
  // Process poll clicks
  engine.addSystem(() => {
    const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
    if (result?.hit?.entityId !== undefined) {
      Array.from(engine.getEntitiesWith(PollState)).forEach(([entity]) => {
        if (entity === result?.hit?.entityId) {
          triggerPollQuestion(entity)
        }
      })
    }
  })

  // Add a system that registers onChange handlers for new poll entities
  engine.addSystem(registerPollHandlersSystem)
}

function registerPollHandlersSystem(): void {
  const allPollEntities = engine.getEntitiesWith(PollState)
  for (const [entity] of allPollEntities) {
    if (registeredPollEntities.has(entity)) continue

    registeredPollEntities.add(entity)

    PollState.onChange(entity, (pollState) => {
      onChangePollState(pollState, entity)
    })

    // Also run the handler once immediately to set the initial text
    const pollState = PollState.get(entity)
    onChangePollState(pollState, entity)
  }
}

// Spawns a poll creator, which on interacted opens the admin UI to create polls
export function addPollCreator(): void {
  const podium = engine.getEntityOrNullByName('Podium')
  if (podium === null) return
  pointerEventsSystem.onPointerDown(
    {
      entity: podium,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Create Poll' }
    },
    createPollAdminUi
  )
}
