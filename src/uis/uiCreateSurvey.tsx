import ReactEcs, { Button, Dropdown, type EntityPropTypes, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { LabeledInput } from './components/labeledInput'
import { ModalTitle } from './components/modalTitle'
import { ModalWindow } from './components/modalWindow'
import { primaryTheme } from './themes/themes'
import { HorizontalLabeledControl, VerticalLabeledControl } from './components/labeledControl'
import { Color4 } from '@dcl/sdk/math'
import { merge } from 'ts-deepmerge'
import { SurveyIcon } from '../surveys/surveyIcon'
import { type OptionsQuantity, RatingSelector } from '../surveys/rating'
import { Switch } from './components/switch'

function IconEntity(props: {
  icon: SurveyIcon
  onChange: (icon: SurveyIcon) => void
  value: SurveyIcon
}): ReactEcs.JSX.Element {
  const selectedColor = props.value === props.icon ? Color4.White() : Color4.Gray()
  return (
    <UiEntity
      uiTransform={{ width: '3vw', height: '3vw', borderWidth: 2, borderColor: selectedColor, borderRadius: 10 }}
      onMouseDown={() => {
        props.onChange(props.icon)
      }}
      uiBackground={{
        color: selectedColor,
        texture: { src: `images/createSurveyUi/${props.icon}.png` },
        textureMode: 'center'
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
      uiTransform: { width: '8vw', height: 'auto', flexDirection: 'row', justifyContent: 'space-around' }
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

  public isVisible: boolean = true
  constructor(private readonly gameController: GameController) {}

  createUI(): ReactEcs.JSX.Element | null {
    const dropdownOptions = ['5', '4', '3', '2']
    return (
      <ModalWindow visible={this.isVisible}>
        <ModalTitle value="<b>Create Your Survey</b>" />
        <Label
          uiTransform={{ width: '100%', height: '4vh', margin: { bottom: '3vh' } }}
          fontSize="1.2vw"
          textAlign="middle-center"
          value="Add a question, pick options and icons"
        />
        <LabeledInput
          labelProps={{ value: '<b>Question Title: </b>' }}
          inputProps={{ placeholder: 'Question Title' }}
        />

        <VerticalLabeledControl
          containerProps={{ uiTransform: { margin: { top: '2.5vw' } } }}
          labelProps={{ value: '<b>Options:</b>' }}
        >
          <UiEntity
            uiTransform={{
              width: '50%',
              height: 'auto',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignContent: 'center'
            }}
          >
            <UiEntity
              uiTransform={{
                height: '2.5vw',
                width: '2.5vw',
                alignItems: 'center',
                borderRadius: 10
              }}
              uiBackground={primaryTheme.primaryButtonBackground}
            >
              <Dropdown
                uiTransform={{ height: '2vw', width: '2vw' }}
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
        <Button
          value="<b>Create</b>"
          uiTransform={{
            width: '10vw',
            height: '3vw',
            borderRadius: 5,
            alignSelf: 'center',
            margin: { top: '2vw' }
          }}
          fontSize="1.2vw"
          uiBackground={primaryTheme.primaryButtonBackground}
          onMouseDown={() => {}}
        ></Button>
      </ModalWindow>
    )
  }
}
