import { engine, Transform, TextShape, Font, MeshCollider, Material, PointerEvents, PointerEventType, InputAction, Schemas, Entity } from "@dcl/sdk/ecs"
import { Vector3, Color4 } from "@dcl/sdk/math"
import { syncEntity } from "@dcl/sdk/network"

// In world interactable poll

export const PollState = engine.defineComponent('pollState', {
  question: Schemas.String,
  options: Schemas.Array(Schemas.String),
  answers: Schemas.Array(Schemas.String)
})

export function createPollEntity(pollQuestion: string, answers: string[]): Entity {
    const pollEntity = engine.addEntity()
    Transform.create(pollEntity, { position: Vector3.create(18.85, 0.88, 20.49), scale: Vector3.create(3, 3, 3) })
    TextShape.create(pollEntity, {
      text: pollQuestion,
      textColor: { r: 1, g: 0, b: 0, a: 1 },
      fontSize: 5,
      font: Font.F_SANS_SERIF
    })
    MeshCollider.setSphere(pollEntity)
    Material.setPbrMaterial(pollEntity, {
      albedoColor: Color4.Green()
    })
    PollState.create(pollEntity, { question: pollQuestion, options: answers })
  
    PointerEvents.create(pollEntity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_PRIMARY,
          }
        }
      ]
    })
  
    syncEntity(pollEntity, [PointerEvents.componentId, Transform.componentId, TextShape.componentId, MeshCollider.componentId])

    return pollEntity
  }