import { Component, OnInit } from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {UserService} from '../../services/user.service';
import {RequestsService} from '../../services/requests.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {User} from '../../interfaces/user';

export interface PromptModel {
  scope: any;
  currentRequest: any;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel, OnInit {
  scope: any;
  currentRequest: any;
  shouldAdd: string = 'yes';
  user: User;
  constructor(public dialogService: DialogService,
              private userService: UserService, private requestsService: RequestsService) {
    super(dialogService);
  }

  accept() {
    if (this.shouldAdd == 'yes') {
      this.requestsService.setRequestStatus(this.currentRequest, 'accepted').then((data) => {
        console.log(data);
        this.userService.addFriend(this.scope.user.uid, this.currentRequest.sender).then(() => {
          alert('Solicitud aceptada con exito');
        });
      }).catch((error) => {
        console.log(error);
      });
    } else if (this.shouldAdd == 'no') {
      this.requestsService.setRequestStatus(this.currentRequest, 'rejected').then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
    } else if (this.shouldAdd == 'later') {
      this.requestsService.setRequestStatus(this.currentRequest, 'decide_later').then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  ngOnInit() {
    if (this.currentRequest) {
      this.userService.getUserById(this.currentRequest.sender).valueChanges().subscribe((user: User) => {
        this.user = user;
      }, (error) => {
        console.log(error);
      });
    }
  }

}
