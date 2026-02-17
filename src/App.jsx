import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    speaker: "Speaker 1",
    title: "Shimoliy Amerika va Irokezlar",
    text: "Shimoliy Amerikada Irokezlar yashagan. 'Qizil tanlilar' iborasi jangchilarning badaniga qizil bo'yoq surish odatidan kelib chiqqan. Ular 6-8 metrli uzun yog'och uylarda yashab, 'Besh qabila ittifoqi'ni tuzganlar.",
    video: "./video1.mp4"
  },
  {
    id: 2,
    speaker: "Speaker 2",
    title: "Eskimoslar va Aleutlar",
    text: "Shimoliy Kanada va Alyaskada Eskimoslar yashagan. Ular kit va morj ovlashgan, yog'idan yoritishda, terisidan kiyim tikishda foydalanishgan. Dehqonchilikni bilishmagan.",
    video: "./video2.mp4"
  },
  {
    id: 3,
    speaker: "Speaker 3",
    title: "Mayyalar: Yangi Dunyo Yunonlari",
    text: "Mayyalar yuksak madaniyati uchun 'Yangi Dunyo yunonlari' deb atalgan. Ular pul o'rnida kakao urug'idan foydalanishgan. Tikal va Chichen-Itsa kabi buyuk shaharlari bo'lgan.",
    video: "./video3.mp4"
  },
  {
    id: 4,
    speaker: "Speaker 4",
    title: "Atsteklar va Jangchi Martabasi",
    text: "1325-yilda Tenochtitlan shahriga asos solindi. Atsteklarda o'smir yigitlar birinchi asirini tutmaguncha sochlarini olishiga ruxsat berilmagan. Jangchining martabasi asirlar soniga bog'liq bo'lgan.",
    video: "./video4.mp4"
  },
  {
    id: 5,
    speaker: "Speaker 5",
    title: "Inklar: Quyosh Imperiyasi",
    text: "And tog'larida joylashgan Inklar imperiyasining markazi Kusko ('Quyosh shahri') edi. Davlat 4 viloyatga bo'lingan. Hukmdorning hokimiyati cheksiz bo'lib, u ham diniy, ham dunyoviy rahbar edi.",
    video: "./video5.mp4"
  },
  {
    id: 6,
    speaker: "Speaker 6",
    title: "Inklarning Dehqonchiligi",
    text: "Inklar tog' yonbag'irlarida terrasalar qurib, kartoshka va makkajo'xori yetishtirishgan. Tog'lardan suv olib kelish uchun osma quvurlar (akveduklar) qurishgan. 1532-yilda ispanlar tomonidan bosib olingan.",
    video: "./video6.mp4"
  }
];

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const isThrottled = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    const handleWheel = (e) => {
      if (isThrottled.current) return;
      isThrottled.current = true;
      setTimeout(() => { isThrottled.current = false; }, 1000);
      
      if (e.deltaY > 0) {
        nextSlide();
      } else if (e.deltaY < 0) {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slides[currentSlide].id}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              src={slides[currentSlide].video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transform scale-[1.02]"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex items-center justify-between px-8 md:px-16 lg:px-24">
        
        {/* Glassmorphism Card */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-xl p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase bg-amber-500/80 rounded-full text-black">
              {slides[currentSlide].speaker}
            </span>
            <span className="text-sm text-gray-300">
              Slide {slides[currentSlide].id} / {slides.length}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
            {slides[currentSlide].title}
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed text-gray-100 font-light">
            {slides[currentSlide].text}
          </p>
        </motion.div>

        {/* Navigation & Progress */}
        <div className="flex flex-col items-center gap-8">
          {/* Vertical Progress Bar */}
          <div className="flex flex-col gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 transition-all duration-300 rounded-full ${
                  index === currentSlide ? 'h-12 bg-amber-500' : 'h-3 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all active:scale-95 group"
            >
              <ChevronLeft className="w-8 h-8 text-white group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="p-4 rounded-full bg-amber-500/80 backdrop-blur-sm border border-amber-500/50 hover:bg-amber-500 transition-all active:scale-95 group shadow-lg shadow-amber-500/20"
            >
              <ChevronRight className="w-8 h-8 text-black group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
