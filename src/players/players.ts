// PlayerManager.ts

import { onEnterScene, onLeaveScene } from '@dcl/sdk/players'
import { type GameController } from '../controllers/game.controller'
import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
export type Player = {
  name: string
  wallet: string
  isBanned: boolean
  isHost: boolean
}
export const PlayerStateComponent = engine.defineComponent('PlayerStateComponent', {
  banList: Schemas.Array(Schemas.String),
  hostList: Schemas.Array(Schemas.String)
})

export class PlayerManager {
  public players = new Map<string, Player>()
  public playerState: Entity = engine.addEntity()
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.registerEventListeners()
    PlayerStateComponent.create(this.playerState)
    syncEntity(this.playerState, [PlayerStateComponent.componentId])
  }

  private registerEventListeners(): void {
    onEnterScene((player) => {
      this.addPlayer(player.userId, player.name)
    })

    onLeaveScene((userId) => {
      this.removePlayer(userId)
    })
  }

  private addPlayer(userId: string, name: string): void {
    if (this.players.has(userId)) return

    const newPlayer: Player = {
      name,
      wallet: userId,
      isBanned: false,
      isHost: false
    }

    this.players.set(userId, newPlayer)
    console.log(`Player entered: ${name} (${userId})`)
  }

  private removePlayer(userId: string): void {
    if (this.players.delete(userId)) {
      console.log(`Player left: ${userId}`)
    }
  }

  getPlayer(userId: string): Player | undefined {
    return this.players.get(userId)
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values())
  }

  setBan(userId: string, banned: boolean): void {
    const player = this.players.get(userId)
    if (player != null) {
      player.isBanned = banned
    }
  }

  setHost(userId: string, isHost: boolean): void {
    const player = this.players.get(userId)
    if (player != null) {
      player.isHost = isHost
    }
  }
}
