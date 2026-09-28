import React from 'react';
import { Users } from 'lucide-react';
import { formatNumber } from '../../utils/formatters.js';

export default function StudentManagement({ accounts, enrollments, courses }) {
  const studentsByEmail = new Map(
    accounts.map((account) => [account.email.toLowerCase(), account]),
  );
  Object.keys(enrollments).forEach((email) => {
    if (!studentsByEmail.has(email)) studentsByEmail.set(email, { email, name: email });
  });
  const students = [...studentsByEmail.values()].map((student) => ({
    ...student,
    courseIds: enrollments[student.email.toLowerCase()] || [],
  }));

  return (
    <section className="admin-table-card admin-student-manager">
      <div className="table-heading">
        <div>
          <h3>শিক্ষার্থী তালিকা</h3>
          <p>নিবন্ধিত শিক্ষার্থী ও তাদের কোর্স</p>
        </div>
        <span className="student-list-total">
          <Users size={18} />{' '}
          <span className="number-display">{formatNumber(students.length)}</span>
        </span>
      </div>
      {students.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>নাম</th>
                <th>ইমেইল</th>
                <th>কোর্স</th>
                <th>কোর্সের নাম</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.email}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td className="number-display">
                    {formatNumber(student.courseIds.length)}
                  </td>
                  <td>
                    {student.courseIds
                      .map((id) => courses.find((course) => course.id === id)?.name)
                      .filter(Boolean)
                      .join(', ') || 'এখনো ভর্তি হয়নি'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">এখনো কোনো শিক্ষার্থী নিবন্ধন করেনি।</div>
      )}
    </section>
  );
}
