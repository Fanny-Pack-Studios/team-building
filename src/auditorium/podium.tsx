import { engine, type EventSystemCallback, InputAction, PointerEvents, pointerEventsSystem } from '@dcl/sdk/ecs'
import { type GameController } from '../controllers/game.controller'
import { withPlayerInfo } from '../utils'

export function setupPodium(gameController: GameController): void {
  const podiumOrNull = engine.getEntityOrNullByName('Podium')
  if (podiumOrNull === null) return

  const podium = podiumOrNull

  gameController.hostsController.onChange(() => {
    updatePodiumActions()
  })

  updatePodiumActions()

  function updatePodiumActions(): void {
    withPlayerInfo((player) => {
      if (gameController.hostsController.isHost(player.userId)) {
        configurePodiumForHosts()
      } else if (gameController.hostsController.noHostExists()) {
        configurePodiumForClaimingHost()
      } else {
        disablePodium()
      }
    })
  }

  function configurePodiumForHosts(): void {
    configurePodium('Interact', () => {
      gameController.mainMenuUI.isVisible = true
    })
  }

  function configurePodiumForClaimingHost(): void {
    configurePodium('Claim Host', () => {
      gameController.hostsController.claimHost()
    })
  }

  function configurePodium(text: string, callback: EventSystemCallback): void {
    pointerEventsSystem.onPointerDown(
      {
        entity: podium,
        opts: { button: InputAction.IA_POINTER, hoverText: text }
      },
      callback
    )
  }

  function disablePodium(): void {
    PointerEvents.deleteFrom(podium)
  }
}
