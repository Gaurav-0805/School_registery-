import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterModule],
})
export class AppComponent implements OnInit {
  isAdmin: boolean = false;
  isTeacher: boolean = false;
  isStudent: boolean = false;
  showSidebar: boolean = false;
  displayName: string = 'User'; // ✅ Default to "User"

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateUserInfo();

    // ✅ Listen for Route Changes & Update Name Dynamically
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateUserInfo(); // ✅ Update name on every route change
      }
    });
  }

  // ✅ Function to Update Name Dynamically
  private updateUserInfo(): void {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('username'); // ✅ Fetch stored username

    if (token && role) {
      this.showSidebar = true;
      this.isAdmin = role.toLowerCase() === 'admin';
      this.isTeacher = role.toLowerCase() === 'teacher';
      this.isStudent = role.toLowerCase() === 'student';

      // ✅ Update display name based on user role
      if (this.isAdmin) {
        this.displayName = 'Admin';
      } else if (this.isTeacher && storedName) {
        this.displayName = storedName; // ✅ Teacher name
      } else if (this.isStudent && storedName) {
        this.displayName = storedName; // ✅ Student name now correctly updates
      } else {
        this.displayName = 'User'; // Default fallback
      }
    } else {
      this.showSidebar = false;
      this.displayName = 'User';
    }
  }

  // ✅ Check if User is Logged In
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // ✅ Logout Functionality
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    this.showSidebar = false;
    this.router.navigate(['/login']);
  }
}
