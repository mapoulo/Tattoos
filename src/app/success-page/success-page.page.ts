import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.page.html',
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {

  constructor(public modalController : ModalController) { }

  ngOnInit() {
  }

  CloseModel(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
