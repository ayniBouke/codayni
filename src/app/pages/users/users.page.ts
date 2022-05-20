import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users : User[];
  DataLoaded : boolean =false;

  constructor(
    private userService : UserService,
    private router : Router
  ) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      users => {
        this.userService.dataUsers = users;
        this.DataLoaded = true;
      }
    )
  }

  NewUser(){
    this.router.navigate(['/register/'])
  }
  UpdateUser(id){
    this.router.navigate(['/profil/'+id])
  }
  DeleteUser(id){
    this.userService.deleteUser(id).subscribe(
      data => {
        this.userService.getAllUsers().subscribe(
          data => this.userService.dataUsers = data
        )
        console.log("Deleted user ", id) 
      }
    );
  }
}
