import ReactEcs, { Button, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { engine, InputAction, inputSystem, PointerEventType } from '@dcl/sdk/ecs'

import { getScaleFactor } from '../../canvas/Canvas'
import { type UIController } from '../../ui.controller'

export class PollAdminUI {
  public pollAdminUiVisibility: boolean = false
  public uiController: UIController

  nameOrWallet: string = ''

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
            width: 400 * getScaleFactor(),
            height: 500 * getScaleFactor(),
            borderRadius: 50,
            padding: 20
          }}
          uiBackground={{
            textureMode: 'stretch',
            texture: {
              src: 'images/backGroundImg.png'
            }
          }}
        >
          <Label
            value="Choose yoour Activity"
            fontSize={24 * getScaleFactor()}
            color={Color4.White()}
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              margin: '30px 0 10px 0'
            }}
          />

          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 400 * getScaleFactor(),
              height: 'auto',
              margin: '10px'
            }}
          >
            {['Live Poll', 'QuizGame', 'QA', 'Survey'].map((label) => (
              <Button
                key={label}
                value={label}
                fontSize={18 * getScaleFactor()}
                uiTransform={{
                  width: 300 * getScaleFactor(),
                  height: 40 * getScaleFactor(),
                  margin: '15px 0',
                  borderRadius: 15
                }}
                uiBackground={{
                  color: Color4.fromInts(60, 60, 60, 255)
                }}
                onMouseDown={() => {
                  console.log(`Selected activity: ${label}`)
                }}
              />
            ))}
          </UiEntity>

          <Button
            value="Next"
            fontSize={18 * getScaleFactor()}
            uiTransform={{
              width: 200 * getScaleFactor(),
              height: 40 * getScaleFactor(),
              margin: '30px 0 20px 0',
              borderRadius: 12
            }}
            uiBackground={{
              color: Color4.fromHexString('#FFA500')
            }}
            onMouseDown={() => {
              console.log('Next clicked')
              this.pollAdminUiVisibility = false
            }}
          />
        </UiEntity>
      </UiEntity>
    )
  }
}
