import ReactEcs, { type EntityPropTypes, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { merge } from 'ts-deepmerge'
import { getScaleFactor } from '../../canvas/Canvas'
import { engine } from '@dcl/sdk/ecs'

export function Switch(
  props: {
    initialValue?: boolean
    onChange?: (newValue: boolean) => void
  } & EntityPropTypes
): ReactEcs.JSX.Element {
  const { initialValue = false, onChange, ...rest } = props
  const sf = getScaleFactor()

  const [isChecked, setChecked] = ReactEcs.useState(initialValue)
  const [thumbPosition, setThumbPosition] = ReactEcs.useState(initialValue ? 1 : 0)
  const [animating, setAnimating] = ReactEcs.useState(false)
  const [targetPosition, setTargetPosition] = ReactEcs.useState(initialValue ? 1 : 0)
  const animationSpeed = 3

  // Textures (matching the first code)
  const switchBgOnSrc = 'images/createpollui/switch_bg_on.png'
  const switchBgOffSrc = 'images/createpollui/switch_bg_off.png'
  const switchThumbOnSrc = 'images/createpollui/switch_thum_on.png'
  const switchThumbOffSrc = 'images/createpollui/switch_thum_off.png'

  // Animation system
  ReactEcs.useEffect(() => {
    if (!animating) return

    function animateSystem(dt: number): void {
      const diff = targetPosition - thumbPosition
      const step = animationSpeed * dt

      if (Math.abs(diff) <= step) {
        setThumbPosition(targetPosition)
        setAnimating(false)
        engine.removeSystem(animateSystem)
      } else {
        setThumbPosition((prev) => prev + Math.sign(diff) * step)
      }
    }

    engine.addSystem(animateSystem)

    // Cleanup (just in case)
    return () => {
      engine.removeSystem(animateSystem)
    }
  }, [animating, thumbPosition, targetPosition])

  // Handle click
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleToggle = () => {
    if (animating) return
    const newValue = !isChecked
    setChecked(newValue)
    setTargetPosition(newValue ? 1 : 0)
    setAnimating(true)
    if (onChange != null) onChange(newValue)
  }

  return (
    <UiEntity
      {...merge(
        {
          uiTransform: {
            width: 66 * sf,
            height: 34 * sf,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          },
          onMouseDown: handleToggle
        } satisfies EntityPropTypes,
        rest
      )}
    >
      {/* BACKGROUND OFF */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: switchBgOffSrc },
          color: Color4.create(1, 1, 1, 1 - thumbPosition)
        }}
      />

      {/* BACKGROUND ON */}
      <UiEntity
        uiTransform={{
          width: '100%',
          height: '100%',
          positionType: 'absolute'
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: switchBgOnSrc },
          color: Color4.create(1, 1, 1, thumbPosition)
        }}
      />

      {/* THUMB OFF */}
      <UiEntity
        uiTransform={{
          width: 32 * sf,
          height: 30 * sf,
          positionType: 'absolute',
          position: {
            left: `${4 + 40 * thumbPosition}%`
          }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: switchThumbOffSrc },
          color: Color4.create(1, 1, 1, 1 - thumbPosition)
        }}
      />

      {/* THUMB ON */}
      <UiEntity
        uiTransform={{
          width: 32 * sf,
          height: 30 * sf,
          positionType: 'absolute',
          position: {
            left: `${4 + 40 * thumbPosition}%`
          }
        }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: switchThumbOnSrc },
          color: Color4.create(1, 1, 1, thumbPosition)
        }}
      />
    </UiEntity>
  )
}
