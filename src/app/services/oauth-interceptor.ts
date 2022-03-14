import { Injectable } from '@angular/core';
import { HttpEvent, HttpResponse, HttpErrorResponse, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import {UserService}  from './user.service'
@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor
        (
            public serviceAuth: UserService,
            public router: Router,
            public toastController: ToastController
        ) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       // alert('intercept');
        // if(this.serviceAuth.referrer == 'login' || this.serviceAuth.referrer == 'signup'){
            //let authData = this.serviceAuth.authentication;
        //    console.log(this.storage.get('authorizationData'));
           
        //  //   alert(this.serviceAuth.authentication);

        //  console.log(`this.serviceAuth.authentication ${JSON.stringify(this.serviceAuth.authentication)}`);

        //  console.log(`this.serviceAuth.authentication.token ${JSON.stringify(this.serviceAuth.authentication.token)}`);

        //  console.log();
        console.log("Access Token : ",this.serviceAuth.authentication.token);
         
                    if (this.serviceAuth.authentication && this.serviceAuth.authentication.token) {
                        //console.log(`request ${JSON.stringify(request)}`);
                        console.log(this.serviceAuth.authentication.token);
                        
                        request = request.clone({
                            headers: request.headers.set(
                                'Authorization', 'Bearer ' + this.serviceAuth.authentication.token)
                        });
                    }

                    if (!request.headers.has('Content-Type')) {
                        request = request.clone({
                            setHeaders: {
                                'content-type': 'application/json'
                            }
                        });
                    }

                    // request = request.clone({
                    //     headers: request.headers.set('Accept', 'application/json')
                    // });
        //    alert('before next handle (login or signup) ' + JSON.stringify(request));
            return next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        //alert('inside map event--->>>' + JSON.stringify(event));
                    }
                    return event;
                }),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        if (error.error.success === false) {
                            this.presentToast('Login failed');
                        } else {
                            //this.serviceAuth.logOut();
                            this.router.navigate(['login']);
                        }
                    }
                    return throwError(error);
                }));
        // } else {
        // return from(this.storage.get('authorizationData'))
        //     .pipe(
        //         switchMap(jdata => {
        //             let authData = JSON.parse(jdata);
        //             alert(authData);
        //             if (authData && authData.token) {
        //                 request = request.clone({
        //                     headers: request.headers.set(
        //                         'Authorization', 'Bearer ' + this.serviceAuth.authentication.token)
        //                 });
        //             }

        //             if (!request.headers.has('Content-Type')) {
        //                 request = request.clone({
        //                     setHeaders: {
        //                         'content-type': 'application/json'
        //                     }
        //                 });
        //             }

        //             // request = request.clone({
        //             //     headers: request.headers.set('Accept', 'application/json')
        //             // });
        //             alert('before next handle ' + JSON.stringify(request));
        //             return next.handle(request).pipe(
        //                 map((event: HttpEvent<any>) => {
        //                     if (event instanceof HttpResponse) {
        //                         alert('inside map event--->>>' + JSON.stringify(event));
        //                     }
        //                     return event;
        //                 }),
        //                 catchError((error: HttpErrorResponse) => {
        //                     if (error.status === 401) {
        //                         if (error.error.success === false) {
        //                             this.presentToast('Login failed');
        //                         } else {
        //                             this.router.navigate(['login']);
        //                         }
        //                     }
        //                     return throwError(error);
        //                 }));
        //         })
        //     );
        // }
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }
}