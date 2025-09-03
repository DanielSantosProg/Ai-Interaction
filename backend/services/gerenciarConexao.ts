import fs from 'fs'
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface ConnectionProps {
    values: {
        DB_SERVER?: string;
        DB_DATABASE?: string;
        DB_USER?: string;
        DB_PASSWORD?: string;
        DB_PORT?: number;
        fileDirectory?: string;
        api_key?: string;
    }    
}

export async function updateData(values: ConnectionProps['values']): Promise<void> {
    const dotenvPath = path.join(__dirname, '../.env');

    try {
        let envContent = fs.readFileSync(dotenvPath, 'utf8');

        for (const key in values) {
            if (Object.prototype.hasOwnProperty.call(values, key)) {
                const newValue = values[key as keyof typeof values];
                if (newValue !== undefined) {
                    const regex = new RegExp(`^${key}=.*$`, 'mi');
                    
                    envContent = envContent.replace(regex, `${key}=${newValue}`);
                }
            }
        }
        
        fs.writeFileSync(dotenvPath, envContent);

        console.log("Variáveis de ambiente atualizadas com sucesso.");

        // Recarrega as variáveis de ambiente
        dotenv.config({ path: dotenvPath, override: true });

    } catch (error) {
        console.error("Erro ao atualizar as variáveis de ambiente:", error);
        throw error;
    }
}