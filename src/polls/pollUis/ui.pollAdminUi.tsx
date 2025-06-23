import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { engine, InputAction, inputSystem, PointerEventType } from '@dcl/sdk/ecs'

import { getScaleFactor } from '../../canvas/Canvas'
import { type UIController } from '../../ui.controller'
import { Color4 } from '@dcl/sdk/math'

const COLOR_INACTIVE = '#3F3B48' 
const COLOR_HOVER = '#36323D' 
const COLOR_SELECTED = '#2B2830' 

export class PollAdminUI {
  public pollAdminUiVisibility: boolean = false
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
              color: Color4.fromHexString(this.buttonColorHover1)
            }}
            onMouseEnter={() => {
              this.togglebuttonColorHover(1)
            }}
            onMouseLeave={() => {
              this.togglebuttonColorHover(1)
            }}
            onMouseDown={() => {
              this.selectButton(1)
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
              color: Color4.fromHexString(this.buttonColorHover2)
            }}
            onMouseEnter={() => {
              this.togglebuttonColorHover(2)
            }}
            onMouseLeave={() => {
              this.togglebuttonColorHover(2)
            }}
            onMouseDown={() => {
              this.selectButton(2)
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
              color: Color4.fromHexString(this.buttonColorHover3)
            }}
            onMouseEnter={() => {
              this.togglebuttonColorHover(3)
            }}
            onMouseLeave={() => {
              this.togglebuttonColorHover(3)
            }}
            onMouseDown={() => {
              this.selectButton(3)
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
              color: Color4.fromHexString(this.buttonColorHover4)
            }}
            onMouseEnter={() => {
              this.togglebuttonColorHover(4)
            }}
            onMouseLeave={() => {
              this.togglebuttonColorHover(4)
            }}
            onMouseDown={() => {
              this.selectButton(4)
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
