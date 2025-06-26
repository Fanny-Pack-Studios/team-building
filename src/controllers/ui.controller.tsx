import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

import * as ui from 'dcl-ui-toolkit'
import { KickUI } from '../uis/uiKick'
import { ModeratorPanelUI } from '../uis/uiModeratorPanel'
import { StageUI } from '../uis/uiStage'
import Canvas from '../canvas/Canvas'
import { ChooseActivityUI } from '../uis/uiActivities'
import { CreatePollUI } from '../uis/uiCreatePoll'
import { CreateOptionsUI } from '../uis/uiOptions'

export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public kickUI = new KickUI(this)
  public stageUI = new StageUI(this)
  public panelUI = new ModeratorPanelUI(this)
  public activitiesUI = new ChooseActivityUI(this)
  public createPollUI = new CreatePollUI(this)
   public createOptionUI = new CreateOptionsUI(this)
  constructor() {
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
          {this.panelUI.panelUiVisibility && this.panelUI.createPanelUi()}
          {this.kickUI.kickUiVisibility && this.kickUI.createKickUi()}
          {this.kickUI.blackScreenVisibility && this.kickUI.createBlackScreen()}
          {this.stageUI.stageUiVisibility && this.stageUI.createStageUi()}
          {this.activitiesUI.chooseActivityUiVisibility && this.activitiesUI.createChooseActivityUi()}  
          {this.createPollUI.createPollUiVisibility && this.createPollUI.createUi()}  
          {this.createOptionUI.optionsUiVisibility && this.createOptionUI.createUi()}  
          {ui.render()}
        </Canvas>
      </UiEntity>
    )
  }
}
