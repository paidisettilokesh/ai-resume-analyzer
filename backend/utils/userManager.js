import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Initialize users file if it doesn't exist
const initUsers = async () => {
    try {
        await fs.access(USERS_FILE);
    } catch {
        await fs.writeFile(USERS_FILE, '[]');
    }
};
initUsers();

export const registerUser = async (email, password, name) => {
    try {
        const fileData = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(fileData);

        if (users.find(u => u.email === email)) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            name
        };

        users.push(newUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        return { id: newUser.id, name: newUser.name, email: newUser.email };
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const fileData = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(fileData);

        const user = users.find(u => u.email === email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return { id: user.id, name: user.name, email: user.email };
    } catch (error) {
        throw error;
    }
};
