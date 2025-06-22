"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_contacts_table_1 = require("./create-contacts-table");
const create_users_table_1 = require("./create-users-table");
const create_payments_table_1 = require("./create-payments-table");
const setupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Setting up database...');
    try {
        (0, create_users_table_1.createUsersTable)();
        (0, create_payments_table_1.createPaymentsTable)();
        yield (0, create_contacts_table_1.createContactsTable)();
        console.log('✅ Database setup complete.');
    }
    catch (err) {
        console.error('❌ Error setting up the database:', err);
    }
});
setupDatabase();
