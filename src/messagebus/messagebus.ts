import { engine, type MapComponentDefinition, Schemas } from '@dcl/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { SyncEntityEnumId } from '../syncEntities'
import { type GameController } from '../controllers/game.controller'

let lastMessageConsumed = Date.now()
export const messageBusEntity = engine.addEntity()

const messageContentAlternatives = {
  // messageType: messageSchema
  showCurrentActivityResults: Schemas.Map({}),
  createZonePollUi: Schemas.Map({
    dataEntityId: Schemas.Int
  }),
  showZonePollResults: Schemas.Map({
    question: Schemas.String,
    winnerOption: Schemas.String
  })
}

function handleMessage(message: Message, gameController: GameController): void {
  switch (message.content.$case) {
    case 'showCurrentActivityResults':
      gameController.popupAtendeePanelAndResultbutton.showResultsFromCurrentActivity()
      break
    case 'showZonePollResults': {
      const { question, winnerOption } = message.content.value
      console.log(question, winnerOption)
      gameController.zonePollResultUI.show(question, winnerOption)
      break
    }
  }
}

// section ends here

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
    } as any,
    timestamp: Date.now()
  })
}

export function setupMessageBus(gameController: GameController): void {
  MessageBusComponent.create(messageBusEntity, {
    messages: []
  })

  syncEntity(messageBusEntity, [MessageBusComponent.componentId], SyncEntityEnumId.MESSAGE_BUS)

  MessageBusComponent.onChange(messageBusEntity, (component) => {
    if (component === undefined) return

    const newMessages = component.messages.filter((msg) => msg.timestamp > lastMessageConsumed)

    newMessages.sort((a, b) => a.timestamp - b.timestamp)

    for (const message of newMessages) {
      handleMessage(message, gameController)
      lastMessageConsumed = message.timestamp
    }
  })
}
