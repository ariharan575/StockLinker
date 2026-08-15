import { axiosInstance } from "../../auth/api/axiosInstance";

export const orderApi = {
  placeOrder: (data) => axiosInstance.post('/v1/orders', data),

  getOrders: (status) => axiosInstance.get('/v1/orders', { 
    params: { status: status === 'all' ? null : status } 
  }),

  acceptAndSchedule: (orderId, deliveryDate) => 
    axiosInstance.post(`/v1/orders/${orderId}/accept`, { deliveryDate }),

  rejectOrder: (orderId, reason) => 
    axiosInstance.post(`/v1/orders/${orderId}/reject`, { reason }),

  getOrdersByDate: (date) => 
    axiosInstance.get('/v1/orders/by-date', { params: { date } }),

  updateRouteSequence: (deliveryDate, orderedOrderIds) => 
    axiosInstance.put('/v1/orders/route/sequence', { deliveryDate, orderedOrderIds }),

  startRouteForDate: (date) => 
    axiosInstance.post('/v1/orders/route/start', null, { params: { date } }),

  markDelivered: (orderId) => 
    axiosInstance.post(`/v1/orders/${orderId}/deliver`),

  getDeliveryRoute: (orderId) => 
    axiosInstance.get(`/v1/orders/${orderId}/route`)
};