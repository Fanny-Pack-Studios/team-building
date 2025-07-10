import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { ModalWindow } from '../uis/components/modalWindow'
import { ModalTitle } from '../uis/components/modalTitle'
import { getCurrentActivity } from '../activities/activitiesEntity'
import { SurveyState } from './surveyEntity'
import { withPlayerInfo, type ComponentState } from '../utils'
import { type OptionsQuantity, type RatingNumber, RatingSelector } from './rating'
import { ModalButton } from '../uis/components/buttons'

export class SurveyQuestionUI {
  public isVisible: boolean = false
  private currentRating: RatingNumber = 1

  private readonly lastVotedOption?: { rating: RatingNumber; surveyId: string } // TODO

  constructor(private readonly gameController: GameController) {}

  createUi(): ReactEcs.JSX.Element | null {
    const surveyState = this.getSurveyState()
    if (surveyState === null) return null

    if (surveyState.closed)
      return (
        <ModalWindow
          visible={this.isVisible}
          onClosePressed={() => {
            this.isVisible = false
          }}
        >
          <ModalTitle value="Survey Closed"></ModalTitle>
          <ModalButton text="OK" onMouseDown={() => (this.isVisible = false)}></ModalButton>
        </ModalWindow>
      )

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
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <ModalTitle value={surveyState.question} uiTransform={{ height: 'auto' }} />
          <Label
            uiTransform={{ width: '100%', height: '4vh', margin: { bottom: '2vw', top: '1vw' } }}
            fontSize="1.2vw"
            textAlign="middle-center"
            value={`Rate from 1 to ${surveyState.optionsQty}`}
          />
          <RatingSelector
            icon={surveyState.icon}
            qty={surveyState.optionsQty as OptionsQuantity}
            initialRating={this.currentRating}
            onChange={(newRating) => {
              this.currentRating = newRating
            }}
          ></RatingSelector>
        </UiEntity>

        <ModalButton
          text="Vote"
          onMouseDown={() => {
            this.createOrUpdateVote()
          }}
        ></ModalButton>
      </ModalWindow>
    )
  }

  createOrUpdateVote(): void {
    withPlayerInfo((player) => {
      const currentActivity = getCurrentActivity(this.gameController.activitiesEntity)

      if (currentActivity === undefined) {
        console.log('Cannot vote. Current activity is undefined')
        return
      }

      const mutableSurvey = SurveyState.getMutable(currentActivity.entity)

      if (this.lastVotedOption !== undefined && this.lastVotedOption.surveyId === mutableSurvey.id) {
        // TODO change vote
      } else {
        mutableSurvey.userIdsThatVoted.push(player.userId)
        mutableSurvey.votes.push({ userId: player.userId, option: this.currentRating })
      }
    })

    this.isVisible = false
  }

  getSurveyState(): ComponentState<typeof SurveyState> | null {
    const currentActivity = getCurrentActivity(this.gameController.activitiesEntity)

    if (currentActivity === undefined) {
      return null
    }

    return SurveyState.getOrNull(currentActivity.entity)
  }
}
