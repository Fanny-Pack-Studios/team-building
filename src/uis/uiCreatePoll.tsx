import ReactEcs, { Input, Label, UiEntity } from '@dcl/sdk/react-ecs'

import { Color4 } from '@dcl/sdk/math'
import { ActivityType, setCurrentActivity } from '../activities/activitiesEntity'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'
import { createPollEntity, pollRegistry } from '../polls/pollEntity'
import { engine } from '@dcl/sdk/ecs'
import { Switch } from './components/switch'

export class CreatePollUI {
  public createPollUiVisibility: boolean = false
  public switchThumbPosition: number = 0 // de 0 (off) a 1 (on)
  public switchAnimating: boolean = false
  public switchAnimationTarget: number = 0
  public switchAnimationSpeed: number = 3 // más alto = más rápido
  public switchOn: boolean = false
  switchBgOnSrc = 'images/createpollui/switch_bg_on.png'
  switchBgOffSrc = 'images/createpollui/switch_bg_off.png'
  switchThumbOnSrc = 'images/createpollui/switch_thum_on.png'
  switchThumbOffSrc = 'images/createpollui/switch_thum_off.png'
  private isAnonymous: boolean = false
  public questionTitle: string = ''
  public answers: string[] = ['', '']
  public gameController: GameController
  public answerScrollIndex: number = 0
  public maxAnswers: number = 4
  public addAnswerButtonDisabled: Color4 | undefined = undefined

  constructor(gameController: GameController) {
    this.gameController = gameController
    engine.addSystem((dt) => {
      this.update(dt)
    })
  }

