import React from 'react';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const userEmail = localStorage.getItem('userEmail');

  return (
    <div className="teacher-dashboard">
      <div className="teacher-header">
        <h1>Teacher Dashboard</h1>
        <p>Welcome back, {userEmail}! Manage your courses and students here.</p>
      </div>

      <div className="teacher-grid">
        <div className="teacher-card">
          <div className="card-icon">👥</div>
          <h3>My Students</h3>
          <p>You have 0 students currently enrolled.</p>
          <button className="teacher-action-btn">View Students</button>
        </div>

        <div className="teacher-card">
          <div className="card-icon">📚</div>
          <h3>My Courses</h3>
          <p>You have not created any courses yet.</p>
          <button className="teacher-action-btn">Create Course</button>
        </div>

        <div className="teacher-card">
          <div className="card-icon">📊</div>
          <h3>Analytics</h3>
          <p>View performance metrics for your courses.</p>
          <button className="teacher-action-btn disabled">Coming Soon</button>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
