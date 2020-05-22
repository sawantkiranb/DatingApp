import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'user';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUsers() {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id) {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  updateUser(user: User) {
    return this.http.put(this.baseUrl + '/' + this.authService.decodedToken.nameid, user);
  }

  setMainPhoto(id) {
    return this.http.post(this.baseUrl + '/' + this.authService.decodedToken.nameid + '/photo/' + id + '/setmain', {});
  }

  deletePhoto(id) {
    return this.http.delete(this.baseUrl + '/' + this.authService.decodedToken.nameid + '/photo/' + id);
  }

}
