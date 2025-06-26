import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

import { getScaleFactor } from '../canvas/Canvas'
import { type UIController } from '../controllers/ui.controller'
import { Color4 } from '@dcl/sdk/math'

export class CreateOptionsUI {
  public optionsUiVisibility: boolean = false
  public uiController: UIController
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  openUI(): void {
    this.optionsUiVisibility = true
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
              this.optionsUiVisibility = false
            }}
          ></UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'relative',
              width: 136 * getScaleFactor(),
              height: 56 * getScaleFactor(),
              margin: { top: '20%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/optionsui/option1Background.png' }
            }}
          >
            <Label
              uiTransform={{
                margin: { bottom: '10%' },
                alignContent: 'center',
                positionType: 'relative'
              }}
              value={`<b>OPTION 1 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              justifyContent: 'center',
              positionType: 'relative',
              width: 136 * getScaleFactor(),
              height: 56 * getScaleFactor(),
              margin: { top: '0%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/optionsui/option2Background.png' }
            }}
          >
            <Label
              uiTransform={{
                margin: { bottom: '10%' },
                alignContent: 'center',
                positionType: 'relative'
              }}
              value={`<b>OPTION 2 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              justifyContent: 'center',
              positionType: 'relative',
              width: 136 * getScaleFactor(),
              height: 56 * getScaleFactor(),
              margin: { top: '0%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/optionsui/option3Background.png' }
            }}
          >
            <Label
              uiTransform={{
                margin: { bottom: '10%' },
                alignContent: 'center',
                positionType: 'relative'
              }}
              value={`<b>OPTION 3 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
              justifyContent: 'center',
              positionType: 'relative',
              width: 136 * getScaleFactor(),
              height: 56 * getScaleFactor(),
              margin: { top: '0%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/optionsui/option4Background.png' }
            }}
          >
            <Label
              uiTransform={{
                margin: { bottom: '10%' },
                alignContent: 'center',
                positionType: 'relative'
              }}
              value={`<b>OPTION 4 </b>`} // Agregar valor real de la Pregunta en UI anterior
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
          >
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
