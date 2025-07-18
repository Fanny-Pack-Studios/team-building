import { Animator, engine, type Entity, Schemas } from '@dcl/sdk/ecs'

const votingDoorsEntity = engine.addEntity()

export type VotingDoorNumber = 1 | 2 | 3 | 4

const allDoorNumbers: VotingDoorNumber[] = [1, 2, 3, 4]

function doorEntity(doorNumber: VotingDoorNumber): Entity | null {
  return engine.getEntityOrNullByName(`VotingDoor${doorNumber}`)
}

function doorOpenAnimation(doorNumber: VotingDoorNumber): string {
  return `voting_door0${doorNumber}_open`
}

function doorCloseAnimation(doorNumber: VotingDoorNumber): string {
  return `voting_door0${doorNumber}_close`
}

const VotingDoorsComponent = engine.defineComponent('votingDoorsComponent', {
  activeDoors: Schemas.Map({
    1: Schemas.Boolean,
    2: Schemas.Boolean,
    3: Schemas.Boolean,
    4: Schemas.Boolean
  })
})

export function setupVotingDoors(): void {
  VotingDoorsComponent.create(votingDoorsEntity, {
    activeDoors: { 1: false, 2: false, 3: false, 4: false }
  })
  VotingDoorsComponent.onChange(votingDoorsEntity, (component) => {
    if (component === undefined) return
    for (const i of allDoorNumbers) {
      console.log('Puerta ', i, ' --- ', 'Abierta: ', component.activeDoors[i])
      const door = doorEntity(i)
      if (door === null) continue
      const isOpen = component.activeDoors[i]
      if (isOpen) {
        Animator.playSingleAnimation(door, doorOpenAnimation(i), false)
      } else {
        Animator.playSingleAnimation(door, doorCloseAnimation(i), false)
      }
    }
  })
}

export function openVotingDoors(doorNumbers: VotingDoorNumber[]): void {
  toggleDoors(true, doorNumbers)
}

export function closeVotingDoors(doorNumbers: VotingDoorNumber[]): void {
  toggleDoors(false, doorNumbers)
}

export function closeAllOpenedDoors(): void {
  const component = VotingDoorsComponent.getMutable(votingDoorsEntity)
  const doorsToClose = allDoorNumbers.filter((door) => component.activeDoors[door])
  closeVotingDoors(doorsToClose)
}

function toggleDoors(value: boolean, doorNumbers: VotingDoorNumber[]): void {
  const component = VotingDoorsComponent.getMutable(votingDoorsEntity)
  for (const doorNumber of doorNumbers) {
    component.activeDoors[doorNumber] = value
  }
}
