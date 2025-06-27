import { setupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupMessageBus } from '../messagebus/messagebus'
import { PollCreator } from '../polls/poll'
import { UIController } from './ui.controller'

export class GameController {
  public uiController: UIController
  public pollCreator: PollCreator
  constructor() {
    this.uiController = new UIController(this)
    this.pollCreator = new PollCreator(this)
  }

  start(): void {
    // addPollCreator()
    setupMessageBus()
    setupAttendeePanelAndResultsButton()
  }
}
