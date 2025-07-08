import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { PollState } from '../polls/pollEntity'
import { SurveyState } from '../surveys/surveyEntity'

export enum ActivityType {
  NONE,
  POLL,
  SURVEY
}

export const ActivitiesState = engine.defineComponent('activitiesState', {
  currentActivityType: Schemas.EnumNumber(ActivityType, ActivityType.NONE),
  currentActivityId: Schemas.Optional(Schemas.String)
})

export function createActivitiesEntity(): Entity {
  const entity = engine.addEntity()

  ActivitiesState.create(entity)

  syncEntity(entity, [ActivitiesState.componentId], SyncEntityEnumId.ACTIVITIES)

  return entity
}

export function setCurrentActivity(activitiesEntity: Entity, activityId: string, activityType: ActivityType): void {
  const mutableActivities = ActivitiesState.getMutable(activitiesEntity)
  mutableActivities.currentActivityId = activityId
  mutableActivities.currentActivityType = activityType
}

export function getCurrentActivityEntity(activitiesEntity: Entity): Entity | undefined {
  const activities = ActivitiesState.get(activitiesEntity)
  const activityId = activities.currentActivityId
  const activityType = activities.currentActivityType

  if (activityId !== undefined) {
    switch (activityType) {
      case ActivityType.NONE:
        return undefined
      case ActivityType.POLL:
        return Array.from(engine.getEntitiesWith(PollState)).find((it) => it[1].pollId === activityId)?.[0]
      case ActivityType.SURVEY:
        return Array.from(engine.getEntitiesWith(SurveyState)).find((it) => it[1].surveyId === activityId)?.[0]
    }
  }
}
