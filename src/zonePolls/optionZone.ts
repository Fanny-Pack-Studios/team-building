import { engine, type Entity, Transform, Material, MeshRenderer, MeshCollider, TextShape, Animator } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

import { syncEntity } from '@dcl/sdk/network'
import { getPlayerPosition } from '../utils'

export class OptionZone {
  entity: Entity
  textEntity: Entity
  center: Vector3
  size: Vector3 = Vector3.create(4, 4, 4)
  playersInside = new Set<string>()
  count = 0

  constructor(position: Vector3, color: Color4 = Color4.Green()) {
    this.entity = engine.addEntity()
    this.center = position

    Transform.create(this.entity, {
      position: this.center,
      scale: this.size,
      rotation: Quaternion.fromEulerDegrees(90, 0, 0)
    })

    MeshRenderer.setPlane(this.entity)
    MeshCollider.setPlane(this.entity)

    Material.setPbrMaterial(this.entity, {
      albedoColor: color,
      transparencyMode: 1,
      alphaTest: 0.5
    })
    // text entity
    this.textEntity = engine.addEntity()

    Transform.create(this.textEntity, {
      position: Vector3.create(this.center.x, this.center.y + 3, this.center.z)
    })

    TextShape.create(this.textEntity, {
      text: `${this.count}`,
      fontSize: 5,
      textColor: Color4.White(),
      outlineColor: Color4.Black(),
      outlineWidth: 0.1
    })
    syncEntity(this.textEntity, [Transform.componentId, Animator.componentId], 1)
  }

  update(dt: number): void {
    const playerPos = getPlayerPosition()
    if (playerPos == null) return

    const inZone = this.isInside(playerPos)

    const playerId = 'player' // TODO: usar ID real cuando esté disponible

    if (inZone && !this.playersInside.has(playerId)) {
      this.playersInside.add(playerId)
      this.count++
      TextShape.getMutable(this.textEntity).text = `${this.count}`
      console.log('Entró un jugador. Total:', this.count)
    }

    if (!inZone && this.playersInside.has(playerId)) {
      this.playersInside.delete(playerId)
      this.count--
      TextShape.getMutable(this.textEntity).text = `${this.count}`
      console.log('Salió un jugador. Total:', this.count)
    }
  }

  isInside(pos: Vector3): boolean {
    const halfX = this.size.x / 2
    const halfZ = this.size.z / 2

    return Math.abs(pos.x - this.center.x) < halfX && Math.abs(pos.z - this.center.z) < halfZ
  }
}
