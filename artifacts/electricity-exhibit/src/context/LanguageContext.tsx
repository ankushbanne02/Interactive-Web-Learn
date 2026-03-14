import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "mr";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Landing Page
  "landing.title": {
    en: "Welcome to Electricity Generation",
    mr: "वीज निर्मितीमध्ये आपले स्वागत आहे",
  },
  "landing.subtitle": {
    en: "Discover how electricity is generated and how science powers our world.",
    mr: "वीज कशी तयार होते आणि विज्ञान आपल्या जगाला कसे उर्जा देते ते शोधा.",
  },
  "landing.tagline": {
    en: "Get ready for an exciting learning adventure!",
    mr: "एका रोमांचक शिक्षण साहसासाठी तयार व्हा!",
  },
  "landing.explore": {
    en: "Let's Explore",
    mr: "चला एक्सप्लोर करूया",
  },
  "landing.selectLang": {
    en: "Choose Your Language",
    mr: "आपली भाषा निवडा",
  },
  // 3D Scene
  "scene.title": {
    en: "Interactive Electricity Generation Model",
    mr: "परस्परसंवादी वीज निर्मिती मॉडेल",
  },
  "scene.instructions": {
    en: "Click on any component to learn more  •  Drag to rotate  •  Scroll to zoom",
    mr: "घटकांवर क्लिक करा  •  ड्रॅग करा  •  स्क्रोल करा",
  },
  "scene.back": { en: "Back", mr: "मागे" },
  "scene.next": { en: "Next: Choose Age", mr: "पुढे: वय निवडा" },
  "scene.close": { en: "Got it", mr: "समजले" },
  // Age Selection
  "age.title": { en: "Who is learning today?", mr: "आज कोण शिकत आहे?" },
  "age.subtitle": { en: "Select your age group to get the right content for you", mr: "तुमच्यासाठी योग्य सामग्री मिळवण्यासाठी तुमचा वयोगट निवडा" },
  "age.group1": { en: "Ages 5 – 10", mr: "वय ५ – १०" },
  "age.group1.desc": { en: "Fun stories and simple explanations", mr: "मजेदार गोष्टी आणि सोपे स्पष्टीकरण" },
  "age.group2": { en: "Ages 11 – 18", mr: "वय ११ – १८" },
  "age.group2.desc": { en: "Deeper science with interactive content", mr: "परस्परसंवादी सामग्रीसह सखोल विज्ञान" },
  "age.group3": { en: "Ages 18+", mr: "वय १८+" },
  "age.group3.desc": { en: "Advanced concepts and real-world data", mr: "प्रगत संकल्पना आणि वास्तविक जगातील डेटा" },
  "age.back": { en: "Back", mr: "मागे" },
  // Video
  "video.title": { en: "Educational Video", mr: "शैक्षणिक व्हिडिओ" },
  "video.subtitle": { en: "Watch and learn how electricity reaches your home", mr: "वीज तुमच्या घरापर्यंत कशी पोहोचते ते पहा आणि शिका" },
  "video.back": { en: "Back", mr: "मागे" },
  "video.next": { en: "Next: Play Game", mr: "पुढे: गेम खेळा" },
  "video.nextHint": { en: "Watch the video, then continue to the game", mr: "व्हिडिओ पहा, नंतर गेमकडे सुरू ठेवा" },
  // Game
  "game.title": { en: "Spark City Adventure", mr: "स्पार्क सिटी साहस" },
  "game.back": { en: "Back", mr: "मागे" },
  "game.next": { en: "Take the Quiz →", mr: "प्रश्नमंजुषा घ्या →" },
  // Quiz
  "quiz.title": { en: "Knowledge Quiz", mr: "ज्ञान प्रश्नमंजुषा" },
  "quiz.back": { en: "Back", mr: "मागे" },
  "quiz.next": { en: "Next Question", mr: "पुढचा प्रश्न" },
  "quiz.progress": { en: "Q", mr: "प्र" },
  "quiz.correct": { en: "✓ Correct!", mr: "✓ बरोबर!" },
  "quiz.wrong": { en: "✗ Not quite — correct answer shown in green", mr: "✗ बरोबर नाही — बरोबर उत्तर हिरव्यात दाखवले" },
  // Reward
  "reward.title": { en: "Congratulations!", mr: "अभिनंदन!" },
  "reward.message": { en: "You've completed the Electricity Generation exhibit. Great job exploring science today!", mr: "तुम्ही वीज निर्मिती प्रदर्शन पूर्ण केले. आज विज्ञान एक्सप्लोर केल्याबद्दल अभिनंदन!" },
  "reward.score": { en: "Your Score", mr: "तुमचा गुण" },
  "reward.excellent": { en: "⚡ Excellent! You're an electricity expert!", mr: "⚡ उत्कृष्ट! तुम्ही वीज तज्ञ आहात!" },
  "reward.good": { en: "👍 Good effort! Keep exploring!", mr: "👍 चांगला प्रयत्न! एक्सप्लोर करत राहा!" },
  "reward.keep": { en: "🌱 Keep learning — every question makes you smarter!", mr: "🌱 शिकत राहा — प्रत्येक प्रश्न तुम्हाला हुशार बनवतो!" },
  "reward.restart": { en: "Start Again", mr: "पुन्हा सुरू करा" },
  // Help
  "help.title": { en: "How to use", mr: "कसे वापरावे" },
  "help.tip1": { en: "Click on any 3D object to read about it", mr: "त्याबद्दल वाचण्यासाठी कोणत्याही 3D ऑब्जेक्टवर क्लिक करा" },
  "help.tip2": { en: "Use Back and Next buttons to navigate between sections", mr: "विभागांमध्ये नेव्हिगेट करण्यासाठी मागे आणि पुढे बटणे वापरा" },
  "help.tip3": { en: "Answer all quiz questions to see your final score", mr: "तुमचा अंतिम गुण पाहण्यासाठी सर्व प्रश्नांची उत्तरे द्या" },
  "help.close": { en: "Close", mr: "बंद करा" },
  // 3D Objects
  "obj.dam.name": { en: "Hydro Dam", mr: "जलविद्युत धरण" },
  "obj.dam.emoji": { en: "💧", mr: "💧" },
  "obj.dam.fact": { en: "Fun Fact: Some dams are taller than 300 metres — that's 3 football fields stacked on top of each other!", mr: "मजेदार तथ्य: काही धरणे 300 मीटरपेक्षा उंच असतात — हे 3 फुटबॉल मैदाने एकावर एक रचल्यासारखे आहे!" },
  "obj.dam.info": {
    en: "A hydroelectric dam is a massive wall built across a river. It creates a huge reservoir behind it. The dam controls water flow through sluice gates — when opened, millions of litres of water rush through tunnels called penstocks. This falling water builds up enormous kinetic energy before striking the turbine blades. The dam also manages water supply for farming, drinking, and flood control.",
    mr: "जलविद्युत धरण हे नदीवर बांधलेली एक प्रचंड भिंत आहे. त्यामागे एक मोठे जलाशय तयार होते. धरण स्लुइस गेटद्वारे पाण्याचा प्रवाह नियंत्रित करते — उघडल्यावर लाखो लिटर पाणी पेनस्टॉक बोगद्यांमधून खाली धावते. हे पडते पाणी टर्बाइन ब्लेड्सवर आदळण्यापूर्वी प्रचंड गतिज ऊर्जा निर्माण करते.",
  },
  "obj.turbine.name": { en: "Water Turbine", mr: "जल टर्बाइन" },
  "obj.turbine.emoji": { en: "⚙️", mr: "⚙️" },
  "obj.turbine.fact": { en: "Fun Fact: A large turbine can spin at 300–600 revolutions per minute — faster than a ceiling fan!", mr: "मजेदार तथ्य: एक मोठा टर्बाइन प्रति मिनिट 300–600 फेरे फिरू शकतो — सीलिंग फॅनपेक्षा जलद!" },
  "obj.turbine.info": {
    en: "The turbine looks like a giant fan with specially shaped blades. When high-pressure water from the dam strikes these blades, it causes the turbine wheel to spin at hundreds of rotations per minute. This converts the kinetic energy of moving water into rotational mechanical energy. There are different turbine types: Pelton turbines use jets of water for very high dams, Francis turbines handle medium heights, and Kaplan turbines work in shallow water situations.",
    mr: "टर्बाइन विशेष आकाराच्या ब्लेड्ससह एक प्रचंड पंख्यासारखे दिसते. धरणातील उच्च-दाबाचे पाणी या ब्लेड्सवर आदळते तेव्हा टर्बाइन चाक प्रति मिनिट शेकडो फेरे फिरते. हे वाहत्या पाण्याच्या गतिज ऊर्जेचे घूर्णन यांत्रिक ऊर्जेत रूपांतर करते.",
  },
  "obj.generator.name": { en: "Electric Generator", mr: "विद्युत जनरेटर" },
  "obj.generator.emoji": { en: "🔋", mr: "🔋" },
  "obj.generator.fact": { en: "Fun Fact: Generators use Faraday's Law — discovered in 1831 — and the principle still powers every city on Earth today!", mr: "मजेदार तथ्य: जनरेटर 1831 मध्ये शोधलेल्या फॅराडेच्या नियमाचा वापर करतात — हे तत्त्व आजही पृथ्वीवरील प्रत्येक शहराला वीज पुरवते!" },
  "obj.generator.info": {
    en: "The generator converts mechanical energy (spinning) into electrical energy. Inside, a shaft connected to the turbine spins a powerful electromagnet (rotor) inside coils of copper wire (stator). According to Faraday's Law of electromagnetic induction, a moving magnet near a wire creates an electric current. A large power plant generator produces alternating current (AC) at exactly 50 cycles per second (50 Hz) in India.",
    mr: "जनरेटर यांत्रिक ऊर्जा (फिरणे) विद्युत ऊर्जेत रूपांतरित करतो. आत, टर्बाइनशी जोडलेला शाफ्ट तांब्याच्या तारांच्या (स्टेटर) आत एक शक्तिशाली विद्युत चुंबक (रोटर) फिरवतो. फॅराडेच्या विद्युतचुंबकीय प्रेरण नियमानुसार, तारांजवळ फिरणारा चुंबक विद्युत प्रवाह निर्माण करतो. भारतात 50 हर्ट्झवर पर्यायी प्रवाह (AC) निर्माण होतो.",
  },
  "obj.transformer.name": { en: "Transformer", mr: "ट्रान्सफॉर्मर" },
  "obj.transformer.emoji": { en: "🔌", mr: "🔌" },
  "obj.transformer.fact": { en: "Fun Fact: India's highest transmission voltage is 765,000 volts — about 3,000 times more than your home socket!", mr: "मजेदार तथ्य: भारतातील सर्वोच्च पारेषण व्होल्टेज 765,000 व्होल्ट आहे — तुमच्या घरातील सॉकेटपेक्षा सुमारे 3,000 पट जास्त!" },
  "obj.transformer.info": {
    en: "A transformer changes voltage levels using electromagnetic induction between two coils. The power plant step-up transformer increases voltage from about 11,000 V to 400,000 V or more for long-distance transmission. High voltage means lower current, which dramatically reduces energy lost as heat in the wires (P = I²R). Near homes, step-down transformers reduce voltage back to safe levels — 230V for household use in India.",
    mr: "ट्रान्सफॉर्मर दोन कॉइल्समधील विद्युतचुंबकीय प्रेरण वापरून व्होल्टेज पातळी बदलतो. वीज केंद्राचा स्टेप-अप ट्रान्सफॉर्मर दीर्घ-अंतराच्या पारेषणासाठी व्होल्टेज वाढवतो. उच्च व्होल्टेज म्हणजे कमी विद्युत प्रवाह, जो तारांमध्ये उष्णता म्हणून गमावलेली ऊर्जा कमी करतो. घरांजवळ, स्टेप-डाउन ट्रान्सफॉर्मर व्होल्टेज 230V पर्यंत कमी करतात.",
  },
  "obj.lines.name": { en: "Transmission Lines", mr: "पारेषण तारा" },
  "obj.lines.emoji": { en: "🗼", mr: "🗼" },
  "obj.lines.fact": { en: "Fun Fact: India has over 400,000 km of transmission lines — enough to wrap around Earth more than 10 times!", mr: "मजेदार तथ्य: भारतात 400,000 किमीपेक्षा जास्त पारेषण तारा आहेत — पृथ्वीभोवती 10 पेक्षा जास्त वेळा गुंडाळण्यासाठी पुरेसे!" },
  "obj.lines.info": {
    en: "Transmission lines carry high-voltage electricity from power plants across hundreds of kilometres to cities and towns. The tall steel lattice towers hold multiple conductors — aluminium cables with a steel core for strength. The wires hang in a natural curve called a catenary. Three-phase AC power is transmitted using three separate conductors. Smart grid technology now monitors these lines in real time to prevent failures.",
    mr: "पारेषण तारा वीज केंद्रांमधून शहरे आणि गावांपर्यंत शेकडो किलोमीटर उच्च-व्होल्टेज वीज वाहतात. उंच स्टील जाळी मनोरे अनेक वाहक धरतात — ताकदीसाठी स्टील कोरसह अॅल्युमिनियम केबल्स. स्मार्ट ग्रिड तंत्रज्ञान या तारांचे रिअल-टाइम निरीक्षण करते.",
  },
  "obj.house.name": { en: "Your Home", mr: "तुमचे घर" },
  "obj.house.emoji": { en: "🏠", mr: "🏠" },
  "obj.house.fact": { en: "Fun Fact: A single 100W light bulb running for 10 hours uses 1 unit (kWh) of electricity — that's what you pay for on your electricity bill!", mr: "मजेदार तथ्य: 10 तास चालणारा एकच 100W दिवा 1 युनिट (kWh) वीज वापरतो — तुम्ही वीज बिलावर याच गोष्टीसाठी पैसे देता!" },
  "obj.house.info": {
    en: "After all that journey, electricity finally reaches your home! A local substation reduces voltage to 11,000V, then a pole-mounted transformer on your street brings it down to 230V. The electricity enters through a meter (which measures units used) and a circuit breaker (which trips if overloaded). Different appliances use different amounts — a phone charger uses ~5W while an air conditioner uses 1,500W or more.",
    mr: "या सर्व प्रवासानंतर, वीज शेवटी तुमच्या घरापर्यंत पोहोचते! एक स्थानिक सबस्टेशन व्होल्टेज 11,000V पर्यंत कमी करतो, नंतर तुमच्या रस्त्यावरील खांबावर लावलेला ट्रान्सफॉर्मर तो 230V पर्यंत आणतो. विविध उपकरणे वेगवेगळ्या प्रमाणात वापरतात — फोन चार्जर ~5W वापरतो तर एअर कंडिशनर 1,500W किंवा जास्त वापरतो.",
  },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("exhibit_lang") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("exhibit_lang", lang);
  };

  // Apply Devanagari font class to html element
  useEffect(() => {
    if (language === "mr") {
      document.documentElement.classList.add("lang-mr");
    } else {
      document.documentElement.classList.remove("lang-mr");
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] ?? translations[key]?.["en"] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
