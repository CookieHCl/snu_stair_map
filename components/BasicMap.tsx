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

  function setsetCoordinates(latlng: kakao.maps.LatLng) {
    const lat = latlng.getLat()
    const lng = latlng.getLng()

    const newCoordinates = [...coordinates, { lat, lng }]

    setCoordinates(newCoordinates)
    console.log("Last clicked: ", { lat, lng })
    console.log(newCoordinates)
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
        setsetCoordinates(mouseEvent.latLng)
      }}
    />
  )
}
