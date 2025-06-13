enum MarkerState {
  ROAD = 0,
  STAIR = 1,
  START = 2,
  END = 3,
}

interface MarkerControlsProps {
  markerState: MarkerState;
  setMarkerState: (value: MarkerState) => void;
}


export default function MarkerControls({ markerState, setMarkerState }: MarkerControlsProps) {
  return <div>
    <div className="marker-controls">
      <button
        onClick={() => setMarkerState(MarkerState.START)}
        className={markerState === MarkerState.START ? "active" : ""}
      >
        출발
      </button>
      <button
        onClick={() => setMarkerState(MarkerState.END)}
        className={markerState === MarkerState.END ? "active" : ""}
      >
        도착
      </button>
      <button
        onClick={() => setMarkerState(MarkerState.ROAD)}
        className={markerState === MarkerState.ROAD ? "active" : ""}
      >
        도로
      </button>
      <button
        onClick={() => setMarkerState(MarkerState.STAIR)}
        className={markerState === MarkerState.STAIR ? "active" : ""}
      >
        계단
      </button>
    </div>
    <style jsx>{`
        .marker-controls {
          position: absolute;
          top: 16px; left: 16px;
          background: rgba(255,255,255,0.9);
          padding: 8px; border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex; gap: 4px;
          z-index: 1;
        }
        .marker-controls button {
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          background: #eee;
          color: #333;
          cursor: pointer;
        }
        .marker-controls button.active {
          background: #007AFF;
          color: #FFF;
        }
      `}</style>
  </div>;
}