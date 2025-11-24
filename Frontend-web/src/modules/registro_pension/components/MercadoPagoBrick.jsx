import React, { useEffect, useState } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';

// Inicializar Mercado Pago con tu Public Key
const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

initMercadoPago(PUBLIC_KEY, { locale: 'es-MX' });

export default function MercadoPagoBrick({ amount, onPaymentSuccess, onPaymentError, pensionData }) {
  const [loading, setLoading] = useState(false);

  const initialization = {
    amount: amount,
  };

  const customization = {
    visual: {
      style: {
        theme: 'default',
      },
    },
    paymentMethods: {
      maxInstallments: 1,
    },
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    console.log('Datos del pago:', formData);
    
    try {
      // El formData ya contiene el token del pago procesado por MP
      // Aquí llamarías a tu backend para guardar el registro
      await onPaymentSuccess({
        payment_id: formData.payment_id || 'test-' + Date.now(),
        status: formData.status || 'approved',
        payment_type: formData.payment_type_id || 'credit_card',
        transaction_amount: formData.transaction_amount || amount,
      });
    } catch (error) {
      console.error('Error al procesar pago:', error);
      onPaymentError(error.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const onError = async (error) => {
    console.error('Error en el brick:', error);
    onPaymentError('Error al cargar el formulario de pago. Verifica tu conexión.');
  };

  const onReady = async () => {
    console.log('Brick listo');
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      <Alert severity="info" sx={{ mb: 2 }}>
        💳 Usa las tarjetas de prueba de tu panel de Mercado Pago
      </Alert>

      <CardPayment
        initialization={initialization}
        customization={customization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      />
    </Box>
  );
}
