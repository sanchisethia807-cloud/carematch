export type Specialty = {
  name: string;
  plainName: string;
  treats: string;
  firstVisit: string;
  bring: string[];
};

export const SPECIALTIES: Specialty[] = [
  {
    name: "Cardiology",
    plainName: "Heart doctor",
    treats:
      "Problems with the heart and blood vessels — chest discomfort, palpitations, high blood pressure, swelling in the legs, and shortness of breath during activity.",
    firstVisit:
      "Expect blood pressure and pulse checks, a physical exam, and usually an EKG, which is a painless recording of your heartbeat taken with stickers on your chest. You may be sent for an ultrasound of the heart afterward.",
    bring: [
      "A list of every medication and supplement you take",
      "Any blood pressure readings you've taken at home",
      "Whether any close relatives had heart problems, and at what age",
    ],
  },
  {
    name: "Pulmonology",
    plainName: "Lung doctor",
    treats:
      "Breathing and lung problems — long-lasting cough, wheezing, breathlessness, and sleep-related breathing trouble.",
    firstVisit:
      "Expect a breathing test where you blow hard into a tube, plus listening to your chest. A chest scan is common on a first visit.",
    bring: [
      "Whether you smoke or used to, and for how long",
      "Any inhalers you've tried, including ones that didn't help",
      "What makes the breathing worse — stairs, cold air, lying flat, pets",
    ],
  },
  {
    name: "Orthopedics",
    plainName: "Bone and joint doctor",
    treats:
      "Bones, joints, muscles, and ligaments — injuries, joint pain, back and neck pain, and problems with movement.",
    firstVisit:
      "Expect the doctor to move the painful joint through different positions and compare it to your other side. X-rays are usually taken the same day.",
    bring: [
      "How the pain started — a specific injury, or gradually",
      "What movements make it worse, and what makes it better",
      "Any earlier scans or images of the same area",
    ],
  },
  {
    name: "Neurology",
    plainName: "Brain and nerve doctor",
    treats:
      "The brain, spinal cord, and nerves — headaches, dizziness, numbness or tingling, tremor, memory changes, and seizures.",
    firstVisit:
      "Expect a long conversation about your history, then a hands-on exam of your reflexes, strength, balance, and coordination. Scans usually come after this visit, not during it.",
    bring: [
      "A written timeline — when it started and how it has changed",
      "Anyone who has witnessed the episodes, if you have them",
      "A symptom diary if you can keep one for a week beforehand",
    ],
  },
  {
    name: "Gastroenterology",
    plainName: "Stomach and digestion doctor",
    treats:
      "The digestive system — stomach pain, heartburn, bloating, changes in bowel habits, and trouble swallowing.",
    firstVisit:
      "Expect detailed questions about food, timing, and bathroom habits, plus an exam of your abdomen. Blood tests are common; camera tests are scheduled separately if needed.",
    bring: [
      "A food and symptom diary for a few days if possible",
      "Which over-the-counter remedies you've tried",
      "Any family history of digestive conditions",
    ],
  },
  {
    name: "General Medicine",
    plainName: "Primary care doctor",
    treats:
      "The whole body, and the right starting point when symptoms are vague, affect several areas at once, or don't clearly belong to one specialty.",
    firstVisit:
      "Expect a broad conversation and a general physical exam. This visit often ends with blood work or a referral onward, and that's a normal outcome, not a dead end.",
    bring: [
      "Everything you've noticed, even things that seem unrelated",
      "A full medication list",
      "Your insurance card — many plans need this visit before a specialist",
    ],
  },
  {
    name: "Urology",
    plainName: "Urinary and bladder doctor",
    treats:
      "The bladder, kidneys, and urinary tract, plus the male reproductive system — urinating problems, pain, blood in urine, and kidney stones.",
    firstVisit:
      "Expect a urine sample and questions about how often and how urgently you go. Some exams are physical and can feel awkward; you can ask what's happening at any point.",
    bring: [
      "How many times a night you get up to urinate",
      "How much fluid and caffeine you drink daily",
      "Any medications that affect urination",
    ],
  },
  {
    name: "ENT / Otolaryngology",
    plainName: "Ear, nose, and throat doctor",
    treats:
      "Ears, nose, sinuses, throat, and neck — hearing loss, ringing, congestion that won't clear, sore throats, hoarseness, and neck lumps.",
    firstVisit:
      "Expect the doctor to look inside your ears, nose, and throat with a light and a small scope. A hearing test may be done the same day.",
    bring: [
      "How long it's been going on and whether it comes and goes",
      "Any allergies you know about",
      "Whether one side is worse than the other",
    ],
  },
  {
    name: "Obstetrics & Gynecology",
    plainName: "Women's health doctor",
    treats:
      "The female reproductive system and pregnancy — period problems, pelvic pain, contraception, fertility, menopause, and prenatal care.",
    firstVisit:
      "Expect questions about your cycle and history. A pelvic exam may or may not happen on a first visit — you can ask beforehand, and you can ask for a chaperone.",
    bring: [
      "The date your last period started",
      "How long your cycles usually are",
      "Any contraception you use now or have used",
    ],
  },
  {
    name: "Hematology / Oncology",
    plainName: "Blood and cancer doctor",
    treats:
      "Blood disorders and cancers. Most people reach this specialty through a referral after a test result, rather than by booking directly.",
    firstVisit:
      "Expect a review of your existing test results and a full history. Bring someone with you if you can — there is usually a lot of information at once.",
    bring: [
      "Copies of any recent blood work or scans",
      "The name of the doctor who referred you",
      "Someone to listen and take notes with you",
    ],
  },
  {
    name: "Pediatrics",
    plainName: "Children's doctor",
    treats:
      "Health and development in babies, children, and teenagers — illness, growth, behaviour, and vaccinations.",
    firstVisit:
      "Expect height, weight, and temperature to be measured first. The doctor will talk to your child directly where possible, which is intentional.",
    bring: [
      "Your child's vaccination record",
      "When symptoms started and whether anyone else at home is unwell",
      "A comfort item — visits go better when your child is settled",
    ],
  },
  {
    name: "Nephrology",
    plainName: "Kidney doctor",
    treats:
      "Kidney function — swelling, changes in urination, high blood pressure that's hard to control, and abnormal kidney blood tests.",
    firstVisit:
      "Expect blood and urine tests and a careful review of your blood pressure history and medications, since many common drugs affect the kidneys.",
    bring: [
      "Every medication and supplement, including painkillers",
      "Past blood test results if you have them",
      "Home blood pressure readings",
    ],
  },
  {
    name: "Ophthalmology",
    plainName: "Eye doctor",
    treats:
      "The eyes and vision — blurred or lost vision, pain, floaters, flashes of light, and eye pressure problems.",
    firstVisit:
      "Expect a vision test and eye pressure check. Your pupils may be dilated with drops, which blurs your vision for a few hours.",
    bring: [
      "Your current glasses or contact lenses",
      "Sunglasses and, ideally, someone to drive you home",
      "Whether the change was sudden or gradual",
    ],
  },
  {
    name: "Psychiatry / Psychology",
    plainName: "Mental health specialist",
    treats:
      "Mood, anxiety, sleep, focus, and thinking — including low mood, panic, obsessive thoughts, and difficulty coping.",
    firstVisit:
      "Expect mostly conversation. There's no physical exam and no test to pass. You control how much you share, and you can say when something is hard to talk about.",
    bring: [
      "When things changed, and what was happening at the time",
      "How your sleep, appetite, and energy have been",
      "Anything that has helped, even a little",
    ],
  },
  {
    name: "Dermatology",
    plainName: "Skin doctor",
    treats:
      "Skin, hair, and nails — rashes, acne, changing moles, hair loss, and persistent itching.",
    firstVisit:
      "Expect the doctor to look closely at the area with a magnifier, and possibly check your skin more broadly. A small sample may be taken the same day.",
    bring: [
      "Photos of the area on a day when it looked worse",
      "Any creams or products you've used on it",
      "Whether it itches, burns, or doesn't feel like anything",
    ],
  },
  {
    name: "Endocrinology",
    plainName: "Hormone doctor",
    treats:
      "Hormones and metabolism — thyroid problems, blood sugar, unexplained weight change, fatigue, and excessive thirst.",
    firstVisit:
      "Expect blood tests, usually the same day, and questions about energy, temperature, appetite, and weight over months rather than days.",
    bring: [
      "Your weight history over the last year or two",
      "Any thyroid or diabetes in your family",
      "A full medication list",
    ],
  },
  {
    name: "Dentistry",
    plainName: "Dentist",
    treats:
      "Teeth and gums — toothache, bleeding gums, sensitivity, and swelling in the mouth or jaw.",
    firstVisit:
      "Expect an examination of your teeth and gums and usually X-rays. Say up front if you're anxious about dental work — it changes how they proceed.",
    bring: [
      "How long the pain has lasted and what triggers it",
      "Whether the pain wakes you at night",
      "Any swelling in your face or jaw, which needs urgent attention",
    ],
  },
];

export function getSpecialty(name: string) {
  return SPECIALTIES.find((s) => s.name === name);
}