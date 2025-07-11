import { engine, MainCamera, Transform, VirtualCamera } from '@dcl/sdk/ecs'
import { Color4, Vector3, Color3 } from '@dcl/sdk/math'
import ReactEcs, { Button, type EntityPropTypes, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Customization } from '../auditorium/customization'
import { ValidatedInput } from './components/validatedInput'
import { primaryTheme } from './themes/themes'
import { Column, Row } from './components/flexOrganizers'
import { HorizontalLabeledControl } from './components/labeledControl'
import { getScaleFactor } from '../canvas/Canvas'

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

const theme = primaryTheme

export function AuditoriumCustomizationElement(props: {
  isVisible: boolean
  onClose: () => void
}): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: 400 * getScaleFactor(),
        height: 600 * getScaleFactor(),
        positionType: 'absolute',
        position: { top: 50 * getScaleFactor(), right: 150 * getScaleFactor() },
        display: props.isVisible ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}
      uiBackground={theme.uiBackground}
    >
      <ColorPicker
        uiTransform={{ height: '60%' }}
        onColorSelect={(color) => {
          Customization.setCustomizationAccentColor(color)
        }}
      />
      <ImageUrlInput
        uiTransform={{ height: '10%', width: '90%' }}
        onApply={(imageUrl) => {
          Customization.setCustomizationTexture(imageUrl)
        }}
      />
      <Row
        uiTransform={{
          height: 100 * getScaleFactor(),
          justifyContent: 'space-around',
          width: '70%',
          alignSelf: 'center',
          padding: { bottom: '5%' }
        }}
      >
        <Button
          value="Reset to Default"
          uiTransform={{
            ...theme.primaryButtonTransform,
            alignSelf: 'flex-start'
          }}
          fontSize={theme.buttonFontSize}
          uiBackground={theme.primaryButtonBackground}
          onMouseDown={() => {
            Customization.revertToDefault()
          }}
        ></Button>
        <Button
          value="Finish"
          uiTransform={{
            ...theme.primaryButtonTransform,
            alignSelf: 'flex-start'
          }}
          fontSize={theme.buttonFontSize}
          uiBackground={theme.primaryButtonBackground}
          onMouseDown={props.onClose}
        ></Button>
      </Row>
    </UiEntity>
  )
}

const ColorPicker = (props: EntityPropTypes & { onColorSelect?: (color: Color3) => void }): ReactEcs.JSX.Element => {
  const [selectedColor, setSelectedColor] = ReactEcs.useState<Color3>(Color3.Red())
  const { uiTransform, ...rest } = props
  ReactEcs.useEffect(() => {
    Customization.onChange((component) => {
      if (component?.accentColor !== undefined) {
        setSelectedColor(component.accentColor)
      }
    })
  }, [])

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
    <Column
      uiTransform={{
        justifyContent: 'space-around',
        ...theme.uiTransform,
        ...uiTransform
      }}
      {...rest}
    >
      <Row uiTransform={{ height: '30%' }}>
        <Label
          value="Accent Color"
          color={theme.fontColor}
          fontSize={theme.fontSize}
          uiTransform={{ width: 'auto', alignSelf: 'flex-start' }}
        />
        <UiEntity
          uiTransform={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start'
          }}
        >
          <Column uiTransform={{ height: 'auto' }}>
            <Row>
              {colors.slice(0, 4).map((color, index) => {
                return (
                  <ColorButton
                    key={`color-${index}`}
                    color={color}
                    selectedColor={selectedColor}
                    onMouseDown={() => {
                      setSelectedColor(color)
                      if (props.onColorSelect !== undefined) props.onColorSelect(color)
                    }}
                  />
                )
              })}
            </Row>
            <Row>
              {colors.slice(4).map((color, index) => {
                return (
                  <ColorButton
                    key={`color-${index + 4}`}
                    color={color}
                    selectedColor={selectedColor}
                    onMouseDown={() => {
                      setSelectedColor(color)
                      if (props.onColorSelect !== undefined) props.onColorSelect(color)
                    }}
                  />
                )
              })}
            </Row>
          </Column>
        </UiEntity>
      </Row>

      <Column uiTransform={{ justifyContent: 'space-between', alignItems: 'center', height: '60%' }}>
        <HorizontalLabeledControl
          uiTransform={{ width: '100%', height: 150 * getScaleFactor() }}
          labelProps={{ value: 'Hex', fontSize: theme.fontSize, color: theme.fontColor }}
        >
          <Row
            uiTransform={{ width: '45%', justifyContent: 'space-between' }}
            uiBackground={theme.secondaryBackgrounds[0]}
          >
            <ValidatedInput
              maxLength={7}
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
              fontSize={theme.fontSize}
              color={theme.fontColor}
            ></ValidatedInput>
            <UiEntity
              uiTransform={{
                alignSelf: 'center',
                width: '25%',
                height: '80%',
                margin: { right: '5%' },
                borderRadius: 5
              }}
              uiBackground={{ color: Color4.fromColor3(selectedColor) }}
            ></UiEntity>
          </Row>
        </HorizontalLabeledControl>
        <HorizontalLabeledControl
          uiTransform={{ width: '100%', height: 150 * getScaleFactor() }}
          labelProps={{ value: 'Red', fontSize: theme.fontSize, color: theme.fontColor }}
        >
          <ValidatedInput
            uiTransform={{ width: '45%' }}
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
            fontSize={theme.fontSize}
            color={theme.fontColor}
            uiBackground={theme.secondaryBackgrounds[1]}
          ></ValidatedInput>
        </HorizontalLabeledControl>
        <HorizontalLabeledControl
          uiTransform={{ width: '100%', height: 150 * getScaleFactor() }}
          labelProps={{ value: 'Green', fontSize: theme.fontSize, color: theme.fontColor }}
        >
          <ValidatedInput
            uiTransform={{ width: '45%' }}
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
            fontSize={theme.fontSize}
            color={theme.fontColor}
            uiBackground={theme.secondaryBackgrounds[2]}
          ></ValidatedInput>
        </HorizontalLabeledControl>
        <HorizontalLabeledControl
          uiTransform={{ width: '100%', height: 150 * getScaleFactor() }}
          labelProps={{ value: 'Blue', fontSize: theme.fontSize, color: theme.fontColor }}
        >
          <ValidatedInput
            uiTransform={{ width: '45%' }}
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
            fontSize={theme.fontSize / 1.15}
            color={theme.fontColor}
            uiBackground={theme.secondaryBackgrounds[3]}
          ></ValidatedInput>
        </HorizontalLabeledControl>
      </Column>
    </Column>
  )
}

