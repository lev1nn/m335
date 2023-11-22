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
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { decode } from 'base64-arraybuffer';
import { image } from 'ionicons/icons';

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
          .then((content: string | undefined) => {
            if (this.photo && content) {
              this.photo.base64 = content;
              this.photo.dateTime = new Date().toISOString();
              this.getGeoLocation();
              this.getBatteryLevel();

              this.sendImageMessage();
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

  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseClient
    );
  }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        // eslint-disable-next-line one-var
        var r = (Math.random() * 16) | 0,
          // eslint-disable-next-line one-var
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  async sendImageMessage() {
    let id = this.uuidv4();
    let file = `public/${id}.png`;
    console.log(decode(this.photo?.base64 || ''));
    let { data: fileData } = await this.client.storage
      .from('images')
      .upload(file, decode(this.photo?.base64 || ''), {
        contentType: 'image/png',
      });

    if (!fileData?.path) {
      return;
    }
    let { data: url } = this.client.storage
      .from('images')
      .getPublicUrl(fileData?.path);
    const { data, error } = await this.client
      .from('images')
      .insert([
        {
          url: url.publicUrl,
          dateTime: this.photo?.dateTime,
          latitude: this.photo?.geolocation?.latitude,
          longitude: this.photo?.geolocation?.longitude,
          batteryLevel: this.photo?.batteryLevel,
        },
      ])
      .select();

    return data;
  }
}
