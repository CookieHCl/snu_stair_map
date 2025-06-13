import { Coordinate, IndexedCoordinate } from "@/types/coordinate";
import { squaredDistance } from "./coordinateUtils";

const THRESHOLD = 0.000000012; // 115 is OK, 125 is not OK

function getGraph(coordinates: IndexedCoordinate[]): Map<number, IndexedCoordinate[]> {
  const graph: Map<number, IndexedCoordinate[]> = new Map();
  for (const [index, coord] of coordinates.entries()) {
    graph.set(index, []);
    for (const [otherIndex, otherCoord] of coordinates.entries()) {
      if (index !== otherIndex) {
        const distance = squaredDistance(coord, otherCoord);
        if (distance < THRESHOLD) {
          graph.get(index)?.push(otherCoord);
        }
      }
    }
  }

  return graph;
}


export function getEdges(coordinates: IndexedCoordinate[]): Coordinate[][] {
  const graph = getGraph(coordinates);
  let edges: Coordinate[][] = [];

  for (const [index, neighbors] of graph) {
    for (const neighbor of neighbors) {
      edges.push([coordinates[index], neighbor]);
    }
  }

  return edges;
}


export function getFastestPath(coordinates: IndexedCoordinate[], startCoordinate: IndexedCoordinate, endCoordinate: IndexedCoordinate): IndexedCoordinate[] {
  // coord.index does not match index of the array
  const indexMap: Map<number, number> = new Map();
  coordinates.forEach((coord, index) => {
    indexMap.set(coord.index, index);
  });

  // connect coordinates that are within a threshold distance
  const graph = getGraph(coordinates);

  // dijkstra's algorithm
  const startIndex = indexMap.get(startCoordinate.index);
  const endIndex = indexMap.get(endCoordinate.index);
  const distances: number[] = Array(coordinates.length).fill(Infinity);
  const previous: (IndexedCoordinate | null)[] = Array(coordinates.length).fill(null);
  const visited: boolean[] = Array(coordinates.length).fill(false);

  distances[startIndex!] = 0;
  const set = new Set<number>();
  set.add(startIndex!);

  while (set.size > 0) {
    // find the coordinate with the minimum distance
    let minCoord = null;
    let minDistance = Infinity;

    for (const index of set) {
      const coord = coordinates[index];
      if (!visited[index] && distances[index] < minDistance) {
        minDistance = distances[index];
        minCoord = coord;
      }
    }

    if (minCoord === null) break; // no more reachable coordinates

    const currentCoord = minCoord;
    const currentCoordIndex = indexMap.get(currentCoord.index)!;
    set.delete(currentCoordIndex);
    visited[currentCoordIndex] = true;

    // update distances to neighbors
    graph.get(currentCoordIndex)?.forEach(neighbor => {
      const neighborIndex = indexMap.get(neighbor.index)!;
      if (!visited[neighborIndex]) {
        const alt = distances[currentCoordIndex] + Math.sqrt(squaredDistance(currentCoord, neighbor));
        if (alt < distances[neighborIndex]) {
          distances[neighborIndex] = alt;
          previous[neighborIndex] = currentCoord;
          if (!set.has(neighborIndex)) {
            set.add(neighborIndex);
          }
        }
      }
    });
  }

  // reconstruct the path
  const path: IndexedCoordinate[] = [];
  let current: IndexedCoordinate | null = endCoordinate;
  while (current !== null) {
    path.push(current);
    current = previous[indexMap.get(current.index)!];
  }
  return path.reverse();
}