import React, { useState } from "react";
import Layout from "../../components/Layout";
import {
  Users,
  Sparkles,
  Medal,
  Heart,
  Flame,
  TrendingUp,
  Flower,
  PartyPopper,
  Plus,
  X,
} from "lucide-react";

// --- Mock Data ---

interface Friend {
  id: string;
  name: string;
  plantType: "tree" | "bamboo" | "bamboo-decor" | "pot";
  progress: number;
  streak: number;
  lastActive: string;
}

interface Notification {
  id: string;
  user: string;
  type: "petals" | "cheer" | "believe" | "inspired";
  message: string;
  time: string;
  petalCount?: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const FRIENDS_DATA: Friend[] = [
  {
    id: "1",
    name: "Aoi",
    plantType: "tree",
    progress: 56,
    streak: 12,
    lastActive: "2m",
  },
  {
    id: "2",
    name: "Sora",
    plantType: "bamboo-decor",
    progress: 67,
    streak: 18,
    lastActive: "1h",
  },
  {
    id: "3",
    name: "Haru",
    plantType: "pot",
    progress: 42,
    streak: 8,
    lastActive: "5m",
  },
  {
    id: "4",
    name: "Yuki",
    plantType: "bamboo",
    progress: 89,
    streak: 25,
    lastActive: "10m",
  },
];

const NOTIFICATIONS_DATA: Notification[] = [
  {
    id: "n1",
    user: "Sakura",
    type: "petals",
    message: "sent you encouragement petals",
    time: "2 minutes ago",
    petalCount: 3,
    icon: <Flower size={18} />,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    id: "n2",
    user: "Haru",
    type: "cheer",
    message: "is cheering you on!",
    time: "5 minutes ago",
    icon: <PartyPopper size={18} />,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: "n3",
    user: "Yuki",
    type: "believe",
    message: "believes in your progress",
    time: "10 minutes ago",
    icon: <TrendingUp size={18} />,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "n4",
    user: "Aoi",
    type: "petals",
    message: "sent you encouragement petals",
    time: "15 minutes ago",
    petalCount: 3,
    icon: <Flower size={18} />,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    id: "n5",
    user: "Sora",
    type: "inspired",
    message: "is inspired by your dedication!",
    time: "1 hour ago",
    icon: <Sparkles size={18} />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

// --- SVGs for Plants ---

const PlantTree = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
    <path d="M45,90 L55,90 L55,60 L45,60 Z" fill="#5d4037" />
    <circle cx="50" cy="45" r="25" fill="#4caf50" />
    <circle cx="35" cy="55" r="15" fill="#43a047" />
    <circle cx="65" cy="55" r="15" fill="#43a047" />
    <circle cx="50" cy="25" r="15" fill="#66bb6a" />
    <circle cx="30" cy="40" r="5" fill="#fce9f1" opacity="0.8" />
    <circle cx="70" cy="30" r="4" fill="#fce9f1" opacity="0.8" />
  </svg>
);

const PlantBamboo = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
    <rect x="25" y="80" width="50" height="15" fill="#8d6e63" rx="2" />
    <rect x="30" y="75" width="40" height="5" fill="#5d4037" rx="1" />
    {/* Stalks */}
    <rect x="35" y="40" width="8" height="40" fill="#66bb6a" rx="1" />
    <rect x="46" y="30" width="8" height="50" fill="#43a047" rx="1" />
    <rect x="57" y="45" width="8" height="35" fill="#66bb6a" rx="1" />
    {/* Joints */}
    <rect x="34" y="55" width="10" height="2" fill="#2e7d32" rx="1" />
    <rect x="45" y="45" width="10" height="2" fill="#1b5e20" rx="1" />
    <rect x="56" y="60" width="10" height="2" fill="#2e7d32" rx="1" />
    {/* Leaves */}
    <path
      d="M46,35 Q30,30 35,20"
      fill="none"
      stroke="#66bb6a"
      strokeWidth="3"
    />
    <path
      d="M54,35 Q70,30 65,20"
      fill="none"
      stroke="#66bb6a"
      strokeWidth="3"
    />
  </svg>
);

const PlantBambooDecor = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
    {/* Bamboo */}
    <rect x="45" y="30" width="10" height="60" fill="#66bb6a" rx="1" />
    <rect x="44" y="50" width="12" height="3" fill="#2e7d32" rx="1" />
    <rect x="44" y="70" width="12" height="3" fill="#2e7d32" rx="1" />
    {/* Leaves */}
    <path d="M45,40 Q30,35 30,20 Q40,30 45,35" fill="#43a047" />
    <path d="M55,40 Q70,35 70,20 Q60,30 55,35" fill="#43a047" />
    {/* Decorations (Tanabata style) */}
    <line x1="45" y1="50" x2="30" y2="55" stroke="#333" strokeWidth="0.5" />
    <rect x="25" y="55" width="8" height="12" fill="#42a5f5" rx="1" />

