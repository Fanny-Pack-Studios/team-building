import * as ui from 'dcl-ui-toolkit'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { engine, InputAction, MeshCollider, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { createPollEntity } from './pollEntity'
import { PromptInput } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Input'

// UI to create polls

type AnswerPrompts = { answerPromptInput: PromptInput, deleteButton: PromptButton }[]

export function createPollAdminUi(): ui.CustomPrompt {
  let answers: string[] = []
  let questionTitle: string = "Question title"
  let pollUiHeight = 500
  let yPosition = pollUiHeight / 2.0
  let answerPrompts: AnswerPrompts = []
  let initialAnswerY = 0
  let addAnswerButton: PromptButton

  const onAnswerPromptsChanged = () => {
    if (addAnswerButton) {
      // disable button to create new answers if there are 5 already (with the current sizes more than 5 do not fit)
      if (answerPrompts.length < 5) {
        addAnswerButton.enable()
      } else {
        addAnswerButton.grayOut()
      }
    }
    if (answerPrompts.length > 2) {
      // Only show the delete button in the last option
      answerPrompts[answerPrompts.length - 1].deleteButton.show()
      answerPrompts[answerPrompts.length - 2].deleteButton.hide()
    } else {
      // In this case, we only have 2 options which is the minimum
      answerPrompts[answerPrompts.length - 1].deleteButton.hide()
    }
  }

  const createPollPrompt = ui.createComponent(ui.CustomPrompt, {
    style: ui.PromptStyles.DARKSLANTED,
    width: 500,
    height: pollUiHeight
  })

  const removeLastAnswerPrompt = () => {
    if (answerPrompts.length === 0) {
      return
    }
    let { answerPromptInput, deleteButton } = answerPrompts.pop()!
    answerPromptInput.hide()
    deleteButton.hide()
    onAnswerPromptsChanged()
  }

  const addAnswerPrompt = () => {
    let idx: number = answerPrompts.length
    let buttonYPosition: number = initialAnswerY - idx * 50

    let answerPromptInput = createPollPrompt.addTextBox({
      yPosition: buttonYPosition,
      placeholder: 'Option ' + (idx + 1),
      xPosition: 0,
      onChange: (value: string) => {
        answers[idx] = value
      }
    })

    let button = createPollPrompt.addButton({
      style: ui.ButtonStyles.RED,
      text: 'x',
      yPosition: buttonYPosition - 20,
      xPosition: 150,
      onMouseDown: removeLastAnswerPrompt
    })

    answerPrompts.push({ "answerPromptInput": answerPromptInput, "deleteButton": button })
    onAnswerPromptsChanged()
  }

  createPollPrompt.addText({
    value: 'Create a poll',
    size: 30,
    yPosition: yPosition,
    xPosition: -70
  })

  yPosition -= 50
  createPollPrompt.addText({
    value: 'Question Title',
    size: 15,
    yPosition: yPosition,
    xPosition: -150
  })

  yPosition -= 50
  createPollPrompt.addTextBox({
    yPosition: yPosition,
    placeholder: 'Question Title',
    xPosition: 0,
    onChange: (value: string) => {
      questionTitle = value
    }
  })

  yPosition -= 15
  createPollPrompt.addText({
    value: 'Options',
    size: 15,
    yPosition: yPosition,
    xPosition: -150
  })

  initialAnswerY = yPosition - 50
  addAnswerPrompt()
  addAnswerPrompt()

  yPosition -= 350
  addAnswerButton = createPollPrompt.addButton({
    style: ui.ButtonStyles.DARK,
    text: 'Add answer',
    yPosition: yPosition,
    xPosition: -100,
    onMouseDown: addAnswerPrompt
  })

  createPollPrompt.addButton({
    style: ui.ButtonStyles.F,
    text: 'Create',
    yPosition: yPosition,
    xPosition: 100,
    onMouseDown: () => {
      createPollEntity(questionTitle, answers.slice(0, answerPrompts.length))
      createPollPrompt.hide()
    }
  })

  createPollPrompt.show()

  return createPollPrompt
}

