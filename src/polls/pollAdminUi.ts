import * as ui from 'dcl-ui-toolkit'
import { type PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { Color4 } from '@dcl/sdk/math'
import { createPollEntity } from './pollEntity'
import { type PromptInput } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Input'
import { popupAttendeePanelAndResultsButton } from '../activitiesPanels'

// UI to create polls

type AnswerPrompts = Array<{ answerPromptInput: PromptInput; deleteButton: PromptButton }>

export function createPollAdminUi(): ui.CustomPrompt {
  const answers: string[] = []
  let questionTitle: string = ''

  const pollUiHeight = 550
  let yPosition = pollUiHeight / 2.0
  const answerPrompts: AnswerPrompts = []
  let initialAnswerY = 0
  let addAnswerButton: PromptButton | null = null
  let createButton: PromptButton | null = null
  let isAnonymous: boolean = false
  const validAnswers: () => string[] = () => answers.filter((answer) => answer.trim() !== '')
  const onAnswerPromptsChanged: () => void = () => {
    if (addAnswerButton !== null) {
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

    if (createButton !== null) {
      // Only enable the create button if we have a title and at least 2 answers
      const hasTitle = questionTitle.trim().length > 0

      const validAnswerCount = validAnswers().length
      if (hasTitle && validAnswerCount >= 2) {
        createButton.enable()
      } else {
        createButton.grayOut()
      }
    }
  }

  const createPollPrompt = ui.createComponent(ui.CustomPrompt, {
    style: ui.PromptStyles.DARKSLANTED,
    width: 500,
    height: pollUiHeight
  })

  const removeLastAnswerPrompt: () => void = () => {
    if (answerPrompts.length === 0) {
      return
    }
    answers.pop()
    const answerPrompt = answerPrompts.pop()
    if (answerPrompt === undefined) return
    const { answerPromptInput, deleteButton } = answerPrompt
    answerPromptInput.hide()
    deleteButton.hide()
    onAnswerPromptsChanged()
  }

  const addAnswerPrompt: () => void = () => {
    const idx: number = answerPrompts.length
    const buttonYPosition: number = initialAnswerY - idx * 50

    const answerPromptInput = createPollPrompt.addTextBox({
      yPosition: buttonYPosition,
      placeholder: 'Option ' + (idx + 1),
      xPosition: 0,
      onChange: (value: string) => {
        answers[idx] = value
        onAnswerPromptsChanged()
      }
    })

    const button = createPollPrompt.addButton({
      style: ui.ButtonStyles.RED,
      text: 'x',
      yPosition: buttonYPosition - 20,
      xPosition: 150,
      onMouseDown: removeLastAnswerPrompt
    })

    answerPrompts.push({ answerPromptInput, deleteButton: button })

    onAnswerPromptsChanged()
  }

  createPollPrompt.addText({
    value: 'Create a poll',
    size: 30,
    yPosition,
    xPosition: -70
  })

  yPosition -= 50
  createPollPrompt.addText({
    value: 'Question Title',
    size: 15,
    yPosition,
    xPosition: -150
  })

  yPosition -= 50
  createPollPrompt.addTextBox({
    yPosition,
    placeholder: 'Question Title',
    xPosition: 0,
    onChange: (value: string) => {
      questionTitle = value
      onAnswerPromptsChanged()
    }
  })

  yPosition -= 15
  createPollPrompt.addText({
    value: 'Options',
    size: 15,
    yPosition,
    xPosition: -150
  })

  initialAnswerY = yPosition - 50
  addAnswerPrompt()
  addAnswerPrompt()

  yPosition -= 180

  createPollPrompt.addText({
    value: 'Anonymous',
    size: 15,
    xPosition: -150,
    yPosition
  })

  createPollPrompt.addSwitch({
    text: '',
    xPosition: 100,
    yPosition: yPosition - 12,
    onCheck: () => {
      isAnonymous = true
    },
    onUncheck: () => {
      isAnonymous = false
    }
  })

  yPosition -= 150

  addAnswerButton = createPollPrompt.addButton({
    style: ui.ButtonStyles.DARK,
    text: 'Add answer',
    yPosition,
    xPosition: -100,
    onMouseDown: addAnswerPrompt
  })

  createPollPrompt.addText({
    value: 'Add a question and at least 2 options',
    size: 12,
    color: Color4.create(0.7, 0.7, 0.7, 1),
    yPosition,
    xPosition: -50
  })

  createButton = createPollPrompt.addButton({
    style: ui.ButtonStyles.F,
    text: 'Create',
    yPosition,
    xPosition: 100,
    onMouseDown: () => {
      popupAttendeePanelAndResultsButton()
      createPollEntity(questionTitle, validAnswers(), isAnonymous)
      createPollPrompt.hide()
    }
  })
  // Initially disable the Create button until we have valid inputs
  createButton?.grayOut()

  createPollPrompt.show()

  return createPollPrompt
}
