import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  // ✅ Updated Login API Call - Now Stores Teacher Name Properly
  // ✅ Update local storage correctly in login()
login(username: string, password: string): Observable<{ token: string; role: string; name: string }> {
  console.log('🔍 Sending Login Request:', { username, password });

  return this.http.post<{ token: string; role: string; name: string }>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
    tap(response => {
      if (response && response.token) {
        console.log('✅ Login Success: Storing Token & Username');
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('username', username); // ✅ Ensure username is stored
        localStorage.setItem('teacherName', response.name || username); // ✅ Store name if available
      } else {
        console.error('❌ Login Failed: No Token Received');
      }
    })
  );
}

  

  // ✅ Logout Function
  logout(): void {
    console.log("🚪 Logging Out: Clearing Local Storage");
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  }

  // ✅ Check if User is Logged In
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // ✅ ✅ **New Function: Get Teacher's Name**
  getTeacherName(): string {
    return localStorage.getItem('username') || 'User';  // Default to 'User' if not found
  }
}
