import { movePlayerTo } from '~system/RestrictedActions'
import { type UIController } from './ui.controller'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import * as ui from 'dcl-ui-toolkit'
import { getPlayer } from '@dcl/sdk/src/players'
import { engine, InputAction, inputSystem, MeshCollider, PointerEventType, Schemas, Transform } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from './syncEntities'

export const BannedComponent = engine.defineComponent('BannedComponent', {
  list: Schemas.Array(Schemas.String)
})

export class KickUI {
  public isVisible: boolean = false
  public uiController: UIController
  public testUI: ui.FillInPrompt
  public bannedEntity = engine.addEntity()
  public collidersJailStructureN = engine.addEntity()
  public collidersJailStructureW = engine.addEntity()
  public collidersJailStructureE = engine.addEntity()
  public collidersJailStructureS = engine.addEntity()

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.testUI = ui.createComponent(ui.FillInPrompt, {
      title: 'Enter user WALLET for Kick',
      onAccept: (value: string) => {
        this.addPlayerToBanList(value)
      }
    })
    BannedComponent.create(this.bannedEntity)
    syncEntity(this.bannedEntity, [BannedComponent.componentId], SyncEntityEnumId.KICK)
    engine.addSystem(() => {
      this.kickPlayers()
    })
    engine.addSystem(() => {
      const cmd = inputSystem.getInputCommand(InputAction.IA_ACTION_3, PointerEventType.PET_DOWN)
      if (cmd != null) {
        this.openKickUI()
      }
    })
    this.createCollidersJail()
  }

  createCollidersJail(): void {
    // Size
    const boxWidth = 2
    const boxLength = 2
    const wallHeight = 5
    const wallThickness = 0.2

    // Center
    const center = Vector3.create(10.07, 1, 10.58) // Ajustá según tu escena

    // North
    Transform.create(this.collidersJailStructureN, {
      position: Vector3.create(center.x, wallHeight / 2, center.z - boxLength / 2),
      scale: Vector3.create(boxWidth, wallHeight, wallThickness)
    })

    // South
    Transform.create(this.collidersJailStructureS, {
      position: Vector3.create(center.x, wallHeight / 2, center.z + boxLength / 2),
      scale: Vector3.create(boxWidth, wallHeight, wallThickness)
    })

    // East
    Transform.create(this.collidersJailStructureE, {
      position: Vector3.create(center.x + boxWidth / 2, wallHeight / 2, center.z),
      scale: Vector3.create(wallThickness, wallHeight, boxLength)
    })

    // West
    Transform.create(this.collidersJailStructureW, {
      position: Vector3.create(center.x - boxWidth / 2, wallHeight / 2, center.z),
      scale: Vector3.create(wallThickness, wallHeight, boxLength)
    })

    // Hide Jail - Uncomment to make it visible
    // MeshRenderer.setBox(this.collidersJailStructureN)
    // MeshRenderer.setBox(this.collidersJailStructureS)
    // MeshRenderer.setBox(this.collidersJailStructureW)
    // MeshRenderer.setBox(this.collidersJailStructureE)
    MeshCollider.setBox(this.collidersJailStructureN)
    MeshCollider.setBox(this.collidersJailStructureS)
    MeshCollider.setBox(this.collidersJailStructureW)
    MeshCollider.setBox(this.collidersJailStructureE)
  }

  openKickUI(): void {
    this.testUI.show()
  }

  kickPlayers(): void {
    const player = getPlayer()
    for (const bannedId of BannedComponent.get(this.bannedEntity).list) {
      if (bannedId === player?.userId.toLowerCase()) {
        console.log('player kicked')
        void movePlayerTo({
          newRelativePosition: Vector3.create(10.07, 1, 10.58)
        })
        this.isVisible = true
      }
    }
  }

  addPlayerToBanList(playerId: string): void {
    BannedComponent.getMutable(this.bannedEntity).list.push(playerId.toLowerCase())
    console.log('banned list', BannedComponent.get(this.bannedEntity).list)
    this.kickPlayers()
  }

  createBlackScreen(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: this.uiController.canvasInfo.width,
          height: this.uiController.canvasInfo.height,
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'relative',
          position: { bottom: '0%', left: '0%' },
          display: this.isVisible ? 'flex' : 'none'
        }}
        uiBackground={{
          color: Color4.Black()
        }}
      >
        <Label
          uiTransform={{
            positionType: 'relative',
            width: this.uiController.canvasInfo.height * 0.5,
            height: this.uiController.canvasInfo.height * 0.5,
            position: { bottom: '0%', left: '0%' },
          }}
          value={'YOU HAVE BEEN EXPULSED FROM THE SCENE'}
          fontSize={30}
          font="sans-serif"
          color={Color4.White()}
          textAlign="bottom-center"
        />
      </UiEntity>
    )
  }
}
