import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

import { getScaleFactor } from '../canvas/Canvas'
import { type UIController } from '../controllers/ui.controller'
import { Color4 } from '@dcl/sdk/math'

export class ResultsUI {
  public resultsUiVisibility: boolean = false
  public uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  openUI(): void {
    this.resultsUiVisibility = true
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
            texture: {
              src: 'images/resultsui/background.png'
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
            value={`<b>PASTAFROLA: </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              this.resultsUiVisibility = false
            }}
          ></UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              positionType: 'relative',
              width: 236 * getScaleFactor(),
              height: 40 * getScaleFactor(),
              margin: { top: '15%' }
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
              value={`<b>OPTION 1 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              value={`10%`} // Agregar valor real de la Pregunta en UI anterior
              fontSize={12 * getScaleFactor()}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              positionType: 'relative',
              width: 236 * getScaleFactor(),
              height: 40 * getScaleFactor(),
              margin: { top: '10%' }
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
              value={`<b>OPTION 2 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              value={`10%`} // Agregar valor real de la Pregunta en UI anterior
              fontSize={12 * getScaleFactor()}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              positionType: 'relative',
              width: 236 * getScaleFactor(),
              height: 40 * getScaleFactor(),
              margin: { top: '10%' }
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
              value={`<b>OPTION 3 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              value={`10%`} // Agregar valor real de la Pregunta en UI anterior
              fontSize={12 * getScaleFactor()}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              positionType: 'relative',
              width: 236 * getScaleFactor(),
              height: 40 * getScaleFactor(),
              margin: { top: '10%' }
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
              value={`<b>OPTION 4 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              value={`10%`} // Agregar valor real de la Pregunta en UI anterior
              fontSize={12 * getScaleFactor()}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          </UiEntity>
          <Label
            uiTransform={{
              width: '100%',
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              position: { bottom: '0%' },
              margin: {top:'2%'}
            }}
            value={`This poll is anonymus, voter \n identities are hidden.`}
            fontSize={12 * getScaleFactor()}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />
        </UiEntity>
      </UiEntity>
    )
  }
}