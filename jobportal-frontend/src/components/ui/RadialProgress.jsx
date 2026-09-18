const SIZE = 220;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_DEGREES = 250; // total sweep of the visible track
const GAP_DEGREES = 360 - ARC_DEGREES;
const ROTATE = -90 - GAP_DEGREES / 2; // centers the gap at the bottom

/**
 * percent: 0–100. `label` renders under the big number (e.g. "+10%").
 */
export function RadialProgress({ percent, label }) {
  const trackFraction = ARC_DEGREES / 360;
  const trackLength = CIRCUMFERENCE * trackFraction;
  const progressLength = trackLength * (Math.min(Math.max(percent, 0), 100) / 100);

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE * 0.72 }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute left-0 top-0"
      >
        <g transform={`rotate(${ROTATE} ${SIZE / 2} ${SIZE / 2})`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#e3e7eb"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${trackLength} ${CIRCUMFERENCE - trackLength}`}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#2042e3"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${progressLength} ${CIRCUMFERENCE - progressLength}`}
          />
        </g>
      </svg>
      <div className="absolute inset-x-0 top-[42%] flex flex-col items-center gap-1 -translate-y-1/2">
        <span className="text-3xl font-bold text-ink-900">{percent}%</span>
        {label && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
