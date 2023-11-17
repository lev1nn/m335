import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-device-information',
  templateUrl: './device-information.component.html',
  styleUrls: ['./device-information.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DeviceInformationComponent implements OnInit {
  batteryLevel: number | undefined;
  lat: number | null = null;
  lng: number | null = null;

  getBatteryLevel() {
    Device.getBatteryInfo().then(({ batteryLevel }) => {
      this.batteryLevel = batteryLevel;
    });
  }

  getGeoLocation() {
    Geolocation.getCurrentPosition().then((res) => {
      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;
    });
  }

  ngOnInit() {
    this.getBatteryLevel();
    this.getGeoLocation();
  }
}
