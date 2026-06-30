import React, { useState, useEffect } from "react";
import TripForm from "./components/TripForm";
import ItineraryTimeline from "./components/ItineraryTimeline";
import HotelsSection from "./components/HotelsSection";
import FoodSection from "./components/FoodSection";
import PackingSection from "./components/PackingSection";
import BudgetAndTransit from "./components/BudgetAndTransit";
import MarkdownView from "./components/MarkdownView";
import { TravelPlan, SavedTrip } from "./types";
import { Compass, Sparkles, AlertCircle, History, Trash2, Calendar, DollarSign, MapPin, Heart, ArrowRight, Share2, Printer } from "lucide-react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"interactive" | "markdown">("interactive");

  // Load saved trips from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_travel_planner_trips");
      if (saved) {
        setSavedTrips(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load saved trips:", e);
    }
  }, []);

  // Save trips to LocalStorage when changed
  const saveTripsToStorage = (updated: SavedTrip[]) => {
    setSavedTrips(updated);
    try {
      localStorage.setItem("ai_travel_planner_trips", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist saved trips:", e);
    }
  };

  const handleGeneratePlan = async (formData: {
    destination: string;
    days: number;
    budget: string;
    companion: string;
    preferences: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setTravelPlan(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate travel plan.");
      }

      setTravelPlan(data);

      // Save to history automatically
      const newTrip: SavedTrip = {
        id: crypto.randomUUID(),
        plan: data,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        budget: formData.budget,
        days: formData.days,
        companion: formData.companion,
        preferences: formData.preferences,
      };

      const updatedTrips = [newTrip, ...savedTrips];
      saveTripsToStorage(updatedTrips);
      setSelectedSavedId(newTrip.id);
      setViewMode("interactive");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while planning your journey.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSavedTrip = (trip: SavedTrip) => {
    setTravelPlan(trip.plan);
    setSelectedSavedId(trip.id);
    setViewMode("interactive");
    // Scroll smoothly to results
    const element = document.getElementById("itinerary-results");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteSavedTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedTrips.filter((t) => t.id !== id);
    saveTripsToStorage(updated);
    if (selectedSavedId === id) {
      setSelectedSavedId(null);
      setTravelPlan(null);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `AI Travel Plan to ${travelPlan?.destination}`,
          text: `Check out this gorgeous journey guide for ${travelPlan?.destination}: ${travelPlan?.tagline}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert("Application URL copied to clipboard! Share it with friends.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-sand-200 selection:text-sand-900">
      {/* Dynamic Elegant Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sand-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-sand-800 to-sand-950 text-white p-2 rounded-xl flex items-center justify-center shadow-md">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-sand-950 flex items-center gap-1.5">
                AI Travel Planner
                <span className="text-[10px] font-mono font-bold bg-sand-100 text-sand-800 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Bespoke
                </span>
              </span>
              <p className="text-[10px] text-sand-500 font-medium">Sequential Chronological Itineraries</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-sand-500 font-medium hidden md:inline-block">Powered by Gemini 3.5 Flash</span>
            <div className="h-4 w-px bg-sand-200 hidden md:block"></div>
            <a
              href="#saved-journeys-sec"
              className="flex items-center gap-1.5 text-xs font-semibold text-sand-700 hover:text-sand-950 bg-sand-50 border border-sand-200 px-3 py-1.5 rounded-lg transition-all"
            >
              <History className="w-3.5 h-3.5" />
              History ({savedTrips.length})
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Hero banner */}
        <div className="bg-gradient-to-b from-sand-100/50 via-sand-100/20 to-transparent rounded-3xl p-6 md:p-10 text-center relative overflow-hidden border border-sand-200 print:hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sand-200/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-ocean-100/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-sand-200 rounded-full text-xs font-semibold text-sand-700 mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sand-500" />
              Next-Gen Journey Designing
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-sand-950 font-display tracking-tight leading-tight mb-4">
              Map out your dream escape, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sand-700 via-clay-600 to-ocean-700 font-extrabold">
                sequentially and beautifully.
              </span>
            </h1>
            <p className="text-sm md:text-base text-sand-600 leading-relaxed font-sans max-w-xl mx-auto">
              Skip hours of scrolling. Specify your destination, ideal days, and budget tier. Gemini will generate a continuous linear itinerary, custom packing checklists, local eats, and verified hotel guides.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Area - Span 8 */}
          <div className="lg:col-span-8 space-y-8 print:hidden">
            <TripForm onGenerate={handleGeneratePlan} isLoading={isLoading} />
          </div>

          {/* History / Info Sidebar - Span 4 */}
          <div id="saved-journeys-sec" className="lg:col-span-4 space-y-6 print:hidden">
            {/* Quick Tips Box */}
            <div className="bg-white rounded-3xl p-5 border border-sand-200/80 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sand-50 rounded-bl-full -z-10"></div>
              <h3 className="font-bold text-sm text-sand-900 mb-2.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sand-500" />
                Plan Guidelines
              </h3>
              <ul className="text-xs text-sand-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-sand-400">•</span>
                  <span><strong>Sequential flow:</strong> Every day progresses chronologically from morning to night.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sand-400">•</span>
                  <span><strong>Realistic budgets:</strong> Hotel and activity cost estimates match your category preference exactly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sand-400">•</span>
                  <span><strong>Custom tips:</strong> Local dining hotspots, neighborhoods, and essential clothing packing requirements.</span>
                </li>
              </ul>
            </div>

            {/* Past Journeys History */}
            <div className="bg-white rounded-3xl p-6 border border-sand-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-sand-100">
                <h3 className="font-bold text-sm text-sand-950 flex items-center gap-2">
                  <History className="w-4 h-4 text-sand-500" />
                  Your Saved Journeys
                </h3>
                <span className="text-xs font-mono font-bold bg-sand-100 text-sand-700 px-2 py-0.5 rounded-full">
                  {savedTrips.length}
                </span>
              </div>

              {savedTrips.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-sand-150 rounded-2xl">
                  <p className="text-xs text-sand-500 mb-1.5">No saved trips yet.</p>
                  <p className="text-[11px] text-sand-400 leading-normal">
                    Generate an itinerary or customize your budget to get started. Your trips save here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {savedTrips.map((trip) => {
                    const isSelected = selectedSavedId === trip.id;
                    return (
                      <div
                        id={`saved-trip-item-${trip.id}`}
                        key={trip.id}
                        onClick={() => handleSelectSavedTrip(trip)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group text-left ${
                          isSelected
                            ? "bg-sand-900 text-white border-sand-900 shadow-md"
                            : "bg-sand-50/50 hover:bg-sand-100/60 border-sand-200 text-sand-850"
                        }`}
                      >
                        <div className="min-w-0">
                          <h4 className={`font-bold text-xs truncate ${isSelected ? "text-white" : "text-sand-950"}`}>
                            {trip.plan.destination}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-sand-400">
                            <span className="flex items-center gap-0.5">
                              <Calendar className="w-3 h-3" /> {trip.days}d
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-sand-600 group-hover:text-sand-800">
                              {trip.budget}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-white/20 text-white" : "bg-sand-200 text-sand-700"
                          }`}>
                            {trip.createdAt}
                          </span>
                          <button
                            id={`delete-trip-btn-${trip.id}`}
                            type="button"
                            onClick={(e) => handleDeleteSavedTrip(trip.id, e)}
                            className={`p-1 rounded-md transition-colors ${
                              isSelected
                                ? "text-white/60 hover:text-white hover:bg-white/10"
                                : "text-sand-400 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title="Delete this journey"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Spinner with Tips */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-sand-200 border-t-sand-850 animate-spin"></div>
              <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-sand-700 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-sand-900">Assembling Your Bespoke Blueprint...</h3>
              <p className="text-xs text-sand-500 mt-1 px-4 leading-relaxed">
                We are talking with Gemini to map local hotels, delicious dining suggestions, sequential activities, and precise climate-aware gear list.
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start gap-4 max-w-2xl mx-auto print:hidden">
            <div className="p-2 bg-rose-100 rounded-xl text-rose-700 flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-rose-950 mb-1">Planning Interrupted</h3>
              <p className="text-xs text-rose-800 leading-relaxed mb-3">
                {error}
              </p>
              <div className="text-[10px] text-rose-500 font-mono">
                Troubleshooting tip: Make sure you have added your Gemini API secret key in Google AI Studio.
              </div>
            </div>
          </div>
        )}

        {/* Generated Plan Section */}
        {travelPlan && !isLoading && (
          <div id="itinerary-results" className="space-y-8 animate-fade-in pt-4">
            {/* Travel Plan Header / Hero Banner with Tagline */}
            <div className="bg-sand-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-sand-900/15">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-sand-600/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded text-sand-100 font-mono mb-2 inline-block">
                    YOUR EXCLUSIVE TRIP MATRIX
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white mb-1.5 flex flex-wrap items-center gap-3">
                    {travelPlan.destination}
                  </h2>
                  <p className="text-sm md:text-base text-sand-200/90 font-medium italic">
                    "{travelPlan.tagline}"
                  </p>
                </div>

                {/* Print and Share controls */}
                <div className="flex items-center gap-2 flex-wrap print:hidden">
                  <button
                    id="share-btn"
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] rounded-xl text-xs font-semibold transition-all border border-white/15"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button
                    id="print-btn"
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-[0.98] rounded-xl text-xs font-semibold transition-all border border-white/15"
                  >
                    <Printer className="w-4 h-4" /> Print PDF
                  </button>
                </div>
              </div>

              {/* Stats Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-sand-400 block text-[10px] uppercase tracking-wider mb-1">BEST SEASONS TO VISIT</span>
                  <span className="text-white font-sans font-medium">{travelPlan.bestTimeToVisit}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-sand-400 block text-[10px] uppercase tracking-wider mb-1">THE JOURNEY VIBE</span>
                  <span className="text-white font-sans font-medium">{travelPlan.vibeSummary}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-sand-400 block text-[10px] uppercase tracking-wider mb-1">LINEAR STAGES</span>
                  <span className="text-white font-sans font-medium">
                    {travelPlan.itinerary.length} Days chronologically sequential
                  </span>
                </div>
              </div>
            </div>

            {/* View Mode Tabs Selector */}
            <div className="flex border-b border-sand-200 pb-1 items-center gap-6 print:hidden">
              <button
                id="view-interactive-tab"
                type="button"
                onClick={() => setViewMode("interactive")}
                className={`pb-3 text-sm font-bold tracking-tight transition-all relative cursor-pointer ${
                  viewMode === "interactive"
                    ? "text-sand-950 font-extrabold"
                    : "text-sand-400 hover:text-sand-600"
                }`}
              >
                Interactive Planner
                {viewMode === "interactive" && (
                  <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-sand-950 rounded-full"></div>
                )}
              </button>
              <button
                id="view-markdown-tab"
                type="button"
                onClick={() => setViewMode("markdown")}
                className={`pb-3 text-sm font-bold tracking-tight transition-all relative cursor-pointer ${
                  viewMode === "markdown"
                    ? "text-sand-950 font-extrabold"
                    : "text-sand-400 hover:text-sand-600"
                }`}
              >
                Raw Markdown Document
                {viewMode === "markdown" && (
                  <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-sand-950 rounded-full"></div>
                )}
              </button>
            </div>

            {viewMode === "markdown" ? (
              <MarkdownView markdown={travelPlan.markdownPlan} />
            ) : (
              <>
                {/* Render Main Linear Timeline */}
                <ItineraryTimeline itinerary={travelPlan.itinerary} />

                {/* Render Budget details & Optimization recommendations */}
                <BudgetAndTransit
                  breakdown={travelPlan.budgetBreakdown}
                  transit={travelPlan.transportationGuide}
                  tips={travelPlan.budgetTips}
                  summary={travelPlan.summary}
                />

                {/* Render Hotel Recommendations */}
                <HotelsSection hotels={travelPlan.hotels} budgetTier={savedTrips.find(t => t.id === selectedSavedId)?.budget || "Moderate"} />

                {/* Render Culinary recommendations */}
                <FoodSection foodList={travelPlan.foodRecommendations} />

                {/* Render Tailored Packing Checklist */}
                <PackingSection packingList={travelPlan.packingList} />
              </>
            )}
          </div>
        )}
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-white border-t border-sand-250 py-8 text-center text-xs text-sand-500 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-sand-800">
            Bespoke Travel Cartography & Guides
          </p>
          <p className="max-w-md mx-auto leading-relaxed">
            Organized sequentially, priced realistically, and crafted instantly with Google Gemini AI. Plan responsibly and explore curiously.
          </p>
          <p className="text-[10px] text-sand-400 pt-3">
            © 2026 AI Travel Planner. All journey details compiled procedurally.
          </p>
        </div>
      </footer>
    </div>
  );
}
