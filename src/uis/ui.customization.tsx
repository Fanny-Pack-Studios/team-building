import { engine, MainCamera, Transform, VirtualCamera } from '@dcl/sdk/ecs'
import { Color4, Vector3, Color3 } from '@dcl/sdk/math'
import ReactEcs, { Button, type EntityPropTypes, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getMutableCustomizationState } from '../auditorium/customization'
import { LabeledControl } from './components/labeledControl'
import { ValidatedInput } from './components/validatedInput'
import { primaryTheme } from './themes/themes'

export class CustomizationUI {
  public _isVisible: boolean = false
  public get isVisible(): boolean {
    return this._isVisible
  }

  public set isVisible(value: boolean) {
    this._isVisible = value
    toggleCustomizationCamera(value)
  }

  create(): ReactEcs.JSX.Element {
    return (
      <AuditoriumCustomizationElement
        isVisible={this.isVisible}
        onClose={() => {
          this.isVisible = false
        }}
      />
    )
  }
}

export function AuditoriumCustomizationElement(props: {
  isVisible: boolean
  onClose: () => void
}): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: '30%',
        height: '50%',
        positionType: 'absolute',
        position: { top: '10%', left: '60%' },
        display: props.isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
      }}
    >
      <ImageUrlInput
        onApply={(imageUrl) => {
          getMutableCustomizationState().textureSrc = imageUrl
        }}
      />
      <ColorPicker
        onColorSelect={(color) => {
          getMutableCustomizationState().accentColor = Color4.fromColor3(color)
        }}
      />
      <Button
        value="Finish"
        uiTransform={{
          ...primaryTheme.primaryButtonTransform,
          width: `auto`,
          padding: '3%',
          height: `${primaryTheme.fontSize * 3.0}px`,
          margin: { right: '5%' }
        }}
        fontSize={primaryTheme.fontSize}
        uiBackground={primaryTheme.primaryButtonBackground}
        onMouseDown={props.onClose}
      ></Button>
    </UiEntity>
  )
}

