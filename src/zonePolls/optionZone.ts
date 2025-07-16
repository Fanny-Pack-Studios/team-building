import {
  Billboard,
  Material,
  MeshCollider,
  MeshRenderer,
  TextShape,
  Transform,
  engine,
  type Entity
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'
import { getPlayerPosition } from '../utils'
import { ZonePollState } from './pollEntity'

export class OptionZone {
  entity: Entity
  textEntity: Entity
  center: Vector3
  size: Vector3 = Vector3.create(3, 0.1, 3)
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
      scale: Vector3.create(4, 0.1, 4),
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

  update(dt: number): void {
    const playerPos = getPlayerPosition()
    if (playerPos == null) return

    const inZone = this.isInside(playerPos)
    const playerId = 'player' // TODO: we dont really need to keep track of the userID

    const state = ZonePollState.get(this.dataEntity)
    const currentCount = state.zoneCounts?.[this.optionIndex] ?? 0
    this.updateText(currentCount)

    if (inZone && !this.playersInside.has(playerId)) {
      this.playersInside.add(playerId)
      console.log('Player Enter the Zone')
      this.updateZoneCount(state.pollId, this.optionIndex, +1)
    }

    if (!inZone && this.playersInside.has(playerId)) {
      this.playersInside.delete(playerId)

      console.log('Player left the Zone')
      this.updateZoneCount(state.pollId, this.optionIndex, -1)
    }
  }

  updateText(count: number): void {
    TextShape.getMutable(this.textEntity).text = `${count}`
  }

  isInside(pos: Vector3): boolean {
    const halfX = this.size.x / 2
    const halfZ = this.size.z / 2
    return Math.abs(pos.x - this.center.x) < halfX && Math.abs(pos.z - this.center.z) < halfZ
  }

  destroy(): void {
    engine.removeEntity(this.entity)
    engine.removeEntity(this.textEntity)
  }

  updateZoneCount(pollId: string, optionIndex: number, delta: number): void {
    const entities = engine.getEntitiesWith(ZonePollState)
    for (const [entity] of entities) {
      const pollState = ZonePollState.getMutable(entity)
      if (pollState.pollId === pollId) {
        pollState.zoneCounts[optionIndex] = (pollState.zoneCounts[optionIndex] ?? 0) + delta

        if (pollState.zoneCounts[optionIndex] < 0) {
          pollState.zoneCounts[optionIndex] = 0
        }
        break
      }
    }
  }
}
