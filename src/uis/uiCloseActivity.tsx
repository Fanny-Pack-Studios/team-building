import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import {
  type ActivityResult,
  ActivityType,
  closeActivity,
  getCurrentActivity,
  listenToActivities
} from '../activities/activitiesEntity'
import { type GameController } from '../controllers/game.controller'
import { type PlayerInfo } from '../players/playersOnScene'
import { withPlayerInfo } from '../utils'

export class CloseActivityUI {
  public isVisible: boolean = false
  public gameController: GameController

  constructor(gameController: GameController) {
    this.gameController = gameController
    listenToActivities(this.gameController.activitiesEntity, (activity) => {
      withPlayerInfo((player) => {
        if (this.canClose(player, activity)) {
          this.show()
        } else {
          this.hide()
        }
      })
    })
  }

  private canClose(player: PlayerInfo, activity?: ActivityResult): activity is ActivityResult {
    return activity !== undefined && !activity.state.closed && activity.state.creatorId === player.userId
  }

  show(): void {
    this.isVisible = true
  }

  hide(): void {
    this.isVisible = false
  }

  closeCurrentActivity(): void {
    withPlayerInfo((player) => {
      const activity = getCurrentActivity(this.gameController.activitiesEntity)
      if (this.canClose(player, activity)) {
        closeActivity(activity.type, activity.entity)
      }
    })
  }

  getActivityName(type: ActivityType): string {
    switch (type) {
      case ActivityType.POLL:
        return 'Poll'
      case ActivityType.SURVEY:
        return 'Survey'
      default:
        return 'Activity'
    }
  }

  createUi(): ReactEcs.JSX.Element | null {
    if (!this.isVisible) return null

    const activity = getCurrentActivity(this.gameController.activitiesEntity)

    if (activity === undefined) return null

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
          this.closeCurrentActivity()
          this.hide()
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
            value: `Close ${this.getActivityName(activity.type)}`,
            fontSize: 18,
            color: Color4.White(),
            textAlign: 'middle-center'
          }}
        />
      </UiEntity>
    )
  }
}
