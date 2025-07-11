import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { withPlayerInfo } from '../utils'
export class ModeratorIconUI {
  public panelUiVisibility: boolean = false
  private readonly icon: string = 'images/moderatormenu/moderator_tool_icon.png'
  private isHost: boolean = false
  public gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.gameController.hostsController.onChange(() => {
      this.updatePanel()
    })

    this.updatePanel()
  }

  updatePanel(): void {
    withPlayerInfo((player) => {
      this.isHost = this.gameController.hostsController.isHost(player.userId)
      this.panelUiVisibility = this.isHost
    })
  }

  createPanelUi(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null
    const uiScaleFactor =
      (Math.min(this.gameController.uiController.canvasInfo.width, this.gameController.uiController.canvasInfo.height) /
        1080) *
      1.2
    if (!this.panelUiVisibility) return null
    return (
      <UiEntity
        uiTransform={{
          positionType: 'absolute',
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
              this.openModeratorPanel()
            }}
          ></UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  openModeratorPanel(): void {
    this.gameController.newModerationPanel.panelVisible = true
  }
}
