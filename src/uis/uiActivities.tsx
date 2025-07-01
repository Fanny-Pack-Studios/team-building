import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

import { getScaleFactor } from '../canvas/Canvas'
import { Color4 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'

const COLOR_INACTIVE = '#FFFFFFFF'
const COLOR_HOVER = '#3F3B45'
const COLOR_SELECTED = '#3F3B45'

export class ChooseActivityUI {
  public chooseActivityUiVisibility: boolean = false
  public gameController: GameController
  public buttonColorHover1: string = '#FFFFFFFF'
  public buttonColorHover2: string = '#FFFFFFFF'
  public buttonColorHover3: string = '#FFFFFFFF'
  public buttonColorHover4: string = '#FFFFFFFF'
  public buttonSelected: number = 0
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  openUI(): void {
    this.chooseActivityUiVisibility = true
  }

  createChooseActivityUi(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.chooseActivityUiVisibility ? 'flex' : 'none',
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
            height: 472 * getScaleFactor()
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: 'images/activitiesui/Rectangle.png'
            }
          }}
        >
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              position: { bottom: '35%' },
              margin: '20px 20px 20px 20px'
            }}
            value={`<b>Choose your \n activity</b>`}
            fontSize={22 * getScaleFactor()}
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
              this.chooseActivityUiVisibility = false
            }}
          ></UiEntity>

          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: '50%',
              height: '100%',
              position: { left: '0%', top: '5%' }
            }}
            uiBackground={{}}
          >
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136 * getScaleFactor(),
                height: 136 * getScaleFactor(),
                position: { left: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/activitiesui/live poll.png' },
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
                this.chooseActivityUiVisibility = false
                this.gameController.createPollUI.createPollUiVisibility = true
              }}
            ></UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136 * getScaleFactor(),
                height: 136 * getScaleFactor(),
                position: { left: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/activitiesui/QA.png' },
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
              position: { right: '0%', top: '5%' }
            }}
            uiBackground={{}}
          >
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136 * getScaleFactor(),
                height: 136 * getScaleFactor(),
                position: { right: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/activitiesui/quizz.png' },
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
            ></UiEntity>
            <UiEntity
              uiTransform={{
                positionType: 'relative',
                width: 136 * getScaleFactor(),
                height: 136 * getScaleFactor(),
                position: { right: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/activitiesui/survey.png' },
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
            ></UiEntity>
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              position: { bottom: '8%' },
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
