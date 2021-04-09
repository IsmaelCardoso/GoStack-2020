import { Router } from 'express';
import CreateTransactionService from '../services/CreateTransactionService';

import TransactionsRepository from '../repositories/TransactionsRepository';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();

    const balance = transactionsRepository.getBalance();

    const listOfTransactions = { transactions, balance };

    return response.status(200).json(listOfTransactions);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const createTransactionService = new CreateTransactionService(
      transactionsRepository,
    );

    const balance = transactionsRepository.getBalance();

    let newTrasaction = { title: '', value: 0, type: '' };

    if (type === 'income') {
      newTrasaction = createTransactionService.execute({
        title,
        value,
        type,
      });
    } else if (type === 'outcome' && balance.total >= value) {
      newTrasaction = createTransactionService.execute({
        title,
        value,
        type,
      });
    } else {
      throw Error('insufficient funds');
    }

    return response.status(200).json(newTrasaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
