import { coordinatePrettyString } from "@/lib/coordinateUtils";
import { IndexedCoordinate } from "@/types/coordinate";
import { MarkerState } from "@/types/markerState";
import { PathType } from "@/types/path";
import { SNUBuilding } from "@/types/snu_building";

interface PathControlsProps {
  fastestPath?: PathType;
  noStairs: boolean;
  setNoStairs: (value: boolean) => void;
  markerState: MarkerState;
  setMarkerState: (value: MarkerState) => void;
  startCoordinate?: IndexedCoordinate;
  endCoordinate?: IndexedCoordinate;
  exitPathMode: () => void;
  buildings: SNUBuilding[];
}


export default function PathControls({ fastestPath, noStairs, setNoStairs, markerState, setMarkerState, startCoordinate, endCoordinate, exitPathMode, buildings }: PathControlsProps) {
  console.log("PathControls rendered", fastestPath)

  return <>
    <div className="path-controls">
      {startCoordinate && endCoordinate ? <div className="path-finished">
        {fastestPath ? <>
          <label>
            <input
              type="checkbox"
              checked={noStairs}
              onChange={e => setNoStairs(e.target.checked)}
            />
            계단 제거
          </label>
          <label>
            경로를 찾았습니다! 거리: {(fastestPath.dist / 1000).toFixed(2)}km
          </label>
        </> : <label>
          경로가 존재하지 않습니다.
        </label>}
      </div> : <div className="path-not-finished">
        {startCoordinate ? "도착지점을 선택해주세요!" : "출발지점을 선택해주세요!"}
      </div>}
      <button
        onClick={() => setMarkerState(markerState === MarkerState.START ? MarkerState.NONE : MarkerState.START)}
        className={markerState === MarkerState.START ? "active" : ""}
      >
        출발: {startCoordinate ? coordinatePrettyString(startCoordinate, buildings) : "-"}
      </button>
      <button
        onClick={() => setMarkerState(markerState === MarkerState.END ? MarkerState.NONE : MarkerState.END)}
        className={markerState === MarkerState.END ? "active" : ""}
      >
        도착: {endCoordinate ? coordinatePrettyString(endCoordinate, buildings) : "-"}
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
        .path-finished {
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