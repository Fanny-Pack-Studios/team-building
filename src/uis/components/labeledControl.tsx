import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type UiLabelProps, type UiTransformProps, UiEntity, Label } from '@dcl/sdk/react-ecs'

export const LabeledControl = (props: {
  labelProps?: UiLabelProps
  uiTransform?: UiTransformProps
  children?: ReactEcs.JSX.Element
}): ReactEcs.JSX.Element => {
  return (
    <UiEntity uiTransform={{ display: 'flex', flexDirection: 'row', ...props.uiTransform }}>
      <Label
        value={props.labelProps?.value ?? ''}
        color={Color4.Black()}
        fontSize={20}
        uiTransform={{ width: '7.5vw', height: '100%' }}
        {...props.labelProps}
      />
      {props.children}
    </UiEntity>
  )
}
