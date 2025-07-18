import { InputAction, inputSystem } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { type EntityPropTypes, UiEntity } from '@dcl/sdk/react-ecs'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'
import { withPlayerInfo } from '../utils'

function iconSize(): number {
  return 20 * getScaleFactor()
}

function ToolbarButton(props: EntityPropTypes & { icon: string; onClick?: () => void }): ReactEcs.JSX.Element {
  const [isHovering, setHovering] = ReactEcs.useState(false)
  const [isPressed, setPressed] = ReactEcs.useState(false)
  const backgroundAlpha = isPressed ? 0.4 : 0.1
  return (
    <UiEntity
      uiTransform={{
        width: 'auto',
        height: 'auto',
        borderRadius: 6 * getScaleFactor(),
        margin: 3 * getScaleFactor()
      }}
      uiBackground={{ color: isHovering ? Color4.create(1.0, 1.0, 1.0, backgroundAlpha) : Color4.Clear() }}
    >
      <UiEntity
        onMouseEnter={() => {
          setHovering(true)
          if (isPressed && !inputSystem.isPressed(InputAction.IA_POINTER)) {
            setPressed(false)
          }
        }}
        onMouseLeave={() => {
          setHovering(false)
        }}
        onMouseDown={() => {
          setPressed(true)
        }}
        onMouseUp={() => {
          if (isPressed && props.onClick !== undefined) {
            props.onClick()
          }
          setPressed(false)
        }}
        uiTransform={{ width: iconSize(), height: iconSize(), margin: 5 * getScaleFactor() }}
        uiBackground={{
          texture: { src: `images/toolbar/${props.icon}_icon.png` },
          textureMode: 'stretch',
          color: isPressed && isHovering ? Color4.Yellow() : Color4.White()
        }}
      ></UiEntity>
    </UiEntity>
  )
}

export class HostsToolbarUI {
  public isVisible: boolean = false
  constructor(private readonly gameController: GameController) {
    withPlayerInfo((player) => {
      this.gameController.playerController.onHostChange((hosts) => {
        this.isVisible = this.gameController.playerController.isHost(player.userId, hosts)
      })

      this.isVisible = this.gameController.playerController.isHost(player.userId)
    })
  }

  showMainMenu(): void {
    this.gameController.uiController.closeAllUis()
    this.gameController.mainMenuUI.isVisible = true
  }

  showModeratorPanel(): void {
    this.gameController.uiController.closeAllUis()
    this.gameController.newModerationPanel.panelVisible = true
  }

  createUi(): ReactEcs.JSX.Element | null {
    if (!this.isVisible) {
      return null
    }
    return (
      <UiEntity
        uiTransform={{
          width: 'auto',
          height: '100%',
          positionType: 'absolute',
          position: { right: 8 * getScaleFactor(), top: 0 },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <UiEntity
          uiBackground={{ color: Color4.create(0, 0, 0, 0.7) }}
          uiTransform={{
            width: 'auto',
            height: 'auto',
            borderRadius: 10 * getScaleFactor(),
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <ToolbarButton icon="home" onClick={this.showMainMenu.bind(this)}></ToolbarButton>
          <ToolbarButton icon="moderation" onClick={this.showModeratorPanel.bind(this)}></ToolbarButton>
        </UiEntity>
      </UiEntity>
    )
  }
}
