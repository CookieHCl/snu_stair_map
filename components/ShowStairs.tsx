// add checkbox UI right above GetDirections

interface ShowStairsProps {
  showStairs: boolean;
  setShowStairs: (value: boolean) => void;
  isPathMode: boolean;
}

export default function ShowStairs({ showStairs, setShowStairs, isPathMode }: ShowStairsProps) {
  return (
    <div className="show-stairs-controls">
      <label>
        <input
          type="checkbox"
          checked={showStairs}
          onChange={e => setShowStairs(e.target.checked)}
        />
        계단 표시
      </label>
      <style jsx>{`
        .show-stairs-controls {
          position: absolute;
          bottom: 170px; right: 16px;
          background: rgba(255,255,255,0.9);
          padding: 8px; border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          z-index: 1;
        }
        .show-stairs-controls label {
          cursor: pointer;
        }
        /* In mobile, GetDirections height becomes 100px -> 75px */
        @media (max-width: 600px) {
          .show-stairs-controls {
            bottom: ${isPathMode ? 170 : 145}px; /* Adjusted to avoid overlap with GetDirections */
          }
        }
      `}</style>
    </div>
  );
}