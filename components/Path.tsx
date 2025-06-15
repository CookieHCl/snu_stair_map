import { PathType } from "@/types/coordinate";
import { Polyline } from "react-kakao-maps-sdk";

interface PathProps {
  path: PathType;
}

export default function Path({ path }: PathProps) {
  return <>
    <Polyline
      path={path.roads.map(coords => coords.map(coord => ({ lat: coord.lat, lng: coord.lng })))}
      strokeWeight={5}
      strokeColor="#0016FF"
      strokeOpacity={1.0}
      strokeStyle="solid"
    />
    <Polyline
      path={path.stairs.map(coords => coords.map(coord => ({ lat: coord.lat, lng: coord.lng })))}
      strokeWeight={5}
      strokeColor="#FF00FF"
      strokeOpacity={1.0}
      strokeStyle="solid"
    />
  </>;
}