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
function addGoogleOAuthFields() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, sqlite_1.open)({ filename: './database.sqlite', driver: sqlite3_1.default.Database });
            // Verificar si las columnas ya existen
            const tableInfo = yield db.all("PRAGMA table_info(users)");
            const columnNames = tableInfo.map(col => col.name);
            // Agregar google_id si no existe
            if (!columnNames.includes('google_id')) {
                yield db.run('ALTER TABLE users ADD COLUMN google_id TEXT');
                console.log('✅ Columna google_id agregada');
            }
            // Agregar display_name si no existe
            if (!columnNames.includes('display_name')) {
                yield db.run('ALTER TABLE users ADD COLUMN display_name TEXT');
                console.log('✅ Columna display_name agregada');
            }
            yield db.close();
            console.log('✅ Campos de Google OAuth agregados exitosamente');
        }
        catch (error) {
            console.error('❌ Error al agregar campos de Google OAuth:', error);
        }
    });
}
addGoogleOAuthFields();
