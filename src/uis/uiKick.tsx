import { movePlayerTo } from '~system/RestrictedActions'

import ReactEcs, { Button, Dropdown, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { getPlayer } from '@dcl/sdk/src/players'
import {
  AvatarModifierArea,
  AvatarModifierType,
  engine,
  InputAction,
  inputSystem,
  MeshCollider,
  MeshRenderer,
  PointerEventType,
  Schemas,
  Transform
} from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { getScaleFactor } from '../canvas/Canvas'
import { type GameController } from '../controllers/game.controller'

const JAIL_CENTER = Vector3.create(10.07, 10, 10.58) // Ajustá según tu escena

// Change to true to make jail visible for debug purposes
const IS_JAIL_VISIBLE: boolean = false

export const BannedComponent = engine.defineComponent('BannedComponent', {
  list: Schemas.Array(Schemas.String)
})

export type KickUiType = 'kick' | 'unKick' | 'blackScreen'

export class KickUI {
  public blackScreenVisibility: boolean = false
  public kickUiVisibility: boolean = false
  public unKickUiVisibility: boolean = false
  public gameController: GameController
  public bannedEntity = engine.addEntity()
  public collidersJailStructureN = engine.addEntity()
  public collidersJailStructureW = engine.addEntity()
  public collidersJailStructureE = engine.addEntity()
  public collidersJailStructureS = engine.addEntity()
  public collidersJailStructureFloor = engine.addEntity()
  public hideAvatarsArea = engine.addEntity()
  public wasKicked: boolean = false
  playerSelected: string = ''
  constructor(gameController: GameController) {
    this.gameController = gameController
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
    AvatarModifierArea.create(this.hideAvatarsArea, {
      area: Vector3.create(1, 1, 1),
      modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
      excludeIds: []
    })
  }

  createCollidersJail(): void {
    // Size
    const boxWidth = 2
    const boxLength = 2
    const wallHeight = 5
    const wallThickness = 0.2

    const center = JAIL_CENTER

    // North
    Transform.create(this.collidersJailStructureN, {
      position: Vector3.create(center.x, center.y + wallHeight / 2, center.z - boxLength / 2),
      scale: Vector3.create(boxWidth, wallHeight, wallThickness)
    })

    // South
    Transform.create(this.collidersJailStructureS, {
      position: Vector3.create(center.x, center.y + wallHeight / 2, center.z + boxLength / 2),
      scale: Vector3.create(boxWidth, wallHeight, wallThickness)
    })

    // East
    Transform.create(this.collidersJailStructureE, {
      position: Vector3.create(center.x + boxWidth / 2, center.y + wallHeight / 2, center.z),
      scale: Vector3.create(wallThickness, wallHeight, boxLength)
    })

    // West
    Transform.create(this.collidersJailStructureW, {
      position: Vector3.create(center.x - boxWidth / 2, center.y + wallHeight / 2, center.z),
      scale: Vector3.create(wallThickness, wallHeight, boxLength)
    })

    // Floor
    const floorHeight = 0.01
    Transform.create(this.collidersJailStructureFloor, {
      position: Vector3.create(center.x, center.y - floorHeight / 2, center.z),
      scale: Vector3.create(boxWidth, floorHeight, boxLength)
    })

    // Hide Players Area
    Transform.create(this.hideAvatarsArea, {
      position: Vector3.create(center.x, center.y, center.z)
    })

    if (IS_JAIL_VISIBLE) {
      MeshRenderer.setBox(this.collidersJailStructureN)
      MeshRenderer.setBox(this.collidersJailStructureS)
      MeshRenderer.setBox(this.collidersJailStructureW)
      MeshRenderer.setBox(this.collidersJailStructureE)
      MeshRenderer.setBox(this.collidersJailStructureFloor)
    }
    MeshCollider.setBox(this.collidersJailStructureN)
    MeshCollider.setBox(this.collidersJailStructureS)
    MeshCollider.setBox(this.collidersJailStructureW)
    MeshCollider.setBox(this.collidersJailStructureE)
    MeshCollider.setBox(this.collidersJailStructureFloor)
  }

  openKickUI(): void {
    this.kickUiVisibility = true
  }

  kickPlayers(): void {
    const player = getPlayer()
    if (player == null) return

    const bannedList = BannedComponent.get(this.bannedEntity).list
    const isBanned = bannedList.includes(player.userId.toLowerCase()) || bannedList.includes(player.name.toLowerCase())

    if (isBanned && !this.wasKicked) {
      console.log('player kicked')
      void movePlayerTo({ newRelativePosition: JAIL_CENTER })
      this.blackScreenVisibility = true
      this.wasKicked = true
    }

    if (!isBanned && this.wasKicked) {
      console.log('player un-kicked')
      void movePlayerTo({ newRelativePosition: Vector3.create(1, 1, 1) })
      this.blackScreenVisibility = false
      this.wasKicked = false
    }
  }

  removePlayerFromBanList(taggedID: string): void {
    const userID = this.gameController.playersOnScene.getUserIdFromDisplayName(taggedID)
    if (userID === undefined) return

    const banned = BannedComponent.getMutable(this.bannedEntity)
    banned.list = banned.list.filter((id) => id.toLowerCase() !== userID.toLowerCase())
    this.blackScreenVisibility = false

    console.log('banned list', BannedComponent.get(this.bannedEntity).list)
  }

  addPlayerToBanList(taggedID: string): void {
    const userID = this.gameController.playersOnScene.getUserIdFromDisplayName(taggedID)
    if (userID === undefined) return
    BannedComponent.getMutable(this.bannedEntity).list.push(userID.toLowerCase())
    console.log('banned list', BannedComponent.get(this.bannedEntity).list)
    this.kickPlayers()
  }

  createBlackScreen(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
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
            width: this.gameController.uiController.canvasInfo.height * 0.5,
            height: this.gameController.uiController.canvasInfo.height * 0.5,
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

  createUnKickUi(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.unKickUiVisibility ? 'flex' : 'none'
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
            value="Select Player to Unban"
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
            <Dropdown
              emptyLabel='Select Player'
              options={this.gameController.playersOnScene.getTaggedNamesFromWallets(
                  BannedComponent.get(this.bannedEntity).list
                )
              }
              uiTransform={{
                width: '50%',
                height: '50%'
              }}
              onChange={this.checkPlayerNameOnArray}
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
                this.unKickUiVisibility = false
                this.removePlayerFromBanList(this.playerSelected)
              }}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  createKickUi(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
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
            value="Select Player to Ban"
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
            <Dropdown
              options={['Select Player', ...this.gameController.playersOnScene.displayPlayers]}
              uiTransform={{
                width: '50%',
                height: '50%'
              }}
              onChange={this.checkPlayerNameOnArray}
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
                this.addPlayerToBanList(this.playerSelected)
              }}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  toggleVisibility(ui: KickUiType): void {
    switch (ui) {
      case 'kick':
        this.kickUiVisibility = !this.kickUiVisibility
        break
      case 'unKick':
        this.unKickUiVisibility = !this.unKickUiVisibility
        break
      case 'blackScreen':
        this.blackScreenVisibility = !this.blackScreenVisibility
        break
    }
  }

  checkPlayerNameOnArray = (playerNumber: number): void => {
    console.log('here', playerNumber)
    this.playerSelected = this.gameController.playersOnScene.displayPlayers[playerNumber - 1]
  }
}
