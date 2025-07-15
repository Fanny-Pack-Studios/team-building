import ReactEcs, {
  type EntityPropTypes,
  type UiBackgroundProps,
  UiEntity,
  type UiTransformProps
} from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'

function CloseButton(props: { onClosePressed: () => void }): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        positionType: 'absolute',
        width: '2vw',
        height: '2vw',
        position: { top: '3%', right: '4.5%' }
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: { src: 'images/ui/exit.png' }
      }}
      onMouseDown={() => {
        props.onClosePressed()
      }}
    ></UiEntity>
  )
}

export function ModalWindow(
  props: EntityPropTypes & { visible: boolean; onClosePressed?: () => void; children?: ReactEcs.JSX.Element }
): ReactEcs.JSX.Element {
  const { visible, children, onClosePressed, ...rest } = props
  const closeable = onClosePressed !== undefined
  const windowProps: EntityPropTypes = merge(
    {
      uiTransform: {
        flexDirection: 'column',
        width: '30%',
        height: '65%',
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
      <UiEntity {...windowProps}>
        {closeable && <CloseButton onClosePressed={onClosePressed} />}
        {props.children}
      </UiEntity>
    </UiEntity>
  )
}
