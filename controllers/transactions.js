const connectDB = require('../config/db');

// @desc Get all transactions
// @route GET /api/v1/transactions
// @access Public
exports.getTransactions = (req, res, next) => {
  try {
    return connectDB.getAll((data) => {
      res.status(200).json({
        success: true,
        count: data.length,
        data: data,
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc Add transactions
// @route POST /api/v1/transactions
// @access Public
exports.addTransaction = (req, res, next) => {
  try {
    const { text, amount } = req.body;

    if (!text && !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text and amount',
      });
    }

    return connectDB.addTransaction(req.body, (transaction) => {
      res.status(201).json({
        success: true,
        data: transaction,
      });
    });
  } catch (err) {
    console.log('sdfs', err);
  }
};

// @desc Delete transaction
// @route DELETE /api/v1/transactions/:id
// @access Public
exports.deleteTransaction = (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide ID',
      });
    }

    return connectDB.deleteTransaction(id, (transaction) => {
      res.status(200).json({
        success: true,
        data: {},
      });
    });
  } catch (err) {
    console.log('sdfs', err);
  }
};
