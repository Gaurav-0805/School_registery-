import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'; // ✅ Ensure Admin Dashboard is included
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { LoginComponent } from './login/login.component'; // ✅ Ensure login route is still present

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // ✅ Login route remains unchanged
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'admin' } }, // ✅ Ensure Admin Dashboard route exists
  { path: 'teacher-dashboard', component: TeacherDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'teacher' } },
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'student' } },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // ✅ Redirecting to login page by default
];
