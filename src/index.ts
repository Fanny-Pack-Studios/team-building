import { UIController } from './ui.controller'
import { addPollCreator } from './polls/poll'
import { setupMessageBus } from './messagebus/messagebus'
import { setupAttendeePanelAndResultsButton } from './activitiesPanels'

export function main(): void {
  const uiController = new UIController()
  uiController.start()

  addPollCreator()

  setupMessageBus()
  setupAttendeePanelAndResultsButton()
}
