import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-snack-accent to-white py-20 px-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-snack-blue rounded-full blur-3xl shadow-2xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-snack-blue rounded-full blur-3xl shadow-2xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="inline-block px-4 py-1.5 bg-snack-blue/10 text-snack-blue rounded-full text-sm font-bold tracking-widest uppercase mb-6 animate-fade-in font-outfit">
          Satisfy Your Cravings
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-snack-dark mb-6 animate-fade-in tracking-tighter">
          <span className="font-dancing text-snack-blue block md:inline mr-2 transform -rotate-12 inline-block">Fifth</span>
          <span className="font-outfit uppercase">Snack Bar</span>
        </h1>
        <p className="text-base sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up leading-relaxed">
          The ultimate pitstop for your favorite snacks and refreshing beverages. Fresh, delicious, and made just for you.
        </p>
        <div className="flex justify-center flex-col sm:flex-row gap-4 animate-slide-up">
          <a
            href="#menu"
            className="bg-snack-blue text-white px-10 py-4 rounded-full hover:bg-black transition-all duration-300 transform hover:scale-105 font-bold shadow-lg shadow-snack-blue/25 font-outfit uppercase tracking-wider"
          >
            ORDER NOW
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;