const ColorButton = (
  props: {
    color: Color4
    selectedColor: Color3
  } & EntityPropTypes
): ReactEcs.JSX.Element => {
  ReactEcs.useEffect(() => {}, [props.selectedColor])
  const { color, selectedColor, ...rest } = props
  const isSameColor = color.r === selectedColor.r && color.g === selectedColor.g && color.b === selectedColor.b

  return (
    <Button
      value=""
      uiTransform={{
        width: 30 * getScaleFactor(),
        height: 30 * getScaleFactor(),
        margin: 2 * getScaleFactor(),
        borderRadius: 5,
        borderWidth: isSameColor ? 3 : 1,
        borderColor: isSameColor ? Color4.fromHexString('#FEB45A') : Color4.Black()
      }}
      uiBackground={{ color }}
      {...rest}
    />
  )
}

export const ImageUrlInput = (
  props: EntityPropTypes & { onApply?: (imageUrl: string) => void }
): ReactEcs.JSX.Element => {
  const [imageUrl, setImageUrl] = ReactEcs.useState('')
  const { uiTransform, ...rest } = props

  ReactEcs.useEffect(() => {
    Customization.onChange((component) => {
      if (component?.textureSrc !== undefined) {
        setImageUrl(component.textureSrc)
      }
    })
  }, [])

  return (
    <Row
      uiTransform={{
        ...uiTransform
      }}
      {...rest}
    >
      <Label
        value="Logo"
        color={theme.fontColor}
        fontSize={theme.fontSize}
        uiTransform={{ width: 100 * getScaleFactor() }}
      />
      <Input
        uiTransform={{ width: '85%' }}
        onChange={(value) => {
          setImageUrl(value)
        }}
        value={imageUrl}
        fontSize={theme.fontSize / 1.15}
        placeholder={'Paste image url here'}
        color={theme.fontColor}
        placeholderColor={Color4.White()}
        uiBackground={theme.inputBackgroundColor}
      ></Input>
      <Button
        value="Apply"
        uiTransform={{
          width: '30%',
          borderRadius: { topRight: 20 * getScaleFactor(), bottomRight: 20 * getScaleFactor() },
          height: 'auto',
          padding: { left: '1%' }
        }}
        fontSize={theme.buttonFontSize}
        uiBackground={theme.primaryButtonBackground}
        onMouseDown={() => {
          if (props.onApply !== undefined) props.onApply(imageUrl)
        }}
      ></Button>
    </Row>
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
