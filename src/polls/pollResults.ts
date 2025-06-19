import { PollState, pollRegistry } from './pollEntity'
import * as ui from 'dcl-ui-toolkit'

export function logPollResults(pollId: string): void {
  const entity = pollRegistry.get(pollId)

  if (entity == null) {
    console.log(`⚠️ No entity found for pollId: ${pollId}`)
    return
  }

  const pollState = PollState.getOrNull(entity)

  if (pollState == null) {
    console.log(`⚠️ No poll state found for entity with pollId: ${pollId}`)
    return
  }

  console.log(`📊 Poll Results for: "${pollState.question}"`)
  console.log(`🔒 Anonymous: ${pollState.anonymous ? 'Yes' : 'No'}`)

  if (pollState.votes.length === 0) {
    console.log('No votes have been cast yet.')
    return
  }

  pollState.votes.forEach((vote, i) => {
    if (pollState.anonymous) {
      console.log(`🗳️ Vote #${i + 1}: Option -> "${vote.option}"`)
    } else {
      console.log(`🗳️ Vote #${i + 1}: User -> ${vote.userId} | Option -> "${vote.option}"`)
    }
  })

  const counts = new Map<string, number>()
  for (const opt of pollState.options) {
    counts.set(opt, 0)
  }
  for (const vote of pollState.votes) {
    counts.set(vote.option, (counts.get(vote.option) ?? 0) + 1)
  }

  console.log('\n📈 Vote Summary:')
  for (const [option, count] of counts.entries()) {
    console.log(`- ${option}: ${count} vote${count === 1 ? '' : 's'}`)
  }
}

export function showPollResultsUI(pollId: string): void {
  const entity = pollRegistry.get(pollId)

  if (entity == null) {
    console.log(`⚠️ No entity found for pollId: ${pollId}`)
    return
  }

  const pollState = PollState.getOrNull(entity)
  if (pollState == null) {
    console.log(`⚠️ No poll state for entity`)
    return
  }

  const prompt = ui.createComponent(ui.CustomPrompt, {
    style: ui.PromptStyles.LIGHT,
    width: 500,
    height: 400
  })

  prompt.addText({
    value: `Results for: ${pollState.question}`,
    size: 20,
    xPosition: 0,
    yPosition: 160
  })

  let y = 120

  const counts = new Map<string, number>()
  for (const opt of pollState.options) {
    counts.set(opt, 0)
  }
  for (const vote of pollState.votes) {
    counts.set(vote.option, (counts.get(vote.option) ?? 0) + 1)
  }

  for (const [option, count] of counts.entries()) {
    prompt.addText({
      value: `${option}: ${count} vote${count !== 1 ? 's' : ''}`,
      size: 15,
      xPosition: -100,
      yPosition: y
    })
    y -= 30
  }

  if (!pollState.anonymous) {
    y -= 20
    prompt.addText({
      value: 'Detailed Votes:',
      size: 15,
      xPosition: -100,
      yPosition: y
    })
    y -= 30

    for (const vote of pollState.votes) {
      prompt.addText({
        value: `${vote.userId.slice(0, 6)}... → ${vote.option}`,
        size: 12,
        xPosition: -100,
        yPosition: y
      })
      y -= 20
    }
  }
  prompt.show()
}
