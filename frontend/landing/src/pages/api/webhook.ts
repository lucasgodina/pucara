import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    
    const body = await request.json();
    
    
    const notificationType = body.type || body.topic;
    const resourceId = body.data?.id || body.id;
    const resource = body.resource;
    
    console.log('🔔 Webhook recibido de Mercado Pago:');
    console.log('Tipo:', notificationType);
    console.log('Action:', body.action);
    console.log('Resource:', resource);
    console.log('Data ID:', resourceId);
    console.log('Fecha:', new Date().toISOString());
    console.log('Body completo:', JSON.stringify(body, null, 2));

    
    switch (notificationType) {
      case 'payment':
        await handlePaymentNotification(body);
        break;
      case 'merchant_order':
        await handleMerchantOrderNotification(body);
        break;
      default:
        console.log('⚠️ Tipo de notificación no manejado:', notificationType);
    }

    // Mercado Pago espera un 200 OK para confirmar recepción
    return new Response(
      JSON.stringify({ status: 'ok' }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    
    // Aún así devolver 200 para que MP no reintente
    return new Response(
      JSON.stringify({ status: 'error', error: 'Internal error' }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

// Manejar notificación de pago
async function handlePaymentNotification(body: any) {
  const paymentId = body.data?.id;
  
  if (!paymentId) {
    console.log('⚠️ No se encontró payment ID');
    return;
  }

  console.log('💳 Procesando pago:', paymentId);

  // Aquí puedes obtener más detalles del pago usando el SDK de MP
  // const payment = await getPaymentDetails(paymentId);
  
  // TODO: Guardar en base de datos
  // TODO: Enviar email de confirmación
  // TODO: Actualizar stock de productos
  // TODO: Crear orden en el sistema

  console.log('✅ Notificación de pago procesada');
}

// Manejar notificación de orden
async function handleMerchantOrderNotification(body: any) {
  // El ID puede venir en data.id o extraerse de la URL del resource
  const orderId = body.data?.id || body.id;
  const resource = body.resource;
  
  if (!orderId && !resource) {
    console.log('⚠️ No se encontró order ID ni resource URL');
    return;
  }

  console.log('📦 Procesando orden:', orderId || resource);
  
  // Aquí puedes hacer un GET a la URL del resource para obtener los detalles completos
  // fetch(resource) para obtener el estado del merchant_order
  
  // TODO: Actualizar estado de la orden en tu base de datos
  // TODO: Enviar email de confirmación al comprador
  // TODO: Actualizar stock de productos
  // TODO: Generar factura o comprobante
  
  console.log('✅ Notificación de merchant_order procesada');
}

// Función para obtener detalles del pago (opcional, requiere SDK)
// async function getPaymentDetails(paymentId: string) {
//   const { MercadoPagoConfig, Payment } = await import('mercadopago');
//   
//   const client = new MercadoPagoConfig({ 
//     accessToken: import.meta.env.MERCADOPAGO_ACCESS_TOKEN 
//   });
//   
//   const payment = new Payment(client);
//   return await payment.get({ id: paymentId });
// }
