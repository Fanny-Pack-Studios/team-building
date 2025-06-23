import { Color4 } from '@dcl/sdk/math'
import { type UIController } from './ui.controller'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

export class ModeratorPanelUI {
  uiController: UIController
  public panelUiVisibility: boolean = true
  private readonly icon: string = 'images/moderator_tool_icon.png'
  public menuOpen: boolean = false
  public panel2Visible: boolean = false
  constructor(uiController: UIController) {
    this.uiController = uiController
  }

  createPanelUi(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null
    const uiScaleFactor =
      (Math.min(this.uiController.canvasInfo.width, this.uiController.canvasInfo.height) / 1080) * 1.2
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            positionType: 'absolute',
            position: { top: '0%', left: '0%' },
            width: this.uiController.canvasInfo.height * 0.25,
            height: this.uiController.canvasInfo.height
          }}
        >
          <UiEntity
            uiTransform={{
              flexDirection: 'column',
              width: 42 * uiScaleFactor,
              height: 42 * uiScaleFactor,
              justifyContent: 'flex-end',
              positionType: 'absolute',
              position: { top: '30%', left: '20%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: this.icon }
            }}
            onMouseDown={() => {
              this.toggleMenu()
            }}
          ></UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              width: '18%',
              height: '4.8%',
              justifyContent: 'flex-end',
              positionType: 'absolute',
              position: { top: '38%', left: '20%' },
              display: this.panel2Visible ? 'flex' : 'none'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'https://i.postimg.cc/Ghxs5njT/teleport-tool-mainmenu-button1.png' }
            }}
            onMouseDown={() => {
                this.uiController.kickUI.toggleVisibility()
            }}
          >
            {/* Text UI */}
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '100%', top: '8%' }
              }}
              value={' KICK PLAYER'}
              fontSize={this.uiController.canvasInfo.height * 0.02}
              font="sans-serif"
              color={Color4.White()}
            />
          </UiEntity>
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              width: '18%',
              height: '4.8%',
              justifyContent: 'flex-end',
              positionType: 'absolute',
              position: { top: '44%', left: '20%' },
              display: this.panel2Visible ? 'flex' : 'none'
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'https://i.postimg.cc/N059F9vR/teleport-tool-mainmenu-button2.png' }
            }}
            onMouseDown={() => {
                this.menuOpen = false
                this.uiController.stageUI.toggleVisibility()
            }}
          >
            {/* Text UI */}
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '100%', top: '8%' }
              }}
              value={' GRANT STAGE ACCESS'}
              fontSize={this.uiController.canvasInfo.height * 0.02}
              font="sans-serif"
              color={Color4.White()}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  toggleMenu(): void {
    if (!this.menuOpen) {
      this.panel2Visible = true
      this.menuOpen = true
    } else {
      this.panel2Visible = false
      this.menuOpen = false
    }
  }
}
