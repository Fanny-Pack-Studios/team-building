import { GameController } from './controllers/game.controller'

export function main(): void {
  const gameController = new GameController()
  gameController.start()
}
