import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-list',
  standalone: true,  // ✅ Standalone component
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  imports: [CommonModule]  // ✅ Fix for *ngIf and *ngFor
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  errorMessage: string = '';
  showError: boolean = false;
  loading: boolean = false;  

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchStudents();  // ✅ Automatically fetch students when component loads
  }

  fetchStudents() {
    if (this.loading || this.students.length > 0) return;  // ✅ Prevent duplicate API calls

    this.loading = true;
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      this.errorMessage = '❌ Unauthorized: Please login again.';
      this.loading = false;
      return;
    }

    this.http.get('http://localhost:5000/students', {
      headers: { Authorization: `Bearer ${authToken}` }
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Students Fetched:', response);
        this.students = response.map((student: any) => ({
          name: student.name,
          username: student.username,
          userID: student.id  // ✅ Ensure correct ID mapping
        }));
        this.showError = false;
        this.loading = false;
        this.cdRef.detectChanges();  // ✅ Force UI update
      },
      error: (error) => {
        console.error('❌ Error fetching students:', error);
        this.errorMessage = '❌ Failed to load students. Please try again.';
        this.showError = true;
        this.loading = false;
      }
    });
  }
}
