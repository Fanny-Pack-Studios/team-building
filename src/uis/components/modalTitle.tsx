import { Color4 } from '@dcl/sdk/math'
import type ReactEcs from '@dcl/sdk/react-ecs'
import { type EntityPropTypes, Label, type UiLabelProps } from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'

export function ModalTitle(props: UiLabelProps & EntityPropTypes): ReactEcs.JSX.Element {
  const finalProps = merge(
    {
      uiTransform: {
        width: '100%',
        height: '3vw',
        justifyContent: 'center'
      },
      font: 'sans-serif',
      color: Color4.White(),
      fontSize: '2vw',
      textAlign: 'middle-center'
    },
    props
  ) as UiLabelProps & EntityPropTypes
  return Label(finalProps)
}
