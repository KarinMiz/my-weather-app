import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root'})
  export class AppService {
    BASE_URL = 'http://localhost:3000';
    constructor(private http: HttpClient) { }
  
    getTemperature(latitude: number, longitude:number): Observable<number>{
      return this.http.get<number>(
          `${this.BASE_URL}/getWeather?latitude=${latitude}&longitude=${longitude}`);
    }
    
    isRainy(): Observable<boolean>{
      return this.http.get<boolean>(`${this.BASE_URL}/isRainy`);
    }
  
    getCity(longitude: number,  latitude: number) : Observable<any> {
      return this.http.get(
          `http://nominatim.openstreetmap.org/reverse?format=json&lon=${longitude}&lat=${latitude}`);
    }
  
  }