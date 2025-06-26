import ReactEcs, { Input, Label, UiEntity } from '@dcl/sdk/react-ecs'

import { getScaleFactor } from '../canvas/Canvas'
import { type UIController } from '../controllers/ui.controller'
import { Color4 } from '@dcl/sdk/math'

export class CreatePollUI {
  public createPollUiVisibility: boolean = true
  public uiController: UIController
  public switchOn: boolean = false
  public switchOnTexture: string = 'images/createpollui/switchOn.png'
  public switchOffTexture: string = 'images/createpollui/switchOff.png'
  public switchTexture: string = this.switchOffTexture
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  openUI(): void {
    this.createPollUiVisibility = true
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
          display: this.createPollUiVisibility ? 'flex' : 'none',
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
              src: 'images/createpollui/background.png'
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
            value={`<b>Create your poll </b>`}
            fontSize={22 * getScaleFactor()}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              margin: { top: '1%' }
            }}
            value={`Add a question and at least 2 options.`}
            fontSize={12 * getScaleFactor()}
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
              this.createPollUiVisibility = false
            }}
          ></UiEntity>
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 10 * getScaleFactor(),
              alignContent: 'center',
              margin: { top: '1%' },
              position: { left: '-23%' }
            }}
            value={`Question title:`}
            fontSize={12 * getScaleFactor()}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'relative',
              width: 252 * getScaleFactor(),
              height: 56 * getScaleFactor(),
              margin: { top: '5%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/createpollui/question1.png' }
            }}
          >
            <Input
              onChange={(value) => {}}
              fontSize={17 * getScaleFactor()}
              placeholder={'Question Title'}
              placeholderColor={Color4.Gray()}
              uiTransform={{
                width: '94%',
                height: '72%',
                positionType: 'absolute',
                position: { top: '0%', left: '3%' }
              }}
              uiBackground={{ color: Color4.Clear() }}
            />
          </UiEntity>
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 10 * getScaleFactor(),
              alignContent: 'center',
              margin: { top: '1%' },
              position: { left: '-27.5%' }
            }}
            value={`Options:`}
            fontSize={12 * getScaleFactor()}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'relative',
              width: 252 * getScaleFactor(),
              height: 56 * getScaleFactor(),
              margin: { top: '5%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/createpollui/answer.png' }
            }}
          >
            <Input
              onChange={(value) => {}}
              fontSize={17 * getScaleFactor()}
              placeholder={'Option 1'}
              placeholderColor={Color4.Gray()}
              uiTransform={{
                width: '94%',
                height: '72%',
                positionType: 'absolute',
                position: { top: '0%', left: '3%' }
              }}
              uiBackground={{ color: Color4.Clear() }}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'relative',
              width: 252 * getScaleFactor(),
              height: 56 * getScaleFactor(),
              margin: { top: '0%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/createpollui/answer.png' }
            }}
          >
            <Input
              onChange={(value) => {}}
              fontSize={17 * getScaleFactor()}
              placeholder={'Option 2'}
              placeholderColor={Color4.Gray()}
              uiTransform={{
                width: '94%',
                height: '72%',
                positionType: 'absolute',
                position: { top: '0%', left: '3%' }
              }}
              uiBackground={{ color: Color4.Clear() }}
            />
          </UiEntity>
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 10 * getScaleFactor(),
              alignContent: 'center',
              margin: { top: '4%' },
              position: { left: '-25%' }
            }}
            value={`Anonymus`}
            fontSize={12 * getScaleFactor()}
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
              width: 76 * getScaleFactor(),
              height: 46 * getScaleFactor(),
              position: { bottom: '15%', right: '14%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: this.switchTexture }
            }}
            onMouseDown={() => {
              this.toggleSwitcher()
            }}
          ></UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              positionType: 'relative',
              width: '100%',
              height: 56 * getScaleFactor(),
              margin: { top: '4%', left: '0%' }
            }}
          >
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                positionType: 'relative',
                width: 136 * getScaleFactor(),
                height: 56 * getScaleFactor(),
                margin: { top: '5%', left: '10%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/createpollui/addAnswerButton.png' }
              }}
            ></UiEntity>
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                positionType: 'relative',
                width: 136 * getScaleFactor(),
                height: 56 * getScaleFactor(),
                margin: { top: '5%', left: '0%' }
              }}
              uiBackground={{
                textureMode: 'stretch',
                texture: { src: 'images/createpollui/createButton.png' }
              }}
            ></UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  toggleSwitcher(): void {
    this.switchOn = !this.switchOn
    this.switchTexture = this.switchOn ? this.switchOnTexture : this.switchOffTexture
  }
}
