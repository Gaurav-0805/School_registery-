import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, ReactiveFormsModule], // ✅ Ensure ReactiveFormsModule is included
})
export class DashboardComponent {
  userRole: string | null = '';
  monthYearForm: FormGroup;
  totalStudents: number | null = null;
  avgMarksBySubject: { subject_name: string, average_marks: number }[] = [];
  topStudentsBySubject: { subject_name: string, student_name: string, score: number }[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private http: HttpClient) {
    this.userRole = this.authService.getUserRole();

    // ✅ Form to select month and year
    this.monthYearForm = new FormGroup({
      month: new FormControl('', Validators.required),
      year: new FormControl('', [Validators.required, Validators.min(2000), Validators.max(new Date().getFullYear())])
    });
  }

  // ✅ Fetch student details based on selected month and year with JWT Authentication
  fetchStudentDetails(): void {
    if (this.monthYearForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { month, year } = this.monthYearForm.value;

      console.log(`🔄 Fetching student details for: ${month} ${year}`);

      // ✅ Retrieve token from localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error("❌ No authentication token found!");
        this.errorMessage = "Unauthorized: Please log in again.";
        this.isLoading = false;
        return;
      }

      // ✅ Set HTTP headers with Authorization token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

      this.http.get<any>(`http://localhost:5000/dashboard/stats?month=${month}&year=${year}`, { headers }).subscribe({
        next: (data) => {
          console.log('✅ API Response:', data);

          // ✅ Store API response data
          this.totalStudents = data.total_students;
          this.avgMarksBySubject = data.average_marks || [];
          this.topStudentsBySubject = data.top_students || [];

          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ API Error:', error);
          if (error.status === 401) {
            this.errorMessage = "Unauthorized: Please log in again.";
          } else {
            this.errorMessage = `Failed to fetch student details. Backend error: ${error.message}`;
          }
          this.isLoading = false;
        }
      });
    } else {
      console.log('❌ Form Invalid: Please select both month and year.');
    }
  }

  // ✅ Ensure month values are numeric (1-12) instead of text ("January")
  getMonths(): { name: string, value: number }[] {
    return [
      { name: 'January', value: 1 },
      { name: 'February', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 }
    ];
  }

  // ✅ Generate a list of years (from current year to 25 years back)
  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 25 }, (_, i) => currentYear - i);
  }
}
