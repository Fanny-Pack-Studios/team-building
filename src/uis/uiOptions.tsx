import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

import { getScaleFactor } from '../canvas/Canvas'
import { type UIController } from '../controllers/ui.controller'
import { Color4 } from '@dcl/sdk/math'

export class OptionsUI {
  public optionsUiVisibility: boolean = false
  public uiController: UIController
  public pollQuestion = 'Membrillo o batata'
  private options: string[] = []
  private onOption: ((option: string) => void) | null = null

  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  openUI(question: string, options: string[], onOption: (option: string) => void): void {
    this.optionsUiVisibility = true
    this.pollQuestion = question
    this.options = options
    this.onOption = onOption
  }

  createUi(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.uiController.canvasInfo.width,
          height: this.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.optionsUiVisibility ? 'flex' : 'none',
          borderRadius: 50
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            positionType: 'absolute',
            width: 342 * getScaleFactor(),
            height: 472 * getScaleFactor()
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: 'images/optionsui/background.png'
            }
          }}
        >
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              position: { top: '5%' }
            }}
            value={this.pollQuestion}
            fontSize={18 * getScaleFactor()}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: 22 * getScaleFactor(),
              height: 22 * getScaleFactor(),
              position: { top: '3%', right: '8%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/activitiesui/exit.png' }
            }}
            onMouseDown={() => {
              this.optionsUiVisibility = false
            }}
          ></UiEntity>

          {this.options.map((option, index) => (
            <UiEntity
              key={index}
              uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                positionType: 'relative',
                width: 136 * getScaleFactor(),
                height: 56 * getScaleFactor(),
                margin: { top: index === 0 ? '20%' : '0%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: {
                  src: `images/optionsui/option${index + 1}Background.png`
                }
              }}
              onMouseDown={() => {
                if (this.onOption != null) {
                  this.onOption(option)
                  this.optionsUiVisibility = false
                }
              }}
            >
              <Label
                uiTransform={{
                  margin: { bottom: '10%' },
                  alignContent: 'center',
                  positionType: 'relative'
                }}
                value={`<b>${option}</b>`}
                fontSize={12 * getScaleFactor()}
                font="sans-serif"
                color={Color4.White()}
                textAlign="middle-center"
              />
            </UiEntity>
          ))}

          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'relative',
              width: 78 * getScaleFactor(),
              height: 42 * getScaleFactor(),
              margin: { top: '10%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/optionsui/next.png' }
            }}
          ></UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
