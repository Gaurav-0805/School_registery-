import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './app/login/login.component';
import { AdminDashboardComponent } from './app/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './app/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './app/student-dashboard/student-dashboard.component';
import { RoleGuard } from './app/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent, canActivate: [RoleGuard], data: { role: 'teacher' } },
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [RoleGuard], data: { role: 'student' } },
  { path: '**', redirectTo: 'login' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
}).catch(err => console.error(err));
