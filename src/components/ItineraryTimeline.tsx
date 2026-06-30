import React, { useState } from "react";
import { DayItinerary, ItineraryActivity } from "../types";
import { Clock, MapPin, DollarSign, Timer, Landmark, Camera, Utensils, Compass, Sun, Eye, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sightseeing: <Landmark className="w-4 h-4" />,
  Culture: <Landmark className="w-4 h-4" />,
  Adventure: <Compass className="w-4 h-4" />,
  Food: <Utensils className="w-4 h-4" />,
  Relaxation: <Sun className="w-4 h-4" />,
  Transit: <Clock className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Sightseeing: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Culture: "bg-amber-50 text-amber-700 border-amber-100",
  Adventure: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Food: "bg-rose-50 text-rose-700 border-rose-100",
  Relaxation: "bg-sky-50 text-sky-700 border-sky-100",
  Transit: "bg-gray-50 text-gray-700 border-gray-100",
};

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [showAll, setShowAll] = useState<boolean>(false);

  const activeDay = itinerary.find((d) => d.day === selectedDayNum) || itinerary[0];

  const handleDaySelect = (dayNum: number) => {
    setSelectedDayNum(dayNum);
    setShowAll(false);
  };

  const getCategoryTheme = (category: string) => {
    return (
      CATEGORY_COLORS[category] ||
      "bg-sand-50 text-sand-700 border-sand-100"
    );
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || <Camera className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-sand-100">
        <div>
          <h2 className="text-xl font-bold text-sand-900 leading-tight">Linear Day-by-Day Itinerary</h2>
          <p className="text-xs text-sand-500">A chronologically sequenced, hour-by-hour timeline path</p>
        </div>

        {/* Linear timeline toggle */}
        <div className="flex bg-sand-100 p-1 rounded-xl self-start md:self-auto text-xs font-semibold">
          <button
            id="tab-single-day"
            type="button"
            onClick={() => setShowAll(false)}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              !showAll ? "bg-white text-sand-900 shadow-sm" : "text-sand-500 hover:text-sand-800"
            }`}
          >
            Day Focus
          </button>
          <button
            id="tab-all-days"
            type="button"
            onClick={() => setShowAll(true)}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              showAll ? "bg-white text-sand-900 shadow-sm" : "text-sand-500 hover:text-sand-800"
            }`}
          >
            Full Journey
          </button>
        </div>
      </div>

      {/* Day Swapper Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-thin">
        {itinerary.map((day) => {
          const isActive = selectedDayNum === day.day && !showAll;
          return (
            <button
              id={`day-tab-${day.day}`}
              key={day.day}
              type="button"
              onClick={() => handleDaySelect(day.day)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-sand-900 text-white border-sand-900 shadow-md shadow-sand-900/10"
                  : "bg-sand-50/50 text-sand-600 border-sand-200 hover:bg-sand-100/80"
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono ${isActive ? "bg-white/25 text-white" : "bg-sand-200 text-sand-800"}`}>
                {day.day}
              </span>
              <span>{day.title.length > 18 ? `Day ${day.day}` : day.title}</span>
            </button>
          );
        })}
      </div>

      {/* Itinerary Contents */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {showAll ? (
            <motion.div
              key="all-days"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >
              {itinerary.map((day) => (
                <div key={day.day} className="border-l-2 border-dashed border-sand-200 pl-4 md:pl-6 relative">
                  {/* Decorative timeline node */}
                  <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-sand-400 border-4 border-white shadow-sm"></div>

                  <div className="mb-6">
                    <span className="text-xs font-bold text-sand-500 uppercase tracking-widest font-mono">Day {day.day}</span>
                    <h3 className="text-lg font-bold text-sand-900 flex items-center gap-2">
                      {day.title}
                      <span className="text-xs font-medium text-sand-400 bg-sand-100 px-2 py-0.5 rounded">
                        {day.theme}
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {day.activities.map((act, index) => (
                      <ActivityCard key={index} activity={act} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeDay.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 relative"
            >
              {/* Day Header Banner */}
              <div className="bg-sand-50 rounded-2xl p-4 border border-sand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-sand-900 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                      Day {activeDay.day}
                    </span>
                    <span className="text-xs font-medium text-sand-500 font-mono">
                      {activeDay.theme}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-sand-900">{activeDay.title}</h3>
                </div>
                <div className="text-[11px] text-sand-400 font-mono self-start sm:self-auto flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Chronological Progression
                </div>
              </div>

              {/* Vertical Linear Line */}
              <div className="absolute left-4 top-[84px] bottom-4 w-0.5 bg-sand-200 z-0"></div>

              <div className="space-y-6">
                {activeDay.activities.map((act, index) => (
                  <ActivityCard key={index} activity={act} index={index} isSingleDay />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActivityCard({ activity, index, isSingleDay = false }: { activity: ItineraryActivity; index: number; isSingleDay?: boolean; key?: React.Key }) {
  const themeClass = CATEGORY_COLORS[activity.category] || "bg-sand-50 text-sand-700 border-sand-100";
  const icon = CATEGORY_ICONS[activity.category] || <Camera className="w-4 h-4" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: isSingleDay ? -12 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="relative flex gap-4 md:gap-6 z-10"
    >
      {/* Time Node and Circle */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-sand-50 border border-sand-300 shadow flex items-center justify-center font-mono text-xs font-bold text-sand-700 bg-white">
          {index + 1}
        </div>
        <div className="text-[10px] font-bold text-sand-500 font-mono mt-1 whitespace-nowrap">
          {activity.time}
        </div>
      </div>

      {/* Main card box */}
      <div className="flex-1 bg-white border border-sand-150 rounded-2xl p-4 hover:border-sand-300 hover:shadow-md transition-all duration-200">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <h4 className="text-sm font-bold text-sand-950 flex flex-wrap items-center gap-2">
            {activity.activity}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${themeClass}`}>
              {icon}
              {activity.category}
            </span>
          </h4>

          <div className="flex items-center gap-2 font-mono text-[11px] text-sand-500 bg-sand-50 px-2 py-1 rounded-lg">
            <span className="flex items-center gap-0.5">
              <Timer className="w-3 h-3" /> {activity.duration}
            </span>
            <span className="text-sand-300">•</span>
            <span className="flex items-center text-sand-600 font-semibold">
              {activity.cost}
            </span>
          </div>
        </div>

        <p className="text-xs text-sand-600 leading-relaxed mb-3">
          {activity.description}
        </p>

        <div className="flex items-center gap-1.5 text-[11px] text-sand-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-sand-400" />
          <span>{activity.location}</span>
        </div>
      </div>
    </motion.div>
  );
}
