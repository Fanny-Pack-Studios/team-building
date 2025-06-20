import * as ui from 'dcl-ui-toolkit'
import { PollState } from './pollEntity'
import { type Entity } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/src/players'

export function triggerPollQuestion(entity: Entity): void {
  const pollState = PollState.getOrNull(entity)
  if (pollState !== null) {
    createPollQuestionUi(pollState.question, pollState.options, (option: string) => {
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

function createPollQuestionUi(
  pollQuestion: string,
  options: string[] = ['Yeah', 'Nope'],
  onOption: (option: string) => void
): ui.CustomPrompt {
  const prompt = ui.createComponent(ui.CustomPrompt, { style: ui.PromptStyles.DARKSLANTED })
  prompt.addText({
    value: pollQuestion,
    size: 30,
    yPosition: 170,
    xPosition: -100
  })

  const buttonSpacing = 50
  const startY = ((options.length - 1) / 2) * buttonSpacing

  options.forEach((option, index) => {
    prompt.addButton({
      text: option,
      yPosition: startY - index * buttonSpacing,
      xPosition: -100,
      onMouseDown: () => {
        onOption(option)
        prompt.hide()
      }
    })
  })

  prompt.show()

  return prompt
}

