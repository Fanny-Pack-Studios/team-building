import { engine, Entity, MainCamera, Transform, VirtualCamera } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button } from '@dcl/sdk/react-ecs'

export function customizationUi(onClose: () => void): ReactEcs.JSX.Element {
  return 	<Button
    value="Customize Auditorium"
    uiTransform={{ width: '15%', height: '15%', position: { top: 300, left: 1300 }, positionType: 'absolute' }}
    onMouseDown={() => {
      customizationMode()
      onClose()
    }}
    fontSize={20}
  />
}

function customizationMode() {
  const auditoriumCamera = engine.getEntityOrNullByName('AuditoriumCamera')
  if(auditoriumCamera === null) return

  const lookAtEntity = engine.getEntityOrNullByName('Podium')
  if (lookAtEntity === null) return

	VirtualCamera.create(auditoriumCamera, {
    defaultTransition: { transitionMode: VirtualCamera.Transition.Time(3) },
    lookAtEntity: lookAtEntity!
  })

	Transform.createOrReplace(auditoriumCamera, {
		position: Vector3.create(0, 10, 0),
	})

  const mainCamera = MainCamera.createOrReplace(engine.CameraEntity, {
		virtualCameraEntity: auditoriumCamera!,
	})
}