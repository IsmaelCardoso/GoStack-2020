import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository, In } from 'typeorm';
import Transaction from '../models/Transaction';

import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const contactsReadStrem = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parceCSV = contactsReadStrem.pipe(parsers);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parceCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parceCSV.on('end', resolve));

    const existentsCategories = await categoryRepository.find({
      where: {
        title: In(categories),
      },
    });
    const existentCategogoriesTitle = existentsCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitle = categories
      .filter(category => !existentCategogoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoryRepository.create(
      addCategoryTitle.map(title => ({
        title,
      })),
    );

    await categoryRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentsCategories];

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);
    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
