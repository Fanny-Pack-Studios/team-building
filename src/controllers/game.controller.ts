import { PopupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupCustomization } from '../auditorium/customization'
import { setupPodium } from '../auditorium/podium'
import { setupMessageBus } from '../messagebus/messagebus'
import { HostIndicators } from '../uis/hostIndicators'
import { CustomizationUI } from '../uis/ui.customization'
import { ChooseActivityUI } from '../uis/uiActivities'
import { ChoosePollUI } from '../uis/uiChoosePoll'
import { CloseActivityUI } from '../uis/uiCloseActivity'
import { CreatePollUI } from '../uis/uiCreatePoll'
import { ZonePollUI } from '../uis/uiCreateZonePoll'
import { KickUI } from '../uis/uiKick'
import { OptionsUI } from '../uis/uiOptions'
import { ResultsUI as PollResultsUI } from '../uis/uiPollResults'
import { RemoveHostModal } from '../uis/uiRemoveHost'
import { StageUI } from '../uis/uiStage'
import { TimerUI } from '../uis/uiTimer'
import { ZonePollQuestionUI } from '../uis/uiZonePollQuestion'
import { type OptionZone } from '../zonePolls/optionZone'

import { createActivitiesEntity } from '../activities/activitiesEntity'
import { Jail } from '../jail/jail'
import { SurveyQuestionUI } from '../surveys/surveyQuestionUi'
import { MainMenuUi } from '../uis/ui.mainMenu'
import { CreateSurveyUI } from '../uis/uiCreateSurvey'
import { type Entity } from '@dcl/sdk/ecs'
import { ZonePollSystem } from '../zonePolls/zonPollSystem'
import { ModerationPanel } from '../uis/uiModerationPanel'
import { ModeratorIconUI } from '../uis/uiModeratorIcon'
import { SurveyResultsUI } from '../uis/uiSurveyResults'
import { WorkInProgressUI } from '../uis/uiWorkInProgress'
import { HostsController } from './hosts.controller'
import { PlayerController } from './player.controller'
import { UIController } from './ui.controller'
import { setupVotingDoors } from '../auditorium/votingDoors'

export class GameController {
  public uiController: UIController
  public hostsController: HostsController
  public popupAtendeePanelAndResultbutton: PopupAttendeePanelAndResultsButton
  public playerController: PlayerController
  public jail: Jail
  public activitiesEntity: Entity

  // UIS

  public mainMenuUI: MainMenuUi
  public stageUI: StageUI
  public iconPanelUI: ModeratorIconUI
  public kickUI: KickUI
  public activitiesUI: ChooseActivityUI
  public createPollUI: CreatePollUI
  public createOptionUI: OptionsUI
  public createSurveyUI: CreateSurveyUI
  public surveyResultsUI: SurveyResultsUI
  public pollResultsUI: PollResultsUI
  public timerUI: TimerUI
  public closePollUi: CloseActivityUI
  public removeHostUI: RemoveHostModal
  public hostIndicators: HostIndicators
  public choosePollUI: ChoosePollUI
  public createZonePollUI: ZonePollUI
  public zonePollQuestionUI: ZonePollQuestionUI
  public zonePollSystem: ZonePollSystem
  public newModerationPanel: ModerationPanel

  // Zones
  public zone1: OptionZone | null
  public zone2: OptionZone | null
  public zone3: OptionZone | null
  public zone4: OptionZone | null
  public zoneUpdateSystems = new Set<(dt: number) => void>()

  public customizationUI: CustomizationUI
  public workInProgressUI: WorkInProgressUI
  zonePollDataEntity: Entity | null = null
  public surveyQuestionUI: SurveyQuestionUI

  constructor() {
    this.playerController = new PlayerController(this)
    this.hostsController = new HostsController(this)
    this.activitiesEntity = createActivitiesEntity()
    this.uiController = new UIController(this)
    this.popupAtendeePanelAndResultbutton = new PopupAttendeePanelAndResultsButton(this)
    this.stageUI = new StageUI(this)
    this.iconPanelUI = new ModeratorIconUI(this)
    this.kickUI = new KickUI(this)
    this.activitiesUI = new ChooseActivityUI(this)
    this.createPollUI = new CreatePollUI(this)
    this.createOptionUI = new OptionsUI(this)
    this.createSurveyUI = new CreateSurveyUI(this)
    this.surveyQuestionUI = new SurveyQuestionUI(this)
    this.pollResultsUI = new PollResultsUI(this)
    this.surveyResultsUI = new SurveyResultsUI(this)
    this.timerUI = new TimerUI(this)
    this.closePollUi = new CloseActivityUI(this)
    this.removeHostUI = new RemoveHostModal(this)
    this.hostIndicators = new HostIndicators(this.hostsController)
    this.choosePollUI = new ChoosePollUI(this)
    this.createZonePollUI = new ZonePollUI(this)
    this.zonePollQuestionUI = new ZonePollQuestionUI(this)
    this.zonePollSystem = new ZonePollSystem(this)

    this.newModerationPanel = new ModerationPanel(this)

    this.zone1 = null
    this.zone2 = null
    this.zone3 = null
    this.zone4 = null
    this.removeHostUI = new RemoveHostModal(this)
    this.hostIndicators = new HostIndicators(this.hostsController)
    this.customizationUI = new CustomizationUI()
    this.mainMenuUI = new MainMenuUi(this)
    this.workInProgressUI = new WorkInProgressUI(this)

    this.jail = new Jail(this)
  }

  start(): void {
    setupVotingDoors()
    setupCustomization()
    setupMessageBus(this)
    this.zonePollSystem.start()
    this.popupAtendeePanelAndResultbutton.setupAttendeePanelAndResultsButton()
    setupPodium(this)
  }
}
