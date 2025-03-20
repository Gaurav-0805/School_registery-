import { Component, OnInit } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  imports: [CommonModule, NgIf, FormsModule]
})
export class StudentDashboardComponent implements OnInit {
  marks: any[] = [];
  username: string | null = null;
  errorMessage: string = '';
  showError: boolean = false;
  loadingMarks: boolean = false;
  showTable: boolean = false;
  fetchAttempted: boolean = false;  // ✅ Declare fetchAttempted here

  selectedMonth: string = '';
  selectedYear: string = '';

  months = [
    { value: '1', name: 'January' }, { value: '2', name: 'February' }, { value: '3', name: 'March' },
    { value: '4', name: 'April' }, { value: '5', name: 'May' }, { value: '6', name: 'June' },
    { value: '7', name: 'July' }, { value: '8', name: 'August' }, { value: '9', name: 'September' },
    { value: '10', name: 'October' }, { value: '11', name: 'November' }, { value: '12', name: 'December' }
  ];

  years = ['2023', '2024', '2025', '2026'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username')?.trim() || null;
    const authToken = localStorage.getItem('authToken')?.trim() || null;

    if (!this.username || !authToken) {
      this.errorMessage = '❌ Unauthorized: Please login again.';
      this.showError = true;
    }
  }

  fetchMyMarks() {
    this.fetchAttempted = true;  // ✅ Set to true only when Fetch is clicked
    this.showError = false;
    this.errorMessage = '';

    if (!this.selectedMonth || !this.selectedYear) {
        this.showError = true;
        this.errorMessage = '⚠️ Please select both Month and Year!';
        this.marks = [];
        return;
    }

    const authToken = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    const month = this.selectedMonth;
    const year = this.selectedYear;

    if (!authToken || !username) {
        this.showError = true;
        this.errorMessage = '❌ Unauthorized: Please login again.';
        this.marks = [];
        return;
    }

    const apiUrl = `http://localhost:5000/marks/student/${username}?month=${month}&year=${year}`;

    this.loadingMarks = true;
    this.showError = false;
    this.marks = [];

    this.http.get<any[]>(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } }).subscribe({
        next: (response) => {
            this.loadingMarks = false;
            if (!response || response.length === 0) {
                this.marks = [];
                this.showError = true;
                this.errorMessage = '⚠️ No marks found for this student.';
            } else {
                this.marks = response;
                this.showError = false;
            }
        },
        error: () => {
            this.loadingMarks = false;
            this.marks = [];
            this.errorMessage = '❌ Failed to fetch marks. Please try again.';
            this.showError = true;
        }
    });
  }
}



