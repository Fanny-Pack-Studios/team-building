import { engine, Schemas } from '@dcl/sdk/ecs'

export const ZonePollState = engine.defineComponent('ZonePollState', {
  pollId: Schemas.String,
  question: Schemas.String,
  options: Schemas.Array(Schemas.String),
  zoneCounts: Schemas.Array(Schemas.Int)
})
