import { Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileOrders: React.FC = () => {
  const { user, token } = useAuth() as any;
  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const res = await fetch('/api/products/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch order history');
        const orders = await res.json();
        setOrderHistory(orders);
      } catch (e) {
        console.error('Fetch orders error:', e);
        setOrderHistory([]);
      }
    };
    fetchOrderHistory();
  }, [token]);

  return (
    
    <Paper sx={{ borderRadius: 5, p: 4, minWidth: 350, maxWidth: 520, minHeight: 510, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', mx: 'auto', width: '100%' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>Order History</Typography>
      {orderHistory.length === 0 ? (
        <Typography variant="body1" align="center">No orders found.</Typography>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '8px' }}>Order #</th>
              <th style={{ padding: '8px' }}>Date</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Address</th>
              <th style={{ padding: '8px' }}>Payment</th>
              <th style={{ padding: '8px' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order: any) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px' }}>{order._id.slice(-6).toUpperCase()}</td>
                <td style={{ padding: '8px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '8px' }}>{order.status || 'Confirmed'}</td>
                <td style={{ padding: '8px' }}>{order.address}</td>
                <td style={{ padding: '8px' }}>{order.paymentMethod}</td>
                <td style={{ padding: '8px' }}>Rs {order.total?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Paper>
  );
};

export default ProfileOrders; 