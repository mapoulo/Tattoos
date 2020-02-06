import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email="";
  message: any = "";

  constructor(public modalController:ModalController) { }

  ngOnInit() {
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  resetPassword() {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(this.email)
      .then(() => console.log("email sent"))
      .catch((error) => {
        this.message = error.message;
      })
  }
}
