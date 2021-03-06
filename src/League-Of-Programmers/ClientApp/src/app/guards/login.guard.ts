import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Global, RoleCategories } from '../global';
import { IdentityService } from '../services/identity.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private router: Router,
    private identity: IdentityService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //  如果没有登录或不是客户和管理员
    if (!Global.loginInfo ||
          // tslint:disable-next-line: no-bitwise
          ((Global.loginInfo.role & RoleCategories.Client) === 0
          // tslint:disable-next-line: no-bitwise
          && (Global.loginInfo.role & RoleCategories.Administrator) === 0)
        ) {
        this.router.navigate(['/login']);
        return false;
    }

    return this.isLogged();
  }

  isLogged(): Observable<boolean> {
    return new Observable<boolean>((ob) => {
      this.identity.checkIsLoggedIn().subscribe(r => {
        if (r.status === 200) {
            Global.loginInfo = r.data;
            ob.next(true);
        } else {
          Global.loginInfo = null;
        }
        ob.complete();
      });
    });
  }
}
