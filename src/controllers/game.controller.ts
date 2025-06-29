import { setupAttendeePanelAndResultsButton } from '../activities/activitiesPanels'
import { setupMessageBus } from '../messagebus/messagebus'
import { PlayersOnScene } from '../players/playersOnScene'
import { addPollCreator } from '../polls/poll'
import { KickUI } from '../uis/uiKick'
import { ModeratorPanelUI } from '../uis/uiModeratorPanel'
import { StageUI } from '../uis/uiStage'
import { UIController } from './ui.controller'

export class GameController {
  public uiController: UIController
  public playersOnScene = new PlayersOnScene(this)
  public kickUI = new KickUI(this)
  public panelUI = new ModeratorPanelUI(this)
  public stageUI = new StageUI(this)
  constructor() {
    this.uiController = new UIController(this)
  }

  start(): void {
    addPollCreator()
    setupMessageBus()
    setupAttendeePanelAndResultsButton()
  }
}
