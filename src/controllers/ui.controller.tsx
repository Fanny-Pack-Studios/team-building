import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import * as ui from 'dcl-ui-toolkit'
import { KickUI } from '../uis/uiKick'
import Canvas from '../canvas/Canvas'
import { ChooseActivityUI } from '../uis/uiActivities'
import { CreatePollUI } from '../uis/uiCreatePoll'
import { OptionsUI } from '../uis/uiOptions'
import { ResultsUI } from '../uis/uiResults'
import { type GameController } from './game.controller'

export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public gameController: GameController
  public kickUI = new KickUI(this)
  public activitiesUI = new ChooseActivityUI(this)
  public createPollUI = new CreatePollUI(this)
  public createOptionUI = new OptionsUI(this)
  public resultsUI = new ResultsUI(this)

  constructor(gameController: GameController) {
    ReactEcsRenderer.setUiRenderer(this.render.bind(this))
    this.gameController = gameController
  }

  start(): void {
    console.log('UI Controller activated')
  }

  render(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity>
        <Canvas>
          {this.gameController.panelUI.panelUiVisibility && this.gameController.panelUI.createPanelUi()}
          {this.kickUI.kickUiVisibility && this.kickUI.createKickUi()}
          {this.kickUI.blackScreenVisibility && this.kickUI.createBlackScreen()}
          {this.gameController.stageUI.stageUiVisibility && this.gameController.stageUI.createStageUi()}
          {this.activitiesUI.chooseActivityUiVisibility && this.activitiesUI.createChooseActivityUi()}
          {this.createPollUI.createPollUiVisibility && this.createPollUI.createUi()}
          {this.createOptionUI.optionsUiVisibility && this.createOptionUI.createUi()}
          {this.resultsUI.resultsUiVisibility && this.resultsUI.createUi()}
          {ui.render()}
        </Canvas>
      </UiEntity>
    )
  }
}
