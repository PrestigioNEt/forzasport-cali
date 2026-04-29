import React from 'react';
import Link from 'next/link';
import FooterCustom from '@/components/custom/FooterCustom';

export const metadata = {
  title: 'Términos y Condiciones | Forza Sport',
  description: 'Lee los términos y condiciones de uso de la tienda online Forza Sport.'
};

export default function TerminosYCondiciones() {
  return (
    <>
     <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Términos y Condiciones
        </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <div className="text-gray-600">
          <p className="mb-6">
            Bienvenido a Forza Sport. Al acceder y utilizar este sitio web y nuestros servicios, aceptas cumplir y estar sujeto a los siguientes términos y condiciones. Por favor, léelos detenidamente.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. ACEPTACIÓN DE TÉRMINOS
            </h2>
            <p className="mb-4">
              Al acceder a www.forzasport.com y realizar una compra, aceptas estar obligado por estos Términos y Condiciones, todas las leyes y regulaciones aplicables de Chile, y aceptas que eres responsable del cumplimiento de cualquier ley local aplicable.
            </p>
            <p className="mb-4">
              Si no estás de acuerdo con alguno de estos términos, te prohibimos usar o acceder a este sitio. Los materiales contenidos en este sitio web están protegidos por las leyes de derechos de autor y marcas registradas aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. USO DEL SITIO WEB
            </h2>
            <p className="mb-4">
              Se te concede permiso para descargar temporalmente una copia de los materiales en el sitio web de Forza Sport solo para visualización transitoria personal y no comercial. Esto es el otorgamiento de una licencia, no una transferencia de título, y bajo esta licencia no puedes:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Modificar o copiar los materiales</li>
              <li>Usar los materiales para cualquier propósito comercial</li>
              <li>Intentar descompilar o realizar ingeniería inversa de cualquier software del sitio</li>
              <li>Eliminar cualquier copyright u otras notaciones de propiedad de los materiales</li>
              <li>Transferir los materiales a otra persona o "reflejar" los materiales en cualquier otro servidor</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. REGISTRO DE CUENTA
            </h2>
            <p className="mb-4">
              Para realizar compras en nuestro sitio, puedes crear una cuenta proporcionando información veraz, actual y completa. Eres responsable de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Mantener la confidencialidad de tu contraseña</li>
              <li>Todas las actividades que ocurran bajo tu cuenta</li>
              <li>Notificarnos inmediatamente de cualquier uso no autorizado de tu cuenta</li>
            </ul>
            <p className="mb-4">
              Solo pueden registrarse personas mayores de 18 años con capacidad legal para contratar. Los menores de edad pueden navegar el sitio pero no realizar transacciones.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. PRODUCTOS Y PRECIOS
            </h2>
            <p className="mb-4">
              Todos los productos deportivos, calzado y accesorios de fitness están sujetos a disponibilidad. Los precios de los productos están sujetos a cambio sin previo aviso.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Los precios están expresados en pesos chilenos (CLP)</li>
              <li>Los precios incluyen IVA cuando aplique</li>
              <li>Nos reservamos el derecho de limitar las cantidades de productos adquiridos por persona o pedido</li>
              <li>Las imágenes de productos son referenciales y pueden variar ligeramente del producto real</li>
              <li>Nos reservamos el derecho de descontinuar cualquier producto en cualquier momento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. PROCESO DE COMPRA Y PAGO
            </h2>
            <p className="mb-4">
              El proceso de compra se perfecciona cuando:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>Agregas productos al carrito de compras</li>
              <li>Proporcionas información de envío y facturación</li>
              <li>Confirmas el pedido por WhatsApp</li>
              <li>Recibes confirmación de compra y coordinas el pago</li>
            </ol>
            <p className="mb-4">
              Aceptamos los siguientes métodos de pago:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Transferencia bancaria</li>
              <li>Webpay</li>
              <li>Mercado Pago</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. ENVÍOS Y ENTREGAS
            </h2>
            <p className="mb-4">
              Los envíos se realizan a todo Chile. Los tiempos de entrega son estimados y comienzan a contarse desde la confirmación del pago y despacho del producto.
            </p>
            <p className="mb-4">
              Forza Sport no se hace responsable por retrasos causados por la empresa de mensajería, condiciones climáticas, festivos, o situaciones de fuerza mayor.
            </p>
            <p className="mb-4">
              Para más información, consulta nuestra <Link href="/politica-envios" className="text-blue-600 hover:underline">Política de Envíos</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. DERECHO DE RETRACTO Y DEVOLUCIONES
            </h2>
            <p className="mb-4">
              Conforme a la Ley 19.496 sobre Protección de los Derechos de los Consumidores, tienes derecho a retractarte de tu compra dentro de los diez (10) días hábiles siguientes a la recepción del producto.
            </p>
            <p className="mb-4">
              Para ejercer este derecho y conocer las condiciones, consulta nuestra <Link href="/politica-reembolso" className="text-blue-600 hover:underline">Política de Reembolso</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. GARANTÍA
            </h2>
            <p className="mb-4">
              Todos nuestros productos deportivos y calzado cuentan con garantía de calidad al recibo. La garantía cubre:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Calzado que llegue con defectos de fabricación</li>
              <li>Productos deportivos distintos a los solicitados</li>
              <li>Problemas con el empaque (cajas rotas, daños visibles)</li>
              <li>Accesorios de fitness con piezas faltantes o defectuosas</li>
            </ul>
            <p className="mb-4">
              La garantía NO cubre:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Calzado usado o con signos de deterioro por uso normal</li>
              <li>Incomodidad por talla incorrecta (debe verificarse antes de usar)</li>
              <li>Daños por mal uso, uso indebido o deportes no recomendados para el calzado</li>
              <li>Desgaste normal por uso (suelas desgastadas, etc.)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. PROPIEDAD INTELECTUAL
            </h2>
            <p className="mb-4">
              Todo el contenido de este sitio web, incluyendo pero no limitado a:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Textos, gráficos, logos, imágenes</li>
              <li>Fotografías de productos</li>
              <li>Software y código</li>
              <li>Diseños y compilaciones</li>
              <li>Marcas y nombres comerciales</li>
            </ul>
            <p className="mb-4">
              Son propiedad exclusiva de Forza Sport y están protegidos por las leyes de propiedad intelectual de Chile. Cualquier uso no autorizado constituirá una violación de estas leyes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. PRIVACIDAD Y PROTECCIÓN DE DATOS
            </h2>
            <p className="mb-4">
              Tu privacidad es importante para nosotros. El uso de tu información personal está regido por nuestra <Link href="/politica-proteccion-datos" className="text-blue-600 hover:underline">Política de Protección de Datos</Link>, que cumple con la Ley N° 19.628 sobre Protección de la Vida Privada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. LIMITACIÓN DE RESPONSABILIDAD
            </h2>
            <p className="mb-4">
              En ningún caso Forza Sport será responsable por:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Daños directos, indirectos, incidentales o consecuentes</li>
              <li>Pérdida de ganancias o datos</li>
              <li>Interrupción del negocio</li>
              <li>Daños que surjan del uso o la imposibilidad de usar nuestro sitio web</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. ENLACES A TERCEROS
            </h2>
            <p className="mb-4">
              Nuestro sitio puede contener enlaces a sitios web de terceros. Forza Sport no tiene control sobre estos sitios y no asume responsabilidad por su contenido, políticas de privacidad o prácticas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. MODIFICACIONES
            </h2>
            <p className="mb-4">
              Forza Sport se reserva el derecho de:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Modificar estos Términos y Condiciones en cualquier momento</li>
              <li>Cambiar, suspender o descontinuar cualquier aspecto del sitio web</li>
              <li>Modificar o descontinuar productos y servicios</li>
            </ul>
            <p className="mb-4">
              Los cambios entrarán en vigencia inmediatamente después de su publicación. Es tu responsabilidad revisar periódicamente estos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. CANCELACIÓN DE PEDIDOS
            </h2>
            <p className="mb-4">
              Forza Sport se reserva el derecho de rechazar o cancelar pedidos por las siguientes razones:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Producto no disponible</li>
              <li>Error en precio o descripción del producto</li>
              <li>Problema con el método de pago</li>
              <li>Sospecha de fraude</li>
              <li>Información de contacto incorrecta o incompleta</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. JURISDICCIÓN Y LEY APLICABLE
            </h2>
            <p className="mb-4">
              Estos Términos y Condiciones se rigen por las leyes de la República de Chile. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de Chile.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              16. CONTACTO
            </h2>
            <p className="mb-4">
              Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos:
            </p>
            <ul className="list-none mb-4 space-y-2">
              <li><strong>Email:</strong> contacto@forzasport.com</li>
              <li><strong>WhatsApp:</strong> +56 9 4615 2919</li>
              <li><strong>Sitio web:</strong> www.forzasport.com</li>
              <li><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM (Hora chilena)</li>
            </ul>
          </section>

          <p className="mt-8 text-sm italic">
            Al utilizar nuestro sitio web y realizar una compra, reconoces que has leído, entendido y aceptado estar obligado por estos Términos y Condiciones.
          </p>
        </div>
      </div>
    </main>
      <FooterCustom />
    </>
  );
}
