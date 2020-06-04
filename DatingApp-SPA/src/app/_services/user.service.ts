import { Message } from './../_models/message';
import { PaginatedResult } from './../_models/pagination';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs/operators';

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

  getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginatedResult<User[]>> {

    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let httpParams = new HttpParams();

    if (page != null && itemsPerPage != null) {
      httpParams = httpParams.append('PageNumber', page);
      httpParams = httpParams.append('PageSize', itemsPerPage);
    }

    if (userParams != null) {
      httpParams = httpParams.append('Gender', userParams.gender);
      httpParams = httpParams.append('MinAge', userParams.minAge);
      httpParams = httpParams.append('MaxAge', userParams.maxAge);
      httpParams = httpParams.append('OrderBy', userParams.orderBy);
    }

    if (likeParams === 'Likers') {
      httpParams = httpParams.append('Likers', 'true');
    }

    if (likeParams === 'Likees') {
      httpParams = httpParams.append('Likees', 'true');
    }

    return this.http.get<User[]>(this.baseUrl, { observe: 'response', params: httpParams })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
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

  likeUser(recepientId: number) {
    return this.http.post(this.baseUrl + '/' + this.authService.decodedToken.nameid + '/like/' + recepientId, {});
  }

  getMessages(page?, itemsPerPage?, messageContainer?): Observable<PaginatedResult<Message[]>> {

    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let httpParams = new HttpParams();

    httpParams = httpParams.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      httpParams = httpParams.append('PageNumber', page);
      httpParams = httpParams.append('PageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + '/' + this.authService.decodedToken.nameid + '/message', { observe: 'response', params: httpParams })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;

          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }

          return paginatedResult;
        })
      );
  }

  getMessageThread(userId: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + '/' + userId + '/message/thread/' + recipientId);
  }

  sendMessage(userId: number, message) {
    return this.http.post(this.baseUrl + '/' + userId + '/message', message);
  }

  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + '/' + userId + '/message/' + id, {});
  }

}
