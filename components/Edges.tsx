import { Coordinate } from "@/types/coordinate";
import { Polyline } from "react-kakao-maps-sdk";

interface EdgesProps {
  edges: Coordinate[][];
}

export default function Edges({ edges }: EdgesProps) {
  return (
    <Polyline
      path={edges}
      strokeWeight={3}
      strokeColor="#FFC800"
      strokeOpacity={0.7}
      strokeStyle="solid"
    />
  );
}