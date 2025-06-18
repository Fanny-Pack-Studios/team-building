import { engine, type PBUiCanvasInformation, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { UiEntity, type UiTransformProps } from '@dcl/sdk/react-ecs'

function Canvas(props: {
  uiTransform?: UiTransformProps
  children?: ReactEcs.JSX.Element[]
}): ReactEcs.JSX.Element | null {
  const canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  if (canvasInfo === null) return null

  return (
    <UiEntity
      uiTransform={{
        width: canvasInfo.width,
        height: canvasInfo.height,
        positionType: 'absolute',
        position: { top: 0, left: 0 },
        ...props.uiTransform
      }}
    >
      {props.children}
    </UiEntity>
  )
}

export default Canvas

export function getScaleFactor(): number {
  const uiScaleFactor =
    (Math.min(getCanvas().width, getCanvas().height) / 1080) * 1.4;
  return uiScaleFactor;
}

function getCanvas(): PBUiCanvasInformation {
  const canvasInfo = UiCanvasInformation.get(engine.RootEntity);
  return canvasInfo;
}