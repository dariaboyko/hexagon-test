export interface MapData {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: {
    COLOR_HEX: string;
    ID: number;
  };
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  coordinates: [number, number][][][];
}
