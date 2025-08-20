import fs from 'fs'
import path from 'path';

const data = `GEMINI_API_KEY=AIzaSyBdQfCf06qeL1lcwGqceldfzQ0BOrG7_Rw
DB_SERVER=localhost
DB_DATABASE=BoletoBradesco
DB_USER=sa
DB_PASSWORD=sasasa
DB_PORT=1433
PORT=3000`

async function gerarDotEnv(): Promise<any>{
    const newPath = path.join(__dirname, '.env');
    fs.writeFileSync(newPath, data)
    console.log("Arquivo criado.")
}

gerarDotEnv();