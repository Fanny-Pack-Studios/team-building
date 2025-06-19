import { Transform, engine } from '@dcl/sdk/ecs'
import { type Vector3 } from '@dcl/sdk/math'

export function getRandomHexColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function getPlayerPosition(): Vector3 | undefined {
  if (!Transform.has(engine.PlayerEntity)) return
  if (!Transform.has(engine.CameraEntity)) return

  return Transform.get(engine.PlayerEntity).position as Vector3 | undefined
}

engine.addSystem(getPlayerPosition)
export function generatePollId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `poll_${timestamp}_${random}`
}
