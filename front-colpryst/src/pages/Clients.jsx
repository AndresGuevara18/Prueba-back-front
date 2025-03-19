import React from 'react';
import { Building2, Shield, Store, GraduationCap, Pill, Droplet } from 'lucide-react';

function Clients() {
  const mainClients = [
    "Andiseg",
    "Cafam",
    "Droguerías Cruz Verde",
    "Secamcol",
    "Expertos Seguridad",
    "Banco Unión"
  ];

  const industries = [
    {
      name: "EDUCACION",
      icon: <GraduationCap className="w-12 h-12 md:w-16 md:h-16 text-white" />
    },
    {
      name: "RETAIL",
      icon: <Store className="w-12 h-12 md:w-16 md:h-16 text-white" />
    },
    {
      name: "FARMACEUTICA",
      icon: <Pill className="w-12 h-12 md:w-16 md:h-16 text-white" />
    },
    {
      name: "PETROLEO",
      icon: <Droplet className="w-12 h-12 md:w-16 md:h-16 text-white" />
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <img 
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="Clients Hero"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E]"></div>
            <h1 className="text-3xl md:text-6xl font-bold text-white">NUESTROS CLIENTES</h1>
            <div className="w-16 md:w-[231px] h-0.5 bg-[#10374E]"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Client Showcase Section - Full width background */}
        <div className="relative w-full h-[451px] bg-[#10374E] my-8 md:my-16">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="flex flex-col md:flex-row w-full h-full">
              {/* Left Side - Image */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0 h-[451px] w-full md:w-[710px]">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Office Environment"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side - Client List */}
              <div className="ml-auto w-full md:w-1/2 h-full flex items-center justify-center md:justify-end">
                <div className="bg-[#10374E]/90 p-6 md:p-8 text-white w-full md:max-w-md backdrop-blur-sm">
                  <h2 className="text-xl md:text-2xl mb-6">Nuestros principales clientes son:</h2>
                  <ul className="space-y-4">
                    {mainClients.map((client, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-base md:text-lg">{index + 1}. {client}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-8 flex items-center gap-2 bg-white/10 px-4 md:px-6 py-2 rounded-full hover:bg-white/20 transition-colors">
                    Ver video
                    <Shield className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recognition Section - Full width background */}
        <div className="relative w-full h-[451px] bg-[#10374E] my-8 md:my-16">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="flex flex-col md:flex-row w-full h-full">
              {/* Right Side - Image (order reversed) */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 h-[451px] w-full md:w-[710px]">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Team Meeting"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Left Side - Text (order reversed) */}
              <div className="w-full md:w-1/2 h-full flex items-center justify-center md:justify-start">
                <div className="bg-[#10374E]/90 p-6 md:p-8 text-white w-full md:max-w-md backdrop-blur-sm">
                  <p className="text-base md:text-lg">
                    Tenemos reconocimiento a nivel nacional e internacional ya que somos uno de los 
                    patrocinadores del Congreso de Asia Seguridad - Mujeres al poder de la seguridad
                  </p>
                  <button className="mt-8 flex items-center gap-2 bg-white/10 px-4 md:px-6 py-2 rounded-full hover:bg-white/20 transition-colors">
                    Ver video
                    <Shield className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="bg-[#10374E] py-12 md:py-16 -mx-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <div key={index} className="flex flex-col items-center justify-center text-center">
                  {industry.icon}
                  <span className="text-white text-base md:text-lg font-medium mt-4">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Text */}
            <div className="space-y-6">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur. Rutrum vulputate vitae, dolor velit odio diam. Eu neque, faucibus et bibendum tincidunt, nullam id vitae. Id neque euismod, mattis viverra pharetra. Quam, ullamcorper turpis cursus dignissim, duis dictumst tellus faucibus sit.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur. Rutrum vulputate vitae, dolor velit odio diam. Eu neque, faucibus et bibendum tincidunt, nullam id vitae. Id neque euismod, mattis viverra pharetra. Quam, ullamcorper turpis cursus dignissim, duis dictumst.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="h-[300px] md:h-[414px]">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Office Meeting"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;