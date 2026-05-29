type Node = { x: number; y: number }
type Edge = { from: number; to: number; signal?: boolean }

const NODES: readonly Node[] = [
  { x: 60, y: 100 },
  { x: 480, y: 80 },
  { x: 720, y: 60 },
  { x: 1140, y: 120 },
  { x: 180, y: 220 },
  { x: 340, y: 160 },
  { x: 880, y: 180 },
  { x: 1020, y: 260 },
  { x: 90, y: 380 },
  { x: 1150, y: 420 },
  { x: 200, y: 520 },
  { x: 1000, y: 560 },
  { x: 60, y: 680 },
  { x: 260, y: 720 },
  { x: 550, y: 760 },
  { x: 820, y: 740 },
  { x: 940, y: 740 },
  { x: 1100, y: 700 },
]

const EDGES: readonly Edge[] = [
  { from: 0, to: 4 },
  { from: 0, to: 5, signal: true },
  { from: 1, to: 5 },
  { from: 1, to: 2, signal: true },
  { from: 2, to: 6 },
  { from: 2, to: 3 },
  { from: 3, to: 7, signal: true },
  { from: 4, to: 5 },
  { from: 4, to: 8, signal: true },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
  { from: 7, to: 9, signal: true },
  { from: 8, to: 10 },
  { from: 8, to: 12 },
  { from: 9, to: 11 },
  { from: 9, to: 17 },
  { from: 10, to: 13 },
  { from: 10, to: 14, signal: true },
  { from: 11, to: 15 },
  { from: 11, to: 16 },
  { from: 12, to: 13 },
  { from: 13, to: 14 },
  { from: 14, to: 15, signal: true },
  { from: 15, to: 16 },
  { from: 16, to: 17 },
]

export function HeroBackground() {
  const signalEdges = EDGES.filter((e) => e.signal)

  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none text-primary"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" fill="none" strokeWidth={1}>
        {EDGES.map((e, i) => {
          const a = NODES[e.from]
          const b = NODES[e.to]
          return (
            <line
              key={`edge-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeOpacity={0.12}
            />
          )
        })}
      </g>

      <g stroke="currentColor" fill="none" strokeWidth={1.5} strokeLinecap="round">
        {signalEdges.map((e, i) => {
          const a = NODES[e.from]
          const b = NODES[e.to]
          return (
            <line
              key={`signal-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeOpacity={0.9}
              className="signal-edge"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          )
        })}
      </g>

      <g fill="currentColor">
        {NODES.map((n, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={3}
              className="pulse-node"
              style={{ animationDelay: `${(i * 0.37) % 3.2}s` }}
            />
            <circle cx={n.x} cy={n.y} r={2} opacity={0.7} />
          </g>
        ))}
      </g>
    </svg>
  )
}
