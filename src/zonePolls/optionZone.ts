import {
  Billboard,
  Material,
  MeshCollider,
  MeshRenderer,
  PlayerIdentityData,
  TextShape,
  Transform,
  engine,
  type Entity
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'

export class OptionZone {
  entity: Entity
  textEntity: Entity
  center: Vector3
  size: Vector3 = Vector3.create(3, 0.1, 3)
  visualEntitySize = Vector3.create(4, 0.1, 4)
  playersInside = new Set<string>()
  gameController: GameController
  optionIndex: number
  dataEntity: Entity

  constructor(
    position: Vector3,
    color: Color4,
    optionIndex: number,
    dataEntity: Entity,
    gameController: GameController
  ) {
    this.center = position
    this.optionIndex = optionIndex
    this.dataEntity = dataEntity
    this.gameController = gameController

    this.entity = engine.addEntity()
    Transform.create(this.entity, {
      position: this.center,
      scale: this.visualEntitySize,
      rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    })
    MeshRenderer.setCylinder(this.entity)
    MeshCollider.setPlane(this.entity)
    Material.setPbrMaterial(this.entity, {
      albedoColor: color,
      transparencyMode: 1,
      alphaTest: 0.5
    })

    this.textEntity = engine.addEntity()
    Transform.create(this.textEntity, {
      position: Vector3.create(this.center.x, this.center.y + 3, this.center.z)
    })
    TextShape.create(this.textEntity, {
      text: `0`,
      fontSize: 5,
      textColor: Color4.White(),
      outlineColor: Color4.Black(),
      outlineWidth: 0.1
    })
    Billboard.create(this.textEntity)
  }

  updateZoneOption(): void {
    this.playersInside.clear()

    Array.from(engine.getEntitiesWith(PlayerIdentityData, Transform))
      .filter(([_entity, _data, transform]) => this.containsPosition(transform.position))
      .map(([_entity, data]) => data.address)
      .forEach((address) => this.playersInside.add(address))

    this.updateText(this.playersCount())
  }

  playersCount(): number {
    return this.playersInside.size
  }

  updateText(count: number): void {
    const textShape = TextShape.getMutableOrNull(this.textEntity)
    if (textShape !== null) textShape.text = `${count}`
  }

  containsPosition(pos: Vector3): boolean {
    const halfX = this.size.x / 2
    const halfZ = this.size.z / 2
    return Math.abs(pos.x - this.center.x) < halfX && Math.abs(pos.z - this.center.z) < halfZ
  }

  destroy(): void {
    engine.removeEntity(this.entity)
    engine.removeEntity(this.textEntity)
  }
}
