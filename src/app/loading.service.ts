import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() {this.loading$ = new BehaviorSubject(false); }
  loading$: any;
}
