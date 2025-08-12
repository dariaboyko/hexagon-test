export interface MapData {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface Feature {
  type: 'Feature';
  properties: {
    COLOR_HEX: string;
    ID: number;
  };
  geometry: Geometry;
}

export interface Geometry {
  type: 'MultiPolygon';
  crs: {
    type: string;
    properties: {
      name: string;
    };
  };
  coordinates: [number, number][][][]; // [polygons][rings][points][x|y]
}
