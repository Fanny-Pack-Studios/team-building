import ReactEcs, { Input, Label, UiEntity } from '@dcl/sdk/react-ecs'

import { getScaleFactor } from '../canvas/Canvas'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'

import { OptionZone } from '../zonePolls/optionZone'
import { engine } from '@dcl/sdk/ecs'

export class ZonePollUI {
  public createZonePollUiVisibility: boolean = false
  public switchOn: boolean = false
  public switchOnTexture: string = 'images/createpollui/switchOn.png'
  public switchOffTexture: string = 'images/createpollui/switchOff.png'
  public switchTexture: string = this.switchOffTexture
  public questionTitle: string = ''
  public answers: string[] = ['', '']
  public gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  openUI(): void {
    this.createZonePollUiVisibility = true
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
          display: this.createZonePollUiVisibility ? 'flex' : 'none',
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
              this.createZonePollUiVisibility = false
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
              onChange={(value) => {
                this.questionTitle = value
              }}
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
              onChange={(value) => {
                this.answers[0] = value
              }}
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
              onChange={(value) => {
                this.answers[1] = value
              }}
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
              onMouseDown={() => {
                this.create()
              }}
            ></UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  create(): void {
    console.log('CREATE ZONES')
    this.gameController.createZonePollUI.createZonePollUiVisibility = false
    this.gameController.zonePollQuestionUI.show(this.questionTitle)
    const positions = [
      Vector3.create(2, 0, 4),
      Vector3.create(6, 0, 4),
      Vector3.create(10, 0, 4),
      Vector3.create(14, 0, 4)
    ]

    const zones = ['zone1', 'zone2', 'zone3', 'zone4'] as const

    const filteredAnswers = this.answers.filter((answer) => answer.trim() !== '')

    filteredAnswers.forEach((answer, index) => {
      if (index >= positions.length) {
        console.log('Too many options, skipping:', answer)
        return
      }

      const position = positions[index]
      const color = Color4.create(0.2 + index * 0.3, 0.6, 1.0, 1)

      const zone = new OptionZone(position, color, answer, this.gameController)

      const zoneKey = zones[index]
      this.gameController[zoneKey] = zone
      const updateSystem = (dt: number): void => {
        zone.update(dt)
      }
      engine.addSystem(updateSystem)
      this.gameController.zoneUpdateSystems.add(updateSystem)
    })
    this.gameController.timerUI.show(1)
    let elapsed = 0
    const duration = 60

    const system = (dt: number): void => {
      elapsed += dt
      if (elapsed >= duration) {
        this.gameController.zonePollQuestionUI.hide()

        const zoneKeys = ['zone1', 'zone2', 'zone3', 'zone4'] as const
        for (const key of zoneKeys) {
          const zone = this.gameController[key]
          if (zone != null) {
            console.log('Destroy Zones')
            zone.destroy()
          }
        }
        for (const system of this.gameController.zoneUpdateSystems) {
          engine.removeSystem(system)
        }
        this.gameController.zoneUpdateSystems.clear()
        engine.removeSystem(system)
      }
    }

    engine.addSystem(system)
  }

  renderAnswerInputs(): ReactEcs.JSX.Element[] {
    return this.answers.map((answer, index) => (
      <UiEntity
        key={index}
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'relative',
          width: 252 * getScaleFactor(),
          height: 56 * getScaleFactor(),
          margin: { top: '2%' }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'images/createpollui/answer.png' }
        }}
      >
        <Input
          onChange={(value) => {
            this.answers[index] = value
          }}
          fontSize={17 * getScaleFactor()}
          placeholder={`Option ${index + 1}`}
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
    ))
  }
}
