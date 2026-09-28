import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  GraduationCap,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters.js';
import ThemeToggle from '../../components/ThemeToggle.jsx';

export default function StudentHome({
  user,
  enrolledIds = [],
  onEnroll = () => {},
  isAdmin,
  navigate,
  logout,
  courses,
  filteredCourses,
  category,
  setCategory,
  query,
  setQuery,
  mobileNav,
  setMobileNav,
  toast,
  theme,
  onToggleTheme,
}) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 24,
        autoAlpha: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power2.out',
      });

      gsap.utils.toArray('.stats-strip, .section-heading, .why-image, .why-copy, .story-card, .cta > div, .cta > a').forEach((element) => {
        gsap.from(element, {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('.course-card').forEach((card) => {
        gsap.from(card, {
          y: 24,
          autoAlpha: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        });
      });
    }, contentRef);

    return () => context.revert();
  }, []);

  return (
    <>
      <header className="topbar">
        <a
          className="brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <span className="brand-icon">
            <GraduationCap size={21} />
          </span>
          শিখাই<span className="brand-dot">.</span>
        </a>
        <button
          className="mobile-toggle"
          onClick={() => setMobileNav(!mobileNav)}
          aria-label="মেনু"
        >
          <Menu />
        </button>
        <nav className={mobileNav ? 'nav open' : 'nav'}>
          <a href="#courses" onClick={() => setMobileNav(false)}>
            কোর্স
          </a>
          <a href="#why" onClick={() => setMobileNav(false)}>
            আমাদের সম্পর্কে
          </a>
          <a href="#stories" onClick={() => setMobileNav(false)}>
            শিক্ষার্থীদের কথা
          </a>
          <a href="#contact" onClick={() => setMobileNav(false)}>
            যোগাযোগ
          </a>
        </nav>
        <div className="nav-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              {!isAdmin && <button className="button button-light" onClick={() => navigate('/dashboard')}>ড্যাশবোর্ড</button>}
              {isAdmin && (
                <button
                  className="button button-light"
                  onClick={() => navigate('/admin')}
                >
                  অ্যাডমিন প্যানেল
                </button>
              )}
              <button className="button button-outline" onClick={logout}>
                লগআউট
              </button>
            </>
          ) : (
            <>
              <button className="button button-light" onClick={() => navigate('/login')}>
                লগইন
              </button>
              <button
                className="button button-primary small"
                onClick={() => navigate('/register')}
              >
                শুরু করুন <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>
      </header>
      <main ref={contentRef}>
        <section className="hero" id="home">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="eyebrow">
                <Sparkles size={15} /> শেখা হোক ক্যারিয়ারের শক্তি
              </div>
              <h1>
                শিখুন আজ,
                <br />
                <span>এগিয়ে যান আগামীকাল।</span>
              </h1>
              <p>
                আপনার স্বপ্নের ক্যারিয়ার গড়ার জন্য প্রয়োজনীয় দক্ষতা শিখুন অভিজ্ঞ মেন্টরদের
                সঙ্গে—নিজের গতিতে, নিজের সুবিধামতো।
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#courses">
                  কোর্স দেখুন <ArrowRight size={17} />
                </a>
                <a className="text-link" href="#why">
                  শিখাই সম্পর্কে জানুন <ChevronRight size={16} />
                </a>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack">
                  <span>র</span>
                  <span>স</span>
                  <span>আ</span>
                  <span>+</span>
                </div>
                <div>
                  <strong>১,২০০+ শিক্ষার্থী</strong>
                  <small>দক্ষতা গড়ছেন শিখাইয়ের সঙ্গে</small>
                </div>
                <div className="rating">
                  <b>★ ৪.৯</b>
                  <small>শিক্ষার্থীদের রেটিং</small>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85"
                alt="একসঙ্গে শিখছেন শিক্ষার্থীরা"
              />
              <div className="floating-card card-top">
                <span className="float-icon purple">
                  <BookOpen size={19} />
                </span>
                <div>
                  <b>১২টি কোর্স</b>
                  <small>আপনার পছন্দের দক্ষতা</small>
                </div>
              </div>
              <div className="floating-card card-bottom">
                <span className="float-icon green">
                  <Check size={20} />
                </span>
                <div>
                  <b>শিখুন, তৈরি করুন</b>
                  <small>সার্টিফিকেটসহ</small>
                </div>
              </div>
              <div className="visual-caption">
                <span>
                  <span className="live-dot" /> লাইভ ক্লাস
                </span>
                <span>● মেন্টর সাপোর্ট</span>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <span>আপনার শেখার যাত্রা শুরু হোক</span>
            <span className="scroll-mark">↓</span>
          </div>
        </section>
        <section className="stats-strip">
          <div>
            <b>১২+</b>
            <span>ক্যারিয়ারমুখী কোর্স</span>
          </div>
          <div>
            <b>১,২০০+</b>
            <span>সফল শিক্ষার্থী</span>
          </div>
          <div>
            <b>৯৮%</b>
            <span>শিক্ষার্থী সন্তুষ্টি</span>
          </div>
          <div>
            <b>২৪/৭</b>
            <span>শেখার সহায়তা</span>
          </div>
        </section>
        <section id="courses" className="section courses-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">আপনার পরবর্তী পদক্ষেপ</span>
              <h2>পছন্দের কোর্স বেছে নিন</h2>
              <p>
                বাস্তব কাজের জন্য তৈরি কোর্সে দক্ষতা বাড়ান, আত্মবিশ্বাস নিয়ে এগিয়ে যান।
              </p>
            </div>
            <div className="course-count">
              <b>{courses.length.toLocaleString('bn-BD')}</b>
              <span>টি কোর্স</span>
            </div>
          </div>
          <div className="course-tools">
            <label className="searchbox">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="কোর্স খুঁজুন..."
              />
            </label>
            <div className="filters">
              {[
                'সব',
                'ডেভেলপমেন্ট',
                'ডিজাইন',
                'মার্কেটিং',
                'ভাষা',
                'ম্যানেজমেন্ট',
                'দক্ষতা',
              ].map((c) => (
                <button
                  className={category === c ? 'filter active' : 'filter'}
                  onClick={() => setCategory(c)}
                  key={c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="course-grid">
            {filteredCourses.map((c) => (
              <article className="course-card" key={c.id}>
                <div className="course-image">
                  <img src={c.image} alt={c.name} />
                  <span className="course-category">{c.category}</span>
                  <span className="course-online">অনলাইন · অফলাইন</span>
                </div>
                <div className="course-body">
                  <h3><a className="course-title-link" href={`/courses/${c.id}`} onClick={(event) => { event.preventDefault(); navigate(`/courses/${c.id}`); }}>{c.name}</a></h3>
                  <p>{c.description}</p>
                  <div className="course-info">
                    <span>◷ {c.duration}</span>
                    <span>
                      ♧ {Number(c.students || 0).toLocaleString('bn-BD')}+ শিক্ষার্থী
                    </span>
                  </div>
                  <div className="course-footer">
                    <div>
                      <b>{formatPrice(c.onlinePrice)}</b>
                      <del>{formatPrice(c.offlinePrice)}</del>
                    </div>
                    <button
                      className={enrolledIds.includes(c.id) ? 'button button-light' : 'circle-arrow'}
                      onClick={() => onEnroll(c.id)}
                      aria-label={enrolledIds.includes(c.id) ? 'ড্যাশবোর্ডে দেখুন' : 'কোর্সে ভর্তি'}
                    >
                      {enrolledIds.includes(c.id) ? 'ড্যাশবোর্ডে যোগ হয়েছে' : <ArrowRight size={18} />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!filteredCourses.length && (
            <div className="empty-state">এই খোঁজে কোনো কোর্স পাওয়া যায়নি।</div>
          )}
        </section>
        <section id="why" className="section why-section">
          <div className="why-image">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85"
              alt="মেন্টরের সঙ্গে শেখা"
            />
            <div className="image-note">
              <ShieldCheck />
              <span>
                <b>কাজে লাগবে এমন শিক্ষা</b>
                <small>বাস্তব প্রজেক্টে অনুশীলন</small>
              </span>
            </div>
          </div>
          <div className="why-copy">
            <span className="eyebrow">কেন শিখাই?</span>
            <h2>
              শেখার অভিজ্ঞতা,
              <br />
              যা আপনাকে এগিয়ে রাখে
            </h2>
            <p>
              শুধু তত্ত্ব নয়—বাস্তব দক্ষতা, আত্মবিশ্বাস এবং ক্যারিয়ারে পরের ধাপের জন্য
              প্রস্তুতি।
            </p>
            <div className="benefit">
              <span>
                <Users size={20} />
              </span>
              <div>
                <b>অভিজ্ঞ মেন্টরের সহায়তা</b>
                <small>শেখার প্রতিটি ধাপে পাশে থাকবেন দক্ষ প্রশিক্ষক।</small>
              </div>
            </div>
            <div className="benefit">
              <span>
                <Code2 size={20} />
              </span>
              <div>
                <b>প্রজেক্টভিত্তিক অনুশীলন</b>
                <small>নিজের পোর্টফোলিওতে যোগ করার মতো কাজ তৈরি করুন।</small>
              </div>
            </div>
            <div className="benefit">
              <span>
                <GraduationCap size={20} />
              </span>
              <div>
                <b>সার্টিফিকেট ও ক্যারিয়ার সহায়তা</b>
                <small>কোর্স শেষে ক্যারিয়ারের পরের পদক্ষেপে দিকনির্দেশনা।</small>
              </div>
            </div>
          </div>
        </section>
        <section id="stories" className="section stories-section">
          <div className="center-heading">
            <span className="eyebrow">শিক্ষার্থীদের গল্প</span>
            <h2>তাদের সাফল্যই আমাদের অনুপ্রেরণা</h2>
          </div>
          <div className="story-grid">
            {[
              [
                'রায়হান ইসলাম',
                'ওয়েব ডেভেলপার',
                'ওয়েব ডেভেলপমেন্ট কোর্স করে আমি নিজের প্রথম রিমোট কাজ পেয়েছি। হাতে-কলমে শেখাটা আমার জন্য দারুণ কাজে দিয়েছে।',
                'র',
              ],
              [
                'সাবরিনা আহমেদ',
                'ডিজিটাল মার্কেটার',
                'কোর্সের পর নিজের ছোট এজেন্সি শুরু করেছি। প্রতিটি মডিউল বাস্তব কাজের সঙ্গে মিলিয়ে শেখানো হয়েছে।',
                'স',
              ],
              [
                'আরাফাত হোসেন',
                'গ্রাফিক ডিজাইনার',
                'মেন্টরদের পরামর্শ আর প্রজেক্টের অভিজ্ঞতা আমাকে ফ্রিল্যান্সিং শুরু করতে আত্মবিশ্বাস দিয়েছে।',
                'আ',
              ],
            ].map(([n, r, q, i]) => (
              <article className="story-card" key={n}>
                <div className="stars">★★★★★</div>
                <p>“{q}”</p>
                <div className="story-person">
                  <span>{i}</span>
                  <div>
                    <b>{n}</b>
                    <small>{r}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="cta">
          <div>
            <span className="eyebrow">আপনার পালা</span>
            <h2>
              নতুন কিছু শেখার জন্য
              <br />
              আজই শুরু করুন
            </h2>
            <p>আপনার আগ্রহের কোর্স খুঁজে নিন এবং লক্ষ্যের পথে এগিয়ে যান।</p>
          </div>
          <a className="button button-white" href="#courses">
            কোর্স বেছে নিন <ArrowRight size={17} />
          </a>
          <div className="cta-shape" />
        </section>
      </main>
      <footer id="contact" className="footer">
        <div className="footer-main">
          <div className="footer-about">
            <a className="brand" href="#home">
              <span className="brand-icon">
                <GraduationCap size={21} />
              </span>
              শিখাই<span className="brand-dot">.</span>
            </a>
            <p>দক্ষতা অর্জনের সহজ পথ। আপনার আগামী দিনের ক্যারিয়ার গড়তে আমরা আছি পাশে।</p>
          </div>
          <div>
            <b>দ্রুত লিংক</b>
            <a href="#courses">সকল কোর্স</a>
            <a href="#why">আমাদের সম্পর্কে</a>
            <a href="#stories">শিক্ষার্থীদের গল্প</a>
          </div>
          <div>
            <b>যোগাযোগ</b>
            <a href="tel:+8801925251125">০১৯২৫২৫১১২৫</a>
            <a href="mailto:info@sikhai.thelegendit.com">info@sikhai.thelegendit.com</a>
            <span>ঢাকা, বাংলাদেশ</span>
          </div>
          <div>
            <b>আপনার অ্যাকাউন্ট</b>
            <button className="footer-link" onClick={() => navigate('/login')}>
              লগইন
            </button>
            <button className="footer-link" onClick={() => navigate('/register')}>
              রেজিস্ট্রেশন
            </button>
            <button className="footer-link" onClick={() => navigate('/admin')}>
              অ্যাডমিন প্যানেল
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© ২০২৬ শিখাই। সর্বস্বত্ব সংরক্ষিত।</span>
          <span>বাংলাদেশে তৈরি, ভালোবাসা দিয়ে</span>
        </div>
      </footer>
      {toast && (
        <div className="toast">
          <Check size={17} />
          {toast}
        </div>
      )}
    </>
  );
}
