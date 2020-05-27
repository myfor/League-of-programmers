import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';

export interface Result<T = any> {
  status: number;
  data: T;
}

/**
 * 分页模型
 */
export interface Paginator<T = any> {
  index: number;
  size: number;
  totalPages: number;
  totalRows: number;
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
  handleError(error: HttpErrorResponse): Observable<Result> {
    const R: Result = {
      status: error.status,
      data: ''
    };
    switch (error.status) {
      case 400: {
        if (error.error.traceId) {
          const T = error.error.traceId as string;
          if (T.endsWith('-477f38d7339b7a39.')) {
            R.data = '防伪过期，请刷新页面';
          } else {
            R.data = error.error;
          }
        } else {
          R.data = error.error;
        }
      }
      break;
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

  snackOpen(message: string, duration?: number) {
    if (!duration) {
      duration = null;
    }

    this.snack.open(message, '关闭', {
      duration,
    });
  }
}
