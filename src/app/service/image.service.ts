import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { decode } from 'base64-arraybuffer';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
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

  async postImage(photo: Photo) {
    let id = this.uuidv4();
    let file = `public/${id}.png`;
    console.log(decode(photo?.url || ''));
    let { data: fileData } = await this.client.storage
      .from('images')
      .upload(file, decode(photo?.url || ''), {
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
          dateTime: photo?.dateTime,
          latitude: photo?.latitude,
          longitude: photo?.longitude,
          batteryLevel: photo?.batteryLevel,
        },
      ])
      .select()
      .single();

    return data;
  }

  async getAllImages() {
    let { data: images, error } = await this.client.from('images').select('*');

    return images as [Photo];
  }

  async getImageById(id: number) {
    const { data: image, error: fetchError } = await this.client
      .from('images')
      .select('*')
      .eq('id', id)
      .single();

    return image as Photo;
  }

  async deleteImageById(id: number) {
    await this.client
      .from('images')
      .delete()
      .eq('id', id)
      .then((res) => {
        console.log('Image deleted:', res);
      });
  }
}
