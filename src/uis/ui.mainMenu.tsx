import ReactEcs, { Button, type EntityPropTypes, UiEntity } from '@dcl/sdk/react-ecs'
import { primaryTheme } from './themes/themes'
import { type GameController } from '../controllers/game.controller'

export class MainMenuUi {
  gameController: GameController
  public isVisible: boolean = false

  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  create(): ReactEcs.JSX.Element {
    return <MainMenu gameController={this.gameController} uiTransform={{ display: this.isVisible ? 'flex' : 'none' }} />
  }
}

const MainMenu = (props: { gameController: GameController } & EntityPropTypes): ReactEcs.JSX.Element => {
  return (
    <UiEntity
      uiTransform={{
        width: '25vw',
        height: '25vh',
        positionType: 'absolute',
        position: { top: '25%', left: '37.5%' },
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
        ...props.uiTransform
      }}
      uiBackground={primaryTheme.uiBackground}
    >
      <Button
        value="Start an Activity"
        uiTransform={primaryTheme.primaryButtonTransform}
        fontSize={primaryTheme.fontSize}
        font={primaryTheme.font}
        uiBackground={primaryTheme.primaryButtonBackground}
        onMouseDown={() => {
          props.gameController.mainMenuUI.isVisible = false
          props.gameController.activitiesUI.openUI()
        }}
      />
      <Button
        value="Customize Auditorium"
        uiTransform={primaryTheme.primaryButtonTransform}
        fontSize={primaryTheme.fontSize}
        font={primaryTheme.font}
        uiBackground={primaryTheme.primaryButtonBackground}
        onMouseDown={() => {
          props.gameController.mainMenuUI.isVisible = false
          props.gameController.customizationUI.isVisible = true
        }}
      />
    </UiEntity>
  )
}
