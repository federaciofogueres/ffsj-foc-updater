import {HttpInterceptorFn } from '@angular/common/http';

export const FocUpdaterHttpInterceptor: HttpInterceptorFn = (req, next) => {
    // Clone the request to add the new header.
    let headers = req.headers;
    headers = headers.set("HEADER-KEY", 'K*6}*egGYy+ENr7m-b"U')
      .set("HEADER-APPID", "FED_HOGUERAS_FOGUERAPP")
      .set("HEADER-DEVICEID", "f03568a3-cd17-4fb0-9ae4-1daccddb3780");

    const authReq = req.clone({ headers: headers });
    return next(authReq);

}
