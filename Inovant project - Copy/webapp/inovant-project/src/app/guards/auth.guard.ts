import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInformationService } from '../service/user-information.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userSvc: UserInformationService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.userSvc.isLoggedIn$.pipe(
      map((loggedIn: boolean): boolean | UrlTree =>
        loggedIn ? true : this.router.createUrlTree(['/login'])
      )
    );
  }
}
