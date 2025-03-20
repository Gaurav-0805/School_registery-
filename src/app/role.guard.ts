import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'].toLowerCase(); // ✅ Convert expected role to lowercase
    const userRole = localStorage.getItem('userRole')?.toLowerCase(); // ✅ Normalize stored role

    console.log(`🔍 RoleGuard: Expected: ${expectedRole}, Found: ${userRole}`);

    if (userRole === expectedRole) {
      return true; // ✅ Allow access if role matches
    } else {
      console.error('❌ RoleGuard: Unauthorized Access. Redirecting to Login.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
