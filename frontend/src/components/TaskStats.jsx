import React from 'react';
import { Layers, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export default function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="stats-section" aria-label="Task Statistics">
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-info">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-icon-wrapper">
            <Layers size={24} />
          </div>
        </div>

        <div className="stat-card stat-active">
          <div className="stat-info">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{pending}</span>
          </div>
          <div className="stat-icon-wrapper">
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card stat-done">
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completed}</span>
          </div>
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="stat-card stat-rate">
          <div className="stat-info">
            <span className="stat-label">Success Rate</span>
            <span className="stat-value">{percentage}%</span>
          </div>
          <div className="stat-icon-wrapper">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="progress-banner">
        <div className="progress-header">
          <span className="progress-title">Overall Completion Velocity</span>
          <span className="progress-pct">{completed} of {total} completed ({percentage}%)</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </section>
  );
}
