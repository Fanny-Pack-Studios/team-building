import ReactEcs, { Button, Input, Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { type GameController } from '../controllers/game.controller'
import { getScaleFactor } from '../canvas/Canvas'

type Player = {
  name: string
  wallet: string
  isBanned: boolean
  isHost: boolean
}

const MOCK_PLAYERS: Player[] = [
  { name: 'Alice', wallet: '0xabc123', isBanned: false, isHost: true },
  { name: 'Bob', wallet: '0xdef456', isBanned: true, isHost: false },
  { name: 'Carol', wallet: '0xghi789', isBanned: false, isHost: false },
  { name: 'Dave', wallet: '0xjkl012', isBanned: true, isHost: true },
  { name: 'Eve', wallet: '0xmnq345', isBanned: false, isHost: false },
  { name: 'Frank', wallet: '0xprx678', isBanned: true, isHost: false },
  { name: 'Grace', wallet: '0xstu901', isBanned: false, isHost: false },
  { name: 'Hank', wallet: '0xvwx234', isBanned: true, isHost: false },
  { name: 'Ivy', wallet: '0xyza567', isBanned: false, isHost: true }
]

export class NewModerationPanel {
  panelVisible = true
  searchText = ''
  players: Player[] = MOCK_PLAYERS

  readonly itemsPerPage = 4
  currentPage = 0
  gameController: GameController
  constructor(gameController: GameController) {
    this.gameController = gameController
  }

  getFilteredPlayers(): Player[] {
    if (this.searchText.trim() === '') return this.players
    return this.players.filter((p) => p.name.toLowerCase().includes(this.searchText.toLowerCase()))
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
    player.isBanned = true
  }

  unbanPlayer(player: Player): void {
    console.log(`Unbanning ${player.name}`)
    player.isBanned = false
  }

  giveHost(player: Player): void {
    console.log(`Giving host to ${player.name}`)
    player.isHost = true
  }

  removeHost(player: Player): void {
    console.log(`Removing host from ${player.name}`)
    player.isHost = false
  }

  createPlayerCard(player: Player): ReactEcs.JSX.Element {
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
        <Label
          value={`${player.name}`}
          fontSize={12 * getScaleFactor()}
          color={Color4.Black()}
          uiTransform={{ margin: '2px' }}
        />
        <Label
          value={`Wallet: ${player.wallet}`}
          fontSize={10 * getScaleFactor()}
          color={Color4.Gray()}
          uiTransform={{ margin: '2px' }}
        />

        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '2px'
          }}
        >
          <Label
            value={player.isBanned ? 'BANNED' : 'ACTIVE'}
            fontSize={9 * getScaleFactor()}
            color={Color4.White()}
            uiBackground={{ color: player.isBanned ? Color4.Red() : Color4.Green() }}
            uiTransform={{ margin: { right: '5px' } }}
          />
          <Label
            value={player.isHost ? 'HOST' : ''}
            fontSize={9 * getScaleFactor()}
            color={Color4.White()}
            uiBackground={{ color: player.isHost ? Color4.Yellow() : Color4.Clear() }}
          />
        </UiEntity>

        <UiEntity
          uiTransform={{
            width: '100%', // ocupa todo el ancho de la card
            flexDirection: 'row',
            justifyContent: 'flex-end', // empuja a la derecha
            alignItems: 'center',
            margin: '2px'
          }}
        >
          <Button
            value={player.isBanned ? 'Unban' : 'Ban'}
            variant="secondary"
            uiTransform={{
              width: 100 * getScaleFactor(),
              height: 24 * getScaleFactor()
            }}
            onMouseDown={() => {
              player.isBanned ? this.unbanPlayer(player) : this.banPlayer(player)
            }}
            uiBackground={{ color: Color4.Clear() }}
          />

          <Button
            value={player.isHost ? 'Remove Host' : 'Make Host'}
            variant="secondary"
            uiTransform={{
              width: 100 * getScaleFactor(),
              height: 24 * getScaleFactor()
            }}
            onMouseDown={() => {
              player.isHost ? this.removeHost(player) : this.giveHost(player)
            }}
            uiBackground={{ color: Color4.Clear() }}
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
            borderRadius: 15
          }}
          uiBackground={{
            color: Color4.fromInts(40, 40, 40, 200)
          }}
        >
          <Label
            value="Moderation Panel"
            fontSize={28 * getScaleFactor()}
            color={Color4.White()}
            uiTransform={{ margin: '8px' }}
          />

          <Input
            placeholder="Search players..."
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
            uiTransform={{
              flexDirection: 'column',
              alignItems: 'center',
              width: 550 * getScaleFactor(),
              height: 320 * getScaleFactor(),
              padding: '5px',
              margin: '5px'
            }}
            // uiBackground={{
            //   color: Color4.fromInts(255, 255, 255, 80)
            // }}
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
