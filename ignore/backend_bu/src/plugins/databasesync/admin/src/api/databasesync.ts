import { request } from "@strapi/helper-plugin";



export const syncDatabaseRequests = {
    sync: async (data:any,secret:string) => { //data is of type any because it is a JSON of any format
        return await request("/api/database/sync", {
            method: "POST",
            body: {
                data: data,
                secret: secret
            }
        }
        )
    },
    getAllRows: async () => {
        return await request("/api/database", {
            method: "GET"
        }
        )
    }

}