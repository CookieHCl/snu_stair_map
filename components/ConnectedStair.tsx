import { Circle } from "react-kakao-maps-sdk"

interface ConnectedStairProps {
  coordinates: { lat: number; lng: number }[];
  onClick?: (index: number) => void;
}

export default function ConnectedStair({ coordinates, onClick }: ConnectedStairProps) {
  return <>
    {coordinates.map((coord, index) => (
      <Circle
        key={index}
        center={{ lat: coord.lat, lng: coord.lng }}
        radius={4.5}
        strokeWeight={0}
        fillColor="#FF00FF"
        fillOpacity={1}
        onClick={() => onClick?.(index)} // 클릭 시 해당 좌표의 인덱스 전달
      />
    ))}
  </>
}