import { PollState } from './pollEntity'
import { type Entity } from '@dcl/sdk/ecs'

export function logPollResults(entity: Entity | null): void {
  if (entity != null) {
    const pollState = PollState.getOrNull(entity)

    if (pollState == null) {
      console.log('⚠️ No poll state found for entity.')
      return
    }

    console.log(` Poll results for: "${pollState.question}"`)
    console.log(` Anonymous: ${pollState.anonymous}`)

    pollState.votes.forEach((vote, i) => {
      if (pollState.anonymous) {
        console.log(` Vote #${i + 1}: Option -> "${vote.option}"`)
      } else {
        console.log(` Vote #${i + 1}: User -> ${vote.userId} | Option -> "${vote.option}"`)
      }
    })
  }
}
