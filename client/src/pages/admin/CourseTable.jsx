import { Pencil, Trash2 } from 'lucide-react';
import { formatDigits, formatNumber, formatPrice } from '../../utils/formatters.js';
import { formatAdminCategory } from './adminLabels.js';

export default function CourseTable({ courses, onDelete, onEdit }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>কোর্স</th>
            <th>বিভাগ</th>
            <th>মূল্য (অনলাইন)</th>
            <th>সময়কাল</th>
            <th>শিক্ষার্থী</th>
            <th>কার্যক্রম</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>
                <div className="table-course">
                  <img src={c.image} alt="" />
                  <b>{c.name}</b>
                </div>
              </td>
              <td>
                <span className="table-category">{formatAdminCategory(c.category)}</span>
              </td>
              <td>{formatPrice(c.onlinePrice)}</td>
              <td>{formatDigits(c.duration)}</td>
              <td>
                <span className="number-display">{formatNumber(c.students)}+</span>
              </td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => onEdit?.(c)}
                  aria-label={`${c.name} সম্পাদনা`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(c.id)}
                  aria-label={`${c.name} মুছুন`}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!courses.length && (
        <div className="empty-state">এখনও কোনো কোর্স নেই। নতুন কোর্স যোগ করুন।</div>
      )}
    </div>
  );
}
