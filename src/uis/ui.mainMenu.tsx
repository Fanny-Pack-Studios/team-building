import ReactEcs, { type EntityPropTypes, Label, UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'
import { type GameController } from '../controllers/game.controller'
import { mainTheme } from './themes/themes'
import { Row, Column } from './components/flexOrganizers'

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
  const theme = mainTheme

  const buttonTransform: UiTransformProps = {
    ...theme.primaryButtonTransform,
    flexDirection: 'column',
    borderRadius: 35
  }

  return (
    <UiEntity
      uiTransform={{
        width: '50vw',
        height: '75vh',
        positionType: 'absolute',
        position: { top: '12.5%', left: '25%' },
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
        ...props.uiTransform
      }}
      uiBackground={theme.uiBackground}
    >
      <UiEntity uiTransform={{ width: '100%', height: 'auto', justifyContent: 'flex-end' }}>
        <UiEntity
          uiTransform={{ width: '25px', height: '25px', margin: { top: '5%', right: '5%' } }}
          uiBackground={{
            texture: { src: 'images/ui/exit.png' },
            textureMode: 'stretch'
          }}
          onMouseDown={() => {
            props.gameController.mainMenuUI.isVisible = false
          }}
        />
      </UiEntity>
      <Label value="Welcome to TeamHub!" fontSize={theme.titleFontSize} font={theme.font} />
      <Label value="Let's get started" fontSize={theme.fontSize} font={theme.font} />
      <Row uiTransform={{ width: '100%', height: '70%', margin: { bottom: '10%' } }}>
        <UiEntity
          uiTransform={{ ...buttonTransform, width: '50%', height: '100%', margin: '2.5%' }}
          uiBackground={theme.primaryButtonBackground}
          onMouseDown={() => {
            props.gameController.mainMenuUI.isVisible = false
            props.gameController.activitiesUI.chooseActivityUiVisibility = true
          }}
        >
          <UiEntity
            uiTransform={{ width: '100%', height: '100%' }}
            uiBackground={{ texture: { src: 'images/mainmenu/startActivity.png' } }}
          />
          <Label
            uiTransform={{ width: '100%', height: '100%' }}
            value="Start Activity"
            fontSize={theme.buttonFontSize}
            font={theme.font}
            textAlign="middle-center"
          />
        </UiEntity>
        <Column uiTransform={{ width: '85%', margin: '2.5%', justifyContent: 'space-between' }}>
          <UiEntity
            uiTransform={{ ...buttonTransform, flexDirection: 'row', height: '45%' }}
            uiBackground={theme.primaryButtonBackground}
            onMouseDown={() => {
              props.gameController.mainMenuUI.isVisible = false
              props.gameController.workInProgressUI.isVisible = true
            }}
          >
            <Label
              value="Screen Sharing"
              uiTransform={{ width: '100%', height: '100%' }}
              fontSize={theme.buttonFontSize}
              font={theme.font}
              textAlign="middle-center"
            />
            <UiEntity
              uiTransform={{ width: '100%', height: '100%' }}
              uiBackground={{ texture: { src: 'images/mainmenu/screenSharing.png' } }}
            />
          </UiEntity>
          <Row uiTransform={{ width: '100%', height: '45%', justifyContent: 'space-between' }}>
            <UiEntity
              uiTransform={{ ...buttonTransform, width: '45%', height: '100%' }}
              uiBackground={theme.primaryButtonBackground}
              onMouseDown={() => {
                props.gameController.mainMenuUI.isVisible = false
                props.gameController.customizationUI.isVisible = true
              }}
            >
              <UiEntity
                uiTransform={{ width: '100%', height: '100%' }}
                uiBackground={{ texture: { src: 'images/mainmenu/customizeAuditorium.png' } }}
              />
              <Label
                value="Customize Auditorium"
                uiTransform={{ width: '100%', height: '100%' }}
                fontSize={theme.buttonFontSize}
                font={theme.font}
                textAlign="middle-center"
              />
            </UiEntity>
            <UiEntity
              uiTransform={{ ...buttonTransform, width: '45%', height: '100%' }}
              uiBackground={theme.primaryButtonBackground}
              onMouseDown={() => {
                props.gameController.mainMenuUI.isVisible = false
                props.gameController.workInProgressUI.isVisible = true
              }}
            >
              <UiEntity
                uiTransform={{ width: '100%', height: '100%' }}
                uiBackground={{ texture: { src: 'images/mainmenu/moderationTools.png' } }}
              />
              <Label
                value="Moderation Tools"
                uiTransform={{ width: '100%', height: '100%' }}
                fontSize={theme.buttonFontSize}
                font={theme.font}
                textAlign="middle-center"
              />
            </UiEntity>
          </Row>
        </Column>
      </Row>
    </UiEntity>
  )
}