    <line x1="55" y1="45" x2="65" y2="50" stroke="#333" strokeWidth="0.5" />
    <rect x="63" y="50" width="8" height="12" fill="#ec407a" rx="1" />
  </svg>
);

const PlantPot = () => (
  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
    <path d="M30,70 L35,90 L65,90 L70,70 Z" fill="#d7ccc8" />
    <rect x="28" y="65" width="44" height="6" fill="#a1887f" rx="1" />
    <path d="M50,65 L50,40" stroke="#558b2f" strokeWidth="3" />
    {/* Leaves */}
    <ellipse
      cx="40"
      cy="45"
      rx="10"
      ry="5"
      fill="#7cb342"
      transform="rotate(-30 40 45)"
    />
    <ellipse
      cx="60"
      cy="45"
      rx="10"
      ry="5"
      fill="#7cb342"
      transform="rotate(30 60 45)"
    />
    <ellipse
      cx="40"
      cy="30"
      rx="8"
      ry="4"
      fill="#9ccc65"
      transform="rotate(-45 40 30)"
    />
    <ellipse
      cx="60"
      cy="30"
      rx="8"
      ry="4"
      fill="#9ccc65"
      transform="rotate(45 60 30)"
    />
    <ellipse cx="50" cy="20" rx="6" ry="10" fill="#8bc34a" />
  </svg>
);

// --- Confetti Component ---

