import { OrgRoamNode } from '../../api'
import { NodeObject } from 'force-graph'
import { initialVisuals } from '../config'
import { hexToRGBA, LinksByNodeId } from '../../pages'
import wrap from 'word-wrap'

export interface drawLabelsProps {
  labelBackgroundColor: string
  labelTextColor: string
  node: NodeObject
  ctx: any
  globalScale: number
  highlightedNodes: { [id: string]: {} }
  previouslyHighlightedNodes: { [id: string]: {} }
  visuals: typeof initialVisuals
  opacity: number
  nodeSize: (node: NodeObject) => number
  filteredLinksByNodeId: LinksByNodeId
}

export const getLabelOpacity = (
  fadeFactor: number,
  visuals: typeof initialVisuals,
  globalScale: number,
  opacity: number,
  isHighlighty: boolean,
) => {
  return isHighlighty
    ? Math.max(fadeFactor, opacity)
    : 1 * fadeFactor * (-1 * (visuals.highlightFade * opacity - 1))
}

export function drawLabels(props: drawLabelsProps) {
  const {
    labelBackgroundColor,
    labelTextColor,
    node,
    ctx,
    globalScale,
    highlightedNodes,
    previouslyHighlightedNodes,
    visuals,
    opacity,
    nodeSize,
    filteredLinksByNodeId,
  } = props

  if (!node) {
    return
  }

  if (!visuals.labels) {
    return
  }
  const links = filteredLinksByNodeId[(node as OrgRoamNode).id] ?? []

  const isHighlighty = !!(highlightedNodes[node.id!] || previouslyHighlightedNodes[node.id!])

  const fadeFactor = Math.min(
    3 * (globalScale - visuals.labelScale) + Math.pow(Math.min(links.length, 10), 1 / 2),
    1,
  )
  const nodeTitle = (node as OrgRoamNode).title ?? ''

  const label = nodeTitle.substring(0, visuals.labelLength)

  const fontSize = visuals.labelFontSize / (0.75 * Math.min(Math.max(0.5, globalScale), 3))

  const textWidth = ctx.measureText(label).width
  const bckgDimensions = [textWidth * 1.1, fontSize].map((n) => n + fontSize * 0.5) as [
    number,
    number,
  ] // some padding

  // draw label background
  const textOpacity = getLabelOpacity(fadeFactor, visuals, globalScale, opacity, isHighlighty)
  const nodeS = 8 * Math.cbrt(nodeSize(node) * visuals.nodeRel)
  if (visuals.labelBackgroundColor && visuals.labelBackgroundOpacity) {
    const backgroundOpacity = textOpacity * visuals.labelBackgroundOpacity
    const labelBackground = hexToRGBA(labelBackgroundColor, backgroundOpacity)
    ctx.fillStyle = labelBackground
    ctx.fillRect(
      node.x! - bckgDimensions[0] / 2,
      node.y! - bckgDimensions[1] / 2 + nodeS,
      ...bckgDimensions,
    )
  }

  // draw label text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const labelText = hexToRGBA(labelTextColor, textOpacity)
  ctx.fillStyle = labelText
  ctx.font = `${fontSize}px Sans-Serif`
  const wordsArray = wrap(label, { width: visuals.labelWordWrap }).split('\n')

  const truncatedWords =
    nodeTitle.length > visuals.labelLength
      ? [...wordsArray.slice(0, -1), `${wordsArray.slice(-1)}...`]
      : wordsArray
  truncatedWords.forEach((word, index) => {
    ctx.fillText(word, node.x!, node.y! + nodeS + visuals.labelLineSpace * fontSize * index)
  })
}
