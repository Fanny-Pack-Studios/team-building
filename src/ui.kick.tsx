 import { movePlayerTo } from '~system/RestrictedActions'
import { type UIController } from './ui.controller'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs' 
import { Vector3 } from '@dcl/sdk/math'
import * as ui from 'dcl-ui-toolkit'
import { getPlayer } from '@dcl/sdk/src/players'

export class KickUI {
  public isVisible: boolean = true
  public uiController: UIController
  private readonly banned_players_list: string[] = []
  public testUI: ui.FillInPrompt

  constructor(uiController: UIController) {
    this.uiController = uiController
    this.testUI = ui.createComponent(ui.FillInPrompt, {
      title: 'Enter user WALLET for Kick',
      onAccept: (value: string) => {
        this.addPlayerToBanList(value)
      }
    })

    this.kickPlayers()
    this.testUI.show()
  }

  openKickUI(): void {
    this.isVisible = true
  }

  kickPlayers(): void {
    const player = getPlayer()
    for (const bannedId of this.banned_players_list) {
      if (bannedId === player?.userId.toLowerCase()) {
        console.log('player kicked')
        void movePlayerTo({
          newRelativePosition: Vector3.create(0, 0, 0)
        })
      }
    }
  }

  addPlayerToBanList(playerId: string): void {
    this.banned_players_list.push(playerId.toLowerCase())
    console.log('banned list',this.banned_players_list)
    this.kickPlayers()
  }

  createKickUI(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null
    return <UiEntity></UiEntity>
  }

  createBlackScreen(): ReactEcs.JSX.Element | null {
    if (this.uiController.canvasInfo === null) return null
    return <UiEntity></UiEntity>
  }
}