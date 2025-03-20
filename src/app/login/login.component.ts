import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';  // ✅ Changed from `userID` to `username`
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = '❌ Username and Password are required!';
      return;
    }

    console.log('🔍 Sending Login Request:', { username: this.username, password: this.password });

    this.authService.login(this.username, this.password).subscribe({
      next: (response: { token: string; role: string }) => {
        console.log('✅ Login Successful:', response);

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role.toLowerCase());

        this.redirectUser(response.role);
      },
      error: (err) => {
        console.error('❌ Login Failed:', err);
        this.errorMessage = 'Invalid username or password!';
      }
    });
  }

  private redirectUser(role: string) {
    const roleRoutes: { [key: string]: string } = {
      admin: '/admin-dashboard',
      teacher: '/teacher-dashboard',
      student: '/student-dashboard'
    };

    const normalizedRole = role.toLowerCase();
    const targetRoute = roleRoutes[normalizedRole] || '/login';

    console.log('🔄 Redirecting to:', targetRoute);
    this.router.navigate([targetRoute]);
  }
}
