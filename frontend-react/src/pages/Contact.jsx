import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Swal from 'sweetalert2';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    
    // Mostrar alerta de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: 'Su mensaje ha sido enviado exitosamente. Nos pondremos en contacto pronto.',
      confirmButtonColor: '#10374E',
      timer: 3000,
      timerProgressBar: true
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  useEffect(() => {
      document.title = "Contacto";
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full md:h-[400px]">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1440&q=80" 
          alt="Contact Hero"
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
            <h1 className="text-3xl font-bold text-white md:text-6xl">CONTACTO</h1>
            <div className="h-0.5 w-16 bg-[#10374E] md:w-[231px]"></div>
          </div>
        </div>
      </div>

      {/* Contact Information and Form Section */}
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">Información de Contacto</h2>
              <p className="mb-8 text-gray-600">
                Estamos aquí para ayudarte. Contáctanos para cualquier consulta o solicitud.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-[#10374E] p-3">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Dirección</h3>
                  <p className="text-gray-600">Carrera 64 No. 94A - 56</p>
                  <p className="text-gray-600">Bogotá, Colombia</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-[#10374E] p-3">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Teléfono</h3>
                  <p className="text-gray-600">(+57) 318 8066302</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="rounded-lg bg-[#10374E] p-3">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">procesos@colpryst.com</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[300px] overflow-hidden rounded-lg bg-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.781203899536!2d-74.0788268!3d4.6694566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a5a5e5a5a5e%3A0x5b5ef5f5a5e5a5e5!2sCarrera%2064%20%2394a-56%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1620000000000!5m2!1ses!2sco"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Ubicación exacta de la empresa"
              ></iframe>
              <div className="mt-2 text-center text-sm text-gray-600">
                <p>Nos encontramos en Carrera 64 #94A-56, Bogotá</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Asunto
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mensaje
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#10374E] py-3 text-white transition-colors hover:bg-blue-700"
              >
                <Send className="h-5 w-5" />
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;