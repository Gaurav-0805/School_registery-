import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken'); // ✅ Ensure token exists

    if (!token) {
      console.log('🔴 AuthGuard: No Token Found. Redirecting to Login.');
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
