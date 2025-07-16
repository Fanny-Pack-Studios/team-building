import { GameController } from './controllers/game.controller'
// import { setupZonePollSystem } from './zonePolls/zonPollSystem'

export function main(): void {
  const gameController = new GameController()
  gameController.start()
  // setupZonePollSystem()
  // openVotingDoors([1, 2, 3, 4])
}
