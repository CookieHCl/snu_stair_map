"use client";

import { Map, Circle } from "react-kakao-maps-sdk"
import useKakaoLoader from "@lib/useKakaoLoader"
import { useRef, useState } from "react"

interface IndexedCoordinate {
  index: number
  lat: number
  lng: number
  is_stair: boolean
}

interface Coordinate {
  lat: number
  lng: number
  is_stair: boolean
}

export default function BasicMap() {
  useKakaoLoader()
  const [coordinates, setCoordinates] = useState<IndexedCoordinate[]>([])
  const [isStair, setIsStair] = useState(false)
  const indexRef = useRef(0)

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
    const newCoordinates = [...coordinates, {
      index: indexRef.current++,
      lat: coordinate.lat,
      lng: coordinate.lng,
      is_stair: coordinate.is_stair
    }]
    console.log("Adding coordinate ", coordinate);
    await saveCoordinates(newCoordinates)
  }

  async function removeCoordinate(index: number) {
    const newCoordinates = coordinates.filter(coord => coord.index !== index);
    console.log("Removing coordinate ", coordinates.find(coord => coord.index === index));
    await saveCoordinates(newCoordinates);
  }

  return <>
    <div className="map-container">
      <Map // 지도를 표시할 Container
        id="map"
        center={{
          // 지도의 중심좌표
          lat: 37.4600110643526,
          lng: 126.95127303920887,
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "100%",
        }}
        level={3} // 지도의 확대 레벨
        onClick={(_, mouseEvent) => {
          const lat = mouseEvent.latLng.getLat()
          const lng = mouseEvent.latLng.getLng()
          addCoordinate({
            lat: lat,
            lng: lng,
            is_stair: isStair
          })
        }}
      >
        {coordinates.map((coord) => (
          <Circle
            key={coord.index} // 각 Circle에 고유한 key 지정
            center={{ lat: coord.lat, lng: coord.lng }}               // 각 좌표마다 Center 지정
            radius={5}
            strokeWeight={1}
            strokeColor={coord.is_stair ? "#00FF33" : "#FF0000"}
            strokeOpacity={1.0}
            fillColor={coord.is_stair ? "#00FF33" : "#FF0000"}
            fillOpacity={0.8}
            onClick={() => {
              kakao.maps.event.preventMap();
              removeCoordinate(coord.index)
            }} // 클릭 시 해당 좌표 제거
          />
        ))}
      </Map>
      <div className="controls">
        <button
          onClick={() => setIsStair(false)}
          className={!isStair ? "active" : ""}
        >
          도로
        </button>
        <button
          onClick={() => setIsStair(true)}
          className={isStair ? "active" : ""}
        >
          계단
        </button>
      </div>
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
