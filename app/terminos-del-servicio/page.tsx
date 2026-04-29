import React from 'react';
import FooterCustom from '@/components/custom/FooterCustom';

export const metadata = {
  title: 'Términos del Servicio | Forza Sport',
  description: 'Conoce nuestros términos del servicio y condiciones de uso de la tienda Forza Sport.'
};

export default function TerminosDelServicio() {
  return (
    <>
     <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Términos del Servicio
        </h1>

      {/* Contenedor principal con estilos para el contenido */}
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <div className="text-gray-600">
          <p className="mb-6">
            Forza Sport se dedica a la comercialización de productos deportivos, belleza y cuidado personal a través de distintos canales. Estos términos rigen exclusivamente para las compras que se hagan directamente en la tienda online www.forzasport.com
          </p>

          <p className="mb-6">
            Al usar este Sitio, el usuario admite haber leído y entendido estos Términos de Uso y está de acuerdo en sujetarse a los mismos y cumplir con todas las leyes y reglamentos aplicables que hagan parte de la Legislación Chilena. Además, cuando el usuario utilice cualquier servicio suministrado en este Sitio, estará sujeto a las reglas, guías, políticas, términos y condiciones aplicables.
          </p>

          <p className="mb-8">
            Cualquier persona que ingrese sus datos debe ser persona capaz según las leyes de la república de Chile para realizar transacciones comerciales en la tienda online. Los menores de edad podrán navegar en la página web, pero no están habilitados para realizar ningún tipo de transacción.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              PROCESO DE COMPRA
            </h2>
            <p className="mb-4">
              Para realizar una compra el usuario o cliente podrá navegar el catálogo y agregar productos al carrito. Luego confirmará el pedido a través de WhatsApp donde se coordinarán los detalles de pago y envío.
            </p>
            <p className="mb-4">
              El proceso de compra se considera perfeccionado una vez confirmado el pago. Aceptamos transferencia bancaria, Webpay y Mercado Pago como métodos de pago.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              DERECHO DE RETRACTO
            </h2>
            <p className="mb-4">
              El consumidor podrá hacer uso del derecho de retracto contenido en la Ley 19.496 sobre Protección de los Derechos de los Consumidores. El término máximo para ejercer el derecho de retracto será de diez (10) días hábiles contados a partir de la entrega del producto.
            </p>
            <p className="mb-4">
              El consumidor deberá devolver el producto a Forza Sport por los mismos medios y en las mismas condiciones en que lo recibió, sin haber sido abierto o usado. Los costos de transporte y los demás que conlleve la devolución del producto serán cubiertos por el consumidor, salvo que el producto presente defectos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              RECEPCIÓN DE LOS PRODUCTOS
            </h2>
            <p className="mb-4">
              El envío de los productos se realiza a todo Chile, a través de empresas de mensajería certificadas (Chilexpress, Correos de Chile, Starken, Bluexpress), en un plazo pactado según el destino elegido, contados a partir del perfeccionamiento del contrato y confirmación del pago.
            </p>
            <p className="mb-4">
              Al recibir el producto, el cliente debe verificar que el envío esté en buenas condiciones y que el contenido corresponda a lo solicitado. Cualquier anomalía debe ser reportada dentro de las 24 horas siguientes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              PROMOCIONES
            </h2>
            <p className="mb-4">
              Las promociones, su vigencia y disponibilidad serán publicadas en la página y su publicidad será clara. Si alguna de las promociones no indica la fecha de la vigencia, ésta se entenderá que durará hasta agotar existencias.
            </p>
            <p className="mb-4">
              Para los productos en promoción se aplican las mismas políticas de reembolso que el resto de los productos, considerando el valor efectivamente pagado.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              PROPIEDAD INTELECTUAL Y DERECHOS DE AUTOR
            </h2>
            <p className="mb-4">
              Todas las marcas, logos, nombres y otros signos distintivos, así como los diseños y demás elementos de propiedad intelectual o industrial insertados y usados en esta página son Propiedad exclusiva de Forza Sport y están protegidos por las leyes chilenas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              QUEJAS Y RECLAMOS
            </h2>
            <p className="mb-4">
              Forza Sport ha dispuesto diferentes canales de atención para atender las peticiones, quejas y reclamos de sus usuarios de manera exitosa, de acuerdo con la Ley 19.496. Puedes comunicarte con nosotros a través de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>WhatsApp: +56 9 4615 2919</li>
              <li>Correo electrónico: contacto@forzasport.com</li>
              <li>Formulario de contacto disponible en el sitio</li>
            </ul>
            <p className="mb-4">
              Todas las consultas serán respondidas en un plazo máximo de 5 días hábiles según lo establece la normativa chilena.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              CONTACTO
            </h2>
            <p className="mb-4">
              Para cualquier consulta sobre nuestros términos del servicio:
            </p>
            <ul className="list-none mb-4 space-y-2">
              <li><strong>Email:</strong> contacto@forzasport.com</li>
              <li><strong>WhatsApp:</strong> +56 9 4615 2919</li>
              <li><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (Hora chilena)</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
      <FooterCustom />
    </>
  );
}
