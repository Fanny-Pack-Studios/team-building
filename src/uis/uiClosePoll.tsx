import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { getPlayer } from '@dcl/sdk/src/players'
import { PollState, closePoll, pollRegistry } from '../polls/pollEntity'
import { type GameController } from '../controllers/game.controller'

export class ClosePollUI {
  public isVisible: boolean = false
  public pollIdToClose: string | null = null
  public gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  show(pollId: string): void {
    const pollEntity = pollRegistry.get(pollId)
    if (pollEntity == null) return

    const pollState = PollState.get(pollEntity)
    const player = getPlayer()
    const userId = player?.userId

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (pollState.closed || userId !== pollState.creatorId) return

    this.isVisible = true
    this.pollIdToClose = pollId
  }

  hide(): void {
    this.isVisible = false
    this.pollIdToClose = null
  }

  createUi(): ReactEcs.JSX.Element | null {
    if (!this.isVisible) return null

    return (
      <UiEntity
        uiTransform={{
          width: 140,
          height: 50,
          positionType: 'absolute',
          position: { top: 40, right: 40 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        uiBackground={{ color: Color4.fromInts(200, 0, 0, 200) }}
        onMouseDown={() => {
          if (this.pollIdToClose != null) {
            const success = closePoll(this.pollIdToClose)
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (success) {
              console.log('Poll closed')
              this.hide()
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
}
