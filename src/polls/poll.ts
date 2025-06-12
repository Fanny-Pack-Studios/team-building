import { engine, inputSystem, InputAction, PointerEventType, EntityUtils, MeshRenderer, MeshCollider, Transform, pointerEventsSystem } from "@dcl/sdk/ecs"
import { createPollAdminUi } from "./pollAdminUi"
import { PollState } from "./pollEntity"
import { Vector3 } from "@dcl/sdk/math"
import { createPollQuestionUi } from "./pollQuestionUi"

// This is the entrance point to setup the polls

// Handles interactions with the poll entities
export function addPollsSystem() {
  engine.addSystem(() => {
    const result = inputSystem.getInputCommand(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)
    if (result?.hit?.entityId) {
      let pollState = PollState.getOrNull(EntityUtils.toEntityId(result.hit.entityId, 0))
      if (pollState) {
        createPollQuestionUi(pollState.question, pollState.options)
      }
    }
  })
}

// Spawns a poll creator, which on interacted opens the admin UI to create polls
export function addPollCreator(): void {
  const myEntity = engine.addEntity()
  MeshRenderer.setBox(myEntity)
  MeshCollider.setBox(myEntity)
  Transform.create(myEntity, { position: Vector3.create(8, 1, 8) })

  pointerEventsSystem.onPointerDown(
    {
      entity: myEntity,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Create Poll' }
    },
    createPollAdminUi
  )
}
