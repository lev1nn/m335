import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ActivatedRoute } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    IonButton,
    CommonModule,
    DatePipe,
  ],
  providers: [DatePipe],
})
export class Tab3Page {
  private client: SupabaseClient;
  public image: Photo | undefined;

  constructor(private route: ActivatedRoute, private datePipe: DatePipe) {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseClient
    );
  }

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    let error!: Error | undefined;

    const { data: image, error: fetchError } = await this.client
      .from('images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      this.image = image as Photo;
    }
  }

  deleteImage() {
    this.client
      .from('images')
      .delete()
      .eq('id', this.image?.id)
      .then((res) => {
        console.log('Image deleted:', res);
      });
  }

  formatDate(dateString: string | undefined): string {
    if (dateString) {
      return this.datePipe.transform(dateString, 'HH:mm:ss dd.MM.yyyy') || '';
    }
    return 'not a valid date';
  }
}
