import { store } from '../db/store.js';

export const createOrder = (req, res) => {
  const { planName, planTier = 'NEET_PRO', amountInr = 1499 } = req.body;
  const orderId = `order_gyanvik_mock_${Date.now()}`;

  return res.json({
    success: true,
    message: 'Sandbox payment order created.',
    order: {
      orderId,
      planName,
      planTier,
      amountInr,
      currency: 'INR',
      gstAmount: Math.round(amountInr * 0.18),
      totalAmount: Math.round(amountInr * 1.18),
      environment: 'SANDBOX (Test Mode)'
    }
  });
};

export const verifyAndCompletePayment = (req, res) => {
  const studentId = req.user.id;
  const { planName, planTier = 'NEET_PRO', amountInr = 1499, paymentMethod = 'UPI (Sandbox)', gatewayOrderId } = req.body;

  const payment = store.createPayment({
    studentId,
    planName,
    planTier,
    amountInr: parseFloat(amountInr),
    currency: 'INR',
    status: 'SUCCESS',
    paymentMethod,
    gatewayOrderId: gatewayOrderId || `mock_order_${Date.now()}`,
    gatewayPaymentId: `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    validUntil: new Date(Date.now() + 86400000 * 180).toISOString(), // 6 months
    metadata: {
      studentEmail: req.user.email,
      studentName: req.user.fullName,
      verifiedAt: new Date().toISOString()
    }
  });

  return res.status(201).json({
    success: true,
    message: 'Payment simulated successfully in Sandbox Mode. Subscription is now active!',
    payment
  });
};

export const getStudentPayments = (req, res) => {
  const studentId = req.user.id;
  const payments = store.getStudentPayments(studentId);
  return res.json({ success: true, payments });
};

export const getAllTransactions = (req, res) => {
  const payments = store.getAllPayments();
  return res.json({ success: true, payments });
};
