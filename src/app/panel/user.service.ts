import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RolesListItem, User } from './User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //public url = 'https://my-json-server.typicode.com/gemenej/demo-ucg';
  public url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Array<RolesListItem>> {
    return this.http.get<Array<RolesListItem>>(`${this.url}/user_types`);
  }

  getUsers(): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.url}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/users/${id}`);
  }

  createUser(value: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: number;
    password: string;
  }) {
    return this.http.post<{ data: User }>(`${this.url}/users`, value);
  }

  updateUser(
    id: number,
    value: {
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      user_type: number;
      password?: string;
    },
  ) {
    return this.http.patch<{ data: User }>(`${this.url}/users/${id}`, value);
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.url}/users/${id}`);
  }

  checkUserExists(query: string): Observable<Array<User>> {
    return this.http.get<Array<User>>(`${this.url}/users/?username=${query}`);
  }
}
