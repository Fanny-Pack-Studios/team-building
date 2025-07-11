import { withPlayerInfo } from '../utils'
import { type GameController } from '../controllers/game.controller'

export class RemoveHostModal {
  public removeHostVisibility: boolean = false

  // This local list of hosts is to ensure a correlation between the index of the array and the corresponding hosts.
  private hosts: string[] = []
  private selectedHostIndex: number = -1
  private readonly gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.gameController.hostsController.onChange((newHosts) => {
      this.updateHosts(newHosts ?? [])
    })
    this.updateHosts(this.gameController.hostsController.getHosts())
  }

  updateHosts(someHosts: string[]): void {
    this.hosts = someHosts
    if (this.hosts.length > 0) {
      this.selectedHostIndex = 0
    }

    withPlayerInfo((player) => {
      if (!this.gameController.hostsController.isHost(player.userId)) {
        this.removeHostVisibility = false
      }
    })
  }

  removeSelectedHost(): void {
    if (this.selectedHostIndex !== -1) {
      this.gameController.hostsController.removeHost(this.hosts[this.selectedHostIndex])
    }
  }

  removeHostByUserId(userId: string): void {
    const index = this.hosts.indexOf(userId)
    if (index !== -1) {
      this.gameController.hostsController.removeHost(this.hosts[index])
    } else {
      console.log(`User ${userId} not found in hosts list.`)
    }
  }
}
