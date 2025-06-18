import {
  engine,
  inputSystem,
  InputAction,
  PointerEventType,
  MeshRenderer,
  MeshCollider,
  Transform,
  pointerEventsSystem,
  type Entity,
  TextShape,
  Billboard
} from '@dcl/sdk/ecs'
import { createPollAdminUi } from './pollAdminUi'
import { onChangePollState, PollState } from './pollEntity'
import { Vector3 } from '@dcl/sdk/math'
import { triggerPollQuestion } from './pollQuestionUi'

// This is the entrance point to setup the polls

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
  const myEntity = engine.addEntity()
  const text = engine.addEntity()
  MeshRenderer.setBox(myEntity)
  MeshCollider.setBox(myEntity)
  Transform.create(myEntity, { position: Vector3.create(8.92, 1, 3.77) })
  TextShape.create(text, {
    text: 'CREATE POLL',
    fontSize: 2
  })
  Transform.create(text, { parent: myEntity })
  Transform.getMutable(text).position.y = 1
  Billboard.create(text, {})
  pointerEventsSystem.onPointerDown(
    {
      entity: myEntity,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Create Poll' }
    },
    createPollAdminUi
  )
}
