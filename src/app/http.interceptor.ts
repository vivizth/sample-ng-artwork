import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorx implements HttpInterceptor {

  constructor(private loading: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loading.loading$.next(true);
    return next.handle(request).pipe(
      finalize(() => {
        this.loading.loading$.next(false);
      })
    );
  }
  
}
