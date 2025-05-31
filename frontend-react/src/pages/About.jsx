import React, { useEffect } from 'react';
import { Shield, Users, FileSearch, BookOpen } from 'lucide-react';

function About() {
  useEffect(() => {
      document.title = "Nosotros";
  }, []);


  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full md:h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="About Us Hero"
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
            <h1 className="text-3xl font-bold text-white md:text-6xl">NOSOTROS</h1>
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-16">
        <div className="space-y-8 md:space-y-12">
          {/* Company Description */}
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-base leading-relaxed text-gray-700 md:text-lg">
              Somos una firma creada en 1990, especializada en ayudar a las empresas y 
              organizaciones en el control y administración de sus riesgos. Brindamos a 
              nuestros clientes el nivel adecuado de soporte en materia de asesoría, 
              consultoría, e investigaciones en seguridad privada.
            </p>
            <p className="text-base leading-relaxed text-gray-700 md:text-lg">
              Proveemos servicios en las Américas, a través de profesionales especializados 
              en diferentes áreas de prevención y control, quienes están calificados con los 
              más altos niveles de formación y experiencia en diferentes áreas relacionadas.
            </p>
          </div>

          {/* Image Grid */}
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Main Image */}
            <div className="h-[250px] w-full overflow-hidden rounded-lg shadow-lg md:h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
                alt="Team Meeting"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {[
                "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
                "https://images.unsplash.com/photo-1552664730-d307ca884978",
                "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c",
                "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
                "https://images.unsplash.com/photo-1557804506-669a67965ba0",
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
              ].map((url, index) => (
                <div key={index} className="h-[120px] overflow-hidden rounded-lg shadow-md md:h-[180px]">
                  <img 
                    src={`${url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`}
                    alt={`Gallery Image ${index + 1}`}
                    className="h-full w-full object-cover"
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
        <div className="bg-[#10374E] py-12 text-white md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="col-span-1">
                <h2 className="mb-6 text-3xl font-bold md:text-4xl">MISIÓN</h2>
                <p className="text-sm leading-relaxed md:text-base">
                  Somos una firma creada en 1990, especializada en ayudar a las empresas y organizaciones en el 
                  control y administración de sus riesgos. Brindamos a nuestros clientes el nivel adecuado de soporte en 
                  materia de asesoría, consultoría, e investigaciones en seguridad privada.
                </p>
              </div>
              <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="h-[200px] overflow-hidden rounded-lg md:h-[218px]">
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Modern Office"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-[200px] overflow-hidden rounded-lg md:h-[218px]">
                  <img 
                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Office Space"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-[#164B6A] py-12 text-white md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="order-2 col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:order-1">
                <div className="h-[200px] overflow-hidden rounded-lg md:h-[218px]">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Team Meeting"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="h-[200px] overflow-hidden rounded-lg md:h-[218px]">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Office Work"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="order-1 col-span-1 md:order-2">
                <h2 className="mb-6 text-3xl font-bold md:text-4xl">VISIÓN</h2>
                <p className="text-sm leading-relaxed md:text-base">
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