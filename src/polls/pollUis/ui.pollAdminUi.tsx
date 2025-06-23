import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { engine, InputAction, inputSystem, PointerEventType } from '@dcl/sdk/ecs'

import { getScaleFactor } from '../../canvas/Canvas'
import { type UIController } from '../../ui.controller'
import { Color4 } from '@dcl/sdk/math'

export class PollAdminUI {
  public pollAdminUiVisibility: boolean = false
  public uiController: UIController
  public buttonColor1: string = '#36323D'
  public buttonColor2: string = '#36323D'
  public buttonColor3: string = '#36323D'
  public buttonColor4: string = '#36323D'
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
    this.pollAdminUiVisibility = true
  }

  createPollAdminUi(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.uiController.canvasInfo.width,
          height: this.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.pollAdminUiVisibility ? 'flex' : 'none',
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
            width: 334 * getScaleFactor(),
            height: 464 * getScaleFactor()
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: 'images/backGroundImg.png'
            }
          }}
        >
          <UiEntity
            uiTransform={{
              width: 150 * getScaleFactor(),
              height: 45 * getScaleFactor()
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: '100%',
                positionType: 'absolute',
                margin: { top: '4%' }
              }}
              value={'Choose your Activity'}
              fontSize={20 * getScaleFactor()}
              font="sans-serif"
              color={Color4.White()}
              textAlign="middle-center"
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              positionType: 'relative',
              margin: { top: '14%' },
              alignItems: 'center',
              justifyContent: 'center',
              width: 120 * getScaleFactor(),
              height: 45 * getScaleFactor(),
              borderRadius: 10
            }}
            uiBackground={{
              color: Color4.fromHexString(this.buttonColor1)
            }}
            onMouseEnter={() => {
              this.toggleButtonColor(1)
            }}
            onMouseLeave={() => {
              this.toggleButtonColor(1)
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: '100%',
                positionType: 'absolute'
              }}
              value={'Live Poll'}
              fontSize={15 * getScaleFactor()}
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
              positionType: 'relative',
              margin: { top: '5%' },
              width: 120 * getScaleFactor(),
              height: 45 * getScaleFactor(),
              borderRadius: 10
            }}
            uiBackground={{
              color: Color4.fromHexString(this.buttonColor2)
            }}
            onMouseEnter={() => {
              this.toggleButtonColor(2)
            }}
            onMouseLeave={() => {
              this.toggleButtonColor(2)
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: '100%',
                positionType: 'absolute'
              }}
              value={'Quiz Game'}
              fontSize={15 * getScaleFactor()}
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
              positionType: 'relative',
              margin: { top: '5%' },
              width: 120 * getScaleFactor(),
              height: 45 * getScaleFactor(),
              borderRadius: 10
            }}
            uiBackground={{
              color: Color4.fromHexString(this.buttonColor3)
            }}
            onMouseEnter={() => {
              this.toggleButtonColor(3)
            }}
            onMouseLeave={() => {
              this.toggleButtonColor(3)
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: '100%',
                positionType: 'absolute'
              }}
              value={'QA'}
              fontSize={15 * getScaleFactor()}
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
              positionType: 'relative',
              margin: { top: '5%' },
              width: 120 * getScaleFactor(),
              height: 45 * getScaleFactor(),
              borderRadius: 10
            }}
            uiBackground={{
              color: Color4.fromHexString(this.buttonColor4)
            }}
            onMouseEnter={() => {
              this.toggleButtonColor(4)
            }}
            onMouseLeave={() => {
              this.toggleButtonColor(4)
            }}
          >
            <Label
              uiTransform={{
                width: '100%',
                height: '100%',
                positionType: 'absolute'
              }}
              value={'Survey'}
              fontSize={15 * getScaleFactor()}
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
              positionType: 'relative',
              margin: { top: '7%' },
              width: 80 * getScaleFactor(),
              height: 35 * getScaleFactor(),
              borderRadius: 10
            }}
            uiBackground={{
              color: Color4.fromHexString('#FFB45B')
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

  toggleButtonColor(buttonNumber: number): void {
    const selected = '#36323D'
    const unselected = '#3F3B48'

    switch (buttonNumber) {
      case 1:
        this.buttonColor1 = this.buttonColor1 === selected ? unselected : selected
        break
      case 2:
        this.buttonColor2 = this.buttonColor2 === selected ? unselected : selected
        break
      case 3:
        this.buttonColor3 = this.buttonColor3 === selected ? unselected : selected
        break
      case 4:
        this.buttonColor4 = this.buttonColor4 === selected ? unselected : selected
        break
      default:
        break
    }
  }
}
