import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent implements OnInit {
  users: any;
  userIdToModified: number = 0;
  alert = {
    show: false,
    message: ''
  }
  errorText = ''

  userForm = new FormGroup({
    cedula: new FormControl(),
    nombre_completo: new FormControl('')
  });

  constructor( private _usersService: UsersService, public zone: NgZone ) {}
  
  ngOnInit() {
    this.getUsers();
  }

  resetId() {
    this.userIdToModified = 0;
  }

  resetUserForm() {
    this.userForm.reset();
  }

  resetErrorMessage() {
    this.errorText = '';
  }

  saveId(id: number) {
    this.userIdToModified = id;
  }

  assignDataUserToModified(user: User) {
    if(user.id) this.userIdToModified = user.id;
    this.userForm.setValue({cedula: user.cedula, nombre_completo: user.nombre_completo});
  }

  closeAlert() {
    this.alert.show = false;
    this.alert.message = '';
  }

  getUsers() {
    this._usersService.getUsers().subscribe(
      users => {
        this.users = users.data;      
      },
      error => {
        this.alert.message = 'Error al traer los datos, Intentelo más tarde';
        this.alert.show = true;
      }
    )
  }

  deleteUser() {
    const userId = this.userIdToModified;
    if(userId != 0) {
      this._usersService.deleteUser(userId).subscribe(
        response => {
          const newUsers = this.users.filter((user: any) => user.id != userId);
          this.users = newUsers;
          this.resetId();
        },
        error => {
          this.alert.message = error.error.message;
          this.alert.show = true;
        }
      )
    }
  }

  createUser() {
    const newUser = this.userForm.value
    if(newUser.cedula == null) {
      this.errorText = 'Debes ingresar la cedula'
    }
    else if(newUser.nombre_completo == '') {
      this.errorText = 'Debes ingresar el nombre completo'
    }
    else {
      this._usersService.createUser(newUser).subscribe(
        response => {
          this.users.push(response.data);
          this.resetUserForm();
        },
        error => {
          this.alert.message = error.error.message;
          this.alert.show = true;
          console.log(error);
        }
      );
    }
    this.zone.runOutsideAngular(() => {
      const delay = 2000;
      return setTimeout(() => this.errorText = '', delay);
    });
  }

  updateUser() {
    const newUser = this.userForm.value
    if(newUser.cedula == null) {
      this.errorText = 'Debes ingresar la cedula'
    }
    else if(newUser.nombre_completo == '') {
      this.errorText = 'Debes ingresar el nombre completo'
    }
    else {
      this._usersService.updateUser(this.userIdToModified, newUser).subscribe(
        response => {
          const indice = this.users.findIndex((objeto: User) => objeto.id === this.userIdToModified);
          this.users[indice] = response.data;
        },
        error => {
          this.alert.message = error.error.message;
          this.alert.show = true;
        }
      );
    }
    this.zone.runOutsideAngular(() => {
      const delay = 2000;
      return setTimeout(() => this.errorText = '', delay);
    });
  }

}
