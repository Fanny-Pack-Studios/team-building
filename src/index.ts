// We define the empty imports so the auto-complete feature works as expected.
import {} from '@dcl/sdk/math'
import { UIController } from './ui.controller'

export function main(): void {
    const uiController = new UIController()
    uiController.start()
}
