import { engine, InputAction, pointerEventsSystem } from '@dcl/sdk/ecs'
import { createPollAdminUi } from './pollAdminUi'

// Spawns a poll creator, which on interacted opens the admin UI to create polls
export function addPollCreator(): void {
  const podium = engine.getEntityOrNullByName('Podium')
  if (podium === null) return
  pointerEventsSystem.onPointerDown(
    {
      entity: podium,
      opts: { button: InputAction.IA_PRIMARY, hoverText: 'Create Poll' }
    },
    createPollAdminUi
  )
}
