import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Data {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  const loadTransactions = async (): Promise<void> => {
    const response = await api.get<Data>('transactions');

    const transactionsFormatted = response.data.transactions.map(
      transaction => ({
        ...transaction,
        formattedValue: formatValue(transaction.value),
        formattedDate: new Date(transaction.created_at).toLocaleDateString(
          'pt-BR',
        ),
      }),
    );

    const balanceFormatted = {
      income: formatValue(Number(response.data.balance.income)),
      outcome: formatValue(Number(response.data.balance.outcome)),
      total: formatValue(Number(response.data.balance.total)),
    };

    setTransactions(transactionsFormatted);
    setBalance(balanceFormatted);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          {balance && (
            <>
              <Card>
                <header>
                  <p>Entradas</p>
                  <img src={income} alt="Income" />
                </header>
                <h1 data-testid="balance-income">{balance.income}</h1>
              </Card>
              <Card>
                <header>
                  <p>Sa??das</p>
                  <img src={outcome} alt="Outcome" />
                </header>
                <h1 data-testid="balance-outcome">{balance.outcome}</h1>
              </Card>
              <Card total>
                <header>
                  <p>Total</p>
                  <img src={total} alt="Total" />
                </header>
                <h1 data-testid="balance-total">{balance.total}</h1>
              </Card>
            </>
          )}
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>T??tulo</th>
                <th>Pre??o</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            {transactions &&
              transactions.map((transaction: Transaction) => (
                <tbody key={transaction.id}>
                  <tr>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'outcome' && ' - '}
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                </tbody>
              ))}
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
