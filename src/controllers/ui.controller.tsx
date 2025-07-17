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
      // Black Screen UI MUST be always the last one
      <UiEntity>
        <Canvas>
          {this.gameController.activitiesUI.createChooseActivityUi()}
          {this.gameController.createPollUI.createUi()}
          {this.gameController.createOptionUI.createUi()}
          {this.gameController.createSurveyUI.createUi()}
          {this.gameController.pollResultsUI.createUi()}
          {this.gameController.timerUI.createUi()}
          {this.gameController.closePollUi.createUi()}
          {this.gameController.choosePollUI.createChoosePollUi()}
          {this.gameController.createZonePollUI.createUi()}
          {this.gameController.zonePollQuestionUI.createUi()}
          {this.gameController.customizationUI.create()}
          {this.gameController.mainMenuUI.create()}
          {this.gameController.workInProgressUI.create()}
          {this.gameController.newModerationPanel.create()}
          {this.gameController.kickUI.createBlackScreen()}
          {this.gameController.surveyQuestionUI.createUi()}
          {this.gameController.surveyResultsUI.createUi()}
          {this.gameController.zonePollResultUI.createUi()}
          {this.gameController.hostsToolbar.createUi()}
          {ui.render()}
        </Canvas>
      </UiEntity>
    )
  }

  closeAllUis(): void {
    this.gameController.activitiesUI.chooseActivityUiVisibility = false
    this.gameController.createPollUI.createPollUiVisibility = false
    this.gameController.createOptionUI.optionsUiVisibility = false
    this.gameController.createSurveyUI.isVisible = false
    this.gameController.pollResultsUI.resultsUiVisibility = false
    this.gameController.timerUI.visible = false
    this.gameController.closePollUi.isVisible = false
    this.gameController.choosePollUI.choosePollUiVisibility = false
    this.gameController.createZonePollUI.createZonePollUiVisibility = false
    this.gameController.zonePollQuestionUI.visible = false
    this.gameController.customizationUI.isVisible = false
    this.gameController.mainMenuUI.isVisible = false
    this.gameController.workInProgressUI.isVisible = false
    this.gameController.newModerationPanel.panelVisible = false
    this.gameController.kickUI.blackScreenVisibility = false
    this.gameController.surveyQuestionUI.isVisible = false
    this.gameController.surveyResultsUI.isVisible = false
  }
}
