import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener datos del producto desde el body
    const body = await request.json();
    const { productId, productName, productPrice } = body;

    // Validar datos
    if (!productId || !productName || !productPrice) {
      return new Response(
        JSON.stringify({ error: 'Datos del producto incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que existe el access token
    const accessToken = import.meta.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('❌ MERCADOPAGO_ACCESS_TOKEN no configurado');
      return new Response(
        JSON.stringify({ 
          error: 'Configuración de Mercado Pago incompleta. Por favor, configura las variables de entorno.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Configurar cliente de Mercado Pago
    const client = new MercadoPagoConfig({ 
      accessToken: accessToken,
      options: { timeout: 5000 }
    });

    // Crear instancia de preferencia
    const preference = new Preference(client);

    // Obtener la URL base del sitio
    const siteUrl = new URL(request.url).origin;

    console.log('🌐 Site URL:', siteUrl);

    // Crear preferencia de pago
    const preferenceData = {
      items: [
        {
          id: productId.toString(),
          title: productName,
          quantity: 1,
          unit_price: parseFloat(productPrice),
          currency_id: 'ARS',
        }
      ],
      back_urls: {
        success: `${siteUrl}/store/success`,
        failure: `${siteUrl}/store/failure`,
        pending: `${siteUrl}/store/pending`
      },
      auto_return: 'approved' as const,
      notification_url: `${siteUrl}/api/webhook`,
      statement_descriptor: 'PUCARA GAMING',
      external_reference: `PUCARA-${productId}-${Date.now()}`
    };

    const response = await preference.create({ body: preferenceData });

    // Retornar el init_point para redirigir al checkout
    return new Response(
      JSON.stringify({ 
        init_point: response.init_point,
        id: response.id 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar el pago',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};
