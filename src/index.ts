// We define the empty imports so the auto-complete feature works as expected.
import {} from '@dcl/sdk/math'
import { UIController } from './ui.controller'
import { addPollCreator, addPollsSystem } from './polls/poll'
import { ModeratorTool } from './moderatorTool'

export function main(): void {
  const uiController = new UIController()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const moderatorTool = new ModeratorTool()
  uiController.start()
  addPollsSystem()
  addPollCreator()
}
