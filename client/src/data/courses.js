const starterCourses = [
  {
    id: 1,
    name: 'জেনারেল কম্পিউটার',
    category: 'দক্ষতা',
    onlinePrice: 2100,
    offlinePrice: 3500,
    duration: '২ মাস',
    students: 15,
    description:
      'কম্পিউটার, MS Office, ইন্টারনেট ও ইমেইল ব্যবহারের প্রয়োজনীয় দক্ষতা শিখুন।',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'ডিজিটাল মার্কেটিং',
    category: 'মার্কেটিং',
    onlinePrice: 2200,
    offlinePrice: 4000,
    duration: '২ মাস',
    students: 15,
    description: 'SEO, সোশ্যাল মিডিয়া, বিজ্ঞাপন ও কনটেন্ট মার্কেটিং হাতে-কলমে শিখুন।',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'UI/UX ডিজাইন',
    category: 'ডিজাইন',
    onlinePrice: 2500,
    offlinePrice: 5000,
    duration: '২.৫ মাস',
    students: 15,
    description:
      'Figma দিয়ে ব্যবহারবান্ধব ইন্টারফেস, ওয়্যারফ্রেম ও প্রোটোটাইপ তৈরি শিখুন।',
    image:
      'https://images.unsplash.com/photo-156ず?auto=format&fit=crop&w=900&q=80'.replace(
        '156ず',
        '1561070791-2526d30994b5',
      ),
  },
  {
    id: 4,
    name: 'ওয়েব ডেভেলপমেন্ট',
    category: 'ডেভেলপমেন্ট',
    onlinePrice: 4000,
    offlinePrice: 7000,
    duration: '৩ মাস',
    students: 15,
    description: 'HTML, CSS, JavaScript ও React দিয়ে আধুনিক ওয়েবসাইট তৈরি করুন।',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'স্পোকেন ইংলিশ',
    category: 'ভাষা',
    onlinePrice: 1800,
    offlinePrice: 3000,
    duration: '২ মাস',
    students: 15,
    description: 'আত্মবিশ্বাসের সঙ্গে ইংরেজিতে কথা বলা ও কর্মক্ষেত্রে যোগাযোগ শিখুন।',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdeb277a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'গ্রাফিক ডিজাইন',
    category: 'ডিজাইন',
    onlinePrice: 2800,
    offlinePrice: 5000,
    duration: '৩ মাস',
    students: 15,
    description: 'Photoshop ও Illustrator দিয়ে ব্র্যান্ডিং এবং সৃজনশীল ডিজাইন শিখুন।',
    image:
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'ভিডিও এডিটিং',
    category: 'ডিজাইন',
    onlinePrice: 2600,
    offlinePrice: 4500,
    duration: '২ মাস',
    students: 15,
    description: 'ভিডিও সম্পাদনা, গল্প বলা, অডিও ও মোশন গ্রাফিক্সের ভিত্তি শিখুন।',
    image:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'মোবাইল অ্যাপ ডেভেলপমেন্ট',
    category: 'ডেভেলপমেন্ট',
    onlinePrice: 4500,
    offlinePrice: 7500,
    duration: '৪ মাস',
    students: 15,
    description: 'আধুনিক মোবাইল অ্যাপের নকশা, নির্মাণ ও প্রকাশের ধাপগুলো শিখুন।',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 9,
    name: 'ওয়ার্ডপ্রেস',
    category: 'ডেভেলপমেন্ট',
    onlinePrice: 2200,
    offlinePrice: 4000,
    duration: '২ মাস',
    students: 15,
    description: 'কোড ছাড়াই WordPress দিয়ে ওয়েবসাইট ও অনলাইন স্টোর তৈরি করুন।',
    image:
      'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 10,
    name: 'সফটওয়্যার ডেভেলপমেন্ট',
    category: 'ডেভেলপমেন্ট',
    onlinePrice: 5000,
    offlinePrice: 8500,
    duration: '৪ মাস',
    students: 15,
    description: 'প্রোগ্রামিং, ডেটাবেস ও বাস্তব প্রজেক্টের মাধ্যমে সফটওয়্যার তৈরি শিখুন।',
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 11,
    name: 'সোশ্যাল মিডিয়া ডিজাইন',
    category: 'ডিজাইন',
    onlinePrice: 2400,
    offlinePrice: 4200,
    duration: '২ মাস',
    students: 15,
    description: 'সামাজিক যোগাযোগমাধ্যমের জন্য আকর্ষণীয় ভিজ্যুয়াল ও কনটেন্ট তৈরি করুন।',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 12,
    name: 'ইভেন্ট ম্যানেজমেন্ট',
    category: 'ম্যানেজমেন্ট',
    onlinePrice: 4000,
    offlinePrice: 7500,
    duration: '২ মাস',
    students: 15,
    description: 'ইভেন্ট পরিকল্পনা, বাজেট, প্রচারণা ও পরিচালনার দক্ষতা অর্জন করুন।',
    image:
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80',
  },
];

export { starterCourses };
