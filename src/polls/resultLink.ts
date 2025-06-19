import { Schemas, engine, pointerEventsSystem } from '@dcl/sdk/ecs'

import {
  Transform,
  TextShape,
  Font,
  MeshCollider,
  MeshRenderer,
  Material,
  PointerEvents,
  InputAction,
  type Entity
} from '@dcl/sdk/ecs'
import { Vector3, Color3, Color4 } from '@dcl/sdk/math'
import { syncEntity } from '@dcl/sdk/network'
import { logPollResults, showPollResultsUI } from './pollResults'

export const PollResultLink = engine.defineComponent('resultLink', {
  pollId: Schemas.String
})
export function createShowResultsEntity(parentEntity: Entity, pollId: string): Entity {
  const resultEntity = engine.addEntity()

  Transform.create(resultEntity, {
    position: Vector3.create(0, 0.5, 0),
    scale: Vector3.create(0.5, 0.1, 0.1)
  })
  Transform.getMutable(resultEntity).parent = parentEntity

  TextShape.create(resultEntity, {
    text: 'Show Results',
    font: Font.F_SANS_SERIF,
    fontSize: 1,
    textColor: Color4.White()
  })

  MeshRenderer.setBox(resultEntity)
  MeshCollider.setBox(resultEntity)
  Material.setPbrMaterial(resultEntity, {
    albedoColor: Color4.fromColor3(Color3.Green(), 0.5)
  })

  pointerEventsSystem.onPointerDown(
    {
      entity: resultEntity,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'Show Poll Results'
      }
    },
    () => {
      logPollResults(pollId)
      showPollResultsUI(pollId)
    }
  )

  PollResultLink.create(resultEntity, { pollId })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  syncEntity(resultEntity, [
    Transform.componentId,
    TextShape.componentId,
    MeshRenderer.componentId,
    MeshCollider.componentId,
    PointerEvents.componentId,
    PollResultLink.componentId
  ])

  return resultEntity
}
