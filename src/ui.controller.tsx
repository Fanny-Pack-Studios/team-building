import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { KickUI } from './ui.kick'
import Canvas from './canvas/Canvas'
import * as ui from 'dcl-ui-toolkit'
import { StageUI } from './ui.stage'
import { ModeratorPanelUI } from './ui.moderator.panel'
export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public kickUI = new KickUI(this)
  public stageUI = new StageUI(this)
  public panelUI = new ModeratorPanelUI(this)
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

          {ui.render()}
        </Canvas>
      </UiEntity>
    )
  }
}
