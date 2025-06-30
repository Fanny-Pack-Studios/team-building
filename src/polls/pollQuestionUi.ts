import { PollState } from './pollEntity'
import { type Entity } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { type GameController } from '../controllers/game.controller'

export class PollQuestion {
  gameController: GameController
  constructor(gameController: GameController, entity: Entity) {
    this.gameController = gameController
    this.triggerPollQuestion(entity)
  }

  triggerPollQuestion(entity: Entity): void {
    const pollState = PollState.getOrNull(entity)
    if (pollState !== null) {
      this.createPollQuestionUi(pollState.question, pollState.options, (option: string) => {
        const mutablePoll = PollState.getMutable(entity)

        if (pollState.anonymous) {
          mutablePoll.votes.push({
            userId: '',
            option
          })
        } else {
          const userId = getPlayer()?.userId
          if (userId === undefined) return

          const existingVoteIndex = mutablePoll.votes.findIndex((vote) => vote.userId === userId)

          if (existingVoteIndex >= 0) {
            mutablePoll.votes[existingVoteIndex].option = option
          } else {
            mutablePoll.votes.push({
              userId,
              option
            })
          }
        }
      })
    }
  }

  createPollQuestionUi(
    pollQuestion: string,
    options: string[] = ['Yeah', 'Nope'],
    onOption: (option: string) => void
  ): void {
    this.gameController.uiController.createOptionUI.openUI(pollQuestion, options, onOption)
  }
}
