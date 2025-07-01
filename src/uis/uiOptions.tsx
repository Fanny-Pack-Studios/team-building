import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

import { getScaleFactor } from '../canvas/Canvas'
import { Color4 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'

export class OptionsUI {
  public optionsUiVisibility: boolean = false
  public pollQuestion = 'Membrillo o batata'
  private options: string[] = []
  private onOption: ((option: string) => void) | null = null
  private hoveredIndex: number | null = null
  private selectedIndex: number | null = null

  public gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  openUI(question: string, options: string[], onOption: (option: string) => void): void {
    this.optionsUiVisibility = true
    this.pollQuestion = question
    this.options = options
    this.onOption = onOption
  }

  createUi(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
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

          {this.options.map((option, index) => {
            const isHovered = this.hoveredIndex === index
            const isSelected = this.selectedIndex === index

            const bgColor = isSelected || isHovered ? Color4.White() : Color4.fromHexString('#3F3B45')

            return (
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
                  },
                  color: bgColor
                }}
                onMouseEnter={() => {
                  if (this.selectedIndex !== index) this.hoveredIndex = index
                }}
                onMouseLeave={() => {
                  if (this.selectedIndex !== index) this.hoveredIndex = null
                }}
                onMouseDown={() => {
                  this.selectedIndex = index
                  this.hoveredIndex = index
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
            )
          })}

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
            onMouseDown={() => {
              if (this.selectedIndex !== null && this.onOption != null) {
                const selectedOption = this.options[this.selectedIndex]
                this.onOption(selectedOption)
                this.optionsUiVisibility = false
              }
            }}
          ></UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
