import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Dropdown, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { withPlayerInfo } from '../utils'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'

export class RemoveHostModal {
  public removeHostVisibility: boolean = false

  // This local list of hosts is to ensure a correlation between the index of the array and the corresponding hosts.
  private hosts: string[] = []
  private selectedHostIndex: number = -1
  private readonly gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.gameController.hostsController.onChange((newHosts) => {
      this.updateHosts(newHosts ?? [])
    })
    this.updateHosts(this.gameController.hostsController.getHosts())
  }

  updateHosts(someHosts: string[]): void {
    this.hosts = someHosts
    if (this.hosts.length > 0) {
      this.selectedHostIndex = 0
    }

    withPlayerInfo((player) => {
      if (!this.gameController.hostsController.isHost(player.userId)) {
        this.removeHostVisibility = false
      }
    })
  }

  removeSelectedHost(): void {
    if (this.selectedHostIndex !== -1) {
      this.gameController.hostsController.removeHost(this.hosts[this.selectedHostIndex])
    }
  }

  toggleVisibility(): void {
    this.gameController.uiController.closeAllModerationUIs()
    this.removeHostVisibility = !this.removeHostVisibility
  }

  createRemoveHostModal(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.removeHostVisibility ? 'flex' : 'none'
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            positionType: 'absolute',
            width: 550 * getScaleFactor(), // Use scale factor to make it responsive
            height: 300 * getScaleFactor(), // Use scale factor to make it responsive
            borderRadius: 15
          }}
          uiBackground={{ color: Color4.White() }}
        >
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: 22 * getScaleFactor(),
              height: 22 * getScaleFactor(),
              position: { top: '3%', right: '2%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/moderatormenu/exit.png' }
            }}
            onMouseDown={() => {
              this.removeHostVisibility = false
            }}
          ></UiEntity>
          <Label
            value="Select Player to Remove Host Access"
            fontSize={24 * getScaleFactor()}
            color={Color4.Black()}
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              margin: '20px 20px 20px 20px'
            }}
          />
          <UiEntity
            uiTransform={{
              flexDirection: 'row', // Set to 'row' to align children (Input, Label) side by side
              width: 400 * getScaleFactor(),
              height: 50 * getScaleFactor(),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Dropdown
              options={this.hosts.map((host) => getPlayer({ userId: host })?.name ?? host)}
              onChange={(index) => {
                this.selectedHostIndex = index
              }}
              uiTransform={{
                width: 300 * getScaleFactor(),
                height: 40 * getScaleFactor()
              }}
              fontSize={16 * getScaleFactor()}
              selectedIndex={this.selectedHostIndex >= 0 ? this.selectedHostIndex : 0}
            />
          </UiEntity>

          <Label
            value="Do you want to proceed?"
            fontSize={24 * getScaleFactor()}
            color={Color4.Black()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              margin: '5px 5px 5px 5px'
            }}
          />

          <UiEntity
            uiTransform={{
              flexDirection: 'row', // Set to 'row' to align children side by side
              width: 450 * getScaleFactor(),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              value="PROCEED"
              variant="primary"
              fontSize={18 * getScaleFactor()}
              uiTransform={{
                width: 200 * getScaleFactor(),
                height: 40 * getScaleFactor(),
                margin: '15px',
                borderRadius: 10
              }}
              onMouseDown={() => {
                this.removeSelectedHost()
              }}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  removeHostByUserId(userId: string): void {
    const index = this.hosts.indexOf(userId)
    if (index !== -1) {
      this.gameController.hostsController.removeHost(this.hosts[index])
    } else {
      console.log(`User ${userId} not found in hosts list.`)
    }
  }
}
