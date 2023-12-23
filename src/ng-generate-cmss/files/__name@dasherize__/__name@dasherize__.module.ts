import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {<%= capitalize(name) %>Component} from './__name@dasherize__.component';
import {NgbPagination, NgbPaginationNext, NgbPaginationPrevious} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../_metronic/shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {InlineSVGModule} from "ng-inline-svg-2";
import {capitalize} from "@angular-devkit/core/src/utils/strings";

const routes: Routes = [
  {
    path: '',
    component: <%= capitalize(name) %>Component
  }
];

@NgModule({
  declarations: [
    <%= capitalize(name) %>Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    InlineSVGModule
  ],
  exports: [RouterModule]
})
export class <%= capitalize(name) %>Module {
}
