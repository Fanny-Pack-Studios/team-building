import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { type ComponentState, generateSurveyId } from '../utils'
import { type OptionsQuantity } from './rating'
import { SurveyIcon } from './surveyIcon'
import { syncEntity } from '@dcl/sdk/network'
import { VoteBasedActivityState } from '../activities/activitiesEntity'

export const SurveyState = engine.defineComponent(
  'surveyState',
  VoteBasedActivityState(Schemas.Number, {
    optionsQty: Schemas.Number,
    icon: Schemas.EnumString(SurveyIcon, SurveyIcon.STAR)
  })
)

export type SurveyStateType = ComponentState<typeof SurveyState>

export function createSurveyEntity(
  question: string,
  icon: SurveyIcon = SurveyIcon.STAR,
  optionsQty: OptionsQuantity = 5,
  anonymous: boolean = false
): [string, Entity] {
  const entity = engine.addEntity()
  const id = generateSurveyId()
  const player = getPlayer()

  const creatorId = player?.userId

  SurveyState.create(entity, {
    id,
    question,
    icon,
    anonymous,
    optionsQty,
    creatorId,
    votes: [],
    userIdsThatVoted: [],
    closed: false
  })

  syncEntity(entity, [SurveyState.componentId])

  return [id, entity]
}

export function closeSurvey(surveyEntity: Entity): void {
  SurveyState.getMutable(surveyEntity).closed = true
}
