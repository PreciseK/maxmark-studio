import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BlogEditorForm from "@/components/admin/BlogEditorForm";
import type { BlogPostRow } from "@/types/database";
export default async function EditBlogPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const supabase=await createClient();const {data}=await supabase.from("blog_posts").select("*").eq("id",id).is("deleted_at",null).maybeSingle();if(!data)notFound();const post=data as BlogPostRow;return <div><h1 style={{fontFamily:"var(--font-anton)",fontSize:"52px",fontWeight:400,textTransform:"uppercase",margin:"0 0 40px"}}>Edit article</h1><BlogEditorForm post={post}/></div>}
