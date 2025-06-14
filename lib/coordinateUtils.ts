import { IndexedCoordinate, Coordinate } from "@/types/coordinate"
import { SNUBuilding } from "@/types/snu_building";

export function coordinateToString(coordinate: Coordinate): string {
  return `${coordinate.lat.toFixed(4)},${coordinate.lng.toFixed(4)}`;
}

export function coordinatePrettyString(coordinate: Coordinate, buildings: SNUBuilding[]): string {
  const building = getNearestBuilding(coordinate, buildings);

  const latDiff = coordinate.lat - building!.lat;
  const lngDiff = coordinate.lng - building!.lng;

  let direction: string;
  if (Math.abs(latDiff) > Math.abs(lngDiff)) {
    if (latDiff > 0) {
      direction = "북쪽";
    } else {
      direction = "남쪽";
    }
  } else {
    if (lngDiff > 0) {
      direction = "동쪽";
    } else {
      direction = "서쪽";
    }
  }


  return `${building!.dong} ${direction} ${distanceInMeters(coordinate, building!).toFixed(0)}m`;
}

export function distanceInMeters(a: Coordinate, b: Coordinate): number {
  // Haversine 공식 사용
  const R = 6371000; // 지구 반지름 (미터)
  const toRad = (deg: number) => deg * Math.PI / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const aHav = sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) *
    sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(aHav), Math.sqrt(1 - aHav));

  return R * c;
}

export function squaredDistance(a: Coordinate, b: Coordinate): number {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return dx * dx + dy * dy;
}

export function getNearestCoordinate(mouseCoordinate: Coordinate, coordinates: IndexedCoordinate[]): IndexedCoordinate | undefined {
  if (coordinates.length === 0) {
    return undefined;
  }

  let nearestCoordinate = coordinates[0];
  let minDistance = squaredDistance(mouseCoordinate, nearestCoordinate);

  for (const coordinate of coordinates) {
    const currentDistance = squaredDistance(mouseCoordinate, coordinate);
    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      nearestCoordinate = coordinate;
    }
  }

  return nearestCoordinate;
}

export function getNearestBuilding(coordinate: Coordinate, buildings: SNUBuilding[]): SNUBuilding | undefined {
  if (buildings.length === 0) {
    return undefined;
  }

  let nearestBuilding = buildings[0];
  let minDistance = squaredDistance(coordinate, nearestBuilding);

  for (const building of buildings) {
    const currentDistance = squaredDistance(coordinate, building);
    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      nearestBuilding = building;
    }
  }

  return nearestBuilding;
}
