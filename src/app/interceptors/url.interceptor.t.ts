import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../app.config";

@Injectable()
export class UrlInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiUrl = inject(API_URL);
        const newReq = req.clone({'url': `${apiUrl}${req.url}`});
        return next.handle(newReq);
    }
}