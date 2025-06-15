import { MarkerState } from "@/types/markerState";

interface MarkerControlsProps {
  markerState: MarkerState;
  setMarkerState: (value: MarkerState) => void;
  deletable: boolean;
  setDeletable: (value: boolean) => void;
}


export default function MarkerControls({ markerState, setMarkerState, deletable, setDeletable }: MarkerControlsProps) {
  return <div>
    <div className="marker-controls">
      <div>
        <button
          onClick={() => setMarkerState(markerState === MarkerState.START ? MarkerState.NONE : MarkerState.START)}
          className={markerState === MarkerState.START ? "active" : ""}
        >
          출발
        </button>
        <button
          onClick={() => setMarkerState(markerState === MarkerState.END ? MarkerState.NONE : MarkerState.END)}
          className={markerState === MarkerState.END ? "active" : ""}
        >
          도착
        </button>
        {/* <button
          onClick={() => setMarkerState(markerState === MarkerState.ROAD ? MarkerState.NONE : MarkerState.ROAD)}
          className={markerState === MarkerState.ROAD ? "active" : ""}
        >
          도로
        </button>
        <button
          onClick={() => setMarkerState(markerState === MarkerState.STAIR ? MarkerState.NONE : MarkerState.STAIR)}
          className={markerState === MarkerState.STAIR ? "active" : ""}
        >
          계단
        </button> */}
      </div>
      {/* <label className="deletable-checkbox">
        <input
          type="checkbox"
          checked={deletable}
          onChange={e => setDeletable(e.target.checked)}
        />
        삭제 가능
      </label> */}
    </div>
    <style jsx>{`
        .marker-controls {
          position: absolute;
          top: 16px; left: 16px;
          background: rgba(255,255,255,0.9);
          padding: 8px; border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex; flex-direction: column; gap: 4px;
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
        .deletable-checkbox {
          margin-top: 8px;
        }
      `}</style>
  </div>;
}