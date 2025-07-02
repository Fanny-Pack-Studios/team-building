import { type GameController } from '../controllers/game.controller'
import { onEnterScene, onLeaveScene } from '@dcl/sdk/src/players'

export type PlayerInfo = {
  userId: string
  name: string
}

export class PlayersOnScene {
  public gameController: GameController
  public allPlayers: PlayerInfo[] = []
  public displayPlayers: string[] = []

  constructor(gameController: GameController) {
    this.gameController = gameController

    onEnterScene((player) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!player) return

      const userId = player.userId
      const name = player.name

      const exists = this.allPlayers.some((p) => p.userId === userId)
      if (!exists) {
        this.allPlayers.push({ userId, name })
        console.log('ENTERED SCENE', { userId, name })

        this.generateTaggedPlayers()
        console.log('DISPLAY PLAYERS', this.displayPlayers)
      }
    })

    onLeaveScene((userId) => {
      if (userId.length === 0) return

      this.allPlayers = this.allPlayers.filter((p) => p.userId !== userId)
      console.log('LEFT SCENE', userId)

      this.generateTaggedPlayers()
      console.log('DISPLAY PLAYERS', this.displayPlayers)
    })
  }

  public generateTaggedPlayers(): void {
    this.displayPlayers = this.allPlayers.map((p) => {
      const last4 = p.userId.slice(-4)
      return `${p.name}#${last4}`
    })
  }

  public getUserIdFromDisplayName(displayName: string): string | undefined {
    console.log('display name', displayName)
    const splitIndex = displayName.lastIndexOf('#')
    if (splitIndex === -1) return undefined

    const namePart = displayName.slice(0, splitIndex)
    const last4 = displayName.slice(splitIndex + 1)

    const found = this.allPlayers.find((p) => p.name === namePart && p.userId.endsWith(last4))

    return found?.userId
  }

  getTaggedNamesFromWallets(wallets: string[]): string[] {
    return wallets.map((wallet) => {
      const found = this.allPlayers.find((p) => p.userId.toLowerCase() === wallet.toLowerCase())
      if (found == null) return wallet
      const last4 = found.userId.slice(-4)
      return `${found.name}#${last4}`
    })
  }
}
