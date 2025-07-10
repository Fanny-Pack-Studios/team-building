import { engine, Schemas, type Entity } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { generatePollId } from '../utils'

import { getPlayer } from '@dcl/sdk/src/players'
import { VoteBasedActivityState } from '../activities/activitiesEntity'

export const PollState = engine.defineComponent(
  'pollState',
  VoteBasedActivityState(Schemas.String, {
    options: Schemas.Array(Schemas.String)
  })
)

export const pollRegistry = new Map<string, Entity>()
export function createPollEntity(
  question: string,
  options: string[],
  isAnonymous: boolean
): { entity: Entity; pollId: string } {
  const pollEntity = engine.addEntity()
  const id = generatePollId()
  const player = getPlayer()
  const creatorId = player?.userId

  PollState.create(pollEntity, {
    id,
    question,
    options,
    anonymous: isAnonymous,
    votes: [],
    creatorId,
    closed: false
  })
  pollRegistry.set(id, pollEntity)

  syncEntity(pollEntity, [PollState.componentId])

  return { entity: pollEntity, pollId: id }
}

export function closePoll(pollEntity: Entity): boolean {
  const pollState = PollState.get(pollEntity)
  const player = getPlayer()
  const userId = player?.userId

  if (userId == null || userId !== pollState.creatorId) {
    console.log(`User ${userId} is not authorized to close poll ${pollState.id}`)
    return false
  }

  const poll = PollState.getMutable(pollEntity)

  poll.closed = true

  return true
}
