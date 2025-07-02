import ReactEcs, { Label } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { LabeledInput } from './components/labeledInput'
import { ModalTitle } from './components/modalTitle'
import { ModalWindow } from './components/modalWindow'

export class CreateSurveyUI {
  public isVisible: boolean = true
  constructor(private readonly gameController: GameController) {}

  createUI(): ReactEcs.JSX.Element | null {
    return (
      <ModalWindow visible={this.isVisible}>
        <ModalTitle value="<b>Create Your Survey</b>" />
        <Label
          uiTransform={{ width: '100%', height: '4vh', margin: { bottom: '4vh' } }}
          fontSize="1.2vw"
          textAlign="middle-center"
          value="Add a question, pick options and icons"
        />
        <LabeledInput
          labelProps={{ value: '<b>Question Title: </b>' }}
          inputProps={{ placeholder: 'Question Title' }}
        />
      </ModalWindow>
    )
  }
}
