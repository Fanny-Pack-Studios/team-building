import { PopupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupCustomization } from '../auditorium/customization'
import { setupPodium } from '../auditorium/podium'
import { setupMessageBus } from '../messagebus/messagebus'
import { PlayersOnScene } from '../players/playersOnScene'
import { HostIndicators } from '../uis/hostIndicators'
import { CustomizationUI } from '../uis/ui.customization'
import { ChooseActivityUI } from '../uis/uiActivities'
import { ClosePollUI } from '../uis/uiClosePoll'
import { CreatePollUI } from '../uis/uiCreatePoll'
import { KickUI } from '../uis/uiKick'
import { ModeratorPanelUI } from '../uis/uiModeratorPanel'
import { OptionsUI } from '../uis/uiOptions'
import { RemoveHostModal } from '../uis/uiRemoveHost'
import { ResultsUI } from '../uis/uiResults'
import { StageUI } from '../uis/uiStage'
import { TimerUI } from '../uis/uiTimer'

import { MainMenuUi } from '../uis/ui.mainMenu'
import { HostsController } from './hosts.controller'
import { UIController } from './ui.controller'
import { WorkInProgressUI } from '../uis/uiWorkInProgress'

export class GameController {
  public uiController: UIController
  public hostsController: HostsController
  public popupAtendeePanelAndResultbutton: PopupAttendeePanelAndResultsButton
  public playersOnScene: PlayersOnScene

  // UIS

  public mainMenuUI: MainMenuUi
  public stageUI: StageUI
  public panelUI: ModeratorPanelUI
  public kickUI: KickUI
  public activitiesUI: ChooseActivityUI
  public createPollUI: CreatePollUI
  public createOptionUI: OptionsUI
  public resultsUI: ResultsUI
  public timerUI: TimerUI
  public closePollUi: ClosePollUI
  public removeHostUI: RemoveHostModal
  public hostIndicators: HostIndicators
  public customizationUI: CustomizationUI
  public workInProgressUI: WorkInProgressUI

  constructor() {
    this.hostsController = new HostsController()
    this.uiController = new UIController(this)
    this.popupAtendeePanelAndResultbutton = new PopupAttendeePanelAndResultsButton(this)
    this.stageUI = new StageUI(this)
    this.panelUI = new ModeratorPanelUI(this)
    this.kickUI = new KickUI(this)
    this.activitiesUI = new ChooseActivityUI(this)
    this.createPollUI = new CreatePollUI(this)
    this.createOptionUI = new OptionsUI(this)
    this.resultsUI = new ResultsUI(this)
    this.timerUI = new TimerUI(this)
    this.closePollUi = new ClosePollUI(this)
    this.playersOnScene = new PlayersOnScene(this)
    this.removeHostUI = new RemoveHostModal(this.hostsController)
    this.hostIndicators = new HostIndicators(this.hostsController)
    this.customizationUI = new CustomizationUI()
    this.mainMenuUI = new MainMenuUi(this)
    this.workInProgressUI = new WorkInProgressUI(this)
  }

  start(): void {
    setupCustomization()
    setupMessageBus(this)
    this.popupAtendeePanelAndResultbutton.setupAttendeePanelAndResultsButton()
    setupPodium(this)
  }
}
