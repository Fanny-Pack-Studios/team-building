import { Color4 } from '@dcl/sdk/math'
import ReactEcs, {
  type UiLabelProps,
  type UiTransformProps,
  UiEntity,
  Label,
  type EntityPropTypes
} from '@dcl/sdk/react-ecs'
import { primaryTheme } from '../themes/themes'
import { merge } from 'ts-deepmerge'

export const HorizontalLabeledControl = (props: {
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
export function VerticalLabeledControl(props: {
  containerProps?: EntityPropTypes
  labelProps: UiLabelProps & EntityPropTypes
  children?: ReactEcs.JSX.Element
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
      color: primaryTheme.fontColor,
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

  return (
    <UiEntity {...containerProps}>
      <Label {...labelProps} />
      {props.children}
    </UiEntity>
  )
}
