import { AlertifyService } from './../_services/alertify.service';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>{

  constructor(private alertify: AlertifyService) { }
  canDeactivate(component: MemberEditComponent): boolean {

    if (component.editForm.dirty) {
      return confirm('Are you sure you want to continue? Any unsaved changes will be lost!');
    }
    return true;
  }

}

