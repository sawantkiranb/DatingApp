import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Injectable } from "@angular/core";
import { User } from '../_models/user';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ListsResolver implements Resolve<User[]>{
  pageNumber = 1;
  itemsPerPage = 5;
  likesParam = 'Likers';
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {

    return this.userService.getUsers(this.pageNumber, this.itemsPerPage, null, this.likesParam).pipe(
      catchError(error => {
        this.alertify.error(error);
        return of(null);
      })
    );

  }
}
