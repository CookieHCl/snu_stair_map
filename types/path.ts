import { IndexedCoordinate } from "./coordinate"

export interface Stair {
  stair: IndexedCoordinate
  path: IndexedCoordinate[]
}

export interface PathType {
  roads: IndexedCoordinate[][]
  stairs: IndexedCoordinate[][]
  dist: number
}
