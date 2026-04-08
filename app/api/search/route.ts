
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {

    const supabase = await createClient()

    const {searchParams} = new URL(request.url)
    

    const query = searchParams.get('q') // ?q is nothing but what the user types
    
    const {data : notes} = await supabase.from('notes').select('id, title, project_id').ilike('title', `%${query}%`)

    const {data : bugs} = await supabase.from('bugs').select('id, title, project_id').ilike('title', `%${query}%`)

    const {data : snippets} = await supabase.from('snippets').select('id, title, project_id').ilike('title', `%${query}%`)
    
    // Combine Labels

    const result = [
        ...(notes ?? []).map(n=> ({...n, type: 'note'})),
        ...(bugs ?? []).map(b=> ({...b, type : 'bug'})),
        ...(snippets ?? []).map(s=>({...s, type : 'snippet'}))

    ]

    return NextResponse.json({result})
    



}