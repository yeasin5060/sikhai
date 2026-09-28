import React from 'react';
import { BookOpen, Users, Wallet } from 'lucide-react';
import { formatNumber, formatPrice } from '../../utils/formatters.js';
import { formatAdminCategory } from './adminLabels.js';

export default function AnalyticsPage({ courses, enrollments }) {
  const enrollmentCount = Object.values(enrollments).reduce(
    (total, ids) => total + ids.length,
    0,
  );
  const revenueEstimate = Object.entries(enrollments).reduce((total, [, ids]) => {
    const uniqueIds = [...new Set(ids)];
    return (
      total +
      uniqueIds.reduce((subtotal, id) => {
        const course = courses.find((item) => item.id === id);
        return subtotal + Number(course?.onlinePrice || 0);
      }, 0)
    );
  }, 0);
  const categoryCounts = courses.reduce((counts, course) => {
    counts[course.category] = (counts[course.category] || 0) + 1;
    return counts;
  }, {});
  const maxCourses = Math.max(1, ...Object.values(categoryCounts));

  return (
    <div className="admin-analytics">
      <div className="admin-stats">
        <div className="admin-stat">
          <span className="stat-symbol purple">
            <BookOpen />
          </span>
          <small>মোট কোর্স</small>
          <b className="number-display">{formatNumber(courses.length)}</b>
          <span className="stat-foot">প্রকাশিত কোর্স</span>
        </div>
        <div className="admin-stat">
          <span className="stat-symbol blue">
            <Users />
          </span>
          <small>মোট ভর্তি</small>
          <b className="number-display">{formatNumber(enrollmentCount)}</b>
          <span className="stat-foot">শিক্ষার্থীদের কোর্সে ভর্তি</span>
        </div>
        <div className="admin-stat">
          <span className="stat-symbol orange">
            <Wallet />
          </span>
          <small>আনুমানিক আয়</small>
          <b>{formatPrice(revenueEstimate)}</b>
          <span className="stat-foot">অনলাইন মূল্য ধরে হিসাব</span>
        </div>
      </div>
      <section className="admin-table-card category-analytics">
        <div className="table-heading">
          <div>
            <h3>বিভাগ অনুযায়ী কোর্স</h3>
            <p>প্রতিটি বিভাগে প্রকাশিত কোর্সের সংখ্যা</p>
          </div>
        </div>
        {Object.entries(categoryCounts).map(([category, count]) => (
          <div className="category-bar-row" key={category}>
            <div>
              <span>{formatAdminCategory(category)}</span>
              <b className="number-display">{formatNumber(count)}</b>
            </div>
            <div className="category-bar-track">
              <span style={{ width: `${(count / maxCourses) * 100}%` }} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
