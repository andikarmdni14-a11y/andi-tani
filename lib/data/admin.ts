import "server-only";
import type { AdminContext } from "@/lib/auth/admin";

type Supabase = Extract<AdminContext, { status: "admin" }>["supabase"];

export async function getProductFormOptions(supabase: Supabase) {
  const [categories, careGuides] = await Promise.all([
    supabase.from("categories").select("id, name").order("created_at"),
    supabase.from("care_guides").select("id, name").order("name"),
  ]);
  if (categories.error || careGuides.error) return null;
  return { categories: categories.data, careGuides: careGuides.data };
}
