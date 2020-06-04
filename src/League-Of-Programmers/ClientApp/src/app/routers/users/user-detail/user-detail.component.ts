import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common';
import { UserService, Profile, UserInfo } from '../../../services/user.service';
import { BlogService, BlogItem } from '../../../services/blog.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.sass']
})
export class UserDetailComponent implements OnInit {

  isSelf = false;
  account = '';
  profile: Profile = {
    avatar: '',
    userName: '',
    email: ''
  };
  blogList: BlogItem[] = [];

  editBoxAppearance = 'legacy';
  editUserInfo = false;
  editButtonText = '修改';
  editButtonIsLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private common: CommonService,
    private user: UserService,
    private blog: BlogService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(p => {
      this.account = p.get('name');
      if (this.account) {
        this.user.isSelf().subscribe(resp => {
          this.isSelf = (resp.status === 200 && resp.data === true);
        });
        this.getUserProfile();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private getUserProfile() {
    this.user.getProfile(this.account).subscribe(resp => {
      if (resp.status === 200) {
        this.profile = resp.data as Profile;
      } else if (resp.status === 404) {
        this.router.navigate(['/pages', '404']);
      }
    });
  }
  private getBlogList() {
    this.blog.getBlogsByUser(this.account).subscribe(resp => {
      if (resp.status === 200) {
        this.blogList = resp.data as BlogItem[];
      } else {
        this.common.snackOpen(resp.data, 3000);
      }
    });
  }

  edit(userName: string, email: string) {
    userName = userName.trim();
    email = email.trim();

    if (this.profile.userName === userName && this.profile.email === email) {
      this.finish();
      return;
    }

    this.editButtonIsLoading = true;

    const model: UserInfo = {
      name: userName,
      email
    };

    this.user.modifyUserInfo(model).subscribe(resp => {
      if (resp.status === 200) {
        this.common.snackOpen('修改成功', 2000);
        this.finish();
      } else {
        this.common.snackOpen(resp.data, 3000);
      }
    });
    this.editButtonIsLoading = false;
  }
  private finish() {
    this.editUserInfo = !this.editUserInfo;
    this.editButtonText = this.editUserInfo ? '确认修改' : '修改';
    this.editBoxAppearance = this.editUserInfo ? 'outline' : 'legacy';
    this.editButtonIsLoading = false;
  }
}