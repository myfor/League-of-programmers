import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogDetail, BlogService } from '../../../services/blog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.sass']
})
export class BlogDetailComponent implements OnInit, OnDestroy {

  id: number;
  detail: BlogDetail = {
    title: '',
    targets: [],
    content: '',
    views: 0,
    likes: 0,
    dateTime: '',
    author: '',
    authorAccount: '',
    state: { key: -1, value: '' }
  };
  liked = false;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) { }

  sub: Subscription;
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(p => {
      this.id = +p.get('id');
      this.getDetail();
    });
  }

  private getDetail() {
    this.blogService.getBlogDetail(this.id).subscribe(resp => {
      if (resp.status === 200) {
        this.detail = resp.data;
      }
      this.loading = false;
    });
  }

  like() {
    this.blogService.like(this.id).subscribe(resp => {
      if (resp.status === 204) {
        this.detail.likes++;
        this.liked = true;
      }
    });
  }
}
