import {
  Billboard,
  engine,
  GltfContainer,
  InputAction,
  inputSystem,
  MeshCollider,
  PointerEventType,
  TextShape,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { EntityNames } from '../../assets/scene/entity-names'
import { getScaleFactor } from '../canvas/Canvas'
import { waitForPlayerInfo } from '../utils'
import { type GameController } from '../controllers/game.controller'

export class StageUI {
  public moderatorEntity = engine.addEntity()
  public hostTarget = engine.addEntity()
  public hostTargetText = engine.addEntity()
  public gameController: GameController
  public stageUiVisibility: boolean = false
  public nameOrWallet: string = ''

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
    waitForPlayerInfo()
      .then((player) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const isHost = this.gameController.hostsController.isHost(player.userId, hosts)
        const noHosts = hosts == null || hosts.length === 0

        if (noHosts || isHost) {
          this.unlockAccessToStage()
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          if (this.gameController.hostsController.isHost(player.userId, hosts)) {
            this.addTargetToHost()
          }
        } else {
          this.lockAccessToStage()
        }
      })
      .catch((error) => {
        console.error('Error checking player access:', error)
        this.lockAccessToStage()
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

  addAsHost(nameOrWallet: string): void {
    this.gameController.hostsController.addHost(nameOrWallet)
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
          <Label
            value="Enter the player's name to grant stage access"
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
                this.addAsHost(this.nameOrWallet)
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
}
