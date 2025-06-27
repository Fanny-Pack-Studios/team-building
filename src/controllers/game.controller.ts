import { setupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupMessageBus } from '../messagebus/messagebus'
import { addPollCreator } from '../polls/poll'
import { HostsController } from './hosts.controller'
import { UIController } from './ui.controller'

export class GameController {
  public uiController: UIController
  public hostsController: HostsController
  constructor() {
    this.hostsController = new HostsController()
    this.uiController = new UIController(this)
  }

  start(): void {
    addPollCreator()
    setupMessageBus()
    setupAttendeePanelAndResultsButton()
  }
}
