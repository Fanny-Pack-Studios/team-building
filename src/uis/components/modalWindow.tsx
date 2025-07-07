import ReactEcs, {
  type EntityPropTypes,
  type UiBackgroundProps,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'

export function ModalWindow(
  props: EntityPropTypes & { visible: boolean; children?: ReactEcs.JSX.Element }
): ReactEcs.JSX.Element {
  const { visible, children, ...rest } = props
  const windowProps: EntityPropTypes = merge(
    {
      uiTransform: {
        flexDirection: 'column',
        width: '30vw',
        height: '40vw',
        padding: '2.5vw 4vw'
      } satisfies UiTransformProps,
      uiBackground: {
        texture: {
          src: 'images/createpollui/background.png'
        },
        textureMode: 'nine-slices',
        textureSlices: {
          bottom: 0.3,
          left: 0.3,
          right: 0.3,
          top: 0.3
        }
      } satisfies UiBackgroundProps
    },
    rest
  )

  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: props.visible ? 'flex' : 'none'
      }}
    >
      <UiEntity {...windowProps}>{props.children}</UiEntity>
    </UiEntity>
  )
}
