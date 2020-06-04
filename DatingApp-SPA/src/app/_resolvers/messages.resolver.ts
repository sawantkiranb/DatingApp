import { UserService } from './../_services/user.service';
import { Message } from './../_models/message';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  itemsPerPage = 5;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private alertify: AlertifyService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {

    return this.userService.getMessages(this.pageNumber, this.itemsPerPage, this.messageContainer)
      .pipe(
        catchError(error => {
          this.alertify.error('Problem retriving data');
          this.router.navigate(['/home']);
          return of(null);
        })
      );

  }

}
