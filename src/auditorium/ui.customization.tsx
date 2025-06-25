import { engine, Entity, MainCamera, Material, TextureUnion, Transform, UiText, VirtualCamera } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

export function customizationUi(onClose: () => void): ReactEcs.JSX.Element {
  return <Button
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
  toggleCustomizationCamera()
  openAuditoriumCustomizationUi()
}

function openAuditoriumCustomizationUi() {
  ReactEcsRenderer.setUiRenderer(() =>
    <AuditoriumCustomizationElement />
  )
}

const AuditoriumCustomizationElement = () => {
  const [stageImage, setStageImage] = ReactEcs.useState('')

  return <UiEntity uiTransform={{
    width: '100%',
    height: '100%',
    positionType: 'absolute',
    position: { top: 0, left: 0 },
  }}>
    <UiEntity
      uiTransform={{
        width: 400,
        height: 100,
        positionType: 'absolute',
        position: {
          right: '15%',
          top: '40%',
        },
      }}
      uiBackground={{
        color: Color4.fromInts(100, 100, 100, 150),
      }}
    >
      <Label
        value="Stage Image"
        color={Color4.Black()}
        fontSize={20}
        font="serif"
        textAlign="top-left"
      />
      <Input
        onChange={(value) => {
          setStageImage(value)
        }}
        fontSize={20}
        placeholder={'Paste image url here'}
        placeholderColor={Color4.Black()}
        uiTransform={{
          width: '400px',
          height: '80px',
        }}
      ></Input>
      <Button
        value="Apply"
        uiTransform={{
          width: '100px',
          height: '50px',
        }}
        fontSize={20}
        onMouseDown={() => {
          let bannerNames = ['BannerLogo', 'BannerLogo_2']
          for (let bannerName of bannerNames) {
            let stageEntity = engine.getEntityOrNullByName(bannerName)
            if (stageEntity !== null) {
              let texture = Material.Texture.Common({
                src: stageImage,
              })
              Material.setBasicMaterial(stageEntity, {
                texture: texture,
              })
            }
          }
        }}
      ></Button>
    </UiEntity>
    <Button
        value="Finish"
        uiTransform={{
          width: '100px',
          height: '50px',
          positionType: 'absolute',
          position: {
            right: '15%',
            top: '70%',
          },
        }}
        fontSize={20}
        onMouseDown={() => {
          ReactEcsRenderer.setUiRenderer(() => null)
        }}
      ></Button>
  </UiEntity>
}

function toggleCustomizationCamera() {
  const auditoriumCamera = engine.getEntityOrNullByName('AuditoriumCamera')
  if (auditoriumCamera === null) return

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