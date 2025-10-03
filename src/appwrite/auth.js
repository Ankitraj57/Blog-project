import config from '../config/config.js';
import { Client, Account, ID } from 'appwrite';

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.account = new Account(this.client);
    }

    //sign-up
    async createAccount({ email, password, name }) {
        try {
            // For Appwrite SDK v19.0.0 and above
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            
            if (userAccount) {
                // Log in the user after successful signup
                return this.login({email, password});
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("Appwrite service :: sign-up :: error", error);
            throw error; // Re-throw the error to be handled by the component
        }
    }
 
    //login
    async login({email, password}) {
        try {
            // For Appwrite SDK v19.0.0 and above
            return await this.account.createEmailPasswordSession(email, password);
        }
        catch(error) {
            console.log("Appwrite service :: Login :: error", error);
            throw error; // Re-throw the error to be handled by the component
        }
    }

    async getCurrentUser() {
        try{
            return await this.account.get();
        }
        catch (error) {
            if(error.code === 401) return null;
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
        return null;
    }

    async logout() {
        try{
            return await this.account.deleteSessions();
        }
        catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;