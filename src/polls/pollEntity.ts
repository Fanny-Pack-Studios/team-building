import { engine, Schemas, type Entity } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { generatePollId } from '../utils'
import { createShowResultsEntity } from './resultLink'
import { showTimerUI } from '../timer'


export const PollState = engine.defineComponent('pollState', {
  pollId: Schemas.String,
  question: Schemas.String,
  options: Schemas.Array(Schemas.String),
  anonymous: Schemas.Boolean,
  votes: Schemas.Array(
    Schemas.Map({
      userId: Schemas.String,
      option: Schemas.String
    })
  )
})

export const pollRegistry = new Map<string, Entity>()
export function createPollEntity(
  question: string,
  options: string[],
  isAnonymous: boolean,
  timerValue: number | null
): { entity: Entity; pollId: string } {
  const pollEntity = engine.addEntity()
  const pollId = generatePollId()

  // Set up the poll state with initial data
  PollState.create(pollEntity, { pollId, question, options, anonymous: isAnonymous, votes: [] })
  createShowResultsEntity(pollEntity, pollId)
  if (timerValue !== null) {
    console.log('makeUITimer Visible')
    showTimerUI(timerValue)
  }
  pollRegistry.set(pollId, pollEntity)

  syncEntity(pollEntity, [PollState.componentId])
  return { entity: pollEntity, pollId }
}
