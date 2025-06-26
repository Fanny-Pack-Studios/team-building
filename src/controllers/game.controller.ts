import { setupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupMessageBus } from '../messagebus/messagebus'
import { addPollCreator } from '../polls/poll'
import { UIController } from './ui.controller'

export class GameController {
  public uiController: UIController
  constructor() {
    this.uiController = new UIController()
  }

  start(): void {
    addPollCreator()
    setupMessageBus()
    setupAttendeePanelAndResultsButton()
  }
}
