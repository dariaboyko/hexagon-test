import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MapData } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor(private http: HttpClient) {}

  getMapData(): Observable<MapData> {
    return this.http.get<MapData>('data.json');
  }
}
