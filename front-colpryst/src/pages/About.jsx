import React from 'react';
import { Shield, Users, FileSearch, BookOpen } from 'lucide-react';

function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="About Us Hero"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E]"></div>
            <h1 className="text-3xl md:text-6xl font-bold text-white">NOSOTROS</h1>
            <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E]"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="space-y-8 md:space-y-12">
          {/* Company Description */}
          <div className="max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              Somos una firma creada en 1990, especializada en ayudar a las empresas y 
              organizaciones en el control y administración de sus riesgos. Brindamos a 
              nuestros clientes el nivel adecuado de soporte en materia de asesoría, 
              consultoría, e investigaciones en seguridad privada.
            </p>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Proveemos servicios en las Américas, a través de profesionales especializados 
              en diferentes áreas de prevención y control, quienes están calificados con los 
              más altos niveles de formación y experiencia en diferentes áreas relacionadas.
            </p>
          </div>

          {/* Image Grid */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Main Image */}
            <div className="w-full h-[250px] md:h-[400px] overflow-hidden rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
                alt="Team Meeting"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
                "https://images.unsplash.com/photo-1552664730-d307ca884978",
                "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c",
                "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
                "https://images.unsplash.com/photo-1557804506-669a67965ba0",
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
              ].map((url, index) => (
                <div key={index} className="h-[120px] md:h-[180px] overflow-hidden rounded-lg shadow-md">
                  <img 
                    src={`${url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission and Vision Sections */}
      <div className="w-full">
        {/* Mission Section */}
        <div className="bg-[#10374E] text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">MISIÓN</h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Somos una firma creada en 1990, especializada en ayudar a las empresas y organizaciones en el 
                  control y administración de sus riesgos. Brindamos a nuestros clientes el nivel adecuado de soporte en 
                  materia de asesoría, consultoría, e investigaciones en seguridad privada.
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-[200px] md:h-[218px] overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Modern Office"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-[200px] md:h-[218px] overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Office Space"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-[#164B6A] text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 order-2 md:order-1">
                <div className="h-[200px] md:h-[218px] overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Team Meeting"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-[200px] md:h-[218px] overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Office Work"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="col-span-1 order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">VISIÓN</h2>
                <p className="text-sm md:text-base leading-relaxed">
                  Aspiramos a obtener reconocimiento nacional e internacional como la principal empresa aliada de 
                  confianza en la presentación de diversos servicios destinados a mitigar los diferentes riesgos los que 
                  están expuestos los diferentes clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;