import { Injectable } from '@angular/core';
import { DeliverDataService } from './deliver-data.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private auth :DeliverDataService,private router:Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
          console.log('User is logged in');
        } else {
          console.log('User is not logged in');
          this.router.navigate(['/xplore']);
          resolve(false);
        }
      });
    });
  }


}