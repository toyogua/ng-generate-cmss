import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {IPaginationAndFilter} from "../interfaces";
import {ResponseModel, Usuario} from "../../../../../src/app/models";

@Injectable({
  providedIn: 'root'
})
export class <%= capitalize(name) %>Service {

  constructor(
    private appService: AppService,
    private apiService: ApiService
  ) {
  }

  get<%= capitalize(name) %>(entityId: String): Observable<any> {
    return this.appService.Get(this.apiService.REMOTE_END_POINTS.<%= capitalize(name) %> + "/" + entityId);
  }

  get<%= capitalize(name) %>(pagination: IPaginationAndFilter): Observable<any> {
    return this.appService.Get(this.apiService.REMOTE_END_POINTS.<%= capitalize(name) %>, {params: pagination});
  }
  update<%= capitalize(name) %>(entity: any): Observable<any> {
    return this.appService.Put(this.apiService.REMOTE_END_POINTS.<%= capitalize(name) %> + "/" + entity.Id, entity);
  }
  post<%= capitalize(name) %>(entity: any): Observable<any> {
    return this.appService.Post(this.apiService.REMOTE_END_POINTS.<%= capitalize(name) %>, entity);
  }
  delete<%= capitalize(name) %>(entityId: String): Observable<any> {
    return this.appService.Delete(this.apiService.REMOTE_END_POINTS.<%= capitalize(name) %> + "/" + entityId);
  }
}
