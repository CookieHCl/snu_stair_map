interface PathControlsProps {
  noStairs: boolean;
  setNoStairs: (value: boolean) => void;
}


export default function PathControls({ noStairs, setNoStairs }: PathControlsProps) {
  return <div>
    <div className="path-controls">
      <div className="nostairs-checkbox">
        <label>
          <input
            type="checkbox"
            checked={noStairs}
            onChange={e => setNoStairs(e.target.checked)}
          />
          계단 제거
        </label>
      </div>
    </div>
    <style jsx>{`
        .path-controls {
          position: absolute;
          bottom: 16px; right: 16px;
          background: rgba(255,255,255,0.9);
          padding: 8px; border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex; flex-direction: column; gap: 4px;
          z-index: 1;
        }
      `}</style>
  </div>;
}