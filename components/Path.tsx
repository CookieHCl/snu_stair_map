import { IndexedCoordinate } from "@/types/coordinate";
import { Polyline } from "react-kakao-maps-sdk";

interface PathProps {
  coordinates: IndexedCoordinate[];
}

export default function Path({ coordinates }: PathProps) {
  return (
    <Polyline
      path={[coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }))]}
      strokeWeight={5}
      strokeColor="#0000FF"
      strokeOpacity={0.7}
      strokeStyle="solid"
    />
  );
}