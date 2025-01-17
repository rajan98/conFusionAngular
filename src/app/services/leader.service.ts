import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseUrl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private httpClient: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.httpClient.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    return this.httpClient.get<Leader>(baseURL + 'leadership/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.httpClient.get<Leader>(baseURL + 'leadership?featured=true')
      .pipe(map(leader => leader[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
