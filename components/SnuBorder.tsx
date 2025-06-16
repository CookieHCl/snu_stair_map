
import { Polygon } from "react-kakao-maps-sdk"
import snu_border from "@/datas/snu_border.json"
import { IndexedCoordinate } from "@/types/coordinate"

interface SNUBorderProps {
  onMouseStateChange?: (isMouseOn: boolean) => void;
}

export default function SNUBorder({ onMouseStateChange }: SNUBorderProps) {
  return <div style={{ zIndex: 100 }}>
    <Polygon
      path={snu_border as IndexedCoordinate[]}
      strokeColor="#00BBFF"
      strokeOpacity={0}
      strokeWeight={0.1}
      fillColor="#00BBFF"
      fillOpacity={0.000000001}
      onMouseover={() => onMouseStateChange?.(true)}
      onMouseout={() => onMouseStateChange?.(false)}
      onClick={() => onMouseStateChange?.(true)}
    />
  </div>
}