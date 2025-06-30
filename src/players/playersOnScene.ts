import { engine, PlayerIdentityData, Transform } from '@dcl/sdk/ecs'
import { type GameController } from '../controllers/game.controller'
import { getPlayer } from '@dcl/sdk/src/players'

export class PlayersOnScene {
  public gameController: GameController
  public allPlayers: string[] = ['Select Player']

  constructor(gameController: GameController) {
    this.gameController = gameController
    engine.addSystem(this.fetchAllPlayers.bind(this))
  }

  fetchAllPlayers(_dt: number): void {
    for (const [, data] of engine.getEntitiesWith(PlayerIdentityData, Transform)) {
      const address = data.address
      const player = getPlayer({ userId: address })
      if (player === null)return
      // Solo agregamos si no está
      if (!this.allPlayers.includes(player?.name)) {
        this.allPlayers.push(player?.name)
        console.log('Jugador agregado:', player?.name)
      }
    }
  }
}
