import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from '../service/image.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
})
export class Tab2Page {
  public images: Photo[] = [];

  constructor(private router: Router, private imageService: ImageService) {
    this.imageService.getAllImages().then((res) => {
      this.images = res;
    });
  }

  ionViewWillEnter() {
    this.imageService.getAllImages().then((res) => {
      this.images = res;
    });
  }

  openDetailView(imageId: number) {
    this.router.navigate(['/tabs', 'tab3', imageId]);
  }
}
