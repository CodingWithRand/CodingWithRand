const { supabase } = require("./initialize")
const responseStatus = require("../../../responseStatus");


async function adminQueries(req, res) {
    const mode = req.params.mode
    switch(mode){
        case "fetch":
            adminFetch(req, res)
            break;
        case "insert":
            adminInsert(req, res)
            break;
        case "update":
            adminUpdate(req, res)
            break;
        case "function":
            adminFunction(req, res)
            break;
        default:
            responseStatus.badRequest(res, "Unknown mode!")
            break;
    }
}
async function adminFetch(req, res) {
    const { schema, tableName, rows, eq } = req.body
    try{
        let response
        if(eq){
            response = await supabase.schema(schema).from(tableName).select(rows).eq(eq.columnName, eq.value)
        }else{
            response = await supabase.schema(schema).from(tableName).select(rows)
        }
        if(!response.status === 200){
            throw new Error(response.status)
        }
        if(response.error){
            console.error(response.error)
            responseStatus.badRequest(res, response.error.message)
            return
        }
        responseStatus.ok(res, { data: response.data })
    }catch(error){
        switch(error.message){
            case "404":
                responseStatus.notFound(res)
            default:
                console.error(error)
                responseStatus.badGateway(res)
        }  
    }
}

async function adminInsert(req, res) {
    const { schema, tableName, data } = req.body
    try{
        const response = await supabase.schema(schema).from(tableName).insert(data)
        if(!response.status === 200){
            throw new Error(response.status)
        }
        if(response.error){
            responseStatus.badRequest(res, response.error.message)
            return
        }
        responseStatus.noContent(res, "Successfully inserted data to the database")
    }catch(error){
        switch(error.message){
            default:
                responseStatus.badGateway(res)
        }  
    }
}

async function adminUpdate(req, res) {
    const { schema, tableName, data, eq } = req.body
    try{
        const response = await supabase.schema(schema).from(tableName).update(data).eq(eq.columnName, eq.value)
        if(!response.status === 200){
            throw new Error(response.status)
        }
        if(response.error){
            responseStatus.badRequest(res, response.error.message)
            return
        }
        responseStatus.noContent(res, "Successfully updated data in the database")
    }catch(error){
        switch(error.message){
            default:
                responseStatus.badGateway(res)
        }  
    }
}

async function adminFunction(req, res) {
    const { fn, args } = req.body;
    try{
        const response = await supabase.rpc(fn, args)
        if(!response.status === 200){
            throw new Error(response.status)
        }
        if(response.error){
            responseStatus.badRequest(res, response.error.message)
            return
        }
        responseStatus.ok(res, { data: response.data })
    }catch(error){
        switch(error.message){
            default:
                responseStatus.badGateway(res)
        }  
    }
}

module.exports = { adminQueries }