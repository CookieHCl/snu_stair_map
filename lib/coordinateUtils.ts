import { IndexedCoordinate, Coordinate } from "@/types/coordinate"

export function coordinateToString(coordinate: Coordinate): string {
  return `${coordinate.lat.toFixed(9)}, ${coordinate.lng.toFixed(9)}`;
}

export function squaredDistance(a: Coordinate, b: Coordinate): number {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return dx * dx + dy * dy;
}

export function getNearestCoordinate(mouseCoordinate: Coordinate, coordinates: IndexedCoordinate[]): IndexedCoordinate | null {
  if (coordinates.length === 0) {
    return null;
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
