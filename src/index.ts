import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'
import { addPollCreator, addPollsSystem } from './polls/poll'
import { InputAction, MeshCollider, MeshRenderer, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { logPollResults } from './polls/pollResults'
import { pol } from './polls/pollEntity'
import { OptionZone } from './optionZone/optionZone'

export function main(): void {
  ReactEcsRenderer.setUiRenderer(ui.render)

  addPollsSystem()
  addPollCreator()

  const zone = new OptionZone(Vector3.create(18.05, 0.01, 19.07))
  engine.addSystem((dt) => {
    zone.update(dt)
  })

  const resultCube = engine.addEntity()
  Transform.create(resultCube, {
    position: Vector3.create(3, 1, 8),
    scale: Vector3.create(1, 1, 1)
  })
  MeshRenderer.setBox(resultCube)
  MeshCollider.setBox(resultCube)

  pointerEventsSystem.onPointerDown(
    {
      entity: resultCube,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'Show Poll Results'
      }
    },
    () => {
      logPollResults(pol)
    }
  )
}
