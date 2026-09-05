import { useState, useEffect, useRef } from "react";
import { Wind, Coins, Heart, X, ChevronRight, Check, Clock, Mail } from "lucide-react";
import {
  signInWithEmail,
  onAuthChange,
  getCurrentUser,
  fetchProfile,
  fetchLog,
  insertCravingLog,
  computeStats,
} from "./data";

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');
    .vs-display { font-family: 'Fraunces', serif; }
    .vs-body { font-family: 'Work Sans', sans-serif; }
  `}</style>
);

const TRIGGERS = ["Stress", "Coffee or alcohol", "Social", "Boredom", "After a meal", "Other"];
const PHASES = [
  { label: "Breathe in", duration: 4, scale: 1.35 },
  { label: "Hold", duration: 4, scale: 1.35 },
  { label: "Breathe out", duration: 4, scale: 0.8 },
  { label: "Hold", duration: 4, scale: 0.8 },
];
const TOTAL_CYCLES = 3;

function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    try {
      await signInWithEmail(email);
      setSent(true);
      setError("");
    } catch (err) {
      setError("Couldn't send the link. Try again in a moment.");
    }
  };

  if (sent) {
    return (
      <div className="vs-body max-w-md mx-auto px-6 py-24 text-center">
        <Mail size={28} className="text-[#6FE3C4] mx-auto mb-4" />
        <p className="text-[#F4F2EC]">Check your inbox for a sign-in link.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="vs-body max-w-md mx-auto px-6 py-24">
      <h1 className="vs-display text-2xl text-[#F4F2EC] mb-2">Virtual Smoke</h1>
      <p className="text-sm text-[#8B92AC] mb-8">Sign in with your email to save your progress.</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full bg-transparent border border-[#2A3152] rounded-lg px-4 py-3 text-[#F4F2EC] mb-2 outline-none focus:border-[#6FE3C4]"
      />
      {error && <p className="text-sm text-[#F2985C] mb-4">{error}</p>}
      <button
        type="submit"
        className="w-full bg-[#6FE3C4] hover:bg-[#5cd4b3] text-[#12172A] font-medium rounded-lg py-3 mt-4 transition-colors"
      >
        Send sign-in link
      </button>
    </form>
  );
}

function Dashboard({ stats, log, onCraving, onReset }) {
  return (
    <div className="vs-body max-w-md mx-auto px-6 py-10">
      <p className="text-xs tracking-wide uppercase text-[#8B92AC] mb-1">Virtual Smoke</p>
      <h1 className="vs-display text-2xl text-[#F4F2EC] mb-8">Good to see you.</h1>

      <div className="mb-10">
        <p className="text-sm text-[#8B92AC] mb-1">Days smoke-free</p>
        <p className="vs-display text-6xl text-[#6FE3C4] leading-none">{stats.days}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-[#2A3152] rounded-lg p-4">
          <Coins size={18} className="text-[#F2985C] mb-2" />
          <p className="vs-display text-xl text-[#F4F2EC]">${stats.moneySaved}</p>
          <p className="text-xs text-[#8B92AC] mt-1">saved so far</p>
        </div>
        <div className="border border-[#2A3152] rounded-lg p-4">
          <Heart size={18} className="text-[#F2985C] mb-2" />
          <p className="vs-display text-xl text-[#F4F2EC]">{stats.cravingsSurvived}</p>
          <p className="text-xs text-[#8B92AC] mt-1">cravings survived</p>
        </div>
      </div>

      <button
        onClick={onCraving}
        className="w-full bg-[#F2985C] hover:bg-[#e6884a] text-[#12172A] font-medium rounded-lg py-4 mb-10 transition-colors flex items-center justify-center gap-2"
      >
        <Wind size={18} />
        I have a craving
      </button>

      <div>
        <p className="text-sm text-[#8B92AC] mb-3">Recent cravings</p>
        {log.length === 0 && (
          <p className="text-sm text-[#5A6180] italic">Nothing logged yet. When a craving hits, tap the button above.</p>
        )}
        <div className="space-y-3">
          {log.map((entry, i) => (
            <div key={i} className="flex items-center justify-between border-b border-[#2A3152] pb-3">
              <div>
                <p className="text-sm text-[#F4F2EC]">{entry.trigger}</p>
                <p className="text-xs text-[#5A6180] flex items-center gap-1 mt-0.5">
                  <Clock size={12} /> {entry.time}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  entry.outcome === "survived"
                    ? "bg-[#1D3B34] text-[#6FE3C4]"
                    : "bg-[#3B2418] text-[#F2985C]"
                }`}
              >
                {entry.outcome === "survived" ? "Survived" : "Smoked"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-xs text-[#5A6180] hover:text-[#8B92AC] mt-10"
      >
        Sign out
      </button>
    </div>
  );
}