const Confetti: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  // Generate static particles with random trajectory css variables
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    // Random spread for CSS vars
    tx: (Math.random() - 0.5) * 250, // Increased spread
    ty: (Math.random() - 1) * 250, // Increased spread
    rot: Math.random() * 360, // Rotate
    // Pink Palette
    bg: ["#fbcfe8", "#f9a8d4", "#f472b6", "#ec4899", "#db2777"][
      Math.floor(Math.random() * 5)
    ],
    delay: Math.random() * 0.1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <style>
        {`
                @keyframes confetti-burst {
                    0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.8); opacity: 1; }
                    60% { opacity: 1; }
                    100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)) scale(0); opacity: 0; }
                }
                `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-4 h-4 rounded-full shadow-sm"
          style={
            {
              left: x,
              top: y,
              backgroundColor: p.bg,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
              "--rot": `${p.rot}deg`,
              animation: `confetti-burst 0.8s ease-out forwards`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

// --- Components ---

const CommunityTab: React.FC = () => {
  const [petalsSent, setPetalsSent] = useState(247);
  const [sentPetalsTo, setSentPetalsTo] = useState<Record<string, boolean>>({});
  const [confettiPos, setConfettiPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Add Friend State
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [addFriendInput, setAddFriendInput] = useState("");
  const [addFriendStatus, setAddFriendStatus] = useState<"idle" | "sent">(
    "idle"
  );

  const handleSendPetals = (
    friendId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (sentPetalsTo[friendId]) return;

    // Get click coordinates for localized burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setPetalsSent((prev) => prev + 1);
    setSentPetalsTo((prev) => ({ ...prev, [friendId]: true }));

    // Trigger confetti
    setConfettiPos({ x, y });

    // Auto hide confetti after animation
    setTimeout(() => setConfettiPos(null), 1000);
  };

  const handleAddFriend = () => {
    if (!addFriendInput.trim()) return;
    setAddFriendStatus("sent");
    // In a real app, API call here
  };

  const closeAddFriend = () => {
    setIsAddFriendOpen(false);
    setAddFriendStatus("idle");
    setAddFriendInput("");
  };

  const renderPlant = (type: string) => {
    switch (type) {
      case "tree":
        return <PlantTree />;
      case "bamboo":
        return <PlantBamboo />;
      case "bamboo-decor":
        return <PlantBambooDecor />;
      case "pot":
        return <PlantPot />;
      default:
        return <PlantTree />;
    }
  };

  return (
    <Layout
      headerTitle="Community"
      action={
        <div className="bg-pink-100 p-2 rounded-full">
          <Users className="text-pink-500" size={20} />
        </div>
      }
    >
      {confettiPos && <Confetti x={confettiPos.x} y={confettiPos.y} />}

      {/* Header Subtitle */}
      <div className="-mt-3 mb-6">
        <p className="text-stone-500 text-sm">
          Learn and grow together. Petals can be sent to your friends once per
          day to remind them to study up.
        </p>
      </div>

      {/* Community Impact Banner */}
      <div className="bg-[#5d8d62] rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden flex items-center justify-between">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={24} className="text-yellow-200" />
          </div>
          <div>
            <p className="text-green-100 text-xs font-medium uppercase tracking-wider mb-0.5">
              Community Impact
            </p>
            <h2 className="text-2xl font-bold">{petalsSent} Petals Sent</h2>
          </div>
        </div>
        <div className="relative z-10">
          <Medal size={32} className="text-white/80" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute right-12 -top-8 w-24 h-24 bg-white/5 rounded-full" />
      </div>

      {/* Friends Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-bold text-stone-700">Learning Friends</h3>
          <div className="flex gap-4 items-center">
            {/* Add Friend Button */}
            <button
              onClick={() => setIsAddFriendOpen(true)}
              className="group relative w-7 h-7 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
              title="Add Friend"
            >
              {/* Seed Shape SVG */}
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-stone-300 fill-stone-300 group-hover:text-[#5d8d62] group-hover:fill-[#5d8d62] transition-colors"
              >
                <path d="M12,2 C6,2 3,7 3,12 C3,18 9,22 12,22 C12,22 21,18 21,12 C21,7 18,2 12,2 Z" />
              </svg>
              {/* Plus Sign - Off-centered */}
              <div className="absolute top-0 right-0 bg-white rounded-full p-[1px] shadow-sm border border-stone-100 group-hover:border-[#5d8d62] transition-colors">
                <Plus
                  size={10}
                  className="text-stone-400 group-hover:text-[#5d8d62] stroke-[3]"
                />
              </div>
            </button>
            <button className="text-xs font-bold text-[#5d8d62] hover:underline">
              See All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {FRIENDS_DATA.map((friend) => {
            const isSent = sentPetalsTo[friend.id];
            return (
              <div
                key={friend.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-stone-100 flex flex-col items-center animate-fade-in relative"
              >
                {/* Top Icons */}
                <div className="w-full flex justify-between items-start mb-2">
                  {/* Status/Plant Icon Placeholder */}
                  <div className="text-stone-300">
                    {friend.plantType === "bamboo-decor" ? (
                      <div className="text-yellow-400">
                        <Sparkles size={14} />
                      </div>
                    ) : (
                      <Flower size={14} className="text-pink-300" />
                    )}
                  </div>
                  {/* Streak with Fire Icon */}
                  <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                    <Flame
                      size={10}
                      className="text-orange-500 fill-orange-500"
                    />
                    <span className="text-[10px] font-bold text-orange-600">
                      {friend.streak}
                    </span>
                  </div>
                </div>

                {/* Plant Visual */}
                <div className="mb-3 transform hover:scale-105 transition-transform duration-300">
                  {renderPlant(friend.plantType)}
                  {/* Decorative dots around plant */}
                  <div className="absolute top-1/2 left-2 w-2 h-2 bg-pink-200 rounded-full opacity-60" />
                  <div className="absolute top-1/3 right-2 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-60" />
                </div>

                {/* Info */}
                <h4 className="text-stone-700 font-medium text-lg mb-1">
                  {friend.name}
                </h4>

                {/* Progress Bar */}
                <div className="w-full flex items-center justify-between text-[10px] text-stone-400 mb-1">
                  <span>Progress</span>
                  <span>{friend.progress}/100</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-[#5d8d62] rounded-full"
                    style={{ width: `${friend.progress}%` }}
                  />
                </div>

                {/* Action */}
                <button
                  onClick={(e) => handleSendPetals(friend.id, e)}
                  disabled={isSent}
                  className={`w-full text-sm font-medium py-2 rounded-full flex items-center justify-center gap-1.5 transition-all group active:scale-95 ${
                    isSent
                      ? "bg-stone-100 text-stone-400 cursor-default"
                      : "bg-[#f8d7da] hover:bg-[#f5c6cb] text-[#c25e68]"
                  }`}
                >
                  {isSent ? (
                    <span className="text-xs">Petals Sent</span>
                  ) : (
                    <>
                      <Heart
                        size={14}
                        className="fill-[#c25e68] group-hover:scale-110 transition-transform"
                      />
                      Send Petals
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Encouragement Section */}
      <div className="pb-6">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-bold text-stone-700">
            Recent Encouragement
          </h3>
          <div className="flex items-center gap-1 text-pink-500">
            <Heart size={14} className="fill-pink-500" />
            <span className="text-xs font-bold">{petalsSent}</span>
          </div>
        </div>

        <div className="space-y-3">
          {NOTIFICATIONS_DATA.map((notif) => (
            <div
              key={notif.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 animate-fade-in hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${notif.iconBg} ${notif.iconColor} flex items-center justify-center shrink-0`}
              >
                {notif.icon}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-stone-700">
                  <span className="font-bold text-[#5d8d62]">{notif.user}</span>{" "}
                  {notif.message}
                </p>
                <p className="text-xs text-stone-400 mt-1">{notif.time}</p>
              </div>
              {notif.petalCount && (
                <div className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-lg border border-pink-100">
                  <Flower size={12} className="text-pink-400" />
                  <span className="text-xs font-bold text-pink-500">
                    +{notif.petalCount}
                  </span>
                </div>
              )}
              {notif.type === "cheer" && (
                <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center border border-yellow-100">
                  <span className="text-lg">🎉</span>
                </div>
              )}
              {notif.type === "believe" && (
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                  <TrendingUp size={14} className="text-green-500" />
                </div>
              )}
              {notif.type === "inspired" && (
                <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100">
                  <Sparkles size={14} className="text-orange-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Friend Modal */}
      {isAddFriendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={closeAddFriend}
          />
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative z-10 animate-fade-in flex flex-col">
            <button
              onClick={closeAddFriend}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 bg-stone-100 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-stone-700 mb-4 flex items-center gap-2">
              <div className="bg-[#5d8d62]/10 p-2 rounded-xl">
                <Users className="text-[#5d8d62]" size={20} />
              </div>
              Add a Friend
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                  User ID
                </label>
                <input
                  type="text"
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  placeholder="e.g. GARDEN-7392"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-700 outline-none focus:ring-2 focus:ring-[#5d8d62]/30 focus:border-[#5d8d62] transition-all placeholder:text-stone-400"
                  disabled={addFriendStatus === "sent"}
                />
              </div>

              <button
                onClick={handleAddFriend}
                disabled={!addFriendInput.trim() || addFriendStatus === "sent"}
                className={`w-full py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  addFriendStatus === "sent"
                    ? "bg-stone-200 text-stone-400 cursor-default"
                    : "bg-[#5d8d62] text-white hover:bg-[#4a724e] shadow-md hover:shadow-lg active:scale-[0.98]"
                }`}
              >
                {addFriendStatus === "sent" ? (
                  <>
                    <Sparkles size={18} /> Request Sent
                  </>
                ) : (
                  <>
                    <Plus size={18} strokeWidth={3} /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CommunityTab;
