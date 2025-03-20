import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StudentListComponent } from '../student-list/student-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, FormsModule, StudentListComponent, HttpClientModule]
})
export class AdminDashboardComponent {
  activeSection: string = 'student-stats';
  dynamicHeading: string = '🎓 Student Stats';
  isUserDropdownOpen: boolean = false;

  studentData: any = null;
  users: any[] = [];
  students: any[] = [];
  loginLogs: any[] = [];

  successMessage: string = '';
  errorMessage: string = '';
  showError: boolean = false;

  selectedMonth: string = '';
  selectedYear: string = '';

  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedRole: string = '';

  months = [
    { value: '1', name: 'January' }, { value: '2', name: 'February' }, { value: '3', name: 'March' },
    { value: '4', name: 'April' }, { value: '5', name: 'May' }, { value: '6', name: 'June' },
    { value: '7', name: 'July' }, { value: '8', name: 'August' }, { value: '9', name: 'September' },
    { value: '10', name: 'October' }, { value: '11', name: 'November' }, { value: '12', name: 'December' }
  ];
  years = ['2023', '2024', '2025', '2026'];
  roles = ['Admin', 'Teacher', 'Student'];

  newUser = { name: '', role: '', username: '', password: '' };
  deleteUsername: string = '';

  constructor(private http: HttpClient) {
    this.fetchUsers();
    this.fetchStudents();
  }

  // ✅ Toggle Dropdown Visibility
  toggleUserDropdown(isOpen: boolean) {
    this.isUserDropdownOpen = isOpen;
  }

  // ✅ Set Active Section
  setActiveSection(section: string) {
    console.log("Switching to:", section);
    const validSections = ['student-stats', 'login-logs', 'user-management', 'add-user', 'delete-user', 'student-list'];
    
    if (validSections.includes(section)) {
        this.activeSection = section;
        this.showError = false;
        this.errorMessage = '';

        const sectionHeadings: { [key: string]: string } = {
            'student-stats': '🎓 Student Stats',
            'login-logs': '📊 Login Logs',
            'user-management': '👤 User Management',
            'add-user': '➕ Add New User',
            'delete-user': '❌ Delete User',
            'student-list': '📋 Student List'
        };

        this.dynamicHeading = sectionHeadings[section] || 'Admin Dashboard';

        // ✅ Auto-expand student list when sidebar button is clicked
        if (section === 'student-list') {
            setTimeout(() => {
                const studentListComponent = document.querySelector('app-student-list');
                if (studentListComponent) {
                    studentListComponent.classList.add('expanded'); // Ensure list expands
                }
            }, 100); // Small delay to ensure DOM updates
        }
    }
}



  // ✅ Fetch Student Data (Stats)
  fetchStudentData() {
    if (!this.selectedMonth || !this.selectedYear) {
      this.showError = true;
      this.errorMessage = '⚠️ Please select both Month and Year before fetching data.';
      this.studentData = null;
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const apiUrl = `http://localhost:5000/dashboard/stats?month=${this.selectedMonth}&year=${this.selectedYear}`;

    this.http.get<{ total_students: number, average_marks: any[], top_students: any[] }>(apiUrl, { 
        headers: { Authorization: `Bearer ${authToken}` } 
    }).subscribe({
        next: (response) => {  
            this.studentData = response;
            this.showError = false;
        },
        error: () => {
            this.errorMessage = '❌ Failed to load student details.';
            this.showError = true;
        }
    });
  }

  // ✅ Fetch Login Logs
  fetchLoginLogs() {
    if (!this.selectedRole || !this.selectedStartDate || !this.selectedEndDate) {
      this.showError = true;
      this.errorMessage = '⚠️ Please select Role, Start Date, and End Date to fetch logs.';
      this.loginLogs = [];
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const apiUrl = `http://localhost:5000/dashboard/login-logs?role=${this.selectedRole}&start_date=${this.selectedStartDate}&end_date=${this.selectedEndDate}`;

    this.http.get<{ login_logs: any[] }>(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
        .subscribe({
            next: (response) => {  
                this.loginLogs = response.login_logs;
                this.showError = false;
            },
            error: () => {
                this.errorMessage = '❌ Failed to fetch login logs.';
                this.showError = true;
            }
        });
  }

  // ✅ Fetch Students
  fetchStudents() {
    const authToken = localStorage.getItem('authToken');
    this.http.get<any[]>('http://localhost:5000/students', { headers: { Authorization: `Bearer ${authToken}` } })
      .subscribe({
        next: (response) => {  
          this.students = response;
        },
        error: () => {
          this.errorMessage = '❌ Failed to fetch students.';
        }
      });
  }

  // ✅ Fetch Users
  fetchUsers() {
    const authToken = localStorage.getItem('authToken');
    this.http.get<any[]>('http://localhost:5000/users', { headers: { Authorization: `Bearer ${authToken}` } })
      .subscribe({
        next: (response) => {  
          this.users = response;
        },
        error: () => {
          this.errorMessage = '❌ Error fetching users.';
        }
      });
  }

  // ✅ Add New User with Alert
  addUser() {
    if (!this.newUser.name || !this.newUser.role || !this.newUser.username || !this.newUser.password) {
      this.errorMessage = '⚠️ All fields are required.';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const authToken = localStorage.getItem('authToken');
    this.http.post('http://localhost:5000/users/add', this.newUser, {
      headers: { Authorization: `Bearer ${authToken}` }
    }).subscribe({
      next: () => {
        this.fetchUsers();
        this.fetchStudents();
        this.newUser = { name: '', role: '', username: '', password: '' };
        this.successMessage = '✅ User added successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.setActiveSection('user-management');
      },
      error: () => {
        this.errorMessage = '❌ Failed to add user.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // ✅ Delete User with Alert
  deleteUser(username: string) {
    if (!username) {
      alert('⚠️ Please select a valid user to delete.');
      return;
    }

    const authToken = localStorage.getItem('authToken');
    this.http.delete(`http://localhost:5000/users/delete/${username}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    }).subscribe({
      next: () => {
        this.fetchUsers();
        this.fetchStudents();
        this.successMessage = '✅ User deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.setActiveSection('user-management');
      },
      error: () => {
        this.errorMessage = '❌ Error deleting user.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
