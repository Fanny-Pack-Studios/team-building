import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { withPlayerInfo } from '../utils'
import { type GameController } from './game.controller'

export const HostComponent = engine.defineComponent('HostComponent', {
  hosts: Schemas.Array(Schemas.String)
})

export class HostsController {
  public readonly hostEntity: Entity = engine.addEntity()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    HostComponent.create(this.hostEntity)
    syncEntity(this.hostEntity, [HostComponent.componentId], SyncEntityEnumId.HOSTS)
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
    this.gameController.playerController.setHost(playerIdOrName.toLowerCase(), true)
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
