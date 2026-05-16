const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ status: 'success', data: { order: { ...order.toJSON(), _id: order.id } } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const rawOrders = await Order.findAll();
    const orders = rawOrders.map(o => ({ ...o.toJSON(), _id: o.id }));
    res.status(200).json({ status: 'success', data: { orders } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