const ColorPicker = (props: EntityPropTypes & { onColorSelect?: (color: Color3) => void }): ReactEcs.JSX.Element => {
  const [selectedColor, setSelectedColor] = ReactEcs.useState<Color3>(Color3.Red())

  const colors = [
    Color4.Red(),
    Color4.Yellow(),
    Color4.Green(),
    Color4.Blue(),
    Color4.Magenta(),
    Color4.Teal(),
    Color4.White(),
    Color4.Black()
  ]

  return (
    <UiEntity
      uiTransform={{
        width: '25vw',
        height: '30.5vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...primaryTheme.uiTransform,
        padding: {
          top: '2vh',
          bottom: '5vh'
        }
      }}
      uiBackground={primaryTheme.uiBackground}
    >
      <UiEntity uiTransform={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Label
          value="Accent Color"
          color={primaryTheme.fontColor}
          fontSize={primaryTheme.fontSize}
          uiTransform={{ width: 'auto', height: 'auto' }}
        />
      </UiEntity>
      <UiEntity uiTransform={{ display: 'flex', flexDirection: 'row' }}>
        <UiEntity
          uiTransform={{
            width: '17.5vw',
            height: '100%',
            display: 'flex',
            padding: { bottom: '1vh' },
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}
        >
          {colors.map((color, index) => {
            const isSameColor =
              selectedColor.r === color.r && selectedColor.g === color.g && selectedColor.b === color.b

            return (
              <Button
                key={`color-${index}`}
                value=""
                uiTransform={{
                  width: '2vw',
                  height: '2vw',
                  margin: '0.2vw',
                  borderRadius: 5,
                  borderWidth: isSameColor ? 3 : 1,
                  borderColor: isSameColor ? Color4.Black() : Color4.White()
                }}
                uiBackground={{ color }}
                onMouseDown={() => {
                  setSelectedColor(color)
                  if (props.onColorSelect !== undefined) props.onColorSelect(color)
                }}
              />
            )
          })}
        </UiEntity>
      </UiEntity>
      <LabeledControl
        uiTransform={{ width: '100%', height: 'auto', padding: { top: '1%', bottom: '1%' } }}
        labelProps={{ value: 'Hex', fontSize: primaryTheme.fontSize, color: primaryTheme.fontColor }}
      >
        <ValidatedInput
          maxLength={7}
          uiTransform={{ width: '10vw' }}
          onChange={(value) => {
            let inputHex = value.toUpperCase()
            if (!inputHex.startsWith('#')) {
              inputHex = `#${inputHex}`
            }
            const newColor = Color3.fromHexString(inputHex)
            if (Color3.toHexString(newColor) === inputHex) {
              setSelectedColor(newColor)
              if (props.onColorSelect !== undefined) props.onColorSelect(newColor)
            }
          }}
          value={Color3.toHexString(selectedColor)}
          fontSize={primaryTheme.fontSize / 1.15}
          color={primaryTheme.fontColor}
        ></ValidatedInput>
        <UiEntity
          uiTransform={{ position: { left: '5%' }, width: '10%', height: '100%', borderRadius: 5 }}
          uiBackground={{ color: Color4.fromColor3(selectedColor) }}
        ></UiEntity>
      </LabeledControl>
      <LabeledControl
        uiTransform={{ width: '100%', height: 'auto' }}
        labelProps={{ value: 'Red', fontSize: primaryTheme.fontSize, color: primaryTheme.fontColor }}
      >
        <ValidatedInput
          uiTransform={{ width: '5vw' }}
          regex={/^[0-9]+$/}
          maxLength={3}
          defaultValue="0"
          onChange={(value) => {
            const newColor = Color3.fromInts(
              parseInt(value),
              Math.round(255 * selectedColor.g),
              Math.round(255 * selectedColor.b)
            )
            setSelectedColor(newColor)
            if (props.onColorSelect !== undefined) props.onColorSelect(newColor)
          }}
          value={Math.round(255 * selectedColor.r).toString()}
          fontSize={primaryTheme.fontSize / 1.15}
          color={primaryTheme.fontColor}
        ></ValidatedInput>
      </LabeledControl>
      <LabeledControl
        uiTransform={{ width: '100%', height: 'auto' }}
        labelProps={{ value: 'Green', fontSize: primaryTheme.fontSize, color: primaryTheme.fontColor }}
      >
        <ValidatedInput
          uiTransform={{ width: '5vw' }}
          regex={/^[0-9]+$/}
          maxLength={3}
          defaultValue="0"
          onChange={(value) => {
            const newColor = Color3.fromInts(
              Math.round(255 * selectedColor.r),
              parseInt(value),
              Math.round(255 * selectedColor.b)
            )
            setSelectedColor(newColor)
            if (props.onColorSelect !== undefined) props.onColorSelect(newColor)
          }}
          value={Math.round(255 * selectedColor.g).toString()}
          fontSize={primaryTheme.fontSize / 1.15}
          color={primaryTheme.fontColor}
        ></ValidatedInput>
      </LabeledControl>
      <LabeledControl
        uiTransform={{ width: '100%', height: 'auto' }}
        labelProps={{ value: 'Blue', fontSize: primaryTheme.fontSize, color: primaryTheme.fontColor }}
      >
        <ValidatedInput
          uiTransform={{ width: '5vw' }}
          regex={/^[0-9]+$/}
          maxLength={3}
          defaultValue="0"
          onChange={(value) => {
            const newColor = Color3.fromInts(
              Math.round(255 * selectedColor.r),
              Math.round(255 * selectedColor.g),
              parseInt(value)
            )
            setSelectedColor(newColor)
            if (props.onColorSelect !== undefined) props.onColorSelect(newColor)
          }}
          value={Math.round(255 * selectedColor.b).toString()}
          fontSize={primaryTheme.fontSize / 1.15}
          color={primaryTheme.fontColor}
        ></ValidatedInput>
      </LabeledControl>
    </UiEntity>
  )
}

export const ImageUrlInput = (
  props: EntityPropTypes & { onApply?: (imageUrl: string) => void }
): ReactEcs.JSX.Element => {
  const [imageUrl, setImageUrl] = ReactEcs.useState('')
  const fontSize = 20

  return (
    <UiEntity
      uiTransform={{
        width: '25vw',
        height: '15vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...primaryTheme.uiTransform
      }}
      uiBackground={primaryTheme.uiBackground}
      {...props}
    >
      <Label
        value="Logo"
        color={primaryTheme.fontColor}
        fontSize={fontSize}
        uiTransform={{ width: '7.5vw', height: '100%' }}
      />
      <Input
        onChange={(value) => {
          setImageUrl(value)
        }}
        fontSize={fontSize / 1.15}
        placeholder={'Paste image url here'}
        color={primaryTheme.fontColor}
        uiTransform={{ width: '100%', height: '50%' }}
      ></Input>
      <Button
        value="Apply"
        uiTransform={{
          width: '10vw',
          height: '50%',
          borderRadius: { topRight: '10px', bottomRight: '10px' }
        }}
        fontSize={fontSize}
        uiBackground={primaryTheme.primaryButtonBackground}
        onMouseDown={() => {
          if (props.onApply !== undefined) props.onApply(imageUrl)
        }}
      ></Button>
    </UiEntity>
  )
}

function toggleCustomizationCamera(on: boolean): void {
  const auditoriumCamera = engine.getEntityOrNullByName('AuditoriumCamera')
  if (auditoriumCamera === null) return

  const lookAtEntity = engine.getEntityOrNullByName('Podium')
  if (lookAtEntity === null) return

  VirtualCamera.createOrReplace(auditoriumCamera, {
    defaultTransition: { transitionMode: VirtualCamera.Transition.Time(1.5) },
    lookAtEntity
  })

  Transform.getMutable(auditoriumCamera).position = Vector3.create(0, 10, 0)

  MainCamera.createOrReplace(engine.CameraEntity, {
    virtualCameraEntity: on ? auditoriumCamera : undefined
  })
}
