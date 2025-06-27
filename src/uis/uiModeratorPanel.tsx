import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { type UIController } from '../controllers/ui.controller'
import { type HostsController } from '../controllers/hosts.controller'
import { waitForPlayerInfo } from '../utils'
export class ModeratorPanelUI {
  public panelUiVisibility: boolean = false
  private readonly icon: string = 'images/moderatormenu/moderator_tool_icon.png'
  public menuOpen: boolean = false
  public panel2Visible: boolean = false
  private isHost: boolean = false
  constructor(
    private readonly uiController: UIController,
    private readonly hostsController: HostsController
  ) {
    hostsController.onChange(() => {
      this.updatePanel()
    })

    this.updatePanel()
  }

  updatePanel(): void {
    waitForPlayerInfo()
      .then((player) => {
        this.isHost = this.hostsController.isHost(player)
        if (this.isHost || this.hostsController.noHostExists()) {
          console.log('Setting panel visibility to true')
          this.panelUiVisibility = true
        } else {
          this.panelUiVisibility = false
        }
      })
      .catch((error) => {
        console.error('Error getting player info:', error)
        this.panelUiVisibility = false
      })
  }

  createPanelUi(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null
    const uiScaleFactor =
      (Math.min(this.uiController.canvasInfo.width, this.uiController.canvasInfo.height) / 1080) * 1.2

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
          {this.isHost && (
            <MenuItem
              onMouseDown={() => {
                this.uiController.kickUI.toggleVisibility()
              }}
              num={1}
              label=" KICK PLAYER"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.uiController.canvasInfo.height}
            />
          )}
          {this.isHost && (
            <MenuItem
              onMouseDown={() => {
                this.uiController.stageUI.toggleVisibility()
              }}
              num={2}
              label=" GRANT STAGE ACCESS"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.uiController.canvasInfo.height}
            />
          )}
          {this.hostsController.noHostExists() && (
            <MenuItem
              onMouseDown={() => {
                this.hostsController.claimHost()
              }}
              num={1}
              label=" CLAIM HOST"
              panel2Visible={this.panel2Visible}
              canvasHeight={this.uiController.canvasInfo.height}
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
        texture: { src: `https://i.postimg.cc/Ghxs5njT/teleport-tool-mainmenu-button${props.num}.png` }
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
