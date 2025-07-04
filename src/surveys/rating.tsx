import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type SurveyIcon } from './surveyIcon'

export type RatingNumber = 0 | 1 | 2 | 3 | 4 | 5
export type OptionsQuantity = 2 | 3 | 4 | 5

function IconEntity(props: {
  icon: SurveyIcon
  ratingValue: RatingNumber
  currentRating: RatingNumber
  onSelected: (ratingNumber: RatingNumber) => void
}): ReactEcs.JSX.Element {
  const highlighted = props.currentRating >= props.ratingValue
  const imageName: string = highlighted ? `${props.icon}_selected` : props.icon

  return (
    <UiEntity uiTransform={{ flexDirection: 'column', width: 'auto', height: 'auto', alignItems: 'center' }}>
      <Label value={props.ratingValue.toString()} textAlign="middle-center" fontSize="1vw"></Label>
      <UiEntity
        uiTransform={{ width: '3vw', height: '3vw' }}
        onMouseDown={() => {
          props.onSelected(props.ratingValue)
        }}
        uiBackground={{
          texture: { src: `images/createSurveyUi/${imageName}.png` },
          textureMode: 'center'
        }}
      ></UiEntity>
    </UiEntity>
  )
}

export function RatingSelector(props: {
  icon: SurveyIcon
  qty: OptionsQuantity
  onChange?: (newRating: RatingNumber) => void
  initialRating?: RatingNumber
}): ReactEcs.JSX.Element {
  const [currentValue, setCurrentValue] = ReactEcs.useState<RatingNumber>(props.initialRating ?? 0)
  const elements: ReactEcs.JSX.Element[] = []
  for (let i = 0; i < props.qty; i++) {
    elements.push(
      <IconEntity
        icon={props.icon}
        ratingValue={(i + 1) as RatingNumber}
        currentRating={currentValue}
        onSelected={(ratingNumber) => {
          setCurrentValue(ratingNumber)
          if (props.onChange !== undefined) props.onChange(ratingNumber)
        }}
      ></IconEntity>
    )
  }
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        width: '100%',
        height: 'auto',
        justifyContent: 'space-between',
        padding: '1vw 0'
      }}
    >
      {elements}
    </UiEntity>
  )
}
