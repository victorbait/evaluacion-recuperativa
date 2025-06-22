import { createContactsTable } from './create-contacts-table';
import { createUsersTable } from './create-users-table';
import { createPaymentsTable } from './create-payments-table';

const setupDatabase = async () => {
  console.log('Setting up database...');
  try {
    createUsersTable();
    createPaymentsTable();
    await createContactsTable();
    console.log('✅ Database setup complete.');
  } catch (err) {
    console.error('❌ Error setting up the database:', err);
  }
};

setupDatabase();
