// We define the empty imports so the auto-complete feature works as expected.
import {} from '@dcl/sdk/math'
import { UIController } from './ui.controller'
import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'
import { addPollCreator, addPollsSystem } from './polls/poll'

export function main(): void {
    const uiController = new UIController()
    uiController.start()
    ReactEcsRenderer.setUiRenderer(ui.render)

  addPollsSystem()
}
