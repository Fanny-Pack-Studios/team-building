import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { engine, InputAction, inputSystem, PointerEventType } from '@dcl/sdk/ecs'

import { Color4 } from '@dcl/sdk/math'
import { getScaleFactor } from './canvas/Canvas'
import { type UIController } from './ui.controller'

const COLOR_INACTIVE = '#3F3B48'
const COLOR_HOVER = '#36323D'
const COLOR_SELECTED = '#2B2830'

export class ChooseActivityUI {
  public chooseActivityUiVisibility: boolean = true
  public uiController: UIController
  public buttonColorHover1: string = '#36323D'
  public buttonColorHover2: string = '#36323D'
  public buttonColorHover3: string = '#36323D'
  public buttonColorHover4: string = '#36323D'
  public buttonSelected: number = 0
  constructor(uiController: UIController) {
    this.uiController = uiController

    engine.addSystem(() => {
      const cmd = inputSystem.getInputCommand(InputAction.IA_ACTION_5, PointerEventType.PET_DOWN)
      if (cmd != null) {
        this.openUI()
      }
    })
  }

  openUI(): void {
    this.chooseActivityUiVisibility = true
  }

  createChooseActivityUi(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.uiController.canvasInfo.width,
          height: this.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.chooseActivityUiVisibility ? 'flex' : 'none',
          positionType: 'absolute',
          borderRadius: 50
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            positionType: 'absolute',
            width: 250.5 * getScaleFactor(),
            height: 348 * getScaleFactor()
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: 'images/Rectangle 1.png'
            }
          }}
        >
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: 11 * getScaleFactor(),
              height: 11 * getScaleFactor(),
              position: { top: '3%', right: '8%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/exit.png' }
            }}
            onMouseDown={() => {
              this.chooseActivityUiVisibility = false
            }}
          ></UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: '90%',
              height: 70 * getScaleFactor(),
              position: { top: '0%' }
            }}
            uiBackground={{}}
          >
            <Label
              uiTransform={{
                positionType: 'absolute'
              }}
              value={'Choose your \n activity'}
              fontSize={25}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: '50%',
              height: '100%',
              position: { left: '0%' }
            }}
            uiBackground={{}}
          >
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136,
                height: 136,
                position: { left: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/live poll.png' }
              }}
            ></UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136,
                height: 136,
                position: { left: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/QA.png' }
              }}
            ></UiEntity>
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: '50%',
              height: '100%',
              position: { right: '0%' }
            }}
            uiBackground={{}}
          >
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136,
                height: 136,
                position: { right: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/quizz.png' }
              }}
            ></UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136,
                height: 136,
                position: { right: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/survey.png' }
              }}
            ></UiEntity>
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              position: { bottom: '10%' },
              width: 80 * getScaleFactor(),
              height: 35 * getScaleFactor(),
              borderRadius: 10
            }}
            uiBackground={{
              color: Color4.fromHexString('#36323D')
            }}
            onMouseDown={() => {
              // Add Logics after selectin each option
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: '100%',
                positionType: 'absolute'
              }}
              value={'Next'}
              fontSize={15 * getScaleFactor()}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  togglebuttonColorHover(buttonNumber: number): void {
    switch (buttonNumber) {
      case 1:
        if (this.buttonSelected !== 1)
          this.buttonColorHover1 = this.buttonColorHover1 === COLOR_HOVER ? COLOR_INACTIVE : COLOR_HOVER
        break
      case 2:
        if (this.buttonSelected !== 2)
          this.buttonColorHover2 = this.buttonColorHover2 === COLOR_HOVER ? COLOR_INACTIVE : COLOR_HOVER
        break
      case 3:
        if (this.buttonSelected !== 3)
          this.buttonColorHover3 = this.buttonColorHover3 === COLOR_HOVER ? COLOR_INACTIVE : COLOR_HOVER
        break
      case 4:
        if (this.buttonSelected !== 4)
          this.buttonColorHover4 = this.buttonColorHover4 === COLOR_HOVER ? COLOR_INACTIVE : COLOR_HOVER
        break
    }
  }

  selectButton(id: number): void {
    this.buttonSelected = id
    this.buttonColorHover1 = id === 1 ? COLOR_SELECTED : COLOR_INACTIVE
    this.buttonColorHover2 = id === 2 ? COLOR_SELECTED : COLOR_INACTIVE
    this.buttonColorHover3 = id === 3 ? COLOR_SELECTED : COLOR_INACTIVE
    this.buttonColorHover4 = id === 4 ? COLOR_SELECTED : COLOR_INACTIVE
  }
}
