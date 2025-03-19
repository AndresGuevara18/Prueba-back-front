// Importamos los hooks necesarios de React
import React, { useState, useEffect } from 'react';
// Importamos los iconos necesarios de lucide-react
import { Stethoscope, Users, FileSearch, BookOpen, Shield, Building2, ChevronLeft, ChevronRight, Search, Facebook, Instagram, Youtube, User } from 'lucide-react';

// Componente para mostrar una tarjeta de servicio
function ServiceCard({ title, description, image, link }) {
  return (
    // Contenedor principal de la tarjeta con diseño responsivo
    <div className="w-[328px] bg-white rounded-lg shadow-md overflow-hidden">
      {/* Sección de la imagen con overlay */}
      <div className="relative h-[200px]">
        {/* Imagen del servicio */}
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {/* Overlay oscuro con el título */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold text-center">{title}</h3>
        </div>
      </div>
      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Descripción del servicio */}
        <p className="text-sm text-gray-700 mb-4 h-[80px]">{description}</p>
        {/* Botón de acción */}
        <div className="flex justify-center">
          <a 
            href={link} 
            className="inline-flex items-center px-6 py-2 bg-[#10374E] text-white rounded hover:bg-blue-700 transition-colors"
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
    <div className="relative h-[534px] w-[1440px] mx-auto bg-gradient-to-r from-blue-600 to-blue-800">
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
              className="w-full h-[534px] object-cover opacity-20"
            />
            {/* Título centrado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
                {image.title}
              </h1>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Indicadores de posición (dots) */}
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

// Componente principal de la aplicación
function App() {
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
    <div className="min-h-screen w-[1440px] mx-auto bg-gray-50">
      {/* Barra superior */}
      <div className="bg-[#10374E] text-white w-[1440px]">
        {/* ... (contenido de la barra superior) */}
      </div>

      {/* Encabezado de navegación */}
      <nav className="bg-white shadow-md w-[1440px]">
        {/* ... (contenido de la navegación) */}
      </nav>

      {/* Sección del carrusel */}
      <Carousel />

      {/* Sección de servicios */}
      <div className="w-[1440px] mx-auto px-4 py-16">
        {/* ... (contenido de servicios) */}
      </div>

      {/* Sección del banner */}
      <div className="relative h-[534px] w-[1440px] mx-auto mt-16 mb-16">
        {/* ... (contenido del banner) */}
      </div>

      {/* Pie de página */}
      <footer className="bg-[#424242] text-white w-[1440px] mx-auto font-ledger">
        {/* ... (contenido del pie de página) */}
      </footer>
    </div>
  );
}

// Exportamos el componente App
export default App;