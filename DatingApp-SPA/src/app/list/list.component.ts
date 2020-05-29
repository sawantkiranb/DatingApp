import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Pagination } from './../_models/pagination';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam;

  constructor(private route: ActivatedRoute, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(response => {
      this.users = response.users.result;
      this.pagination = response.users.pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(event) {
    this.loadUsers(event.page, event.itemsPerPage);
  }

  filetrUsers() {
    this.loadUsers(this.pagination.pageNumber, this.pagination.pageSize);
  }

  loadUsers(page, itemsPerPage) {
    this.userService.getUsers(page, itemsPerPage, null, this.likesParam)
      .subscribe(response => {
        this.users = response.result;
        this.pagination = response.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }


}
