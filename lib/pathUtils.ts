import { Coordinate, IndexedCoordinate } from "@/types/coordinate";
import { distanceInMeters, squaredDistance } from "./coordinateUtils";
import { PathType } from "@/types/path";

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
  const edges: Coordinate[][] = [];

  for (const [index, neighbors] of graph) {
    for (const neighbor of neighbors) {
      edges.push([coordinates[index], neighbor]);
    }
  }

  return edges;
}

// get connected stair coordinates, and add three coordinates on the middle of each edges
export function getConnectedStairCoordinates(
  coordinates: IndexedCoordinate[],
): IndexedCoordinate[][] {
  const graph = getGraph(coordinates);
  const visited: boolean[] = Array(coordinates.length).fill(false);
  const stairs: IndexedCoordinate[][] = [];
  const indexMap: Map<number, number> = new Map();
  coordinates.forEach((coord, index) => {
    indexMap.set(coord.index, index);
  });

  function dfs(coord: IndexedCoordinate, currentStair: IndexedCoordinate[]) {
    const index = indexMap.get(coord.index)!;
    if (visited[index]) return;

    visited[index] = true;
    currentStair.push(coord);

    graph.get(index)?.forEach(neighbor => {
      if (neighbor.is_stair && !visited[indexMap.get(neighbor.index)!]) {
        dfs(neighbor, currentStair);
      }
    });
  }

  for (const coord of coordinates) {
    if (coord.is_stair && !visited[indexMap.get(coord.index)!]) {
      const currentStair: IndexedCoordinate[] = [];
      dfs(coord, currentStair);
      if (currentStair.length > 0) {
        stairs.push(currentStair);
      }
    }
  }

  stairs.forEach(stair => {
    // get all pair of coordinates that are adjacent in the stair
    const pairs: [IndexedCoordinate, IndexedCoordinate][] = [];
    for (let i = 0; i < stair.length - 1; i++) {
      for (let j = i + 1; j < stair.length; j++) {
        const start = stair[i];
        const end = stair[j];
        if (squaredDistance(start, end) < THRESHOLD) {
          pairs.push([start, end]);
        }
      }
    }

    const extraCoords: IndexedCoordinate[] = [];
    // for each pairs, add three coordinates on the middle of each edges
    pairs.forEach(([start, end]) => {
      const midLat = (start.lat + end.lat) / 2;
      const midLng = (start.lng + end.lng) / 2;
      const midCoord1: IndexedCoordinate = {
        index: -1, // temporary index
        lat: (start.lat * 2 + end.lat) / 3,
        lng: (start.lng * 2 + end.lng) / 3,
        is_stair: true,
      };
      const midCoord2: IndexedCoordinate = {
        index: -1, // temporary index
        lat: (start.lat + end.lat * 2) / 3,
        lng: (start.lng + end.lng * 2) / 3,
        is_stair: true,
      };
      const midCoord3: IndexedCoordinate = {
        index: -1, // temporary index
        lat: midLat,
        lng: midLng,
        is_stair: true,
      };
      extraCoords.push(midCoord1, midCoord2, midCoord3);
    });

    // add the extra coordinates to the stair
    stair.splice(1, 0, ...extraCoords);
  });

  return stairs;
}


export function getFastestPath(coordinates: IndexedCoordinate[], startCoordinate: IndexedCoordinate, endCoordinate: IndexedCoordinate): PathType | undefined {
  // coord.index does not match index of the array
  const indexMap: Map<number, number> = new Map();
  coordinates.forEach((coord, index) => {
    indexMap.set(coord.index, index);
  });

  // connect coordinates that are within a threshold distance
  const graph = getGraph(coordinates);

  // dijkstra's algorithm
  const startIndex = indexMap.get(startCoordinate.index);
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
        const alt = distances[currentCoordIndex] + distanceInMeters(currentCoord, neighbor);
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
  const reversedPath: IndexedCoordinate[] = [];
  let current: IndexedCoordinate | null = endCoordinate;
  while (current !== null) {
    reversedPath.push(current);
    current = previous[indexMap.get(current.index)!];
  }
  const path = reversedPath.reverse();

  if (path[0] !== startCoordinate) {
    return undefined;
  }

  // separate roads and stairs
  const roads: IndexedCoordinate[][] = [];
  const stairs: IndexedCoordinate[][] = [];
  let currentPath: IndexedCoordinate[] = [];
  let isStair = path[0].is_stair;

  for (const coord of path) {
    if (coord.is_stair !== isStair) {
      if (currentPath.length > 0) {
        if (isStair) {
          currentPath.push(coord);
          stairs.push(currentPath);
          currentPath = [];
        } else {
          roads.push(currentPath);
          currentPath = [currentPath[currentPath.length - 1]];
        }
      }
      isStair = coord.is_stair;
    }
    currentPath.push(coord);
  }
  if (currentPath.length > 0) {
    if (isStair) {
      stairs.push(currentPath);
    } else {
      roads.push(currentPath);
    }
  }

  // calculate total distance
  const dist = path.reduce((acc, coord, index) => {
    if (index === 0) return acc;
    return acc + distanceInMeters(path[index - 1], coord);
  }, 0);

  return { roads, stairs, dist };
}