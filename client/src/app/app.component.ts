import { Component, OnInit } from '@angular/core';
import { map, tap, forkJoin, catchError, of } from 'rxjs';
import { AppService } from './app.service';

enum ClothesEnum {
  RAINY = 'מעיל',
  COLD = 'לבוש ארוך',
  HOT = 'לבוש קצר'
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  MIN_TEMP = 22;
  description!: string;
  latitude!: number;
  longitude!: number;
  temperature!: number;
  city!: string;

  constructor(private service: AppService) { }

  ngOnInit() {
    this.getLocation();
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.getCity();

        forkJoin([
          this.service.getTemperature(this.latitude, this.longitude),
          this.service.isRainy()
        ]).pipe(
          tap(([temp, isRainy]) => {
            this.temperature = temp;
            this.description = this.setDescription(isRainy, temp);
          }),
          catchError(error => of(error))
        ).subscribe();

      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

  }


  private getCity() {
    this.service.getCity(this.longitude, this.latitude)
      .pipe(map(data => JSON.parse(JSON.stringify(data))),
        tap(object => {
          this.city = `${object.address.city || object.address.town},
                     ${object.address.country}`
        })).subscribe();
  }

  private setDescription(isRainy: boolean, temperature: number): string {
    let des = ClothesEnum.COLD;
    if (isRainy) {
      des = ClothesEnum.RAINY
    }
    else if (temperature > this.MIN_TEMP) {
      des = ClothesEnum.HOT
    }

    return des;
  }

}