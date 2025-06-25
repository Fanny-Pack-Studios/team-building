import { engine, InputAction, pointerEventsSystem } from '@dcl/sdk/ecs'
import { createPollAdminUi } from '../polls/pollAdminUi'
import { customizationUi } from './ui.customization'
import { UIController } from '../ui.controller'
import ReactEcs from '@dcl/sdk/react-ecs'

export function setupPodium(uiController: UIController): void {
  const podium = engine.getEntityOrNullByName('Podium')
  if (podium === null) return
  pointerEventsSystem.onPointerDown(
    {
      entity: podium,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Create Poll' }
    },
    () => {
      // All this should be thrown away and rewritten once all the UI is react elements and no custom prompts are used
      let elements: ReactEcs.JSX.Element[] = []
      const pollAdminUi = createPollAdminUi()
      const pollAdminUiElement = pollAdminUi.render()
      const closeElements = () => {
        pollAdminUi.hide()
        elements.forEach((element) => uiController.remove(element))
        uiController.clear()
      }
      const customizationUiElement = customizationUi(closeElements)
      
      uiController.clear()
      elements.push(customizationUiElement)
      elements.push(pollAdminUiElement)
      elements.forEach((element) => uiController.add(element))

      pollAdminUi.onClose = closeElements
    }
  )
}
