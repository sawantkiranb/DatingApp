import { AuthService } from './../../_services/auth.service';
import { Pagination } from './../../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../_models/user';
import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[] = [];
  pagination: Pagination;
  userParams: any = {};
  genderList = [{ value: 'male', displayName: 'Males' }, { value: 'female', displayName: 'Females' }];

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });

    const currentUser = this.authService.getUser();
    console.log(currentUser);

    this.userParams.gender = (currentUser.gender === 'male') ? 'female' : 'male';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'created';
  }

  pageChanged(event) {
    this.loadUsers(event.page, event.itemsPerPage, this.userParams);
  }

  filetrUsers() {
    this.loadUsers(this.pagination.pageNumber, this.pagination.pageSize, this.userParams);
  }

  resetFilter() {
    const currentUser = this.authService.getUser();

    this.userParams.gender = (currentUser.gender === 'male') ? 'female' : currentUser.gender;
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'created';
    this.filetrUsers();
  }

  loadUsers(page, itemsPerPage, params) {
    this.userService.getUsers(page, itemsPerPage, params)
      .subscribe(response => {
        this.users = response.result;
        this.pagination = response.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

}
