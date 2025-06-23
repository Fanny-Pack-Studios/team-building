import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { engine, InputAction, inputSystem, PointerEventType } from '@dcl/sdk/ecs'

import { getScaleFactor } from '../../canvas/Canvas'
import { type UIController } from '../../ui.controller'

export class CreatePollUI {
  public createPollUiVisibility: boolean = false
  public uiController: UIController

  questionTitle: string = ''
  option1: string = ''
  option2: string = ''

  constructor(uiController: UIController) {
    this.uiController = uiController

    engine.addSystem(() => {
      const cmd = inputSystem.getInputCommand(InputAction.IA_ACTION_6, PointerEventType.PET_DOWN)
      if (cmd != null) {
        this.openUI()
      }
    })
  }

  openUI(): void {
    this.createPollUiVisibility = true
  }

  createPollUi(): ReactEcs.JSX.Element | null {
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
            height: 520 * getScaleFactor(),
            borderRadius: 50,
            padding: 20
          }}
          uiBackground={{
            color: Color4.fromInts(60, 60, 60, 255) // gris oscuro modal
          }}
        >
          {/* Title */}
          <Label
            value="Create your Poll"
            fontSize={26 * getScaleFactor()}
            color={Color4.White()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 50 * getScaleFactor(),
              margin: '10px 0'
            }}
          />

          {/* Small subtitle */}
          <Label
            value="Add a question and at least 2 options"
            fontSize={14 * getScaleFactor()}
            color={Color4.White()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 25 * getScaleFactor(),
              margin: '0 0 20px 0'
            }}
          />

          {/* Question Title label */}
          <Label
            value="Question Title:"
            fontSize={18 * getScaleFactor()}
            color={Color4.White()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 30 * getScaleFactor(),
              margin: '0 0 5px 0'
            }}
          />

          {/* Question Title input */}
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: 350 * getScaleFactor(),
              height: 80 * getScaleFactor(),
              borderRadius: 50,
              padding: 20
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/backGroundImg.png' }
            }}
          >
            <Input
              value={this.questionTitle}
              onChange={(value) => (this.questionTitle = value)}
              fontSize={16 * getScaleFactor()}
              placeholder="Question Title"
              placeholderColor={Color4.White()}
              uiTransform={{
                width: '100%',
                height: '100%',
                margin: '0 0 15px 0',
                borderRadius: 15,
                padding: 10
              }}
              color={Color4.White()}
            />
          </UiEntity>

          {/* Options label */}
          <Label
            value="Options:"
            fontSize={18 * getScaleFactor()}
            color={Color4.White()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 30 * getScaleFactor(),
              margin: '0 0 10px 0'
            }}
          />

          {/* Option 1 input */}
          <Input
            value={this.option1}
            onChange={(value) => (this.option1 = value)}
            fontSize={16 * getScaleFactor()}
            placeholder="Option 1"
            placeholderColor={Color4.White()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 40 * getScaleFactor(),
              margin: '0 0 10px 0',
              borderRadius: 15,
              padding: 10
            }}
            uiBackground={{
              textureMode: 'nine-slices',
              texture: { src: 'images/backGroundImg.png' }
            }}
            color={Color4.White()}
          />

          {/* Option 2 input */}
          <Input
            value={this.option2}
            onChange={(value) => (this.option2 = value)}
            fontSize={16 * getScaleFactor()}
            placeholder="Option 2"
            placeholderColor={Color4.White()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 40 * getScaleFactor(),
              margin: '0 0 20px 0',
              borderRadius: 15,
              padding: 10
            }}
            uiBackground={{
              textureMode: 'nine-slices',
              texture: { src: 'images/backGroundImg.png' }
            }}
            color={Color4.White()}
          />

          {/* Buttons container */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 350 * getScaleFactor()
            }}
          >
            {/* Add Answer button */}
            <Button
              value="Add Answer"
              fontSize={16 * getScaleFactor()}
              uiTransform={{
                width: 160 * getScaleFactor(),
                height: 40 * getScaleFactor(),
                borderRadius: 15,
                margin: '0 10px 0 0'
              }}
              uiBackground={{
                color: Color4.fromInts(255, 102, 102, 255)
              }}
              onMouseDown={() => {
                console.log('Add Answer clicked')
              }}
            />

            {/* Create button */}
            <Button
              value="Create"
              fontSize={16 * getScaleFactor()}
              uiTransform={{
                width: 160 * getScaleFactor(),
                height: 40 * getScaleFactor(),
                borderRadius: 15
              }}
              uiBackground={{
                color: Color4.fromInts(255, 102, 102, 255)
              }}
              onMouseDown={() => {
                console.log('Create clicked')
              }}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
