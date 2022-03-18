import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { MediaService } from 'src/app/testServices/media-service.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.page.html',
  styleUrls: ['./upload-image.page.scss'],
})
export class UploadImagePage implements OnInit {

  constructor(public actionSheetController: ActionSheetController, public mediaService: MediaService) { }

  ngOnInit() {
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'selectImageSource',
      buttons: [{
        text: 'loadFromDevice',
        handler: () => {
          this.mediaService.getImageFromLibrary(0);
        }
      },
      {
        text: 'useCamera',
        handler: () => {
          this.mediaService.getImageUsingCamera();
        }
      },
      {
        text: 'cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  async addImageToFirebase(){
    await this.mediaService.uploadIUmage(this.mediaService.captureDataUrl, "Ayni", "avatars").then(mediaData => {
      console.log("url :", this.mediaService.captureDataUrl);
    });
  }
}
