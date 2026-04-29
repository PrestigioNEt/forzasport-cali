import React from 'react';
import FooterCustom from '@/components/custom/FooterCustom';

export const metadata = {
  title: 'Política de Protección de Datos | Forza Sport',
  description: 'Conoce cómo protegemos tus datos personales en Forza Sport. Política de privacidad y tratamiento de datos en Chile.'
};

export default function PoliticaProteccionDatos() {
  return (
    <>
     <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Política de Protección de Datos Personales
        </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <div className="text-gray-600">
          <p className="mb-6">
            Forza Sport, en cumplimiento de la Ley N° 19.628 sobre Protección de la Vida Privada y la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores, ha establecido esta Política de Tratamiento de Datos Personales para informar a nuestros clientes y usuarios sobre el manejo de su información personal en Chile.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              RESPONSABLE DEL TRATAMIENTO
            </h2>
            <p className="mb-4">
              <strong>Razón Social:</strong> Forza Sport
            </p>
            <p className="mb-4">
              <strong>Domicilio:</strong> Chile
            </p>
            <p className="mb-4">
              <strong>Correo electrónico:</strong> contacto@forzasport.com
            </p>
            <p className="mb-4">
              <strong>Teléfono:</strong> +56 9 4615 2919
            </p>
            <p className="mb-4">
              <strong>Sitio web:</strong> www.forzasport.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              DATOS PERSONALES QUE RECOPILAMOS
            </h2>
            <p className="mb-4">
              Forza Sport puede recopilar los siguientes tipos de información personal:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Datos de identificación:</strong> Nombre completo, RUT, fecha de nacimiento</li>
              <li><strong>Datos de contacto:</strong> Dirección de correo electrónico, número de teléfono, dirección postal</li>
              <li><strong>Datos de facturación y envío:</strong> Dirección de entrega, información de pago</li>
              <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia</li>
              <li><strong>Preferencias de compra:</strong> Historial de pedidos, productos favoritos, intereses en deportes, fitness y calzado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              FINALIDADES DEL TRATAMIENTO
            </h2>
            <p className="mb-4">
              Los datos personales recopilados serán utilizados para las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Procesar y gestionar pedidos de productos deportivos, calzado y accesorios de fitness</li>
              <li>Facilitar el proceso de pago y facturación electrónica</li>
              <li>Realizar envíos y entregas de productos a todo Chile</li>
              <li>Brindar atención al cliente y soporte postventa</li>
              <li>Enviar comunicaciones sobre el estado de pedidos</li>
              <li>Enviar información promocional, ofertas y novedades en perfumería (previo consentimiento)</li>
              <li>Realizar análisis estadísticos y estudios de mercado</li>
              <li>Mejorar nuestros productos, servicios y experiencia de usuario</li>
              <li>Cumplir con obligaciones legales y fiscales chilenas</li>
              <li>Prevenir fraudes y garantizar la seguridad de la plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              DERECHOS DE LOS TITULARES
            </h2>
            <p className="mb-4">
              Como titular de datos personales, usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Conocer, actualizar y rectificar</strong> sus datos personales frente a nosotros</li>
              <li><strong>Solicitar prueba</strong> de la autorización otorgada para el tratamiento</li>
              <li><strong>Ser informado</strong> sobre el uso que se ha dado a sus datos</li>
              <li><strong>Presentar reclamos</strong> ante el SERNAC (Servicio Nacional del Consumidor) o nuestro servicio al cliente</li>
              <li><strong>Revocar la autorización</strong> y solicitar la supresión de datos (cuando sea procedente)</li>
              <li><strong>Acceder gratuitamente</strong> a sus datos personales que poseemos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              PROCEDIMIENTO PARA EJERCER SUS DERECHOS
            </h2>
            <p className="mb-4">
              Para ejercer sus derechos sobre datos personales, puede contactarnos a través de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Correo electrónico: contacto@forzasport.com</li>
              <li>WhatsApp: +56 9 4615 2919</li>
            </ul>
            <p className="mb-4">
              Su solicitud será atendida en un plazo máximo de diez (10) días hábiles contados a partir de la fecha de recepción. Si la solicitud no puede ser atendida en ese plazo, se le informará el motivo de la demora y la fecha en que será atendida.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              SEGURIDAD DE LA INFORMACIÓN
            </h2>
            <p className="mb-4">
              Forza Sport implementa medidas técnicas, humanas y administrativas para proteger la información personal contra pérdida, robo, acceso no autorizado, divulgación, copia, uso o modificación.
            </p>
            <p className="mb-4">
              Nuestra plataforma utiliza protocolos de seguridad como SSL/TLS para cifrar la información transmitida entre su navegador y nuestros servidores. Los datos de pago son procesados a través de plataformas seguras que cumplen con los estándares PCI DSS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              TRANSFERENCIA Y TRANSMISIÓN DE DATOS
            </h2>
            <p className="mb-4">
              Forza Sport podrá transferir o transmitir datos personales a terceros cuando:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Sea necesario para cumplir con el objeto de la relación comercial (ej: empresas de mensajería para envíos en Chile)</li>
              <li>Se requiera para procesar pagos (ej: Webpay, Mercado Pago u otras pasarelas)</li>
              <li>Exista obligación legal de hacerlo</li>
              <li>Se haya obtenido autorización expresa del titular</li>
            </ul>
            <p className="mb-4">
              En todos los casos, nos aseguramos de que los terceros mantengan estándares de seguridad y confidencialidad adecuados.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              TIEMPO DE CONSERVACIÓN
            </h2>
            <p className="mb-4">
              Los datos personales serán conservados durante el tiempo que sea necesario para cumplir con las finalidades establecidas y para atender requerimientos legales, fiscales o contables en Chile. Una vez cumplidas estas finalidades y obligaciones, los datos serán eliminados de nuestros sistemas de forma segura.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              COOKIES Y TECNOLOGÍAS SIMILARES
            </h2>
            <p className="mb-4">
              Nuestro sitio web utiliza cookies y tecnologías similares para mejorar la experiencia del usuario, recordar preferencias y recopilar información sobre el uso del sitio. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades del sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              MENORES DE EDAD
            </h2>
            <p className="mb-4">
              Los servicios de Forza Sport están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información de menores de edad. Si un padre o tutor identifica que un menor ha proporcionado información sin su consentimiento, debe contactarnos inmediatamente para que procedamos con su eliminación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              MODIFICACIONES A LA POLÍTICA
            </h2>
            <p className="mb-4">
              Forza Sport se reserva el derecho de modificar esta Política de Protección de Datos en cualquier momento. Los cambios significativos serán comunicados a través de nuestra página web o por correo electrónico. Se recomienda revisar periódicamente esta política para estar informado sobre cómo protegemos su información.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              CONTACTO
            </h2>
            <p className="mb-4">
              Para cualquier consulta, duda o solicitud relacionada con el tratamiento de sus datos personales, puede contactarnos:
            </p>
            <ul className="list-none mb-4 space-y-2">
              <li><strong>Email:</strong> contacto@forzasport.com</li>
              <li><strong>WhatsApp:</strong> +56 9 4615 2919</li>
              <li><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (Hora chilena)</li>
            </ul>
          </section>

          <p className="mt-8 text-sm italic">
            Al utilizar nuestros servicios y proporcionar su información personal, usted acepta los términos de esta Política de Protección de Datos Personales.
          </p>
        </div>
      </div>
    </main>
      <FooterCustom />
    </>
  );
}
