
import { Polygon } from "react-kakao-maps-sdk"
import snu_border from "@/datas/snu_border.json"
import { useState } from "react"
import { IndexedCoordinate } from "@/types/coordinate"

interface SNUBorderProps {
  visible: boolean;
  onMouseStateChange?: (isMouseOn: boolean) => void;
}

export default function SNUBorder({ visible, onMouseStateChange }: SNUBorderProps) {
  return <Polygon
    path={snu_border as IndexedCoordinate[]}
    strokeColor="#00BBFF"
    strokeOpacity={1.0}
    strokeWeight={1}
    fillColor="#00BBFF"
    fillOpacity={0.1}
    onMouseover={() => onMouseStateChange?.(true)}
    onMouseout={() => onMouseStateChange?.(false)}
  />
}