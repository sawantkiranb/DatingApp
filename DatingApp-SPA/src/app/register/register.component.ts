import { AuthService } from './../_services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/ngx-bootstrap-datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  maxDate: Date;

  constructor(private router: Router, private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createRegisterForm();
  }



  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.bsConfig = Object.assign({}, { containerClass: 'theme-red', dateInputFormat: 'MM/DD/YYYY' });
    this.maxDate = new Date();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true };

  }

  register() {

    this.user = Object.assign({}, this.registerForm.value);

    this.authService.register(this.user)
      .subscribe((response) => {
        console.log(response);
        this.alertify.success('You are successfully registered');
      }, error => {
        this.alertify.error(error);
      }, () => {
        this.authService.login(this.user)
          .subscribe(() => {
            this.router.navigate(['/members']);
          });
      });
  }

  get f() {
    return this.registerForm.controls;
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
