import { Injectable } from '@angular/core';
import { ServicesBase, Result, CLIENT_SIDE, ADMINISTRATOR_SIDE, CreatedResult } from './common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { KeyValue } from '@angular/common';

export interface BlogItem {
  id: number;
  title: string;
  author: string;
  authorAccount: string;
  dateTime: string;
  views: number;
  likes: number;
  state: KeyValue<number, string>;
}

export interface BlogDetail {
  title: string;
  targets: string[];
  content: string;
  views: number;
  likes: number;
  dateTime: string;
  author: string;
  authorAccount: string;
  state: KeyValue<number, string>;
}

export interface NewBlog {
  title: string;
  targets: string[];
  content: string;
}

export interface ModifyBlog {
  title: string;
  targets: string[];
  content: string;
}

export const enum BlogState {
  Enabled,
  Disabled,
  Draft,
  Audit
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private base: ServicesBase,
    private http: HttpClient
  ) { }

  /**
   * 获取搜索的博文列表
   * @param s 搜索参数
   */
  getBlogList(index: number, size: number, s: string): Observable<Result> {
    let p = new HttpParams()
      .append('index', index.toString())
      .append('size', size.toString());
    if (s) {
      s = s.trim();
      p = p.append('s', s);
    }

    return this.http.get<Result>(`${CLIENT_SIDE}blogs?${p.toString()}`)
    .pipe(
      retry(1),
      catchError(this.base.handleError)
    );
  }

  /**
   * 获取一个用户的博文
   * @param account 要获取博文的用户的账号
   */
  getBlogsByUser(index: number, size: number, state: number, account: string, s: string): Observable<Result> {
    account = account.trim();
    if (!account) {
      const R: Result = {
        status: 400,
        data: ''
      };
      return of(R);
    }
    let p = new HttpParams()
      .append('index', index.toString())
      .append('size', size.toString());
    if (state !== null && state !== undefined) {
      p = p.append('state', state.toString());
    }
    s = s.trim();
    if (s) {
      p = p.append('s', s);
    }

    return this.http.get<Result>(`${CLIENT_SIDE}clients/${account}/blogs?${p.toString()}`)
    .pipe(
      retry(1),
      catchError(this.base.handleError)
    );
  }

  /**
   * 获取管理员端的博文列表
   */
  getBlogsListByAdministartor(index: number, size: number, state: string, s: string): Observable<Result> {
    let p = new HttpParams()
      .append('index', index.toString())
      .append('size', size.toString());
    if (state) {
      p = p.append('state', state.trim());
    }
    s = s.trim();
    if (s) {
      p = p.append('s', s);
    }

    return this.http.get<Result>(`${ADMINISTRATOR_SIDE}blogs?${p.toString()}`)
    .pipe(
      retry(1),
      catchError(this.base.handleError)
    );
  }

  /**
   * 获取博文详情
   */
  getBlogDetail(id: number): Observable<Result> {
    return this.http.get<Result>(`${CLIENT_SIDE}blogs/${id}?readed=true`)
    .pipe(
      retry(1),
      catchError(this.base.handleError)
    );
  }

  /**
   * 写博文
   */
  writeBlog(newPost: NewBlog): Observable<Result | CreatedResult> {
    return this.http.post<CreatedResult>(`${CLIENT_SIDE}blogs`, newPost)
    .pipe(
      catchError(this.base.handleError)
    );
  }

  /**
   * 修改博文
   */
  modifyBlog(id: number, model: ModifyBlog): Observable<Result> {
    return this.http.put<Result>(`${CLIENT_SIDE}blogs/${id}`, model)
    .pipe(
      catchError(this.base.handleError)
    );
  }

  /**
   * 点赞
   */
  like(id: number): Observable<Result> {
    return this.http.patch<Result>(`${CLIENT_SIDE}blogs/${id}/like`, '')
    .pipe(
      retry(1),
      catchError(this.base.handleError)
    );
  }

  /**
   * 删除一个博文
   * @param id blog id
   */
  deleteBlog(id: number): Observable<Result> {
    return this.http.delete<Result>(`${CLIENT_SIDE}blogs/${id}`)
    .pipe(
      catchError(this.base.handleError)
    );
  }

  /**
   * 启用博文
   */
  enable(id: number): Observable<Result> {
    return this.http.patch<Result>(`${ADMINISTRATOR_SIDE}blogs/${id}/enable`, '')
    .pipe(
      retry(1),
      catchError(this.base.handleError)
    );
  }

  /**
   * 禁用博文
   */
  disable(id: number): Observable<Result> {
    return this.http.patch<Result>(`${ADMINISTRATOR_SIDE}blogs/${id}/disable`, '')
    .pipe(
      retry(1),
      catchError(this.base.handleError)
    );
  }
}
