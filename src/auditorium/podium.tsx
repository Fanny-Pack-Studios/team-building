import { engine, InputAction, pointerEventsSystem } from '@dcl/sdk/ecs'
import { type GameController } from '../controllers/game.controller'

export function setupPodium(gameController: GameController): void {
  const podium = engine.getEntityOrNullByName('Podium')
  if (podium === null) return
  pointerEventsSystem.onPointerDown(
    {
      entity: podium,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Interact' }
    },
    () => {
      gameController.mainMenuUI.isVisible = true
    }
  )
}
