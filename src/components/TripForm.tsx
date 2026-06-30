import React, { useState } from "react";
import { Compass, Calendar, DollarSign, Users, Sparkles, Loader2 } from "lucide-react";

interface TripFormProps {
  onGenerate: (data: {
    destination: string;
    days: number;
    budget: string;
    companion: string;
    preferences: string;
  }) => void;
  isLoading: boolean;
}

const BUDGET_OPTIONS = [
  {
    id: "Economy",
    label: "Economy",
    desc: "Hostels, street food, public transit & free sights",
    color: "border-emerald-200 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    id: "Moderate",
    label: "Moderate",
    desc: "Boutique hotels, mid-range dining, local experiences",
    color: "border-ocean-200 text-ocean-800 bg-ocean-50/50 hover:bg-ocean-50",
    iconColor: "text-ocean-500",
  },
  {
    id: "Luxury",
    label: "Luxury",
    desc: "High-end resorts, fine dining, private transfers & tours",
    color: "border-clay-200 text-clay-700 bg-amber-50/30 hover:bg-amber-50/60",
    iconColor: "text-clay-500",
  },
];

const COMPANION_OPTIONS = [
  { id: "Solo", label: "Solo Explorer" },
  { id: "Couple", label: "Couple / Romantic" },
  { id: "Family", label: "Family with Kids" },
  { id: "Friends", label: "Group of Friends" },
  { id: "Adventure", label: "Thrill Seeker" },
  { id: "Cultural", label: "History & Heritage" },
  { id: "Foodie", label: "Culinary & Dining" },
];

export default function TripForm({ onGenerate, isLoading }: TripFormProps) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState("Moderate");
  const [companion, setCompanion] = useState("Solo");
  const [preferences, setPreferences] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!destination.trim()) {
      setError("Please specify a dream destination.");
      return;
    }

    if (days < 1 || days > 14) {
      setError("We support plans from 1 to 14 days.");
      return;
    }

    onGenerate({
      destination: destination.trim(),
      days,
      budget,
      companion,
      preferences: preferences.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40 relative overflow-hidden transition-all duration-300">
      {/* Decorative Warm Accent Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sand-400 via-clay-500 to-ocean-500"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-sand-100 rounded-xl text-sand-700">
          <Compass className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-sand-900 leading-tight">Plan Your Journey</h2>
          <p className="text-xs text-sand-500">Let Gemini map out your perfect sequential timeline</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Destination Input */}
        <div>
          <label htmlFor="destination-input" className="block text-sm font-semibold text-sand-800 mb-2">
            Where to?
          </label>
          <div className="relative">
            <input
              id="destination-input"
              type="text"
              placeholder="e.g. Kyoto, Japan; Amalfi Coast, Italy; Banff, Canada"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 bg-sand-50/50 border border-sand-200 rounded-2xl text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-all"
              required
            />
            <Sparkles className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400 pointer-events-none" />
          </div>
        </div>

        {/* Days Selector */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="days-range" className="text-sm font-semibold text-sand-800">
              Trip Duration
            </label>
            <span className="px-3 py-1 bg-sand-100 text-sand-800 rounded-lg text-xs font-bold font-mono">
              {days} {days === 1 ? "Day" : "Days"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-sand-400" />
            <input
              id="days-range"
              type="range"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 bg-sand-100 rounded-lg appearance-none cursor-pointer accent-sand-600 focus:outline-none focus:ring-2 focus:ring-sand-400"
            />
          </div>
          <div className="flex justify-between text-[10px] text-sand-400 font-mono mt-1.5 px-9">
            <span>1 Day</span>
            <span>7 Days</span>
            <span>14 Days</span>
          </div>
        </div>

        {/* Budget Picker */}
        <div>
          <label className="block text-sm font-semibold text-sand-800 mb-3">
            Budget Tier
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BUDGET_OPTIONS.map((opt) => {
              const isSelected = budget === opt.id;
              return (
                <button
                  id={`budget-opt-${opt.id}`}
                  key={opt.id}
                  type="button"
                  onClick={() => setBudget(opt.id)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between h-full ${
                    isSelected
                      ? "border-sand-600 bg-sand-100/40 shadow-sm"
                      : "border-sand-100 hover:border-sand-200 bg-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start w-full mb-1">
                    <span className="font-bold text-sm text-sand-950">{opt.label}</span>
                    <DollarSign
                      className={`w-4.5 h-4.5 ${
                        isSelected ? "text-sand-700" : "text-sand-400"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-sand-500 leading-relaxed">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Companion / Vibe Selector */}
        <div>
          <label className="block text-sm font-semibold text-sand-800 mb-2">
            Who is Joining & Travel Style?
          </label>
          <div className="flex flex-wrap gap-2">
            {COMPANION_OPTIONS.map((opt) => {
              const isSelected = companion === opt.id;
              return (
                <button
                  id={`companion-opt-${opt.id}`}
                  key={opt.id}
                  type="button"
                  onClick={() => setCompanion(opt.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-sand-900 text-white border-sand-900 shadow-sm"
                      : "bg-sand-50/50 text-sand-600 border-sand-200 hover:bg-sand-100 hover:text-sand-800"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Preferences Textarea */}
        <div>
          <label htmlFor="preferences-input" className="block text-sm font-semibold text-sand-800 mb-2">
            Specific Interests or Requirements (Optional)
          </label>
          <textarea
            id="preferences-input"
            rows={3}
            placeholder="e.g. Vegetarian/vegan food friendly, art galleries, focus on nature, low difficulty walking, specific kids-friendly activities, etc."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="w-full px-4 py-3 bg-sand-50/50 border border-sand-200 rounded-2xl text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-400 focus:border-transparent transition-all text-sm"
          />
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          id="generate-button"
          type="submit"
          disabled={isLoading}
          className="w-full bg-sand-900 text-white py-4 px-6 rounded-2xl font-bold text-sm tracking-wide hover:bg-sand-850 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-sand-900/10 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Crafting Your Bespoke Travel Guide...
            </>
          ) : (
            <>
              <Compass className="w-5 h-5" />
              Generate My AI Travel Plan
            </>
          )}
        </button>
      </div>
    </form>
  );
}
