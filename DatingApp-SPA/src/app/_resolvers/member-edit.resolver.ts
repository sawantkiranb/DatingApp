import { catchError } from 'rxjs/operators';
import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { UserService } from './../_services/user.service';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';

@Injectable()
export class MemberEditResolver implements Resolve<User> {

  constructor(private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private alertify: AlertifyService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User> {

    return this.userService.getUser(this.authService.decodedToken.nameid)
      .pipe(
        catchError(() => {
          this.alertify.error('Problem retriving your details');
          this.router.navigate(['/members']);
          return of(null);
        })
      );

  }

}
