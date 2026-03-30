import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User, UserCreate } from '../../interfaces/user.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  showForm = false;
  editingUser: User | null = null;
  form: UserCreate & { id?: string } = { name: '', email: '', password: '', role: 'agent' };
  error = '';
  success = '';

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => { this.users = data; this.cdr.markForCheck(); },
      error: (err) => { this.error = err.error?.message || 'Erreur chargement'; this.cdr.markForCheck(); }
    });
  }

  openCreate(): void {
    this.editingUser = null;
    this.form = { name: '', email: '', password: '', role: 'agent' };
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  openEdit(user: User): void {
    this.editingUser = user;
    this.form = { name: user.name, email: user.email, password: '', role: user.role };
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  onSubmit(): void {
    this.error = '';
    if (this.editingUser) {
      const updates: any = { name: this.form.name, email: this.form.email, role: this.form.role };
      if (this.form.password) updates.password = this.form.password;
      this.userService.update(this.editingUser._id, updates).subscribe({
        next: () => {
          this.success = 'Utilisateur modifié';
          this.showForm = false;
          this.loadUsers();
        },
        error: (err) => this.error = err.error?.message || 'Erreur modification'
      });
    } else {
      this.userService.create(this.form).subscribe({
        next: () => {
          this.success = 'Utilisateur créé';
          this.showForm = false;
          this.loadUsers();
        },
        error: (err) => this.error = err.error?.message || 'Erreur création'
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Supprimer l'utilisateur ${user.name} ?`)) {
      this.userService.delete(user._id).subscribe({
        next: () => {
          this.success = 'Utilisateur supprimé';
          this.loadUsers();
        },
        error: (err) => this.error = err.error?.message || 'Erreur suppression'
      });
    }
  }

  cancel(): void {
    this.showForm = false;
  }
}

