import React, { useEffect } from 'react';
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
      icon: <GraduationCap className="h-12 w-12 text-white md:h-16 md:w-16" />
    },
    {
      name: "RETAIL",
      icon: <Store className="h-12 w-12 text-white md:h-16 md:w-16" />
    },
    {
      name: "FARMACEUTICA",
      icon: <Pill className="h-12 w-12 text-white md:h-16 md:w-16" />
    },
    {
      name: "PETROLEO",
      icon: <Droplet className="h-12 w-12 text-white md:h-16 md:w-16" />
    }
  ];

  useEffect(() => {
        document.title = "Clientes";
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full md:h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="Clients Hero"
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
            <h1 className="text-3xl font-bold text-white md:text-6xl">NUESTROS CLIENTES</h1>
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4">
        {/* Client Showcase Section - Full width background */}
        <div className="relative my-8 h-[451px] w-full bg-[#10374E] md:my-16">
          <div className="mx-auto flex h-full max-w-7xl items-center px-4">
            <div className="flex h-full w-full flex-col md:flex-row">
              {/* Left Side - Image */}
              <div className="absolute left-1/2 top-0 h-[451px] w-full -translate-x-1/2 transform md:left-0 md:w-[710px] md:translate-x-0">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Office Environment"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Right Side - Client List */}
              <div className="ml-auto flex h-full w-full items-center justify-center md:w-1/2 md:justify-end">
                <div className="w-full bg-[#10374E]/90 p-6 text-white backdrop-blur-sm md:max-w-md md:p-8">
                  <h2 className="mb-6 text-xl md:text-2xl">Nuestros principales clientes son:</h2>
                  <ul className="space-y-4">
                    {mainClients.map((client, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-base md:text-lg">{index + 1}. {client}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/20 md:px-6">
                    Ver video
                    <Shield className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recognition Section - Full width background */}
        <div className="relative my-8 h-[451px] w-full bg-[#10374E] md:my-16">
          <div className="mx-auto flex h-full max-w-7xl items-center px-4">
            <div className="flex h-full w-full flex-col md:flex-row">
              {/* Right Side - Image (order reversed) */}
              <div className="absolute left-1/2 top-0 h-[451px] w-full -translate-x-1/2 transform md:left-auto md:right-0 md:w-[710px] md:translate-x-0">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Team Meeting"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Left Side - Text (order reversed) */}
              <div className="flex h-full w-full items-center justify-center md:w-1/2 md:justify-start">
                <div className="w-full bg-[#10374E]/90 p-6 text-white backdrop-blur-sm md:max-w-md md:p-8">
                  <p className="text-base md:text-lg">
                    Tenemos reconocimiento a nivel nacional e internacional ya que somos uno de los 
                    patrocinadores del Congreso de Asia Seguridad - Mujeres al poder de la seguridad
                  </p>
                  <button className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/20 md:px-6">
                    Ver video
                    <Shield className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="-mx-4 bg-[#10374E] py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {industries.map((industry, index) => (
                <div key={index} className="flex flex-col items-center justify-center text-center">
                  {industry.icon}
                  <span className="mt-4 text-base font-medium text-white md:text-lg">{industry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* Left Side - Text */}
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                Lorem ipsum dolor sit amet, consectetur. Rutrum vulputate vitae, dolor velit odio diam. Eu neque, faucibus et bibendum tincidunt, nullam id vitae. Id neque euismod, mattis viverra pharetra. Quam, ullamcorper turpis cursus dignissim, duis dictumst tellus faucibus sit.
              </p>
              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                Lorem ipsum dolor sit amet, consectetur. Rutrum vulputate vitae, dolor velit odio diam. Eu neque, faucibus et bibendum tincidunt, nullam id vitae. Id neque euismod, mattis viverra pharetra. Quam, ullamcorper turpis cursus dignissim, duis dictumst.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="h-[300px] md:h-[414px]">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Office Meeting"
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;