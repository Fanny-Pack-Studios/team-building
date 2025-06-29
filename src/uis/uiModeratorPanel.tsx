import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'

export class ModeratorPanelUI {
  public panelUiVisibility: boolean = true
  private readonly icon: string = 'images/moderatormenu/moderator_tool_icon.png'
  public menuOpen: boolean = false
  public panel2Visible: boolean = false
  public gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  createPanelUi(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null
    const uiScaleFactor =
      (Math.min(this.gameController.uiController.canvasInfo.width, this.gameController.uiController.canvasInfo.height) /
        1080) *
      1.2
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column'
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            positionType: 'absolute',
            position: { top: '0%', left: '0%' },
            width: this.gameController.uiController.canvasInfo.height * 0.25,
            height: this.gameController.uiController.canvasInfo.height
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
              this.gameController.kickUI.toggleVisibility()
            }}
          >
            {/* Text UI */}
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '100%', top: '8%' }
              }}
              value={' KICK PLAYER'}
              fontSize={this.gameController.uiController.canvasInfo.height * 0.02}
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
              this.gameController.stageUI.toggleVisibility()
            }}
          >
            {/* Text UI */}
            <Label
              uiTransform={{
                positionType: 'absolute',
                position: { left: '100%', top: '8%' }
              }}
              value={' GRANT STAGE ACCESS'}
              fontSize={this.gameController.uiController.canvasInfo.height * 0.02}
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
