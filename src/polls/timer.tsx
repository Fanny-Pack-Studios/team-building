import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getScaleFactor } from '../canvas/Canvas'
import { type UIController } from '../ui.controller'
import { engine } from '@dcl/sdk/ecs'

export class TimerUI {
  public visibility: boolean = false
  private remainingSeconds: number = 0
  private readonly intervalId: number | null = null
  public uiController: UIController

  constructor(uiController: UIController) {
    this.uiController = uiController
    const system = (): void => {
      if (this.visibility && this.remainingSeconds > 0) {
        const now = Date.now()
        if (now - this.lastUpdateTime >= 1000) {
          this.remainingSeconds -= 1
          this.lastUpdateTime = now
        }

        if (this.remainingSeconds <= 0) {
          this.visibility = false
        }
      }
    }

    engine.addSystem(system)
  }

  private lastUpdateTime = Date.now()

  setTimer(minutes: number): void {
    this.remainingSeconds = minutes * 60
    this.visibility = true
    this.lastUpdateTime = Date.now()
  }

  formatTime(): string {
    const mins = Math.floor(this.remainingSeconds / 60)
    const secs = this.remainingSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  createUI(): ReactEcs.JSX.Element | null {
    if (!this.visibility) return null

    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { right: '5%', bottom: '15%' },
          width: 250 * getScaleFactor(),
          height: 120 * getScaleFactor(),
          display: this.visibility ? 'flex' : 'none'
        }}
      >
        <UiEntity
          uiTransform={{
            width: 217 * getScaleFactor(),
            height: 105 * getScaleFactor()
          }}
          uiBackground={{
            textureMode: 'center',
            texture: {
              src: 'images/ui-counter-2.png'
            }
          }}
        >
          <Label
            uiTransform={{
              width: '100%',
              height: '100%'
            }}
            value={this.formatTime()}
            color={Color4.Black()}
            fontSize={37 * getScaleFactor()}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  hide(): void {
    this.visibility = false
    this.remainingSeconds = 0
  }
}
