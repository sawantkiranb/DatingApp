import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { Subscription, config } from 'rxjs';
import { HttpEvent, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() setMainPhotoChange = new EventEmitter<string>();

  accept = '*';
  files: File[] = [];
  progress: number;
  url = environment.apiUrl;
  hasBaseDropZoneOver = false;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<{}>;
  lastFileAt: Date;

  sendableFormData: FormData; // populated via ngfFormData directive

  dragFiles: any;
  validComboDrag: any;
  lastInvalids: any;
  fileDropDisabled: any;
  maxSize: any;
  baseDropValid: any;

  myFormData: FormData;

  constructor(private httpClient: HttpClient, private authService: AuthService,
              private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  deletePhoto(photo: Photo) {
    this.alertify.confirm('Are you sure you want to delete photo?', () => {
      this.userService.deletePhoto(photo.id)
        .subscribe(() => {
          this.photos.splice(this.photos.indexOf(photo), 1);
          this.alertify.success('Photo has been deleted');
        }, error => {
          this.alertify.error(error);
        });
    });
  }

  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(photo.id)
      .subscribe(response => {

        const currentMainPhoto: Photo = this.photos.filter(p => p.isMain === true)[0];
        currentMainPhoto.isMain = false;
        photo.isMain = true;

        console.log('Successfully set to main');

        this.authService.changeMemberPhoto(photo.url);
        this.authService.currentUser.photoUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this.authService.currentUser));

        this.setMainPhotoChange.emit(photo.url);
      }, error => {
        this.alertify.error(error);
      });
  }

  cancel() {
    this.progress = 0;
    if (this.httpEmitter) {
      console.log('cancelled');
      this.httpEmitter.unsubscribe();
    }
  }

  uploadFiles(files: File[]) {
    const postUrl = this.url + 'user/' + this.authService.decodedToken.nameid + '/photo';
    let myFormData: FormData = new FormData();
    let uploadCount = 0;
    this.files.forEach(file => {
      uploadCount++;
      myFormData = new FormData();
      myFormData.append('file', file, file.name);

      const config = new HttpRequest('POST', postUrl, myFormData, {
        reportProgress: true
      });

      return this.httpClient.request(config)
        .subscribe(response => {
          if (response instanceof HttpResponse) {
            const photo: Photo = response.body as Photo;
            this.photos.push(photo);
            this.progress = (uploadCount / this.files.length) * 100;
          }
        },
          error => {
            alert('!failure cause:' + error.toString());
          }, () => {
            this.files = [];
          });
    });
  }


  getDate() {
    return new Date();
  }

}
