(() => {
  const t = (ar, en) => ({ ar, en });
  const s = (ar, en, value) => ({ label: t(ar, en), value });
  const imageSet = (category, slug, numbers) => numbers.map((number) => `assets/products/${category}/${slug}/${number}.webp`);

  const descriptions = {
    rotary: t('مطرقة دورانية سلكية للاستخدام المهني في أعمال الحفر والطرق، مصممة لأداء ثابت وتحكم عملي في مواقع العمل.', 'A corded rotary hammer for professional drilling and hammering work, designed for consistent performance and practical jobsite control.'),
    demolition: t('مطرقة هدم كهربائية سلكية للأعمال الشاقة وإزالة الخرسانة والبناء، بهيكل متين وطاقة طرق عالية.', 'A heavy-duty corded demolition hammer for concrete and construction removal, with a durable build and high impact energy.'),
    grinder: t('جلّاخة زاوية كهربائية سلكية للقص والتجليخ في الورش ومواقع العمل، بسرعة عالية وتصميم عملي.', 'A corded angle grinder for cutting and grinding in workshops and jobsites, with high speed and a practical design.'),
    cutter: t('قاطع معدني كهربائي سلكي لعمليات القص المهنية، مزود بقرص كبير وقدرة مناسبة لأعمال الورش.', 'A corded cut-off saw for professional metal cutting, equipped with a large blade and workshop-ready power.'),
    generator: t('مولد بنزين مفتوح أحادي الطور لتوفير الطاقة الاحتياطية والاستخدام في مواقع العمل، مع تشغيل يدوي وخزان وقود عملي.', 'An open-type single-phase gasoline generator for backup power and jobsite use, with hand start and a practical fuel tank.'),
    booster: t('مضخة تعزيز ذاتية التحضير بمحرك نحاسي وحماية حرارية مدمجة، مناسبة لضخ المياه ورفع الضغط.', 'A self-priming booster pump with a copper-wire motor and built-in thermal protection, suitable for water transfer and pressure boosting.'),
    jet: t('مضخة نفاثة برأس من الحديد الزهر ومحرك نحاسي أحادي الطور، مناسبة لضخ المياه للاستخدامات المنزلية والمهنية.', 'A jet pump with a cast-iron pump head and single-phase copper-wire motor, suitable for domestic and professional water pumping.')
  };

  const products = [
    {
      slug: 'al-2601', category: 'corded', model: 'AL-2601', name: t('مطرقة دورانية', 'Rotary Hammer'), description: descriptions.rotary,
      images: imageSet('corded', 'al-2601', [1, 2, 3, 4, 5]),
      specs: [s('القدرة الاسمية', 'Rated input power', '850 W'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('السرعة دون حمل', 'No-load speed', '1150 rpm'), s('معدل الطرق', 'Impact rate', '5300/min'), s('طاقة الطرق', 'Impact energy', '2.8 J'), s('سعة الحفر', 'Drilling capacity', 'Wood 28 mm · Concrete 20 mm · Steel 13 mm'), s('طول السلك', 'Cord length', '2.6 m'), s('الوزن الصافي', 'Net weight', '3 kg')]
    },
    {
      slug: 'al-26g', category: 'corded', model: 'AL-26G', name: t('مطرقة دورانية', 'Rotary Hammer'), description: descriptions.rotary,
      images: imageSet('corded', 'al-26g', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '1050 W'), s('السرعة دون حمل', 'No-load speed', '800 rpm'), s('طاقة الطرق', 'Impact energy', '4.5 J'), s('معدل الطرق', 'Impact rate', '4200/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('سعة الحفر', 'Drilling capacity', '28 mm'), s('الوظائف', 'Functions', 'Hammer · Hammer drill'), s('الوزن الصافي', 'Net weight', '4.8 kg'), s('نظام التثبيت', 'Tool holder', 'SDS Plus')]
    },
    {
      slug: 'al-32g', category: 'corded', model: 'AL-32G', name: t('مطرقة دورانية', 'Rotary Hammer'), description: descriptions.rotary,
      images: imageSet('corded', 'al-32g', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '1500 W'), s('السرعة دون حمل', 'No-load speed', '200–850 rpm'), s('طاقة الطرق', 'Impact energy', '5.5 J'), s('معدل الطرق', 'Impact rate', '4400/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('سعة الحفر', 'Drilling capacity', '32 mm'), s('الوظائف', 'Functions', 'Hammer · Drill · Hammer drill'), s('الوزن الصافي', 'Net weight', '5 kg'), s('نظام التثبيت', 'Tool holder', 'SDS Plus'), s('ميزة إضافية', 'Additional feature', 'Anti-vibration')]
    },
    {
      slug: 'al-42hh', category: 'corded', model: 'AL-42HH', name: t('مطرقة دورانية', 'Rotary Hammer'), description: descriptions.rotary,
      images: imageSet('corded', 'al-42hh', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '1600 W'), s('السرعة دون حمل', 'No-load speed', '0–590 rpm'), s('طاقة الطرق', 'Impact energy', '10 J'), s('معدل الطرق', 'Impact rate', '4000/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('سعة الحفر', 'Drilling capacity', '42 mm'), s('الوظائف', 'Functions', 'Hammer · Hammer drill'), s('الوزن الصافي', 'Net weight', '7 kg'), s('نظام التثبيت', 'Tool holder', 'SDS Max'), s('ميزات إضافية', 'Additional features', 'Anti-vibration · Variable speed')]
    },
    {
      slug: 'al-95a', category: 'corded', model: 'AL-95A', name: t('مطرقة هدم', 'Demolition Hammer'), description: descriptions.demolition,
      images: imageSet('corded', 'al-95a', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '1800 W'), s('طاقة الطرق', 'Impact energy', '55 J'), s('معدل الطرق', 'Impact rate', '2100/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('الوزن الصافي', 'Net weight', '16.2 kg'), s('نظام التثبيت', 'Tool holder', 'Hex')]
    },
    {
      slug: 'al-ak198', category: 'corded', model: 'AL-AK198', name: t('قاطع معدني', 'Cut-off Saw'), description: descriptions.cutter,
      images: imageSet('corded', 'al-ak198', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Input power', '3000 W'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('السرعة دون حمل', 'No-load speed', '4000 rpm'), s('قياس القرص', 'Blade size', '350 × 25.4 mm'), s('عمق القص', 'Cutting depth', '40 mm'), s('عرض القص', 'Cutting width', '40 mm'), s('الوزن الصافي', 'Net weight', '9 kg')]
    },
    {
      slug: 'al-ak911', category: 'corded', model: 'AL-AK911', name: t('مطرقة هدم', 'Demolition Hammer'), description: descriptions.demolition,
      images: imageSet('corded', 'al-ak911', [1, 2, 3, 4, 5]),
      specs: [s('نظام التشحيم', 'Lubrication', 'Grease system'), s('القدرة الاسمية', 'Rated input power', '2000 W'), s('طاقة الطرق', 'Impact energy', '55 J'), s('معدل الطرق', 'Impact rate', '1520/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('الوزن الصافي', 'Net weight', '17.5 kg'), s('نظام التثبيت', 'Tool holder', 'Hex')]
    },
    {
      slug: 'al-ak958', category: 'corded', model: 'AL-AK958', name: t('مطرقة هدم احترافية', 'Professional Demolition Hammer'), description: descriptions.demolition,
      images: imageSet('corded', 'al-ak958', [1, 2, 3, 4, 5]),
      specs: [s('نظام التشحيم', 'Lubrication', 'Grease system'), s('القدرة الاسمية', 'Rated input power', '2000 W'), s('طاقة الطرق', 'Impact energy', '55 J'), s('معدل الطرق', 'Impact rate', '1520/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('الوزن الصافي', 'Net weight', '18 kg'), s('نظام التثبيت', 'Tool holder', 'Hex')]
    },
    {
      slug: 'al-g40', category: 'corded', model: 'AL-G40', name: t('مطرقة هدم', 'Demolition Hammer'), description: descriptions.demolition,
      images: imageSet('corded', 'al-g40', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '1500 W'), s('طاقة الطرق', 'Impact energy', '18 J'), s('معدل الطرق', 'Impact rate', '3900/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('الوزن الصافي', 'Net weight', '6.2 kg'), s('نظام التثبيت', 'Tool holder', 'Hex 17')]
    },
    {
      slug: 'al-g500', category: 'corded', model: 'AL-G500', name: t('مطرقة هدم', 'Demolition Hammer'), description: descriptions.demolition,
      images: imageSet('corded', 'al-g500', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '1700 W'), s('طاقة الطرق', 'Impact energy', '55 J'), s('معدل الطرق', 'Impact rate', '2000/min'), s('الجهد الاسمي', 'Rated voltage', '110/230 V'), s('التردد', 'Rated frequency', '50/60 Hz'), s('الوزن الصافي', 'Net weight', '15 kg'), s('نظام التثبيت', 'Tool holder', 'Hex')]
    },
    {
      slug: 'al-61186', category: 'corded', model: 'AL-61186', name: t('جلّاخة زاوية', 'Angle Grinder'), description: descriptions.grinder,
      images: imageSet('corded', 'al-61186', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '2000 W'), s('الجهد الاسمي', 'Rated voltage', '230 V'), s('التردد', 'Rated frequency', '50 Hz'), s('السرعة دون حمل', 'No-load speed', '6000 rpm'), s('قطر القرص', 'Disc diameter', '230 mm')]
    },
    {
      slug: 'al-61188', category: 'corded', model: 'AL-61188', name: t('جلّاخة زاوية', 'Angle Grinder'), description: descriptions.grinder,
      images: imageSet('corded', 'al-61188', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '2400 W'), s('الجهد الاسمي', 'Rated voltage', '230 V'), s('التردد', 'Rated frequency', '50 Hz'), s('السرعة دون حمل', 'No-load speed', '6000 rpm'), s('قطر القرص', 'Disc diameter', '230 mm')]
    },
    {
      slug: 'al-a61167', category: 'corded', model: 'AL-A61167', name: t('جلّاخة زاوية', 'Angle Grinder'), description: descriptions.grinder,
      images: imageSet('corded', 'al-a61167', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة الاسمية', 'Rated input power', '600 W'), s('الجهد الاسمي', 'Rated voltage', '230 V'), s('التردد', 'Rated frequency', '50 Hz'), s('السرعة دون حمل', 'No-load speed', '11000 rpm'), s('قطر القرص', 'Disc diameter', '115/125 mm')]
    },
    {
      slug: 'al-a62705a', category: 'corded', model: 'AL-A62705A', name: t('جلّاخة زاوية', 'Angle Grinder'), description: descriptions.grinder,
      images: imageSet('corded', 'al-a62705a', [1, 2, 3, 4, 5]),
      specs: [s('القدرة الاسمية', 'Rated input power', '800 W'), s('الجهد الاسمي', 'Rated voltage', '230 V'), s('التردد', 'Rated frequency', '50 Hz'), s('السرعة دون حمل', 'No-load speed', '11000 rpm'), s('قطر القرص', 'Disc diameter', '115/125 mm')]
    },
    {
      slug: 'younex-3kw', category: 'generators', model: 'Younex 3 kW', name: t('مولد بنزين مفتوح', 'Open Gasoline Generator'), description: descriptions.generator,
      images: imageSet('generators', 'younex-3kw', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '3 kW'), s('نوع الوقود', 'Fuel', 'Gasoline'), s('موديل المحرك', 'Engine model', 'YHS170F'), s('سعة المحرك', 'Displacement', '220 cc'), s('الطور', 'Phase', 'Single phase'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('طريقة التشغيل', 'Starting system', 'Hand start'), s('سعة خزان الوقود', 'Fuel tank capacity', '12 L'), s('الأبعاد', 'Dimensions', '605 × 465 × 460 mm'), s('الوزن', 'Weight', '39 kg')]
    },
    {
      slug: 'younex-4kw', category: 'generators', model: 'Younex 4 kW', name: t('مولد بنزين مفتوح', 'Open Gasoline Generator'), description: descriptions.generator,
      images: imageSet('generators', 'younex-4kw', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '4 kW'), s('نوع الوقود', 'Fuel', 'Gasoline'), s('موديل المحرك', 'Engine model', 'YHS170F'), s('سعة المحرك', 'Displacement', '300 cc'), s('الطور', 'Phase', 'Single phase'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('طريقة التشغيل', 'Starting system', 'Hand start'), s('سعة خزان الوقود', 'Fuel tank capacity', '12 L'), s('الأبعاد', 'Dimensions', '605 × 465 × 460 mm'), s('الوزن', 'Weight', '45 kg')]
    },
    {
      slug: 'younex-5kw', category: 'generators', model: 'Younex 5 kW', name: t('مولد بنزين مفتوح', 'Open Gasoline Generator'), description: descriptions.generator,
      images: imageSet('generators', 'younex-5kw', [1, 2, 3, 4, 6]),
      specs: [s('القدرة', 'Power', '5 kW'), s('نوع الوقود', 'Fuel', 'Gasoline'), s('موديل المحرك', 'Engine model', 'YHS188F'), s('سعة المحرك', 'Displacement', '420 cc'), s('الطور', 'Phase', 'Single phase'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('طريقة التشغيل', 'Starting system', 'Hand start'), s('سعة خزان الوقود', 'Fuel tank capacity', '25 L'), s('الأبعاد', 'Dimensions', '690 × 530 × 560 mm'), s('الوزن', 'Weight', '78 kg')]
    },
    {
      slug: 'wzb-400a', category: 'water-pumps', model: 'WZB-400A', name: t('مضخة تعزيز ذاتية التحضير', 'Self-Priming Booster Pump'), description: descriptions.booster,
      images: imageSet('water-pumps', 'wzb-400a', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة', 'Power', '0.4 kW'), s('القوة الحصانية', 'Horsepower', '0.5 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('أقصى شفط', 'Maximum suction', '8.5 m'), s('أقصى ارتفاع', 'Maximum head', '35 m'), s('معدل التدفق', 'Flow rate', '2.5 m³/h'), s('قطر المخرج', 'Outlet diameter', '25 mm'), s('الطوابق المقترحة', 'Recommended floors', '4–6'), s('أقصى حرارة للسائل', 'Maximum liquid temperature', '+80°C')]
    },
    {
      slug: 'wzb-600a', category: 'water-pumps', model: 'WZB-600A', name: t('مضخة تعزيز ذاتية التحضير', 'Self-Priming Booster Pump'), description: descriptions.booster,
      images: imageSet('water-pumps', 'wzb-600a', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة', 'Power', '0.6 kW'), s('القوة الحصانية', 'Horsepower', '0.75 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('أقصى شفط', 'Maximum suction', '8.5 m'), s('أقصى ارتفاع', 'Maximum head', '45 m'), s('معدل التدفق', 'Flow rate', '3.0 m³/h'), s('قطر المخرج', 'Outlet diameter', '25 mm'), s('الطوابق المقترحة', 'Recommended floors', '6–7'), s('أقصى حرارة للسائل', 'Maximum liquid temperature', '+80°C')]
    },
    {
      slug: 'wzb-800a', category: 'water-pumps', model: 'WZB-800A', name: t('مضخة تعزيز ذاتية التحضير', 'Self-Priming Booster Pump'), description: descriptions.booster,
      images: imageSet('water-pumps', 'wzb-800a', [1, 2, 3, 4, 5, 6]),
      specs: [s('القدرة', 'Power', '0.8 kW'), s('القوة الحصانية', 'Horsepower', '1 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('أقصى شفط', 'Maximum suction', '8.5 m'), s('أقصى ارتفاع', 'Maximum head', '50 m'), s('معدل التدفق', 'Flow rate', '3.5 m³/h'), s('قطر المخرج', 'Outlet diameter', '25 mm'), s('الطوابق المقترحة', 'Recommended floors', '7–8'), s('أقصى حرارة للسائل', 'Maximum liquid temperature', '+80°C')]
    },
    {
      slug: 'qb60', category: 'water-pumps', model: 'QB60', name: t('مضخة مياه دوّامية احترافية', 'Professional Vortex Water Pump'), description: descriptions.booster,
      images: imageSet('water-pumps', 'qb60', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '0.37 kW'), s('القوة الحصانية', 'Horsepower', '0.5 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('المدخل والمخرج', 'Inlet / outlet', '1 in × 1 in'), s('أقصى شفط', 'Maximum suction', '9 m'), s('أقصى ارتفاع', 'Maximum head', '35 m'), s('أقصى تدفق', 'Maximum flow', '35 L/min'), s('أبعاد التغليف', 'Packing dimensions', '265 × 130 × 160 mm'), s('أقصى حرارة للسائل', 'Maximum liquid temperature', '+40°C')]
    },
    {
      slug: 'qb70', category: 'water-pumps', model: 'QB70', name: t('مضخة مياه دوّامية احترافية', 'Professional Vortex Water Pump'), description: descriptions.booster,
      images: imageSet('water-pumps', 'qb70', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '0.55 kW'), s('القوة الحصانية', 'Horsepower', '0.75 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('المدخل والمخرج', 'Inlet / outlet', '1 in × 1 in'), s('أقصى شفط', 'Maximum suction', '9 m'), s('أقصى ارتفاع', 'Maximum head', '50 m'), s('أقصى تدفق', 'Maximum flow', '45 L/min'), s('أبعاد التغليف', 'Packing dimensions', '325 × 160 × 200 mm'), s('أقصى حرارة للسائل', 'Maximum liquid temperature', '+40°C')]
    },
    {
      slug: 'qb80', category: 'water-pumps', model: 'QB80', name: t('مضخة مياه دوّامية احترافية', 'Professional Vortex Water Pump'), description: descriptions.booster,
      images: imageSet('water-pumps', 'qb80', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '0.75 kW'), s('القوة الحصانية', 'Horsepower', '1 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('المدخل والمخرج', 'Inlet / outlet', '1 in × 1 in'), s('أقصى شفط', 'Maximum suction', '9 m'), s('أقصى ارتفاع', 'Maximum head', '60 m'), s('أقصى تدفق', 'Maximum flow', '50 L/min'), s('أبعاد التغليف', 'Packing dimensions', '325 × 160 × 200 mm'), s('أقصى حرارة للسائل', 'Maximum liquid temperature', '+40°C')]
    },
    {
      slug: 'jet-60', category: 'water-pumps', model: 'JET-60', name: t('مضخة نفاثة', 'Jet Pump'), description: descriptions.jet,
      images: imageSet('water-pumps', 'jet-60', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '0.37 kW'), s('القوة الحصانية', 'Horsepower', '0.6 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('أقصى شفط', 'Maximum suction', '9 m'), s('أقصى ارتفاع', 'Maximum head', '30 m'), s('أقصى تدفق', 'Maximum flow', '35 m³/h'), s('السرعة', 'Speed', '2860 rpm'), s('قطر الأنبوب', 'Pipe diameter', '25 mm'), s('أقصى حرارة', 'Maximum temperature', '+40°C')]
    },
    {
      slug: 'jet-80', category: 'water-pumps', model: 'JET-80', name: t('مضخة نفاثة', 'Jet Pump'), description: descriptions.jet,
      images: imageSet('water-pumps', 'jet-80', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '0.55 kW'), s('القوة الحصانية', 'Horsepower', '0.8 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('أقصى شفط', 'Maximum suction', '9 m'), s('أقصى ارتفاع', 'Maximum head', '35 m'), s('أقصى تدفق', 'Maximum flow', '40 m³/h'), s('السرعة', 'Speed', '2860 rpm'), s('قطر الأنبوب', 'Pipe diameter', '25 mm'), s('أقصى حرارة', 'Maximum temperature', '+40°C')]
    },
    {
      slug: 'jet-100', category: 'water-pumps', model: 'JET-100', name: t('مضخة نفاثة', 'Jet Pump'), description: descriptions.jet,
      images: imageSet('water-pumps', 'jet-100', [1, 2, 3, 4, 5]),
      specs: [s('القدرة', 'Power', '0.75 kW'), s('القوة الحصانية', 'Horsepower', '1 HP'), s('الجهد والتردد', 'Voltage / frequency', '220 V / 50 Hz'), s('أقصى شفط', 'Maximum suction', '9 m'), s('أقصى ارتفاع', 'Maximum head', '40 m'), s('أقصى تدفق', 'Maximum flow', '50 m³/h'), s('السرعة', 'Speed', '2860 rpm'), s('قطر الأنبوب', 'Pipe diameter', '25 mm'), s('أقصى حرارة', 'Maximum temperature', '+40°C')]
    }
  ];

  window.YOUNEX_CATALOG = {
    categories: [
      { id: 'corded', name: t('معدات كهربائية سلكية', 'Corded Power Tools'), description: t('معدات احترافية تعمل على الكهرباء بجهد 220–230 فولت.', 'Professional power tools operating on 220–230 V mains power.'), cover: 'assets/products/corded/al-42hh/1.webp', status: 'available' },
      { id: 'cordless', name: t('معدات تعمل على البطاريات', 'Cordless Power Tools'), description: t('تشكيلة أدوات بطارية عملية ومرنة ستتوفر قريبًا.', 'A practical and flexible cordless tool range arriving soon.'), cover: null, status: 'soon' },
      { id: 'generators', name: t('مولدات كهربائية', 'Electric Generators'), description: t('مولدات بنزين للاستخدام الاحتياطي ومواقع العمل.', 'Gasoline generators for backup power and jobsites.'), cover: 'assets/products/generators/younex-5kw/1.webp', status: 'available' },
      { id: 'water-pumps', name: t('مضخات مياه', 'Water Pumps'), description: t('مضخات نفاثة ومضخات تعزيز لمختلف احتياجات المياه.', 'Jet and booster pumps for a variety of water applications.'), cover: 'assets/products/water-pumps/wzb-600a/1.webp', status: 'available' }
    ],
    products
  };
})();
