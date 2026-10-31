import type {
  Article, CommunityPost, StoryReel, TopicStory, UpcomingEvent, TrendingRankedItem,
  FeaturedScientist, ResearchPaper, NotificationItem,
} from '../types';

export const img = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`;

export const PHOTOS = {
  hutPaddy: '1642832520839-a30ac9bcadd9',
  farmerField: '1610560875826-af5b05a96cfa',
  greenField: '1634962458589-30d58befcab2',
  plantingRice: '1558289282-647de9fdf608',
  basketFarmer: '1607710577593-5c806a0dc7b9',
  riceStand: '1684691583342-0dfafc6942cf',
  cowsUmbrella: '1731010228077-6aa0c7b69cb7',
  groupField: '1671357573289-de5400716e27',
  sunsetRows: '1560493676-04071c5f467b',
  tractorSpray: '1656407410275-e63e689bcd90',
  sprayers: '1627920769541-daa658ed6b59',
  aerialField: '1508175688576-0c076b47b5b5',
  soilHands: '1590682680695-43b964a3ae17',
  seedlings: '1611843467160-25afb8df1074',
  plantHand: '1615671524827-c1fe3973b648',
  greenhouse: '1708796705570-33fd29ef67d0',
  hydroFrame: '1591754060004-f91c95f5cf05',
  strawberry: '1759509295194-e85b92b24e15',
  onions: '1683355739329-cea18ba93f02',
  onionLot: '1467019972079-a273e1bc9173',
  fish: '1782813948030-255aaee9aae9',
  boatSunset: '1580536009789-cf3d04da0fb6',
  petri: '1631557676757-fcc7b1160be8',
  labPlants: '1475906089153-644d9452ce87',
  solar: '1509391366360-2e959784a276',
  solarGrass: '1629726797843-618688139f5a',
};

export const AVATARS = {
  hasan: img('1762709412730-321a0d81b517', 160, 160),
  nusrat: img('1791975136835-62058ef4a51e', 160, 160),
  mehedi: img('1784483323534-3460c079d0c1', 160, 160),
  anas: img('1779231127295-0da8742add83', 160, 160),
  rajib: img('1667530611175-4e12687bd337', 160, 160),
};

export const CURRENT_USER = {
  name: 'Hasan Zubair',
  nameBn: 'হাসান জুবায়ের',
  avatar: AVATARS.hasan,
  role: 'কৃষি প্রকৌশলী · BAU',
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'হাওরের আগাম বন্যা ও ব্রি-১০২: জিংকসমৃদ্ধ ধানের নতুন বিপ্লব',
    subtitle: 'আগাম ঢলের আগেই ঘরে উঠছে ফসল — আর প্রতি কেজি চালে মিলছে ২৫.৫ মিলিগ্রাম জিংক। কীভাবে বদলে যাচ্ছে সুনামগঞ্জের কৃষকের হিসাব।',
    category: 'শস্য ও কৃষিবিজ্ঞান',
    categoryEn: 'Crops & Agronomy',
    imageType: 'floating',
    author: { name: 'ড. ফারহানা ইয়াসমিন', designation: 'প্রধান বৈজ্ঞানিক কর্মকর্তা', organization: 'BRRI, গাজীপুর', avatar: 'ফই' },
    publishedAt: '১২ নভেম্বর ২০২৫',
    readTimeMinutes: 7,
    featured: true,
    content: [
      'প্রতি বছর এপ্রিলের শুরুতে মেঘালয়ের পাহাড়ি ঢল যখন হাওরে নামে, তখন সুনামগঞ্জ, নেত্রকোনা আর কিশোরগঞ্জের লাখো কৃষকের বোরো ধান থাকে মাঠে — কাটার অপেক্ষায়। মাত্র সাত থেকে দশ দিনের ব্যবধানে পুরো মৌসুমের পরিশ্রম পানির নিচে চলে যায়।',
      'বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (ব্রি) উদ্ভাবিত ব্রি ধান১০২ এই সমীকরণটাই উল্টে দিচ্ছে। জাতটির জীবনকাল ১৪৮–১৫০ দিন, যা প্রচলিত ব্রি ধান২৯-এর চেয়ে প্রায় এক সপ্তাহ কম। ফলে আগাম ঢলের আগেই ফসল কাটা সম্ভব হচ্ছে।',
      'তবে আসল চমক পুষ্টিতে। ব্রি ধান১০২-এর প্রতি কেজি চালে জিংকের পরিমাণ ২৫.৫ মিলিগ্রাম — বাংলাদেশে শিশুদের খর্বাকৃতি ও রোগপ্রতিরোধ ক্ষমতা হ্রাসের অন্যতম কারণ যে জিংক ঘাটতি, তার বিরুদ্ধে এটি একটি নীরব প্রতিরোধ।',
      'ধর্মপাশা উপজেলার কৃষক আব্দুল কাদির গত মৌসুমে দুই বিঘায় জাতটি চাষ করেছেন। তাঁর ভাষায়, "ঢল আসার চার দিন আগে ধান কেটে খলায় তুলেছি। পাশের জমির ব্রি২৯ অর্ধেক পানিতে ডুবেছিল।" হেক্টরপ্রতি তাঁর ফলন দাঁড়িয়েছে ৭.৮ টন।',
      'গবেষকরা বলছেন, বীজ সরবরাহ শৃঙ্খল এখনো বড় চ্যালেঞ্জ। বিএডিসি ও বেসরকারি বীজ কোম্পানির সমন্বয়ে আগামী মৌসুমে হাওরাঞ্চলে অন্তত ১,২০০ টন প্রত্যয়িত বীজ পৌঁছানোর লক্ষ্য নেওয়া হয়েছে।',
    ],
    takeaways: [
      'জীবনকাল ১৪৮–১৫০ দিন — আগাম ঢলের আগেই কাটা সম্ভব',
      'প্রতি কেজি চালে ২৫.৫ মি.গ্রা. জিংক, শিশুপুষ্টিতে সরাসরি প্রভাব',
      'হেক্টরপ্রতি গড় ফলন ৭.৫–৮.০ টন',
    ],
    researchBasis: { journalOrInst: 'BRRI Annual Research Review 2024', doiOrSource: 'brri.gov.bd/arr-2024/ch3', keyMetric: 'Zn 25.5 mg/kg' },
    stats: { views: 18420, likes: 1284, commentsCount: 96, shares: 312 },
    comments: [
      { id: 'c1', author: 'রাশেদুল ইসলাম', avatar: 'রই', role: 'উপসহকারী কৃষি কর্মকর্তা, ধর্মপাশা', text: 'আমাদের ব্লকে ৪০ জন কৃষক এবার ব্রি১০২ নিয়েছেন। বীজের সংকট না থাকলে আরও বেশি হতো।', timestamp: '২ ঘণ্টা', likes: 34 },
      { id: 'c2', author: 'সাদিয়া আফরিন', avatar: 'সআ', role: 'পুষ্টিবিদ, icddr,b', text: 'জিংক বায়োফর্টিফিকেশনের এমন সহজ ব্যাখ্যা খুব দরকার ছিল। ধন্যবাদ।', timestamp: '৫ ঘণ্টা', likes: 18 },
    ],
  },
  {
    id: 'a2',
    title: 'মাটির পুষ্টি ও ড্রোন সেন্সিং: নাইট্রোজেনের অপচয় রোধে ১৮% সাশ্রয়',
    subtitle: 'মাল্টিস্পেকট্রাল ড্রোন দিয়ে পাতার রং পড়ে ইউরিয়া প্রয়োগ — দিনাজপুরের তিন মৌসুমের মাঠ পরীক্ষার ফলাফল।',
    category: 'এগ্রি-টেক ও ড্রোন',
    categoryEn: 'Agri-Tech & Drones',
    imageType: 'drone',
    author: { name: 'তানভীর আহমেদ', designation: 'প্রিসিশন এগ্রিকালচার গবেষক', organization: 'BAU, ময়মনসিংহ', avatar: 'তআ' },
    publishedAt: '৯ নভেম্বর ২০২৫',
    readTimeMinutes: 6,
    content: [
      'বাংলাদেশের কৃষক গড়ে প্রয়োজনের চেয়ে ২০–৩০ শতাংশ বেশি ইউরিয়া প্রয়োগ করেন। এর একটি বড় অংশ গ্যাস হয়ে বাতাসে মেশে বা চুইয়ে ভূগর্ভস্থ পানিতে যায়।',
      'দিনাজপুরের বিরল উপজেলায় তিন মৌসুম ধরে চালানো পরীক্ষায় মাল্টিস্পেকট্রাল ড্রোন দিয়ে NDVI ও NDRE সূচক মেপে প্লটভিত্তিক ইউরিয়া প্রয়োগ করা হয়েছে। ফলাফল: ফলন অপরিবর্তিত রেখে নাইট্রোজেন ব্যবহার কমেছে ১৮ শতাংশ।',
      'একটি ড্রোন দিনে ৪০ হেক্টর পর্যন্ত জরিপ করতে পারে। সেবা-ভিত্তিক মডেলে বিঘাপ্রতি খরচ পড়ছে ১২০ টাকা — যা সাশ্রয় হওয়া সারের দামের চেয়ে অনেক কম।',
    ],
    takeaways: ['ইউরিয়া ব্যবহার ১৮% কম, ফলন অপরিবর্তিত', 'বিঘাপ্রতি জরিপ খরচ মাত্র ১২০ টাকা', 'লিফ কালার চার্টের সাথে ৯২% মিল'],
    researchBasis: { journalOrInst: 'Precision Agriculture (Springer)', doiOrSource: 'doi:10.1007/s11119-024-10132', keyMetric: 'N −18%' },
    stats: { views: 9640, likes: 742, commentsCount: 41, shares: 158 },
    comments: [
      { id: 'c3', author: 'মোস্তফা কামাল', avatar: 'মক', role: 'ড্রোন সার্ভিস উদ্যোক্তা', text: 'আমরা ঠাকুরগাঁওয়ে একই মডেল চালাচ্ছি। কৃষকের আস্থা পেতে প্রথম মৌসুমটাই কঠিন।', timestamp: '১ দিন', likes: 22 },
    ],
  },
  {
    id: 'a3',
    title: 'সৌরচালিত কোল্ড চেম্বার: পাবনার পেঁয়াজ চাষিদের পোস্ট-হার্ভেস্ট বিপ্লব',
    subtitle: 'ছয় মাস সংরক্ষণে পচন ৩৫% থেকে নেমে ৮%-এ। সুজানগরের কৃষক সমবায় এখন দামের অপেক্ষায় বিক্রি করতে পারছে।',
    category: 'খাদ্য ও কোল্ড চেইন',
    categoryEn: 'Food Cold Chain',
    imageType: 'solar',
    author: { name: 'নাজমুল হুদা', designation: 'পোস্ট-হার্ভেস্ট প্রকৌশলী', organization: 'BARI, পাবনা', avatar: 'নহ' },
    publishedAt: '৬ নভেম্বর ২০২৫',
    readTimeMinutes: 5,
    content: [
      'দেশের মোট পেঁয়াজের প্রায় এক-তৃতীয়াংশ আসে পাবনা থেকে। অথচ ঘরোয়া মাচায় রাখা পেঁয়াজের ৩০–৩৫ শতাংশ ছয় মাসের মধ্যে পচে বা শুকিয়ে যায়।',
      'সুজানগরে বসানো ১০ টন ধারণক্ষমতার সৌরচালিত কোল্ড চেম্বারে তাপমাত্রা ও আর্দ্রতা সেন্সর-নিয়ন্ত্রিত। ছয় মাসে ক্ষতি নেমেছে ৮ শতাংশে।',
    ],
    takeaways: ['সংরক্ষণ ক্ষতি ৩৫% → ৮%', '১০ টন ক্ষমতা, গ্রিড-নিরপেক্ষ', 'সমবায় মডেলে প্রতি কৃষকের খরচ কেজিপ্রতি ১.৫ টাকা'],
    researchBasis: { journalOrInst: 'BARI Post-Harvest Division', doiOrSource: 'bari.gov.bd/phd/2025-07', keyMetric: 'Loss 8%' },
    stats: { views: 7310, likes: 603, commentsCount: 28, shares: 201 },
    comments: [],
  },
  {
    id: 'a4',
    title: 'লবণাক্ত উপকূলে কাঁকড়া ও তেলাপিয়া: সমন্বিত চাষে আয় দ্বিগুণ',
    subtitle: 'সাতক্ষীরার শ্যামনগরে বায়োফ্লক ও খাঁচা পদ্ধতির মিশ্র মডেল।',
    category: 'মৎস্য ও প্রাণিসম্পদ',
    categoryEn: 'Fisheries & Livestock',
    imageType: 'fisheries',
    author: { name: 'ড. মাহবুবা খাতুন', designation: 'অধ্যাপক, অ্যাকুয়াকালচার বিভাগ', organization: 'SAU, ঢাকা', avatar: 'মখ' },
    publishedAt: '৩ নভেম্বর ২০২৫',
    readTimeMinutes: 4,
    content: [
      'ঘূর্ণিঝড় আইলার পর থেকে শ্যামনগরের জমিতে লবণাক্ততা আর কমেনি। ধানের বদলে এখন সেখানে লবণসহিষ্ণু তেলাপিয়া আর নরম খোসার কাঁকড়ার সমন্বিত চাষ।',
      'পরীক্ষামূলক ২৪টি ঘেরে গড় নিট আয় বিঘাপ্রতি ৬৮,০০০ টাকা, যা একক চিংড়ি চাষের প্রায় দ্বিগুণ।',
    ],
    takeaways: ['বিঘাপ্রতি নিট আয় ৬৮,০০০ টাকা', '১৫ পিপিটি লবণাক্ততায় টেকসই', 'রোগ সংক্রমণ ৪০% কম'],
    stats: { views: 5120, likes: 388, commentsCount: 19, shares: 77 },
    comments: [],
  },
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    author: { name: 'Mehedi Hasan', avatar: AVATARS.mehedi, role: 'IoT Researcher · BAU', isVerified: true },
    timestamp: '৩ ঘণ্টা',
    content:
      'আজ ময়মনসিংহের ত্রিশাল ফিল্ড স্টেশনে আমাদের IoT মাটির আর্দ্রতা সেন্সর প্রকল্পের দ্বিতীয় ধাপ সম্পন্ন হলো। ১২টি প্লটে LoRaWAN নোড বসানো হয়েছে — প্রতি ১৫ মিনিটে ১০, ৩০ ও ৬০ সেমি গভীরতার আর্দ্রতা ডেটা সরাসরি কৃষকের মোবাইলে যাচ্ছে।\n\nপ্রথম মাসের ফলাফলে দেখা যাচ্ছে, AWD (পর্যায়ক্রমে ভেজানো ও শুকানো) পদ্ধতির সাথে সেন্সর অ্যালার্ট মিলিয়ে সেচের পানি ২৬% কম লাগছে। কৃষক ভাইদের সবচেয়ে বেশি পছন্দ হয়েছে বাংলা ভয়েস অ্যালার্ট — "জমিতে এখন পানি দিন।"\n\nপরের ধাপে আমরা সৌরচালিত পাম্পের সাথে স্বয়ংক্রিয় সংযোগ পরীক্ষা করব। যারা রংপুর বা দিনাজপুরে পাইলট করতে আগ্রহী, কমেন্টে জানান। 🌱',
    images: [img(PHOTOS.soilHands, 900, 900), img(PHOTOS.plantingRice, 600, 600), img(PHOTOS.riceStand, 600, 600), img(PHOTOS.seedlings), img(PHOTOS.greenField), img(PHOTOS.groupField)],
    stats: { likes: 87, commentsCount: 23, shares: 12 },
    reactionsSummary: 'Sijan Rahman and 86 others',
    comments: [
      { id: 'pc1', author: 'Sijan Rahman', avatar: 'SR', role: 'Agri Engineer', text: 'নোডপ্রতি খরচ কত পড়ছে ভাই? ব্যাটারি লাইফ কেমন?', timestamp: '২ ঘণ্টা', likes: 6 },
      { id: 'pc2', author: 'Mehedi Hasan', avatar: AVATARS.mehedi, role: 'IoT Researcher · BAU', text: 'নোডপ্রতি প্রায় ৪,৮০০ টাকা। সোলার প্যানেলসহ ব্যাটারি টানা ৯ মাস চলছে।', timestamp: '১ ঘণ্টা', likes: 9 },
    ],
  },
  {
    id: 'p2',
    author: { name: 'AL Amin Nur', avatar: 'AN', role: 'Student · Agricultural Engineering, HSTU' },
    timestamp: '৫ ঘণ্টা',
    content: 'স্যারের এই কথাগুলো প্রতিটি কৃষি প্রকৌশল শিক্ষার্থীর পড়া উচিত। আমরা নিজেদের ক্যারিয়ার শুধু সরকারি চাকরিতে সীমাবদ্ধ ভাবি — অথচ সুযোগের দরজা অনেক বড়। 👇',
    sharedPost: {
      authorName: 'A.S.M Anas Ferdous',
      authorAvatar: AVATARS.anas,
      timestamp: '১৪ নভেম্বর',
      text: 'আগামী দশ বছরে বাংলাদেশে কৃষি যন্ত্রায়ন, ড্রোন সেবা, কোল্ড চেইন আর সেন্সর-নির্ভর সেচে অন্তত দুই লাখ দক্ষ কৃষি প্রকৌশলীর প্রয়োজন হবে। যে তরুণ আজ মাঠে নেমে একটি কম্বাইন হারভেস্টার মেরামত শিখছে, সে আগামীকাল একটি সার্ভিস কোম্পানির মালিক। কৃষি প্রকৌশল কোনো "বিকল্প" বিষয় নয় — এটিই ভবিষ্যতের মূলধারা।',
    },
    stats: { likes: 214, commentsCount: 38, shares: 41 },
    reactionsSummary: 'Tasnim Ara and 213 others',
    comments: [],
  },
  {
    id: 'p3',
    author: { name: 'Dr. Nusrat Jahan', avatar: AVATARS.nusrat, role: 'Soil Microbiologist · BSMRAU', isVerified: true },
    timestamp: '১ দিন',
    content:
      'উপকূলীয় লবণাক্ত মাটিতে বায়োচার + ট্রাইকোডার্মা প্রয়োগের ১৮ মাসের ফলাফল এসেছে। খুলনার দাকোপে ৮.২ dS/m লবণাক্ততার মাটিতে:\n\n• মাটির জৈব কার্বন বেড়েছে ৩১%\n• উপকারী অণুজীবের বৈচিত্র্য (Shannon index) ২.৮ → ৩.৬\n• টমেটোর ফলন বেড়েছে ২২%\n\nধানের তুষ থেকে তৈরি বায়োচার স্থানীয়ভাবেই পাওয়া যায় — এটিই এই পদ্ধতির সবচেয়ে বড় শক্তি। পূর্ণ গবেষণাপত্র শীঘ্রই প্রকাশিত হবে।',
    images: [img(PHOTOS.labPlants, 1000, 640)],
    stats: { likes: 452, commentsCount: 61, shares: 94 },
    reactionsSummary: 'Farhana Yasmin and 451 others',
    comments: [],
  },
  {
    id: 'p4',
    author: { name: 'Rajib Hossain', avatar: AVATARS.rajib, role: 'কৃষক · বগুড়া' },
    timestamp: '২ দিন',
    content: 'এই প্রথম মাচায় হাইড্রোপনিক পদ্ধতিতে লেটুস চাষ করলাম। ৩৫ দিনে বিক্রি উপযোগী, মাটি লাগে না, পানি লাগে মাঠের দশ ভাগের এক ভাগ। বগুড়া শহরের দুইটা রেস্টুরেন্ট নিয়মিত নিচ্ছে। 🥬',
    images: [img(PHOTOS.hydroFrame, 1000, 640)],
    stats: { likes: 129, commentsCount: 17, shares: 8 },
    reactionsSummary: 'Mehedi Hasan and 128 others',
    comments: [],
  },
];

export const STORY_REELS: StoryReel[] = [
  { id: 'r1', title: 'The Science Behind Healthier Soil', creator: 'Dr. Nusrat Jahan', creatorAvatar: AVATARS.nusrat, location: 'দাকোপ, খুলনা', duration: '0:58', views: 48200, gradientTheme: 'from-emerald-900 to-lime-700', videoType: 'greenhouse-iot', likes: 3120 },
  { id: 'r2', title: '৩ মিনিটে মাটির পিএইচ (pH) মাপার সহজ পদ্ধতি', creator: 'Rajib', creatorAvatar: AVATARS.rajib, location: 'শেরপুর, বগুড়া', duration: '3:02', views: 21800, gradientTheme: 'from-amber-900 to-orange-600', videoType: 'soil-ph', likes: 1840 },
  { id: 'r3', title: 'ড্রোন স্প্রে করার আগে ৫টি নিরাপত্তা নিয়ম', creator: 'Mostafa Kamal', creatorAvatar: 'MK', location: 'ঠাকুরগাঁও', duration: '1:24', views: 15400, gradientTheme: 'from-sky-900 to-teal-600', videoType: 'drone-tips', likes: 980 },
  { id: 'r4', title: 'সৌর চেম্বারে পেঁয়াজ: ৬ মাস পরের অবস্থা', creator: 'Najmul Huda', creatorAvatar: 'NH', location: 'সুজানগর, পাবনা', duration: '2:10', views: 12900, gradientTheme: 'from-rose-900 to-amber-600', videoType: 'solar-onion', likes: 760 },
  { id: 'r5', title: 'হাইড্রোপনিক স্ট্রবেরি: ছাদ থেকে বাজারে', creator: 'Tasnim Ara', creatorAvatar: 'TA', location: 'উত্তরা, ঢাকা', duration: '1:45', views: 30100, gradientTheme: 'from-fuchsia-900 to-rose-600', videoType: 'hydroponic-berry', likes: 2210 },
];

export const REEL_PHOTO: Record<StoryReel['videoType'], string> = {
  'greenhouse-iot': img(PHOTOS.plantHand, 540, 960),
  'soil-ph': img(PHOTOS.soilHands, 540, 960),
  'drone-tips': img(PHOTOS.tractorSpray, 540, 960),
  'solar-onion': img(PHOTOS.onions, 540, 960),
  'hydroponic-berry': img(PHOTOS.strawberry, 540, 960),
};

export const TOPIC_STORIES: TopicStory[] = [
  { id: 's1', title: 'ড্রোনে বালাইনাশক: খরচ ও নিয়ম', category: 'এগ্রি-টেক ও ড্রোন', imageUrl: img(PHOTOS.sprayers, 360, 640), iconName: 'drone', readsCount: '১২.৪k', authorName: 'Mostafa Kamal', authorAvatar: 'MK' },
  { id: 's2', title: 'হাওরে ব্রি-১০২ এর মাঠ দিবস', category: 'শস্য ও কৃষিবিজ্ঞান', imageUrl: img(PHOTOS.plantingRice, 360, 640), iconName: 'seedling', readsCount: '৯.৮k', authorName: 'Dr. Farhana', authorAvatar: 'FY' },
  { id: 's3', title: 'লবণাক্ততা মানচিত্র ২০২৫', category: 'জলবায়ু ও স্থায়িত্ব', imageUrl: img(PHOTOS.hutPaddy, 360, 640), iconName: 'climate', readsCount: '৭.১k', authorName: 'Dr. Nusrat Jahan', authorAvatar: AVATARS.nusrat },
  { id: 's4', title: 'পেঁয়াজের দাম ও কোল্ড চেইন', category: 'খাদ্য ও কোল্ড চেইন', imageUrl: img(PHOTOS.onionLot, 360, 640), iconName: 'food', readsCount: '৬.৩k', authorName: 'Najmul Huda', authorAvatar: 'NH' },
  { id: 's5', title: 'মাটির স্বাস্থ্য কার্ড', category: 'গবেষণা সহজ ভাষায়', imageUrl: img(PHOTOS.seedlings, 360, 640), iconName: 'soil', readsCount: '৫.৯k', authorName: 'Rajib', authorAvatar: AVATARS.rajib },
  { id: 's6', title: 'গ্রামীণ নারী উদ্যোক্তা', category: 'স্টার্টআপ ও উদ্ভাবন', imageUrl: img(PHOTOS.basketFarmer, 360, 640), iconName: 'rural', readsCount: '৪.২k', authorName: 'Tasnim Ara', authorAvatar: 'TA' },
  { id: 's7', title: 'স্মার্ট গ্রিনহাউস ড্যাশবোর্ড', category: 'স্টার্টআপ ও উদ্ভাবন', imageUrl: img(PHOTOS.greenhouse, 360, 640), iconName: 'tech', readsCount: '৩.৭k', authorName: 'Mehedi Hasan', authorAvatar: AVATARS.mehedi },
];

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 'e1', title: 'AgriTech Innovation Summit 2026', dateMonth: 'JAN', dateDay: '18', location: 'ICCB, ঢাকা', attendeesCount: '১.২k যাচ্ছেন' },
  { id: 'e2', title: 'Sustainable Farming & Drone Workshop', dateMonth: 'DEC', dateDay: '12', location: 'অনলাইন · Zoom', attendeesCount: '৮৪০ যাচ্ছেন' },
  { id: 'e3', title: 'হাওর ফসল সুরক্ষা মাঠ দিবস', dateMonth: 'DEC', dateDay: '27', location: 'ধর্মপাশা, সুনামগঞ্জ', attendeesCount: '৩১০ যাচ্ছেন' },
];

export const TRENDING_ITEMS: TrendingRankedItem[] = [
  { id: 't1', rank: '01', title: 'হাওরের আগাম বন্যা ও ব্রি-১০২: জিংকসমৃদ্ধ ধানের নতুন বিপ্লব', reads: '১৮.৪k', comments: 96, imageUrl: img(PHOTOS.plantingRice, 160, 160), category: 'শস্য ও কৃষিবিজ্ঞান' },
  { id: 't2', rank: '02', title: 'মাটির পুষ্টি ও ড্রোন সেন্সিং: নাইট্রোজেনের অপচয় রোধে ১৮% সাশ্রয়', reads: '৯.৬k', comments: 41, imageUrl: img(PHOTOS.aerialField, 160, 160), category: 'এগ্রি-টেক ও ড্রোন' },
  { id: 't3', rank: '03', title: 'সৌরচালিত কোল্ড চেম্বার: পাবনার পেঁয়াজ চাষিদের বিপ্লব', reads: '৭.৩k', comments: 28, imageUrl: img(PHOTOS.solar, 160, 160), category: 'খাদ্য ও কোল্ড চেইন' },
  { id: 't4', rank: '04', title: 'লবণাক্ত উপকূলে কাঁকড়া ও তেলাপিয়া সমন্বিত চাষ', reads: '৫.১k', comments: 19, imageUrl: img(PHOTOS.boatSunset, 160, 160), category: 'মৎস্য ও প্রাণিসম্পদ' },
  { id: 't5', rank: '05', title: 'ধানের ব্লাস্ট রোগ: আগাম সতর্কতার AI মডেল', reads: '৪.৮k', comments: 33, imageUrl: img(PHOTOS.riceStand, 160, 160), category: 'গবেষণা সহজ ভাষায়' },
];

export const FEATURED_SCIENTISTS: FeaturedScientist[] = [
  { id: 'f1', name: 'Dr. Nusrat Jahan', role: 'Soil Microbiologist', organization: 'BSMRAU', focusArea: 'লবণাক্ত মাটি ও বায়োচার', publicationsCount: 42 },
  { id: 'f2', name: 'ড. ফারহানা ইয়াসমিন', role: 'CSO, Plant Breeding', organization: 'BRRI', focusArea: 'জিংকসমৃদ্ধ ধান', publicationsCount: 67 },
  { id: 'f3', name: 'Prof. Tanvir Ahmed', role: 'Precision Agriculture', organization: 'BAU', focusArea: 'ড্রোন রিমোট সেন্সিং', publicationsCount: 38 },
];

export const RESEARCH_PAPERS: ResearchPaper[] = [
  { id: 'rp1', institution: 'Bangladesh Rice Research Institute', institutionCode: 'BRRI', title: 'BRRI dhan102: A zinc-enriched boro variety for haor', summary: 'আগাম পরিপক্বতা ও উচ্চ জিংক — দুই বৈশিষ্ট্য একসাথে।', practicalImpact: 'হাওরে ফসলহানির ঝুঁকি ৩০% কম', publishedDate: 'Oct 2025', researchers: ['F. Yasmin', 'M. Rahman'] },
  { id: 'rp2', institution: 'Bangladesh Agricultural University', institutionCode: 'BAU', title: 'UAV-based NDRE for site-specific nitrogen in T. Aman', summary: 'ড্রোন সূচক দিয়ে ইউরিয়ার মাত্রা নির্ধারণ।', practicalImpact: 'বিঘাপ্রতি ৩.২ কেজি ইউরিয়া সাশ্রয়', publishedDate: 'Sep 2025', researchers: ['T. Ahmed', 'S. Karim'] },
  { id: 'rp3', institution: 'Bangladesh Agricultural Research Institute', institutionCode: 'BARI', title: 'Solar-powered evaporative cold storage for onion', summary: 'গ্রিডবিহীন এলাকায় পেঁয়াজ সংরক্ষণ।', practicalImpact: 'সংরক্ষণ ক্ষতি ৩৫% → ৮%', publishedDate: 'Jul 2025', researchers: ['N. Huda'] },
  { id: 'rp4', institution: 'Sher-e-Bangla Agricultural University', institutionCode: 'SAU', title: 'Integrated crab–tilapia culture under salinity stress', summary: 'উপকূলে মিশ্র মৎস্য চাষের অর্থনীতি।', practicalImpact: 'নিট আয় প্রায় দ্বিগুণ', publishedDate: 'Jun 2025', researchers: ['M. Khatun', 'R. Alam'] },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'BRRI নতুন গবেষণা প্রকাশ করেছে: ব্লাস্ট-প্রতিরোধী ব্রি ধান১০৫', source: 'BRRI · Research Alert', time: '১২ মিনিট', unread: true },
  { id: 'n2', title: 'Dr. Nusrat Jahan আপনার মন্তব্যের উত্তর দিয়েছেন', source: 'Community', time: '৪৫ মিনিট', unread: true },
  { id: 'n3', title: 'আবহাওয়া সতর্কতা: উত্তরাঞ্চলে ঘন কুয়াশা, বীজতলা ঢেকে রাখুন', source: 'BMD · Agro-met', time: '২ ঘণ্টা', unread: true },
  { id: 'n4', title: 'AgriTech Innovation Summit 2026 — রেজিস্ট্রেশন খোলা', source: 'Events', time: '১ দিন', unread: false },
];

export const PILLARS = [
  { key: 'drone', label: 'Agri-Tech & Drones', bn: 'এগ্রি-টেক ও ড্রোন', count: 128 },
  { key: 'crops', label: 'Crops & Agronomy', bn: 'শস্য ও কৃষিবিজ্ঞান', count: 214 },
  { key: 'research', label: 'Research Explained', bn: 'গবেষণা সহজ ভাষায়', count: 96 },
  { key: 'climate', label: 'Climate & Salinity', bn: 'জলবায়ু ও লবণাক্ততা', count: 87 },
  { key: 'cold', label: 'Food Cold Chain', bn: 'খাদ্য ও কোল্ড চেইন', count: 54 },
  { key: 'startup', label: 'Startups & IoT', bn: 'স্টার্টআপ ও IoT', count: 73 },
] as const;

export const INSTITUTIONS = [
  { code: 'BRRI', name: 'ধান গবেষণা ইনস্টিটিউট', papers: 312 },
  { code: 'BAU', name: 'কৃষি বিশ্ববিদ্যালয়', papers: 486 },
  { code: 'BARI', name: 'কৃষি গবেষণা ইনস্টিটিউট', papers: 275 },
  { code: 'SAU', name: 'শেরেবাংলা কৃষি বিশ্ববিদ্যালয়', papers: 198 },
];

export const STORE_ITEMS = [
  { id: 'st1', name: 'মাটির pH ও আর্দ্রতা মিটার', price: 1450, unit: 'পিস', tag: 'Best seller', image: img(PHOTOS.soilHands, 600, 450), seller: 'AgroSense BD' },
  { id: 'st2', name: 'ব্রি ধান১০২ প্রত্যয়িত বীজ', price: 68, unit: 'কেজি', tag: 'BADC certified', image: img(PHOTOS.riceStand, 600, 450), seller: 'BADC Outlet' },
  { id: 'st3', name: 'ধানের তুষের বায়োচার', price: 35, unit: 'কেজি', tag: 'Organic', image: img(PHOTOS.seedlings, 600, 450), seller: 'Coastal Soil Co.' },
  { id: 'st4', name: 'LoRa IoT সেন্সর নোড কিট', price: 4800, unit: 'কিট', tag: 'New', image: img(PHOTOS.greenhouse, 600, 450), seller: 'Trishal Labs' },
  { id: 'st5', name: 'ড্রোন স্প্রে সার্ভিস (১ বিঘা)', price: 180, unit: 'বিঘা', tag: 'Service', image: img(PHOTOS.tractorSpray, 600, 450), seller: 'SkyKrishi' },
  { id: 'st6', name: 'হাইড্রোপনিক স্টার্টার সেট', price: 3200, unit: 'সেট', tag: 'Rooftop', image: img(PHOTOS.hydroFrame, 600, 450), seller: 'UrbanLeaf' },
];

export const IDEAS = [
  { id: 'i1', title: 'ইউনিয়ন পর্যায়ে কমিউনিটি ড্রোন হাব', body: 'প্রতি ইউনিয়নে একটি শেয়ারড ড্রোন — কৃষক সমবায় পরিচালিত, ঘণ্টাভিত্তিক ভাড়া।', author: 'Mostafa Kamal', votes: 184, tag: 'এগ্রি-টেক' },
  { id: 'i2', title: 'বাংলা ভয়েস কৃষি হেল্পলাইন + AI', body: 'অক্ষরজ্ঞানহীন কৃষকের জন্য ফোনে কথা বলেই রোগ নির্ণয় ও পরামর্শ।', author: 'Tasnim Ara', votes: 156, tag: 'AI' },
  { id: 'i3', title: 'হাওরের জন্য ভাসমান বীজতলা নেটওয়ার্ক', body: 'বন্যার আগে চারা প্রস্তুত রাখতে কচুরিপানার ভাসমান বেড।', author: 'Rashedul Islam', votes: 121, tag: 'জলবায়ু' },
  { id: 'i4', title: 'স্কুল ছাদে মাইক্রোগ্রিন ল্যাব', body: 'শিক্ষার্থীদের পুষ্টি শিক্ষা ও হাতে-কলমে কৃষি — এক সাথে।', author: 'AL Amin Nur', votes: 98, tag: 'শিক্ষা' },
];
