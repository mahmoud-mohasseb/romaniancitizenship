export const CATEGORIES_LIST = [
  {
    id: 'all',
    name_ar: 'الكل (جميع الأسئلة)',
    name_ro: 'Toate Întrebările',
    name_en: 'All Questions',
    icon: 'apps-outline',
    color: '#E94560',
    description_ar: 'جميع أسئلة ومواضيع امتحان الجنسية الرومانية الشاملة (469 سؤالاً مصوراً).',
    description_en: 'Comprehensive dataset of all 469 visual Romanian citizenship questions.',
    description_ro: 'Set complet de 469 de întrebări ilustrate pentru examenul de cetățenie română.',
    key_facts_ar: ['يغطي جميع الفئات: الدستور، التاريخ، الجغرافيا، الثقافة، والمحادثة.'],
    key_facts_en: ['Covers all official ANC interview categories.'],
  },
  {
    id: 'constitution',
    name_ar: 'الدستور والنظام السياسي',
    name_ro: 'Constituție și Guvern',
    name_en: 'Constitution & Government',
    icon: 'shield-checkmark-outline',
    color: '#4ECCA3',
    description_ar: 'شرح مبادئ الدستور الروماني، طبيعة الدولة، وسلطاتها الثلاث (التشريعية، التنفيذية، القضائية) ودور رئيس الجمهورية والبرلمان والمحكمة الدستورية.',
    description_en: 'Constitutional principles, state sovereignty, separation of powers, and institutional roles of President, Parliament, Government & Constitutional Court.',
    description_ro: 'Principiile constituționale, suveranitatea statului, separația puterilor și rolul instituțiilor publice.',
    key_facts_ar: [
      'المادة 1: رومانيا دولة موحدة، سيادية، مستقلة، وجمهورية نيايبة ديمقراطية.',
      'السلطات الثلاث: التشريعية (البرلمان)، التنفيذية (الحكومة والرئيس)، القضائية (المحاكم).',
      'البرلمان (Parlamentul) يتكون من مجلسين: مجلس النواب (Camera Deputaților) ومجلس الشيوخ (Senatul).',
      'رئيس الجمهورية (Președintele): يمثل الدولة ويضمن الاستقلال الوطني وسلامة الأراضي والمداولة بين السلطات.',
      'المحكمة الدستورية (Curtea Constituțională): تضمن دستورية القوانين وتتكون من 9 القضاة لمدة 9 سنوات.'
    ],
    key_facts_en: [
      'Art. 1: Romania is a national, sovereign, independent, unitary and indivisible state.',
      'Separation of Powers: Legislative (Parliament), Executive (Government & President), Judicial (Courts of Law).',
      'Bicameral Parliament: Chamber of Deputies (Camera Deputaților) and Senate (Senatul).',
      'President of Romania: Represents the state, guarantees national independence & territorial integrity.',
      'Constitutional Court: Ensures constitutionality of laws (9 judges appointed for 9 years).'
    ],
    key_facts_ro: [
      'Art. 1: România este stat național, suveran și independent, unitar și indivizibil.',
      'Separația puterilor: legislativă, executivă și judecătorească.',
      'Parlamentul este bicameral: Camera Deputaților și Senatul.'
    ]
  },
  {
    id: 'history',
    name_ar: 'التاريخ والشخصيات التاريخية',
    name_ro: 'Istorie și Personalități',
    name_en: 'History & Historic Figures',
    icon: 'hourglass-outline',
    color: '#E94560',
    description_ar: 'محطات تاريخ رومانيا العريق: نشأة الشعب الروماني (الداسيون والرومان)، الإمارات التاريخية الثلاث، الوحدة الكبرى 1918، العهد الملكي، والعهد الحديث.',
    description_en: 'Key historical eras: Daco-Roman ethnogenesis, medieval principalities (Wallachia, Moldavia, Transylvania), 1918 Great Union, monarchy & modern era.',
    description_ro: 'Etapele istorice fundamentale: etnogeneza daco-romană, voievodatele medievale, Marea Unire din 1918 și România modernă.',
    key_facts_ar: [
      'نشأة الشعب الروماني (Etnogeneza): الاندماج بين الداسيين (Dacii) بقيادة ديشيبال والرومان (Romanii) بقيادة الإمبراطور ترايان.',
      'الإمارات التاريخية الثلاث: فالاهيا / Țara Românească، مولدوفا / Moldova، وترانسيلفانيا / Transilvania.',
      'الوحدة الكبرى (Marea Unire): 1 ديسمبر 1918 في مدينة ألبا يوليا (Alba Iulia) وهو اليوم الوطني لرومانيا.',
      'الملوك العظام: الملك كارول الأول (Carol I - استقلال رومانيا 1877) والملك فرديناند الأول (Ferdinand I - الوحدة الكبرى 1918).',
      'ثورة ديسمبر 1989: إنهاء النظام الشيوعي والتحول إلى الديمقراطية والتعددية الحزبية.'
    ],
    key_facts_en: [
      'Ethnogenesis: Fusion of Dacians (Decebalus) and Romans (Trajan) after the Dacian wars.',
      'Three Historic Principalities: Wallachia (Țara Românească), Moldavia (Moldova), and Transylvania (Transilvania).',
      'Great Union (Marea Unire): 1 December 1918 at Alba Iulia (National Day of Romania).',
      'Great Monarchs: King Carol I (Independence 1877) and King Ferdinand I (Unification 1918).',
      '1989 Revolution: End of Communist regime and transition to constitutional democracy.'
    ],
    key_facts_ro: [
      'Etnogeneza: fuziunea dintre daci (Decebal) și romani (Traian).',
      'Cele 3 principate: Țara Românească, Moldova și Transilvania.',
      'Marea Unire de la 1 Decembrie 1918 de la Alba Iulia (Ziua Națională).'
    ]
  },
  {
    id: 'geography',
    name_ar: 'الجغرافيا والتضاريس والتنظيم الإداري',
    name_ro: 'Geografie și Organizare Administrativă',
    name_en: 'Geography & Administrative Structure',
    icon: 'earth-outline',
    color: '#38EF7D',
    description_ar: 'طبيعة رومانيا الجغرافية: التضاريس المتوازنة (جبال، تلال، سهول)، نهر الدانوب والدلتا، أعلى القمم المجهدة، والتقسيم الإداري لـ 41 مقاطعة والعاصمة بوخارست.',
    description_en: 'Geographical landscape: balanced relief (31% Mountains, 36% Hills/Plateaus, 33% Plains), Danube River & Delta, highest peaks, and 41 counties + Bucharest.',
    description_ro: 'Relieful proporționat, fluviul Dunărea, Delta Dunării, Carpații și organizarea administrativă în 41 de județe și municipiul București.',
    key_facts_ar: [
      'تضاريس متوازنة متناسبة: 31% جبال الكاربات (Carpații)، 36% تلال وهضاب، 33% سهول منخفضة.',
      'أعلى قمة جبلية: قمة مولدوفيانو (Vârful Moldoveanu) بارتفاع 2,544 متراً في جبال فاغاراش.',
      'نهر الدانوب (Dunărea): يمتد مسافة 1,075 كم داخل رومانيا ويصب في البحر الأسود مشكلاً دلتا الدانوب (محمية اليونسكو العالمية).',
      'التقسيم الإداري: تتكون رومانيا من 41 مقاطعة (Județe) بالإضافة إلى بلدية بوخارست العاصمة (Municipiul București).',
      'الحدود الجغرافية المجاورة: أوكرانيا (شمال وشرق)، مولدوفا (شرق)، بلغاريا (جنوب)، صربيا (جنوب غرب)، والمجر / المجر (غرب).'
    ],
    key_facts_en: [
      'Balanced Relief: 31% Carpathian Mountains, 36% Hills/Plateaus, 33% Plains.',
      'Highest Peak: Moldoveanu Peak (Vârful Moldoveanu) at 2,544 meters in Făgăraș Mountains.',
      'Danube River (Dunărea): Flows 1,075 km along Romania into Black Sea forming Danube Delta (UNESCO World Heritage Site).',
      'Administrative Divisions: 41 Counties (Județe) plus Bucharest Capital Municipality.',
      'Neighboring Countries: Ukraine (North/East), Moldova (East), Bulgaria (South), Serbia (South-West), Hungary (West).'
    ],
    key_facts_ro: [
      'Relief proporționat: 31% munți, 36% dealuri/podișuri, 33% câmpii.',
      'Cel mai înalt vârf: Vârful Moldoveanu (2544 m).',
      'Organizare: 41 de județe și municipiul București.'
    ]
  },
  {
    id: 'culture',
    name_ar: 'الثقافة والرموز الوطنية والأدب',
    name_ro: 'Cultură, Simboluri Naționale și Artă',
    name_en: 'Culture, National Symbols & Art',
    icon: 'color-palette-outline',
    color: '#FFB800',
    description_ar: 'الرموز الوطنية الرومانية (العلم، الشعار، النشيد الوطني)، ألمع رواد الأدب والفن والموسيقى والرياضة، وعواصم الثقافة الأوروبية.',
    description_en: 'National symbols (Flag, Anthem, Coat of Arms), national language, renowned literary & artistic icons (Eminescu, Enescu, Brâncuși), and cultural heritage.',
    description_ro: 'Simbolurile naționale (Drapelul, Imnul, Stema), limba oficială și marile personalități culturale și artistice ale României.',
    key_facts_ar: [
      'العلم الوطني (Drapelul): ثلاثة ألوان رأسية متساوية: الأزرق (الأزرق الداكن)، الأصفر، والأحمر.',
      'النشيد الوطني (Imnul Național): "استيقظ أيها الروماني" (Deșteaptă-te, române!) كلمات أندريه موريشيانو.',
      'شاعر رومانيا الوطني: ميهاي إمينيسكو (Mihai Eminescu) - أمير الشعر الروماني.',
      'رواد الفن والموسيقى: الموسيقار جورجي إينيسكو (George Enescu)، والناحت العالمي قسطنطين برانكوشي (Constantin Brâncuși).',
      'عواصم الثقافة الأوروبية: مدينة سيبيلو / سيبيو (Sibiu 2007) ومدينة تيميشوارا (Timișoara 2023).'
    ],
    key_facts_en: [
      'Tricolor Flag (Drapelul): Blue, Yellow, Red vertical stripes.',
      'National Anthem: "Deșteaptă-te, române!" (Awaken, Romanian!), lyrics by Andrei Mureșanu.',
      'National Poet: Mihai Eminescu (1850–1889).',
      'Artistic Giants: Composer George Enescu, modern sculptor Constantin Brâncuși.',
      'European Capitals of Culture: Sibiu (2007) and Timișoara (2023).'
    ],
    key_facts_ro: [
      'Drapelul tricolor: Albastru, Galben, Roșu.',
      'Imnul național: Deșteaptă-te, române!',
      'Poetul național: Mihai Eminescu.'
    ]
  },
  {
    id: 'general',
    name_ar: 'اللغة الرومانية والمعلومات العامة',
    name_ro: 'Limbă și Cultură Generală',
    name_en: 'Romanian Language & General Knowledge',
    icon: 'help-buoy-outline',
    color: '#9B51E0',
    description_ar: 'خصائص اللغة الرومانية اللاتينية، قواعد التواصل اليومية في المقابلة، الانضمام للاتحاد الأوروبي وحلف الناتو، والتداول بالعملة الوطنية (الليو).',
    description_en: 'Romanian Romance language fundamentals, daily conversational expressions, EU/NATO integration, and currency (Leu / RON).',
    description_ro: 'Fundamentele limbii române latine, expresii uzuale, integrarea europeană și moneda națională.',
    key_facts_ar: [
      'اللغة الرسمية: اللغة الرومانية (Limba Română) وهي لغة لاتينية رومانسيّة مشتقة مباشرة من اللاتينية الشعبية.',
      'العضوية الدولية: انضمت رومانيا لحلف الناتو (NATO 2004) وللاتحاد الأوروبي (EU 2007).',
      'العملة الوطنية: الليو الروماني (Leu / RON) والفرعي هو البان (Ban).',
      'العاصمة وأكبر مدينة: بوخارست (București) وهي المركز السياسي والاقتصادي والثقافي الرئيسي.'
    ],
    key_facts_en: [
      'Official Language: Romanian (Limba Română), a Romance language with direct Latin roots.',
      'International Alliances: Joined NATO (2004) and the European Union (2007).',
      'National Currency: Romanian Leu (RON), sub-unit Ban.',
      'Capital & Largest City: Bucharest (București).'
    ],
    key_facts_ro: [
      'Limba oficială: Limba Română (origine latină).',
      'Moneda națională: Leu (RON).',
      'Membru NATO (2004) și UE (2007).'
    ]
  },
];

export const getCategoryMeta = (categoryId) => {
  const cat = CATEGORIES_LIST.find((c) => c.id === categoryId);
  return cat || CATEGORIES_LIST[0];
};
