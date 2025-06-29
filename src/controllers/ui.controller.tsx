import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import * as ui from 'dcl-ui-toolkit'
import Canvas from '../canvas/Canvas'
import { ChooseActivityUI } from '../uis/uiActivities'
import { CreatePollUI } from '../uis/uiCreatePoll'
import { OptionsUI } from '../uis/uiOptions'
import { ResultsUI } from '../uis/uiResults'
import { type GameController } from './game.controller'

export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)

  public activitiesUI = new ChooseActivityUI(this)
  public createPollUI = new CreatePollUI(this)
  public createOptionUI = new OptionsUI(this)
  public resultsUI = new ResultsUI(this)
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    ReactEcsRenderer.setUiRenderer(this.render.bind(this))
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
          {this.gameController.kickUI.kickUiVisibility && this.gameController.kickUI.createKickUi()}
          {this.gameController.kickUI.blackScreenVisibility && this.gameController.kickUI.createBlackScreen()}
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
