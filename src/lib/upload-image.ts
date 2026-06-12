import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "png";
  const name = `${crypto.randomUUID()}.${ext}`;
  const path = `${folder}/${name}`;

  const { error } = await (supabase.storage as any)
    .from("site-assets")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;

  const { data } = (supabase.storage as any)
    .from("site-assets")
    .getPublicUrl(path);

  return data.publicUrl;
}
