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

  return (
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
          is_stair: false // 기본값으로 계단이 아닌 것으로 설정
        })
      }}
    >
      {coordinates.map((coord) => (
        <Circle
          key={coord.index} // 각 Circle에 고유한 key 지정
          center={{ lat: coord.lat, lng: coord.lng }}               // 각 좌표마다 Center 지정
          radius={3}
          strokeWeight={1}
          strokeColor="#FF0000"
          strokeOpacity={1.0}
          fillColor="#FF0000"
          fillOpacity={0.8}
          onClick={() => {
            kakao.maps.event.preventMap();
            removeCoordinate(coord.index)
          }} // 클릭 시 해당 좌표 제거
        />
      ))}
    </Map>
  )
}
