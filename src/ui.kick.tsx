import { movePlayerTo } from '~system/RestrictedActions'
import { type UIController } from './ui.controller'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import * as ui from 'dcl-ui-toolkit'
import { getPlayer } from '@dcl/sdk/src/players'
import { engine, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'

export const BannedComponent = engine.defineComponent('BannedComponent', {
  list: Schemas.Array(Schemas.String)
})

export class KickUI {
  public isVisible: boolean = false
  public uiController: UIController
  public testUI: ui.FillInPrompt
  public bannedEntity = engine.addEntity()

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.testUI = ui.createComponent(ui.FillInPrompt, {
      title: 'Enter user WALLET for Kick',
      onAccept: (value: string) => {
        this.addPlayerToBanList(value)
      }
    })
    BannedComponent.create(this.bannedEntity)
    syncEntity(this.bannedEntity, [BannedComponent.componentId])
    engine.addSystem(() => {
      this.kickPlayers()
    })

    this.testUI.show()
  }

  openKickUI(): void {
    this.isVisible = true
  }

  kickPlayers(): void {
    const player = getPlayer()
    for (const bannedId of BannedComponent.get(this.bannedEntity).list) {
      if (bannedId === player?.userId.toLowerCase()) {
        console.log('player kicked')
        void movePlayerTo({
          newRelativePosition: Vector3.create(0, 0, 0)
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
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { top: '0%', right: '0%' },
          display: this.isVisible ? 'flex' : 'none'
        }}
        uiBackground={{
          color: Color4.Black()
        }}
      >
        <Label
          uiTransform={{
            positionType: 'absolute',
            position: { left: '40%', bottom: '8%' }
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
