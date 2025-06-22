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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
function addEmailColumn() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, sqlite_1.open)({
            filename: './database.sqlite',
            driver: sqlite3_1.default.Database
        });
        try {
            const tableInfo = yield db.all(`PRAGMA table_info(payments)`);
            const columnExists = tableInfo.some(column => column.name === 'email');
            if (!columnExists) {
                yield db.exec(`
        ALTER TABLE payments
        ADD COLUMN email TEXT;
      `);
                console.log('✅ Columna "email" agregada a la tabla de pagos.');
            }
            else {
                console.log('ℹ️ La columna "email" ya existe en la tabla de pagos.');
            }
        }
        catch (error) {
            console.error('❌ Error al agregar la columna "email":', error);
        }
        finally {
            yield db.close();
        }
    });
}
addEmailColumn();
