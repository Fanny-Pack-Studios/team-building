import { PopupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupMessageBus } from '../messagebus/messagebus'
import { PollCreator } from '../polls/poll'
import { UIController } from './ui.controller'

export class GameController {
  public uiController: UIController
  public pollCreator: PollCreator
  public popupAtendeePanelAndResultbutton: PopupAttendeePanelAndResultsButton
  constructor() {
    this.uiController = new UIController(this)
    this.pollCreator = new PollCreator(this)
    this.popupAtendeePanelAndResultbutton = new PopupAttendeePanelAndResultsButton(this)
  }

  start(): void {
    setupMessageBus()
    this.popupAtendeePanelAndResultbutton.setupAttendeePanelAndResultsButton()
  }
}
