import { UIController } from './ui.controller'
import { setupMessageBus } from './messagebus/messagebus'
import { setupAttendeePanelAndResultsButton } from './auditorium/activitiesPanels'
import { setupPodium } from './auditorium/podium'

export function main(): void {
  const uiController = new UIController()
  uiController.start()

  setupPodium(uiController)

  setupMessageBus()
  setupAttendeePanelAndResultsButton()
}
