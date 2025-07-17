import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'

export const zoneColors = [
  Color4.fromHexString('#FF4C4C'),
  Color4.fromHexString('#4CFF4C'),
  Color4.fromHexString('#FFD700'),
  Color4.fromHexString('#4C4CFF')
]

export class ZonePollQuestionUI {
  public visible: boolean = false
  public questionText: string = ''
  public options: string[] = []
  public gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  public show(question: string, options: string[]): void {
    this.questionText = question
    this.options = options
    this.visible = true
  }

  public hide(): void {
    this.visible = false
    this.questionText = ''
    this.options = []
  }

  public createUi(): ReactEcs.JSX.Element | null {
    if (!this.visible) return null

    const scale = getScaleFactor()

    return (
      <UiEntity
        uiTransform={{
          width: 600 * scale,
          height: (100 + this.options.length * 40) * scale,
          positionType: 'absolute',
          position: { bottom: 30, left: '50%' },
          margin: { left: -300 * scale },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
        uiBackground={{ color: Color4.fromInts(0, 0, 0, 180) }}
      >
        <Label
          value={this.questionText}
          fontSize={24 * scale}
          color={Color4.White()}
          uiTransform={{
            margin: { bottom: 10 * scale }
          }}
        />

        {this.options.map((option, index) => {
          const color = zoneColors[index] ?? Color4.White()
          return (
            <UiEntity
              key={`option-${index}`}
              uiTransform={{
                width: 500 * scale,
                height: 30 * scale,
                margin: { top: 4 * scale },
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <UiEntity
                uiTransform={{
                  width: 20 * scale,
                  height: 20 * scale,
                  margin: { right: 10 * scale }
                }}
                uiBackground={{ color }}
              />
              <Label value={option} fontSize={18 * scale} color={Color4.White()} />
            </UiEntity>
          )
        })}
      </UiEntity>
    )
  }
}
