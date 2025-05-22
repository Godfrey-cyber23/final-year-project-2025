import React, { useMemo } from 'react';

const hexToHSL = (hex) => {
  hex = hex.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 0xff;
  const g = (bigint >> 8) & 0xff;
  const b = bigint & 0xff;

  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r1) h = ((g1 - b1) / delta) % 6;
    else if (max === g1) h = ((b1 - r1) / delta) + 2;
    else h = ((r1 - g1) / delta) + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h: h / 360, s, l };
};

const SpinnerOriginal = ({ color }) => {
  const colors = useMemo(
    () =>
      Array(6).fill(color).map((col, index) => {
        const { h, s, l } = hexToHSL(col);
        const newH = Math.min(360, h * 360 + 10 * index);
        const rounded = [newH, s * 100, l * 100].map(Math.round);
        return `hsl(${rounded[0]}, ${rounded[1]}%, ${rounded[2]}%)`;
      }),
    [color]
  );

  return (
    <svg className="global-spinner" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      {[60, 52.5, 46, 40.5, 36, 32.5].map((r, i) => (
        <circle
          key={i}
          className={`pl__ring${i + 1}`}
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={colors[i]}
          strokeWidth={8 - i}
          transform="rotate(-90,64,64)"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * r} ${2 * Math.PI * r}`}
          strokeDashoffset={`-${(2 * Math.PI * r * 0.999).toFixed(1)}`}
        />
      ))}
    </svg>
  );
};

const LoadingSpinner = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    zIndex: 9999
  }}>
    <SpinnerOriginal color="#006B3F" />
    <p style={{ marginTop: '1rem', fontSize: '1.25rem' }}>
      Initializing Security System...
    </p>

    <style>{`
      .global-spinner {
        width: 8em;
        height: 8em;
      }
      .global-spinner circle {
        transform-box: fill-box;
        transform-origin: 50% 50%;
      }
      ${[1, 2, 3, 4, 5, 6].map((i) => `
        .pl__ring${i} {
          animation: ring${i} 4s ${0.04 * (i - 1)}s ease-in-out infinite;
        }
      `).join('')}
      ${[60, 52.5, 46, 40.5, 36, 32.5].map((r, i) => {
        const offset = (2 * Math.PI * r * 0.999).toFixed(9);
        const dash = (2 * Math.PI * r).toFixed(9);
        return `
          @keyframes ring${i + 1} {
            from {
              stroke-dashoffset: -${offset};
              transform: rotate(-0.25turn);
              animation-timing-function: ease-in;
            }
            23% {
              stroke-dashoffset: -${(dash * 0.25).toFixed(6)};
              transform: rotate(1turn);
              animation-timing-function: ease-out;
            }
            46%, 50% {
              stroke-dashoffset: -${offset};
              transform: rotate(2.25turn);
              animation-timing-function: ease-in;
            }
            73% {
              stroke-dashoffset: -${(dash * 0.25).toFixed(6)};
              transform: rotate(3.5turn);
              animation-timing-function: ease-out;
            }
            96%, to {
              stroke-dashoffset: -${offset};
              transform: rotate(4.75turn);
            }
          }
        `;
      }).join('\n')}
    `}</style>
  </div>
);

export default LoadingSpinner;
