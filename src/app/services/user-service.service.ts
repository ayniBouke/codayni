import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  isAuthenticated : boolean = false;
  constructor() { }
}
