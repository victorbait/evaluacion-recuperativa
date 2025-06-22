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
const bcrypt_1 = __importDefault(require("bcrypt"));
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, sqlite_1.open)({
            filename: './database.sqlite',
            driver: sqlite3_1.default.Database
        });
        const adminUsername = 'admin';
        const adminPassword = 'admin123';
        const existingAdmin = yield db.get('SELECT * FROM users WHERE username = ?', adminUsername);
        if (!existingAdmin) {
            const saltRounds = 10;
            const passwordHash = yield bcrypt_1.default.hash(adminPassword, saltRounds);
            yield db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', adminUsername, passwordHash);
            console.log('✅ Usuario administrador "admin" creado exitosamente.');
        }
        else {
            console.log('ℹ️ El usuario administrador "admin" ya existe.');
        }
        yield db.close();
    });
}
seedAdmin();
