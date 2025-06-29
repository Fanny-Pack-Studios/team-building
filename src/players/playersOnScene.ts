import { engine, PlayerIdentityData, Transform } from '@dcl/sdk/ecs'
import { type GameController } from '../controllers/game.controller'
import { getPlayer } from '@dcl/sdk/src/players'

export class PlayersOnScene {
  public gameController: GameController
  public allPlayers: Array<{ address: string; name: string }> = []

  constructor(gameController: GameController) {
    this.gameController = gameController
    engine.addSystem(this.fetchAllPlayers.bind(this))
  }

  fetchAllPlayers(_dt: number): void {
    // Obtenemos *mi* propio player (nombre y address)
    const myPlayer = getPlayer()
    if (myPlayer == null) return

    const myAddress = myPlayer.userId
    const myName = myPlayer.name

    // Limpiar lista para este ciclo (opcional)
    this.allPlayers = []

    // Buscar todos en escena
    for (const [, data] of engine.getEntitiesWith(PlayerIdentityData, Transform)) {
      // Siempre tenés la address del player en data.address
      const playerAddress = data.address.toLowerCase()

      // Es mi propio player?
      if (playerAddress === myAddress.toLowerCase()) {
        this.allPlayers.push({
          address: myAddress,
          name: myName
        })
      } else {
        // OPCIONAL: si querés agregar a otros players igual, aunque sea solo con address
        // this.allPlayers.push({ address: playerAddress, name: '' })
      }
    }
  }
}
