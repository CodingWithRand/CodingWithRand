import { createClient } from '@supabase/supabase-js'

const sbUrl = process.env.REACT_APP_SUPABASE_URL;
const sbKey = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(sbUrl, sbKey);
export const auth = supabase.auth;
export const storage = supabase.storage

export async function serverFetch(access_token, schema, tableName, rows, eq=undefined){
  try{
    const response = await fetch("https://cwr-api-us.onrender.com/post/provider/supabase/queries/fetch", { 
      method: "POST",
      headers: { "Content-Type": "application/json", "access_token": access_token },
      body: JSON.stringify({
        schema: schema,
        tableName: tableName,
        rows: rows,
        eq: eq
      })
    })
    const json = await response.json();
    return json.data
  }catch(e){
    console.error(e)
  }
}

export async function serverInsert(schema, tableName, data, access_token){
  try{
    await fetch("https://cwr-api-us.onrender.com/post/provider/supabase/queries/insert", { 
      method: "POST",
      headers: { "Content-Type": "application/json", "access_token": access_token },
      body: JSON.stringify({
        schema, 
        tableName: tableName,
        data: data
      })
    })
  }catch(e){
    console.error(e)
  }
}

export async function serverUpdate(schema, tableName, data, eq, access_token) {
  try {
    await fetch("https://cwr-api-us.onrender.com/post/provider/supabase/queries/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", "access_token": access_token },
      body: JSON.stringify({
        schema, 
        tableName: tableName,
        data: data,
        eq: eq
      })
    })
  } catch (e) {
    console.error(e)
  }
}

export async function serverRPC(fn, args, access_token) {
  try {
    const response = await fetch("https://cwr-api-us.onrender.com/post/provider/supabase/queries/function", {
      method: "POST",
      headers: { "Content-Type": "application/json", "access_token": access_token },
      body: JSON.stringify({ fn, args })
    })
    const json = await response.json();
    return json.data
  } catch (e) {
    console.error(e)
  }
}
  
  export async function signIn(email, password) {
    try {
      const { user, session } = await auth.signIn({
        email,
        password,
      });
      return { user, session };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  export async function signOut() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  }

  export async function getUser() {
    try {
      const { data, error } = await auth.getUser();

      if (error) {
        console.error(error);
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }