import { Color4, Color3 } from '@dcl/sdk/math'
import type { UiTransformProps, UiBackgroundProps, UiFontType } from '@dcl/sdk/react-ecs'

export const accentColor: Color4 = Color4.fromColor3(Color3.fromInts(225, 65, 75))

export type UiTheme = {
  uiTransform: UiTransformProps
  uiBackground: UiBackgroundProps
  fontColor: Color4
  disabledFontColor: Color4
  buttonFontSize: number
  fontSize: number
  titleFontSize: number
  font: UiFontType
  primaryButtonTransform: UiTransformProps
  primaryButtonBackground: UiBackgroundProps
  primaryButtonDisabledBackground: UiBackgroundProps
}

export const primaryTheme: UiTheme = {
  fontColor: Color4.White(),
  disabledFontColor: Color4.multiply(Color4.White(), Color4.Gray()),
  buttonFontSize: 20,
  fontSize: 20,
  titleFontSize: 30,
  font: 'sans-serif',
  primaryButtonTransform: {
    padding: '1%',
    height: 'auto',
    borderRadius: 4.5
  },
  primaryButtonBackground: {
    color: accentColor
  },
  primaryButtonDisabledBackground: {
    color: Color4.multiply(accentColor, Color4.Gray())
  },
  uiTransform: {
    padding: {
      top: '2vh',
      bottom: '2vh',
      left: '2vw',
      right: '2vw'
    }
  },
  uiBackground: {
    textureMode: 'nine-slices',
    texture: { src: 'images/ui/background.png' },
    textureSlices: {
      top: 0.1,
      bottom: 0.1,
      left: 0.1,
      right: 0.1
    }
  }
}

const primaryButtonColor = Color4.fromColor3(Color3.fromHexString('#393541'))

export const mainTheme: UiTheme = {
  fontColor: Color4.White(),
  disabledFontColor: Color4.multiply(Color4.White(), Color4.Gray()),
  buttonFontSize: 30,
  fontSize: 30,
  titleFontSize: 50,
  font: 'sans-serif',
  primaryButtonTransform: {
    padding: '1%',
    height: 'auto',
    borderRadius: 4.5
  },
  primaryButtonBackground: {
    color: primaryButtonColor
  },
  primaryButtonDisabledBackground: {
    color: Color4.multiply(primaryButtonColor, Color4.Gray())
  },
  uiTransform: {
    padding: {
      top: '2vh',
      bottom: '2vh',
      left: '2vw',
      right: '2vw'
    }
  },
  uiBackground: {
    textureMode: 'nine-slices',
    texture: { src: 'images/mainmenu/background.png' },
    textureSlices: {
      top: 0.1,
      bottom: 0.1,
      left: 0.1,
      right: 0.1
    }
  }
}
