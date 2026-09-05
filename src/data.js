import { supabase } from "./supabaseClient";

export async function signInWithEmail(email) {
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return data.subscription;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchLog(userId, limit = 20) {
  const { data, error } = await supabase
    .from("craving_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function insertCravingLog(userId, { trigger, intensity, outcome }) {
  const { error } = await supabase
    .from("craving_logs")
    .insert({ user_id: userId, trigger, intensity, outcome });
  if (error) throw error;
}

// Derives the display stats from raw rows. Kept separate from the
// queries above so it's easy to unit test without hitting the network.
export function computeStats(profile, log) {
  const mostRecentSmoke = log.find((entry) => entry.outcome === "smoked");
  const streakStart = mostRecentSmoke
    ? new Date(mostRecentSmoke.created_at)
    : new Date(profile.quit_date);

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(
    0,
    Math.floor((Date.now() - streakStart.getTime()) / msPerDay)
  );

  const perDayCost =
    (profile.cigarettes_per_day / profile.cigarettes_per_pack) *
    profile.cost_per_pack;
  const moneySaved = Math.round(days * perDayCost);

  const cravingsSurvived = log.filter((e) => e.outcome === "survived").length;

  return { days, moneySaved, cravingsSurvived };
}
