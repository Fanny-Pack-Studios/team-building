import { engine, type Entity, InputAction, pointerEventsSystem } from '@dcl/sdk/ecs'
import { type GameController } from '../controllers/game.controller'

export class PollCreator {
  public podium: Entity | null = null
  public gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.podium = engine.getEntityOrNullByName('Podium')
    if (this.podium === null) return
    pointerEventsSystem.onPointerDown(
      {
        entity: this.podium,
        opts: { button: InputAction.IA_PRIMARY, hoverText: 'Choose Activity' }
      },
      () => {
        this.chooseYourActivityUi()
      }
    )
  }

  chooseYourActivityUi(): void {
    this.gameController.activitiesUI.openUI()
  }
}
