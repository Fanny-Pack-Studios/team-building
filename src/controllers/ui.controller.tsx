import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import * as ui from 'dcl-ui-toolkit'
import Canvas from '../canvas/Canvas'
import { type GameController } from './game.controller'

export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public gameController: GameController

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
          {this.gameController.kickUI.kickUiVisibility && this.gameController.kickUI.createKickUi()}
          {this.gameController.kickUI.blackScreenVisibility && this.gameController.kickUI.createBlackScreen()}
          {this.gameController.stageUI.stageUiVisibility && this.gameController.stageUI.createStageUi()}
          {this.gameController.activitiesUI.chooseActivityUiVisibility &&
            this.gameController.activitiesUI.createChooseActivityUi()}
          {this.gameController.createPollUI.createPollUiVisibility && this.gameController.createPollUI.createUi()}
          {this.gameController.createOptionUI.optionsUiVisibility && this.gameController.createOptionUI.createUi()}
          {this.gameController.resultsUI.resultsUiVisibility && this.gameController.resultsUI.createUi()}
          {this.gameController.timerUI.visible && this.gameController.timerUI.createUi()}
          {this.gameController.closePollUi.isVisible && this.gameController.closePollUi.createUi()}
          {this.gameController.removeHostUI.removeHostVisibility &&
            this.gameController.removeHostUI.createRemoveHostModal()}
          {this.gameController.customizationUI.create()}
          {this.gameController.mainMenuUI.create()}
          {ui.render()}
        </Canvas>
      </UiEntity>
    )
  }
}
