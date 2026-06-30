import React, { useState } from "react";
import { PackingCategory } from "../types";
import { ListTodo, Check, Square, CheckSquare } from "lucide-react";
import { motion } from "motion/react";

interface PackingSectionProps {
  packingList: PackingCategory[];
}

export default function PackingSection({ packingList }: PackingSectionProps) {
  // Let's store checked items in local state: key = "category-itemName"
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (category: string, item: string) => {
    const key = `${category}-${item}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getCheckedCount = (catName: string, items: string[]) => {
    return items.filter((item) => checkedItems[`${catName}-${item}`]).length;
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-xl shadow-sand-100/40">
      <div className="flex items-center justify-between border-b border-sand-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-sand-900 leading-tight">Interactive Packing Checklist</h2>
          <p className="text-xs text-sand-500">Custom packing gear, clothing, and documents suggested for this trip</p>
        </div>
        <div className="p-2 bg-sand-100 rounded-xl text-sand-600">
          <ListTodo className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packingList.map((cat, index) => {
          const checkedCount = getCheckedCount(cat.category, cat.items);
          const totalCount = cat.items.length;
          const isCompleted = checkedCount === totalCount;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="bg-sand-50/30 rounded-2xl border border-sand-150 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-sand-100">
                  <h3 className="font-bold text-sm text-sand-950 uppercase tracking-wider">{cat.category}</h3>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-sand-200 text-sand-700"
                  }`}>
                    {checkedCount}/{totalCount}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {cat.items.map((item, itemIdx) => {
                    const isChecked = !!checkedItems[`${cat.category}-${item}`];
                    return (
                      <button
                        id={`pack-item-${index}-${itemIdx}`}
                        key={itemIdx}
                        type="button"
                        onClick={() => toggleItem(cat.category, item)}
                        className="w-full flex items-start gap-2.5 text-left py-1 group focus:outline-none"
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                          ) : (
                            <Square className="w-4 h-4 text-sand-400 group-hover:text-sand-600 transition-colors" />
                          )}
                        </span>
                        <span className={`text-xs transition-colors ${
                          isChecked ? "line-through text-sand-400" : "text-sand-700 group-hover:text-sand-950"
                        }`}>
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {totalCount > 0 && (
                <div className="mt-4 pt-3 border-t border-sand-100/50">
                  <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sand-900 h-full transition-all duration-300"
                      style={{ width: `${(checkedCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
