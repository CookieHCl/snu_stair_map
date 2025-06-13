"use client";

import { Map } from "react-kakao-maps-sdk"
import useKakaoLoader from "@lib/useKakaoLoader"
import { useState } from "react"

const CENTER_LAT = 37.4600110643526;
const CENTER_LNG = 126.95127303920887;

type ZoomLevel = 1 | 2 | 3 | 4 | 5;

const CENTER_RANGE: Record<ZoomLevel, { lat: [number, number], lng: [number, number]}> = {
  1: {
    lat: [37.44, 37.47],
    lng: [126.94, 126.961],
  },
  2: {
    lat: [37.44, 37.47],
    lng: [126.94, 126.961],
  },
  3: {
    lat: [37.44, 37.47],
    lng: [126.94, 126.961],
  },
  4: {
    lat: [37.44, 37.47],
    lng: [126.94, 126.961],
  },
  5: {
    lat: [37.44, 37.47],
    lng: [126.94, 126.961],
  },
}

interface Coordinate {
  lat: number
  lng: number
}

export default function BasicMap() {
  useKakaoLoader()
  const [coordinates, setCoordinates] = useState<Coordinate[]>([])
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(3)

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

  return (
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
      level={zoomLevel} // 지도의 확대 레벨
      onClick={(_, mouseEvent) => {
        handleClick(mouseEvent.latLng)
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
    />
  )
}
