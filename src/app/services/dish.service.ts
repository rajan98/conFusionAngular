import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseUrl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service'

@Injectable()
export class DishService {
  constructor(private httpClient: HttpClient,
              private processHTTPMsg: ProcessHTTPMsgService) { }

  getDishes(): Observable<Dish[]> {
    return this.httpClient.get<Dish[]>(baseURL + 'dishes')
      .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getDish(id: string): Observable<Dish> {
    return this.httpClient.get<Dish>(baseURL + 'dishes/' + id)
      .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getFeaturedDish(): Observable<Dish> {
    return this.httpClient.get<Dish>(baseURL + 'dishes?featured=true')
      .pipe(map(dishes => dishes[0]))
      .pipe(catchError(this.processHTTPMsg.handleError));
  }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes()
      .pipe(map(dishes => dishes.map(dish => dish.id)))
      .pipe(catchError(error => error));
  }
}
