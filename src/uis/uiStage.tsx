import { engine, MeshCollider } from '@dcl/sdk/ecs'
import { EntityNames } from '../../assets/scene/entity-names'
import { type GameController } from '../controllers/game.controller'
import { withPlayerInfo } from '../utils'

export class StageUI {
  public hostTarget = engine.addEntity()
  public hostTargetText = engine.addEntity()
  public gameController: GameController
  public stageUiVisibility: boolean = false
  playerSelected: string = ''

  private readonly stageWall = engine.getEntityByName<EntityNames>(EntityNames.StageWall)
  private readonly stageWallColliderComponent = MeshCollider.get(this.stageWall)

  constructor(gameController: GameController) {
    this.gameController = gameController

    this.gameController.playerController.onHostChange((newHosts) => {
      console.log('Hosts changed: ', newHosts)
      this.checkPlayerAccess(newHosts)
    })

    this.checkPlayerAccess(this.gameController.playerController.getHosts())
  }

  checkPlayerAccess(hosts: string[] | undefined): void {
    withPlayerInfo((player) => {
      const isHost = this.gameController.playerController.isHost(player.userId, hosts)
      const noHosts = hosts == null || hosts.length === 0

      if (noHosts || isHost) {
        this.unlockAccessToStage()
      } else {
        this.lockAccessToStage()
      }
    })
  }

  lockAccessToStage(): void {
    console.log('Access to stage locked')
    // Hack to ensure the collider is added
    let i = 0
    engine.addSystem(
      () => {
        MeshCollider.createOrReplace(this.stageWall, this.stageWallColliderComponent)
        i++
        if (i > 2) {
          engine.removeSystem('hackToEnsureColliderIsAdded')
        }
      },
      0,
      'hackToEnsureColliderIsAdded'
    )
  }

  unlockAccessToStage(): void {
    console.log('Access to stage unlocked')
    MeshCollider.deleteFrom(this.stageWall)
  }

  addAsHost(userID: string): void {
    if (userID === undefined) return
    this.gameController.playerController.setHost(userID, true)
  }
}
