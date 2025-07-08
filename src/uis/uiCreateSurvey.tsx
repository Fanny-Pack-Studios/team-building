import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Dropdown, type EntityPropTypes, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { merge } from 'ts-deepmerge'
import { ActivityType, setCurrentActivity } from '../activities/activitiesEntity'
import { type GameController } from '../controllers/game.controller'
import { type OptionsQuantity, RatingSelector } from '../surveys/rating'
import { createSurveyEntity } from '../surveys/surveyEntity'
import { SurveyIcon } from '../surveys/surveyIcon'
import { ModalButton } from './components/buttons'
import { HorizontalLabeledControl, VerticalLabeledControl } from './components/labeledControl'
import { LabeledInput } from './components/labeledInput'
import { ModalTitle } from './components/modalTitle'
import { ModalWindow } from './components/modalWindow'
import { Switch } from './components/switch'
import { primaryTheme } from './themes/themes'

function IconEntity(props: {
  icon: SurveyIcon
  onChange: (icon: SurveyIcon) => void
  value: SurveyIcon
}): ReactEcs.JSX.Element {
  const selectedColor = props.value === props.icon ? Color4.White() : Color4.Gray()
  return (
    <UiEntity
      uiTransform={{ width: '4vw', height: '4vw', borderWidth: 2, borderColor: selectedColor, borderRadius: 10 }}
      onMouseDown={() => {
        props.onChange(props.icon)
      }}
      uiBackground={{
        color: selectedColor,
        texture: { src: `images/createSurveyUi/${props.icon}.png` },
        textureMode: 'stretch'
      }}
    ></UiEntity>
  )
}

function IconSelector(
  props: EntityPropTypes & {
    onChange: (icon: SurveyIcon) => void
    value: SurveyIcon
  }
): ReactEcs.JSX.Element {
  const { onChange, value, ...rest } = merge(
    {
      uiTransform: { width: '50%', height: 'auto', flexDirection: 'row', justifyContent: 'space-around' }
    } satisfies EntityPropTypes,
    props
  )

  return (
    <UiEntity {...rest}>
      <IconEntity icon={SurveyIcon.STAR} onChange={props.onChange} value={props.value} />
      <IconEntity icon={SurveyIcon.THUMBS_UP} onChange={props.onChange} value={props.value} />
    </UiEntity>
  )
}

export class CreateSurveyUI {
  private selectedIcon: SurveyIcon = SurveyIcon.STAR
  private isAnonymous: boolean = false
  private optionsQty: OptionsQuantity = 5
  private questionTitle: string = ''

  public isVisible: boolean = false
  constructor(private readonly gameController: GameController) {}

  createUi(): ReactEcs.JSX.Element | null {
    const dropdownOptions = ['5', '4', '3', '2']
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
          uiTransform={{ width: '100%', height: '4vh', margin: { bottom: '3vh' } }}
          fontSize="1.2vw"
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
          containerProps={{ uiTransform: { margin: { top: '2.5vw' } } }}
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
            <UiEntity
              uiTransform={{
                height: '3vw',
                width: '3vw',
                alignItems: 'center',
                borderRadius: 10,
                margin: '1vw'
              }}
              uiBackground={primaryTheme.primaryButtonBackground}
            >
              <Dropdown
                uiTransform={{ height: '2.5vw', width: '2.5vw' }}
                textAlign="middle-center"
                fontSize={'1.2vw'}
                color={primaryTheme.fontColor}
                options={dropdownOptions}
                selectedIndex={dropdownOptions.indexOf(this.optionsQty.toString())}
                onChange={(newVal) => (this.optionsQty = parseInt(dropdownOptions[newVal]) as OptionsQuantity)}
              ></Dropdown>
            </UiEntity>
            <IconSelector
              onChange={(icon) => {
                this.selectedIcon = icon
              }}
              value={this.selectedIcon}
            ></IconSelector>
          </UiEntity>
          <RatingSelector icon={this.selectedIcon} initialRating={1} qty={this.optionsQty}></RatingSelector>
          <HorizontalLabeledControl
            labelProps={{ value: 'Anonymous', fontSize: '1.2vw', color: primaryTheme.fontColor }}
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
    const [surveyId] = createSurveyEntity(this.questionTitle, this.selectedIcon, this.optionsQty, this.isAnonymous)
    setCurrentActivity(this.gameController.activitiesEntity, surveyId, ActivityType.SURVEY)
    this.isVisible = false
  }
}
