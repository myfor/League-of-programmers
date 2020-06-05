import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { NoticeBoardComponent } from './notice-board/notice-board.component';
import { UserInfoBoxComponent } from './user-info-box/user-info-box.component';

const EXPORTS_MODULE = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  MaterialModule
];

const EXPORTS_COMPONENT = [
  NoticeBoardComponent,
  UserInfoBoxComponent
];

@NgModule({
  declarations: [...EXPORTS_COMPONENT],
  imports: [...EXPORTS_MODULE],
  exports: [...EXPORTS_MODULE, ...EXPORTS_COMPONENT]
})
export class SharedModule { }
