import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { formatDigits } from '../../utils/formatters.js';
import { formatAdminCategory } from './adminLabels.js';

export default function EnrollmentManagement({ accounts, enrollments, enrollmentProofs = [], courses }) {
  const [query, setQuery] = useState('');
  const records = useMemo(
    () =>
      Object.entries(enrollments)
        .flatMap(([email, ids]) => {
          const student = accounts.find(
            (account) => account.email.toLowerCase() === email.toLowerCase(),
          );
          return ids
            .map((courseId) => ({
              email,
              studentName: student?.name || email,
              course: courses.find((item) => item.id === courseId),
              proof: enrollmentProofs.find((item) =>
                item.student?.email?.toLowerCase() === email.toLowerCase() &&
                String(item.course?.id) === String(courseId)),
            }))
            .filter((record) => record.course);
        })
        .filter((record) =>
          `${record.studentName} ${record.email} ${record.course.name}`
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
    [accounts, courses, enrollments, enrollmentProofs, query],
  );

  return (
    <section className="admin-table-card enrollment-manager">
      <div className="table-heading">
        <div>
          <h3>কোর্সে ভর্তি</h3>
          <p>শিক্ষার্থীরা কোন কোন কোর্সে ভর্তি হয়েছে</p>
        </div>
        <label className="enrollment-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="শিক্ষার্থী বা কোর্স খুঁজুন"
          />
        </label>
      </div>
      {records.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>শিক্ষার্থী</th>
                <th>ইমেইল</th>
                <th>কোর্স</th>
                <th>বিভাগ</th>
                  <th>সময়কাল</th>
                  <th>পেমেন্ট প্রুফ</th>
                  <th>অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={`${record.email}-${record.course.id}-${index}`}>
                  <td>
                    <span className="admin-person-cell">
                      <span className="admin-person-avatar">{record.studentName.charAt(0)}</span>
                      <strong>{record.studentName}</strong>
                    </span>
                  </td>
                  <td>{record.email}</td>
                  <td>{record.course.name}</td>
                  <td>
                    <span className="table-category">
                      {formatAdminCategory(record.course.category)}
                    </span>
                  </td>
                  <td>{formatDigits(record.course.duration)}</td>
                  <td>{record.proof?.paymentMethod ? `${record.proof.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} · ${record.proof.transactionId || '—'}` : '—'}</td>
                  <td>
                    <span className={`enrollment-status${record.proof?.paymentStatus === 'verified' ? ' verified' : ''}`}>
                      {record.proof?.paymentStatus === 'verified' ? 'পেমেন্ট যাচাই হয়েছে' : 'যাচাই অপেক্ষমাণ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          {query
            ? 'এই অনুসন্ধানে কোনো ভর্তি পাওয়া যায়নি।'
            : 'এখনো কোনো কোর্সে ভর্তি হয়নি।'}
        </div>
      )}
    </section>
  );
}
