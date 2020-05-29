import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { User } from './../../_models/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user: User;

  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  likeUser(id: number) {
    this.userService.likeUser(id)
      .subscribe(() => {
        this.alertify.success('You have liked: ' + this.user.knownAs);
      }, error => {
        this.alertify.error(error);
      });
  }
}
