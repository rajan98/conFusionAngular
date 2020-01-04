import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTION } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Observable<Promotion[]> {
    return of(PROMOTION).pipe(delay(2000));
  }

  getPromotion(id: string): Observable<Promotion> {
    return of(PROMOTION.filter((promotion) => (promotion.id === id))[0]).pipe(delay(2000));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return of(PROMOTION.filter((promotion) => (promotion.featured))[0]).pipe(delay(2000));
  }
}
