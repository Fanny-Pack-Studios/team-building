import { engine, Transform, TextShape, Font, MeshCollider, Material, PointerEvents, PointerEventType, InputAction, Schemas, Entity, MeshRenderer } from "@dcl/sdk/ecs"
import { Vector3, Color4, Color3 } from "@dcl/sdk/math"
import { syncEntity } from "@dcl/sdk/network"

// In world interactable poll

export const PollState = engine.defineComponent('pollState', {
  question: Schemas.String,
  options: Schemas.Array(Schemas.String),
  answers: Schemas.Array(Schemas.String)
})

export function createPollEntity(question: string, options: string[]): Entity {
    const pollEntity = engine.addEntity()
    Transform.create(pollEntity, { position: Vector3.create(18.85 * Math.random(), 0.5 * options.length, 20.49 * Math.random()), scale: Vector3.create(3, 3, 3) })
    TextShape.create(pollEntity, {
      text: question,
      textColor: { r: 1, g: 0, b: 0, a: 1 },
      fontSize: 1,
      font: Font.F_SANS_SERIF
    })
    MeshCollider.setPlane(pollEntity)
    MeshRenderer.setPlane(pollEntity)
    Material.setPbrMaterial(pollEntity, {
      albedoColor: Color4.fromColor3(Color3.Blue(), 0.3)
    })

    PollState.create(pollEntity, { question, options, answers: [] })
    PollState.onChange(pollEntity, (pollState) => {
      // Update the text of the poll based on the amount of occurrences of each answer
      const optionLines = pollState ? pollState.options.map(opt => {
        const count = pollState.answers.filter(a => a === opt).length
        const total = pollState.answers.length || 1 // avoid div by 0
        const percent = Math.round((count / total) * 100)
        return `${opt}: ${percent}% (${count})`
      }) : []
      TextShape.getMutable(pollEntity).text = `${pollState?.question ?? ""}\n${optionLines.join('\n')}`
    })
  
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