import { PathType } from "@/types/path";
import { Polyline } from "react-kakao-maps-sdk";

interface PathProps {
  path: PathType;
}

export default function Path({ path }: PathProps) {
  return <div style={{ zIndex: 50 }}>
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
  </div>;
}