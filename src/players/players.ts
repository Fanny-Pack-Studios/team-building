// PlayerManager.ts

import { onEnterScene, onLeaveScene } from '@dcl/sdk/players'
import { type GameController } from '../controllers/game.controller'
export type Player = {
  name: string
  wallet: string
  isBanned: boolean
  isHost: boolean
}
export class PlayerManager {
  public players = new Map<string, Player>()

  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.registerEventListeners()
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
