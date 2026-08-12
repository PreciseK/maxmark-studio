"use client";

import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import WysiwygEditor from "@/components/admin/WysiwygEditor";
import { saveSitePage } from "@/lib/actions/cms";

type Field = { key: string; label: string; type: "text" | "textarea" | "image" | "richtext" };
export default function SitePageEditor({ pageKey, title, fields, initial }: { pageKey: "about" | "studio"; title: string; fields: Field[]; initial: Record<string,string> }) {
  const [content,setContent]=useState(initial);const [saving,setSaving]=useState(false);const [message,setMessage]=useState("");
  const update=(key:string,value:string)=>setContent((current)=>({...current,[key]:value}));
  async function submit(e:React.FormEvent){e.preventDefault();setSaving(true);const result=await saveSitePage(pageKey,title,content);setMessage(result.message);setSaving(false)}
  return <form onSubmit={submit} style={{maxWidth:"900px"}}>{fields.map((field)=><div key={field.key} style={{marginBottom:"30px"}}>{field.type==="image"?<ImageUpload bucket="site-media" label={field.label} value={content[field.key]??""} onChange={(value)=>update(field.key,value)}/>:field.type==="richtext"?<WysiwygEditor label={field.label} value={content[field.key]??""} onChange={(value)=>update(field.key,value)}/>:<label style={labelStyle}>{field.label}{field.type==="textarea"?<textarea rows={4} value={content[field.key]??""} onChange={(e)=>update(field.key,e.target.value)} style={inputStyle}/>:<input value={content[field.key]??""} onChange={(e)=>update(field.key,e.target.value)} style={inputStyle}/>}</label>}</div>)}{message&&<p style={{fontFamily:"var(--font-geist-mono)",fontSize:"11px",color:message.includes("updated")?"var(--accent-highlight)":"#ff7d7d"}}>{message}</p>}<button disabled={saving} style={buttonStyle}>{saving?"Saving…":"Save page"}</button></form>
}
const labelStyle:React.CSSProperties={display:"block",fontFamily:"var(--font-geist-mono)",fontSize:"10px",letterSpacing:".08em",textTransform:"uppercase",color:"var(--fg-muted)"};
const inputStyle:React.CSSProperties={display:"block",width:"100%",marginTop:"9px",padding:"12px 0",border:0,borderBottom:"1px solid var(--admin-input-border)",background:"transparent",color:"var(--fg-primary)",outline:0,fontFamily:"var(--font-geist-sans)",fontSize:"16px",resize:"vertical"};
const buttonStyle:React.CSSProperties={marginTop:"16px",padding:"13px 22px",border:0,background:"var(--accent-highlight)",color:"#080808",fontFamily:"var(--font-geist-mono)",fontSize:"10px",fontWeight:700,textTransform:"uppercase",cursor:"pointer"};
