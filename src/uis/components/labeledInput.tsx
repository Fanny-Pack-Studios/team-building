import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type EntityPropTypes, Input, type UiInputProps, type UiLabelProps } from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'
import { VerticalLabeledControl } from './labeledControl'

export function LabeledInput(props: {
  containerProps?: EntityPropTypes
  inputProps?: Partial<UiInputProps> & EntityPropTypes
  labelProps: UiLabelProps & EntityPropTypes
}): ReactEcs.JSX.Element {
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
    <VerticalLabeledControl containerProps={props.containerProps} labelProps={props.labelProps}>
      <Input {...inputProps} />
    </VerticalLabeledControl>
  )
}
