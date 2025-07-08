import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { withPlayerInfo } from '../utils'
import { onLeaveScene } from '@dcl/sdk/src/players'
export const HostComponent = engine.defineComponent('HostComponent', {
  hosts: Schemas.Array(Schemas.String)
})

export class HostsController {
  public readonly hostEntity: Entity = engine.addEntity()
  private readonly checkTimer = 0
  private readonly CHECK_INTERVAL = 5

  constructor() {
    HostComponent.create(this.hostEntity)
    syncEntity(this.hostEntity, [HostComponent.componentId], SyncEntityEnumId.HOSTS)
    onLeaveScene((userId) => {
      if (userId.length === 0) return

      const lowerId = userId.toLowerCase()
      const currentHosts = this.getHosts()

      if (currentHosts.includes(lowerId)) {
        this.removeHost(lowerId)
        console.log('[HostController] Host removed on leaveScene:', lowerId)
      }
    })
  }

  isHost(userId: string, hosts: string[] = this.getHosts()): boolean {
    return hosts.some((host) => userId.toLowerCase() === host.toLowerCase())
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
    withPlayerInfo((player) => {
      if (this.noHostExists()) {
        this.addHost(player.userId)
      }
    })
  }

  removeHost(host: string): void {
    const mutableHosts = HostComponent.getMutable(this.hostEntity).hosts
    const index = mutableHosts.indexOf(host)
    if (index !== -1) {
      mutableHosts.splice(index, 1)
    }
  }
}
