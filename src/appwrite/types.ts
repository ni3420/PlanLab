import { Account, Client, Databases, Users } from "node-appwrite";

export type Env = {
  Variables: {
    appwriteClient: Client;
    account: Account;
    databases: Databases;
    user: {
      $id: string;
      name: string;
      email: string;
    };
  };
};