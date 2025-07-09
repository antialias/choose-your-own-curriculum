import { css } from '@/styled-system/css'
import { useCurriculumGraph } from './CurriculumGraphContext'
import { Tooltip } from './Tooltip'

export type TagPillProps = {
  text: string
  vector: number[]
}

function vectorToColor(v: number[]): string {
  if (v.length < 3) return '#999'
  const hue = ((v[0] + 1) / 2) * 360
  const sat = 60 + ((v[1] + 1) / 2) * 40
  const light = 35 + ((v[2] + 1) / 2) * 30
  return `hsl(${Math.floor(hue) % 360}, ${Math.floor(sat)}%, ${Math.floor(light)}%)`
}

export function TagPill({ text, vector }: TagPillProps) {
  const color = vectorToColor(vector)
  const { graph } = useCurriculumGraph()
  const nodes = graph?.nodes.filter((n) => n.tags.includes(text)) || []
  const content = nodes.map((n) => {
    const from = graph?.edges
      .filter((e) => e[1] === n.id)
      .map((e) => graph?.nodes.find((x) => x.id === e[0])?.label)
      .filter(Boolean)
    const to = graph?.edges
      .filter((e) => e[0] === n.id)
      .map((e) => graph?.nodes.find((x) => x.id === e[1])?.label)
      .filter(Boolean)
    return (
      <div key={n.id} className={css({ mb: '2' })}>
        <strong>{n.label}</strong>
        {from && from.length > 0 && (
          <div>
            <span className={css({ fontWeight: 'medium' })}>From:</span> {from.join(', ')}
          </div>
        )}
        {to && to.length > 0 && (
          <div>
            <span className={css({ fontWeight: 'medium' })}>To:</span> {to.join(', ')}
          </div>
        )}
      </div>
    )
  })
  const pill = (
    <span
      className={css({
        display: 'inline-block',
        paddingX: '2',
        paddingY: '1',
        borderRadius: 'full',
        color: 'white',
        fontSize: 'sm',
        marginRight: '1',
        marginTop: '3',
      })}
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  )
  return nodes.length > 0 ? <Tooltip content={content}>{pill}</Tooltip> : pill
}
