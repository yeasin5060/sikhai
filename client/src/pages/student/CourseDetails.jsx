import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  Clock3,
  GraduationCap,
  Monitor,
  PlayCircle,
  Users,
} from 'lucide-react';
import { formatDigits, formatNumber, formatPrice } from '../../utils/formatters.js';
import ThemeToggle from '../../components/ThemeToggle.jsx';

export default function CourseDetails({
  course,
  allCourses,
  user,
  enrolledIds,
  onNavigate,
  onEnroll,
  theme,
  onToggleTheme,
}) {
  const enrolled = enrolledIds.includes(course.id);
  const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
  const outcomes =
    Array.isArray(course.learningOutcomes) && course.learningOutcomes.length
      ? course.learningOutcomes
      : curriculum.length
        ? curriculum
        : course.description
          .split(/[,،]/)
          .map((item) => item.trim())
          .filter(Boolean);
  const relatedCourses = allCourses
    .filter((item) => item.id !== course.id && item.category === course.category)
    .slice(0, 3);

  return (
    <div className="course-detail-page">
      <header className="student-dashboard-header">
        <a
          className="brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onNavigate('/');
          }}
        >
          <span className="brand-icon">
            <GraduationCap size={21} />
          </span>
          শিখাই<span className="brand-dot">.</span>
        </a>
        <div className="student-dashboard-actions">
          {user && (
            <button
              className="button button-light"
              onClick={() => onNavigate('/dashboard')}
            >
              ড্যাশবোর্ড
            </button>
          )}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      <main className="course-detail-content">
        <button className="text-link course-back" onClick={() => onNavigate('/')}>
          <ArrowLeft size={17} /> সব কোর্স
        </button>
        <section className="course-detail-hero">
          <img src={course.image} alt={course.name} />
          <div className="course-detail-copy">
            <span className="course-detail-category">{course.category}</span>
            <h1>{course.name}</h1>
            <p>{course.description}</p>
            <div className="course-detail-facts">
              <span>
                <Clock3 size={17} /> {formatDigits(course.duration)}
              </span>
              <span>
                <Users size={17} />{' '}
                <span className="number-display">{formatNumber(course.students)}+</span>{' '}
                শিক্ষার্থী
              </span>
              {course.level && (
                <span>
                  <GraduationCap size={17} /> {course.level}
                </span>
              )}
            </div>
            <div className="course-hero-fees" aria-label="কোর্সের অনলাইন ও অফলাইন ফি">
              <div className="course-hero-fee online">
                <span><Monitor size={15} /> অনলাইন ফি</span>
                <strong>{formatPrice(course.onlinePrice)}</strong>
              </div>
              <div className="course-hero-fee offline">
                <span><Building2 size={15} /> অফলাইন ফি</span>
                <strong>{formatPrice(course.offlinePrice)}</strong>
              </div>
            </div>
            {course.instructor && (
              <p className="course-instructor">
                প্রশিক্ষক <strong>{course.instructor}</strong>
              </p>
            )}
            <button
              className="button button-primary course-hero-cta"
              onClick={() => (enrolled ? onNavigate('/dashboard') : onEnroll(course.id))}
            >
              {enrolled
                ? 'ড্যাশবোর্ডে যোগ হয়েছে'
                : user
                  ? 'কোর্সে ভর্তি হন'
                  : 'লগইন করে ভর্তি হন'}{' '}
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <div className="course-detail-layout">
          <div className="course-detail-sections">
            <section className="course-info-panel" id="overview">
              <div className="course-learning-heading">
                <div>
                  <span className="eyebrow">কোর্স পরিচিতি</span>
                  <h2>এই কোর্সে যা শিখবেন</h2>
                </div>
                <span className="course-learning-count">
                  <Check size={15} /> {formatNumber(outcomes.length)}টি বিষয়
                </span>
              </div>
              <p>{course.description}</p>
              <div className="course-outcomes">
                {outcomes.map((outcome, index) => (
                  <div key={`${index}-${outcome}`}>
                    <Check size={17} />
                    <span>{outcome.replace(/[।.!?]$/, '')}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="course-info-panel">
              <div className="course-panel-heading">
                <div>
                  <span className="eyebrow">শেখার পরিকল্পনা</span>
                  <h2>কোর্স আউটলাইন</h2>
                </div>
                <span className="course-module-count">
                  <BookOpen size={16} />{' '}
                  <span className="number-display">
                    {formatNumber(curriculum.length)}
                  </span>{' '}
                  মডিউল
                </span>
              </div>
              {curriculum.length ? (
                <div className="course-curriculum">
                  {curriculum.map((module, index) => (
                    <details key={`${index}-${module}`} open={index === 0}>
                      <summary>
                        <span className="module-number number-display">
                          {formatNumber(index + 1).padStart(2, '০')}
                        </span>
                        <span>{module}</span>
                        <PlayCircle size={17} />
                      </summary>
                      <p>
                        এই মডিউলে {module.replace(/^মডিউল\s*\d*[:：-]?\s*/i, '')} বিষয়ে
                        ধাপে ধাপে শেখার সুযোগ থাকবে।
                      </p>
                    </details>
                  ))}
                </div>
              ) : (
                <div className="course-outline-empty">
                  <BookOpen size={20} />
                  <p>
                    এই কোর্সের বিস্তারিত মডিউল শিগগিরই যোগ করা হবে। আপাতত উপরের শেখার
                    বিষয়গুলো দেখে নিন।
                  </p>
                </div>
              )}
            </section>

            <section className="course-info-panel course-prerequisite-panel">
              <span className="eyebrow">শুরু করার আগে</span>
              <h2>পূর্বশর্ত</h2>
              <p>
                {course.prerequisites ||
                  'বিশেষ পূর্ব অভিজ্ঞতার কথা উল্লেখ করা হয়নি। কোর্সের বিবরণে দেওয়া বিষয়গুলো দেখে নিজের প্রস্তুতি যাচাই করুন।'}
              </p>
            </section>

            <section className="course-info-panel course-faq-panel">
              <span className="eyebrow">সাধারণ জিজ্ঞাসা</span>
              <h2>ভর্তির তথ্য</h2>
              <details>
                <summary>কোর্সে কীভাবে ভর্তি হব?</summary>
                <p>
                  ভর্তি হতে উপরের “কোর্সে ভর্তি হন” বাটনে ক্লিক করুন। লগইন করা না থাকলে
                  আগে আপনার অ্যাকাউন্টে প্রবেশ করুন।
                </p>
              </details>
              <details>
                <summary>কোর্সটির সময়কাল কত?</summary>
                <p>এই কোর্সটির নির্ধারিত সময়কাল {formatDigits(course.duration)}।</p>
              </details>
              <details>
                <summary>অনলাইন ও অফলাইন মূল্য আলাদা কেন?</summary>
                <p>
                  কোর্সের অনলাইন মূল্য {formatPrice(course.onlinePrice)} এবং অফলাইন মূল্য{' '}
                  {formatPrice(course.offlinePrice)}। আপনার সুবিধামতো পদ্ধতি বেছে নিন।
                </p>
              </details>
            </section>
          </div>

          <aside className="course-enroll-card">
            <img src={course.image} alt="" />
            <div className="course-enroll-card-body">
              <span className="course-enroll-label">কোর্সে অন্তর্ভুক্ত</span>
              <div>
                <Check size={16} /> {formatDigits(course.duration)} সময়কাল
              </div>
              <div>
                <Check size={16} /> {course.category} বিভাগ
              </div>
              <div>
                <Check size={16} /> অনলাইন ও অফলাইন অপশন
              </div>
              {course.instructor && (
                <div>
                  <Check size={16} /> প্রশিক্ষক: {course.instructor}
                </div>
              )}
              <div className="course-enroll-fees" aria-label="অনলাইন ও অফলাইন কোর্সের ফি">
                <div className="course-fee-option online">
                  <span><Monitor size={15} /> অনলাইন ফি</span>
                  <strong>{formatPrice(course.onlinePrice)}</strong>
                </div>
                <div className="course-fee-option offline">
                  <span><Building2 size={15} /> অফলাইন ফি</span>
                  <strong>{formatPrice(course.offlinePrice)}</strong>
                </div>
              </div>
              <button
                className="button button-primary"
                onClick={() =>
                  enrolled ? onNavigate('/dashboard') : onEnroll(course.id)
                }
              >
                {enrolled ? 'ড্যাশবোর্ডে যান' : 'এখনই ভর্তি হন'} <ArrowRight size={16} />
              </button>
              {enrolled && (
                <button
                  className="text-link enrolled-dashboard-link"
                  onClick={() => onNavigate('/dashboard')}
                >
                  ড্যাশবোর্ডে যান <ArrowRight size={15} />
                </button>
              )}
            </div>
          </aside>
        </div>

        {!!relatedCourses.length && (
          <section className="related-courses">
            <div className="course-panel-heading">
              <div>
                <span className="eyebrow">আরও শিখুন</span>
                <h2>এই বিভাগের আরও কোর্স</h2>
              </div>
              <button className="text-link" onClick={() => onNavigate('/')}>
                সব কোর্স <ArrowRight size={16} />
              </button>
            </div>
            <div className="related-course-grid">
              {relatedCourses.map((item) => (
                <button
                  className="related-course-card"
                  key={item.id}
                  onClick={() => onNavigate(`/courses/${item.id}`)}
                >
                  <img src={item.image} alt="" />
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.name}</strong>
                    <b>{formatPrice(item.onlinePrice)}</b>
                  </span>
                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
