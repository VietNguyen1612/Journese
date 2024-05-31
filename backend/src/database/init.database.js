"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/config.mongodb");

// const connectionString = `mongodb://${host}:${port}/${name}`;
const connectionString = process.env.MONGO_URL
// Singleton design pattern
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (type === "mongodb") {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
      mongoose
        .connect(connectionString, { maxPoolSize: 50 })
        .then(() => {
          const countConnect = mongoose.connections.length;
          console.log(
            `mongodb listening successfully on ${connectionString}, ${countConnect} number of connect`
          );
        })
        .catch((error) => console.log(error));
    }
  }
  static getDBInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getDBInstance();

module.exports = instance;
