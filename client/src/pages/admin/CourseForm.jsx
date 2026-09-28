import { Check } from 'lucide-react';
import { formatAdminCategory } from './adminLabels.js';

export const defaultCourseCategory = 'ডেভেলপমেন্ট';

export const createEmptyCourseForm = () => ({
  name: '',
  category: defaultCourseCategory,
  onlinePrice: '',
  offlinePrice: '',
  duration: '',
  students: '0',
  description: '',
  image: '',
  instructor: '',
  level: '',
  prerequisites: '',
  learningOutcomes: '',
  curriculum: '',
});

const categoryOptions = [
  defaultCourseCategory,
  'ডিজাইন',
  'মার্কেটিং',
  'ভাষা',
  'ম্যানেজমেন্ট',
  'দক্ষতা',
];

export default function CourseForm({
  form,
  courses,
  isEditing,
  onFieldChange,
  onSubmit,
}) {
  const categories = [
    ...new Set([...categoryOptions, ...courses.map((course) => course.category)]),
  ];
  const field = (name) => ({
    value: form[name],
    onChange: (event) => onFieldChange(name, event.target.value),
  });

  return (
    <form className="add-course-form" onSubmit={onSubmit}>
      <h3>{isEditing ? 'কোর্স সম্পাদনা' : 'নতুন কোর্স প্রকাশ'}</h3>
      <div className="form-grid">
        <label>
          কোর্সের নাম
          <input required {...field('name')} placeholder="কোর্সের নাম লিখুন" />
        </label>
        <label>
          বিভাগ
          <select {...field('category')}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {formatAdminCategory(category)}
              </option>
            ))}
          </select>
        </label>
        <label>
          অনলাইন মূল্য (টাকা)
          <input type="number" min="0" required {...field('onlinePrice')} />
        </label>
        <label>
          অফলাইন মূল্য (টাকা)
          <input type="number" min="0" required {...field('offlinePrice')} />
        </label>
        <label>
          কোর্সের সময়কাল
          <input required {...field('duration')} placeholder="৩ মাস" />
        </label>
        <label>
          শিক্ষার্থীর সংখ্যা
          <input type="number" min="0" {...field('students')} />
        </label>
        <label className="form-wide">
          ছবির লিংক
          <input type="url" {...field('image')} placeholder="https://..." />
        </label>
        <label className="form-wide">
          কোর্সের বিবরণ
          <textarea required rows="3" {...field('description')} />
        </label>
        <label>
          প্রশিক্ষকের নাম
          <input {...field('instructor')} />
        </label>
        <label>
          দক্ষতার স্তর
          <input {...field('level')} />
        </label>
        <label className="form-wide">
          পূর্বশর্ত
          <input {...field('prerequisites')} />
        </label>
        <label className="form-wide">
          শেখার বিষয়সমূহ (প্রতি লাইনে একটি)
          <textarea rows="3" {...field('learningOutcomes')} />
        </label>
        <label className="form-wide">
          কোর্সের পাঠ্যসূচি (প্রতি লাইনে একটি অধ্যায়)
          <textarea rows="4" {...field('curriculum')} />
        </label>
      </div>
      <button className="button button-primary">
        <Check size={17} /> {isEditing ? 'পরিবর্তন সংরক্ষণ করুন' : 'কোর্স প্রকাশ করুন'}
      </button>
    </form>
  );
}
