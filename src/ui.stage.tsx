import { Color4, Vector3 } from '@dcl/sdk/math'
import { getScaleFactor } from './canvas/Canvas'
import { type UIController } from './ui.controller'
import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import {
  Billboard,
  engine,
  GltfContainer,
  InputAction,
  inputSystem,
  PointerEventType,
  Schemas,
  TextShape,
  Transform
} from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { getPlayer } from '@dcl/sdk/src/players'
import { SyncEntityEnumId } from './syncEntities'

export const ModeratorComponent = engine.defineComponent('ModeratorComponent', {
  whiteList: Schemas.Array(Schemas.String)
})

export class StageUI {
  public moderatorEntity = engine.addEntity()
  public colliderStage = engine.getEntityOrNullByName('StageWall')
  public hostTarget = engine.addEntity()
  public hostTargetText = engine.addEntity()
  private hostValidated: boolean = false
  public uiController: UIController
  public stageUiVisibility: boolean = false
  public nameOrWallet: string = ''
  constructor(uiController: UIController) {
    this.uiController = uiController
    ModeratorComponent.create(this.moderatorEntity)
    syncEntity(this.moderatorEntity, [ModeratorComponent.componentId], SyncEntityEnumId.MODERATOR)
    this.addPlayerToWhiteList('') // Agus User for testing - Replace it with host user from server
    engine.addSystem(() => {
      if (!this.hostValidated) {
        this.checkPlayerAcces()
      }
    })
    engine.addSystem(() => {
      const cmd = inputSystem.getInputCommand(InputAction.IA_ACTION_4, PointerEventType.PET_DOWN)
      if (cmd != null) {
        this.stageUiVisibility = true
      }
    })
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
          if (this.colliderStage !== null) {
            engine.removeEntity(this.colliderStage)
          }
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

  createStageUi(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: this.uiController.canvasInfo.width,
          height: this.uiController.canvasInfo.height,
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
                this.addPlayerToWhiteList(this.nameOrWallet)
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
