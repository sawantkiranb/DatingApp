import { AuthService } from './../../_services/auth.service';
import { User } from './../../_models/user';
import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from './../../_services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs/ngx-bootstrap-tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  @ViewChild('membersTab', { static: true }) membersTab: TabsetComponent;

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute, public authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });

    this.route.queryParams.subscribe(params => {
      const selectedTab = params.tab;

      this.membersTab.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });

  }

  selectTab(tabId: number) {
    this.membersTab.tabs[tabId].active = true;
  }


}
