import { engine, type Entity, Schemas } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/src/players'
import { generateSurveyId } from '../utils'
import { type OptionsQuantity } from './rating'
import { SurveyIcon } from './surveyIcon'
import { syncEntity } from '@dcl/sdk/network'

export const SurveyState = engine.defineComponent('surveyState', {
  surveyId: Schemas.String,
  question: Schemas.String,
  optionsQty: Schemas.Number,
  icon: Schemas.EnumString(SurveyIcon, SurveyIcon.STAR),
  anonymous: Schemas.Boolean,
  userIdsThatVoted: Schemas.Array(Schemas.String),
  votes: Schemas.Array(
    Schemas.Map({
      userId: Schemas.Optional(Schemas.String),
      option: Schemas.Number
    })
  ),
  creatorId: Schemas.String,
  closed: Schemas.Boolean
})

export function createSurveyEntity(
  question: string,
  icon: SurveyIcon = SurveyIcon.STAR,
  optionsQty: OptionsQuantity = 5,
  anonymous: boolean = false
): [string, Entity] {
  const entity = engine.addEntity()
  const surveyId = generateSurveyId()
  const player = getPlayer()

  const creatorId = player?.userId

  SurveyState.create(entity, {
    surveyId,
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

  return [surveyId, entity]
}
