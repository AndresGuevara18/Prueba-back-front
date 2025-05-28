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
      <div className="relative h-[300px] md:h-[400px] w-full">
        <img 
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="Certifications Hero"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E]"></div>
            <h1 className="text-3xl md:text-6xl font-bold text-white">CERTIFICACIONES</h1>
            <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E]"></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* BASC Certification */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Certificación BASC</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Contamos con el certificado de Gestión y Seguridad BASC, en el que tenemos documentados y 
                controlados todos nuestros procesos, procedimientos e instructivos. Realizamos auditoría 
                periódica a nuestros servicios de forma que se controle la calidad y se detecten posibles 
                desviaciones que puedan afectar la calidad de nuestros servicios.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8">
                  <div className="h-64 relative">
                    <img 
                      src={basc}
                      alt="BASC Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-8 bg-gray-50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Beneficios BASC</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                      <span>Certificación internacional que garantiza la seguridad en nuestras operaciones</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                      <span>Auditorías periódicas para mantener altos estándares de calidad</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                      <span>Procesos documentados y controlados</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3" />
                      <span>Personal capacitado y comprometido con la seguridad</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SuperVigilancia Certification */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Certificación SuperVigilancia</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Estamos certificados por la Superintendencia de Vigilancia y Seguridad Privada, 
                garantizando el cumplimiento de todos los requisitos legales y normativos para 
                la prestación de servicios de seguridad privada en Colombia.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex flex-row-reverse">
                <div className="md:w-1/2 p-8">
                  <div className="h-64 relative">
                    <img 
                      src={vigilacia} 
                      alt="SuperVigilancia Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 p-8 bg-gray-50">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Alcance de la Certificación</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>Autorización legal para operar servicios de seguridad privada</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>Cumplimiento de estándares nacionales de seguridad</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
                      <span>Personal altamente capacitado y certificado</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-5 h-5 text-blue-500 mt-1 mr-3" />
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