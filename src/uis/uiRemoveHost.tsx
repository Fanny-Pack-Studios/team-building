import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Dropdown, Label, scaleFontSize, UiEntity } from '@dcl/sdk/react-ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { type HostsController } from '../controllers/hosts.controller'
import { withPlayerInfo } from '../utils'

export class RemoveHostModal {
  public removeHostVisibility: boolean = false

  // This local list of hosts is to ensure a correlation between the index of the array and the corresponding hosts.
  private hosts: string[] = []
  private selectedHostIndex: number = -1

  constructor(private readonly hostsController: HostsController) {
    this.hostsController.onChange((newHosts) => {
      this.updateHosts(newHosts ?? [])
    })
    this.updateHosts(this.hostsController.getHosts())
  }

  updateHosts(someHosts: string[]): void {
    this.hosts = someHosts
    if (this.hosts.length > 0) {
      this.selectedHostIndex = 0
    }

    withPlayerInfo((player) => {
      if (!this.hostsController.isHost(player.userId)) {
        this.removeHostVisibility = false
      }
    })
  }

  removeSelectedHost(): void {
    if (this.selectedHostIndex !== -1) {
      this.hostsController.removeHost(this.hosts[this.selectedHostIndex])
    }
  }

  toggleVisibility(): void {
    this.removeHostVisibility = !this.removeHostVisibility
  }

  createRemoveHostModal(): ReactEcs.JSX.Element | null {
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
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
            width: '35%',
            height: '35%',
            display: 'flex'
          }}
          uiBackground={{ color: Color4.White() }}
        >
          <Label
            value="Select NAME/WALLET to remove host"
            fontSize={scaleFontSize(24)}
            color={Color4.Black()}
            textAlign="middle-center"
            uiTransform={{
              width: '90%',
              height: '20%',
              margin: '1vw 1vw 1vw 1vw'
            }}
          />

          <Dropdown
            options={this.hosts.map((host) => getPlayer({ userId: host })?.name ?? host)}
            onChange={(index) => {
              this.selectedHostIndex = index
            }}
            uiTransform={{ width: '50%', height: '15%' }}
            fontSize={scaleFontSize(18)}
            selectedIndex={this.selectedHostIndex >= 0 ? this.selectedHostIndex : 0}
          />

          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              value="PROCEED"
              variant="primary"
              fontSize={scaleFontSize(18)}
              uiTransform={{
                width: 'auto',
                height: 'auto',
                margin: '15px',
                borderRadius: '1vh',
                padding: '1vw'
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
}
