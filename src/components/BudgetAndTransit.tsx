import React from "react";
import { BudgetBreakdown, TransportationGuide, TravelSummary } from "../types";
import { DollarSign, Landmark, Car, HelpCircle, AlertCircle, TrendingDown, Star, Milestone } from "lucide-react";

interface BudgetAndTransitProps {
  breakdown?: BudgetBreakdown;
  transit?: TransportationGuide;
  tips?: string[];
  summary?: TravelSummary;
}

export default function BudgetAndTransit({ breakdown, transit, tips, summary }: BudgetAndTransitProps) {
  if (!breakdown && !transit && !tips && !summary) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Budget Breakdown & Tips - Span 7 */}
      <div className="lg:col-span-7 space-y-6">
        {breakdown && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40">
            <div className="flex items-center justify-between border-b border-sand-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-sand-900">Estimated Budget Breakdown</h3>
                <p className="text-xs text-sand-500">Realistic funding allocations for this journey style</p>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { title: "Transport", val: breakdown.transportation, color: "bg-blue-50/50 text-blue-800 border-blue-100" },
                { title: "Lodging", val: breakdown.accommodation, color: "bg-amber-50/50 text-amber-800 border-amber-100" },
                { title: "Dining", val: breakdown.food, color: "bg-rose-50/50 text-rose-800 border-rose-100" },
                { title: "Activities", val: breakdown.activities, color: "bg-violet-50/50 text-violet-800 border-violet-100" },
                { title: "Misc/Emergency", val: breakdown.miscellaneous, color: "bg-gray-50/50 text-gray-800 border-gray-100" },
              ].map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl border flex flex-col justify-between ${item.color}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{item.title}</span>
                  <span className="text-xs font-bold font-mono mt-1.5 leading-tight">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tips && tips.length > 0 && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40">
            <div className="flex items-center justify-between border-b border-sand-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-sand-900">Budget Optimization Tips</h3>
                <p className="text-xs text-sand-500">Local tricks, free sights, and money-saving hacks</p>
              </div>
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3.5">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-sand-50/50 border border-sand-150 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-sand-200 text-sand-700 flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-sand-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transit & Important Highlights - Span 5 */}
      <div className="lg:col-span-5 space-y-6">
        {transit && (
          <div className="bg-white rounded-3xl p-6 border border-sand-200 shadow-xl shadow-sand-100/40">
            <div className="flex items-center justify-between border-b border-sand-100 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-sand-900">Transportation Guide</h3>
                <p className="text-[11px] text-sand-500">How to get there & zip around</p>
              </div>
              <div className="p-2 bg-sand-100 rounded-xl text-sand-700">
                <Car className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-sand-400 block mb-1 font-mono">REACHING DESTINATION</span>
                <p className="text-xs text-sand-700 leading-relaxed">{transit.howToReach}</p>
              </div>
              <div className="border-t border-sand-100 pt-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-sand-400 block mb-1 font-mono">LOCAL NAVIGATING</span>
                <p className="text-xs text-sand-700 leading-relaxed">{transit.localOptions}</p>
              </div>
              <div className="border-t border-sand-100 pt-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-sand-400 block mb-1 font-mono">TRANSIT ESTIMATES</span>
                <p className="text-xs text-sand-800 font-semibold font-mono">{transit.estimatedCosts}</p>
              </div>
            </div>
          </div>
        )}

        {summary && (
          <div className="bg-sand-900 text-white rounded-3xl p-6 border border-sand-800 shadow-xl shadow-sand-900/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Consolidated Summary</h3>
                <p className="text-[11px] text-sand-300">Total outlook & mandatory guidance</p>
              </div>
              <div className="p-2 bg-white/10 rounded-xl text-white font-mono text-xs font-bold">
                {summary.totalEstimatedCost}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-sand-400 block mb-1.5 font-mono flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> UNMISSABLE MASTERPIECE EXPERIENCES
                </span>
                <ul className="text-xs text-sand-200 space-y-1 pl-4 list-disc">
                  {summary.bestExperiences.map((exp, idx) => (
                    <li key={idx} className="leading-relaxed">{exp}</li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-3.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-sand-400 block mb-1.5 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-sand-300" /> CRITICAL TRIP ADVICE
                </span>
                <ul className="text-xs text-sand-200 space-y-1 pl-4 list-disc">
                  {summary.importantAdvice.map((adv, idx) => (
                    <li key={idx} className="leading-relaxed">{adv}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
