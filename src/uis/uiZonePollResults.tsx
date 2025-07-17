import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'

export class ZonePollResultsUI {
  public visible = false
  private winnerOption: string = ''
  private question: string = ''
  public gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  show(question: string, winnerOption: string): void {
    this.question = question
    this.winnerOption = winnerOption
    this.visible = true
  }

  close(): void {
    this.visible = false
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
          display: this.visible ? 'flex' : 'none',
          borderRadius: 50
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            positionType: 'absolute',
            width: 342 * getScaleFactor(),
            height: 300 * getScaleFactor()
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: { src: 'images/resultsui/background.png' }
          }}
        >
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              position: { top: '5%' }
            }}
            value={`<b>${this.question}</b>`}
            fontSize={18 * getScaleFactor()}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />

          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 80 * getScaleFactor(),
              alignContent: 'center',
              margin: { top: '10%' }
            }}
            value={`🏆 <b>Winner:</b> ${this.winnerOption}`}
            fontSize={16 * getScaleFactor()}
            font="sans-serif"
            color={Color4.Yellow()}
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
              this.close()
            }}
          />
        </UiEntity>
      </UiEntity>
    )
  }
}
