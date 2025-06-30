import ReactEcs, { UiEntity, Label } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'

export class ResultsUI {
  public resultsUiVisibility: boolean = false
  private pollQuestion: string = ''
  private results: Array<{ option: string; percentage: number }> = []
  private isAnonymous: boolean = true
  private votes: Array<{ option: string; userId: string }> = []
  public gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  setData(data: {
    question: string
    anonymous: boolean
    results: Array<{ option: string; percentage: number }>
    votes?: Array<{ option: string; userId: string }>
  }): void {
    this.pollQuestion = data.question
    this.results = data.results
    this.isAnonymous = data.anonymous
    console.log('is anonymous?', this.isAnonymous)
    this.votes = data.votes ?? []
    this.resultsUiVisibility = true
  }

  openUI(): void {
    this.resultsUiVisibility = true
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                positionType: 'relative',
                width: 236 * getScaleFactor(),
                height: 40 * getScaleFactor(),
                margin: { top: index === 0 ? '15%' : '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/resultsui/results1.png' }
              }}
            >
              <Label
                uiTransform={{
                  position: { left: '0%' },
                  alignContent: 'flex-start',
                  positionType: 'relative'
                }}
                value={`<b>${result.option}</b>`}
                fontSize={12 * getScaleFactor()}
                font="sans-serif"
                color={Color4.White()}
                textAlign="middle-center"
              />
              <Label
                uiTransform={{
                  position: { right: '0%' },
                  alignContent: 'flex-end',
                  positionType: 'relative'
                }}
                value={`${result.percentage}%`}
                fontSize={12 * getScaleFactor()}
                font="sans-serif"
                color={Color4.White()}
                textAlign="middle-center"
              />
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
}