function Breathing({ onDone, onCancel }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [seconds, setSeconds] = useState(PHASES[0].duration);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;
        setPhaseIndex((pIdx) => {
          const nextIdx = (pIdx + 1) % PHASES.length;
          if (nextIdx === 0) {
            setCycle((c) => {
              const nextCycle = c + 1;
              if (nextCycle >= TOTAL_CYCLES) {
                clearInterval(timerRef.current);
                onDone();
              }
              return nextCycle;
            });
          }
          return nextIdx;
        });
        return PHASES[(phaseIndex + 1) % PHASES.length].duration;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex]);

  const phase = PHASES[phaseIndex];

  return (
    <div className="vs-body max-w-md mx-auto px-6 py-10 flex flex-col items-center min-h-[560px]">
      <button
        onClick={() => {
          clearInterval(timerRef.current);
          onCancel();
        }}
        className="self-end text-[#5A6180] hover:text-[#8B92AC] mb-6"
        aria-label="Cancel"
      >
        <X size={20} />
      </button>

      <p className="vs-display text-xl text-[#F4F2EC] text-center mb-14">
        Let's breathe through this together.
      </p>

      <div className="relative flex items-center justify-center mb-14" style={{ height: 220 }}>
        <div
          className="rounded-full bg-[#1D3B34] border border-[#6FE3C4]"
          style={{
            width: 140,
            height: 140,
            transform: `scale(${phase.scale})`,
            transition: `transform ${phase.duration}s ease-in-out`,
          }}
        />
      </div>

      <p className="text-lg text-[#6FE3C4] mb-2">{phase.label}</p>
      <p className="text-sm text-[#5A6180]">Cycle {cycle + 1} of {TOTAL_CYCLES}</p>
    </div>
  );
}

function CheckIn({ onSurvived, onSmoked }) {
  const [trigger, setTrigger] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [error, setError] = useState("");

  const submit = () => {
    if (!trigger) {
      setError("Choose what triggered this craving first.");
      return;
    }
    onSurvived(trigger, intensity);
  };

  return (
    <div className="vs-body max-w-md mx-auto px-6 py-10">
      <h2 className="vs-display text-xl text-[#F4F2EC] mb-1">How are you feeling?</h2>
      <p className="text-sm text-[#8B92AC] mb-8">A quick note helps you spot your patterns.</p>

      <p className="text-sm text-[#F4F2EC] mb-3">What triggered it?</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {TRIGGERS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTrigger(t);
              setError("");
            }}
            className={`text-sm px-3 py-2 rounded-full border transition-colors ${
              trigger === t
                ? "bg-[#6FE3C4] text-[#12172A] border-[#6FE3C4]"
                : "border-[#2A3152] text-[#F4F2EC] hover:border-[#6FE3C4]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-[#F2985C] -mt-6 mb-6">{error}</p>}

      <p className="text-sm text-[#F4F2EC] mb-3">Intensity: {intensity}/10</p>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={intensity}
        onChange={(e) => setIntensity(Number(e.target.value))}
        className="w-full mb-10 accent-[#6FE3C4]"
      />

      <button
        onClick={submit}
        className="w-full bg-[#6FE3C4] hover:bg-[#5cd4b3] text-[#12172A] font-medium rounded-lg py-4 mb-4 transition-colors flex items-center justify-center gap-2"
      >
        <Check size={18} />
        Mark as survived
      </button>
      <button
        onClick={() => trigger ? onSmoked(trigger, intensity) : setError("Choose what triggered this craving first.")}
        className="w-full text-sm text-[#5A6180] hover:text-[#8B92AC] py-2 flex items-center justify-center gap-1"
      >
        I ended up smoking <ChevronRight size={14} />
      </button>
    </div>
  );
}

function formatLogEntry(row) {
  return {
    trigger: row.trigger,
    time: new Date(row.created_at).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    outcome: row.outcome,
  };
}

export default function VirtualSmoke() {
  const [screen, setScreen] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadData = async (userId) => {
    try {
      const [profileData, logRows] = await Promise.all([
        fetchProfile(userId),
        fetchLog(userId),
      ]);
      setProfile(profileData);
      setRows(logRows);
      setLoadError("");
    } catch (e) {
      setLoadError("Couldn't load your data. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      if (u) loadData(u.id);
      else setLoading(false);
    });
    const subscription = onAuthChange((u) => {
      setUser(u);
      if (u) {
        setLoading(true);
        loadData(u.id);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12172A] flex items-center justify-center">
        {FONTS}
        <p className="vs-body text-sm text-[#5A6180]">Loading your progress…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#12172A]">
        {FONTS}
        <Login />
      </div>
    );
  }

  const stats = profile ? computeStats(profile, rows) : { days: 0, moneySaved: 0, cravingsSurvived: 0 };
  const log = rows.map(formatLogEntry);

  const handleSurvived = async (trigger, intensity) => {
    await insertCravingLog(user.id, { trigger, intensity, outcome: "survived" });
    await loadData(user.id);
    setScreen("dashboard");
  };

  const handleSmoked = async (trigger, intensity) => {
    await insertCravingLog(user.id, { trigger, intensity, outcome: "smoked" });
    await loadData(user.id);
    setScreen("dashboard");
  };

  const handleSignOut = () => {
    import("./supabaseClient").then(({ supabase }) => supabase.auth.signOut());
  };

  return (
    <div className="min-h-screen bg-[#12172A]">
      {FONTS}
      {loadError && (
        <p className="vs-body text-xs text-[#F2985C] text-center pt-3">{loadError}</p>
      )}
      {screen === "dashboard" && (
        <Dashboard
          stats={stats}
          log={log}
          onCraving={() => setScreen("breathing")}
          onReset={handleSignOut}
        />
      )}
      {screen === "breathing" && (
        <Breathing onDone={() => setScreen("checkin")} onCancel={() => setScreen("dashboard")} />
      )}
      {screen === "checkin" && (
        <CheckIn onSurvived={handleSurvived} onSmoked={handleSmoked} />
      )}
    </div>
  );
}
