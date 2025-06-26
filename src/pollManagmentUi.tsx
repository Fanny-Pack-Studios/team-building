import ReactEcs, { UiEntity, ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'

import { getPlayer } from '@dcl/sdk/src/players'
import { PollState, closePoll, pollRegistry } from './polls/pollEntity'

let isVisible = false
let pollIdToClose: string | null = null

export function showClosePollButton(pollId: string): void {
  const pollEntity = pollRegistry.get(pollId)
  if (pollEntity == null) return

  const pollState = PollState.get(pollEntity)
  const player = getPlayer()
  const userId = player?.userId

  if (pollState.closed || userId !== pollState.creatorId) return

  isVisible = true
  pollIdToClose = pollId
  ReactEcsRenderer.setUiRenderer(() => <ClosePollButtonUI />)
}

export function hideClosePollButton(): void {
  isVisible = false
  pollIdToClose = null
  ReactEcsRenderer.setUiRenderer(() => null)
}

function ClosePollButtonUI(): ReactEcs.JSX.Element {
  return (
    <UiEntity
      uiTransform={{
        width: 140,
        height: 50,
        positionType: 'absolute',
        position: { top: 40, right: 40 },
        display: isVisible ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      uiBackground={{ color: Color4.fromInts(200, 0, 0, 200) }}
      onMouseDown={() => {
        if (pollIdToClose != null) {
          const success = closePoll(pollIdToClose)
          if (success) {
            console.log('Poll closed')
            hideClosePollButton()
          }
        }
      }}
    >
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        uiText={{
          value: 'Close Poll',
          fontSize: 18,
          color: Color4.White(),
          textAlign: 'middle-center'
        }}
      />
    </UiEntity>
  )
}
