import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionCTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private totalIncome(): number {
    let income = 0;
    const isIncome = this.transactions.filter(
      transaction => transaction.type === 'income',
    );
    if (isIncome.length > 0) {
      income = isIncome
        .map(transaction => transaction.value)
        .reduce((acc, curr) => acc + curr);
    } else {
      income = 0;
    }

    return income;
  }

  private totalOutcome(): number {
    let outcome = 0;
    const isOutcome = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );
    if (isOutcome.length > 0) {
      outcome = isOutcome
        .map(transaction => transaction.value)
        .reduce((acc, curr) => acc + curr);
    } else {
      outcome = 0;
    }

    return outcome;
  }

  public getBalance(): Balance {
    const income = this.totalIncome();
    const outcome = this.totalOutcome();

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: TransactionCTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
