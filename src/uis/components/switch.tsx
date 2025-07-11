import ReactEcs, { type EntityPropTypes, UiEntity } from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'

export function Switch(
  props: {
    initialValue?: boolean
    onChange?: (newValue: boolean) => void
  } & EntityPropTypes
): ReactEcs.JSX.Element {
  const { initialValue, onChange, ...rest } = props
  const [isChecked, setChecked] = ReactEcs.useState(props.initialValue ?? false)
  const texture = isChecked ? 'images/createpollui/switchOn.png' : 'images/createpollui/switchOff.png'
  const finalProps = merge(
    {
      uiTransform: {
        flexDirection: 'row',
        width: '5vw',
        height: '3vw',
        margin: { bottom: -15 }
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: { src: texture }
      },
      onMouseDown: () => {
        const newValue = !isChecked
        setChecked(newValue)
        if (onChange !== undefined) onChange(newValue)
      }
    } satisfies EntityPropTypes,
    rest
  )

  return <UiEntity {...finalProps}></UiEntity>
}
