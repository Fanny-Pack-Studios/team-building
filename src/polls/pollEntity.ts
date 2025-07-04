import { engine, Schemas, type Entity } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { generatePollId } from '../utils'

import { getPlayer } from '@dcl/sdk/src/players'

export const PollState = engine.defineComponent('pollState', {
  pollId: Schemas.String,
  question: Schemas.String,
  options: Schemas.Array(Schemas.String),
  anonymous: Schemas.Boolean,
  userIdsThatVoted: Schemas.Array(Schemas.String),
  votes: Schemas.Array(
    Schemas.Map({
      userId: Schemas.Optional(Schemas.String),
      option: Schemas.String
    })
  ),
  creatorId: Schemas.String,
  closed: Schemas.Boolean
})

export const pollRegistry = new Map<string, Entity>()
export function createPollEntity(
  question: string,
  options: string[],
  isAnonymous: boolean
): { entity: Entity; pollId: string } {
  const pollEntity = engine.addEntity()
  const pollId = generatePollId()
  const player = getPlayer()
  const creatorId = player?.userId

  PollState.create(pollEntity, {
    pollId,
    question,
    options,
    anonymous: isAnonymous,
    votes: [],
    creatorId,
    closed: false
  })
  pollRegistry.set(pollId, pollEntity)

  syncEntity(pollEntity, [PollState.componentId])

  return { entity: pollEntity, pollId }
}
export function closePoll(pollId: string): boolean {
  const pollEntity = pollRegistry.get(pollId)
  if (pollEntity == null) return false

  const pollState = PollState.get(pollEntity)
  const player = getPlayer()
  const userId = player?.userId

  if (userId == null || userId !== pollState.creatorId) {
    console.log(`User ${userId} is not authorized to close poll ${pollId}`)
    return false
  }

  const poll = PollState.getMutable(pollEntity)

  poll.closed = true

  return true
}
