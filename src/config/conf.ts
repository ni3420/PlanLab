// import "server-only"
const required=(key:string):string=>{
    const value=process.env[key]
    if(!value)
    {
        throw new Error(`missing env ${key}`)
    }
    return value
}

export const conf = {
  appwrite: {
    endpoint: required("APPWRITE_ENDPOINT"),
    databaseId: required("APPWRITE_DATABASE_ID"),
    projectId: required("APPWRITE_PROJECT_ID"),
    secretKey: required("APPWRITE_SECRET_KEY"),
    storageKey: required("APPWRITE_STROAGE_KEY"),
    collections: {
      workspace: required("APPWRITE_WORKSPACE_COLLECTION"),
      projects: required("APPWRITE_PROJECTS_COLLECTION"),
      members: required("APPWRITE_MEMBERS_COLLECTION"),
      tasks: required("APPWRITE_TASKS_COLLECTION"),
    },
  },
};