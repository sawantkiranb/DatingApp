import { AuthService } from './../_services/auth.service';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
  constructor(private userService: UserService, private alertify: AlertifyService, private router: Router, private authService: AuthService) { }

  page = 1;
  itemsPerPage = 10;
  userParams: any = {};

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {

    const currentUser = this.authService.getUser();

    this.userParams.gender = (currentUser.gender === 'male') ? 'female' : currentUser.gender;
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'created';

    return this.userService.getUsers(this.page, this.itemsPerPage, this.userParams).pipe(

      catchError(error => {
        this.alertify.error('Problem retriving data');
        this.router.navigate(['/home']);
        return of(null);
      })

    );

  }

}
