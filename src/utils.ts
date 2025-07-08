import { type BaseComponent, type DeepReadonly, type Entity, Transform, engine } from '@dcl/sdk/ecs'
import { type Vector3 } from '@dcl/sdk/math'
import { getPlayer } from '@dcl/sdk/src/players'

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
  return generateId('poll')
}

export function generateSurveyId(): string {
  return generateId('survey')
}

export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${prefix}_${timestamp}_${random}`
}

type PlayerInfo = NonNullable<ReturnType<typeof getPlayer>>

export async function waitForPlayerInfo(timeout: number = 10): Promise<PlayerInfo> {
  const playerInfo = getPlayer()
  return await new Promise((resolve, reject) => {
    if (playerInfo != null) {
      resolve(playerInfo)
    } else {
      let elapsed: number = 0
      const systemFn = (dt: number): void => {
        elapsed += dt
        if (elapsed > timeout) {
          reject(new Error('Timed out trying to obtain player info'))
        }

        const playerInfo = getPlayer()

        if (playerInfo != null) {
          resolve(playerInfo)
          engine.removeSystem(systemFn)
        }
      }
      engine.addSystem(systemFn)
    }
  })
}

export function withPlayerInfo(cb: (playerInfo: PlayerInfo) => void): void {
  waitForPlayerInfo()
    .then(cb)
    .catch((err) => {
      console.error('Error getting current player info ', err)
    })
}

export function inspectEntity(entity: Entity): Record<string, any> {
  const componentsData: Record<string, any> = {}
  for (const comp of engine.componentsIter()) {
    if (comp.has(entity)) {
      componentsData[comp.componentName] = comp.get(entity)
    }
  }

  return componentsData
}

export function getComponentNames(entity: Entity): string[] {
  return Array.from(engine.componentsIter())
    .filter((it) => it.has(entity))
    .map((it) => it.componentName)
}

export type ComponentState<ComponentSchema> = ComponentSchema extends BaseComponent<infer T> ? DeepReadonly<T> : never
