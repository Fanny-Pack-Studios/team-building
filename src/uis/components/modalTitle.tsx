import { Color4 } from '@dcl/sdk/math'
import type ReactEcs from '@dcl/sdk/react-ecs'
import { Label, type UiLabelProps } from '@dcl/sdk/react-ecs'

export function ModalTitle(props: UiLabelProps): ReactEcs.JSX.Element {
  return Label({
    uiTransform: {
      width: '100%',
      height: '3vw'
    },
    font: 'sans-serif',
    color: Color4.White(),
    fontSize: '2vw',
    textAlign: 'middle-center',
    ...props
  })
}
