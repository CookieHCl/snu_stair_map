import { IndexedCoordinate, Coordinate } from "@/types/coordinate"
import { SNUBuilding } from "@/types/snu_building";

export function coordinateToString(coordinate: Coordinate): string {
  return `${coordinate.lat.toFixed(4)},${coordinate.lng.toFixed(4)}`;
}

export function coordinatePrettyString(coordinate: Coordinate, buildings: SNUBuilding[]): string {
  const building = getNearestBuilding(coordinate, buildings);
  return `${building!.dong} 근처`
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
