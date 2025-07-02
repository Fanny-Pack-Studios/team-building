import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { withPlayerInfo } from '../utils'
export class ModeratorPanelUI {
  public panelUiVisibility: boolean = false
  private readonly icon: string = 'images/moderatormenu/moderator_tool_icon.png'
  public menuOpen: boolean = false
  public panel2Visible: boolean = false
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
      this.panelUiVisibility = this.isHost || this.gameController.hostsController.noHostExists()
    })
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
          {this.isHost && (
            <MenuItem
              onMouseDown={() => {
                this.gameController.kickUI.toggleVisibility('kick')
              }}
              num={1}
              label=" BAN PLAYER"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.gameController.uiController.canvasInfo.height}
              textureSrc='https://i.postimg.cc/Ghxs5njT/teleport-tool-mainmenu-button1.png'
            />
          )}
          {this.isHost && (
            <MenuItem
              onMouseDown={() => {
                this.gameController.stageUI.toggleVisibility()
              }}
              num={2}
              label=" GRANT STAGE ACCESS"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.gameController.uiController.canvasInfo.height}
              textureSrc='https://i.postimg.cc/N059F9vR/teleport-tool-mainmenu-button2.png'
            />
          )}

          {this.isHost && (
            <MenuItem
              onMouseDown={() => {
                this.gameController.removeHostUI.toggleVisibility()
              }}
              num={3}
              label=" REMOVE HOST"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.gameController.uiController.canvasInfo.height}
              textureSrc='https://i.postimg.cc/vZ86R2Pq/teleport-tool-mainmenu-button3.png'
            />
          )}

            {this.isHost && (
            <MenuItem
              onMouseDown={() => {
                this.gameController.kickUI.toggleVisibility('unKick')
              }}
              num={4}
              label=" UNBAN PLAYER"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.gameController.uiController.canvasInfo.height}
              textureSrc='https://i.postimg.cc/Vk70z9pY/teleport-tool-mainmenu-button4.png'
            />
          )}
          {this.gameController.hostsController.noHostExists() && (
            <MenuItem
              onMouseDown={() => {
                this.gameController.hostsController.claimHost()
              }}
              num={1}
              label=" CLAIM HOST"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.gameController.uiController.canvasInfo.height}
              textureSrc='https://i.postimg.cc/Ghxs5njT/teleport-tool-mainmenu-button1.png'
            />
          )}
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

function MenuItem(props: {
  num: number
  label: string
  onMouseDown: () => void
  panel2Visible: boolean
  canvasHeight: number
  textureSrc: string
}): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        flexDirection: 'row',
        width: '18%',
        height: '4.8%',
        justifyContent: 'flex-end',
        positionType: 'absolute',
        position: { top: `${38 + (props.num - 1) * 8}%`, left: '20%' },
        display: props.panel2Visible ? 'flex' : 'none'
      }}
      uiBackground={{
        textureMode: 'stretch',
        texture: { src: props.textureSrc }
      }}
      onMouseDown={() => {
        props.onMouseDown()
      }}
    >
      {/* Text UI */}
      <Label
        uiTransform={{
          positionType: 'absolute',
          position: { left: '100%', top: '8%' }
        }}
        value={props.label}
        fontSize={props.canvasHeight * 0.02}
        font="sans-serif"
        color={Color4.White()}
      />
    </UiEntity>
  )
}
