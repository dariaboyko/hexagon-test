import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapDataService } from '../../core/services';
import { toSignal } from '@angular/core/rxjs-interop';

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
}
