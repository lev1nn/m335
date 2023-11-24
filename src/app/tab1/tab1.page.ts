import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { Photo } from '../models/photo.model';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CameraService } from '../service/camera.service';
import { ImageService } from '../service/image.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    CommonModule,
  ],
})
export class Tab1Page implements OnInit {
  private client: SupabaseClient;
  public photo?: Photo = undefined;

  constructor(
    private router: Router,
    private camaraService: CameraService,
    private imageService: ImageService
  ) {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseClient
    );
  }

  ngOnInit(): void {
    this.photo = {} as Photo;
  }

  ionViewWillEnter() {
    this.takePicture();
  }

  takePicture() {
    this.camaraService.getImageWithInfo().then((res) => {
      this.imageService.postImage(res).then((res) => {
        if (!res) {
          return;
        }
        this.photo = res as Photo;

        this.returnToLibrary();
      });
    });
  }

  returnToLibrary() {
    this.router.navigate(['/tabs', 'tab2']);
  }
}
