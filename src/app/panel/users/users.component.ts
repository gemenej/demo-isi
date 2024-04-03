import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../User';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users$!: Observable<User[]>;
  selectedId: number = 0;
  editingOpened: boolean = false;
  creatingOpened: boolean = false;

  constructor(
    protected userService: UserService,
    protected router: Router,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.users$ = this.userService.getUsers();
  }

  create() {
    this.editingOpened = false;
    this.creatingOpened = true;
  }

  createClose(ev: any) {
    switch (ev) {
      case 'created':
        this.getUsers();
        break;
      case 'closed':
        this.creatingOpened = false;
        break;
      default:
        this.creatingOpened = false;
        break;
    }
    this.editingOpened = false;
    this.creatingOpened = false;
  }

  select(id: number) {
    this.creatingOpened = false;
    this.editingOpened = true;
    this.selectedId = id;
  }

  updateClose(ev: any) {
    switch (ev) {
      case 'updated':
        this.getUsers();
        this.editingOpened = false;
        break;
      case 'deleted':
        this.getUsers();
        this.editingOpened = false;
        break;
      case 'closed':
        this.editingOpened = false;
        break;
      default:
        this.editingOpened = false;
        break;
    }
  }

  edit(id: number) {
    this.selectedId = id;
    this.creatingOpened = false;
    this.editingOpened = true;
  }
}
