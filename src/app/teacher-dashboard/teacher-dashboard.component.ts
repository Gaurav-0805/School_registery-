import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { StudentListComponent } from '../student-list/student-list.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css'],
  imports: [CommonModule, FormsModule, NgIf, NgChartsModule, StudentListComponent]
})
export class TeacherDashboardComponent {
  activeSection: string = 'dashboard';
  dynamicHeading: string = '📊 Marks Overview';
  teacherName: string = '';

  students: any[] = [];
  subjects: any[] = [];
  studentMarks: any[] = [];

  selectedStudentUsername: string = '';
  selectedSubjectId: string = '';
  selectedMonth: string = '';
  selectedYear: string = new Date().getFullYear().toString();

  successMessage: string = '';
  errorMessage: string = '';

  newMark = { username: '', subject_id: '', month: '', year: '', score: '' };
  newSubject = { subjectName: '' };
  subjectToDelete: string = '';

  months = [
    { value: '1', name: 'January' }, { value: '2', name: 'February' },
    { value: '3', name: 'March' }, { value: '4', name: 'April' },
    { value: '5', name: 'May' }, { value: '6', name: 'June' },
    { value: '7', name: 'July' }, { value: '8', name: 'August' },
    { value: '9', name: 'September' }, { value: '10', name: 'October' },
    { value: '11', name: 'November' }, { value: '12', name: 'December' }
  ];

  years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66FF66', '#FF66FF'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66FF66', '#FF66FF']
    }]
  };
  
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      duration: 1500
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#4A5568',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            let value = context.raw || 0;
            const dataset = context.dataset.data;
            const total = dataset.reduce((acc: number, val: number) => acc + (val || 0), 0);
      
            // Prevent NaN errors and format to two decimal places
            if (total === 0 || isNaN(value) || isNaN(total)) {
              return `${label}: ${value.toFixed(2)} (0%)`;
            }
      
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }    
      
    }
  };
  
  pieChartType: ChartType = 'pie';
  
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private authService: AuthService) {
    this.teacherName = this.authService.getTeacherName();
    this.fetchStudents();
    this.fetchSubjects();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    this.clearMessages();
    this.dynamicHeading = this.getHeadingForSection(section);
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  fetchStudents() {
    this.http.get('http://localhost:5000/students', this.getAuthHeaders()).subscribe({
      next: (response: any) => { this.students = response; },
      error: (error) => console.error('Error fetching students:', error)
    });
  }

  fetchSubjects() {
    this.http.get('http://localhost:5000/subjects').subscribe({
      next: (response: any) => { this.subjects = response; },
      error: (error) => console.error('Error fetching subjects:', error)
    });
  }

  fetchChartData() {
    if (!this.selectedMonth || !this.selectedYear) {
      this.errorMessage = '⚠️ Please select both Month and Year to view data.';
      return;
    }

    this.http.get<any[]>(`http://localhost:5000/marks/average/${this.selectedMonth}?year=${this.selectedYear}`, this.getAuthHeaders()).subscribe({
      next: (response) => {
        this.pieChartData = {
          labels: response.map(data => data.subject_name),
          datasets: [{
            data: response.map(data => data.average_score),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66FF66', '#FF66FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66FF66', '#FF66FF']
          }]
        };
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = '❗ Failed to fetch chart data!';
        this.pieChartData = { labels: [], datasets: [{ data: [] }] };
      }
    });
  }

  getMonthName(monthValue: string): string {
    return this.months.find(m => m.value === monthValue)?.name || '';
  }

  addMark() {
    if (
      !this.newMark.username ||
      !this.newMark.subject_id ||
      !this.newMark.month ||
      !this.newMark.year ||
      this.newMark.score === undefined
    ) {
      alert('Please fill in all fields.');
      return;
    }
  
    const score = parseFloat(this.newMark.score);
    if (isNaN(score) || score < 0 || score > 100) {
      alert('Please enter a valid score between 0 and 100.');
      return;
    }
  
    const apiUrl = 'http://localhost:5000/marks/add';
    
    // ✅ Ensure the token is included in the request headers
    this.http.post(apiUrl, { ...this.newMark, score }, this.getAuthHeaders()).subscribe({
      next: () => {
        alert('Mark added successfully!');
        this.newMark = { username: '', subject_id: '', month: '', year: '', score: '' };
        this.fetchStudents();
      },
      error: (error) => {
        console.error('Error adding mark:', error);
        alert('Failed to add mark. Please check the console for more details.');
      }
    });
  }
  
    
  
  updateMark(markId: number, updatedScore: number) {
    this.http.put(`http://localhost:5000/marks/update/${markId}`, { score: updatedScore }, this.getAuthHeaders()).subscribe({
      next: () => { this.successMessage = '✅ Mark updated successfully!'; },
      error: () => { this.errorMessage = '❗ Failed to update mark!'; }
    });
  }

  deleteMark(markId: number) {
    this.http.delete(`http://localhost:5000/marks/delete/${markId}`, this.getAuthHeaders()).subscribe({
      next: () => {
        this.successMessage = '🗑️ Mark deleted successfully!';
        this.fetchStudentMarks();
      },
      error: () => {
        this.errorMessage = '❗ Failed to delete mark!';
      }
    });
  }

  fetchStudentMarks() {
    if (!this.selectedStudentUsername || !this.selectedSubjectId) {
      this.errorMessage = 'Please select a student and a subject to fetch marks.';
      this.studentMarks = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:5000/marks/student/${this.selectedStudentUsername}`, this.getAuthHeaders()).subscribe({
      next: (response: any[]) => {
        this.studentMarks = response.filter(mark => mark.subject_id == this.selectedSubjectId);
      },
      error: () => {
        this.errorMessage = 'Error fetching marks!';
        this.studentMarks = [];
      }
    });
  }

  addSubject() {
    if (!this.newSubject.subjectName.trim()) {
      this.errorMessage = 'Subject name is required!';
      return;
    }
    this.http.post('http://localhost:5000/subjects/add-subject', this.newSubject).subscribe({
      next: () => {
        this.successMessage = 'Subject added successfully!';
        this.fetchSubjects();
        this.newSubject.subjectName = '';
      },
      error: () => {
        this.errorMessage = 'Failed to add subject!';
      }
    });
  }

  deleteSubject() {
    if (!this.subjectToDelete) {
      this.errorMessage = 'Please select a subject to delete!';
      return;
    }
    this.http.delete(`http://localhost:5000/subjects/${this.subjectToDelete}`).subscribe({
      next: () => {
        this.successMessage = 'Subject deleted successfully!';
        this.fetchSubjects();
        this.subjectToDelete = '';
      },
      error: () => {
        this.errorMessage = 'Failed to delete subject!';
      }
    });
  }

  private getHeadingForSection(section: string): string {
    switch (section) {
      case 'dashboard': return '📊 Marks Overview';
      case 'addMarks': return '➕ Add New Marks';
      case 'updateMarks': return '📝 Update/Delete Marks';
      case 'studentList': return '📋 Student List';
      case 'addSubject': return '➕ Add or Delete Subject';
      default: return 'Teacher Dashboard';
    }
  }
}