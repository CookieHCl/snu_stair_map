"use client";

import { Map } from "react-kakao-maps-sdk"
import useKakaoLoader from "@lib/useKakaoLoader"
import { useState } from "react"

interface Coordinate {
  lat: number
  lng: number
}

export default function BasicMap() {
  useKakaoLoader()
  const [coordinates, setCoordinates] = useState<Coordinate[]>([])


  async function saveCoordinates(obj: Coordinate[]) {
    const res = await fetch('/api/save-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: obj }),
    });
    const json = await res.json();
    if (!json.success) {
      alert('저장 실패: ' + json.error);
    }
  };

  async function handleClick(latlng: kakao.maps.LatLng) {
    const lat = latlng.getLat()
    const lng = latlng.getLng()

    const newCoordinates = [...coordinates, { lat, lng }]

    setCoordinates(newCoordinates)
    console.log("Last clicked: ", { lat, lng })
    await saveCoordinates(newCoordinates)
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
        handleClick(mouseEvent.latLng)
      }}
    />
  )
}
