import { engine, type Entity } from '@dcl/sdk/ecs'
import { withPlayerInfo } from '../utils'
import { type GameController } from './game.controller'
import { PlayerStateComponent } from './player.controller'

// export const PlayerStateComponent = engine.defineComponent('PlayerStateComponent', {
//   hosts: Schemas.Array(Schemas.String)
// })

export class HostsController {
  public readonly hostEntity: Entity = engine.addEntity()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  isHost(userId: string, hosts: string[] = this.getHosts()): boolean {
    return hosts.some((host) => userId.toLowerCase() === host.toLowerCase())
  }

  getHosts(): string[] {
    return PlayerStateComponent.get(this.gameController.playerController.playerState).hostList
  }

  noHostExists(): boolean {
    return this.getHosts().length === 0
  }

  addHost(playerIdOrName: string): void {
    PlayerStateComponent.getMutable(this.gameController.playerController.playerState).hostList.push(
      playerIdOrName.toLowerCase()
    )
    this.gameController.playerController.setHost(playerIdOrName.toLowerCase(), true)
  }

  onChange(cb: (newHosts: string[] | undefined) => void): void {
    PlayerStateComponent.onChange(this.gameController.playerController.playerState, (newState) => {
      cb(newState?.hostList)
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
    const mutableHosts = PlayerStateComponent.getMutable(this.gameController.playerController.playerState).hostList
    const index = mutableHosts.indexOf(host)
    if (index !== -1) {
      mutableHosts.splice(index, 1)
    }
  }
}
