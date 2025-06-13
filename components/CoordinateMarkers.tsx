
import { Circle } from "react-kakao-maps-sdk"
import { IndexedCoordinate } from "@/types/coordinate"

interface CoordinateMarkersProps {
  coordinates: IndexedCoordinate[];
  removeCoordinate?: (index: number) => void;
  deletable: boolean; // 삭제 가능 여부
}

export default function CoordinateMarkers({ coordinates, removeCoordinate, deletable }: CoordinateMarkersProps) {
  return <>
    {coordinates.map((coord) => (
      <Circle
        key={coord.index} // 각 Circle에 고유한 key 지정
        center={{ lat: coord.lat, lng: coord.lng }}               // 각 좌표마다 Center 지정
        radius={5}
        strokeWeight={2}
        strokeColor={coord.is_stair ? "#00FF33" : "#FF0000"}
        strokeOpacity={1.0}
        fillColor={coord.is_stair ? "#00FF33" : "#FF0000"}
        fillOpacity={0.15}
        onClick={() => {
          if (!deletable) return; // 삭제 가능하지 않으면 아무 동작도 하지 않음
          kakao.maps.event.preventMap();
          removeCoordinate?.(coord.index)
        }} // 클릭 시 해당 좌표 제거
      />
    ))}
  </>
}