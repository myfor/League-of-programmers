import { Injectable, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Observable, fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export const CLIENT_SIDE = '/api/clients/';
export const ADMINISTRATOR_SIDE = '/api/administrators/';

/**
 * 响应数据会在拦截器中包装成这个 Result
 * 如果是 201，则会用 CreatedResult 包装
 */
export interface Result {
  /**
   * 状态码，对应原生 HTTP 状态码
   */
  status: number;
  /**
   * 响应 body 里的数据
   */
  data: any;
}
/**
 * 201 的响应包装
 */
export class CreatedResult implements Result {
  status: number;
  data: any;
  location: string;
}

/**
 * 分页模型
 */
export interface Paginator<T = any> {
  index: number;
  size: number;
  totalPages: number;
  totalSize: number;
  list: T[];
}

/**
 * 重定向标识
 */
export const REDIRECT = 'redirect';

//  基本服务
@Injectable({
  providedIn: 'root'
})
export class ServicesBase {

  constructor() { }

  /**
   * 在这个错误处理中，只负责返回一个合法的值，
   * 如果需要打印，跳转等其他操作，在拦截器中定义
   */
  handleError(error: HttpErrorResponse): Observable<Result | CreatedResult> {
    const R: Result = {
      status: error.status,
      data: ''
    };
    switch (error.status) {
      case 400: {
        R.data = error.error;
      }         break;
      case 401: {
        R.data = '请先登录';
        break;
      }
      default: break;
    }
    return of(R);
  }
}

//  通用服务
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private snack: MatSnackBar
  ) { }

  snackOpen(message: string, duration: number = 2000) {
    if (!duration) {
      duration = null;
    }

    this.snack.open(message, '关闭', {
      duration,
    });
  }

  /**
   * 设置 Tab 键为插入 '    ' <四个空格>
   */
  setTabEvent(ele: any): Subscription {
    return fromEvent(ele, 'keydown')
    .pipe(filter(k => (k as KeyboardEvent).key === 'Tab'))
    .subscribe(k => {
      const KEY_BOARD = k as KeyboardEvent;
      const INSERT_CHARS = '    ';
      KEY_BOARD.returnValue = false;
      const INDEX = ele.selectionStart;
      ele.value = ele.value.substring(0, INDEX) + INSERT_CHARS + ele.value.substring(INDEX);
      ele.setSelectionRange(INDEX + INSERT_CHARS.length, INDEX + INSERT_CHARS.length);
    });
  }
}
