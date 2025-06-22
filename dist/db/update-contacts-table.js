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
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
function addCountryColumn() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, sqlite_1.open)({
            filename: path_1.default.resolve(__dirname, '../../database.sqlite'),
            driver: sqlite3_1.default.Database
        });
        try {
            yield db.exec(`ALTER TABLE contacts ADD COLUMN country TEXT`);
            console.log(' Columna "country" agregada correctamente.');
        }
        catch (error) {
            if (error.message.includes('duplicate column name')) {
                console.log('ℹ La columna "country" ya existe.');
            }
            else {
                console.error(' Error al agregar la columna:', error);
            }
        }
        yield db.close();
    });
}
addCountryColumn();
