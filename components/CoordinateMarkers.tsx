
import { Circle } from "react-kakao-maps-sdk"
import { IndexedCoordinate } from "@/types/coordinate"

interface CoordinateMarkersProps {
  coordinates: IndexedCoordinate[];
  removeCoordinate?: (index: number) => void;
}

export default function CoordinateMarkers({ coordinates, removeCoordinate }: CoordinateMarkersProps) {
  return <>
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
          removeCoordinate?.(coord.index)
        }} // 클릭 시 해당 좌표 제거
      />
    ))}
  </>
}