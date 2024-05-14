import { MongoClient } from "mongodb";

require("dotenv").config();

/**
 * Represents a MongoDB client.
 */

// const uriLocal = "mongodb://localhost:27017";
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || "files_manager";
const url = `mongodb://${host}:${port}/`;

class DBClient {
  constructor() {
    this.db = null;
    this.client = false; // Initialize client property

    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
        console.error("Error connecting to MongoDB:", error);
      } else {
        console.log("Connected to MongoDB");
        this.client = client; // Assign client when connected
        this.db = client.db(database);
        this.db.createCollection("users");
        this.db.createCollection("files");
      }
    });
  }

  isAlive() {
    return this.client && this.client.isConnected();
  }

  /**
   * Retrieves the number of users in the database.
   * @returns {Promise<Number>}
   */
  async nbUsers() {
    return this.client.db().collection("users").countDocuments();
  }

  /**
   * Retrieves the number of files in the database.
   * @returns {Promise<Number>}
   */
  async nbFiles() {
    return this.client.db().collection("files").countDocuments();
  }

  /**
   * Retrieves a reference to the `users` collection.
   * @returns {Promise<Collection>}
   */
  async usersCollection() {
    return this.client.db().collection("users");
  }

  /**
   * Retrieves a reference to the `files` collection.
   * @returns {Promise<Collection>}
   */
  async filesCollection() {
    return this.client.db().collection("files");
  }
}

export const dbClient = new DBClient();
export default dbClient;
