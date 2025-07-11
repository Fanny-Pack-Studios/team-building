import ReactEcs, { Button, Label, type UiButtonProps, UiEntity } from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'
import { primaryTheme } from '../themes/themes'

function RoundButton(props: UiButtonProps & { isDisabled?: boolean }): ReactEcs.JSX.Element {
  const finalProps = merge(
    {
      fontSize: '1.5vw',
      uiTransform: {
        width: '3vw',
        height: '3vw',
        borderRadius: 100
      },
      uiBackground:
        (props.isDisabled ?? false)
          ? primaryTheme.primaryButtonDisabledBackground
          : primaryTheme.primaryButtonBackground,
      textAlign: 'middle-center'
    } satisfies Partial<UiButtonProps>,
    props
  )
  return <Button {...finalProps}></Button>
}

export function NumberPicker(props: {
  min: number
  max: number
  initialValue: number
  onChange?: (num: number) => void
}): ReactEcs.JSX.Element {
  const [currentValue, setCurrentValue] = ReactEcs.useState(props.initialValue)
  const updateValue = (newValue: number): void => {
    setCurrentValue(newValue)
    if (props.onChange !== undefined) props.onChange(newValue)
  }

  return (
    <UiEntity uiTransform={{ flexDirection: 'row', width: 'auto', height: 'auto', justifyContent: 'center' }}>
      <RoundButton
        value="<b>-</b>"
        onMouseDown={() => {
          updateValue(Math.max(currentValue - 1, props.min))
        }}
        isDisabled={currentValue <= props.min}
      />
      <Label value={currentValue.toString()} fontSize="1.5vw" uiTransform={{ height: '3vw', width: '3vw' }}></Label>
      <RoundButton
        value="<b>+</b>"
        onMouseDown={() => {
          updateValue(Math.min(currentValue + 1, props.max))
        }}
        isDisabled={currentValue >= props.max}
      />
    </UiEntity>
  )
}
