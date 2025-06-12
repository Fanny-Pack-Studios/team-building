import {
  Entity,
  EntityUtils,
  Font,
  InputAction,
  Material,
  MeshCollider,
  MeshRenderer,
  PointerEventType,
  PointerEvents,
  Schemas,
  TextShape,
  Transform,
  engine,
  inputSystem,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'
import { syncEntity } from '@dcl/sdk/network'
import { PromptButton } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Button'
import { PromptInput } from 'dcl-ui-toolkit/dist/ui-entities/prompts/Prompt/components/Input'

const PollState = engine.defineComponent('pollState', {
  question: Schemas.String,
  options: Schemas.Array(Schemas.String),
})

export function main(): void {
  ReactEcsRenderer.setUiRenderer(ui.render)

  engine.addSystem(() => {
    const result = inputSystem.getInputCommand(
      InputAction.IA_PRIMARY,
      PointerEventType.PET_DOWN
    )
    if (result) {
      if (result.hit?.entityId) {
        let pollState = PollState.getOrNull(EntityUtils.toEntityId(result.hit.entityId, 0))
        if (pollState) {
          createQuestionUi(pollState.question, pollState.options)
        }
      }
    }
  })

  const myEntity = engine.addEntity()
  MeshRenderer.setBox(myEntity)
  MeshCollider.setBox(myEntity)
  Transform.create(myEntity, { position: Vector3.create(8, 1, 8) })

  // engine.addSystem(() => {
  //   if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, myEntity)) {
  //     console.log('here')
  //   }
  // })
  pointerEventsSystem.onPointerDown(
    {
      entity: myEntity,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Create Poll' }
    },
    function () {
      console.log('clicked entity')
      createPollUi()
    }
  )
}
function createPollUi(): void {
  let prevent = 1
  let answers: string[] = []
  let questionTitle: string = "Question title"
  let pollUiHeight = 500;
  let yPosition = pollUiHeight / 2.0;
  let answerPrompts: { text: string, answerPromptInput: PromptInput,  deleteButton: PromptButton }[] = []
  let initialAnswerY = 0;

  const createPollPrompt = ui.createComponent(ui.CustomPrompt, {
    style: ui.PromptStyles.DARKSLANTED,
    width: 500,
    height: pollUiHeight
  })

  const addAnswerPrompt = (answer: string, addDeleteButton: boolean) => {
    let i = answerPrompts.length;
    let buttonYPosition = initialAnswerY - i * 50;
    let answerPromptInput = createPollPrompt.addTextBox({
      yPosition: buttonYPosition,
      placeholder: 'Option ' + (i + 1),
      xPosition: 0,
      onChange: (value: string) => {
        answers[i] = value
      }
    })
    let button = createPollPrompt.addButton({
      style: ui.ButtonStyles.RED,
      text: 'x',
      yPosition: buttonYPosition - 20,
      xPosition: 150,
      onMouseDown: () => {}
    })
    button.onMouseDown = () => {
      answerPrompts.pop()
      answerPromptInput.hide()
      button.hide()
      if(answerPrompts.length > 1) {
        answerPrompts[answerPrompts.length - 1].deleteButton.show()
      }
    }
    answerPrompts.push({"text": answer, "answerPromptInput": answerPromptInput, "deleteButton": button })
    if(answerPrompts.length > 1) {
      answerPrompts[answerPrompts.length - 2].deleteButton.hide()
    }
  }

  createPollPrompt.addText({
    value: 'Create a poll',
    size: 30,
    yPosition: yPosition,
    xPosition: -70
  })

  yPosition -= 50;
  let questionTitleLabel = createPollPrompt.addText({
    value: 'Question Title',
    size: 15,
    yPosition: yPosition,
    xPosition: -150
  })

  yPosition -= 50;
  let questionTitlePrompt = createPollPrompt.addTextBox({
    yPosition: yPosition,
    placeholder: 'Question Title',
    xPosition: 0,
    onChange: (value: string) => {
      questionTitle = value
    }
  })

  yPosition -= 15;
  let answerPromptLabel = createPollPrompt.addText({
    value: 'Options',
    size: 15,
    yPosition: yPosition,
    xPosition: -150
  })

  initialAnswerY = yPosition - 50;
  for (let i = 0; i < 2; i++) {
    addAnswerPrompt('Option ' + (i + 1), false)
  }

  yPosition -= 350;
  createPollPrompt.addButton({
    style: ui.ButtonStyles.DARK,
    text: 'Add answer',
    yPosition: yPosition,
    xPosition: -100,
    onMouseDown: () => {
      addAnswerPrompt('', true)
    }
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
}

function createPollEntity(pollQuestion: string, answers: string[]): void {
  const pollEntity = engine.addEntity()
  Transform.create(pollEntity, { position: Vector3.create(18.85, 0.88, 20.49), scale: Vector3.create(3, 3, 3) })
  TextShape.create(pollEntity, {
    text: pollQuestion,
    textColor: { r: 1, g: 0, b: 0, a: 1 },
    fontSize: 5,
    font: Font.F_SANS_SERIF
  })
  // MeshRenderer.setSphere(pollEntity)
  MeshCollider.setSphere(pollEntity)
  Material.setPbrMaterial(pollEntity, {
    albedoColor: Color4.Green()
  })
  PollState.create(pollEntity, { question: pollQuestion, options: answers })

  // pointerEventsSystem.onPointerDown(
  //   {
  //     entity: pollEntity,
  //     opts: { button: InputAction.IA_PRIMARY, hoverText: 'Im a Poll click to vote' }
  //   },
  //   function () {
  //     console.log('clicked entity')
  //     createQuestionUi(pollQuestion, answers)
  //   }
  // )

  PointerEvents.create(pollEntity, {
    pointerEvents: [
      {
        eventType: PointerEventType.PET_DOWN,
        eventInfo: {
          button: InputAction.IA_PRIMARY,
        }
      }
    ]
  })

  syncEntity(pollEntity, [PointerEvents.componentId, Transform.componentId, TextShape.componentId, MeshCollider.componentId])
}

function createQuestionUi(pollQuestion: string, options: string[] = ['Yeah', 'Nope']): void {
  const prompt = ui.createComponent(ui.CustomPrompt, { style: ui.PromptStyles.DARKSLANTED })
  const promptHeader = prompt.addText({
    value: pollQuestion,
    size: 30,
    yPosition: 170,
    xPosition: -100
  })

  const buttonSpacing = 50
  const startY = ((options.length - 1) / 2) * buttonSpacing

  options.forEach((option, index) => {
    const promptButton = prompt.addButton({
      text: option,
      yPosition: startY - index * buttonSpacing,
      onMouseDown: () => {
        prompt.hide()
      }
    })
  })

  prompt.show()

  console.log("Prompt: ", prompt)
}
