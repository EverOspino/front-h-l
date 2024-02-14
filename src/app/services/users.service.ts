import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL_API = 'http://127.0.0.1:8000/users'

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const url = URL_API;
    return this.http.get<any>(url);
  }

  deleteUser(id: number): Observable<any> {
    const url = `${URL_API}/${id}`;
    return this.http.delete<any>(url);
  }

  createUser(newUser: any): Observable<any> {
    const url = URL_API; // Cambia la URL por la de tu API
    return this.http.post<any>(url, newUser);
  }

  updateUser(id: number, newUser: any): Observable<any> {
    const url = `${URL_API}/${id}`; // Cambia la URL por la de tu API
    return this.http.put<any>(url, newUser);
  }
}
