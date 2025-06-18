import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as ui from 'dcl-ui-toolkit'
import { addPollCreator, addPollsSystem } from './polls/poll'

export function main(): void {
  ReactEcsRenderer.setUiRenderer(ui.render)

  addPollsSystem()
  addPollCreator()
}
