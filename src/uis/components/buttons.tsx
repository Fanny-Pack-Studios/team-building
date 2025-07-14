import { type Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, type UiBackgroundProps, type UiButtonProps } from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'
import { getScaleFactor } from '../../canvas/Canvas'
import { primaryTheme } from '../themes/themes'

export enum ButtonStyle {
  PRIMARY,
  SECONDARY
}

function getFontColor(_buttonStyle: ButtonStyle, disabled: boolean): Color4 {
  return disabled ? primaryTheme.disabledFontColor : primaryTheme.fontColor
}

function getBackground(buttonStyle: ButtonStyle, disabled: boolean): UiBackgroundProps {
  return disabled ? primaryTheme.primaryButtonDisabledBackground : primaryTheme.primaryButtonBackground
}

export function ModalButton(props: {
  text: string
  onMouseDown: () => void
  style?: ButtonStyle
  isDisabled?: boolean
  buttonProps?: Partial<UiButtonProps>
}): ReactEcs.JSX.Element {
  const style = props.style ?? ButtonStyle.PRIMARY
  const disabled = props.isDisabled ?? false
  const onMouseDown = disabled ? () => {} : props.onMouseDown

  const finalButtonProps = {
    ...merge(
      {
        color: getFontColor(style, disabled),
        uiTransform: {
          width: 'auto',
          height: 'auto',
          padding: {
            bottom: 12 * getScaleFactor(),
            top: 12 * getScaleFactor(),
            left: 18 * getScaleFactor(),
            right: 18 * getScaleFactor()
          },
          borderRadius: 5 * getScaleFactor(),
          alignSelf: 'center',
          margin: 25 * getScaleFactor()
        },
        fontSize: primaryTheme.buttonFontSize,
        uiBackground: getBackground(style, disabled)
      } satisfies Partial<UiButtonProps>,
      props.buttonProps ?? {},
      { onMouseDown }
    ),
    value: `<b>${props.text}</b>`
  }

  return <Button {...finalButtonProps}></Button>
}
