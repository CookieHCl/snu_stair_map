import { coordinateToString } from "@/lib/coordinateUtils";
import { IndexedCoordinate, PathType } from "@/types/coordinate";
import { MarkerState } from "@/types/markerState";

interface PathControlsProps {
  fastestPath?: PathType;
  noStairs: boolean;
  setNoStairs: (value: boolean) => void;
  markerState: MarkerState;
  setMarkerState: (value: MarkerState) => void;
  startCoordinate?: IndexedCoordinate;
  endCoordinate?: IndexedCoordinate;
  exitPathMode: () => void;
}


export default function PathControls({ fastestPath, noStairs, setNoStairs, markerState, setMarkerState, startCoordinate, endCoordinate, exitPathMode }: PathControlsProps) {
  return <>
    <div className="path-controls">
      {fastestPath ? <div className="path-found">
        <label>
          <input
            type="checkbox"
            checked={noStairs}
            onChange={e => setNoStairs(e.target.checked)}
          />
          계단 제거
        </label>
        <label>
          경로를 찾았습니다!
        </label>
      </div> : <div className="path-not-found">
        {startCoordinate ? "도착지점을 선택해주세요!" : "출발지점을 선택해주세요!"}
      </div>}
      <button
        onClick={() => setMarkerState(markerState === MarkerState.START ? MarkerState.NONE : MarkerState.START)}
        className={markerState === MarkerState.START ? "active" : ""}
      >
        출발: {startCoordinate ? coordinateToString(startCoordinate) : "-, -"}
      </button>
      <button
        onClick={() => setMarkerState(markerState === MarkerState.END ? MarkerState.NONE : MarkerState.END)}
        className={markerState === MarkerState.END ? "active" : ""}
      >
        도착: {endCoordinate ? coordinateToString(endCoordinate) : "-, -"}
      </button>
      <button
        onClick={() => exitPathMode()}
      >
        취소
      </button>
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
        .path-found {
          display: flex; flex-direction: column; gap: 4px;
        }
        .path-controls button {
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          background: #eee;
          color: #333;
          cursor: pointer;
        }
        .path-controls button.active {
          background: #007AFF;
          color: #FFF;
        }
      `}</style>
  </>;
}