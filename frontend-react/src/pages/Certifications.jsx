import React, { useEffect } from 'react';
import { Shield, Award, CheckCircle, Star } from 'lucide-react';
import basc from '../assets/img/certificado-basc.png';
import vigilacia from '../assets/img/certificado-Supervigilancia.png'





function Certifications() {
  useEffect(() => {
        document.title = "Certificaciones";
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full md:h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="Certifications Hero"
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
            <h1 className="text-3xl font-bold text-white md:text-6xl">CERTIFICACIONES</h1>
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* BASC Certification */}
          <div className="mb-16">
            <div className="mb-12 text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-800">Certificación BASC</h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-700">
                Contamos con el certificado de Gestión y Seguridad BASC, en el que tenemos documentados y 
                controlados todos nuestros procesos, procedimientos e instructivos. Realizamos auditoría 
                periódica a nuestros servicios de forma que se controle la calidad y se detecten posibles 
                desviaciones que puedan afectar la calidad de nuestros servicios.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="md:flex">
                <div className="p-8 md:w-1/2">
                  <div className="relative h-64">
                    <img 
                      src={basc}
                      alt="BASC Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-8 md:w-1/2">
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">Beneficios BASC</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 text-green-500" />
                      <span>Certificación internacional que garantiza la seguridad en nuestras operaciones</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 text-green-500" />
                      <span>Auditorías periódicas para mantener altos estándares de calidad</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 text-green-500" />
                      <span>Procesos documentados y controlados</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 text-green-500" />
                      <span>Personal capacitado y comprometido con la seguridad</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SuperVigilancia Certification */}
          <div>
            <div className="mb-12 text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-800">Certificación SuperVigilancia</h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-700">
                Estamos certificados por la Superintendencia de Vigilancia y Seguridad Privada, 
                garantizando el cumplimiento de todos los requisitos legales y normativos para 
                la prestación de servicios de seguridad privada en Colombia.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
              <div className="flex-row-reverse md:flex">
                <div className="p-8 md:w-1/2">
                  <div className="relative h-64">
                    <img 
                      src={vigilacia} 
                      alt="SuperVigilancia Logo"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-8 md:w-1/2">
                  <h3 className="mb-4 text-2xl font-bold text-gray-800">Alcance de la Certificación</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Star className="mr-3 mt-1 h-5 w-5 text-blue-500" />
                      <span>Autorización legal para operar servicios de seguridad privada</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="mr-3 mt-1 h-5 w-5 text-blue-500" />
                      <span>Cumplimiento de estándares nacionales de seguridad</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="mr-3 mt-1 h-5 w-5 text-blue-500" />
                      <span>Personal altamente capacitado y certificado</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="mr-3 mt-1 h-5 w-5 text-blue-500" />
                      <span>Supervisión y control permanente de operaciones</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certifications;