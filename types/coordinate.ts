export interface IndexedCoordinate {
  index: number
  lat: number
  lng: number
  is_stair: boolean
}

export interface Coordinate {
  lat: number
  lng: number
}

export interface PathType {
  roads: IndexedCoordinate[][]
  stairs: IndexedCoordinate[][]
}
