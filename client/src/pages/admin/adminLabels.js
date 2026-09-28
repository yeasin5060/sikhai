const categoryLabels = {
  ডেভেলপমেন্ট: 'উন্নয়ন',
  মার্কেটিং: 'বিপণন',
  ম্যানেজমেন্ট: 'ব্যবস্থাপনা',
};

export const formatAdminCategory = (category) => categoryLabels[category] || category;
