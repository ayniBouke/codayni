import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit {

  form : any ;

  constructor(private router : Router, private userService : UserService) { }

  ngOnInit() {
  }

  addPassword(form){
    this.userService.getUserByIdent(this.userService.phoneNum).subscribe(
      (user : any) => {
        console.log("update password user ", form.value['password'])
        user.password = form.value['password']
        this.userService.put(user).subscribe(
          data => {
            this.router.navigate(['/login/']);
            console.log("updated user ", data)
            form.reset();
          },
          err => console.log("update user ", err)
        )
        console.log("phon data ", user)
      },
      err => console.log(err)
    );
    console.log("add ", form.value);
    
  }
}
