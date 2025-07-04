import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'

export class ZonePollQuestionUI {
  public visible: boolean = false
  public questionText: string = ''
  public gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  public show(question: string): void {
    this.questionText = question
    this.visible = true
  }

  public hide(): void {
    this.visible = false
    this.questionText = ''
  }

  public createUi(): ReactEcs.JSX.Element | null {
    if (!this.visible) return null

    return (
      <UiEntity
        uiTransform={{
          width: 600 * getScaleFactor(),
          height: 100 * getScaleFactor(),
          positionType: 'absolute',
          position: { bottom: 30, left: '50%' },
          margin: { left: -300 * getScaleFactor() }, // centrar horizontalmente
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        uiBackground={{
          color: Color4.fromInts(0, 0, 0, 180) // fondo negro con opacidad
        }}
      >
        <Label value={this.questionText} fontSize={24 * getScaleFactor()} color={Color4.White()} />
      </UiEntity>
    )
  }
}
