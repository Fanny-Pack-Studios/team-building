import { movePlayerTo } from '~system/RestrictedActions'
import { type UIController } from './ui.controller'
import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { getPlayer } from '@dcl/sdk/src/players'
import { engine, InputAction, inputSystem, MeshCollider, PointerEventType, Schemas, Transform } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from './syncEntities'
import { getScaleFactor } from './canvas/Canvas'

export const BannedComponent = engine.defineComponent('BannedComponent', {
  list: Schemas.Array(Schemas.String)
})

export class KickUI {
  public blackScreenVisibility: boolean = false
  public kickUiVisibility: boolean = false
  public uiController: UIController
  public bannedEntity = engine.addEntity() 
  public collidersJailStructureN = engine.addEntity()
  public collidersJailStructureW = engine.addEntity()
  public collidersJailStructureE = engine.addEntity()
  public collidersJailStructureS = engine.addEntity()
  nameOrWallet: string = ''

  constructor(uiController: UIController) {
    this.uiController = uiController
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
    this.kickUiVisibility = true
  }

  kickPlayers(): void {
    const player = getPlayer()
    for (const bannedId of BannedComponent.get(this.bannedEntity).list) {
      if (bannedId === player?.userId.toLowerCase() || bannedId === player?.name.toLowerCase()) {
        console.log('player kicked')
        void movePlayerTo({
          newRelativePosition: Vector3.create(10.07, 1, 10.58)
        })
        this.blackScreenVisibility = true
        break
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
          display: this.blackScreenVisibility ? 'flex' : 'none'
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
            position: { bottom: '0%', left: '0%' }
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

  createKickUi(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.uiController.canvasInfo.width,
          height: this.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.kickUiVisibility ? 'flex' : 'none'
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            positionType: 'absolute',
            width: 550 * getScaleFactor(), // Use scale factor to make it responsive
            height: 300 * getScaleFactor(), // Use scale factor to make it responsive
            borderRadius: 15
          }}
          uiBackground={{ color: Color4.White() }}
        >
          <Label
            value="Enter NAME/WALLET to kick"
            fontSize={24 * getScaleFactor()}
            color={Color4.Black()}
            uiTransform={{
              width: 300 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              margin: '20px 20px 20px 20px'
            }}
          />
          <UiEntity
            uiTransform={{
              flexDirection: 'row', // Set to 'row' to align children (Input, Label) side by side
              width: 400 * getScaleFactor(),
              height: 50 * getScaleFactor(),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Input
              onChange={(value) => {
                this.nameOrWallet = value
              }}
              fontSize={22 * getScaleFactor()}
              placeholder={''}
              placeholderColor={Color4.Black()}
              uiTransform={{
                width: 300 * getScaleFactor(),
                height: 50 * getScaleFactor(),
                margin: '10px 0'
              }}
            />
          </UiEntity>

          <Label
            value="Do you want to proceed?"
            fontSize={24 * getScaleFactor()}
            color={Color4.Black()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 60 * getScaleFactor(),
              alignContent: 'center',
              margin: '5px 5px 5px 5px'
            }}
          />

          <UiEntity
            uiTransform={{
              flexDirection: 'row', // Set to 'row' to align children side by side
              width: 450 * getScaleFactor(),
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              value="PROCEED"
              variant="primary"
              fontSize={18 * getScaleFactor()}
              uiTransform={{
                width: 200 * getScaleFactor(),
                height: 40 * getScaleFactor(),
                margin: '15px',
                borderRadius: 10
              }}
              onMouseDown={() => {
                console.log('OPENING LINK')
                this.kickUiVisibility = false
                this.addPlayerToBanList(this.nameOrWallet)
              }}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
