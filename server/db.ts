
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server', 'data.json');

export const readData = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { categories: [], objectives: [] };
    }
};

export const writeData = (data: any) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
};
