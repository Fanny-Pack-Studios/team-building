import { PopupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupCustomization } from '../auditorium/customization'
import { setupPodium } from '../auditorium/podium'
import { setupMessageBus } from '../messagebus/messagebus'
import { PlayersOnScene } from '../players/playersOnScene'
import { HostIndicators } from '../uis/hostIndicators'
import { CustomizationUI } from '../uis/ui.customization'
import { ChooseActivityUI } from '../uis/uiActivities'
import { ChoosePollUI } from '../uis/uiChoosePoll'
import { ClosePollUI } from '../uis/uiClosePoll'
import { CreatePollUI } from '../uis/uiCreatePoll'
import { ZonePollUI } from '../uis/uiCreateZonePoll'
import { KickUI } from '../uis/uiKick'
import { ModeratorPanelUI } from '../uis/uiModeratorPanel'
import { OptionsUI } from '../uis/uiOptions'
import { RemoveHostModal } from '../uis/uiRemoveHost'
import { ResultsUI } from '../uis/uiResults'
import { StageUI } from '../uis/uiStage'
import { TimerUI } from '../uis/uiTimer'
import { ZonePollQuestionUI } from '../uis/uiZonePollQuestion'
import { type OptionZone } from '../zonePolls/optionZone'

import { MainMenuUi } from '../uis/ui.mainMenu'
import { HostsController } from './hosts.controller'
import { UIController } from './ui.controller'
import { WorkInProgressUI } from '../uis/uiWorkInProgress'
import { CreateSurveyUI } from '../uis/uiCreateSurvey'
import { type Entity } from '@dcl/sdk/ecs'
import { ZonePollSystem } from '../zonePolls/zonPollSystem'

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
  public createSurveyUI: CreateSurveyUI
  public resultsUI: ResultsUI
  public timerUI: TimerUI
  public closePollUi: ClosePollUI
  public removeHostUI: RemoveHostModal
  public hostIndicators: HostIndicators
  public choosePollUI: ChoosePollUI
  public createZonePollUI: ZonePollUI
  public zonePollQuestionUI: ZonePollQuestionUI
  public zonePollSystem: ZonePollSystem

  // Zones
  public zone1: OptionZone | null
  public zone2: OptionZone | null
  public zone3: OptionZone | null
  public zone4: OptionZone | null
  public zoneUpdateSystems = new Set<(dt: number) => void>()

  public customizationUI: CustomizationUI
  public workInProgressUI: WorkInProgressUI
  zonePollDataEntity: Entity | null = null

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
    this.createSurveyUI = new CreateSurveyUI(this)
    this.resultsUI = new ResultsUI(this)
    this.timerUI = new TimerUI(this)
    this.closePollUi = new ClosePollUI(this)
    this.removeHostUI = new RemoveHostModal(this)
    this.hostIndicators = new HostIndicators(this.hostsController)
    this.choosePollUI = new ChoosePollUI(this)
    this.createZonePollUI = new ZonePollUI(this)
    this.zonePollQuestionUI = new ZonePollQuestionUI(this)
    this.zonePollSystem = new ZonePollSystem(this)

    this.zone1 = null
    this.zone2 = null
    this.zone3 = null
    this.zone4 = null
    this.playersOnScene = new PlayersOnScene(this)
    this.removeHostUI = new RemoveHostModal(this)
    this.hostIndicators = new HostIndicators(this.hostsController)
    this.customizationUI = new CustomizationUI()
    this.mainMenuUI = new MainMenuUi(this)
    this.workInProgressUI = new WorkInProgressUI(this)
  }

  start(): void {
    setupCustomization()
    setupMessageBus(this)
    this.zonePollSystem.start()
    this.popupAtendeePanelAndResultbutton.setupAttendeePanelAndResultsButton()
    setupPodium(this)
  }
}
