import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../models/photo.model';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ImageService } from '../service/image.service';

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
    IonButton,
    CommonModule,
    DatePipe,
  ],
  providers: [DatePipe],
})
export class Tab3Page {
  public image: Photo | undefined;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private imageService: ImageService
  ) {}

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.imageService.getImageById(+id).then((res) => {
        if (res) {
          this.image = res;
        }
      });
    }
  }

  deleteImage() {
    this.imageService.deleteImageById(this.image?.id || 0);

    this.returnToLibrary();
  }

  returnToLibrary() {
    this.router.navigate(['/tabs', 'tab2']);
  }

  formatDate(dateString: string | undefined): string {
    if (dateString) {
      return this.datePipe.transform(dateString, 'HH:mm:ss dd.MM.yyyy') || '';
    }
    return 'not a valid date';
  }
}
