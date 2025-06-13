import { IndexedCoordinate, Coordinate } from "@/types/coordinate"

export function distance(a: Coordinate, b: Coordinate): number {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getNearestCoordinate(mouseCoordinate: Coordinate, coordinates: IndexedCoordinate[]): IndexedCoordinate | null {
  if (coordinates.length === 0) {
    return null;
  }

  let nearestCoordinate = coordinates[0];
  let minDistance = distance(mouseCoordinate, nearestCoordinate);

  for (const coordinate of coordinates) {
    const currentDistance = distance(mouseCoordinate, coordinate);
    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      nearestCoordinate = coordinate;
    }
  }

  return nearestCoordinate;
}
