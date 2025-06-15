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
import MarkerControls from "@/components/MarkerControls";
import { MarkerState } from "@/types/markerState";

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
  const [markerState, setMarkerState] = useState(MarkerState.NONE);
  const [deletable, setDeletable] = useState(false) // 삭제 가능 체크박스 상태 추가
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

  async function saveCoordinates(newCoordinates: IndexedCoordinate[]) {
    setCoordinates(newCoordinates)

    const res = await fetch('/api/save-coords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: newCoordinates }),
    });
    const json = await res.json();
    if (json.success) {
      console.log("Saved coordinates: ", newCoordinates);
    } else {
      alert('저장 실패: ' + json.error);
    }
  };

  async function addCoordinate(coordinate: Coordinate) {
    if (!isInSNU) {
      console.warn("Cannot add coordinate outside SNU area");
      return;
    }
    const newCoordinates = [...coordinates, {
      index: indexRef.current++,
      lat: coordinate.lat,
      lng: coordinate.lng,
      is_stair: markerState === MarkerState.STAIR
    }]
    console.log("Adding coordinate ", coordinate);
    await saveCoordinates(newCoordinates)
  }

  async function removeCoordinate(index: number) {
    const newCoordinates = coordinates.filter(coord => coord.index !== index);
    console.log("Removing coordinate ", coordinates.find(coord => coord.index === index));
    await saveCoordinates(newCoordinates);
  }

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
          switch (markerState) {
            case MarkerState.ROAD:
            case MarkerState.STAIR:
              addCoordinate(mouseCoordinate);
              break;
            case MarkerState.START:
            case MarkerState.END:
              const otherCoordinate = markerState === MarkerState.START ? endCoordinate : startCoordinate;
              const coordinate = getNearestCoordinate(
                mouseCoordinate,
                coordinates.filter(coord => coord.index !== (otherCoordinate?.index ?? -1))
              );

              if (!coordinate) { return; }
              if (markerState === MarkerState.START) {
                setStartCoordinate(coordinate);
              } else {
                setEndCoordinate(coordinate);
              }
              break;
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
        {/* <SNUBorder
          onMouseStateChange={setIsInSNU}
        /> */}
        {/* <CoordinateMarkers
          coordinates={coordinates}
          removeCoordinate={removeCoordinate}
          deletable={deletable} // 삭제 가능 여부 전달
        /> */}
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
        {/* <Edges
          edges={edges}
        /> */}
        {fastestPath && (
          <Path
            coordinates={fastestPath}
          />
        )}
      </Map>
      <MarkerControls
        markerState={markerState}
        setMarkerState={setMarkerState}
        deletable={deletable}
        setDeletable={setDeletable}
      />
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
      `}</style>
  </>
}
