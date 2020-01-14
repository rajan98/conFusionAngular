import { Injectable } from '@angular/core';

import { Feedback } from '../shared/feedback';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseUrl';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private httpClient: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitForm(feedback: Feedback): Observable<Feedback>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<Feedback>(baseURL + 'feedback/', feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
