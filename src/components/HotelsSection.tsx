import React from "react";
import { HotelRecommendation } from "../types";
import { Hotel, Star, MapPin, CheckCircle, DollarSign } from "lucide-react";
import { motion } from "motion/react";

interface HotelsSectionProps {
  hotels: HotelRecommendation[];
  budgetTier: string;
}

export default function HotelsSection({ hotels, budgetTier }: HotelsSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40">
      <div className="flex items-center justify-between border-b border-sand-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-sand-900 leading-tight">Curated Accommodations</h2>
          <p className="text-xs text-sand-500">Perfect stays selected for your <span className="font-semibold text-sand-700">{budgetTier}</span> budget</p>
        </div>
        <div className="p-2 bg-sand-100 rounded-xl text-sand-600">
          <Hotel className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.1 }}
            className="flex flex-col bg-sand-50/40 rounded-2xl border border-sand-150 hover:border-sand-300 hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            {/* Visual Header representing a placeholder card image style */}
            <div className="bg-gradient-to-r from-sand-300 to-sand-400 p-4 h-24 flex items-end relative overflow-hidden">
              <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono text-sand-800 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                {hotel.rating}
              </div>
              <div className="bg-sand-900/45 absolute inset-0 group-hover:bg-sand-900/30 transition-colors"></div>
              <div className="z-10 text-white font-mono text-xs font-semibold flex items-center gap-0.5">
                <DollarSign className="w-3.5 h-3.5" /> {hotel.priceRange}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-sand-950 group-hover:text-sand-700 transition-colors mb-1.5">
                  {hotel.name}
                </h3>
                
                <div className="flex items-center gap-1 text-[11px] text-sand-500 font-medium mb-3">
                  <MapPin className="w-3.5 h-3.5 text-sand-400" />
                  <span>{hotel.location}</span>
                </div>

                <p className="text-xs text-sand-600 leading-relaxed mb-4">
                  {hotel.description}
                </p>
              </div>

              {/* Match Indicator */}
              <div className="pt-4 border-t border-sand-100 bg-sand-50/75 p-3 rounded-xl">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">Why it fits</span>
                    <span className="text-[11px] text-sand-700 leading-normal block">{hotel.whyItFits}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
