import { Trash2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';

export default function CourseTable({ courses, onDelete }) {
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
            <th>অ্যাকশন</th>
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
                <span className="table-category">{c.category}</span>
              </td>
              <td>{formatPrice(c.onlinePrice)}</td>
              <td>{c.duration}</td>
              <td>{Number(c.students || 0).toLocaleString('bn-BD')}+</td>
              <td>
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
