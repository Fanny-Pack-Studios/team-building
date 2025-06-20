import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { KickUI } from './ui.kick'
import Canvas from './canvas/Canvas'
import * as ui from 'dcl-ui-toolkit'
export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public kickUI = new KickUI(this)
  constructor() {
    ReactEcsRenderer.setUiRenderer(this.render.bind(this))
  }

  start():void{
    console.log('UI Controller activated')
  }

  render(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return <UiEntity>
        <Canvas>
          {this.kickUI.kickUiVisibility && this.kickUI.createKickUi()}
          {this.kickUI.blackScreenVisibility && this.kickUI.createBlackScreen()}
          {ui.render()}
        </Canvas>
    </UiEntity>
  }
}
