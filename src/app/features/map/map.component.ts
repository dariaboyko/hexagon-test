import {
  Component,
  inject,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapDataService } from '../../core/services';
import { toSignal } from '@angular/core/rxjs-interop';
import proj4 from 'proj4';
import { cellToBoundary, H3Index, latLngToCell } from 'h3-js';
import * as L from 'leaflet';
import { MapData } from '../../core/interfaces';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [MapDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  private mapDataService = inject(MapDataService);
  mapData = toSignal(this.mapDataService.getMapData());
  private map!: L.Map;

  constructor() {
    effect(() => {
      const data = this.mapData();
      if (data) {
        this.initMap(data);
      }
    });
  }

  private initMap(data: MapData) {
    this.map = L.map('map', {
      center: [40.95536, 21.42186],
      zoom: 6,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );

    tiles.addTo(this.map);

    this.map.whenReady(() => {
      this.renderHexagons();
      this.map.on('moveend zoomend', () => this.renderHexagons());
    });
  }

  renderHexagons() {
    const data = this.mapData();
    if (!data) return;

    this.map.eachLayer((layer) => {
      if ((layer as any).hexLayer) this.map.removeLayer(layer);
    });

    const zoom = this.map.getZoom();
    const resolution = this.getH3Resolution(zoom);

    const bounds = this.map.getBounds();

    for (const feature of data.features) {
      const coords3857 = feature.geometry.coordinates;

      const h3indexes: H3Index[] = [];

      for (const polygon of coords3857) {
        for (const ring of polygon) {
          for (const [x, y] of ring) {
            const [lng, lat] = proj4('EPSG:3857', 'EPSG:4326', [x, y]);
            h3indexes.push(latLngToCell(lat, lng, resolution));
          }
        }
      }

      [...new Set(h3indexes)].forEach((h3index) => {
        const hexBoundary = cellToBoundary(h3index, true);

        if (hexBoundary.some(([lat, lng]) => bounds.contains([lat, lng]))) {
          const polygon = L.polygon(
            hexBoundary.map(([lat, lng]) => [lat, lng]),
            {
              color: '#000',
              fillColor: '#' + feature.properties.COLOR_HEX,
              fillOpacity: 0.5,
            },
          );
          (polygon as any).hexLayer = true;
          polygon.addTo(this.map);
        }
      });
    }
  }

  getH3Resolution(zoom: number): number {
    if (zoom <= 4) return 3;
    if (zoom <= 7) return 4;
    if (zoom <= 10) return 5;
    if (zoom <= 13) return 6;
    return 7;
  }
}
