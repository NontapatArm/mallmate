import { createClient } from "@supabase/supabase-js";
import type { Mall, Store } from "./types";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// ── Typed helpers ─────────────────────────────────────

export async function fetchMalls(): Promise<Mall[]> {
  const { data, error } = await supabase
    .from("malls")
    .select("id, name, icon, dist_km, store_count, featured")
    .order("featured", { ascending: false })
    .order("dist_km", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(r => ({
    id:       r.id,
    name:     r.name,
    icon:     r.icon,
    dist:     String(r.dist_km ?? ""),
    cnt:      r.store_count ?? "",
    featured: r.featured ?? false,
  }));
}

export async function fetchStores(mallId: string): Promise<Store[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("id, name, icon, floor, avg_wait_minutes, type")
    .eq("mall_id", mallId)
    .order("type")
    .order("name");

  if (error) throw error;
  return (data ?? []).map(r => ({
    id:   r.id,
    name: r.name,
    icon: r.icon,
    floor: r.floor ?? "",
    wait: r.avg_wait_minutes ?? 0,
    type: r.type as Store["type"],
  }));
}

export async function reserveQueue(
  storeId: string,
  mallId: string,
  partySize: number,
  estimatedWait: number
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("queue_reservations")
    .insert({ user_id: user.id, store_id: storeId, mall_id: mallId, party_size: partySize, estimated_wait: estimatedWait })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveParking(mallId: string, level: string, zone: string, spot: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Expire previous active records for this user
  await supabase
    .from("parking_records")
    .update({ status: "expired" })
    .eq("user_id", user.id)
    .eq("status", "active");

  const { data, error } = await supabase
    .from("parking_records")
    .insert({ user_id: user.id, mall_id: mallId, level, zone, spot })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function signInWithPhone(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) throw error;
  return data;
}

export async function updateProfile(fullName: string, email: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, email, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw error;
}

export async function getActiveParking() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("parking_records")
    .select("*, malls(name)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("saved_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

export async function upsertLineProfile(profile: {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}) {
  const { error } = await supabase
    .from("line_profiles")
    .upsert({
      line_user_id:   profile.userId,
      display_name:   profile.displayName,
      picture_url:    profile.pictureUrl    ?? null,
      status_message: profile.statusMessage ?? null,
      last_seen_at:   new Date().toISOString(),
    }, { onConflict: "line_user_id" });

  if (error) console.warn("Failed to save LINE profile:", error.message);
}

export async function getMyReservations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("queue_reservations")
    .select("*, stores(name, icon), malls(name)")
    .eq("user_id", user.id)
    .in("status", ["waiting", "ready"])
    .order("created_at", { ascending: false });

  return data ?? [];
}
