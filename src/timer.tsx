import { engine } from '@dcl/sdk/ecs'
import ReactEcs, { Label, UiEntity, ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

let visible = false
let remainingSeconds = 0
let lastUpdateTime = Date.now()

engine.addSystem(() => {
  if (!visible) return

  const now = Date.now()
  if (now - lastUpdateTime >= 1000) {
    remainingSeconds--
    lastUpdateTime = now

    if (remainingSeconds <= 0) {
      hideTimerUI()
    }
  }
})

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function TimerElement(): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: 200,
        height: 80,
        positionType: 'absolute',
        position: { bottom: 100, right: 100 },
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      uiBackground={{
        color: Color4.fromInts(0, 0, 0, 180)
      }}
    >
      <Label value={formatTime(remainingSeconds)} fontSize={30} color={Color4.White()} />
    </UiEntity>
  )
}

export function showTimerUI(minutes: number): void {
  remainingSeconds = minutes * 60
  lastUpdateTime = Date.now()
  visible = true
  ReactEcsRenderer.setUiRenderer(() => <TimerElement />)
}

export function hideTimerUI(): void {
  visible = false
  remainingSeconds = 0
  ReactEcsRenderer.setUiRenderer(() => null)
}
