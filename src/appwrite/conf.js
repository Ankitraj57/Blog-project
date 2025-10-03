import config from '../config/config.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userid }) {
        try {
            // Process content - convert to string, remove HTML tags, and limit to 1000 chars
            let contentString = '';
            if (content) {
                // Convert to string if it's an object
                if (typeof content === 'object') {
                    contentString = JSON.stringify(content);
                } else {
                    contentString = String(content);
                }
                
                // Remove HTML tags and limit to 1000 chars
                contentString = contentString.replace(/<[^>]*>/g, '').substring(0, 1000);
            }
            
            const documentData = {
                title: (title || '').substring(0, 255),
                slug: (slug || '').substring(0, 255),
                content: contentString,
                featuredImage: featuredImage || '',
                status: (status || 'active').substring(0, 20),
                userid: (userid || '').substring(0, 255),
                $permissions: [
                    `read("user:${userid}")`,
                    `update("user:${userid}")`,
                    `delete("user:${userid}")`
                ]
            };
            
            return await this.databases.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                ID.unique(),
                documentData
            );
        }
        catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            throw error; // Re-throw the error to be handled by the component
        }
    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            const updateData = {};
            
            // Process title if provided
            if (title !== undefined) {
                updateData.title = String(title).substring(0, 255);
            }
            
            // Process content if provided
            if (content !== undefined) {
                let contentString = '';
                if (content) {
                    // Convert to string if it's an object
                    contentString = typeof content === 'object' 
                        ? JSON.stringify(content) 
                        : String(content);
                    
                    // Remove HTML tags and limit to 1000 chars
                    contentString = contentString.replace(/<[^>]*>/g, '').substring(0, 1000);
                }
                updateData.content = contentString;
            }
            
            // Add other fields if provided
            if (featuredImage !== undefined) {
                updateData.featuredImage = String(featuredImage || '');
            }
            
            if (status !== undefined) {
                updateData.status = String(status || 'active').substring(0, 20);
            }
            
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                updateData
            )
        }
        catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }


    async deletePost (slug) {
        try{
             await this.databases.deleteDocument(config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
            return true;
        }
        catch(error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try{
             return await this.databases.getDocument(config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug
            )
        }
        catch(error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            const response = await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                [
                    ...queries,
                    Query.select(["title", "content", "featuredImage", "status", "userid", "$id", "$createdAt"])
                ]
            );
            
            if (!response || !Array.isArray(response.documents)) {
                return { documents: [] };
            }
            
            return response;
        }
        catch(error) {
            console.error("Appwrite service :: getPosts :: error", error);
            return { documents: [] };
        }
    }

    // file upload service

    async uploadFile(file) {
        try {
            const response = await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            );
            return response;
        } catch (error) {
            console.error("Appwrite service :: uploadFile :: error", error);
            throw error; // Re-throw to handle in the component
        }
    }

    async deleteFile(fileId) {
        try{
             await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            )
            return true;
        }
        catch(error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        try {
            if (!fileId) return null;
            // Use getFileView instead of getFilePreview to avoid CORS issues
            return this.bucket.getFileView(
                config.appwriteBucketId,
                fileId
            );
        } catch (error) {
            console.error("Appwrite service :: getFilePreview :: error", error);
            return null;
        }
    }
}


const service = new Service()
export default service