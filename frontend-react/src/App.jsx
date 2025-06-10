// Importamos los hooks necesarios de React
import React, { useState, useEffect } from 'react';
// Importamos los iconos necesarios de lucide-react
import { Stethoscope, Users, FileSearch, BookOpen, Shield, Building2, ChevronLeft, ChevronRight, Search, Facebook, Instagram, Youtube, User } from 'lucide-react';

// Componente para mostrar una tarjeta de servicio
function ServiceCard({ title, description, image, link }) {
  return (
    // Contenedor principal de la tarjeta con diseño responsivo
    <div className="w-[328px] overflow-hidden rounded-lg bg-white shadow-md">
      {/* Sección de la imagen con overlay */}
      <div className="relative h-[200px]">
        {/* Imagen del servicio */}
        <img src={image} alt={title} className="h-full w-full object-cover" />
        {/* Overlay oscuro con el título */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <h3 className="text-center text-2xl font-bold text-white">{title}</h3>
        </div>
      </div>
      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Descripción del servicio */}
        <p className="mb-4 h-[80px] text-sm text-gray-700">{description}</p>
        {/* Botón de acción */}
        <div className="flex justify-center">
          <a 
            href={link} 
            className="inline-flex items-center rounded bg-[#10374E] px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            VER MÁS
          </a>
        </div>
      </div>
    </div>
  );
}

// Componente del carrusel de imágenes
function Carousel() {
  // Estado para controlar la imagen actual
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array de imágenes para el carrusel
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

  // Efecto para cambiar automáticamente las imágenes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Función para ir a la siguiente imagen
  const goToNext = () => {
    setCurrentIndex((current) => (current + 1) % images.length);
  };

  // Función para ir a la imagen anterior
  const goToPrevious = () => {
    setCurrentIndex((current) => (current - 1 + images.length) % images.length);
  };

  return (
    // Contenedor principal del carrusel
    <div className="relative mx-auto h-[534px] w-[1440px] bg-gradient-to-r from-blue-600 to-blue-800">
      {/* Contenedor de imágenes y overlay */}
      <div className="relative h-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Imagen del carrusel */}
            <img 
              src={image.url}
              alt={image.title}
              className="h-[534px] w-full object-cover opacity-20"
            />
            {/* Título centrado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-center text-4xl font-bold text-white md:text-6xl">
                {image.title}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/30 p-2 transition-colors hover:bg-white/50"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white/30 p-2 transition-colors hover:bg-white/50"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Indicadores de posición (dots) */}
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

// Componente principal de la aplicación
function App() {
  // Guardar la posición del scroll antes de recargar
  useEffect(() => {
    const saveScrollPosition = () => {
      localStorage.setItem('scrollPosition', window.scrollY);
    };
    window.addEventListener('beforeunload', saveScrollPosition);
    // Restaurar la posición del scroll al cargar
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, []);

  // Array de servicios
  const services = [
    {
      title: "POLIGRAFÍA Y VSA",
      description: "Nuestras capacitaciones están dirigidas y desarrolladas en las capacidades a todos los niveles de la compañía en la prevención de riesgos. Nuestra...",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      link: "#"
    },
    // ... (otros servicios)
  ];

  return (
    // Contenedor principal de la aplicación
    <div className="mx-auto min-h-screen w-[1440px] bg-gray-50">
      {/* Barra superior */}
      <div className="w-[1440px] bg-[#10374E] text-white">
        {/* ... (contenido de la barra superior) */}
      </div>

      {/* Encabezado de navegación */}
      <nav className="w-[1440px] bg-white shadow-md">
        {/* ... (contenido de la navegación) */}
      </nav>

      {/* Sección del carrusel */}
      <Carousel />

      {/* Sección de servicios */}
      <div className="mx-auto w-[1440px] px-4 py-16">
        {/* ... (contenido de servicios) */}
      </div>

      {/* Sección del banner */}
      <div className="relative mx-auto mb-16 mt-16 h-[534px] w-[1440px]">
        {/* ... (contenido del banner) */}
      </div>

      {/* Pie de página */}
      <footer className="mx-auto w-[1440px] bg-[#424242] font-ledger text-white">
        {/* ... (contenido del pie de página) */}
      </footer>
    </div>
  );
}

// Exportamos el componente App
export default App;