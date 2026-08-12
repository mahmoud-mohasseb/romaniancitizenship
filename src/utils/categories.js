export const CATEGORIES_LIST = [
  {
    id: 'all',
    name_ar: 'الكل',
    name_ro: 'Toate',
    name_en: 'All Questions',
    icon: 'apps-outline',
    color: '#E94560',
  },
  {
    id: 'constitution',
    name_ar: 'الدستور والحكومة',
    name_ro: 'Constituție și Guvern',
    name_en: 'Constitution & Law',
    icon: 'shield-checkmark-outline',
    color: '#4ECCA3',
  },
  {
    id: 'history',
    name_ar: 'التاريخ والشخصيات',
    name_ro: 'Istorie și Personalități',
    name_en: 'History & Figures',
    icon: 'hourglass-outline',
    color: '#E94560',
  },
  {
    id: 'geography',
    name_ar: 'الجغرافيا والطبيعة',
    name_ro: 'Geografie și Natură',
    name_en: 'Geography & Nature',
    icon: 'earth-outline',
    color: '#38EF7D',
  },
  {
    id: 'culture',
    name_ar: 'الثقافة والأدب',
    name_ro: 'Cultură și Artă',
    name_en: 'Culture & Literature',
    icon: 'color-palette-outline',
    color: '#FFB800',
  },
  {
    id: 'general',
    name_ar: 'معلومات عامة واللغة',
    name_ro: 'Limbă și Cultură Generală',
    name_en: 'Language & General',
    icon: 'help-buoy-outline',
    color: '#9B51E0',
  },
];

export const getCategoryMeta = (categoryId) => {
  const cat = CATEGORIES_LIST.find((c) => c.id === categoryId);
  return cat || CATEGORIES_LIST[0];
};
