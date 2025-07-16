import ReactEcs, { Label, type PositionUnit, UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { getSurveyState, type SurveyStateType } from '../surveys/surveyEntity'
import { ModalButton } from './components/buttons'
import { ModalTitle } from './components/modalTitle'
import { ModalWindow } from './components/modalWindow'
import { getScaleFactor } from '../canvas/Canvas'
import { SurveyResultColors } from './themes/themes'
import { engine } from '@dcl/sdk/ecs'

function SurveyResultOption(props: {
  optionsQty: number
  option: number
  percentage: number
  maxPercentage: number | undefined
}): ReactEcs.JSX.Element {
  const { option, optionsQty, percentage, maxPercentage } = props
  const color = SurveyResultColors[Math.min(option, SurveyResultColors.length) - 1]
  return (
    <UiEntity
      uiTransform={{
        width: `${(100 / (optionsQty * 1.5)).toString()}%` as PositionUnit,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Label
        value={`<b>${Math.round(percentage * 100)}%</b>`}
        uiTransform={{
          width: '100%',
          height: 48 * getScaleFactor(),
          alignSelf: 'flex-start',
          justifyContent: 'center'
        }}
        textAlign="middle-center"
        textWrap="nowrap"
        fontSize={12 * getScaleFactor()}
        color={color}
      ></Label>
      <UiEntity uiTransform={{ width: '100%', height: '100%', justifyContent: 'flex-end', flexDirection: 'column' }}>
        <UiEntity
          uiTransform={{
            width: '100%',
            height: `${(100 * percentage) / (maxPercentage ?? 1)}%`
          }}
          uiBackground={{ color }}
        ></UiEntity>
      </UiEntity>

      <Label
        value={option.toString()}
        uiTransform={{ width: '100%', height: 36 * getScaleFactor() }}
        fontSize={12 * getScaleFactor()}
        textAlign="middle-center"
      ></Label>
    </UiEntity>
  )
}

export class SurveyResultsUI {
  public isVisible: boolean = true
  private readonly animatedPercentages = new Map<number, number>()
  private readonly lastPercentages = new Map<number, number>()

  constructor(private readonly gameController: GameController) {
    engine.addSystem((dt) => {
      this.update(dt)
    })
  }

  update(dt: number): void {
    if (!this.isVisible) return

    const state = getSurveyState(this.gameController.activitiesEntity)
    if (state == null) return

    const { percentages } = this.calculatePercentages(state)

    const animationSpeed = 1.2

    for (let i = 1; i <= state.optionsQty; i++) {
      const target = percentages.get(i)?.percentage ?? 0
      const current = this.animatedPercentages.get(i) ?? 0

      if (current < target) {
        const newVal = Math.min(current + animationSpeed * dt, target)
        this.animatedPercentages.set(i, newVal)
      } else if (current > target) {
        const newVal = Math.max(current - animationSpeed * dt, target)
        this.animatedPercentages.set(i, newVal)
      }
    }
  }

  createUi(): ReactEcs.JSX.Element | null {
    if (!this.isVisible) return null
    const state = getSurveyState(this.gameController.activitiesEntity)
    if (state === null) return null

    const { maxPercentage } = this.calculatePercentages(state)

    const optionsItems = []
    for (let i = 0; i < state.optionsQty; i++) {
      const animatedPercentage = this.animatedPercentages.get(i + 1) ?? 0
      optionsItems.push(
        <SurveyResultOption
          option={i + 1}
          optionsQty={state.optionsQty}
          percentage={animatedPercentage}
          maxPercentage={maxPercentage}
        />
      )
    }

    return (
      <ModalWindow
        visible={this.isVisible}
        onClosePressed={() => {
          this.isVisible = false
        }}
        uiTransform={{ justifyContent: 'space-between' }}
      >
        <UiEntity
          uiTransform={{
            width: '100%',
            height: '85%',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <ModalTitle value={state.question} uiTransform={{ height: 'auto' }} />
          <UiEntity
            uiTransform={{
              height: '60%',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            {optionsItems}
          </UiEntity>
        </UiEntity>

        <ModalButton
          text="Close"
          onMouseDown={() => {
            this.isVisible = false
          }}
        ></ModalButton>
      </ModalWindow>
    )
  }

  calculatePercentages(state: SurveyStateType): {
    percentages: Map<number, { votes: number; percentage: number }>
    maxPercentage: number | undefined
  } {
    const totalVotes = state.votes.length

    const votesPerOption = state.votes.reduce<Map<number, number>>(
      (currentVotes, vote) => currentVotes.set(vote.option, (currentVotes.get(vote.option) ?? 0) + 1),
      new Map()
    )

    const result = new Map<number, { votes: number; percentage: number }>()
    let maxPercentage: number | undefined

    for (const [option, votes] of votesPerOption) {
      const percentage = votes / totalVotes
      result.set(option, { votes, percentage })
      if (maxPercentage === undefined || percentage > maxPercentage) {
        maxPercentage = percentage
      }
    }

    return { percentages: result, maxPercentage }
  }
}
