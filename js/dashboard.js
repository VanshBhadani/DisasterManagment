/**
 * Suraksha Learn - Dashboard Logic
 * Handles admin analytics, charts, and data visualization
 */

class Dashboard {
  constructor() {
    this.charts = {};
    this.currentDateRange = 'last7days';
    this.currentView = 'overview';
    this.data = {
      students: [],
      completions: [],
      modules: [],
      performance: {}
    };
    
    // DOM elements
    this.dateRangeSelector = document.getElementById('dateRange');
    this.exportBtn = document.getElementById('exportData');
    this.refreshBtn = document.getElementById('refreshData');
    
    // Chart containers
    this.chartContainers = {
      studentsChart: document.getElementById('studentsChart'),
      performanceChart: document.getElementById('performanceChart'),
      moduleChart: document.getElementById('moduleChart'),
      progressChart: document.getElementById('progressChart')
    };
    
    this.init();
  }
  
  /**
   * Initialize dashboard
   */
  init() {
    console.log('📊 Initializing dashboard');
    
    this.setupEventListeners();
    this.loadDashboardData();
    this.setupCharts();
    this.updateMetrics();
    this.setupDataTable();
    
    // Auto-refresh every 5 minutes
    setInterval(() => {
      this.refreshData();
    }, 300000);
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Date range selector
    if (this.dateRangeSelector) {
      this.dateRangeSelector.addEventListener('change', () => {
        this.currentDateRange = this.dateRangeSelector.value;
        this.refreshData();
      });
    }
    
    // Export button
    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => {
        this.exportData();
      });
    }
    
    // Refresh button
    if (this.refreshBtn) {
      this.refreshBtn.addEventListener('click', () => {
        this.refreshData();
      });
    }
    
    // View switching
    const viewButtons = document.querySelectorAll('.view-toggle-btn');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        this.switchView(view);
      });
    });
    
    // Table controls
    const itemsPerPage = document.getElementById('itemsPerPage');
    if (itemsPerPage) {
      itemsPerPage.addEventListener('change', () => {
        this.updateDataTable();
      });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchStudents');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(() => {
        this.filterStudents(searchInput.value);
      }, 300));
    }
  }
  
  /**
   * Switch dashboard view
   */
  switchView(view) {
    this.currentView = view;
    
    // Update active button
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    
    // Show/hide appropriate sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
      const sectionView = section.getAttribute('data-view');
      section.style.display = (!sectionView || sectionView === view) ? 'block' : 'none';
    });
    
    // Refresh charts if needed
    if (view === 'analytics') {
      setTimeout(() => {
        this.refreshCharts();
      }, 100);
    }
  }
  
  /**
   * Load dashboard data from localStorage and generate sample data
   */
  loadDashboardData() {
    // Load real completion data
    const completions = JSON.parse(localStorage.getItem('suraksha-completions') || '[]');
    this.data.completions = completions;
    
    // Generate sample data to demonstrate dashboard functionality
    this.data.students = this.generateSampleStudents();
    this.data.modules = this.generateModuleData();
    this.data.performance = this.calculatePerformanceMetrics();
    
    console.log('📈 Dashboard data loaded:', this.data);
  }
  
  /**
   * Generate sample student data for demonstration
   */
  generateSampleStudents() {
    const sampleStudents = [
      { id: 'ST001', name: 'Priya Sharma', institution: 'Delhi Public School', course: 'Class 10', joinedAt: '2024-01-15' },
      { id: 'ST002', name: 'Rahul Kumar', institution: 'St. Xavier\'s College', course: 'B.Sc Physics', joinedAt: '2024-01-16' },
      { id: 'ST003', name: 'Anita Singh', institution: 'Miranda House', course: 'B.A English', joinedAt: '2024-01-18' },
      { id: 'ST004', name: 'Vikram Patel', institution: 'IIT Delhi', course: 'M.Tech Civil', joinedAt: '2024-01-20' },
      { id: 'ST005', name: 'Sneha Reddy', institution: 'Osmania University', course: 'B.E Computer Science', joinedAt: '2024-01-22' },
      { id: 'ST006', name: 'Arjun Mehta', institution: 'Loyola College', course: 'MBA', joinedAt: '2024-01-25' },
      { id: 'ST007', name: 'Kavya Nair', institution: 'Stella Maris College', course: 'M.Sc Chemistry', joinedAt: '2024-01-28' },
      { id: 'ST008', name: 'Rohit Gupta', institution: 'Jamia Millia Islamia', course: 'B.Tech Mechanical', joinedAt: '2024-02-01' },
      { id: 'ST009', name: 'Meera Joshi', institution: 'Lady Shri Ram College', course: 'B.Com Honours', joinedAt: '2024-02-03' },
      { id: 'ST010', name: 'Kiran Das', institution: 'Presidency College', course: 'M.A History', joinedAt: '2024-02-05' }
    ];
    
    // Add completion data to students
    return sampleStudents.map(student => {
      const studentCompletions = this.data.completions.filter(c => 
        c.studentInfo && c.studentInfo.name === student.name
      );
      
      return {
        ...student,
        completedModules: studentCompletions.length,
        averageScore: studentCompletions.length > 0 
          ? Math.round(studentCompletions.reduce((sum, c) => sum + (c.percentage || 0), 0) / studentCompletions.length)
          : 0,
        lastActive: studentCompletions.length > 0
          ? new Date(Math.max(...studentCompletions.map(c => new Date(c.completedAt))))
          : new Date(student.joinedAt),
        status: studentCompletions.length > 0 ? 'Active' : 'Inactive'
      };
    });
  }
  
  /**
   * Generate module performance data
   */
  generateModuleData() {
    const modules = [
      { id: 'earthquake', name: 'Earthquake Safety', totalUsers: 45, completionRate: 78, averageScore: 82 },
      { id: 'fire', name: 'Fire Emergency Response', totalUsers: 38, completionRate: 85, averageScore: 87 },
      { id: 'flood', name: 'Flood Preparedness', totalUsers: 32, completionRate: 65, averageScore: 75 },
      { id: 'cyclone', name: 'Cyclone Safety', totalUsers: 28, completionRate: 71, averageScore: 79 }
    ];
    
    return modules;
  }
  
  /**
   * Calculate performance metrics
   */
  calculatePerformanceMetrics() {
    const totalStudents = this.data.students.length;
    const activeStudents = this.data.students.filter(s => s.status === 'Active').length;
    const totalCompletions = this.data.completions.length;
    const passedCompletions = this.data.completions.filter(c => c.passed).length;
    
    return {
      totalStudents,
      activeStudents,
      totalCompletions,
      passedCompletions,
      engagementRate: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0,
      successRate: totalCompletions > 0 ? Math.round((passedCompletions / totalCompletions) * 100) : 0,
      averageScore: this.data.completions.length > 0 
        ? Math.round(this.data.completions.reduce((sum, c) => sum + (c.percentage || 0), 0) / this.data.completions.length)
        : 0
    };
  }
  
  /**
   * Update metric cards
   */
  updateMetrics() {
    const metrics = this.data.performance;
    
    const metricElements = {
      totalStudents: document.getElementById('totalStudents'),
      activeStudents: document.getElementById('activeStudents'), 
      totalCompletions: document.getElementById('totalCompletions'),
      engagementRate: document.getElementById('engagementRate'),
      successRate: document.getElementById('successRate'),
      averageScore: document.getElementById('averageScore')
    };
    
    // Update metric values
    if (metricElements.totalStudents) {
      metricElements.totalStudents.textContent = metrics.totalStudents;
    }
    
    if (metricElements.activeStudents) {
      metricElements.activeStudents.textContent = metrics.activeStudents;
    }
    
    if (metricElements.totalCompletions) {
      metricElements.totalCompletions.textContent = metrics.totalCompletions;
    }
    
    if (metricElements.engagementRate) {
      metricElements.engagementRate.textContent = `${metrics.engagementRate}%`;
    }
    
    if (metricElements.successRate) {
      metricElements.successRate.textContent = `${metrics.successRate}%`;
    }
    
    if (metricElements.averageScore) {
      metricElements.averageScore.textContent = `${metrics.averageScore}%`;
    }
    
    // Animate metric changes
    this.animateMetrics();
  }
  
  /**
   * Animate metric cards
   */
  animateMetrics() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    if (typeof gsap !== 'undefined') {
      gsap.from(metricCards, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }
  
  /**
   * Setup Chart.js charts
   */
  setupCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded, skipping chart setup');
      return;
    }
    
    this.setupStudentsChart();
    this.setupPerformanceChart();
    this.setupModuleChart();
    this.setupProgressChart();
  }
  
  /**
   * Setup students enrollment chart
   */
  setupStudentsChart() {
    const ctx = this.chartContainers.studentsChart?.getContext('2d');
    if (!ctx) return;
    
    const enrollmentData = this.generateEnrollmentData();
    
    this.charts.students = new Chart(ctx, {
      type: 'line',
      data: {
        labels: enrollmentData.labels,
        datasets: [{
          label: 'New Students',
          data: enrollmentData.data,
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#1F2937',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB'
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280',
              stepSize: 1
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }
  
  /**
   * Generate enrollment data for chart
   */
  generateEnrollmentData() {
    const dates = [];
    const data = [];
    const now = new Date();
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Generate random enrollment data (would be real data in production)
      data.push(Math.floor(Math.random() * 8) + 1);
    }
    
    return { labels: dates, data };
  }
  
  /**
   * Setup performance comparison chart
   */
  setupPerformanceChart() {
    const ctx = this.chartContainers.performanceChart?.getContext('2d');
    if (!ctx) return;
    
    this.charts.performance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Earthquake', 'Fire Safety', 'Flood', 'Cyclone'],
        datasets: [{
          label: 'Average Score (%)',
          data: [82, 87, 75, 79],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',   // Red for earthquake
            'rgba(245, 158, 11, 0.8)',  // Orange for fire
            'rgba(59, 130, 246, 0.8)',  // Blue for flood  
            'rgba(16, 185, 129, 0.8)'   // Green for cyclone
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(245, 158, 11)', 
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB'
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280'
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280',
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }
  
  /**
   * Setup module popularity chart
   */
  setupModuleChart() {
    const ctx = this.chartContainers.moduleChart?.getContext('2d');
    if (!ctx) return;
    
    this.charts.module = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.data.modules.map(m => m.name),
        datasets: [{
          data: this.data.modules.map(m => m.totalUsers),
          backgroundColor: [
            '#EF4444', // Red
            '#F59E0B', // Orange
            '#3B82F6', // Blue  
            '#10B981'  // Green
          ],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              color: '#374151',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB',
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((context.parsed * 100) / total);
                return `${context.label}: ${context.parsed} students (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
  
  /**
   * Setup progress tracking chart
   */
  setupProgressChart() {
    const ctx = this.chartContainers.progressChart?.getContext('2d');
    if (!ctx) return;
    
    this.charts.progress = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.modules.map(m => m.name),
        datasets: [{
          label: 'Completion Rate (%)',
          data: this.data.modules.map(m => m.completionRate),
          backgroundColor: 'rgba(79, 70, 229, 0.8)',
          borderColor: 'rgb(79, 70, 229)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1F2937',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB',
            callbacks: {
              label: function(context) {
                return `Completion Rate: ${context.parsed.x}%`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#E5E7EB'
            },
            ticks: {
              color: '#6B7280',
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280'
            }
          }
        }
      }
    });
  }
  
  /**
   * Setup data table with student information
   */
  setupDataTable() {
    this.updateDataTable();
  }
  
  /**
   * Update data table with current data
   */
  updateDataTable() {
    const tableBody = document.getElementById('studentsTableBody');
    if (!tableBody) return;
    
    const itemsPerPage = parseInt(document.getElementById('itemsPerPage')?.value || '10');
    const currentPage = 1; // Could be dynamic with pagination
    
    tableBody.innerHTML = '';
    
    // Sort students by last active date (most recent first)
    const sortedStudents = [...this.data.students].sort((a, b) => 
      new Date(b.lastActive) - new Date(a.lastActive)
    );
    
    // Paginate data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageStudents = sortedStudents.slice(startIndex, endIndex);
    
    pageStudents.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="student-info">
            <div class="student-avatar">${student.name.charAt(0)}</div>
            <div>
              <div class="student-name">${student.name}</div>
              <div class="student-id">${student.id}</div>
            </div>
          </div>
        </td>
        <td>${student.institution}</td>
        <td>${student.course}</td>
        <td>${student.completedModules}</td>
        <td>
          <div class="score-badge ${this.getScoreClass(student.averageScore)}">
            ${student.averageScore}%
          </div>
        </td>
        <td>${this.formatDate(student.lastActive)}</td>
        <td>
          <span class="status-badge ${student.status.toLowerCase()}">${student.status}</span>
        </td>
        <td>
          <button class="action-btn" onclick="dashboard.viewStudent('${student.id}')">
            <i class="icon-eye"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Update pagination info
    this.updatePaginationInfo(sortedStudents.length, currentPage, itemsPerPage);
  }
  
  /**
   * Get CSS class for score badge
   */
  getScoreClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';  
    if (score >= 70) return 'average';
    return 'poor';
  }
  
  /**
   * Format date for display
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    });
  }
  
  /**
   * Update pagination information
   */
  updatePaginationInfo(totalItems, currentPage, itemsPerPage) {
    const paginationInfo = document.getElementById('paginationInfo');
    if (!paginationInfo) return;
    
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${totalItems} students`;
  }
  
  /**
   * Filter students based on search query
   */
  filterStudents(query) {
    if (!query.trim()) {
      this.updateDataTable();
      return;
    }
    
    const filteredStudents = this.data.students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.id.toLowerCase().includes(query.toLowerCase()) ||
      student.institution.toLowerCase().includes(query.toLowerCase()) ||
      student.course.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update table with filtered data
    const tableBody = document.getElementById('studentsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    filteredStudents.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="student-info">
            <div class="student-avatar">${student.name.charAt(0)}</div>
            <div>
              <div class="student-name">${student.name}</div>
              <div class="student-id">${student.id}</div>
            </div>
          </div>
        </td>
        <td>${student.institution}</td>
        <td>${student.course}</td>
        <td>${student.completedModules}</td>
        <td>
          <div class="score-badge ${this.getScoreClass(student.averageScore)}">
            ${student.averageScore}%
          </div>
        </td>
        <td>${this.formatDate(student.lastActive)}</td>
        <td>
          <span class="status-badge ${student.status.toLowerCase()}">${student.status}</span>
        </td>
        <td>
          <button class="action-btn" onclick="dashboard.viewStudent('${student.id}')">
            <i class="icon-eye"></i>
          </button>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Update pagination info for filtered results
    this.updatePaginationInfo(filteredStudents.length, 1, filteredStudents.length);
  }
  
  /**
   * View individual student details
   */
  viewStudent(studentId) {
    const student = this.data.students.find(s => s.id === studentId);
    if (!student) return;
    
    console.log('👤 Viewing student:', student);
    
    // This would typically open a modal or navigate to a detail page
    alert(`Student Details:\n\nName: ${student.name}\nID: ${student.id}\nInstitution: ${student.institution}\nCourse: ${student.course}\nCompleted Modules: ${student.completedModules}\nAverage Score: ${student.averageScore}%\nStatus: ${student.status}`);
  }
  
  /**
   * Refresh all dashboard data and charts
   */
  refreshData() {
    console.log('🔄 Refreshing dashboard data');
    
    this.loadDashboardData();
    this.updateMetrics();
    this.refreshCharts();
    this.updateDataTable();
    
    // Show loading state briefly
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
      const originalText = refreshBtn.textContent;
      refreshBtn.textContent = 'Refreshing...';
      refreshBtn.disabled = true;
      
      setTimeout(() => {
        refreshBtn.textContent = originalText;
        refreshBtn.disabled = false;
      }, 1000);
    }
    
    announceToScreenReader('Dashboard data refreshed');
  }
  
  /**
   * Refresh all charts
   */
  refreshCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.update();
      }
    });
  }
  
  /**
   * Export dashboard data as CSV
   */
  exportData() {
    const exportData = this.data.students.map(student => ({
      'Student ID': student.id,
      'Name': student.name,
      'Institution': student.institution,
      'Course': student.course,
      'Completed Modules': student.completedModules,
      'Average Score': student.averageScore,
      'Last Active': this.formatDate(student.lastActive),
      'Status': student.status
    }));
    
    const csv = this.convertToCSV(exportData);
    this.downloadCSV(csv, 'suraksha-learn-students.csv');
    
    console.log('📄 Data exported as CSV');
    announceToScreenReader('Student data exported as CSV file');
  }
  
  /**
   * Convert array of objects to CSV string
   */
  convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape values containing commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }
  
  /**
   * Download CSV file
   */
  downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  
  /**
   * Handle window resize to update charts
   */
  handleResize() {
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.resize();
      }
    });
  }
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
  
  // Handle window resize for charts
  window.addEventListener('resize', debounce(() => {
    window.dashboard.handleResize();
  }, 250));
});