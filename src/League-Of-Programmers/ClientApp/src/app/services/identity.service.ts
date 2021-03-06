import { Injectable } from '@angular/core';
import { ServicesBase, CommonService, Result, CLIENT_SIDE, ADMINISTRATOR_SIDE } from './common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime } from 'rxjs/operators';

import sha256 from 'crypto-js/sha256';

export interface RegisterModel {
  account: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(
    private base: ServicesBase,
    private common: CommonService,
    private http: HttpClient
  ) { }

  checkIsLoggedIn(): Observable<Result> {
    return this.http.get<Result>(`${CLIENT_SIDE}login/check`);
  }

  checkIsAdministratorLoggedIn(): Observable<Result> {
    return this.http.get<Result>(`${ADMINISTRATOR_SIDE}identity/check`);
  }

  login(account: string, password: string): Observable<Result> {
    password = sha256(password).toString();

    const URL = `${CLIENT_SIDE}login`;
    return this.http.patch<Result>(URL, {
      account,
      password
    }).pipe(
      debounceTime(500),
      catchError(this.base.handleError)
    );
  }

  register(model: RegisterModel): Observable<Result> {
    const RESULT: Result = {
      status: 400,
      data: ''
    };

    if (!model.account) {
      this.common.snackOpen('账号不能为空');
      RESULT.data = '账号不能为空';
      return of(RESULT);
    }
    if (model.account.length < 2 || model.account.indexOf(' ') !== -1) {
      this.common.snackOpen(`账号长度不能小于2位且不能有空格`);
      RESULT.data = '账号长度不能小于2位且不能有空格';
      return of(RESULT);
    }
    if (!model.password) {
      this.common.snackOpen('密码不能为空');
      RESULT.data = '密码不能为空';
      return of(RESULT);
    }
    if (model.password.length < 6) {
      this.common.snackOpen(`密码长度不能小于6位`);
      RESULT.data = '密码长度不能小于6位';
      return of(RESULT);
    }
    if (model.password !== model.confirmPassword) {
      this.common.snackOpen('两次密码不一致');
      RESULT.data = '两次密码不一致';
      return of(RESULT);
    }

    model.password = sha256(model.password).toString();
    model.confirmPassword = sha256(model.confirmPassword).toString();

    return this.http.post<Result>(`${CLIENT_SIDE}register`, model)
      .pipe(
        debounceTime(1000),
        catchError(this.base.handleError)
      );
  }
}
