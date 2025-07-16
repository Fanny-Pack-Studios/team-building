// PlayerManager.ts

import { onEnterScene, onLeaveScene } from '@dcl/sdk/players'
import { type GameController } from './game.controller'
import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { withPlayerInfo } from '../utils'

export type Player = {
  name: string
  wallet: string
}

export const PlayerStateComponent = engine.defineComponent('PlayerStateComponent', {
  banList: Schemas.Array(Schemas.String),
  hostList: Schemas.Array(Schemas.String)
})

export class PlayerController {
  public players = new Map<string, Player>()
  public playerState: Entity = engine.addEntity()
  public readonly hostEntity: Entity = engine.addEntity()
  gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
    this.registerEventListeners()
    PlayerStateComponent.create(this.playerState, { banList: [], hostList: [] })
    syncEntity(this.playerState, [PlayerStateComponent.componentId], SyncEntityEnumId.PLAYER_STATES)
  }

  private registerEventListeners(): void {
    onEnterScene((player) => {
      this.addPlayer(player.userId, player.name)
    })

    onLeaveScene((userId) => {
      this.removePlayer(userId)
    })
  }

  // players

  private addPlayer(userId: string, name: string): void {
    if (this.players.has(userId)) return

    const newPlayer: Player = {
      name,
      wallet: userId
    }

    this.players.set(userId, newPlayer)
    console.log(`Player entered: ${name} (${userId})`)
  }

  private removePlayer(userId: string): void {
    if (this.players.delete(userId)) {
      this.removeFromBanList(userId)
      this.removeFromHostList(userId)
      console.log(`Player left: ${userId}`)
    }
  }

  getPlayer(userId: string): Player | undefined {
    return this.players.get(userId)
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values())
  }

  // === Ban list operations ===

  isPlayerBanned(userId: string): boolean {
    const state = PlayerStateComponent.get(this.playerState)
    return state.banList.includes(userId)
  }

  setBan(userId: string, banned: boolean): void {
    if (banned) {
      this.addToBanList(userId)
    } else {
      this.removeFromBanList(userId)
    }
    this.gameController.kickUI.updateKickStatus()
  }

  private addToBanList(userId: string): void {
    const component = PlayerStateComponent.getMutableOrNull(this.playerState)
    if (component === null) return
    if (!component.banList.includes(userId)) {
      component.banList.push(userId)
      console.log(`Added to ban list: ${userId}`)
    }
  }

  private removeFromBanList(userId: string): void {
    const component = PlayerStateComponent.getMutableOrNull(this.playerState)
    if (component === null) return
    component.banList = component.banList.filter((id) => id !== userId)
    console.log(`Removed from ban list: ${userId}`)
  }

  // === Host list operations ===

  isPlayerHost(userId: string): boolean {
    const state = PlayerStateComponent.get(this.playerState)
    return state.hostList.includes(userId)
  }

  setHost(userId: string, isHost: boolean): void {
    if (isHost) {
      this.addToHostList(userId)
    } else {
      this.removeFromHostList(userId)
    }
  }

  private addToHostList(userId: string): void {
    const component = PlayerStateComponent.getMutableOrNull(this.playerState)
    if (component === null) return
    if (!component.hostList.includes(userId)) {
      component.hostList.push(userId)
      console.log(`Added to host list: ${userId}`)
    }
  }

  private removeFromHostList(userId: string): void {
    const component = PlayerStateComponent.getMutableOrNull(this.playerState)
    if (component === null) return
    component.hostList = component.hostList.filter((id) => id !== userId)
    console.log(`Removed from host list: ${userId}`)
  }

  isHost(userId: string, hosts: string[] = this.getHosts()): boolean {
    return hosts.some((host) => userId.toLowerCase() === host.toLowerCase())
  }

  getHosts(): string[] {
    return PlayerStateComponent.get(this.playerState).hostList
  }

  noHostExists(): boolean {
    return this.getHosts().length === 0
  }

  onChange(cb: (newHosts: string[] | undefined) => void): void {
    PlayerStateComponent.onChange(this.playerState, (newState) => {
      cb(newState?.hostList)
    })
  }

  claimHost(): void {
    withPlayerInfo((player) => {
      if (this.noHostExists()) {
        this.setHost(player.userId, true)
      }
    })
  }
}
