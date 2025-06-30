import { PopupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupMessageBus } from '../messagebus/messagebus'
import { PollCreator } from '../polls/poll'
import { ModeratorPanelUI } from '../uis/uiModeratorPanel'
import { StageUI } from '../uis/uiStage'

import { HostsController } from './hosts.controller'
import { UIController } from './ui.controller'

export class GameController {
  public uiController: UIController
  public hostsController: HostsController
  public pollCreator: PollCreator
  public popupAtendeePanelAndResultbutton: PopupAttendeePanelAndResultsButton
  public stageUI: StageUI
  public panelUI:  ModeratorPanelUI
  constructor() {
    this.uiController = new UIController(this)
    this.pollCreator = new PollCreator(this)
    this.popupAtendeePanelAndResultbutton = new PopupAttendeePanelAndResultsButton(this)
    this.hostsController = new HostsController()
    this.stageUI = new StageUI(this)
    this.panelUI = new ModeratorPanelUI(this)
  }

  start(): void {
    setupMessageBus()
    this.popupAtendeePanelAndResultbutton.setupAttendeePanelAndResultsButton()
  }
}
