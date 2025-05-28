import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ServiceCard({ title, description, image, link }) {
  return (
    <div className="w-full max-w-[328px] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-[200px]">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="text-white text-xl md:text-2xl font-bold text-center px-4">{title}</h3>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <p className="text-sm text-gray-700 mb-4 h-[80px] line-clamp-4">{description}</p>
        <div className="flex justify-center">
          <a 
            href={link} 
            className="inline-flex items-center px-4 md:px-6 py-2 bg-[#10374E] text-white rounded hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            VER MÁS
          </a>
        </div>
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
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80",
      title: "POLIGRAFÍA & VSA"
    },
    {
      url: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80",
      title: "DETECCIÓN DE VERDAD"
    },
    {
      url: "https://images.unsplash.com/photo-1576089073624-b5751a8f4de4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80",
      title: "ANÁLISIS PROFESIONAL"
    }
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
    <div className="relative h-[300px] md:h-[400px] lg:h-[534px] w-full bg-gradient-to-r from-blue-600 to-blue-800">
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
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-white text-center">
                {image.title}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={goToPrevious}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
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
      title: "POLIGRAFÍA Y VSA",
      description: "Nuestras capacitaciones están dirigidas y desarrolladas en las capacidades a todos los niveles de la compañía en la prevención de riesgos. Nuestra...",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      title: "LÍNEA ÉTICA",
      description: "La ética es la disciplina argumentativa que busca fundamentar racionalmente lo que debemos hacer para lograr el perfeccionamiento de...",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      title: "OPERACIONES Y AUDITORÍAS",
      description: "AUDITORIAS Y PROCESOS A través de metodologías en gestión de riesgo, desarrollamos el diagnóstico y evaluación de los procesos transversales de...",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      title: "POLIGRAFÍA & VSA",
      description: "La prueba de polígrafo(detector físico o polígrafo) es una herramienta de control de riesgo que permite complementar y validar...",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      title: "ESTUDIOS Y CONTABILIDAD",
      description: "Antecedentes: Ofrecemos la consulta de sobrecuos en línea a través de nuestro CIC (Centro de Información del Colpryst) Son...",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    {
      title: "INVESTIGACIONES",
      description: "Soportamos a las empresas cuando descubren que algo está pasando en su organización y necesitan evidencia aportada, clara y...",
      image: "https://images.unsplash.com/photo-1576428252160-68707f5d1d0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <Carousel />

      {/* Services Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="flex items-center justify-center mb-8 md:mb-12">
          <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E] mr-4"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-center">SERVICIOS</h2>
          <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E] ml-4"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 place-items-center">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>

      {/* Banner Section */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[534px] w-full mt-8 md:mt-16 mb-8 md:mb-16">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="Business Meeting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-start space-y-4 w-full px-4 md:px-8">
            <div className="bg-[#4CAF50] py-2 px-4 md:px-8 transform -skew-x-12">
              <span className="text-xl md:text-3xl font-bold text-white transform skew-x-12 inline-block">AUDITORÍAS</span>
            </div>
            <div className="bg-[#00BCD4] py-2 px-4 md:px-8 transform -skew-x-12">
              <span className="text-xl md:text-3xl font-bold text-white transform skew-x-12 inline-block">CAPACITACIONES</span>
            </div>
            <div className="bg-[#2C387E] py-2 px-4 md:px-8 transform -skew-x-12">
              <span className="text-xl md:text-3xl font-bold text-white transform skew-x-12 inline-block">INVESTIGACIONES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;