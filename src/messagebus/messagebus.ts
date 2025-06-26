import { engine, type MapComponentDefinition, Schemas } from '@dcl/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { showPollResultsUI } from '../polls/pollResults'

let lastMessageConsumed = Date.now()
export const messageBusEntity = engine.addEntity()

const messageContentAlternatives = {
  // messageType: messageSchema
  showPollResultsUI: Schemas.Map({ pollId: Schemas.String })
}

export const MessageBusComponent = engine.defineComponent('MessageBus', {
  messages: Schemas.Array(
    Schemas.Map({
      content: Schemas.OneOf(messageContentAlternatives),
      timestamp: Schemas.Int64
    })
  )
})

type MessageBusComponentType = typeof MessageBusComponent extends MapComponentDefinition<infer Inner> ? Inner : never
type Message = MessageBusComponentType['messages'][number]
type MessageType = Message['content']['$case']
type MessageContent = Message['content']['value']

export function pushSyncedMessage(messageType: MessageType, messageContent: MessageContent): void {
  MessageBusComponent.getMutable(messageBusEntity).messages.push({
    content: {
      $case: messageType,
      value: messageContent
    },
    timestamp: Date.now()
  })
}

export function setupMessageBus(): void {
  MessageBusComponent.create(messageBusEntity, {
    messages: []
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  syncEntity(messageBusEntity, [MessageBusComponent.componentId], SyncEntityEnumId.MESSAGE_BUS)

  MessageBusComponent.onChange(messageBusEntity, (component) => {
    if (component === undefined) return

    const newMessages = component.messages.filter((msg) => msg.timestamp > lastMessageConsumed)

    newMessages.sort((a, b) => a.timestamp - b.timestamp)

    for (const message of newMessages) {
      handleMessage(message)
      lastMessageConsumed = message.timestamp
    }
  })
}

function handleMessage(message: Message): void {
  switch (message.content.$case) {
    case 'showPollResultsUI':
      showPollResultsUI(message.content.value.pollId)
      break
  }
}
