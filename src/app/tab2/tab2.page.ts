import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    CommonModule,
  ],
})
export class Tab2Page {
  private client: SupabaseClient;
  public images: Photo[] = [];

  constructor(private router: Router) {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseClient
    );

    this.fetchImages();
  }

  ionViewWillEnter() {
    this.fetchImages();
  }

  async fetchImages() {
    let { data: images, error } = await this.client.from('images').select('*');

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      this.images = images as [Photo];
    }
  }
}
