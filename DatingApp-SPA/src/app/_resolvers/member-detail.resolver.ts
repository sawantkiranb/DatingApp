import { catchError } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { AlertifyService } from './../_services/alertify.service';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { UserService } from '../_services/user.service';


@Injectable()
export class MemberDetailResolver implements Resolve<User> {

  constructor(private userService: UserService, private alertify: AlertifyService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {

    return this.userService.getUser(route.params.id)
      .pipe(
        catchError(() => {
          this.alertify.error('Problem retrivng data');
          this.router.navigate(['/members']);
          return of(null);
        })
      );

  }
}
