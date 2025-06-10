import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import poligrafia from '../assets/img/poligrafia-corrucel.jpeg';
import analisis from '../assets/img/analisis-carrucel.jpeg';
import auditorias from '../assets/img/auditoria-inicio.jpg';
import capacitacion from '../assets/img/capacitaciones-inicio.jpg';
import estudio from '../assets/img/estudio-inicio.jpg';
import etica from '../assets/img/etica-inicio.jpg';
import final from '../assets/img/final-inicio.avif';
import investigacion from '../assets/img/investigacion-inicio.jpg';
import poligrafiaV2 from '../assets/img/poligrafia-inicio.webp';

function ServiceCard({ title, description, image }) {
  return (
    <div className="w-full max-w-[328px] overflow-hidden rounded-lg bg-white shadow-md">
      <div className="relative h-[200px]">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <h3 className="px-4 text-center text-xl font-bold text-white md:text-2xl">{title}</h3>
        </div>
      </div>      <div className="p-4 md:p-6">
        <p className="text-base text-gray-700 md:text-lg">{description}</p>
      </div>
    </div>
  );
}

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const images = [
    {
      url: poligrafia,
      title: "POLIGRAFÍA & VSA"
    },
    {
      url: analisis,
      title: "DETECCIÓN DE VERDAD"
    },
   
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, 5000);
    document.title = "Inicio";
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((current) => (current + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((current) => (current - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative h-[300px] w-full md:h-[400px] lg:h-[534px]">
      {/* Image and Overlay */}
      <div 
        className="relative h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image.url}
              alt={image.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <h1 className="text-center text-2xl font-bold text-white md:text-4xl lg:text-6xl">
                {image.title}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/30 p-2 transition-colors hover:bg-white/50 md:left-4"
      >
        <ChevronLeft className="h-4 w-4 text-white md:h-6 md:w-6" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/30 p-2 transition-colors hover:bg-white/50 md:right-4"
      >
        <ChevronRight className="h-4 w-4 text-white md:h-6 md:w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const services = [
    {
      title: "CAPACITACIONES",
      description: "Nuestras capacitaciones están dirigidas y desarrolladas en las capacidades a todos los niveles de la compañía en la prevención de riesgos. Nuestra...",
      image: capacitacion,
      link: "#"
    },
    {
      title: "LÍNEA ÉTICA",
      description: "La ética es la disciplina argumentativa que busca fundamentar racionalmente lo que debemos hacer para lograr el perfeccionamiento de...",
      image: etica,
      link: "#"
    },
    {
      title: "OPERACIONES Y AUDITORÍAS",
      description: "AUDITORIAS Y PROCESOS A través de metodologías en gestión de riesgo, desarrollamos el diagnóstico y evaluación de los procesos transversales de...",
      image: auditorias,
      link: "#"
    },
    {
      title: "POLIGRAFÍA & VSA",
      description: "La prueba de polígrafo(detector físico o polígrafo) es una herramienta de control de riesgo que permite complementar y validar...",
      image: poligrafiaV2,
      link: "#"
    },
    {
      title: "ESTUDIOS DE COMPATIBILIDAD",
      description: "Antecedentes: Ofrecemos la consulta de sobrecuos en línea a través de nuestro CIC (Centro de Información del Colpryst) Son...",
      image: estudio,
      link: "#"
    },
    {
      title: "INVESTIGACIONES",
      description: "Soportamos a las empresas cuando descubren que algo está pasando en su organización y necesitan evidencia aportada, clara y...",
      image: investigacion,
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <Carousel />

      {/* Services Section */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-16">
        <div className="mb-8 flex items-center justify-center md:mb-12">
          <div className="mr-4 h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
          <h2 className="text-center text-2xl font-bold md:text-3xl">SERVICIOS</h2>
          <div className="ml-4 h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
        </div>
        <div className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative mb-8 mt-8 h-[300px] w-full md:mb-16 md:mt-16 md:h-[400px] lg:h-[534px]">
        <img 
          src= {final}
          alt="Business Meeting"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex w-full flex-col items-start space-y-4 px-4 md:px-8">
            <div className="-skew-x-12 transform bg-[#4CAF50] px-4 py-2 md:px-8">
              <span className="inline-block skew-x-12 transform text-xl font-bold text-white md:text-3xl">AUDITORÍAS</span>
            </div>
            <div className="-skew-x-12 transform bg-[#00BCD4] px-4 py-2 md:px-8">
              <span className="inline-block skew-x-12 transform text-xl font-bold text-white md:text-3xl">CAPACITACIONES</span>
            </div>
            <div className="-skew-x-12 transform bg-[#2C387E] px-4 py-2 md:px-8">
              <span className="inline-block skew-x-12 transform text-xl font-bold text-white md:text-3xl">INVESTIGACIONES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;