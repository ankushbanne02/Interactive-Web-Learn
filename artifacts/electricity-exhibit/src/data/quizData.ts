import { AgeGroup } from "@/context/AppContext";
import { Language } from "@/context/LanguageContext";

interface QuizQuestion {
  question: { en: string; mr: string };
  options: { en: string; mr: string }[];
  correctIndex: number;
  explanation: { en: string; mr: string };
}

const questions510: QuizQuestion[] = [
  {
    question: {
      en: "What does a power plant produce?",
      mr: "वीज केंद्र काय तयार करते?",
    },
    options: [
      { en: "Water", mr: "पाणी" },
      { en: "Electricity", mr: "वीज" },
      { en: "Food", mr: "अन्न" },
      { en: "Air", mr: "हवा" },
    ],
    correctIndex: 1,
    explanation: {
      en: "A power plant produces electricity that powers our homes and cities!",
      mr: "वीज केंद्र वीज तयार करते जी आपल्या घरे आणि शहरे चालवते!",
    },
  },
  {
    question: {
      en: "What spins a turbine in a hydroelectric power plant?",
      mr: "जलविद्युत वीज केंद्रात टर्बाइन काय फिरवते?",
    },
    options: [
      { en: "Wind", mr: "वारा" },
      { en: "Fire", mr: "आग" },
      { en: "Water", mr: "पाणी" },
      { en: "Sand", mr: "वाळू" },
    ],
    correctIndex: 2,
    explanation: {
      en: "In a hydroelectric plant, flowing water spins the turbine to make electricity!",
      mr: "जलविद्युत केंद्रात, वाहते पाणी टर्बाइन फिरवते आणि वीज तयार करते!",
    },
  },
  {
    question: {
      en: "What shape are most turbine blades?",
      mr: "बहुतेक टर्बाइन ब्लेड्स कोणत्या आकाराचे असतात?",
    },
    options: [
      { en: "Square", mr: "चौकोन" },
      { en: "Circular flat", mr: "गोलाकार सपाट" },
      { en: "Curved/Fan shaped", mr: "वक्र/पंखा आकार" },
      { en: "Triangle", mr: "त्रिकोण" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Turbine blades are curved like a fan so they can catch water or wind and spin!",
      mr: "टर्बाइन ब्लेड्स पंख्यासारखे वाकलेले असतात जेणेकरून ते पाणी किंवा वारा पकडतात आणि फिरतात!",
    },
  },
  {
    question: {
      en: "What does a generator do?",
      mr: "जनरेटर काय करतो?",
    },
    options: [
      { en: "Makes food", mr: "अन्न बनवतो" },
      { en: "Makes electricity from spinning", mr: "फिरण्यापासून वीज बनवतो" },
      { en: "Stores water", mr: "पाणी साठवतो" },
      { en: "Cleans air", mr: "हवा स्वच्छ करतो" },
    ],
    correctIndex: 1,
    explanation: {
      en: "A generator makes electricity when it spins, converting motion into electrical energy!",
      mr: "जनरेटर फिरतो तेव्हा वीज तयार करतो, गतीचे विद्युत ऊर्जेत रूपांतर करतो!",
    },
  },
  {
    question: {
      en: "How does electricity reach your house?",
      mr: "वीज तुमच्या घरात कशी पोहोचते?",
    },
    options: [
      { en: "By pipes", mr: "पाइपद्वारे" },
      { en: "By wires/transmission lines", mr: "तारा/प्रसारण लाइनद्वारे" },
      { en: "By trucks", mr: "ट्रकद्वारे" },
      { en: "By balloons", mr: "फुग्यांद्वारे" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Electricity travels through wires called transmission lines from power plants to your home!",
      mr: "वीज प्रसारण लाइन नावाच्या तारांद्वारे वीज केंद्रापासून तुमच्या घरापर्यंत प्रवास करते!",
    },
  },
  {
    question: {
      en: "Which of these uses electricity?",
      mr: "यापैकी कोणते वीज वापरते?",
    },
    options: [
      { en: "A rock", mr: "एक दगड" },
      { en: "A tree", mr: "एक झाड" },
      { en: "A light bulb", mr: "एक दिव्याचा बल्ब" },
      { en: "Water", mr: "पाणी" },
    ],
    correctIndex: 2,
    explanation: {
      en: "A light bulb uses electricity to glow and give us light!",
      mr: "एक दिव्याचा बल्ब चमकण्यासाठी आणि आपल्याला प्रकाश देण्यासाठी वीज वापरतो!",
    },
  },
  {
    question: {
      en: "What is stored behind a dam?",
      mr: "धरणाच्या मागे काय साठवले जाते?",
    },
    options: [
      { en: "Sand", mr: "वाळू" },
      { en: "Air", mr: "हवा" },
      { en: "Milk", mr: "दूध" },
      { en: "Water", mr: "पाणी" },
    ],
    correctIndex: 3,
    explanation: {
      en: "Dams store large amounts of water. When released, the water flows to spin turbines!",
      mr: "धरणे मोठ्या प्रमाणात पाणी साठवतात. सोडल्यावर, पाणी टर्बाइन फिरवण्यासाठी वाहते!",
    },
  },
  {
    question: {
      en: "Which energy does the sun give us?",
      mr: "सूर्य आपल्याला कोणती ऊर्जा देतो?",
    },
    options: [
      { en: "Sound energy", mr: "ध्वनी ऊर्जा" },
      { en: "Solar/Light energy", mr: "सौर/प्रकाश ऊर्जा" },
      { en: "Water energy", mr: "जल ऊर्जा" },
      { en: "Nuclear energy", mr: "आण्विक ऊर्जा" },
    ],
    correctIndex: 1,
    explanation: {
      en: "The sun gives us solar energy (light and heat) which can be converted to electricity!",
      mr: "सूर्य आपल्याला सौर ऊर्जा (प्रकाश आणि उष्णता) देतो जी वीजमध्ये रूपांतरित केली जाऊ शकते!",
    },
  },
];

const questions1118: QuizQuestion[] = [
  {
    question: {
      en: "What principle does an electric generator use to produce electricity?",
      mr: "विद्युत जनरेटर वीज निर्माण करण्यासाठी कोणत्या तत्त्वाचा वापर करतो?",
    },
    options: [
      { en: "Thermodynamics", mr: "थर्मोडायनामिक्स" },
      { en: "Electromagnetic induction", mr: "विद्युत चुंबकीय प्रेरणा" },
      { en: "Nuclear fission", mr: "आण्विक विखंडन" },
      { en: "Photosynthesis", mr: "प्रकाशसंश्लेषण" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Generators use electromagnetic induction — rotating a coil within a magnetic field generates an electric current.",
      mr: "जनरेटर विद्युत चुंबकीय प्रेरणा वापरतात — चुंबकीय क्षेत्रात कॉइल फिरवल्याने विद्युत प्रवाह निर्माण होतो.",
    },
  },
  {
    question: {
      en: "Why is voltage stepped up by transformers before long-distance transmission?",
      mr: "दीर्घ-अंतराच्या प्रसारणापूर्वी ट्रान्सफॉर्मर्सद्वारे व्होल्टेज का वाढवले जाते?",
    },
    options: [
      { en: "To make it more dangerous", mr: "ते अधिक धोकादायक बनवण्यासाठी" },
      { en: "To reduce power losses in wires", mr: "तारांमध्ये ऊर्जेचे नुकसान कमी करण्यासाठी" },
      { en: "To store more electricity", mr: "अधिक वीज साठवण्यासाठी" },
      { en: "To increase current", mr: "विद्युत प्रवाह वाढवण्यासाठी" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Higher voltage means lower current for the same power, which drastically reduces resistive losses (P=I²R) in transmission lines.",
      mr: "जास्त व्होल्टेज म्हणजे समान शक्तीसाठी कमी विद्युत प्रवाह, जे प्रसारण लाइनमधील प्रतिरोधक नुकसान (P=I²R) मोठ्या प्रमाणात कमी करते.",
    },
  },
  {
    question: {
      en: "What type of energy is stored in water held in a dam reservoir?",
      mr: "धरणाच्या जलाशयात ठेवलेल्या पाण्यात कोणत्या प्रकारची ऊर्जा साठवली जाते?",
    },
    options: [
      { en: "Kinetic energy", mr: "गतिज ऊर्जा" },
      { en: "Thermal energy", mr: "तापीय ऊर्जा" },
      { en: "Gravitational potential energy", mr: "गुरुत्वाकर्षण स्थितिज ऊर्जा" },
      { en: "Chemical energy", mr: "रासायनिक ऊर्जा" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Water held at height has gravitational potential energy (PE = mgh), which converts to kinetic energy as it falls to drive turbines.",
      mr: "उंचावर ठेवलेल्या पाण्यात गुरुत्वाकर्षण स्थितिज ऊर्जा (PE = mgh) असते, जी टर्बाइन चालवण्यासाठी पडताना गतिज ऊर्जेत रूपांतरित होते.",
    },
  },
  {
    question: {
      en: "Which of the following is a renewable energy source?",
      mr: "खालीलपैकी कोणता नवीकरणीय ऊर्जा स्रोत आहे?",
    },
    options: [
      { en: "Coal", mr: "कोळसा" },
      { en: "Natural gas", mr: "नैसर्गिक वायू" },
      { en: "Wind", mr: "वारा" },
      { en: "Petroleum", mr: "पेट्रोलियम" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Wind is renewable because it is naturally replenished. Coal, gas and petroleum are fossil fuels that take millions of years to form.",
      mr: "वारा नवीकरणीय आहे कारण तो नैसर्गिकरित्या पुन्हा भरला जातो. कोळसा, वायू आणि पेट्रोलियम जीवाश्म इंधन आहेत ज्यांना तयार होण्यास लाखो वर्षे लागतात.",
    },
  },
  {
    question: {
      en: "In a thermal power plant, what is used to spin the turbine?",
      mr: "औष्णिक वीज केंद्रात टर्बाइन फिरवण्यासाठी काय वापरले जाते?",
    },
    options: [
      { en: "Flowing water", mr: "वाहते पाणी" },
      { en: "High-pressure steam", mr: "उच्च-दाब वाफ" },
      { en: "Solar panels", mr: "सौर पॅनेल" },
      { en: "Wind", mr: "वारा" },
    ],
    correctIndex: 1,
    explanation: {
      en: "In thermal plants, fuel is burned to heat water, creating high-pressure steam that spins turbines connected to generators.",
      mr: "औष्णिक केंद्रात, इंधन जाळून पाणी गरम केले जाते, ज्यामुळे उच्च-दाब वाफ तयार होते जी जनरेटरशी जोडलेल्या टर्बाइन फिरवते.",
    },
  },
  {
    question: {
      en: "What is AC (Alternating Current)?",
      mr: "AC (प्रत्यावर्ती विद्युत प्रवाह) म्हणजे काय?",
    },
    options: [
      { en: "Current that flows only once", mr: "एकदाच वाहणारा प्रवाह" },
      { en: "Current that reverses direction periodically", mr: "नियमितपणे दिशा बदलणारा प्रवाह" },
      { en: "Current that stays constant", mr: "स्थिर राहणारा प्रवाह" },
      { en: "Current measured in watts", mr: "वॅटमध्ये मोजला जाणारा प्रवाह" },
    ],
    correctIndex: 1,
    explanation: {
      en: "AC (Alternating Current) reverses its direction of flow periodically. Most household electricity is AC at 50 or 60 Hz.",
      mr: "AC (प्रत्यावर्ती विद्युत प्रवाह) नियमितपणे प्रवाहाची दिशा बदलतो. बहुतेक घरगुती वीज 50 किंवा 60 Hz वर AC आहे.",
    },
  },
  {
    question: {
      en: "What role does a step-down transformer play at the end of transmission?",
      mr: "प्रसारणाच्या शेवटी स्टेप-डाउन ट्रान्सफॉर्मर काय भूमिका बजावतो?",
    },
    options: [
      { en: "Increases voltage for homes", mr: "घरांसाठी व्होल्टेज वाढवतो" },
      { en: "Reduces high voltage to safe levels for consumers", mr: "ग्राहकांसाठी उच्च व्होल्टेज सुरक्षित पातळीवर आणतो" },
      { en: "Generates electricity", mr: "वीज निर्माण करतो" },
      { en: "Stores electricity", mr: "वीज साठवतो" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Step-down transformers reduce the very high transmission voltage (e.g., 132 kV) to safe household levels (230 V in India).",
      mr: "स्टेप-डाउन ट्रान्सफॉर्मर खूप जास्त प्रसारण व्होल्टेज (उदा., 132 kV) सुरक्षित घरगुती पातळीवर (भारतात 230 V) आणतो.",
    },
  },
  {
    question: {
      en: "Which energy conversion happens in a solar panel?",
      mr: "सौर पॅनेलमध्ये कोणती ऊर्जा रूपांतरण होते?",
    },
    options: [
      { en: "Chemical → Electrical", mr: "रासायनिक → विद्युत" },
      { en: "Mechanical → Electrical", mr: "यांत्रिक → विद्युत" },
      { en: "Light → Electrical", mr: "प्रकाश → विद्युत" },
      { en: "Heat → Mechanical", mr: "उष्णता → यांत्रिक" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Solar panels use the photovoltaic effect to convert light energy directly into electrical energy.",
      mr: "सौर पॅनेल फोटोव्होल्टेइक प्रभाव वापरून प्रकाश ऊर्जेचे थेट विद्युत ऊर्जेत रूपांतर करतात.",
    },
  },
];

const questions18plus: QuizQuestion[] = [
  {
    question: {
      en: "Faraday's law states that the induced EMF is proportional to:",
      mr: "फॅराडेचा नियम म्हणतो की प्रेरित EMF समानुपाती आहे:",
    },
    options: [
      { en: "The resistance of the coil", mr: "कॉइलचा प्रतिकार" },
      { en: "The rate of change of magnetic flux", mr: "चुंबकीय फ्लक्सच्या बदलाचा दर" },
      { en: "The square of current", mr: "विद्युत प्रवाहाचा वर्ग" },
      { en: "Temperature of the conductor", mr: "वाहकाचे तापमान" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Faraday's law: EMF = -dΦ/dt. The induced EMF equals the negative rate of change of magnetic flux through the circuit.",
      mr: "फॅराडेचा नियम: EMF = -dΦ/dt. प्रेरित EMF सर्किटमधील चुंबकीय फ्लक्सच्या बदलाच्या ऋण दराएवढा असतो.",
    },
  },
  {
    question: {
      en: "In three-phase AC generation, what is the phase difference between each phase?",
      mr: "तीन-फेज AC निर्मितीमध्ये, प्रत्येक फेजमध्ये फेज फरक किती आहे?",
    },
    options: [
      { en: "90°", mr: "90°" },
      { en: "45°", mr: "45°" },
      { en: "120°", mr: "120°" },
      { en: "180°", mr: "180°" },
    ],
    correctIndex: 2,
    explanation: {
      en: "In three-phase AC systems, the three phases are separated by 120° (2π/3 radians), allowing smooth power delivery.",
      mr: "तीन-फेज AC प्रणालींमध्ये, तीन फेज 120° (2π/3 रेडियन) ने विभक्त आहेत, ज्यामुळे सुलभ ऊर्जा वितरण होते.",
    },
  },
  {
    question: {
      en: "The per-unit efficiency of a hydroelectric plant is typically:",
      mr: "जलविद्युत केंद्राची प्रति-एकक कार्यक्षमता सामान्यतः असते:",
    },
    options: [
      { en: "0.30–0.40 (30–40%)", mr: "0.30–0.40 (30–40%)" },
      { en: "0.50–0.60 (50–60%)", mr: "0.50–0.60 (50–60%)" },
      { en: "0.85–0.95 (85–95%)", mr: "0.85–0.95 (85–95%)" },
      { en: "1.0 (100%)", mr: "1.0 (100%)" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Hydroelectric plants are one of the most efficient electricity generators at 85–95% efficiency, compared to ~33% for most thermal plants.",
      mr: "जलविद्युत केंद्रे सर्वात कार्यक्षम वीज जनरेटरपैकी एक आहेत ज्यात 85–95% कार्यक्षमता आहे, बहुतेक औष्णिक केंद्रांसाठी ~33% च्या तुलनेत.",
    },
  },
  {
    question: {
      en: "What is the formula for real power (P) in a three-phase system?",
      mr: "तीन-फेज प्रणालीमध्ये वास्तविक शक्ती (P) साठी सूत्र काय आहे?",
    },
    options: [
      { en: "P = VI", mr: "P = VI" },
      { en: "P = √3 × VL × IL × cos(φ)", mr: "P = √3 × VL × IL × cos(φ)" },
      { en: "P = V²/R", mr: "P = V²/R" },
      { en: "P = I²R", mr: "P = I²R" },
    ],
    correctIndex: 1,
    explanation: {
      en: "For a balanced three-phase system: P = √3 × V_Line × I_Line × cos(φ), where φ is the power factor angle.",
      mr: "संतुलित तीन-फेज प्रणालीसाठी: P = √3 × V_Line × I_Line × cos(φ), जेथे φ शक्ती गुणक कोन आहे.",
    },
  },
  {
    question: {
      en: "What is pumped-storage hydroelectricity?",
      mr: "पंप-स्टोरेज जलविद्युत म्हणजे काय?",
    },
    options: [
      { en: "Using pumps to generate electricity directly", mr: "थेट वीज निर्माण करण्यासाठी पंप वापरणे" },
      { en: "Storing energy by pumping water uphill during low demand, releasing during high demand", mr: "कमी मागणीदरम्यान पाणी वरच्या दिशेने पंप करून ऊर्जा साठवणे, जास्त मागणीदरम्यान सोडणे" },
      { en: "A type of offshore wind energy storage", mr: "एक प्रकारची ऑफशोर पवन ऊर्जा साठवण" },
      { en: "Using tidal waves to generate power", mr: "ऊर्जा निर्माण करण्यासाठी भरती-ओहोटी लाटा वापरणे" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Pumped-storage works as a large 'battery': excess electricity pumps water uphill to a reservoir; at peak demand, water flows down through turbines to regenerate power.",
      mr: "पंप-स्टोरेज मोठ्या 'बॅटरी'सारखे काम करते: अतिरिक्त वीज पाणी जलाशयात वरच्या दिशेने पंप करते; जास्त मागणीच्या वेळी, पाणी ऊर्जा पुन्हा निर्माण करण्यासाठी टर्बाइनद्वारे खाली वाहते.",
    },
  },
  {
    question: {
      en: "Nuclear fission in a reactor generates electricity by:",
      mr: "अणुभट्टीतील आण्विक विखंडन वीज निर्माण करते:",
    },
    options: [
      { en: "Splitting atoms to produce heat → steam → turbine → generator", mr: "उष्णता → वाफ → टर्बाइन → जनरेटर निर्माण करण्यासाठी अणू विभाजित करणे" },
      { en: "Using electromagnetic fields directly", mr: "थेट विद्युत चुंबकीय क्षेत्र वापरणे" },
      { en: "Converting chemical energy from uranium salts", mr: "युरेनियम क्षारांपासून रासायनिक ऊर्जा रूपांतरित करणे" },
      { en: "Fusion of hydrogen atoms", mr: "हायड्रोजन अणूंचे संयोजन" },
    ],
    correctIndex: 0,
    explanation: {
      en: "Nuclear reactors use controlled fission (splitting of uranium/plutonium nuclei) to generate intense heat, producing steam to drive conventional turbines and generators.",
      mr: "आण्विक अणुभट्ट्या तीव्र उष्णता निर्माण करण्यासाठी नियंत्रित विखंडन (युरेनियम/प्लुटोनियम केंद्रकांचे विभाजन) वापरतात, पारंपारिक टर्बाइन आणि जनरेटर चालवण्यासाठी वाफ तयार करतात.",
    },
  },
  {
    question: {
      en: "What is the significance of the capacity factor for a power plant?",
      mr: "वीज केंद्रासाठी क्षमता घटकाचे महत्त्व काय आहे?",
    },
    options: [
      { en: "The physical size of the plant", mr: "केंद्राचा भौतिक आकार" },
      { en: "Ratio of actual output to maximum possible output over a period", mr: "एका कालावधीत वास्तविक उत्पादन ते जास्तीत जास्त संभाव्य उत्पादनाचे प्रमाण" },
      { en: "Total installed capacity in MW", mr: "MW मध्ये एकूण स्थापित क्षमता" },
      { en: "Efficiency of the transformer", mr: "ट्रान्सफॉर्मरची कार्यक्षमता" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Capacity factor = (Actual energy produced / Maximum possible energy) × 100%. It reflects how much of the time a plant runs at full capacity. Nuclear plants typically have ~90%, solar ~15–25%.",
      mr: "क्षमता घटक = (वास्तविक उत्पादित ऊर्जा / जास्तीत जास्त संभाव्य ऊर्जा) × 100%. हे दर्शवते की केंद्र किती वेळ पूर्ण क्षमतेने चालते. आण्विक केंद्रांमध्ये सामान्यतः ~90%, सौर ~15–25% असते.",
    },
  },
  {
    question: {
      en: "Lenz's law is a consequence of:",
      mr: "लेन्झचा नियम यांचा परिणाम आहे:",
    },
    options: [
      { en: "Newton's second law", mr: "न्यूटनचा दुसरा नियम" },
      { en: "Conservation of energy", mr: "ऊर्जेचे संरक्षण" },
      { en: "Ohm's law", mr: "ओमचा नियम" },
      { en: "Joule's law", mr: "जूलचा नियम" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Lenz's law states that the induced current opposes the change causing it — a direct consequence of the conservation of energy principle.",
      mr: "लेन्झचा नियम सांगतो की प्रेरित विद्युत प्रवाह ते कारणीभूत होणाऱ्या बदलाला विरोध करतो — हे ऊर्जेच्या संरक्षण तत्त्वाचा थेट परिणाम आहे.",
    },
  },
];

export function getQuestions(ageGroup: AgeGroup, lang: Language): { question: string; options: string[]; correctIndex: number; explanation: string }[] {
  let pool: QuizQuestion[];
  if (ageGroup === "5-10") pool = questions510;
  else if (ageGroup === "11-18") pool = questions1118;
  else pool = questions18plus;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((q) => ({
    question: q.question[lang],
    options: q.options.map((o) => o[lang]),
    correctIndex: q.correctIndex,
    explanation: q.explanation[lang],
  }));
}
