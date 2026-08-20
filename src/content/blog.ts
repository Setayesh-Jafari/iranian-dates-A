import type { Locale } from "@/i18n/config";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogContent = {
  title: string;
  description: string;
  excerpt: string;
  keywords: string[];
  intro: string;
  sections: BlogSection[];
  faq: BlogFaq[];
};

export type BlogPost = {
  slug: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  image: string;
  imageAlt: Record<Locale, string>;
  tag: Record<Locale, string>;
  content: Record<Locale, BlogContent>;
};

const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600&h=900`;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mazafati-dates-complete-guide",
    publishedAt: "2026-02-11",
    updatedAt: "2026-07-28",
    readingMinutes: 8,
    image: pexels(15913423),
    imageAlt: {
      en: "Fresh Mazafati dates from Bam, Iran",
      fa: "خرمای تازه مضافتی بم",
    },
    tag: { en: "Varieties", fa: "ارقام" },
    content: {
      en: {
        title: "Mazafati Dates: The Complete Buyer's Guide",
        description:
          "Everything importers need to know about Iranian Mazafati (Kimia) dates — grading, moisture, harvest calendar, cold chain and how to specify quality in a purchase order.",
        excerpt:
          "Mazafati is the date that made Iran famous. Here is how the grades differ, what moisture really means for shelf life, and how to write a specification that protects your container.",
        keywords: [
          "Mazafati dates",
          "Kimia dates",
          "Iranian dates buyer guide",
          "Bam dates export",
          "date moisture content",
        ],
        intro:
          "Mazafati — sold internationally as Kimia — is the soft, dark, syrup-rich date grown mainly around Bam in Kerman province. It accounts for a large share of Iran's fresh date exports and is the variety most buyers mean when they say “Iranian dates”. This guide explains how it is graded, how it should travel, and what to put in your purchase specification.",
        sections: [
          {
            heading: "What makes Mazafati different",
            paragraphs: [
              "Mazafati is harvested at the rutab stage, when the fruit is fully coloured but still soft and high in moisture. That is why it tastes closer to fresh fruit than to a dried date: the flesh is fudgy, the skin is almost black, and the sweetness reads as caramel rather than sugar.",
              "Because the fruit is not fully dried, Mazafati depends on refrigeration. A carton that is handled correctly stays perfect for twelve months at +5 °C; the same carton left on a warm dock for a week will start to ferment. Almost every quality complaint we investigate comes down to a broken cold chain, not to the fruit itself.",
            ],
          },
          {
            heading: "Grades: Kimia, AAA and the rest",
            paragraphs: [
              "Grading is based on size, colour uniformity, skin integrity and the share of defective fruits. There is no single legal standard, so serious exporters publish their own thresholds and stick to them.",
            ],
            bullets: [
              "Kimia / AAA: large, glossy, uniform fruit, under 2% defects — retail packs and premium gifting.",
              "AA: slightly smaller and less uniform, under 5% defects — supermarket private label.",
              "A: mixed sizes, minor skin damage allowed — industrial use, paste and syrup.",
              "Below A: not offered for export by reputable suppliers.",
            ],
          },
          {
            heading: "Moisture, sugar and shelf life",
            paragraphs: [
              "Export Mazafati typically carries 15–18% moisture and 65–70% total sugars. Below 15% the fruit loses its signature softness; above 20% the risk of fermentation and mould rises sharply, especially if the container spends time at ambient temperature in a warm port.",
              "Ask for the moisture figure of the actual lot, not a brochure range. A lab report issued per shipment — moisture, microbiology and pesticide residues — should be part of every offer.",
            ],
          },
          {
            heading: "Harvest and shipping calendar",
            paragraphs: [
              "The Mazafati harvest runs from late August into October. Fruit from the new crop reaches export packing houses from September, and cold-stored stock covers the rest of the year. Prices are usually softest right after harvest and firm up from March onwards as stocks deplete.",
              "Booking early matters: reefer capacity out of Bandar Abbas gets tight in the weeks before Ramadan, when Gulf and South Asian demand peaks at the same time.",
            ],
          },
          {
            heading: "How to write your specification",
            paragraphs: [
              "A good purchase specification removes 90% of disputes. Include variety and grade, moisture range, defect tolerance, fruit count per kilogram, packaging (vacuum bag weight, carton weight, pallet pattern), temperature during transit, required certificates and the inspection method at destination.",
            ],
            bullets: [
              "Variety and grade: Mazafati, Kimia (AAA)",
              "Moisture: 15–18%, verified per lot",
              "Packaging: 1 kg vacuum bags × 10 in a food-grade carton",
              "Transit: reefer at +5 °C, temperature log supplied",
              "Documents: health, phytosanitary, origin, fumigation, quality",
            ],
          },
        ],
        faq: [
          {
            question: "Are Mazafati and Kimia the same date?",
            answer:
              "Yes. Kimia is the commercial name used in several export markets for premium-grade Mazafati; the palm cultivar is identical.",
          },
          {
            question: "Does Mazafati need refrigeration?",
            answer:
              "Yes. Store and ship at +5 °C. At ambient temperature the high moisture content shortens shelf life to a few weeks.",
          },
          {
            question: "What is a realistic MOQ for a first order?",
            answer:
              "Most buyers start with a mixed pallet or a 5 kg sampler, then move to a 20ft reefer once the grade is approved.",
          },
        ],
      },
      fa: {
        title: "خرمای مضافتی: راهنمای کامل خریداران",
        description:
          "هر آنچه واردکنندگان باید درباره خرمای مضافتی (کیمیا) بدانند؛ درجه‌بندی، رطوبت، تقویم برداشت، زنجیره سرد و نحوه نوشتن مشخصات فنی در سفارش خرید.",
        excerpt:
          "مضافتی همان خرمایی است که نام ایران را جهانی کرد. در این راهنما تفاوت درجه‌ها، معنای واقعی رطوبت برای ماندگاری و روش نوشتن مشخصاتی که کانتینر شما را بیمه می‌کند توضیح داده شده است.",
        keywords: [
          "خرمای مضافتی",
          "خرمای کیمیا",
          "راهنمای خرید خرمای ایرانی",
          "صادرات خرمای بم",
          "رطوبت خرما",
        ],
        intro:
          "مضافتی که در بازارهای بین‌المللی با نام کیمیا شناخته می‌شود، خرمای نرم، تیره و پرشیره‌ای است که عمدتاً در منطقه بم استان کرمان پرورش می‌یابد. سهم بزرگی از صادرات خرمای تازه ایران به این رقم اختصاص دارد و وقتی خریداری از «خرمای ایرانی» صحبت می‌کند، معمولاً منظورش همین رقم است. در این راهنما درجه‌بندی، شرایط حمل و مشخصاتی که باید در سفارش خرید بیاورید بررسی می‌شود.",
        sections: [
          {
            heading: "چه چیزی مضافتی را متمایز می‌کند",
            paragraphs: [
              "مضافتی در مرحله رطب برداشت می‌شود؛ زمانی که میوه رنگ کامل گرفته اما هنوز نرم و پررطوبت است. به همین دلیل طعم آن به میوه تازه نزدیک‌تر است تا خرمای خشک؛ بافت لطیف، پوست تقریباً سیاه و شیرینی آن بیشتر کاراملی است تا شکری.",
              "چون میوه کاملاً خشک نشده، مضافتی به سرمایش وابسته است. کارتنی که درست جابه‌جا شود، دوازده ماه در دمای ۵+ درجه سالم می‌ماند؛ همان کارتن اگر یک هفته در محوطه گرم بندر بماند شروع به تخمیر می‌کند. تقریباً همه شکایت‌های کیفی که بررسی می‌کنیم به قطع زنجیره سرد برمی‌گردد، نه به خود میوه.",
            ],
          },
          {
            heading: "درجه‌بندی: کیمیا، AAA و بقیه",
            paragraphs: [
              "درجه‌بندی بر اساس اندازه، یکنواختی رنگ، سلامت پوست و درصد میوه‌های معیوب انجام می‌شود. استاندارد قانونی واحدی وجود ندارد، بنابراین صادرکنندگان حرفه‌ای آستانه‌های خود را اعلام می‌کنند و به آن پایبند می‌مانند.",
            ],
            bullets: [
              "کیمیا / AAA: میوه درشت، براق و یکنواخت با کمتر از ۲ درصد عیب؛ مناسب بسته‌بندی خرده‌فروشی و هدیه.",
              "AA: کمی کوچک‌تر و کم‌یکنواخت‌تر با کمتر از ۵ درصد عیب؛ مناسب برند اختصاصی فروشگاه‌ها.",
              "A: اندازه‌های مخلوط با آسیب سطحی مجاز؛ مصرف صنعتی، رب و شیره.",
              "پایین‌تر از A: تأمین‌کنندگان معتبر برای صادرات ارائه نمی‌کنند.",
            ],
          },
          {
            heading: "رطوبت، قند و ماندگاری",
            paragraphs: [
              "مضافتی صادراتی معمولاً ۱۵ تا ۱۸ درصد رطوبت و ۶۵ تا ۷۰ درصد قند کل دارد. زیر ۱۵ درصد، میوه نرمی شاخص خود را از دست می‌دهد و بالای ۲۰ درصد، خطر تخمیر و کپک به‌شدت افزایش می‌یابد؛ به‌ویژه اگر کانتینر مدتی در دمای محیط بندری گرم بماند.",
              "همیشه رطوبت همان محموله را بخواهید، نه بازه‌ای که در کاتالوگ نوشته شده است. گزارش آزمایشگاهی هر محموله شامل رطوبت، میکروبیولوژی و باقیمانده سموم باید بخشی از هر پیشنهاد قیمت باشد.",
            ],
          },
          {
            heading: "تقویم برداشت و حمل",
            paragraphs: [
              "برداشت مضافتی از اواخر شهریور تا مهرماه ادامه دارد. محصول جدید از اوایل پاییز به سالن‌های بسته‌بندی صادراتی می‌رسد و باقی سال با موجودی سردخانه‌ای تأمین می‌شود. قیمت‌ها معمولاً بلافاصله پس از برداشت نرم‌تر است و از اسفند به بعد با کاهش موجودی سفت می‌شود.",
              "رزرو زودهنگام اهمیت دارد: ظرفیت کانتینر یخچالی خروجی از بندرعباس در هفته‌های پیش از ماه رمضان محدود می‌شود، چون تقاضای حوزه خلیج فارس و جنوب آسیا هم‌زمان به اوج می‌رسد.",
            ],
          },
          {
            heading: "چگونه مشخصات فنی بنویسیم",
            paragraphs: [
              "یک مشخصات خرید خوب، ۹۰ درصد اختلاف‌ها را از بین می‌برد. رقم و درجه، بازه رطوبت، تلورانس عیب، تعداد میوه در کیلوگرم، بسته‌بندی (وزن بسته وکیوم، وزن کارتن، الگوی پالت)، دمای حمل، گواهینامه‌های موردنیاز و روش بازرسی در مقصد را ذکر کنید.",
            ],
            bullets: [
              "رقم و درجه: مضافتی، کیمیا (AAA)",
              "رطوبت: ۱۵ تا ۱۸ درصد، تأییدشده برای هر لات",
              "بسته‌بندی: ۱۰ بسته وکیوم ۱ کیلوگرمی در کارتن بهداشتی",
              "حمل: کانتینر یخچالی ۵+ درجه با ارائه لاگ دما",
              "اسناد: بهداشت، قرنطینه گیاهی، مبدأ، ضدعفونی و کیفیت",
            ],
          },
        ],
        faq: [
          {
            question: "آیا مضافتی و کیمیا یک خرما هستند؟",
            answer:
              "بله. کیمیا نام تجاری مضافتی درجه ممتاز در چند بازار صادراتی است و رقم نخل کاملاً یکسان است.",
          },
          {
            question: "آیا مضافتی به سردخانه نیاز دارد؟",
            answer:
              "بله. نگهداری و حمل در دمای ۵+ درجه ضروری است. در دمای محیط، رطوبت بالای این رقم ماندگاری را به چند هفته کاهش می‌دهد.",
          },
          {
            question: "حداقل سفارش منطقی برای خرید اول چقدر است؟",
            answer:
              "بیشتر خریداران با یک پالت ترکیبی یا بسته نمونه ۵ کیلوگرمی شروع می‌کنند و پس از تأیید کیفیت به کانتینر ۲۰ فوت یخچالی می‌رسند.",
          },
        ],
      },
    },
  },
  {
    slug: "iranian-date-varieties-compared",
    publishedAt: "2026-04-06",
    updatedAt: "2026-06-15",
    readingMinutes: 7,
    image: pexels(17302469),
    imageAlt: {
      en: "Different Iranian date varieties side by side",
      fa: "مقایسه ارقام مختلف خرمای ایرانی",
    },
    tag: { en: "Sourcing", fa: "تأمین" },
    content: {
      en: {
        title: "Iranian Date Varieties Compared: Mazafati, Piarom, Zahedi and More",
        description:
          "A practical comparison of Iran's main export date varieties — texture, moisture, shelf life, best use and who buys them. Choose the right variety for your market.",
        excerpt:
          "Six varieties cover almost all of Iran's date exports. This is how they differ in moisture, shelf life and end use — and which one fits your market.",
        keywords: [
          "Iranian date varieties",
          "Piarom vs Mazafati",
          "Zahedi dates",
          "Kabkab dates",
          "Rabbi dates",
          "Sayer dates",
        ],
        intro:
          "Iran grows more than four hundred date cultivars, but international trade revolves around six. Choosing between them is less about which is “best” and more about matching moisture, shelf life and price to the way your customers will use the fruit.",
        sections: [
          {
            heading: "Soft, high-moisture varieties",
            paragraphs: [
              "Mazafati (Kimia) is the flagship: dark, fudgy and harvested at rutab stage, with 15–18% moisture. It needs a cold chain and rewards you with a premium retail price.",
              "Kabkab from Bushehr is softer still and very high in natural syrup. It is the value workhorse behind date bars, confectionery and syrup production. Rabbi, from Sistan & Baluchestan, is elongated, chewy and slightly floral — excellent for stuffing and festive packs.",
            ],
          },
          {
            heading: "Semi-dry varieties",
            paragraphs: [
              "Piarom — often marketed as the chocolate date — is semi-dry with 12–15% moisture, a long, complex, low-sweet finish and an 18-month shelf life. It commands the highest price per kilogram of any Iranian variety and travels well without a full cold chain.",
              "Sayer from Khuzestan sits between soft and dry. It is the most versatile in industrial baking, and its balanced texture makes it a safe first purchase for buyers who are new to Iranian origins.",
            ],
          },
          {
            heading: "Dry varieties",
            paragraphs: [
              "Zahedi is the golden, firm, low-moisture date with a 24-month shelf life and no refrigeration requirement. Re-packers, confectioners and food-service buyers order it in 25 kg cartons because it is forgiving in transit and stable in price.",
            ],
            bullets: [
              "Mazafati: 15–18% moisture · cold chain · premium retail",
              "Piarom: 12–15% · semi-dry · highest value per kg",
              "Kabkab: 18–22% · syrup-rich · industrial and confectionery",
              "Rabbi: 15–18% · chewy · stuffing and gifting",
              "Sayer: 12–15% · balanced · baking and re-packing",
              "Zahedi: 10–12% · dry · bulk trade, 24-month shelf life",
            ],
          },
          {
            heading: "Matching variety to market",
            paragraphs: [
              "Retail chains in the Gulf and South Asia buy Mazafati and Piarom for branded packs. European private label tends to start with Zahedi and Sayer because ambient logistics are simpler. Industrial buyers — bar makers, bakeries, syrup plants — normally take Kabkab paste or chopped Zahedi.",
              "If you are testing a new market, ship a mixed sampler first. Five kilograms across five varieties costs less than one wrong container and tells you exactly what your customers respond to.",
            ],
          },
        ],
        faq: [
          {
            question: "Which Iranian date has the longest shelf life?",
            answer:
              "Zahedi, at 24 months without refrigeration, followed by Piarom and Sayer at around 18 months.",
          },
          {
            question: "Which variety is closest to Medjool?",
            answer:
              "Large-format soft dates from south-east Iran, sold as medjool-style, are the closest in size and texture at a considerably lower cost.",
          },
          {
            question: "Can varieties be mixed in one container?",
            answer:
              "Yes, provided the temperature requirements match. Keep high-moisture Mazafati separate from ambient dry cargo.",
          },
        ],
      },
      fa: {
        title: "مقایسه ارقام خرمای ایرانی: مضافتی، پیارم، زاهدی و بقیه",
        description:
          "مقایسه کاربردی ارقام اصلی صادراتی خرمای ایران؛ بافت، رطوبت، ماندگاری، بهترین کاربرد و بازار هدف. رقم مناسب بازار خود را انتخاب کنید.",
        excerpt:
          "شش رقم تقریباً تمام صادرات خرمای ایران را پوشش می‌دهند. تفاوت آن‌ها در رطوبت، ماندگاری و کاربرد نهایی چیست و کدام‌یک مناسب بازار شماست؟",
        keywords: [
          "ارقام خرمای ایرانی",
          "پیارم یا مضافتی",
          "خرمای زاهدی",
          "خرمای کبکاب",
          "خرمای ربی",
          "خرمای سایر",
        ],
        intro:
          "در ایران بیش از چهارصد رقم خرما کشت می‌شود، اما تجارت بین‌المللی حول شش رقم می‌چرخد. انتخاب میان آن‌ها کمتر به «بهترین بودن» مربوط است و بیشتر به تطبیق رطوبت، ماندگاری و قیمت با نحوه مصرف مشتری شما بستگی دارد.",
        sections: [
          {
            heading: "ارقام نرم و پررطوبت",
            paragraphs: [
              "مضافتی (کیمیا) رقم شاخص است؛ تیره، لطیف و برداشت‌شده در مرحله رطب با رطوبت ۱۵ تا ۱۸ درصد. به زنجیره سرد نیاز دارد و در عوض قیمت خرده‌فروشی ممتازی به دست می‌آورد.",
              "کبکاب بوشهر نرم‌تر است و شیره طبیعی بسیار بالایی دارد؛ رقم اقتصادی پشت صحنه بار انرژی، قنادی و تولید شیره. ربی از سیستان و بلوچستان کشیده، لطیف و اندکی گل‌مانند است و برای مغزدار کردن و بسته‌های مناسبتی عالی است.",
            ],
          },
          {
            heading: "ارقام نیمه‌خشک",
            paragraphs: [
              "پیارم که با نام خرمای شکلاتی شناخته می‌شود، نیمه‌خشک با رطوبت ۱۲ تا ۱۵ درصد، طعمی پیچیده و کم‌شیرین و ماندگاری ۱۸ ماهه است. بالاترین قیمت هر کیلوگرم را در میان ارقام ایرانی دارد و بدون زنجیره سرد کامل هم به‌خوبی حمل می‌شود.",
              "سایر از خوزستان میان ارقام نرم و خشک قرار می‌گیرد. در صنایع پخت کاربردی‌ترین رقم است و بافت متعادل آن، انتخابی مطمئن برای خریدارانی است که تازه با مبدأ ایران کار می‌کنند.",
            ],
          },
          {
            heading: "ارقام خشک",
            paragraphs: [
              "زاهدی خرمای طلایی، سفت و کم‌رطوبت با ماندگاری ۲۴ ماه و بدون نیاز به سردخانه است. واحدهای بسته‌بندی مجدد، قنادی‌ها و خریداران خدمات غذایی آن را در کارتن‌های ۲۵ کیلوگرمی سفارش می‌دهند، چون در حمل مقاوم و در قیمت پایدار است.",
            ],
            bullets: [
              "مضافتی: رطوبت ۱۵ تا ۱۸ درصد · زنجیره سرد · خرده‌فروشی ممتاز",
              "پیارم: ۱۲ تا ۱۵ درصد · نیمه‌خشک · بالاترین ارزش هر کیلوگرم",
              "کبکاب: ۱۸ تا ۲۲ درصد · پرشیره · صنعتی و قنادی",
              "ربی: ۱۵ تا ۱۸ درصد · لطیف · مغزدار کردن و هدیه",
              "سایر: ۱۲ تا ۱۵ درصد · متعادل · پخت و بسته‌بندی مجدد",
              "زاهدی: ۱۰ تا ۱۲ درصد · خشک · تجارت عمده، ماندگاری ۲۴ ماه",
            ],
          },
          {
            heading: "تطبیق رقم با بازار",
            paragraphs: [
              "زنجیره‌های خرده‌فروشی حوزه خلیج فارس و جنوب آسیا مضافتی و پیارم را برای بسته‌های برنددار می‌خرند. برند اختصاصی اروپا معمولاً با زاهدی و سایر شروع می‌کند، چون لجستیک دمای محیط ساده‌تر است. خریداران صنعتی مانند تولیدکنندگان بار انرژی، نانوایی‌های صنعتی و کارخانه‌های شیره، عمدتاً رب کبکاب یا زاهدی خردشده می‌گیرند.",
              "اگر بازار جدیدی را آزمایش می‌کنید، ابتدا یک بسته نمونه ترکیبی سفارش دهید. پنج کیلوگرم از پنج رقم، هزینه‌ای بسیار کمتر از یک کانتینر اشتباه دارد و دقیقاً نشان می‌دهد مشتری شما به چه چیزی واکنش نشان می‌دهد.",
            ],
          },
        ],
        faq: [
          {
            question: "کدام خرمای ایرانی بیشترین ماندگاری را دارد؟",
            answer:
              "زاهدی با ۲۴ ماه بدون نیاز به سردخانه، و پس از آن پیارم و سایر با حدود ۱۸ ماه.",
          },
          {
            question: "کدام رقم به مدجول نزدیک‌تر است؟",
            answer:
              "ارقام نرم و درشت جنوب شرق ایران که با عنوان سبک مدجول عرضه می‌شوند، از نظر اندازه و بافت نزدیک‌ترین گزینه با هزینه بسیار کمترند.",
          },
          {
            question: "آیا می‌توان چند رقم را در یک کانتینر ارسال کرد؟",
            answer:
              "بله، به شرطی که نیاز دمایی آن‌ها یکسان باشد. مضافتی پررطوبت را از بار خشک با دمای محیط جدا نگه دارید.",
          },
        ],
      },
    },
  },
  {
    slug: "importing-iranian-dates-documents-and-cold-chain",
    publishedAt: "2026-05-19",
    updatedAt: "2026-08-04",
    readingMinutes: 9,
    image: pexels(20106286),
    imageAlt: {
      en: "Export cartons of Iranian dates ready for shipping",
      fa: "کارتن‌های صادراتی خرمای ایرانی آماده حمل",
    },
    tag: { en: "Export & Logistics", fa: "صادرات و لجستیک" },
    content: {
      en: {
        title: "Importing Iranian Dates: Documents, Incoterms and the Cold Chain",
        description:
          "A step-by-step export guide for importers of Iranian dates — required certificates, Incoterms, reefer settings, payment terms and how a quotation is built.",
        excerpt:
          "From inquiry to arrival: the documents that must accompany every shipment, the Incoterms that actually matter, and the reefer settings that protect your cargo.",
        keywords: [
          "import Iranian dates",
          "phytosanitary certificate",
          "certificate of origin",
          "FOB Bandar Abbas",
          "reefer container dates",
        ],
        intro:
          "Buying dates from Iran is straightforward once you know the paperwork. This guide walks through a complete transaction — from the first inquiry to the container arriving at your port — and shows what a professional exporter should provide at each step.",
        sections: [
          {
            heading: "Step 1 — The inquiry and the offer",
            paragraphs: [
              "Send a specification, not just a product name: variety, grade, quantity, packaging, destination port and target delivery window. A serious exporter answers with a written offer that states variety and grade, unit packaging, price basis, validity, lead time, payment terms and the documents included.",
              "Because date prices move with the harvest, the freight market and currency, quotations are issued per inquiry and usually stay valid for seven to fourteen days.",
            ],
          },
          {
            heading: "Step 2 — Documents that travel with the cargo",
            paragraphs: [
              "Five documents accompany a standard shipment. Missing one of them is the most common reason for a container being held at destination.",
            ],
            bullets: [
              "Health certificate — microbiological safety, issued per shipment.",
              "Phytosanitary certificate — confirms freedom from quarantine pests.",
              "Certificate of origin — issued through the chamber of commerce, here in Isfahan.",
              "Fumigation certificate — container and wooden pallets treated before loading.",
              "Quality/grading certificate plus the commercial invoice and packing list.",
            ],
          },
          {
            heading: "Step 3 — Incoterms and who carries the risk",
            paragraphs: [
              "Most Iranian date exports move FOB Bandar Abbas: the exporter delivers the loaded container on board and the buyer arranges the ocean leg. CFR and CIF are available when you prefer the supplier to book freight, and EXW is used for buyers with their own consolidators inside Iran.",
              "Whatever you choose, agree in writing who pays for detention, demurrage and any temperature deviation claim. That single clause prevents most post-arrival arguments.",
            ],
          },
          {
            heading: "Step 4 — Cold chain and reefer settings",
            paragraphs: [
              "High-moisture varieties travel in a reefer set to +5 °C with fresh-air exchange closed. Ask for the pulp temperature at loading, the container number, and the temperature log at discharge. Dry varieties such as Zahedi ship in a standard dry container with desiccant bags.",
              "Cargo should be palletised, stretch-wrapped and stowed with airflow channels. Cartons stacked flush against the reefer walls block circulation and create warm pockets — a frequent, avoidable cause of arrival complaints.",
            ],
          },
          {
            heading: "Step 5 — Payment and first-order etiquette",
            paragraphs: [
              "Common terms are 30% advance with the balance against copy documents, or an irrevocable letter of credit at sight for larger volumes. Established buyers negotiate open account terms after a few clean shipments.",
              "For a first transaction, order a sampler, approve the grade in writing, then scale to a full container. It is slower by two weeks and considerably cheaper than a rejected load.",
            ],
          },
        ],
        faq: [
          {
            question: "How long does shipping take?",
            answer:
              "Typically 5–10 days to Gulf ports, 12–20 days to South Asia and 25–35 days to Northern Europe, depending on transshipment.",
          },
          {
            question: "Can you ship mixed varieties in one container?",
            answer:
              "Yes, if the temperature regime is the same. We build mixed pallets with a packing list per pallet.",
          },
          {
            question: "Do you supply private-label packaging?",
            answer:
              "Yes — bags, cartons and retail packs can be printed with your brand. Artwork lead time is around three weeks.",
          },
        ],
      },
      fa: {
        title: "واردات خرمای ایرانی: اسناد، اینکوترمز و زنجیره سرد",
        description:
          "راهنمای گام‌به‌گام صادرات برای واردکنندگان خرمای ایرانی؛ گواهینامه‌های لازم، اینکوترمز، تنظیمات کانتینر یخچالی، شرایط پرداخت و نحوه تنظیم پیش‌فاکتور.",
        excerpt:
          "از استعلام تا تحویل: اسنادی که باید همراه هر محموله باشند، اینکوترمزهایی که واقعاً اهمیت دارند و تنظیمات یخچالی که بار شما را حفظ می‌کند.",
        keywords: [
          "واردات خرمای ایرانی",
          "گواهی قرنطینه گیاهی",
          "گواهی مبدأ",
          "تحویل FOB بندرعباس",
          "کانتینر یخچالی خرما",
        ],
        intro:
          "خرید خرما از ایران وقتی مسیر اسناد را بشناسید کاملاً ساده است. این راهنما یک معامله کامل را از نخستین استعلام تا رسیدن کانتینر به بندر شما مرور می‌کند و نشان می‌دهد یک صادرکننده حرفه‌ای در هر گام باید چه چیزی ارائه دهد.",
        sections: [
          {
            heading: "گام ۱ — استعلام و پیشنهاد قیمت",
            paragraphs: [
              "به‌جای نام محصول، مشخصات بفرستید: رقم، درجه، مقدار، بسته‌بندی، بندر مقصد و بازه زمانی تحویل. صادرکننده حرفه‌ای با پیشنهاد کتبی پاسخ می‌دهد که رقم و درجه، بسته‌بندی، مبنای قیمت، اعتبار پیشنهاد، زمان آماده‌سازی، شرایط پرداخت و اسناد ارائه‌شده در آن مشخص است.",
              "چون قیمت خرما با فصل برداشت، بازار حمل و نرخ ارز تغییر می‌کند، پیش‌فاکتورها برای هر استعلام جداگانه صادر می‌شوند و معمولاً هفت تا چهارده روز اعتبار دارند.",
            ],
          },
          {
            heading: "گام ۲ — اسنادی که همراه بار حرکت می‌کنند",
            paragraphs: [
              "پنج سند همراه یک محموله استاندارد است. نبود یکی از آن‌ها رایج‌ترین دلیل توقیف کانتینر در مقصد است.",
            ],
            bullets: [
              "گواهی بهداشت — ایمنی میکروبی، صادرشده برای هر محموله.",
              "گواهی قرنطینه گیاهی — تأیید عاری بودن از آفات قرنطینه‌ای.",
              "گواهی مبدأ — صادرشده از اتاق بازرگانی، در اینجا اصفهان.",
              "گواهی ضدعفونی — تیمار کانتینر و پالت چوبی پیش از بارگیری.",
              "گواهی کیفیت و درجه‌بندی به‌همراه فاکتور تجاری و لیست بسته‌بندی.",
            ],
          },
          {
            heading: "گام ۳ — اینکوترمز و مسئولیت ریسک",
            paragraphs: [
              "بیشتر صادرات خرمای ایران با شرط FOB بندرعباس انجام می‌شود: صادرکننده کانتینر بارگیری‌شده را روی کشتی تحویل می‌دهد و خریدار حمل دریایی را ترتیب می‌دهد. شرایط CFR و CIF نیز در دسترس است و EXW برای خریدارانی مناسب است که در داخل ایران نماینده حمل دارند.",
              "هر شرطی را انتخاب کنید، کتباً مشخص کنید هزینه توقف کانتینر، دموراژ و ادعای انحراف دما بر عهده کیست. همین یک بند، بیشتر اختلاف‌های پس از تحویل را از بین می‌برد.",
            ],
          },
          {
            heading: "گام ۴ — زنجیره سرد و تنظیمات کانتینر",
            paragraphs: [
              "ارقام پررطوبت در کانتینر یخچالی با دمای ۵+ درجه و دریچه تهویه بسته حمل می‌شوند. دمای مغز میوه هنگام بارگیری، شماره کانتینر و لاگ دما در زمان تخلیه را درخواست کنید. ارقام خشک مانند زاهدی در کانتینر معمولی همراه با بسته‌های رطوبت‌گیر ارسال می‌شوند.",
              "بار باید پالت‌بندی، استرچ و با کانال‌های گردش هوا چیده شود. کارتن‌هایی که کاملاً به دیواره کانتینر یخچالی چسبیده‌اند جریان هوا را می‌بندند و نقاط گرم ایجاد می‌کنند؛ علتی رایج و کاملاً قابل پیشگیری برای شکایت در مقصد.",
            ],
          },
          {
            heading: "گام ۵ — پرداخت و آداب اولین سفارش",
            paragraphs: [
              "شرایط رایج شامل ۳۰ درصد پیش‌پرداخت و تسویه در برابر کپی اسناد، یا اعتبار اسنادی برگشت‌ناپذیر دیداری برای حجم‌های بالاتر است. خریداران باسابقه پس از چند محموله سالم، شرایط حساب باز مذاکره می‌کنند.",
              "برای اولین معامله یک بسته نمونه سفارش دهید، درجه را کتباً تأیید کنید و سپس به کانتینر کامل برسید. این مسیر دو هفته کندتر اما بسیار ارزان‌تر از یک بار مرجوعی است.",
            ],
          },
        ],
        faq: [
          {
            question: "زمان حمل چقدر است؟",
            answer:
              "معمولاً ۵ تا ۱۰ روز به بنادر خلیج فارس، ۱۲ تا ۲۰ روز به جنوب آسیا و ۲۵ تا ۳۵ روز به شمال اروپا، بسته به ترانشیپمنت.",
          },
          {
            question: "آیا امکان ارسال چند رقم در یک کانتینر هست؟",
            answer:
              "بله، اگر رژیم دمایی یکسان باشد. ما پالت‌های ترکیبی با لیست بسته‌بندی مجزا برای هر پالت آماده می‌کنیم.",
          },
          {
            question: "آیا بسته‌بندی با برند خریدار ارائه می‌کنید؟",
            answer:
              "بله؛ بسته، کارتن و پک خرده‌فروشی با برند شما چاپ می‌شود. آماده‌سازی طرح حدود سه هفته زمان می‌برد.",
          },
        ],
      },
    },
  },
  {
    slug: "date-nutrition-and-health-benefits",
    publishedAt: "2026-06-30",
    updatedAt: "2026-08-12",
    readingMinutes: 6,
    image: pexels(11679690),
    imageAlt: {
      en: "Dates served with nuts and tea",
      fa: "خرما به‌همراه مغزها و چای",
    },
    tag: { en: "Nutrition", fa: "تغذیه" },
    content: {
      en: {
        title: "Date Nutrition: What Buyers Should Know Before Making Claims",
        description:
          "Fibre, potassium, glycaemic response and clean-label positioning — the nutritional facts behind Iranian dates and how to communicate them responsibly on pack.",
        excerpt:
          "Dates sell on taste but repeat on nutrition. Here are the numbers behind fibre, potassium and glycaemic index — and the claims you can safely print.",
        keywords: [
          "date nutrition",
          "dates glycemic index",
          "date fibre potassium",
          "natural sweetener",
          "clean label sweetener",
        ],
        intro:
          "Dates are one of the few ingredients that satisfy both indulgence and health positioning. For brand owners and industrial buyers, understanding the actual nutritional profile matters — both for formulation and for staying on the right side of labelling rules.",
        sections: [
          {
            heading: "The nutritional profile in numbers",
            paragraphs: [
              "Per 100 g, dates deliver roughly 275–320 kcal, 65–75 g of carbohydrate, 6–8 g of dietary fibre and 650–700 mg of potassium, along with magnesium, copper, manganese and B-group vitamins. Fat and sodium are negligible.",
              "Exact figures vary by variety and moisture: high-moisture Mazafati is lower in calories per 100 g than dry Zahedi simply because more of its weight is water.",
            ],
          },
          {
            heading: "Glycaemic response",
            paragraphs: [
              "Despite their sweetness, most date varieties show a low to medium glycaemic index — commonly reported in the 42–62 range — because their sugars come packaged with fibre and polyphenols. That is the basis for date sugar and date paste being positioned as gentler alternatives to refined sucrose.",
              "Positioning should stay factual. “Low GI compared with refined sugar” is defensible; a blanket health claim usually is not, and rules differ by market.",
            ],
          },
          {
            heading: "Why formulators choose dates",
            paragraphs: [
              "Date paste replaces both sugar and binder in energy bars, which shortens ingredient lists dramatically. Date syrup brings colour, humectancy and caramel notes to bakery. Date sugar keeps fibre and minerals that refined sugar loses.",
            ],
            bullets: [
              "Clean label: one ingredient, no additives",
              "Natural humectant — extends softness in baked goods",
              "Binds and sweetens simultaneously in bars",
              "Vegan, gluten-free and allergen-friendly by nature",
            ],
          },
          {
            heading: "Storage, safety and shelf life",
            paragraphs: [
              "Keep soft varieties refrigerated and dry varieties cool and dark. Sugar crystals appearing on the surface are natural crystallisation, not spoilage. Fermented or alcoholic aromas, on the other hand, indicate temperature abuse and the lot should be rejected.",
              "Ask every supplier for a per-shipment microbiology report and a pesticide residue screen. Reputable exporters include both without being prompted.",
            ],
          },
        ],
        faq: [
          {
            question: "Are dates suitable for diabetics?",
            answer:
              "Portion control matters, but the low-to-medium GI and high fibre make dates a better choice than refined sweets. Always defer to local labelling rules for any claim.",
          },
          {
            question: "Do dates contain added sugar?",
            answer:
              "Ours do not. The sweetness is entirely intrinsic; the only coating we use is date sugar as an anti-caking agent on chopped dates.",
          },
          {
            question: "What is the white coating sometimes seen on dates?",
            answer:
              "Natural sugar crystallisation caused by cold storage. It is harmless and disappears when the fruit warms slightly.",
          },
        ],
      },
      fa: {
        title: "ارزش غذایی خرما: آنچه خریداران پیش از ادعای سلامت باید بدانند",
        description:
          "فیبر، پتاسیم، پاسخ گلیسمی و جایگاه برچسب تمیز؛ واقعیت‌های تغذیه‌ای خرمای ایرانی و روش بیان مسئولانه آن‌ها روی بسته‌بندی.",
        excerpt:
          "خرما با طعم فروخته می‌شود اما با ارزش غذایی تکرار خرید می‌سازد. اعداد مربوط به فیبر، پتاسیم و شاخص گلیسمی و ادعاهایی که می‌توانید مطمئن روی بسته چاپ کنید.",
        keywords: [
          "ارزش غذایی خرما",
          "شاخص گلیسمی خرما",
          "فیبر و پتاسیم خرما",
          "شیرین‌کننده طبیعی",
          "برچسب تمیز",
        ],
        intro:
          "خرما از معدود مواد اولیه‌ای است که هم‌زمان جایگاه لذت‌بخشی و سلامت را پوشش می‌دهد. برای صاحبان برند و خریداران صنعتی، شناخت پروفایل واقعی تغذیه‌ای هم در فرمولاسیون و هم در رعایت مقررات برچسب‌گذاری اهمیت دارد.",
        sections: [
          {
            heading: "پروفایل تغذیه‌ای در قالب عدد",
            paragraphs: [
              "هر ۱۰۰ گرم خرما حدود ۲۷۵ تا ۳۲۰ کیلوکالری انرژی، ۶۵ تا ۷۵ گرم کربوهیدرات، ۶ تا ۸ گرم فیبر غذایی و ۶۵۰ تا ۷۰۰ میلی‌گرم پتاسیم دارد؛ به‌همراه منیزیم، مس، منگنز و ویتامین‌های گروه B. چربی و سدیم آن ناچیز است.",
              "اعداد دقیق بسته به رقم و رطوبت تغییر می‌کند: مضافتی پررطوبت در هر ۱۰۰ گرم کالری کمتری نسبت به زاهدی خشک دارد، صرفاً به این دلیل که بخش بیشتری از وزن آن آب است.",
            ],
          },
          {
            heading: "پاسخ گلیسمی",
            paragraphs: [
              "با وجود شیرینی، بیشتر ارقام خرما شاخص گلیسمی پایین تا متوسط دارند؛ معمولاً در بازه ۴۲ تا ۶۲ گزارش می‌شود، چون قند آن‌ها همراه با فیبر و پلی‌فنول عرضه می‌شود. همین مبنای معرفی شکر خرما و رب خرما به‌عنوان جایگزین ملایم‌تر ساکارز تصفیه‌شده است.",
              "بیان این موضوع باید واقع‌بینانه بماند. عبارت «شاخص گلیسمی پایین‌تر نسبت به شکر تصفیه‌شده» قابل دفاع است، اما ادعای کلی سلامت معمولاً نیست و قوانین در هر بازار متفاوت است.",
            ],
          },
          {
            heading: "چرا فرمولاتورها خرما را انتخاب می‌کنند",
            paragraphs: [
              "رب خرما در بار انرژی هم‌زمان جای شکر و چسباننده را می‌گیرد و فهرست مواد اولیه را به‌شدت کوتاه می‌کند. شیره خرما به محصولات پختنی رنگ، رطوبت‌نگهداری و نت کاراملی می‌دهد. شکر خرما فیبر و املاحی را حفظ می‌کند که در شکر تصفیه‌شده از بین می‌رود.",
            ],
            bullets: [
              "برچسب تمیز: یک ماده اولیه، بدون افزودنی",
              "رطوبت‌نگهدار طبیعی و افزایش نرمی محصولات پختنی",
              "شیرین‌کننده و چسباننده هم‌زمان در بار انرژی",
              "به‌طور طبیعی وگان، بدون گلوتن و کم‌حساسیت‌زا",
            ],
          },
          {
            heading: "نگهداری، ایمنی و ماندگاری",
            paragraphs: [
              "ارقام نرم را در سردخانه و ارقام خشک را در محیط خنک و تاریک نگه دارید. کریستال‌های قند روی سطح، پدیده طبیعی تبلور است نه فساد. در مقابل، بوی تخمیر یا الکلی نشانه انحراف دما است و آن لات باید مرجوع شود.",
              "از هر تأمین‌کننده گزارش میکروبیولوژی هر محموله و آزمون باقیمانده سموم را بخواهید. صادرکنندگان معتبر هر دو را بدون درخواست ارائه می‌کنند.",
            ],
          },
        ],
        faq: [
          {
            question: "آیا خرما برای افراد دیابتی مناسب است؟",
            answer:
              "کنترل مقدار مصرف اهمیت دارد، اما شاخص گلیسمی پایین تا متوسط و فیبر بالا، خرما را گزینه بهتری نسبت به شیرینی‌های تصفیه‌شده می‌کند. برای هر ادعا، مقررات برچسب‌گذاری کشور مقصد ملاک است.",
          },
          {
            question: "آیا خرما شکر افزوده دارد؟",
            answer:
              "محصولات ما ندارند. شیرینی کاملاً طبیعی است و تنها روکش مورد استفاده، شکر خرما به‌عنوان عامل ضدچسبندگی روی خرمای خردشده است.",
          },
          {
            question: "لایه سفید روی برخی خرماها چیست؟",
            answer:
              "تبلور طبیعی قند در اثر نگهداری سرد است. کاملاً بی‌ضرر است و با گرم شدن ملایم میوه از بین می‌رود.",
          },
        ],
      },
    },
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getSortedPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  return getSortedPosts()
    .filter((post) => post.slug !== slug)
    .slice(0, limit);
}
