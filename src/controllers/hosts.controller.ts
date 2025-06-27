import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { waitForPlayerInfo } from '../utils'

export const HostComponent = engine.defineComponent('HostComponent', {
  hosts: Schemas.Array(Schemas.String)
})

export class HostsController {
  public readonly hostEntity: Entity = engine.addEntity()

  constructor() {
    HostComponent.create(this.hostEntity)
    syncEntity(this.hostEntity, [HostComponent.componentId], SyncEntityEnumId.HOSTS)
  }

  isHost(playerData: { userId: string; name: string }, hosts: string[] = this.getHosts()): boolean {
    return hosts.some((host) => playerData.name.toLowerCase() === host || playerData.userId.toLowerCase() === host)
  }

  getHosts(): string[] {
    return HostComponent.get(this.hostEntity).hosts
  }

  noHostExists(): boolean {
    return this.getHosts().length === 0
  }

  addHost(playerIdOrName: string): void {
    HostComponent.getMutable(this.hostEntity).hosts.push(playerIdOrName.toLowerCase())
  }

  onChange(cb: (newHosts: string[] | undefined) => void): void {
    HostComponent.onChange(this.hostEntity, (newState) => {
      cb(newState?.hosts)
    })
  }

  claimHost(): void {
    waitForPlayerInfo()
      .then((player) => {
        if (this.noHostExists()) {
          this.addHost(player.userId)
        }
      })
      .catch((err) => {
        console.error('Could not get current player info', err)
      })
  }
}
