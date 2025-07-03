import { engine, InputAction, inputSystem, MeshCollider, PointerEventType } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Dropdown, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { EntityNames } from '../../assets/scene/entity-names'
import { getScaleFactor } from '../canvas/Canvas'
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

    this.gameController.hostsController.onChange((newHosts) => {
      console.log('Hosts changed: ', newHosts)
      this.checkPlayerAccess(newHosts)
    })

    engine.addSystem(() => {
      const cmd = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
      if (cmd != null) {
        this.stageUiVisibility = true
      }
    })

    this.checkPlayerAccess(this.gameController.hostsController.getHosts())
  }

  checkPlayerAccess(hosts: string[] | undefined): void {
    withPlayerInfo((player) => {
      const isHost = this.gameController.hostsController.isHost(player.userId, hosts)
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

  addAsHost(taggedID: string): void {
    const userID = this.gameController.playersOnScene.getUserIdFromDisplayName(taggedID)
    if (userID === undefined) return
    this.gameController.hostsController.addHost(userID)
  }

  createStageUi(): ReactEcs.JSX.Element | null {
    if (this.gameController.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.stageUiVisibility ? 'flex' : 'none'
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
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              positionType: 'absolute',
              width: 22 * getScaleFactor(),
              height: 22 * getScaleFactor(),
              position: { top: '3%', right: '2%' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/moderatormenu/exit.png' }
            }}
            onMouseDown={() => {
              this.stageUiVisibility = false
            }}
          ></UiEntity>
          <Label
            value="Select Player to Grant Stage Access"
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
                width: 300 * getScaleFactor(),
                height: 40 * getScaleFactor()
              }}
              fontSize={16 * getScaleFactor()}
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
                this.addAsHost(this.playerSelected)
                this.stageUiVisibility = false
              }}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }

  toggleVisibility(): void {
    if (!this.stageUiVisibility) {
      this.stageUiVisibility = true
    } else {
      this.stageUiVisibility = false
    }
  }

  checkPlayerNameOnArray = (playerNumber: number): void => {
    console.log('here', playerNumber)
    this.playerSelected = this.gameController.playersOnScene.displayPlayers[playerNumber - 1]
  }
}
