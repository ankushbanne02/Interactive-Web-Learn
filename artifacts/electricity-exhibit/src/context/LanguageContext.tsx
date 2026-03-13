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
    en: "Select Language",
    mr: "भाषा निवडा",
  },
  // 3D Scene
  "scene.title": {
    en: "Interactive Electricity Generation Model",
    mr: "परस्परसंवादी वीज निर्मिती मॉडेल",
  },
  "scene.instructions": {
    en: "Click on components to learn more • Scroll to zoom • Drag to rotate",
    mr: "घटकांवर क्लिक करा • झूम करण्यासाठी स्क्रोल करा • फिरवण्यासाठी ड्रॅग करा",
  },
  "scene.back": { en: "Back", mr: "मागे" },
  "scene.next": { en: "Next: Videos", mr: "पुढे: व्हिडिओ" },
  // Objects
  "obj.dam.name": { en: "Hydro Dam", mr: "जलविद्युत धरण" },
  "obj.dam.info": {
    en: "The dam stores large amounts of water at a high elevation. When released, the water flows down with great force and energy.",
    mr: "धरण उंचावर मोठ्या प्रमाणात पाणी साठवते. सोडल्यावर, पाणी मोठ्या ताकदीने खाली वाहते.",
  },
  "obj.turbine.name": { en: "Water Turbine", mr: "जल टर्बाइन" },
  "obj.turbine.info": {
    en: "Water spins the turbine. The turbine converts water energy into mechanical energy.",
    mr: "पाण्याचा प्रवाह टर्बाइन फिरवतो. यामुळे पाण्याची ऊर्जा यांत्रिक ऊर्जेत रूपांतरित होते.",
  },
  "obj.generator.name": { en: "Electric Generator", mr: "विद्युत जनरेटर" },
  "obj.generator.info": {
    en: "The generator converts mechanical energy into electrical energy through electromagnetic induction.",
    mr: "जनरेटर विद्युत चुंबकीय प्रेरणाद्वारे यांत्रिक ऊर्जेचे विद्युत ऊर्जेत रूपांतर करतो.",
  },
  "obj.transformer.name": { en: "Transformer", mr: "ट्रान्सफॉर्मर" },
  "obj.transformer.info": {
    en: "The transformer steps up voltage for long-distance transmission, reducing energy losses.",
    mr: "ट्रान्सफॉर्मर दीर्घ-अंतराच्या प्रसारणासाठी व्होल्टेज वाढवतो, ऊर्जेचे नुकसान कमी करतो.",
  },
  "obj.lines.name": { en: "Transmission Lines", mr: "प्रसारण लाइन" },
  "obj.lines.info": {
    en: "High-voltage transmission lines carry electricity over long distances from power plants to cities.",
    mr: "उच्च-व्होल्टेज प्रसारण लाइन वीज वनस्पतींपासून शहरांपर्यंत दीर्घ अंतरावर वीज वाहून नेतात.",
  },
  "obj.house.name": { en: "House", mr: "घर" },
  "obj.house.info": {
    en: "After stepping down voltage at a local substation, electricity safely powers homes and appliances.",
    mr: "स्थानिक उपकेंद्रात व्होल्टेज कमी केल्यानंतर, वीज सुरक्षितपणे घरे आणि उपकरणे चालवते.",
  },
  "scene.close": { en: "Close", mr: "बंद करा" },
  // Age Selection
  "age.title": { en: "Choose Your Age Group", mr: "तुमचा वयोगट निवडा" },
  "age.subtitle": {
    en: "We'll customize the experience just for you!",
    mr: "आम्ही फक्त तुमच्यासाठी अनुभव सानुकूल करू!",
  },
  "age.group1": { en: "5 – 10 Years", mr: "5 – 10 वर्षे" },
  "age.group1.desc": {
    en: "Fun & Simple Learning",
    mr: "मजेदार आणि सोपे शिक्षण",
  },
  "age.group2": { en: "11 – 18 Years", mr: "11 – 18 वर्षे" },
  "age.group2.desc": { en: "Explore & Discover", mr: "एक्सप्लोर करा आणि शोधा" },
  "age.group3": { en: "18+ Years", mr: "18+ वर्षे" },
  "age.group3.desc": {
    en: "Deep Science & Concepts",
    mr: "सखोल विज्ञान आणि संकल्पना",
  },
  "age.back": { en: "Back", mr: "मागे" },
  // Video Page
  "video.title": { en: "Educational Video", mr: "शैक्षणिक व्हिडिओ" },
  "video.subtitle": {
    en: "Watch and learn about electricity generation!",
    mr: "वीज निर्मितीबद्दल पाहा आणि शिका!",
  },
  "video.next": { en: "Next: Explore Game", mr: "पुढे: गेम एक्सप्लोर करा" },
  "video.nextHint": {
    en: "Watch the full video to continue",
    mr: "सुरू ठेवण्यासाठी पूर्ण व्हिडिओ पहा",
  },
  "video.back": { en: "Back", mr: "मागे" },
  // Game Page
  "game.title": {
    en: "Spark City Adventure – Electricity Journey Game",
    mr: "स्पार्क सिटी अ‍ॅडव्हेंचर – वीज प्रवास गेम",
  },
  "game.next": { en: "Finish Game → Take Quiz", mr: "गेम संपवा → क्विझ घ्या" },
  "game.back": { en: "Back", mr: "मागे" },
  // Quiz
  "quiz.title": { en: "Electricity Quiz", mr: "वीज क्विझ" },
  "quiz.progress": { en: "Question", mr: "प्रश्न" },
  "quiz.of": { en: "of", mr: "पैकी" },
  "quiz.correct": { en: "Correct! Great job! 🎉", mr: "बरोबर! छान काम! 🎉" },
  "quiz.wrong": { en: "Not quite! Here's the explanation:", mr: "बरोबर नाही! येथे स्पष्टीकरण आहे:" },
  "quiz.next": { en: "Next Question", mr: "पुढचा प्रश्न" },
  "quiz.back": { en: "Back", mr: "मागे" },
  // Rewards
  "reward.title": { en: "🎉 Congratulations!", mr: "🎉 अभिनंदन!" },
  "reward.message": {
    en: "You successfully understood the idea of this exhibit and learned how electricity is generated.",
    mr: "तुम्ही या प्रदर्शनाची कल्पना समजून घेतली आणि वीज कशी तयार होते हे शिकलात.",
  },
  "reward.score": { en: "Your Score", mr: "तुमचा स्कोर" },
  "reward.restart": { en: "Start Adventure Again", mr: "साहस पुन्हा सुरू करा" },
  "reward.excellent": { en: "Excellent! You're a Science Star! ⭐", mr: "उत्कृष्ट! तुम्ही विज्ञान तारा आहात! ⭐" },
  "reward.good": { en: "Good job! Keep learning! 🚀", mr: "चांगले काम! शिकत राहा! 🚀" },
  "reward.keep": { en: "Keep exploring and you'll get there! 💡", mr: "एक्सप्लोर करत राहा आणि तुम्ही तेथे पोहोचाल! 💡" },
  // Help
  "help.title": { en: "Need Help?", mr: "मदत हवी आहे?" },
  "help.tip1": { en: "Click on 3D objects to learn about them", mr: "3D वस्तूंवर क्लिक करा त्यांच्याबद्दल जाणून घ्या" },
  "help.tip2": { en: "Watch the full video to unlock the game", mr: "गेम अनलॉक करण्यासाठी पूर्ण व्हिडिओ पहा" },
  "help.tip3": { en: "Answer quiz questions to earn your reward!", mr: "तुमचे बक्षीस मिळवण्यासाठी क्विझचे प्रश्न उत्तर द्या!" },
  "help.close": { en: "Got it!", mr: "समजले!" },
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

  const t = (key: string): string => {
    return translations[key]?.[language] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
