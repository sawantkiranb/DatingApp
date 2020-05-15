import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  login() {

    this.authService.login(this.model)
      .subscribe(next => {
        this.model = {};
        console.log('Login successful.');
      }, error => {
        console.log('Login failed.');
      });
  }

  loggedIn() {
    const user = localStorage.getItem('token');
    return !!user;
  }

  logout() {
    console.log('helo');

    localStorage.removeItem('token');
  }

}
