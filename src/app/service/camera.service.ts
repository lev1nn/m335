import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Photo } from '../models/photo.model';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor() {}

  async getImageWithInfo() {
    let photoUrl = await this.takePicture();
    let cords = await this.getGeoLocation();
    let photo: Photo = {
      url: photoUrl || '',
      dateTime: new Date().toISOString() || '',
      latitude: cords.latitude || 0,
      longitude: cords.longitude || 0,
      batteryLevel: (await this.getBatteryLevel()) || 0,
    };
    return photo;
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });
    return image.base64String;
  }

  async getGeoLocation() {
    let { coords } = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    return coords;
  }

  async getBatteryLevel() {
    let { batteryLevel } = await Device.getBatteryInfo();
    return batteryLevel;
  }
}
