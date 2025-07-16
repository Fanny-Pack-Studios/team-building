import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'
import { engine } from '@dcl/sdk/ecs'

export class ResultsUI {
  public resultsUiVisibility: boolean = false
  private pollQuestion: string = ''
  private results: Array<{ option: string; percentage: number }> = []
  private isAnonymous: boolean = true
  private votes: Array<{ option: string; userId?: string }> = []
  public gameController: GameController
  private animatedPercentages: number[] = []
  private isAnimating: boolean = false

  constructor(gameController: GameController) {
    this.gameController = gameController
    engine.addSystem((dt) => {
      this.update(dt)
    })
  }

  setData(data: {
    question: string
    anonymous: boolean
    results: Array<{ option: string; percentage: number }>
    votes: Array<{ option: string; userId?: string }>
  }): void {
    this.pollQuestion = data.question
    this.results = data.results
    this.isAnonymous = data.anonymous
    console.log('is anonymous?', this.isAnonymous)
    this.votes = data.votes
    this.resultsUiVisibility = true
  }

  openUI(): void {
    this.resultsUiVisibility = true
    this.animatedPercentages = this.results.map(() => 0)
    this.isAnimating = true
  }

  closeUI(): void {
    this.resultsUiVisibility = false
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
          display: this.resultsUiVisibility ? 'flex' : 'none',
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
            value={`<b>${this.pollQuestion}</b>`}
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
              this.closeUI()
            }}
          />

          {this.results.map((result, index) => (
            <UiEntity
              key={index}
              uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                positionType: 'relative',
                width: 236 * getScaleFactor(),
                height: 50 * getScaleFactor(),
                margin: { top: index === 0 ? '15%' : '10%' }
              }}
            >
              <UiEntity
                uiTransform={{
                  width: '100%',
                  height: 30 * getScaleFactor(),
                  positionType: 'relative',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  borderRadius: 5
                }}
                uiBackground={{
                  color: Color4.fromHexString('#444444FF')
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: `${this.animatedPercentages[index] ?? 0}%`,

                    height: '100%',
                    positionType: 'relative',
                    borderRadius: 5
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    texture: { src: 'images/resultsui/results1.png' }
                  }}
                />
              </UiEntity>

              <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  width: '100%',
                  height: 30 * getScaleFactor(),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 4
                }}
              >
                <Label
                  uiTransform={{
                    positionType: 'relative'
                  }}
                  value={`<b>${result.option}</b>`}
                  fontSize={12 * getScaleFactor()}
                  font="sans-serif"
                  color={Color4.White()}
                  textAlign="middle-left"
                />
                <Label
                  uiTransform={{
                    positionType: 'relative'
                  }}
                  value={`${result.percentage}%`}
                  fontSize={12 * getScaleFactor()}
                  font="sans-serif"
                  color={Color4.White()}
                  textAlign="middle-right"
                />
              </UiEntity>
            </UiEntity>
          ))}

          {this.isAnonymous && (
            <Label
              uiTransform={{
                width: '100%',
                height: 60 * getScaleFactor(),
                alignContent: 'center',
                position: { bottom: '0%' },
                margin: { top: '2%' }
              }}
              value={`This poll is anonymous, voter \n identities are hidden.`}
              fontSize={12 * getScaleFactor()}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          )}
        </UiEntity>
      </UiEntity>
    )
  }

  update(dt: number): void {
    if (!this.isAnimating) return

    let allDone = true

    const speed = 100

    for (let i = 0; i < this.results.length; i++) {
      const target = this.results[i].percentage
      let current = this.animatedPercentages[i]

      const diff = target - current
      const step = speed * dt

      if (Math.abs(diff) <= step) {
        current = target
      } else {
        current += Math.sign(diff) * step
        allDone = false
      }

      this.animatedPercentages[i] = current
    }

    if (allDone) {
      this.isAnimating = false
    }
  }
}
