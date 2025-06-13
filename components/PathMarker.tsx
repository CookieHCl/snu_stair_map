import { IndexedCoordinate } from "@/types/coordinate";
import { MapMarker } from "react-kakao-maps-sdk";

interface PathMarkerProps {
  coordinate?: IndexedCoordinate;
  isStart: boolean;
}

export default function PathMarker({ coordinate, isStart }: PathMarkerProps) {
  if (!coordinate) return <></>;

  const startImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png",
    size: {
      width: 50,
      height: 45
    },
    options: {
      offset: {
        x: 15,
        y: 43
      },
    },
  }

  const endImage = {
    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png",
    size: {
      width: 50,
      height: 45
    },
    options: {
      offset: {
        x: 15,
        y: 43
      },
    },
  }

  return <MapMarker // 마커를 생성하고 지도에 표시합니다
    position={{
      // 마커가 표시될 위치입니다
      lat: coordinate.lat,
      lng: coordinate.lng,
    }}
    image={isStart ? startImage : endImage}
  />
}
