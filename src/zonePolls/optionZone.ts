import {
  engine,
  type Entity,
  Transform,
  Material,
  MeshRenderer,
  MeshCollider,
  TextShape,
  Billboard,
  GltfContainer
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

// import { syncEntity } from '@dcl/sdk/network'
import { getPlayerPosition } from '../utils'
import { type GameController } from '../controllers/game.controller'
// import { syncEntity } from '@dcl/sdk/network'

export class OptionZone {
  entity: Entity
  textEntity: Entity
  center: Vector3
  size: Vector3 = Vector3.create(4, 4, 4)
  playersInside = new Set<string>()
  count = 0
  question: string
  questionEntity: Entity | undefined
  gameController: GameController

  constructor(position: Vector3, color: Color4 = Color4.Green(), question: string, gameController: GameController) {
    this.entity = engine.addEntity()
    this.center = position
    this.question = question
    this.gameController = gameController

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
    Billboard.create(this.textEntity)
    this.createQuestionEntity(this.question)

    // syncEntity(this.entity, [Transform.componentId, Material.componentId, MeshRenderer.componentId], 1)

    // syncEntity(this.textEntity, [Transform.componentId, TextShape.componentId, Billboard.componentId], 1)

    // if (this.questionEntity !== undefined) {
    //   syncEntity(this.questionEntity, [Transform.componentId, GltfContainer.componentId, Billboard.componentId], 1)
    // }
  }

  update(dt: number): void {
    const playerPos = getPlayerPosition()
    if (playerPos == null) return

    const inZone = this.isInside(playerPos)

    const playerId = 'player' // TODO: use real ID when available

    if (inZone && !this.playersInside.has(playerId)) {
      this.playersInside.add(playerId)
      this.count++
      TextShape.getMutable(this.textEntity).text = `${this.count}`
      console.log('Player enter the zone. Total:', this.count)
    }

    if (!inZone && this.playersInside.has(playerId)) {
      this.playersInside.delete(playerId)
      this.count--
      TextShape.getMutable(this.textEntity).text = `${this.count}`
      console.log('Player Left zone. Total:', this.count)
    }
  }

  createQuestionEntity(question: string): void {
    this.questionEntity = engine.addEntity()
    const modelPosition = Vector3.create(this.center.x, this.center.y + 1, this.center.z + 2)
    Transform.create(this.questionEntity, {
      position: modelPosition,
      scale: Vector3.create(2, 2, 2)
    })
    GltfContainer.create(this.questionEntity, {
      src: 'assets/models/Sign_Square.glb'
    })
    const textEntity = engine.addEntity()
    Transform.create(textEntity, {
      parent: this.questionEntity,
      position: Vector3.create(0, 0.5, 0),
      scale: Vector3.create(0.4, 0.4, 0.4)
    })
    TextShape.create(textEntity, {
      text: this.question,
      fontSize: 4,
      textColor: Color4.White(),
      outlineColor: Color4.Black(),
      outlineWidth: 0.1
    })
    Billboard.create(this.questionEntity)
    Billboard.create(textEntity)
  }

  isInside(pos: Vector3): boolean {
    const halfX = this.size.x / 2
    const halfZ = this.size.z / 2

    return Math.abs(pos.x - this.center.x) < halfX && Math.abs(pos.z - this.center.z) < halfZ
  }

  destroy(): void {
    engine.removeEntity(this.entity)
    engine.removeEntity(this.textEntity)
    if (this.questionEntity !== undefined) engine.removeEntity(this.questionEntity)
  }
}
