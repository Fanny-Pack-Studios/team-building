import {
  Font,
  InputAction,
  Material,
  MeshCollider,
  MeshRenderer,
  TextShape,
  Transform,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'
export function main(): void {
  const myEntity = engine.addEntity()
  MeshRenderer.setBox(myEntity)
  MeshCollider.setBox(myEntity)
  Transform.create(myEntity, { position: Vector3.create(8, 1, 8) })
  // PointerEvents.create(myEntity, {
  //   pointerEvents: [
  //     {
  //       eventType: PointerEventType.PET_DOWN,
  //       eventInfo: {
  //         button: InputAction.IA_PRIMARY,
  //         showFeedback: false
  //       }
  //     }
  //   ]
  // })

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
      // createQuestionUi('question?')
    }
  )
}
function createPollUi(): void {
  ReactEcsRenderer.setUiRenderer(ui.render)
  let prevent = 1
  const prompt = ui.createComponent(ui.FillInPrompt, {
    title: 'Create a yes or not poll just to test',
    onAccept: (value: string) => {
      console.log('accepted vaslue:', value, prevent)
      if (prevent >= 2) {
        prompt.hide()
        createPollEntity(value)
      }
      prevent++
      // createPollEntity(value)
    }
  })

  prompt.show()
}
function createPollEntity(pollQuestion: string): void {
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
  pointerEventsSystem.onPointerDown(
    {
      entity: pollEntity,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Im a Poll click to vote' }
    },
    function () {
      console.log('clicked entity')
      createQuestionUi(pollQuestion)
    }
  )
}
function createQuestionUi(pollQuestion: string, options: string[] = ['Yeah', 'Nope']): void {
  const prompt = ui.createComponent(ui.CustomPrompt, { style: ui.PromptStyles.DARKSLANTED })
  const promptHeader = prompt.addText({
    value: pollQuestion,
    size: 30,
    yPosition: 170
  })

  // Dynamically generate one button per answer option
  const buttonSpacing = 250 // distance between buttons on X axis
  const startX = -((options.length - 1) / 2) * buttonSpacing // center buttons

  options.forEach((option, index) => {
    const style = index % 2 === 0 ? ui.ButtonStyles.E : ui.ButtonStyles.F
    const promptButton = prompt.addButton({
      style,
      text: option,
      buttonSize: 'auto',
      xPosition: startX + index * buttonSpacing,
      onMouseDown: () => {
        console.log(`${option} pressed`)
      }
    })

    // keep reference to avoid linter complaints of unused vars if needed
    console.log('button created', promptButton)
  })

  prompt.show()

  // prevent linter warnings for unused variables
  console.log('hotfix linter issue', promptHeader)
}
