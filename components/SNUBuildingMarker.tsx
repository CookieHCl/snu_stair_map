import { SNUBuilding } from "@/types/snu_building";
import { useState } from "react";
import { MapMarker } from "react-kakao-maps-sdk";

interface SNUBuildingMarkerProps {
  building: SNUBuilding;
}

export default function SNUBuildingMarker({ building }: SNUBuildingMarkerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return <MapMarker // 인포윈도우를 생성하고 지도에 표시합니다
    position={{
      // 인포윈도우가 표시될 위치입니다
      lat: building.lat,
      lng: building.lng
    }}
    clickable={true} // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
    onClick={() => setIsOpen(!isOpen)} // 마커를 클릭했을 때 인포윈도우를 토글합니다
  >
    {isOpen && (
      <div style={{ padding: "5px", color: "#000" }}>
        {building.dong}
      </div>
    )}
  </MapMarker>;
}