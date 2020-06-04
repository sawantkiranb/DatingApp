import { AuthService } from './../_services/auth.service';
import { map } from 'rxjs/operators';
import { Pagination } from './../_models/pagination';
import { Message } from './../_models/message';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../_services/alertify.service';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(response => {
      this.messages = response.messages.result;
      this.pagination = response.messages.pagination;
      console.log(this.messages);

    });
  }

  loadMessages() {
    this.userService.getMessages(this.pagination.pageNumber, this.pagination.pageSize, this.messageContainer)
      .subscribe(response => {
        this.messages = response.result;
        this.pagination = response.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  pageChanged(event) {

    this.pagination.pageNumber = event.page;
    this.pagination.pageSize = event.itemsPerPage;

    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete message', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid)
        .subscribe(() => {
          this.alertify.success('Message has been deleted');
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        }, error => {
          this.alertify.error(error);
        });
    });
  }

}
