import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'

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

  addHost(playerIdOrName: string): void {
    HostComponent.getMutable(this.hostEntity).hosts.push(playerIdOrName.toLowerCase())
  }

  onChange(cb: (newHosts: string[] | undefined) => void): void {
    HostComponent.onChange(this.hostEntity, (newState) => {
      cb(newState?.hosts)
    })
  }
}
