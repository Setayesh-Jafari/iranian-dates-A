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
      fa: "خرمای تازهٔ مضافتی بم",
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
        title: "راهنمای کامل خرید خرمای مضافتی",
        description:
          "هر چیزی که خریدار خرمای مضافتی (کیمیا) باید بداند: درجه‌بندی، رطوبت، تقویم برداشت، زنجیره سرد و نحوهٔ نوشتن مشخصات در سفارش خرید.",
        excerpt:
          "مضافتی همان خرمایی است که نام ایران را سر زبان‌ها انداخت. در این راهنما می‌خوانید درجه‌ها چه فرقی دارند، رطوبت چه تأثیری روی ماندگاری می‌گذارد و در سفارش خرید چه بنویسید تا کانتینرتان بی‌دردسر برسد.",
        keywords: [
          "خرمای مضافتی",
          "خرمای کیمیا",
          "راهنمای خرید خرمای ایرانی",
          "صادرات خرمای بم",
          "رطوبت خرما",
        ],
        intro:
          "مضافتی که در بازارهای بین‌المللی با نام کیمیا شناخته می‌شود، خرمای نرم، تیره و پرشیره‌ای است که بیشتر در منطقهٔ بم در استان کرمان برداشت می‌شود. بخش بزرگی از صادرات خرمای تازهٔ ایران همین رقم است و وقتی خریداری از «خرمای ایرانی» حرف می‌زند، معمولاً منظورش مضافتی است. در این راهنما می‌گوییم این خرما چطور درجه‌بندی می‌شود، چطور باید حمل شود و در سفارش خرید چه چیزهایی را بنویسید.",
        sections: [
          {
            heading: "چه چیزی مضافتی را متفاوت می‌کند",
            paragraphs: [
              "مضافتی در مرحلهٔ رطب برداشت می‌شود؛ یعنی وقتی میوه رنگ کامل گرفته اما هنوز نرم و پررطوبت است. برای همین طعمش به میوهٔ تازه نزدیک‌تر است تا خرمای خشک: بافت نرم، پوست تقریباً سیاه و شیرینی کاراملی به‌جای شیرینی خشک و شکری.",
              "چون میوه کاملاً خشک نشده، مضافتی بدون سرما دوام نمی‌آورد. کارتنی که درست نگهداری شود، دوازده ماه در دمای ۵+ درجه سالم می‌ماند؛ همان کارتن اگر یک هفته در محوطهٔ گرم بندر بماند شروع به تخمیر می‌کند. تقریباً همهٔ شکایت‌های کیفی که بررسی کرده‌ایم به قطع‌شدن زنجیره سرد برمی‌گردد، نه به خود خرما.",
            ],
          },
          {
            heading: "درجه‌بندی: کیمیا، AAA و بقیه",
            paragraphs: [
              "درجه‌بندی بر اساس اندازه، یکدستی رنگ، سالم بودن پوست و درصد دانه‌های معیوب انجام می‌شود. استاندارد قانونی واحدی وجود ندارد؛ برای همین صادرکنندهٔ حرفه‌ای حد و مرز خودش را شفاف اعلام می‌کند و به آن پایبند می‌ماند.",
            ],
            bullets: [
              "کیمیا / AAA: دانهٔ درشت، براق و یکدست با کمتر از ۲ درصد عیب؛ مناسب بسته‌بندی خرده‌فروشی و هدیه.",
              "AA: کمی ریزتر و کم‌یکدست‌تر با کمتر از ۵ درصد عیب؛ مناسب برند اختصاصی فروشگاه‌های زنجیره‌ای.",
              "A: اندازه‌های مخلوط با آسیب سطحی مجاز؛ مناسب مصرف صنعتی، خمیر و شیرهٔ خرما.",
              "پایین‌تر از A: تأمین‌کنندهٔ معتبر آن را برای صادرات پیشنهاد نمی‌دهد.",
            ],
          },
          {
            heading: "رطوبت، قند و ماندگاری",
            paragraphs: [
              "مضافتی صادراتی معمولاً ۱۵ تا ۱۸ درصد رطوبت و ۶۵ تا ۷۰ درصد قند دارد. زیر ۱۵ درصد، خرما نرمی خاص خودش را از دست می‌دهد و بالای ۲۰ درصد، خطر تخمیر و کپک زیاد می‌شود؛ مخصوصاً اگر کانتینر مدتی در هوای گرم بندر بماند.",
              "همیشه رطوبت همان محموله را بخواهید، نه عددی که در کاتالوگ نوشته شده است. برگهٔ آزمایشگاه برای هر محموله — رطوبت، آزمون میکروبی و باقی‌ماندهٔ سموم — باید همراه پیشنهاد قیمت به شما داده شود.",
            ],
          },
          {
            heading: "تقویم برداشت و حمل",
            paragraphs: [
              "برداشت مضافتی از اواخر شهریور تا مهر ادامه دارد. محصول تازه از اوایل پاییز به سالن‌های بسته‌بندی صادراتی می‌رسد و بقیهٔ سال از موجودی سردخانه تأمین می‌شود. قیمت‌ها معمولاً درست بعد از برداشت پایین‌تر است و از اسفند به بعد، با کم‌شدن موجودی، بالا می‌رود.",
              "رزرو زودهنگام مهم است: در هفته‌های پیش از ماه رمضان، ظرفیت کانتینر یخچالی خروجی از بندرعباس کم می‌شود، چون تقاضای کشورهای حاشیهٔ خلیج فارس و جنوب آسیا هم‌زمان بالا می‌رود.",
            ],
          },
          {
            heading: "در سفارش خرید چه بنویسیم",
            paragraphs: [
              "یک سفارش خرید دقیق، ۹۰ درصد اختلاف‌های بعدی را از بین می‌برد. این موارد را بنویسید: رقم و درجه، بازهٔ رطوبت، حد مجاز عیب، تعداد دانه در هر کیلوگرم، بسته‌بندی (وزن بستهٔ وکیوم، وزن کارتن، چیدمان پالت)، دمای حمل، مدارک موردنیاز و روش بازرسی در مقصد.",
            ],
            bullets: [
              "رقم و درجه: مضافتی، کیمیا (AAA)",
              "رطوبت: ۱۵ تا ۱۸ درصد، تأییدشده برای هر محموله",
              "بسته‌بندی: ۱۰ بسته وکیوم ۱ کیلوگرمی در کارتن بهداشتی",
              "حمل: کانتینر یخچالی ۵+ درجه، همراه با گزارش ثبت دما",
              "اسناد: بهداشت، قرنطینه گیاهی، مبدأ، ضدعفونی و کیفیت",
            ],
          },
        ],
        faq: [
          {
            question: "آیا مضافتی و کیمیا یک خرما هستند؟",
            answer:
              "بله. کیمیا نام تجاری مضافتی درجه‌ممتاز در چند بازار صادراتی است و رقم نخل هر دو یکی است.",
          },
          {
            question: "آیا مضافتی به سردخانه نیاز دارد؟",
            answer:
              "بله. نگهداری و حمل باید در دمای ۵+ درجه باشد. در دمای معمولی، رطوبت بالای این رقم ماندگاری را به چند هفته کاهش می‌دهد.",
          },
          {
            question: "حداقل سفارش منطقی برای خرید اول چقدر است؟",
            answer:
              "بیشتر خریداران با یک پالت ترکیبی یا بستهٔ نمونهٔ ۵ کیلوگرمی شروع می‌کنند و بعد از تأیید کیفیت، سراغ کانتینر ۲۰ فوت یخچالی می‌روند.",
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
      fa: "مقایسهٔ ارقام مختلف خرمای ایرانی",
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
        title: "مقایسهٔ ارقام خرمای ایرانی: مضافتی، پیارم، زاهدی و بقیه",
        description:
          "مقایسهٔ کاربردی ارقام اصلی صادراتی خرمای ایران: بافت، رطوبت، ماندگاری، بهترین کاربرد و بازار هدف؛ تا رقم مناسب بازار خودتان را انتخاب کنید.",
        excerpt:
          "شش رقم تقریباً تمام صادرات خرمای ایران را تشکیل می‌دهند. تفاوت آن‌ها در رطوبت، ماندگاری و کاربرد چیست و کدام به درد بازار شما می‌خورد؟",
        keywords: [
          "ارقام خرمای ایرانی",
          "پیارم یا مضافتی",
          "خرمای زاهدی",
          "خرمای کبکاب",
          "خرمای ربی",
          "خرمای سایر",
        ],
        intro:
          "در ایران بیش از چهارصد رقم خرما کشت می‌شود، اما تجارت جهانی عملاً روی شش رقم می‌چرخد. انتخاب بین آن‌ها کمتر به «بهترین بودن» ربط دارد و بیشتر به این بستگی دارد که رطوبت، ماندگاری و قیمت با نوع مصرف مشتری شما جور دربیاید.",
        sections: [
          {
            heading: "ارقام نرم و پررطوبت",
            paragraphs: [
              "مضافتی (کیمیا) رقم شاخص است؛ تیره، نرم و برداشت‌شده در مرحلهٔ رطب با رطوبت ۱۵ تا ۱۸ درصد. زنجیره سرد می‌خواهد، اما در عوض در قفسهٔ فروشگاه قیمت بالاتری می‌گیرد.",
              "کبکاب بوشهر نرم‌تر است و شیرهٔ طبیعی بسیار بالایی دارد؛ همان رقم اقتصادی که پشت صحنهٔ انرژی‌بار، قنادی و تولید شیرهٔ خرماست. ربی از سیستان و بلوچستان دانه‌بلند و خوش‌بافت است و برای مغزدار کردن و بسته‌های مناسبتی عالی است.",
            ],
          },
          {
            heading: "ارقام نیمه‌خشک",
            paragraphs: [
              "پیارم که به خرمای شکلاتی معروف است، نیمه‌خشک با رطوبت ۱۲ تا ۱۵ درصد، طعمی خاص و کم‌شیرین و ماندگاری ۱۸ ماه است. گران‌ترین رقم ایرانی در هر کیلوگرم است و بدون زنجیره سرد کامل هم به‌خوبی حمل می‌شود.",
              "سایر از خوزستان بین ارقام نرم و خشک قرار می‌گیرد. در صنایع پخت کاربردی‌ترین گزینه است و بافت متعادلش آن را به انتخابی مطمئن برای خریدارانی تبدیل می‌کند که تازه با ایران کار می‌کنند.",
            ],
          },
          {
            heading: "ارقام خشک",
            paragraphs: [
              "زاهدی خرمای طلایی، سفت و کم‌رطوبت با ماندگاری ۲۴ ماه است و به سردخانه نیاز ندارد. واحدهای بسته‌بندی، قنادی‌ها و خریداران صنایع غذایی آن را در کارتن ۲۵ کیلوگرمی سفارش می‌دهند، چون در حمل دردسر ندارد و قیمتش پایدار است.",
            ],
            bullets: [
              "مضافتی: رطوبت ۱۵ تا ۱۸ درصد · نیازمند زنجیره سرد · مناسب خرده‌فروشی درجه‌یک",
              "پیارم: ۱۲ تا ۱۵ درصد · نیمه‌خشک · بالاترین قیمت در هر کیلوگرم",
              "کبکاب: ۱۸ تا ۲۲ درصد · پرشیره · مصرف صنعتی و قنادی",
              "ربی: ۱۵ تا ۱۸ درصد · خوش‌بافت · مغزدار کردن و بسته‌های هدیه",
              "سایر: ۱۲ تا ۱۵ درصد · متعادل · صنایع پخت و بسته‌بندی",
              "زاهدی: ۱۰ تا ۱۲ درصد · خشک · فروش عمده با ماندگاری ۲۴ ماه",
            ],
          },
          {
            heading: "کدام رقم برای کدام بازار",
            paragraphs: [
              "فروشگاه‌های زنجیره‌ای حاشیهٔ خلیج فارس و جنوب آسیا مضافتی و پیارم را برای بسته‌های برنددار می‌خرند. برندهای اختصاصی اروپا معمولاً با زاهدی و سایر شروع می‌کنند، چون حمل در دمای معمولی ساده‌تر است. خریداران صنعتی — تولیدکنندگان انرژی‌بار، نانوایی‌های صنعتی و کارخانه‌های شیره — بیشتر خمیر کبکاب یا زاهدی خردشده می‌گیرند.",
              "اگر بازار تازه‌ای را امتحان می‌کنید، اول یک بستهٔ نمونهٔ ترکیبی سفارش دهید. پنج کیلوگرم از پنج رقم، هزینه‌ای بسیار کمتر از یک کانتینر اشتباه دارد و دقیقاً نشان می‌دهد مشتری شما کدام را می‌پسندد.",
            ],
          },
        ],
        faq: [
          {
            question: "کدام خرمای ایرانی بیشترین ماندگاری را دارد؟",
            answer:
              "زاهدی با ۲۴ ماه و بدون نیاز به سردخانه؛ بعد از آن پیارم و سایر با حدود ۱۸ ماه.",
          },
          {
            question: "کدام رقم به مدجول نزدیک‌تر است؟",
            answer:
              "ارقام نرم و درشت جنوب شرق ایران که هم‌تراز مدجول عرضه می‌شوند، از نظر اندازه و بافت نزدیک‌ترین گزینه‌اند، آن هم با قیمتی به‌مراتب کمتر.",
          },
          {
            question: "آیا می‌توان چند رقم را در یک کانتینر ارسال کرد؟",
            answer:
              "بله، به شرطی که دمای موردنیازشان یکی باشد. مضافتی پررطوبت را از بار خشکی که در دمای معمولی حمل می‌شود جدا نگه دارید.",
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
      fa: "کارتن‌های صادراتی خرمای ایرانی آمادهٔ حمل",
    },
    tag: { en: "Export & Logistics", fa: "صادرات و حمل" },
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
          "راهنمای گام‌به‌گام برای واردکنندگان خرمای ایرانی: مدارک لازم، اینکوترمز، تنظیمات کانتینر یخچالی، شرایط پرداخت و نحوهٔ صدور پیش‌فاکتور.",
        excerpt:
          "از استعلام تا تحویل: مدارکی که باید همراه هر محموله باشد، اینکوترمزهایی که واقعاً مهم‌اند و تنظیمات کانتینر یخچالی که بار شما را سالم نگه می‌دارد.",
        keywords: [
          "واردات خرمای ایرانی",
          "گواهی قرنطینه گیاهی",
          "گواهی مبدأ",
          "تحویل FOB بندرعباس",
          "کانتینر یخچالی خرما",
        ],
        intro:
          "خرید خرما از ایران وقتی مسیر مدارک را بشناسید کار سختی نیست. این راهنما یک معاملهٔ کامل را از نخستین استعلام تا رسیدن کانتینر به بندر شما مرور می‌کند و می‌گوید صادرکنندهٔ حرفه‌ای در هر مرحله باید چه چیزی به شما بدهد.",
        sections: [
          {
            heading: "گام ۱ — استعلام و پیشنهاد قیمت",
            paragraphs: [
              "به‌جای نام محصول، مشخصات بفرستید: رقم، درجه، مقدار، بسته‌بندی، بندر مقصد و بازهٔ زمانی تحویل. صادرکنندهٔ حرفه‌ای با یک پیشنهاد کتبی جواب می‌دهد که در آن رقم و درجه، بسته‌بندی، مبنای قیمت، مدت اعتبار پیشنهاد، زمان آماده‌سازی بار، شرایط پرداخت و مدارک همراه محموله مشخص شده باشد.",
              "چون قیمت خرما با فصل برداشت، نرخ حمل و نرخ ارز بالا و پایین می‌شود، پیش‌فاکتور برای هر استعلام جداگانه صادر می‌شود و معمولاً هفت تا چهارده روز اعتبار دارد.",
            ],
          },
          {
            heading: "گام ۲ — مدارکی که همراه بار می‌روند",
            paragraphs: [
              "همراه یک محمولهٔ استاندارد پنج مدرک فرستاده می‌شود. نبودِ حتی یکی از آن‌ها رایج‌ترین دلیل ماندن کانتینر در گمرک مقصد است.",
            ],
            bullets: [
              "گواهی بهداشت — تأیید ایمنی میکروبی، برای هر محموله جداگانه.",
              "گواهی قرنطینهٔ گیاهی — تأیید نبودِ آفات قرنطینه‌ای در بار.",
              "گواهی مبدأ — صادرشده از اتاق بازرگانی؛ برای ما، اتاق بازرگانی اصفهان.",
              "گواهی ضدعفونی — ضدعفونی کانتینر و پالت چوبی پیش از بارگیری.",
              "برگهٔ کنترل کیفیت و درجه‌بندی، به‌همراه فاکتور تجاری و لیست بسته‌بندی.",
            ],
          },
          {
            heading: "گام ۳ — اینکوترمز و مسئولیت ریسک",
            paragraphs: [
              "بیشتر صادرات خرمای ایران با شرط FOB بندرعباس انجام می‌شود: صادرکننده کانتینر بارگیری‌شده را روی کشتی تحویل می‌دهد و کرایهٔ دریایی با خریدار است. شرایط CFR و CIF هم قابل ارائه است و EXW مناسب خریدارانی است که داخل ایران نمایندهٔ حمل دارند.",
              "هر شرطی را که انتخاب کردید، کتباً مشخص کنید هزینهٔ توقف کانتینر، جریمهٔ دیرکرد (دموراژ) و ادعای مربوط به نوسان دما با کیست. همین یک بند، بیشتر اختلاف‌های بعد از تحویل را از بین می‌برد.",
            ],
          },
          {
            heading: "گام ۴ — زنجیره سرد و تنظیمات کانتینر",
            paragraphs: [
              "ارقام پررطوبت در کانتینر یخچالی با دمای ۵+ درجه و دریچهٔ تهویهٔ بسته حمل می‌شوند. دمای داخل میوه هنگام بارگیری، شمارهٔ کانتینر و گزارش ثبت دما هنگام تخلیه را از فروشنده بخواهید. ارقام خشک مثل زاهدی در کانتینر معمولی و همراه با بسته‌های رطوبت‌گیر ارسال می‌شوند.",
              "بار باید پالت‌بندی و استرچ‌پیچ شود و بین ردیف‌ها مسیر گردش هوا بماند. کارتن‌هایی که کاملاً به دیوارهٔ کانتینر یخچالی چسبیده‌اند جلوی جریان هوا را می‌گیرند و نقاط گرم درست می‌کنند؛ علتی رایج و کاملاً قابل پیشگیری برای شکایت در مقصد.",
            ],
          },
          {
            heading: "گام ۵ — پرداخت و نکات اولین سفارش",
            paragraphs: [
              "شرط رایج، ۳۰ درصد پیش‌پرداخت و تسویه در برابر کپی مدارک است؛ برای حجم‌های بالاتر هم اعتبار اسنادی برگشت‌ناپذیر دیداری. خریداران باسابقه بعد از چند محمولهٔ سالم، پرداخت مدت‌دار را مذاکره می‌کنند.",
              "برای اولین معامله یک بستهٔ نمونه سفارش دهید، کیفیت را کتباً تأیید کنید و بعد سراغ کانتینر کامل بروید. این مسیر دو هفته دیرتر جواب می‌دهد، اما بسیار ارزان‌تر از یک بار مرجوعی است.",
            ],
          },
        ],
        faq: [
          {
            question: "زمان حمل چقدر است؟",
            answer:
              "معمولاً ۵ تا ۱۰ روز تا بنادر خلیج فارس، ۱۲ تا ۲۰ روز تا جنوب آسیا و ۲۵ تا ۳۵ روز تا شمال اروپا؛ بسته به اینکه بار در بندر واسط جابه‌جا شود یا نه.",
          },
          {
            question: "آیا امکان ارسال چند رقم در یک کانتینر هست؟",
            answer:
              "بله، اگر دمای موردنیاز یکسان باشد. ما پالت ترکیبی با لیست بسته‌بندی جداگانه برای هر پالت آماده می‌کنیم.",
          },
          {
            question: "آیا بسته‌بندی با برند خریدار ارائه می‌کنید؟",
            answer:
              "بله؛ بسته، کارتن و پک خرده‌فروشی با برند شما چاپ می‌شود. آماده‌سازی طرح حدود سه هفته طول می‌کشد.",
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
      fa: "خرما همراه مغزها و چای",
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
        title: "ارزش غذایی خرما: قبل از هر ادعای سلامت این‌ها را بدانید",
        description:
          "فیبر، پتاسیم، شاخص گلیسمی و مزیت فهرست مواد اولیهٔ کوتاه؛ واقعیت‌های تغذیه‌ای خرمای ایرانی و روش درست بیان آن‌ها روی بسته‌بندی.",
        excerpt:
          "خرما را طعمش می‌فروشد، اما ارزش غذایی‌اش مشتری را برمی‌گرداند. اعداد واقعی فیبر، پتاسیم و شاخص گلیسمی و ادعاهایی که با خیال راحت می‌توانید روی بسته بنویسید.",
        keywords: [
          "ارزش غذایی خرما",
          "شاخص گلیسمی خرما",
          "فیبر و پتاسیم خرما",
          "شیرین‌کننده طبیعی",
          "برچسب تمیز",
        ],
        intro:
          "خرما از معدود مواد اولیه‌ای است که هم «خوشمزه» است و هم «سالم». برای صاحبان برند و خریداران صنعتی، شناخت ارزش غذایی واقعی آن هم در فرمولاسیون مهم است و هم در رعایت قوانین برچسب‌گذاری.",
        sections: [
          {
            heading: "ارزش غذایی خرما در یک نگاه",
            paragraphs: [
              "هر ۱۰۰ گرم خرما حدود ۲۷۵ تا ۳۲۰ کیلوکالری انرژی، ۶۵ تا ۷۵ گرم کربوهیدرات، ۶ تا ۸ گرم فیبر و ۶۵۰ تا ۷۰۰ میلی‌گرم پتاسیم دارد؛ همراه با منیزیم، مس، منگنز و ویتامین‌های گروه B. چربی و نمک آن تقریباً صفر است.",
              "این اعداد بسته به رقم و رطوبت فرق می‌کند: مضافتی پررطوبت در هر ۱۰۰ گرم کالری کمتری از زاهدی خشک دارد، فقط به این دلیل که بخش بیشتری از وزنش آب است.",
            ],
          },
          {
            heading: "شاخص گلیسمی و قند خون",
            paragraphs: [
              "با وجود شیرینی، بیشتر ارقام خرما شاخص گلیسمی پایین تا متوسط دارند؛ معمولاً بین ۴۲ تا ۶۲ گزارش می‌شود، چون قندشان همراه فیبر و پلی‌فنول جذب می‌شود. همین موضوع پایهٔ معرفی شکر خرما و خمیر خرما به‌عنوان جایگزین ملایم‌تر شکر سفید است.",
              "در بیان این موضوع محتاط باشید. عبارت «شاخص گلیسمی پایین‌تر از شکر سفید» قابل دفاع است، اما ادعای کلیِ سلامت معمولاً نه؛ ضمن اینکه قوانین برچسب‌گذاری در هر کشور فرق می‌کند.",
            ],
          },
          {
            heading: "چرا صنایع غذایی سراغ خرما می‌روند",
            paragraphs: [
              "خمیر خرما در انرژی‌بار هم‌زمان جای شکر و چسباننده را می‌گیرد و فهرست مواد اولیه را خیلی کوتاه می‌کند. شیرهٔ خرما به محصولات پختنی رنگ، رطوبت و طعم کاراملی می‌دهد. شکر خرما هم فیبر و املاحی را نگه می‌دارد که در شکر سفید از بین می‌رود.",
            ],
            bullets: [
              "فهرست مواد اولیهٔ کوتاه: یک ماده، بدون افزودنی",
              "حفظ طبیعی رطوبت و نرمی محصولات پختنی",
              "هم‌زمان شیرین‌کننده و چسباننده در انرژی‌بار",
              "به‌طور طبیعی وگان، بدون گلوتن و کم‌حساسیت‌زا (مناسب اغلب رژیم‌ها)",
            ],
          },
          {
            heading: "نگهداری، ایمنی و ماندگاری",
            paragraphs: [
              "ارقام نرم را در سردخانه و ارقام خشک را در جای خنک و تاریک نگه دارید. دانه‌های ریز قند روی سطح خرما، تبلور طبیعی است نه فساد. اما بوی تخمیر یا بوی الکل نشانهٔ بالا رفتن دما در مسیر است و آن محموله باید مرجوع شود.",
              "از هر تأمین‌کننده برای هر محموله، برگهٔ آزمون میکروبی و آزمون باقی‌ماندهٔ سموم بخواهید. صادرکنندهٔ معتبر هر دو را بدون اینکه بخواهید ارائه می‌کند.",
            ],
          },
        ],
        faq: [
          {
            question: "آیا خرما برای افراد دیابتی مناسب است؟",
            answer:
              "اندازهٔ مصرف مهم است، اما شاخص گلیسمی پایین تا متوسط و فیبر بالا، خرما را گزینهٔ بهتری نسبت به شیرینی‌های صنعتی می‌کند. برای هر ادعای سلامت، قوانین برچسب‌گذاری کشور مقصد ملاک است.",
          },
          {
            question: "آیا خرما شکر افزوده دارد؟",
            answer:
              "محصولات ما ندارند. شیرینی کاملاً طبیعی است و تنها پوششی که استفاده می‌کنیم، پودر شکر خرما روی خرمای خردشده است تا قطعات به هم نچسبند.",
          },
          {
            question: "لایه سفید روی برخی خرماها چیست؟",
            answer:
              "تبلور طبیعی قند در اثر نگهداری در سرماست؛ کاملاً بی‌ضرر است و وقتی خرما کمی گرم شود از بین می‌رود.",
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
