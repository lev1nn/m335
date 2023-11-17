import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { CameraComponent } from '../components/camera/camera.component';
import { Photo } from '../models/photo.model';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CameraComponent],
})
export class Tab1Page implements OnInit {
  @ViewChild(CameraComponent) cameraComponent: CameraComponent | undefined;
  public photo?: Photo = undefined;

  ngOnInit(): void {
    this.photo = {} as Photo;
  }

  ionViewWillEnter() {
    this.takePicture();
  }

  takePicture(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cameraComponent) {
        this.cameraComponent
          .takePicture()
          .then((pictureTaken: any) => {
            if (this.photo) {
              this.photo.base64 = localStorage.getItem('picture') || '';
              this.photo.dateTime = new Date().toISOString();
              this.getGeoLocation();
              this.getBatteryLevel();
            }
          })
          .catch((error: any) => {
            reject(error);
          });
      } else {
        reject('Camera component not found');
      }
    });
  }

  getGeoLocation() {
    Geolocation.getCurrentPosition().then((res) => {
      if (this.photo) {
        this.photo.geolocation = {
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
        };
      }
    });
  }

  getBatteryLevel() {
    Device.getBatteryInfo().then(({ batteryLevel }) => {
      if (this.photo && batteryLevel !== undefined) {
        this.photo.batteryLevel = batteryLevel;
      }
    });
  }

  /*getDeviceDirection() {}

  calculateDirection(alpha: number): string {
    if (alpha >= 45 && alpha < 135) {
      return 'East';
    } else if (alpha >= 135 && alpha < 225) {
      return 'South';
    } else if (alpha >= 225 && alpha < 315) {
      return 'West';
    } else {
      return 'North';
    }
  }*/
}
