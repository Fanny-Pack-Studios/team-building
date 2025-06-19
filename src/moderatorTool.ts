import { Billboard, engine, GltfContainer, MeshCollider, Schemas, TextShape, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { syncEntity } from '@dcl/sdk/network'
import { getPlayer } from '@dcl/sdk/src/players'

export const ModeratorComponent = engine.defineComponent('ModeratorComponent', {
  whiteList: Schemas.Array(Schemas.String)
})

export class ModeratorTool {
  public moderatorEntity = engine.addEntity()
  public colliderStage = engine.addEntity()
  public hostTarget = engine.addEntity()
  public hostTargetText = engine.addEntity()
  private hostValidated: boolean = false
  constructor() {
    ModeratorComponent.create(this.moderatorEntity)
    syncEntity(this.moderatorEntity, [ModeratorComponent.componentId], 2)
    this.createColliderForStage()
    this.addPlayerToWhiteList('carrito') // Agus User for testing - Replace it with host user from server
    engine.addSystem(() => {
      if (!this.hostValidated) {
        this.checkPlayerAcces()
      }
    })
  }

  createColliderForStage(): void {
    Transform.create(this.colliderStage, {
      position: Vector3.create(40, 3, 44.64),
      scale: Vector3.create(31, 7, 3)
    })
    MeshCollider.setBox(this.colliderStage)
  }

  addPlayerToWhiteList(playerId: string): void {
    ModeratorComponent.getMutable(this.moderatorEntity).whiteList.push(playerId.toLowerCase())
    this.checkPlayerAcces()
  }

  checkPlayerAcces(): void {
    const player = getPlayer()
    console.log('player', player?.name)
    for (const accesId of ModeratorComponent.get(this.moderatorEntity).whiteList) {
      if (accesId === player?.userId.toLowerCase() || accesId === player?.name.toLowerCase()) {
        if (!this.hostValidated) {
          this.hostValidated = true
          engine.removeEntity(this.colliderStage)
          this.addTargetToHost()
          console.log('✔️ Host validado y collider removido para:', player.name)
        }
        break
      }
    }
  }

  addTargetToHost(): void {
    Transform.create(this.hostTarget, {
      position: Vector3.create(0, 0, 0),
      scale: Vector3.create(34, 34, 34),
      parent: engine.PlayerEntity
    })
    Transform.create(this.hostTargetText, {
      position: Vector3.create(0, 2.3, 0),
      scale: Vector3.create(1, 1, 1),
      parent: engine.PlayerEntity
    })
    TextShape.create(this.hostTargetText, {
      text: 'HOST',
      fontSize: 1,
      textColor: Color4.create(1, 0.84, 0, 1)
    })
    Billboard.create(this.hostTargetText)
    GltfContainer.create(this.hostTarget, { src: 'assets/models/target_position.glb' })
  }
}