  openUI(): void {
    this.createPollUiVisibility = true
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
          {/* Header */}
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

          {/* Exit button */}
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
          />

          {/* Question title */}
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

          {/* Options Label */}
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
              width: 350 * getScaleFactor(),
              height: (56 * 2 + 10) * getScaleFactor(),
              margin: { top: '2%' },
              positionType: 'relative'
            }}
          >
            {this.canScrollLeft() && (
              <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  position: { left: '8%' },
                  width: 25 * getScaleFactor(),
                  height: 34 * getScaleFactor()
                }}
                uiBackground={{
                  textureMode: 'center',
                  texture: { src: 'images/createpollui/arrowLeft.png' }
                }}
                onMouseDown={() => {
                  this.scrollLeft()
                }}
              />
            )}

            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: 252 * getScaleFactor(),
                height: (56 * 2 + 10) * getScaleFactor(),
                overflow: 'hidden'
              }}
            >
              {this.renderAnswerInputs()}
            </UiEntity>

            {this.canScrollRight() && (
              <UiEntity
                uiTransform={{
                  positionType: 'absolute',
                  position: { right: '8%' },
                  width: 25 * getScaleFactor(),
                  height: 34 * getScaleFactor()
                }}
                uiBackground={{
                  textureMode: 'center',
                  texture: { src: 'images/createpollui/arrowRight.png' }
                }}
                onMouseDown={() => {
                  this.scrollRight()
                }}
              />
            )}
          </UiEntity>

          {/* Anonymous label and switch */}
          <Label
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 10 * getScaleFactor(),
              alignContent: 'center',
              margin: { top: '4%' },
              position: { left: '-25%' }
            }}
            value={`Anonymous`}
            fontSize={12 * getScaleFactor()}
            font="sans-serif"
            color={Color4.White()}
            textAlign="middle-center"
          />

          <UiEntity
            uiTransform={{
              width: 66 * getScaleFactor(),
              height: 34 * getScaleFactor(),
              positionType: 'absolute',
              position: { bottom: '18%', right: '14%' },
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden' // importante para el clip si se quiere
            }}
            onMouseDown={() => {
              this.toggleSwitcher()
            }}
          >
            <Switch
              initialValue={this.isAnonymous}
              onChange={(val) => {
                this.isAnonymous = val
              }}
            ></Switch>
          </UiEntity>

          {/* Bottom buttons */}
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
                texture: { src: 'images/createpollui/addAnswerButton.png' },
                color: this.addAnswerButtonDisabled
              }}
              onMouseDown={() => {
                this.addAnswer()
              }}
            />

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
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  toggleSwitcher(): void {
    if (this.switchAnimating) return // Evita doble click en medio de la animación

    this.switchOn = !this.switchOn
    this.switchAnimationTarget = this.switchOn ? 1 : 0
    this.switchAnimating = true
  }

  create(): void {
    const validAnswers = this.answers.filter((a) => a.trim() !== '')
    if (this.questionTitle.trim() === '' || validAnswers.length < 2) {
      console.log('Poll requires a title and at least 2 answers.')
      return
    }

    const { pollId } = createPollEntity(this.questionTitle, validAnswers, this.switchOn)

    const pollEntity = pollRegistry.get(pollId)
    if (pollEntity == null) return

    setCurrentActivity(this.gameController.activitiesEntity, pollId, ActivityType.POLL)

    this.createPollUiVisibility = false
  }

  renderAnswerInputs(): ReactEcs.JSX.Element[] {
    const elements: ReactEcs.JSX.Element[] = []
    const sf = getScaleFactor()

    if (this.answerScrollIndex === 0) {
      if (this.answers.length > 0) elements.push(this.renderAnswerInput(0, sf))
      if (this.answers.length > 1) elements.push(this.renderAnswerInput(1, sf))
    } else if (this.answerScrollIndex === 1) {
      if (this.answers.length > 2) elements.push(this.renderAnswerInput(2, sf))
      if (this.answers.length > 3) elements.push(this.renderAnswerInput(3, sf))
    }

    return elements
  }

  renderAnswerInput(index: number, sf: number): ReactEcs.JSX.Element {
    // Decidimos el ancho del Input dinámicamente
    const inputWidth = this.answers.length > 2 ? '84%' : '94%'
    // Calcular tamaño del ícono con un límite mínimo
    const iconSize = Math.max(16, 20 * sf)

    return (
      <UiEntity
        key={index}
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'relative',
          width: 252 * sf,
          height: 56 * sf,
          margin: { top: '2%' }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'images/createpollui/answer.png' }
        }}
      >
        <Input
          onChange={(val) => {
            this.answers[index] = val
          }}
          fontSize={17 * sf}
          placeholder={`Option ${index + 1}`}
          placeholderColor={Color4.Gray()}
          value={this.answers[index]}
          uiTransform={{
            width: inputWidth,
            height: '72%',
            positionType: 'absolute',
            position: { top: '0%', left: '3%' }
          }}
          uiBackground={{ color: Color4.Clear() }}
        />

        {this.answers.length > 2 && (
          <UiEntity
            uiTransform={{
              width: iconSize,
              height: iconSize,
              positionType: 'absolute',
              position: { right: '4%', top: '22%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/createpollui/trash_icon.png' }
            }}
            onMouseDown={() => {
              this.answers.splice(index, 1)
              if (this.answers.length <= 2) {
                this.answerScrollIndex = 0
              }
              this.updateAddAnswerButtonColor()
            }}
          ></UiEntity>
        )}
      </UiEntity>
    )
  }

  updateAddAnswerButtonColor(): void {
    if (this.answers.length >= this.maxAnswers) {
      this.addAnswerButtonDisabled = Color4.Gray()
    } else {
      this.addAnswerButtonDisabled = undefined
    }
  }

  addAnswer(): void {
    if (this.answers.length < this.maxAnswers) {
      this.answers.push('')
      if (this.answers.length > 2) {
        this.answerScrollIndex = 1
      }
    }
    this.updateAddAnswerButtonColor()
  }

  scrollRight(): void {
    if (this.answers.length > 2) {
      this.answerScrollIndex = 1
    }
  }

  scrollLeft(): void {
    this.answerScrollIndex = 0
  }

  canScrollLeft(): boolean {
    return this.answers.length > 2 && this.answerScrollIndex > 0
  }

  canScrollRight(): boolean {
    return this.answers.length > 2 && this.answerScrollIndex < Math.floor((this.answers.length - 1) / 2)
  }

  update(dt: number): void {
    if (this.switchAnimating) {
      const diff = this.switchAnimationTarget - this.switchThumbPosition
      const step = this.switchAnimationSpeed * dt

      if (Math.abs(diff) <= step) {
        this.switchThumbPosition = this.switchAnimationTarget
        this.switchAnimating = false
      } else {
        this.switchThumbPosition += Math.sign(diff) * step
      }
    }
  }
}
