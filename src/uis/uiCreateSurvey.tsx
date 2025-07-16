import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { ActivityType, setCurrentActivity } from '../activities/activitiesEntity'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'
import { RatingSelector } from '../surveys/rating'
import { createSurveyEntity } from '../surveys/surveyEntity'
import { SurveyIcon } from '../surveys/surveyIcon'
import { ModalButton } from './components/buttons'
import { HorizontalLabeledControl, VerticalLabeledControl } from './components/labeledControl'
import { LabeledInput } from './components/labeledInput'
import { ModalTitle } from './components/modalTitle'
import { ModalWindow } from './components/modalWindow'
import { NumberPicker } from './components/numberPicker'
import { Switch } from './components/switch'
import { primaryTheme } from './themes/themes'

export class CreateSurveyUI {
  private isAnonymous: boolean = false
  private optionsQty: number = 5
  private questionTitle: string = ''

  public isVisible: boolean = false
  constructor(private readonly gameController: GameController) {}

  createUi(): ReactEcs.JSX.Element | null {
    return (
      <ModalWindow
        visible={this.isVisible}
        onClosePressed={() => {
          this.isVisible = false
        }}
        uiTransform={{ justifyContent: 'space-between' }}
      >
        <ModalTitle value="<b>Create Your Survey</b>" />
        <Label
          uiTransform={{ width: '100%', height: 20 * getScaleFactor(), margin: { bottom: 25 * getScaleFactor() } }}
          fontSize={primaryTheme.smallFontSize}
          textAlign="middle-center"
          value="Add a question, pick options and icons"
        />
        <LabeledInput
          labelProps={{ value: '<b>Question Title: </b>' }}
          inputProps={{
            placeholder: 'Question Title',
            onChange: (value) => {
              this.questionTitle = value
            }
          }}
        />

        <VerticalLabeledControl
          containerProps={{ uiTransform: { margin: { top: 25 * getScaleFactor() } } }}
          labelProps={{ value: '<b>Options:</b>' }}
        >
          <UiEntity
            uiTransform={{
              width: '100%',
              height: 'auto',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignContent: 'center'
            }}
          >
            <NumberPicker
              initialValue={this.optionsQty}
              min={2}
              max={10}
              onChange={(num) => {
                this.optionsQty = num
              }}
            ></NumberPicker>
          </UiEntity>
          <RatingSelector icon={SurveyIcon.STAR} initialRating={1} qty={this.optionsQty}></RatingSelector>
          <HorizontalLabeledControl
            labelProps={{ value: 'Anonymous', fontSize: primaryTheme.smallFontSize, color: primaryTheme.fontColor }}
            uiTransform={{ justifyContent: 'space-between' }}
          >
            <Switch
              initialValue={this.isAnonymous}
              onChange={(val) => {
                this.isAnonymous = val
              }}
            ></Switch>
          </HorizontalLabeledControl>
        </VerticalLabeledControl>
        <ModalButton
          text="Create"
          isDisabled={!this.areInputsValid()}
          onMouseDown={() => {
            this.createSurvey()
          }}
        ></ModalButton>
      </ModalWindow>
    )
  }

  areInputsValid(): boolean {
    return this.questionTitle !== ''
  }

  createSurvey(): void {
    const [surveyId] = createSurveyEntity(this.questionTitle, SurveyIcon.STAR, this.optionsQty, this.isAnonymous)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setCurrentActivity(this.gameController.activitiesEntity, surveyId, ActivityType.SURVEY)
    this.isVisible = false
  }
}
