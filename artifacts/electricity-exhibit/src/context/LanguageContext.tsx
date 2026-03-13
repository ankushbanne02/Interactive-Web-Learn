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
    en: "Click on components to learn more • Scroll to zoom • Drag to rotate",
    mr: "घटकांवर क्लिक करा • झूम करण्यासाठी स्क्रोल करा • फिरवण्यासाठी ड्रॅग करा",
  },
  "scene.back": { en: "Back", mr: "मागे" },
  "scene.next": { en: "Next: Videos", mr: "पुढे: व्हिडिओ" },
  // Objects — much richer detail
  "obj.dam.name": { en: "💧 Hydro Dam", mr: "💧 जलविद्युत धरण" },
  "obj.dam.emoji": { en: "💧", mr: "💧" },
  "obj.dam.fact": { en: "Fun Fact: Some dams are taller than 300 metres — that's 3 football fields stacked on top of each other!", mr: "मजेदार तथ्य: काही धरणे 300 मीटरपेक्षा उंच असतात — हे 3 फुटबॉल मैदाने एकावर एक रचल्यासारखे आहे!" },
  "obj.dam.info": {
    en: "A hydroelectric dam is a massive concrete or earthen wall built across a river. It creates a huge reservoir of water behind it. The dam controls how much water flows through and when. The higher the water level, the more potential energy is stored — just like a ball held high has more energy to fall. When engineers open the sluice gates, millions of litres of water rush downward through tunnels called penstocks. This falling water builds up enormous kinetic energy (energy of motion) before it strikes the turbine blades. The dam also manages water supply for farming, drinking, and flood control — making it one of the most important structures ever built by humans.",
    mr: "जलविद्युत धरण हे नदीवर बांधलेली एक प्रचंड काँक्रीट किंवा मातीची भिंत आहे. त्यामागे एक मोठे जलाशय तयार होते. धरण किती पाणी आणि कधी वाहते याचे नियंत्रण करते. पाण्याची पातळी जितकी जास्त, तितकी जास्त स्थितिज ऊर्जा साठवली जाते — जसे उंचावर धरलेला बॉल खाली पडताना जास्त ऊर्जा असतो. जेव्हा अभियंते स्लुइस गेट उघडतात, तेव्हा लाखो लिटर पाणी पेनस्टॉक नावाच्या बोगद्यांमधून खाली धावते. हे पडते पाणी टर्बाइन ब्लेडांवर आदळण्यापूर्वी प्रचंड गतिज ऊर्जा (गतीची ऊर्जा) निर्माण करते. धरण शेती, पिण्याचे पाणी आणि पूर नियंत्रणासाठी देखील पाण्याचे व्यवस्थापन करते.",
  },
  "obj.turbine.name": { en: "⚙️ Water Turbine", mr: "⚙️ जल टर्बाइन" },
  "obj.turbine.emoji": { en: "⚙️", mr: "⚙️" },
  "obj.turbine.fact": { en: "Fun Fact: A large turbine can spin at 300–600 revolutions per minute — faster than a ceiling fan!", mr: "मजेदार तथ्य: एक मोठा टर्बाइन प्रति मिनिट 300–600 फेरे फिरू शकतो — सीलिंग फॅनपेक्षा जलद!" },
  "obj.turbine.info": {
    en: "The turbine is the heart of the power plant. It looks like a giant fan or ship propeller with specially shaped blades. When high-pressure water from the dam strikes these blades, it pushes them with incredible force, causing the turbine wheel to spin at hundreds of rotations per minute. This converts the kinetic energy of moving water into rotational mechanical energy — the spinning motion that will later become electricity. There are different turbine types: Pelton turbines use jets of water for very high dams, Francis turbines handle medium heights, and Kaplan turbines work in low-head situations. The blades are made from hardened steel alloys to survive constant high-speed water impact for decades. A single turbine can generate enough electricity to power thousands of homes!",
    mr: "टर्बाइन वीज केंद्राचे हृदय आहे. हे विशेष आकाराच्या ब्लेड्ससह एक प्रचंड पंखा किंवा जहाजाच्या प्रोपेलरसारखे दिसते. धरणातील उच्च-दाबाचे पाणी या ब्लेड्सवर आदळते तेव्हा ते अविश्वसनीय शक्तीने ढकलते, ज्यामुळे टर्बाइन चाक प्रति मिनिट शेकडो फेरे फिरते. हे वाहत्या पाण्याच्या गतिज ऊर्जेचे घूर्णन यांत्रिक ऊर्जेत रूपांतर करते — जी फिरणारी गती नंतर वीज बनेल. विविध प्रकारचे टर्बाइन आहेत: पेल्टन टर्बाइन खूप उंच धरणांसाठी, फ्रान्सिस टर्बाइन मध्यम उंचीसाठी, आणि कॅप्लान टर्बाइन कमी-हेड परिस्थितीत वापरले जातात.",
  },
  "obj.generator.name": { en: "🔋 Electric Generator", mr: "🔋 विद्युत जनरेटर" },
  "obj.generator.emoji": { en: "🔋", mr: "🔋" },
  "obj.generator.fact": { en: "Fun Fact: Michael Faraday invented the first generator in 1831 using just a copper coil and a horseshoe magnet!", mr: "मजेदार तथ्य: मायकेल फॅराडेने 1831 मध्ये फक्त तांब्याची कॉइल आणि घोड्याच्या नालसारखा चुंबक वापरून पहिला जनरेटर शोधला!" },
  "obj.generator.info": {
    en: "The generator is where the real magic of electricity production happens! It is directly connected to the turbine shaft, so when the turbine spins, the generator spins too. Inside the generator are two main parts: the rotor (large rotating electromagnets) and the stator (stationary copper wire coils surrounding the rotor). As the powerful magnets spin past the copper coils, they create a changing magnetic field. According to Faraday's Law of Electromagnetic Induction, a changing magnetic field through a wire coil induces (creates) an electric current in that wire. This is how ALL large-scale electricity is made — whether in hydro, thermal, or nuclear plants! The generator produces AC (Alternating Current) electricity, where electrons flow back and forth 50 times per second (50 Hz in India).",
    mr: "जनरेटर हे वीज उत्पादनाचे जादुई स्थान आहे! हे थेट टर्बाइन शाफ्टशी जोडलेले आहे, त्यामुळे टर्बाइन फिरते तेव्हा जनरेटरही फिरतो. जनरेटरमध्ये दोन मुख्य भाग आहेत: रोटर (फिरणारे मोठे विद्युत चुंबक) आणि स्टेटर (रोटरभोवती स्थिर तांब्याच्या तारांच्या कॉइल्स). शक्तिशाली चुंबक तांब्याच्या कॉइल्सजवळून फिरतात तेव्हा बदलणारे चुंबकीय क्षेत्र निर्माण होते. फॅराडेच्या विद्युत चुंबकीय प्रेरणाच्या नियमानुसार, कॉइलमधून बदलणारे चुंबकीय क्षेत्र त्या तारेत विद्युत प्रवाह निर्माण करते. अशा प्रकारे सर्व मोठ्या प्रमाणातील वीज तयार होते!",
  },
  "obj.transformer.name": { en: "🔌 Transformer", mr: "🔌 ट्रान्सफॉर्मर" },
  "obj.transformer.emoji": { en: "🔌", mr: "🔌" },
  "obj.transformer.fact": { en: "Fun Fact: Transmission lines carry electricity at up to 765,000 volts — about 6,000 times more than a household socket!", mr: "मजेदार तथ्य: प्रसारण लाइन 765,000 व्होल्टपर्यंत वीज वाहतात — घरातील सॉकेटपेक्षा सुमारे 6,000 पट जास्त!" },
  "obj.transformer.info": {
    en: "A transformer is a clever device that changes the voltage (electrical pressure) of electricity without losing power. It works because of electromagnetic induction — the same principle used in the generator! A step-UP transformer at the power plant increases voltage from about 11,000 volts to over 400,000 volts before long-distance transmission. Why go so high? Because at high voltage, much less current flows through the wires, which dramatically reduces energy lost as heat (Power loss = I² × R). Without transformers, more than 90% of electricity would be wasted as heat in the wires before reaching your home! At the end of the journey, step-DOWN transformers reduce voltage to safe levels — 33,000V, then 11,000V, then finally 230V for your home. Transformers have no moving parts, making them extremely reliable!",
    mr: "ट्रान्सफॉर्मर हे एक चतुर उपकरण आहे जे शक्ती न गमावता विजेचा व्होल्टेज (विद्युत दाब) बदलते. हे विद्युत चुंबकीय प्रेरणामुळे काम करते — जनरेटरमध्ये वापरलेले तेच तत्त्व! वीज केंद्रातील स्टेप-अप ट्रान्सफॉर्मर दीर्घ-अंतराच्या प्रसारणापूर्वी व्होल्टेज सुमारे 11,000 व्होल्टवरून 400,000 व्होल्टपेक्षा जास्त वाढवतो. इतके उंच का? कारण जास्त व्होल्टेजवर तारांमधून खूपच कमी विद्युत प्रवाह वाहतो, ज्यामुळे उष्णता म्हणून गमावलेली ऊर्जा मोठ्या प्रमाणात कमी होते (शक्ती नुकसान = I² × R). ट्रान्सफॉर्मरशिवाय, 90% पेक्षा जास्त वीज तारांमध्ये उष्णता म्हणून वाया जाईल!",
  },
  "obj.lines.name": { en: "🗼 Transmission Lines", mr: "🗼 प्रसारण लाइन" },
  "obj.lines.emoji": { en: "🗼", mr: "🗼" },
  "obj.lines.fact": { en: "Fun Fact: India has over 4,00,000 km of transmission lines — enough to go around the Earth 10 times!", mr: "मजेदार तथ्य: भारतात 4,00,000 किमीपेक्षा जास्त प्रसारण लाइन आहेत — पृथ्वीभोवती 10 वेळा फिरण्यासाठी पुरेसे!" },
  "obj.lines.info": {
    en: "High-voltage transmission lines form the 'highways of electricity' that connect power plants to cities and towns hundreds of kilometres away. They are strung between tall steel towers (pylons) that can be over 50 metres high! The wires themselves are thick aluminium cables (sometimes with a steel core for strength) that can carry enormous amounts of electrical current. Aluminium is used because it conducts electricity well AND is lightweight. The wires are hung in a catenary curve (natural sag) — they are never pulled perfectly straight because thermal expansion and contraction would snap them! You may notice three sets of wires on each tower — these carry the three phases of AC electricity. The highest voltage lines in India carry 765kV. Electricity travels through these lines at nearly the speed of light!",
    mr: "उच्च-व्होल्टेज प्रसारण लाइन वीजेचे 'महामार्ग' बनवतात जे शेकडो किलोमीटर दूर शहरे आणि गावांशी वीज केंद्र जोडतात. त्या 50 मीटरपेक्षा उंच असू शकणाऱ्या उंच स्टीलच्या टॉवर्स (पायलॉन्स) दरम्यान ताणलेल्या असतात! तारा स्वत: जाड ॲल्युमिनियम केबल्स आहेत (कधीकधी ताकदीसाठी स्टील कोरसह) ज्या विशाल प्रमाणात विद्युत प्रवाह वाहू शकतात. ॲल्युमिनियम वापरले जाते कारण ते वीज चांगले वाहते आणि हलके आहे. वाऱ्यामुळे आणि तापमान बदलांमुळे तारांमध्ये नैसर्गिक सॅग असतो — त्या कधीही पूर्णपणे सरळ ओढल्या जात नाहीत कारण थर्मल विस्तार आणि आकुंचनाने त्या तुटतील!",
  },
  "obj.house.name": { en: "🏠 Your Home", mr: "🏠 तुमचे घर" },
  "obj.house.emoji": { en: "🏠", mr: "🏠" },
  "obj.house.fact": { en: "Fun Fact: An average Indian household uses about 90-120 units (kWh) of electricity every month — that's millions of electrons flowing through your wires!", mr: "मजेदार तथ्य: एक सरासरी भारतीय घर दर महिन्याला सुमारे 90-120 युनिट (kWh) वीज वापरते — हे तुमच्या तारांमधून वाहणारे लाखो इलेक्ट्रॉन आहेत!" },
  "obj.house.info": {
    en: "After a long journey from the power plant, electricity finally arrives at your home! Before entering your street, high voltage passes through a local distribution substation where a step-down transformer reduces it to 11,000 volts, then another reduces it to the safe 230 volts used in Indian homes (110V in the USA). Electricity enters your home through the electricity meter (which measures how much you use in units of kWh) and then a main circuit breaker (which can shut everything off safely). Inside your walls, a network of copper wires carries current to every switch and socket. Different appliances use different amounts of power: a LED bulb uses just 10 watts, while an air conditioner uses 1,500 watts! The electricity arrives as AC (Alternating Current) at 50 Hz, but phones and laptops need DC (Direct Current) — that's what your charger converts it to!",
    mr: "वीज केंद्रातून दीर्घ प्रवासानंतर, वीज शेवटी तुमच्या घरी पोहोचते! तुमच्या रस्त्यावर येण्यापूर्वी, उच्च व्होल्टेज स्थानिक वितरण उपकेंद्रातून जाते जिथे स्टेप-डाउन ट्रान्सफॉर्मर ते 11,000 व्होल्टवर आणतो, नंतर दुसरा भारतीय घरात वापरल्या जाणाऱ्या सुरक्षित 230 व्होल्टवर आणतो. वीज वीज मीटरद्वारे (जे तुम्ही kWh युनिटमध्ये किती वापरता ते मोजते) तुमच्या घरात प्रवेश करते आणि नंतर मुख्य सर्किट ब्रेकर (जे सर्व काही सुरक्षितपणे बंद करू शकते). वेगवेगळे उपकरणे वेगवेगळ्या प्रमाणात ऊर्जा वापरतात: LED बल्ब फक्त 10 वॅट वापरतो, तर एअर कंडिशनर 1,500 वॅट वापरतो!",
  },
  "scene.close": { en: "Close", mr: "बंद करा" },
  // Age Selection
  "age.title": { en: "Choose Your Age Group", mr: "तुमचा वयोगट निवडा" },
  "age.subtitle": {
    en: "We'll customize the experience just for you!",
    mr: "आम्ही फक्त तुमच्यासाठी अनुभव सानुकूल करू!",
  },
  "age.group1": { en: "5 – 10 Years", mr: "5 – 10 वर्षे" },
  "age.group1.desc": { en: "Fun & Simple Learning", mr: "मजेदार आणि सोपे शिक्षण" },
  "age.group2": { en: "11 – 18 Years", mr: "11 – 18 वर्षे" },
  "age.group2.desc": { en: "Explore & Discover", mr: "एक्सप्लोर करा आणि शोधा" },
  "age.group3": { en: "18+ Years", mr: "18+ वर्षे" },
  "age.group3.desc": { en: "Deep Science & Concepts", mr: "सखोल विज्ञान आणि संकल्पना" },
  "age.back": { en: "Back", mr: "मागे" },
  // Video Page
  "video.title": { en: "Educational Video", mr: "शैक्षणिक व्हिडिओ" },
  "video.subtitle": { en: "Watch and learn about electricity generation!", mr: "वीज निर्मितीबद्दल पाहा आणि शिका!" },
  "video.next": { en: "Next: Explore Game", mr: "पुढे: गेम एक्सप्लोर करा" },
  "video.nextHint": { en: "Watch the full video to continue", mr: "सुरू ठेवण्यासाठी पूर्ण व्हिडिओ पहा" },
  "video.back": { en: "Back", mr: "मागे" },
  // Game Page
  "game.title": { en: "Spark City Adventure – Electricity Journey Game", mr: "स्पार्क सिटी अ‍ॅडव्हेंचर – वीज प्रवास गेम" },
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
  "reward.message": { en: "You successfully understood the idea of this exhibit and learned how electricity is generated.", mr: "तुम्ही या प्रदर्शनाची कल्पना समजून घेतली आणि वीज कशी तयार होते हे शिकलात." },
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
