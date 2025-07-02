import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type EntityPropTypes,
  Input,
  Label,
  UiEntity,
  type UiInputProps,
  type UiLabelProps
} from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'

export function LabeledInput(props: {
  containerProps?: EntityPropTypes
  inputProps?: Partial<UiInputProps> & EntityPropTypes
  labelProps: UiLabelProps & EntityPropTypes
}): ReactEcs.JSX.Element {
  const labelProps = merge(
    {
      uiTransform: {
        width: '100%',
        height: '2vh',
        margin: { bottom: '1vh' }
      },
      fontSize: '1.2vw',
      font: 'sans-serif',
      color: Color4.White(),
      textAlign: 'middle-left'
    } satisfies EntityPropTypes & Omit<UiLabelProps, 'value'>,
    props.labelProps
  )

  const containerProps = merge(
    {
      uiTransform: {
        flexDirection: 'column',
        width: 'auto',
        height: 'auto'
      }
    } satisfies EntityPropTypes,
    props.containerProps ?? {}
  )

  const inputProps = merge(
    {
      uiTransform: {
        width: '90%',
        height: 'auto'
      },

      fontSize: '1.3vw',
      placeholderColor: Color4.Gray(),
      textAlign: 'middle-left',
      uiBackground: {
        textureMode: 'stretch',
        texture: { src: 'images/createSurveyUi/input-background.png' }
      }
    } satisfies Partial<UiInputProps> & EntityPropTypes,
    props.inputProps ?? {}
  )

  return (
    <UiEntity {...containerProps}>
      <Label {...labelProps} />
      <Input {...inputProps} />
    </UiEntity>
  )
}
