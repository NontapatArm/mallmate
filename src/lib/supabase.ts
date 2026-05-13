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

  if (error) throw new Error(error.message);
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

  if (error) throw new Error(error.message);
  return (data ?? []).map(r => ({
    id:   r.id,
    name: r.name,
    icon: r.icon,
    floor: r.floor ?? "",
    wait: r.avg_wait_minutes ?? 0,
    type: (r.type === "restaurant" ? "food_and_beverage" : r.type) as Store["type"],
  }));
}

export async function reserveQueue(
  storeId: string,
  mallId: string,
  partySize: number,
  estimatedWait: number
) {
  await ensureAnonSession();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("queue_reservations")
    .insert({ user_id: user.id, store_id: storeId, mall_id: mallId, party_size: partySize, estimated_wait: estimatedWait })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function saveParking(mallId: string, level: string, zone: string, spot: string) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(mallId)) throw new Error("กรุณาเลือกห้างจากหน้าหลักก่อนบันทึกที่จอดรถ");
  await ensureAnonSession();
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

  if (error) throw new Error(error.message);
  return data;
}

export async function ensureAnonSession(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return;
  const { error } = await supabase.auth.signInAnonymously();
  if (error) throw new Error(`Anonymous sign-in failed: ${error.message}`);
}

export async function signInWithPhone(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProfile(fullName: string, email: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, email, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
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

export async function getQueueCount(storeId: string): Promise<number> {
  const { count } = await supabase
    .from("queue_reservations")
    .select("*", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("status", "waiting");
  return count ?? 0;
}

export async function getProfileStats(): Promise<{ queueCount: number; favCount: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { queueCount: 0, favCount: 0 };

  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const [{ count: queueCount }, { count: favCount }] = await Promise.all([
    supabase
      .from("queue_reservations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "cancelled")
      .gte("created_at", monthAgo.toISOString()),
    supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return { queueCount: queueCount ?? 0, favCount: favCount ?? 0 };
}

export async function cancelReservation(reservationId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("queue_reservations")
    .update({ status: "cancelled" })
    .eq("id", reservationId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
}

export async function getQueueHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("queue_reservations")
    .select("id, party_size, status, created_at, stores(name, icon), malls(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

export async function getParkingHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("parking_records")
    .select("id, level, zone, spot, status, saved_at, malls(name)")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function getFavorites() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("favorites")
    .select("id, mall_id, created_at, malls(id, name, icon, dist_km, store_count, featured)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function toggleFavorite(mallId: string): Promise<"added" | "removed"> {
  await ensureAnonSession();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("mall_id", mallId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return "removed";
  }
  await supabase.from("favorites").insert({ user_id: user.id, mall_id: mallId });
  return "added";
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
