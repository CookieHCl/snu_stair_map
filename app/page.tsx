"use client";

import { Map } from "react-kakao-maps-sdk"
import useKakaoLoader from "@lib/useKakaoLoader"
import { useMemo, useRef, useState } from "react"
import { IndexedCoordinate, Coordinate } from "@/types/coordinate"
import CoordinateMarkers from "@components/CoordinateMarkers"
import SNUBorder from "@components/SnuBorder";
import { coordinates as initialCoordinates } from "@/datas/coordinates.json"
import { getNearestCoordinate } from "@/lib/coordinateUtils"
import PathMarker from "@/components/PathMarker";
import Path from "@/components/Path";
import { getEdges, getFastestPath } from "@/lib/pathUtils";
import PathControls from "@/components/PathControls";
import Edges from "@/components/Edges";

const CENTER_LAT = 37.4600110643526;
const CENTER_LNG = 126.95127303920887;

type ZoomLevel = 1 | 2 | 3 | 4 | 5;

const CENTER_RANGE: Record<ZoomLevel, { lat: [number, number], lng: [number, number] }> = {
  1: {
    lat: [37.445, 37.47],
    lng: [126.945, 126.961],
  },
  2: {
    lat: [37.445, 37.47],
    lng: [126.945, 126.961],
  },
  3: {
    lat: [37.445, 37.47],
    lng: [126.945, 126.961],
  },
  4: {
    lat: [37.445, 37.47],
    lng: [126.945, 126.961],
  },
  5: {
    lat: [37.445, 37.47],
    lng: [126.945, 126.961],
  },
}

export default function Home() {
  useKakaoLoader()
  const [coordinates, setCoordinates] = useState<IndexedCoordinate[]>(initialCoordinates)
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(3)
  const [isInSNU, setIsInSNU] = useState(false)
  const [isStart, setIsStart] = useState(true);
  const [startCoordinate, setStartCoordinate] = useState<IndexedCoordinate | undefined>(undefined);
  const [endCoordinate, setEndCoordinate] = useState<IndexedCoordinate | undefined>(undefined);
  const [noStairs, setNoStairs] = useState(false);
  const indexRef = useRef(Math.max(...coordinates.map(coord => coord.index)) + 1);

  const edges = useMemo(() => {
    return getEdges(coordinates);
  }, [coordinates]);
  const fastestPath = useMemo(() => {
    if (!startCoordinate || !endCoordinate) return null;

    if (noStairs) {
      const filteredCoordinates = coordinates.filter(coord => !coord.is_stair);
      return getFastestPath(filteredCoordinates, startCoordinate, endCoordinate);
    }
    else {
      return getFastestPath(coordinates, startCoordinate, endCoordinate);
    }
  }, [coordinates, startCoordinate, endCoordinate, noStairs]);

  async function handleCenterChange(map: kakao.maps.Map, currentZoomLevel: ZoomLevel) {
    const movedCenter = map.getCenter();
    const movedLat = movedCenter.getLat()
    const movedLng = movedCenter.getLng()

    const centerRange = CENTER_RANGE[currentZoomLevel];
    const lat = Math.min(Math.max(movedLat, centerRange.lat[0]), centerRange.lat[1]);
    const lng = Math.min(Math.max(movedLng, centerRange.lng[0]), centerRange.lng[1]);
    const center = new kakao.maps.LatLng(lat, lng);
    map.setCenter(center)
  }

  return <>
    <div className="map-container">
      <Map // 지도를 표시할 Container
        id="map"
        center={{
          // 지도의 중심좌표
          lat: CENTER_LAT,
          lng: CENTER_LNG,
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "100%",
        }}
        level={3} // 지도의 확대 레벨
        onClick={(_, mouseEvent) => {
          const mouseCoordinate = { lat: mouseEvent.latLng.getLat(), lng: mouseEvent.latLng.getLng() }
          const otherCoordinate = isStart ? endCoordinate : startCoordinate;
          const coordinate = getNearestCoordinate(
            mouseCoordinate,
            coordinates.filter(coord => coord.index !== (otherCoordinate?.index ?? -1))
          );

          if (!coordinate) { return; }
          if (isStart) {
            setStartCoordinate(coordinate);
          }
          else {
            setEndCoordinate(coordinate);
          }
        }}
        minLevel={5}
        onZoomChanged={(map) => {
          const newZoomLevel = map.getLevel() as ZoomLevel
          setZoomLevel(newZoomLevel)
          handleCenterChange(map, newZoomLevel)
        }}
        onCenterChanged={(map) => {
          handleCenterChange(map, zoomLevel)
        }}
      >
        <SNUBorder
          onMouseStateChange={setIsInSNU}
        />
        <CoordinateMarkers
          coordinates={coordinates}
        />
        {startCoordinate && (
          <PathMarker
            coordinate={startCoordinate}
            isStart={true}
          />
        )}
        {endCoordinate && (
          <PathMarker
            coordinate={endCoordinate}
            isStart={false}
          />
        )}
        <Edges
          edges={edges}
        />
        {fastestPath && (
          <Path
            coordinates={fastestPath}
          />
        )}
      </Map>
      <div className="controls">
        <button
          onClick={() => setIsStart(true)}
          className={isStart ? "active" : ""}
        >
          출발
        </button>
        <button
          onClick={() => setIsStart(false)}
          className={!isStart ? "active" : ""}
        >
          도착
        </button>
      </div>
      {fastestPath && <PathControls
        noStairs={noStairs}
        setNoStairs={setNoStairs}
      />}
    </div >
    <style jsx>{`
        .map-container {
          position: relative;
          width: 100%; height: 100%;
        }
        .controls {
          position: absolute;
          top: 16px; left: 16px;
          background: rgba(255,255,255,0.9);
          padding: 8px; border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex; gap: 4px;
          z-index: 1;
        }
        .controls button {
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          background: #eee;
          color: #333;
          cursor: pointer;
        }
        .controls button.active {
          background: #007AFF;
          color: #FFF;
        }
      `}</style>
  </>
}
