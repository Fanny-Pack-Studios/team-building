import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'
import { getScaleFactor } from '../canvas/Canvas'
import { type Player } from '../controllers/player.controller'

export class ModerationPanel {
  panelVisible = false
  searchText = ''
  players: Player[] = []
  readonly itemsPerPage = 4
  currentPage = 0
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
    this.players = this.gameController.playerController.getAllPlayers()
  }

  getFilteredPlayers(): Player[] {
    const allPlayers = this.gameController.playerController.getAllPlayers()
    if (this.searchText.trim() === '') return allPlayers
    return allPlayers.filter((p: { name: string }) => p.name.toLowerCase().includes(this.searchText.toLowerCase()))
  }

  getTotalPages(): number {
    return Math.ceil(this.getFilteredPlayers().length / this.itemsPerPage)
  }

  getCurrentPagePlayers(): Player[] {
    const filtered = this.getFilteredPlayers()
    const start = this.currentPage * this.itemsPerPage
    return filtered.slice(start, start + this.itemsPerPage)
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) this.currentPage--
  }

  goToNextPage(): void {
    if (this.currentPage < this.getTotalPages() - 1) this.currentPage++
  }

  handleSearchInput = (value: string): void => {
    this.searchText = value
    this.currentPage = 0 // Reset page on new search
  }

  banPlayer(player: Player): void {
    console.log(`Banning ${player.name}`)
    this.gameController.playerController.setBan(player.wallet, true)
  }

  unbanPlayer(player: Player): void {
    console.log(`Unbanning ${player.name}`)
    this.gameController.playerController.setBan(player.wallet, false)
  }

  giveHost(player: Player): void {
    console.log(`Giving host to ${player.name}`)
    this.gameController.playerController.setHost(player.wallet, true)
    this.gameController.stageUI.addAsHost(player.wallet)
  }

  removeHost(player: Player): void {
    console.log(`Removing host from ${player.name}`)
    this.gameController.playerController.setHost(player.wallet, false)
    this.gameController.playerController.removeHost(player.wallet)
  }

  createPlayerCard(player: Player): ReactEcs.JSX.Element {
    const isBanned = this.gameController.playerController.isPlayerBanned(player.wallet)
    const isHost = this.gameController.playerController.isPlayerHost(player.wallet)

    return (
      <UiEntity
        key={player.wallet}
        uiTransform={{
          flexDirection: 'column',
          width: 350 * getScaleFactor(),
          height: 90 * getScaleFactor(),
          margin: '5px',
          padding: '5px',
          borderRadius: 6,
          alignItems: 'flex-start'
        }}
        uiBackground={{ color: Color4.White() }}
      >
        {/* ROW 1: Name + Buttons on same line */}
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '2px'
          }}
        >
          <Label
            value={`${player.name}`}
            fontSize={12 * getScaleFactor()}
            color={Color4.Black()}
            uiTransform={{ margin: '2px' }}
          />

          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            {/* BAN / UNBAN button */}
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 100 * getScaleFactor(),
                height: 24 * getScaleFactor(),
                margin: '2px',
                padding: '2px',
                justifyContent: 'flex-start',
                borderRadius: 4
              }}
              uiBackground={{
                color: Color4.White()
              }}
              onMouseDown={() => {
                isBanned ? this.unbanPlayer(player) : this.banPlayer(player)
              }}
            >
              <UiEntity
                uiTransform={{
                  width: 15 * getScaleFactor(),
                  height: 15 * getScaleFactor(),
                  margin: { right: '5px' }
                }}
                uiBackground={{
                  texture: {
                    src: isBanned
                      ? 'images/moderatormenu/ban_activated.png'
                      : 'images/moderatormenu/ban_desactivated.png'
                  }
                }}
              />
              <Label value={isBanned ? 'Unban' : 'Ban'} fontSize={10 * getScaleFactor()} color={Color4.Black()} />
            </UiEntity>

            {/* MAKE / REMOVE HOST button */}
            <UiEntity
              uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 100 * getScaleFactor(),
                height: 24 * getScaleFactor(),
                margin: '2px',
                padding: '2px',
                justifyContent: 'flex-start',
                borderRadius: 4
              }}
              uiBackground={{
                color: Color4.White()
              }}
              onMouseDown={() => {
                isHost ? this.removeHost(player) : this.giveHost(player)
              }}
            >
              <UiEntity
                uiTransform={{
                  width: 15 * getScaleFactor(),
                  height: 15 * getScaleFactor(),
                  margin: { right: '5px' }
                }}
                uiBackground={{
                  texture: {
                    src: isHost
                      ? 'images/moderatormenu/crown_active.png'
                      : 'images/moderatormenu/crown_desactivated.png'
                  }
                }}
              />
              <Label
                value={isHost ? 'Remove Host' : 'Make Host'}
                fontSize={10 * getScaleFactor()}
                color={Color4.Black()}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>

        {/* ROW 2: Wallet below */}
        <Label
          value={`Wallet: ${player.wallet}`}
          fontSize={10 * getScaleFactor()}
          color={Color4.Gray()}
          uiTransform={{ margin: '2px' }}
        />

        {/* ROW 3: Status labels below */}
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: '2px'
          }}
        >
          <Label
            value={isBanned ? 'BANNED' : 'ACTIVE'}
            fontSize={9 * getScaleFactor()}
            color={Color4.White()}
            uiBackground={{
              color: isBanned ? Color4.Red() : Color4.fromHexString('#06B512')
            }}
            uiTransform={{ margin: { right: '5px' } }}
          />
          <Label
            value={isHost ? 'HOST' : ''}
            fontSize={9 * getScaleFactor()}
            color={Color4.White()}
            uiBackground={{
              color: isHost ? Color4.fromHexString('#E2C207') : Color4.Clear()
            }}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  create(): ReactEcs.JSX.Element | null {
    if (!this.panelVisible) return null
    if (this.gameController.uiController.canvasInfo === null) return null
    const totalPages = this.getTotalPages()

    return (
      <UiEntity
        key="moderation-panel-root"
        uiTransform={{
          flexDirection: 'column',
          width: this.gameController.uiController.canvasInfo.width,
          height: this.gameController.uiController.canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'column',
            width: 550 * getScaleFactor(),
            height: 500 * getScaleFactor(),
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '10px',
            borderRadius: 15,
            positionType: 'relative' // permite hijos absolutos
          }}
          uiBackground={{
            color: Color4.fromInts(40, 40, 40, 200)
          }}
        >
          {/* Exit button arriba derecha */}
          <UiEntity
            uiTransform={{
              width: 17 * getScaleFactor(),
              height: 17 * getScaleFactor(),
              positionType: 'absolute',
              position: { right: '14px', top: '10px' }
            }}
            uiBackground={{
              textureMode: 'stretch',
              texture: { src: 'images/moderatormenu/exit_white.png' }
            }}
            onMouseDown={() => {
              this.panelVisible = false
            }}
          />

          <Label
            value="Moderation Panel"
            fontSize={28 * getScaleFactor()}
            color={Color4.White()}
            uiTransform={{ margin: '8px' }}
          />

          <Input
            placeholder={this.searchText === '' ? 'Search players...' : ''}
            value={this.searchText}
            onChange={this.handleSearchInput}
            fontSize={16 * getScaleFactor()}
            uiTransform={{
              width: 350 * getScaleFactor(),
              height: 36 * getScaleFactor(),
              margin: '8px',
              borderRadius: 6
            }}
          />

          <UiEntity
            key="players-list"
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              width: 550 * getScaleFactor(),
              height: 320 * getScaleFactor(),
              padding: '5px',
              margin: '5px'
            }}
          >
            {this.getCurrentPagePlayers().map((player) => this.createPlayerCard(player))}
          </UiEntity>

          {/* Pagination Controls */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              width: 600 * getScaleFactor(),
              justifyContent: 'space-around',
              alignItems: 'center',
              margin: '10px'
            }}
          >
            <Button
              variant="secondary"
              uiTransform={{
                width: 30 * getScaleFactor(),
                height: 30 * getScaleFactor(),
                margin: { left: '10px' }
              }}
              uiBackground={{
                textureMode: 'center',
                texture: { src: 'images/createpollui/arrowLeft.png' }
              }}
              onMouseDown={() => {
                if (this.currentPage > 0) this.goToPreviousPage()
              }}
              value={''}
            />

            <Label
              value={`Page ${this.currentPage + 1} / ${totalPages}`}
              fontSize={16 * getScaleFactor()}
              color={Color4.White()}
            />

            <Button
              variant="secondary"
              uiTransform={{
                width: 30 * getScaleFactor(),
                height: 30 * getScaleFactor(),
                margin: '0px'
              }}
              uiBackground={{
                textureMode: 'center',
                texture: { src: 'images/createpollui/arrowRight.png' }
              }}
              onMouseDown={() => {
                if (this.currentPage < totalPages - 1) this.goToNextPage()
              }}
              value={''}
            />
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
