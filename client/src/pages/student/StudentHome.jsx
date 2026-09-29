import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import {
  ArrowRight,
  Building2,
  BookOpen,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock3,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
} from 'lucide-react';
import { formatDigits, formatNumber, formatPrice } from '../../utils/formatters.js';
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
  theme,
  onToggleTheme,
}) {
  const contentRef = useRef(null);
  const [activeHero, setActiveHero] = useState(0);
  const categoryOptions = [
    'সব',
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];
  const heroSlides = [
    { eyebrow: 'শেখা হোক ক্যারিয়ারের শক্তি', firstLine: 'শিখুন আজ,', secondLine: 'এগিয়ে যান আগামীকাল।', description: 'অভিজ্ঞ মেন্টরদের সঙ্গে নিজের গতিতে শিখুন স্বপ্নের ক্যারিয়ার গড়ার প্রয়োজনীয় দক্ষতা।', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85', alt: 'শিক্ষার্থীরা একসঙ্গে শিখছেন', proofMain: '১,২০০+ শিক্ষার্থী', proofSub: 'শিখছেন Shikhai-এর সঙ্গে', cardTitle: '১২+ ক্যারিয়ার কোর্স', cardSub: 'আপনার পছন্দের দক্ষতা', bottomTitle: 'শেখা থেকে ক্যারিয়ার', bottomSub: 'পরিকল্পনা অনুযায়ী এগিয়ে চলুন', caption: 'একসঙ্গে শিখুন' },
    { eyebrow: 'হাতে-কলমে দক্ষতা অর্জন', firstLine: 'বাস্তব কাজ শিখুন,', secondLine: 'ভবিষ্যৎ গড়ুন।', description: 'প্রজেক্টভিত্তিক কোর্স ও মেন্টরের সহায়তায় বাস্তব অভিজ্ঞতা নিয়ে নিজের পোর্টফোলিও তৈরি করুন।', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85', alt: 'ল্যাপটপে কাজ শিখছেন একজন শিক্ষার্থী', proofMain: 'প্রজেক্টভিত্তিক শেখা', proofSub: 'কাজ করতে করতেই দক্ষতা', cardTitle: 'বাস্তব প্রজেক্ট', cardSub: 'পোর্টফোলিওতে যোগ করুন', bottomTitle: 'দক্ষতা যাচাই করুন', bottomSub: 'নিজের কাজ দেখান আত্মবিশ্বাসে', caption: 'প্র্যাকটিস করুন' },
    { eyebrow: 'আপনার শেখা, আপনার গতিতে', firstLine: 'ছোট ছোট ধাপে,', secondLine: 'পৌঁছে যান বড় লক্ষ্যে।', description: 'নিজের সুবিধামতো শিখুন, পাঠগুলো বারবার দেখুন, আর নিয়মিত অনুশীলনে লক্ষ্যের পথে এগিয়ে যান।', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85', alt: 'শিক্ষার্থীরা একসঙ্গে পড়াশোনা করছেন', proofMain: 'নিজের সময়ে শিখুন', proofSub: 'যেখানেই থাকুন, যখনই চান', cardTitle: 'শেখার স্বাধীনতা', cardSub: 'নিজের গতিতে এগিয়ে চলুন', bottomTitle: 'প্রতিদিন একটু করে', bottomSub: 'অভ্যাসেই আসে অগ্রগতি', caption: 'শেখা চলুক' },
    { eyebrow: 'ক্যারিয়ার গড়ার পরবর্তী ধাপ', firstLine: 'নিজের দক্ষতায়,', secondLine: 'নিজের পরিচয় তৈরি করুন।', description: 'বাস্তব কাজ ও পোর্টফোলিওর মাধ্যমে নতুন সুযোগের জন্য প্রস্তুত হোন, আর নিজের অর্জন তুলে ধরুন।', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85', alt: 'টিম হিসেবে কাজ করছেন পেশাদাররা', proofMain: 'ক্যারিয়ার প্রস্তুতি', proofSub: 'দক্ষতা থেকে সুযোগের পথে', cardTitle: 'পোর্টফোলিও তৈরি', cardSub: 'কাজ দিয়ে নিজের দক্ষতা দেখান', bottomTitle: 'পরবর্তী সুযোগের জন্য', bottomSub: 'প্রস্তুতি শুরু হোক আজই', caption: 'লক্ষ্যে এগিয়ে যান' },
    { eyebrow: 'মেন্টরের সহায়তায় এগিয়ে চলুন', firstLine: 'প্রশ্ন করুন,', secondLine: 'শিখুন আরও আত্মবিশ্বাসে।', description: 'শেখার পথে অভিজ্ঞ মেন্টরের দিকনির্দেশনা নিন, জটিল বিষয় পরিষ্কার করুন, আর নিজের লক্ষ্যে স্থির থাকুন।', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85', alt: 'মেন্টরদের সঙ্গে আলোচনায় শিক্ষার্থীরা', proofMain: 'মেন্টরের দিকনির্দেশনা', proofSub: 'সহায়তা থাকুক শেখার পথে', cardTitle: 'বিশেষজ্ঞ মেন্টর', cardSub: 'প্রতিটি ধাপে পাশে থাকবেন', bottomTitle: 'সহায়তা সবসময়', bottomSub: 'শিখুন নিজের আত্মবিশ্বাসে', caption: 'একসঙ্গে এগিয়ে চলুন' },
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveHero((index) => (index + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const context = gsap.context(() => {
      gsap.from('.hero-bottom', {
        x: 72,
        autoAlpha: 0,
        duration: 0.95,
        ease: 'power3.out',
      });

      gsap.utils
        .toArray(
          '.stats-strip, .section-heading, .why-image, .why-copy, .story-card, .cta > div, .cta > a',
        )
        .forEach((element) => {
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
          শিখাই
        </a>
        <button
          className="mobile-toggle"
          onClick={() => setMobileNav(!mobileNav)}
          aria-label="মেনু"
        >
          <Menu />
        </button>
        <nav className={mobileNav ? 'nav open' : 'nav'}>
          <a href="#home" onClick={() => setMobileNav(false)}>{'হোম'}</a>
          <a href="#courses" onClick={() => setMobileNav(false)}>{'কোর্সমূহ'}</a>
          <a href="#features" onClick={() => setMobileNav(false)}>{'সুবিধা'}</a>
          <a href="#testimonials" onClick={() => setMobileNav(false)}>{'সফলশিক্ষার্থী'}</a>
        </nav>
        <div className="nav-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {user ? (
            <>
              <span className="user-name">{user.name}</span>
              {!isAdmin && (
                <button
                  className="button button-light"
                  onClick={() => navigate('/dashboard')}
                >
                  ড্যাশবোর্ড
                </button>
              )}
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
        <section className="hero" id="home" aria-roledescription="carousel" aria-label="Homepage banners">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <div
            className="hero-carousel-track"
            style={{
              width: `${heroSlides.length * 100}%`,
              transform: `translateX(-${(activeHero * 100) / heroSlides.length}%)`,
            }}
          >
            {heroSlides.map((slide, index) => (
          <div
            className={`hero-inner hero-slide-${index + 1}`}
            style={{ flex: `0 0 ${100 / heroSlides.length}%` }}
            key={slide.image}
          >
            <div className="hero-copy">
              <div className="eyebrow">
                <Sparkles size={15} /> {slide.eyebrow}
              </div>
              <h1>
                {slide.firstLine}<br /><span>{slide.secondLine}</span>
              </h1>
              <p>{slide.description}
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
                  <strong>{slide.proofMain}</strong>
                  <small>{slide.proofSub}</small>
                </div>
                <div className="rating">
                  <b>★ ৪.৯</b>
                  <small>শিক্ষার্থীদের রেটিং</small>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <img
                src={slide.image}
                alt={slide.alt}
              />
              <div className="floating-card card-top">
                <span className="float-icon purple">
                  <BookOpen size={19} />
                </span>
                <div>
                  <b>{slide.cardTitle}</b>
                  <small>{slide.cardSub}</small>
                </div>
              </div>
              <div className="floating-card card-bottom">
                <span className="float-icon green">
                  <Check size={20} />
                </span>
                <div>
                  <b>{slide.bottomTitle}</b>
                  <small>{slide.bottomSub}</small>
                </div>
              </div>
              <div className="visual-caption">
                <span>
                  <span className="live-dot" /> {slide.caption}
                </span>
                <span>● মেন্টর সাপোর্ট</span>
              </div>
            </div>
          </div>
            ))}
          </div>
          <div className="hero-bottom">
            <span>আপনার শেখার যাত্রা শুরু হোক</span>
            <div className="hero-carousel-controls" aria-label="Hero banner controls">
              <button type="button" aria-label="Previous banner" onClick={() => setActiveHero((activeHero + heroSlides.length - 1) % heroSlides.length)}>
                <ChevronLeft size={16} />
              </button>
              {heroSlides.map((slide, index) => (
                <button
                  type="button"
                  className={index === activeHero ? 'hero-dot active' : 'hero-dot'}
                  aria-label={`Show banner ${index + 1}`}
                  aria-current={index === activeHero ? 'true' : undefined}
                  onClick={() => setActiveHero(index)}
                  key={slide.image}
                />
              ))}
              <button type="button" aria-label="Next banner" onClick={() => setActiveHero((activeHero + 1) % heroSlides.length)}>
                <ChevronRight size={16} />
              </button>
            </div>
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
            <div className="course-heading-copy">
              <span className="course-kicker"><BookOpen size={16} /> শেখার জন্য বেছে নিন</span>
              <h2>পছন্দের কোর্স বেছে নিন</h2>
              <p>
                নিজের লক্ষ্যের সঙ্গে মানানসই কোর্স খুঁজে দক্ষতার পরের ধাপে এগিয়ে যান।
              </p>
            </div>
            <div className="course-count">
              <span className="course-count-icon"><GraduationCap size={19} /></span>
              <span><b className="number-display">{formatNumber(courses.length)}</b><small>টি কোর্স</small></span>
            </div>
          </div>
          <div className="course-tools">
            <label className="searchbox">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="কোর্স খুঁজুন..."
                aria-label="কোর্স খুঁজুন"
              />
            </label>
            <div className="filters" role="group" aria-label="কোর্সের বিভাগ">
              {categoryOptions.map((c) => (
                <button
                  className={category === c ? 'filter active' : 'filter'}
                  onClick={() => setCategory(c)}
                  key={c}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="course-results-row" aria-live="polite">
            <span>দেখানো হচ্ছে <b className="number-display">{formatNumber(filteredCourses.length)}</b>টি কোর্স</span>
            {(query || category !== 'সব') && (
              <button className="course-reset" onClick={() => { setQuery(''); setCategory('সব'); }}>
                ফিল্টার মুছুন
              </button>
            )}
          </div>
          <div className="course-grid">
            {filteredCourses.map((c) => (
              <article className="course-card" key={c.id}>
                <div className="course-image">
                  <img src={c.image} alt={c.name} loading="lazy" />
                  <span className="course-category">{c.category}</span>
                </div>
                <div className="course-body">
                  <div className="course-mode-tags" aria-label="কোর্সের ধরন">
                    <span className="course-mode-online"><Monitor size={14} /> অনলাইন</span>
                    <span className="course-mode-offline"><Building2 size={14} /> অফলাইন</span>
                  </div>
                  <h3>
                    <a
                      className="course-title-link"
                      href={`/courses/${c.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(`/courses/${c.id}`);
                      }}
                    >
                      {c.name}
                    </a>
                  </h3>
                  <p>{c.description}</p>
                  <div className="course-info">
                    <span><Clock3 size={15} /> {formatDigits(c.duration)}</span>
                    <span><UsersRound size={15} /> <span className="number-display">{formatNumber(c.students)}</span> শিক্ষার্থী</span>
                  </div>
                  <div className="course-footer">
                    <div className="course-price-options">
                      <div className="course-price-option online">
                        <small>অনলাইন ফি</small>
                        <b>{formatPrice(c.onlinePrice)}</b>
                      </div>
                      <div className="course-price-option offline">
                        <small>অফলাইন ফি</small>
                        <b>{formatPrice(c.offlinePrice)}</b>
                      </div>
                    </div>
                    <button
                      className={
                        enrolledIds.includes(c.id)
                          ? 'course-enroll-button enrolled'
                          : 'course-enroll-button'
                      }
                      onClick={() => onEnroll(c.id)}
                      aria-label={
                        enrolledIds.includes(c.id) ? 'ড্যাশবোর্ডে দেখুন' : 'কোর্সে ভর্তি'
                      }
                    >
                      {enrolledIds.includes(c.id) ? (
                        <>কোর্সে আছেন <Check size={16} /></>
                      ) : (
                        <>ভর্তি হন <ArrowRight size={16} /></>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!filteredCourses.length && (
            <div className="course-empty-state">
              <span><Search size={21} /></span>
              <b>কোনো কোর্স পাওয়া যায়নি</b>
              <p>অন্য শব্দ দিয়ে খুঁজুন অথবা বিভাগ পরিবর্তন করে দেখুন।</p>
            </div>
          )}
        </section>
        <section id="features" className="section why-section">
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
          <div className="why-copy" id="why">
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
        <section id="testimonials" className="section stories-section">
          <div className="center-heading" id="stories">
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
            <p>
              দক্ষতা অর্জনের সহজ পথ। বাস্তব কাজভিত্তিক কোর্স, অভিজ্ঞ মেন্টর আর
              নিয়মিত সহায়তায় নিজের আগামী দিনের ক্যারিয়ার গড়ে তুলুন।
            </p>
            <a className="footer-contact-cta" href="mailto:info@sikhai.thelegendit.com">
              <Mail size={15} /> আমাদের সঙ্গে কথা বলুন <ArrowRight size={14} />
            </a>
          </div>
          <div className="footer-column">
            <b>শিখাই সম্পর্কে</b>
            <a href="#why">আমাদের সম্পর্কে</a>
            <a href="#features">কেন শিখাই</a>
            <a href="#stories">শিক্ষার্থীদের গল্প</a>
            <a href="#courses">সব কোর্স দেখুন</a>
          </div>
          <div className="footer-column">
            <b>জনপ্রিয় বিভাগ</b>
            {['ডেভেলপমেন্ট', 'ডিজাইন', 'মার্কেটিং', 'ভাষা'].map((item) => (
              <a
                href="#courses"
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="footer-column footer-contact">
            <b>যোগাযোগ করুন</b>
            <a href="tel:+8801925251125"><Phone size={15} /> <span>০১৯২৫২৫১১২৫</span></a>
            <a href="mailto:info@sikhai.thelegendit.com"><Mail size={15} /> <span>info@sikhai.thelegendit.com</span></a>
            <span>
              <MapPin size={15} />
              <span>আইসিটি টাওয়ার, ই-১৪/এক্স, আগারগাঁও, ঢাকা-১২০৭</span>
            </span>
            <small>কোর্স বা ভর্তি বিষয়ে জানতে যোগাযোগ করুন।</small>
          </div>
          <div className="footer-column footer-account">
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
          <span className="footer-copyright">
            © {new Date().getFullYear()} শিখাই। সর্বস্বত্ব সংরক্ষিত। <i>•</i> বাংলাদেশে তৈরি, ভালোবাসা দিয়ে
          </span>
        </div>
      </footer>
    </>
  );
}
