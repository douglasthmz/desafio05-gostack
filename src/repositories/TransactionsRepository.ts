import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface CreateTransactionDTO {
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

  public getBalance(): Balance {
    const income = this.transactions.reduce((total, transaction) => {
      if (transaction.type === 'income') {
        return total + transaction.value;
      }
      return total;
    }, 0);

    const outcome = this.transactions.reduce((total, transaction) => {
      if (transaction.type === 'outcome') {
        return total + transaction.value;
      }
      return total;
    }, 0);

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const currentBalance = this.getBalance();

    if (type === 'outcome' && value > currentBalance.total) {
      throw Error('You do not have money enought to do this operation');
    }

    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
