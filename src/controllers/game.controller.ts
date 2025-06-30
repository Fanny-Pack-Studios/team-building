import { PopupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupMessageBus } from '../messagebus/messagebus'
import { PollCreator } from '../polls/poll'
import { ChooseActivityUI } from '../uis/uiActivities'
import { CreatePollUI } from '../uis/uiCreatePoll'
import { KickUI } from '../uis/uiKick'
import { ModeratorPanelUI } from '../uis/uiModeratorPanel'
import { OptionsUI } from '../uis/uiOptions'
import { ResultsUI } from '../uis/uiResults'
import { StageUI } from '../uis/uiStage'

import { HostsController } from './hosts.controller'
import { UIController } from './ui.controller'

export class GameController {
  public uiController: UIController
  public hostsController: HostsController
  public pollCreator: PollCreator
  public popupAtendeePanelAndResultbutton: PopupAttendeePanelAndResultsButton

  // UIS

  public stageUI: StageUI
  public panelUI: ModeratorPanelUI
  public kickUI: KickUI
  public activitiesUI: ChooseActivityUI
  public createPollUI: CreatePollUI
  public createOptionUI: OptionsUI
  public resultsUI: ResultsUI

  constructor() {
    this.uiController = new UIController(this)
    this.pollCreator = new PollCreator(this)
    this.popupAtendeePanelAndResultbutton = new PopupAttendeePanelAndResultsButton(this)
    this.hostsController = new HostsController()
    this.stageUI = new StageUI(this)
    this.panelUI = new ModeratorPanelUI(this)
    this.kickUI = new KickUI(this)
    this.activitiesUI = new ChooseActivityUI(this)
    this.createPollUI = new CreatePollUI(this)
    this.createOptionUI = new OptionsUI(this)
    this.resultsUI = new ResultsUI(this)
  }

  start(): void {
    setupMessageBus()
    this.popupAtendeePanelAndResultbutton.setupAttendeePanelAndResultsButton()
  }
}
