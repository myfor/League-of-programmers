import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModifyBlog, BlogDetail, BlogService } from '../../../services/blog.service';
import { CommonService } from '../../../services/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent implements OnInit, OnDestroy {

  id: number;
  preview = ``;

  isEditing = false;

  blog = this.fb.group({
    title: ['', [Validators.required]],
    targets: ['', [Validators.required]],
    content: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private common: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  sub: Subscription;
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(p => {
      if (p.has('id')) {
        this.id = +p.get('id');
        this.getBlogDetail();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private getBlogDetail() {
    this.blogService.getBlogDetail(this.id).subscribe(resp => {
      if (resp.status === 200) {
        const DETAIL = resp.data as BlogDetail;
        this.blog.get('title').setValue(DETAIL.title);
        this.blog.get('content').setValue(DETAIL.content);
        this.preview = DETAIL.content;

        let targetValue = '';
        for (let i = 0; i < DETAIL.targets.length; i++) {
          const target = DETAIL.targets[i];
          if (i !== DETAIL.targets.length - 1) {
            targetValue += `${target},`;
          } else {
            targetValue += target;
          }
        }
        this.blog.get('targets').setValue(targetValue);
      }
    });
  }

  editBlog() {
    if (this.blog.invalid) {
      return;
    }

    this.isEditing = true;

    const MODIFY_BLOG: ModifyBlog = {
      title: this.blog.get('title').value.trim(),
      targets: [],
      content: this.blog.get('content').value
    };

    const targetsV1: string[] = this.blog.get('targets').value.trim().split(',');
    targetsV1.forEach(v => {
      MODIFY_BLOG.targets.push(...v.split('，'));
    });

    this.blogService.modifyBlog(this.id, MODIFY_BLOG).subscribe(resp => {
      switch (resp.status) {
        case 204:
          {
            this.common.snackOpen('修改成功');
            this.router.navigate(['/blogs', this.id, this.blog.get('title').value]);
          }
          break;
        default:
          this.common.snackOpen('修改失败');
          break;
      }
      this.isEditing = false;
    });
  }

  changeTab(index: number) {
    if (index === 1) {
      this.preview = this.blog.get('content').value;
    }
  }
}
