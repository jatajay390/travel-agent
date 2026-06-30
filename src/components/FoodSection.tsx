import React from "react";
import { FoodRecommendation } from "../types";
import { Utensils, MapPin, Tag, Landmark } from "lucide-react";
import { motion } from "motion/react";

interface FoodSectionProps {
  foodList: FoodRecommendation[];
}

export default function FoodSection({ foodList }: FoodSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40">
      <div className="flex items-center justify-between border-b border-sand-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-sand-900 leading-tight">Culinary & Dining Guide</h2>
          <p className="text-xs text-sand-500">Local flavors, must-try traditional dishes, and curated spots</p>
        </div>
        <div className="p-2 bg-sand-100 rounded-xl text-sand-600">
          <Utensils className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {foodList.map((food, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.08 }}
            className="bg-sand-50/40 rounded-2xl border border-sand-150 hover:border-sand-300 hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sand-500 bg-sand-100 px-2 py-0.5 rounded-md">
                    {food.cuisine}
                  </span>
                  <h3 className="font-bold text-base text-sand-950 mt-1">{food.dishName}</h3>
                </div>
                <span className="font-mono text-xs font-bold text-sand-600 bg-sand-100/60 px-2.5 py-1 rounded-lg">
                  {food.priceLevel}
                </span>
              </div>

              <p className="text-xs text-sand-600 leading-relaxed mb-4">
                {food.description}
              </p>
            </div>

            <div className="mt-2 pt-4 border-t border-sand-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-sand-800">
                <Utensils className="w-3.5 h-3.5 text-sand-500" />
                <span>Try at: <strong className="text-sand-950 font-semibold">{food.restaurantSuggest}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-sand-500">
                <MapPin className="w-3 h-3 text-sand-400" />
                <span>{food.location}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
