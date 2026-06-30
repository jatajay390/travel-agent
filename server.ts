import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client
// We use the recommended 'gemini-3.5-flash' model
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// API endpoint to generate travel plans
app.post("/api/generate", async (req, res) => {
  try {
    const { destination, days, budget, companion, preferences } = req.body;

    if (!destination) {
      return res.status(400).json({ error: "Destination is required." });
    }
    if (!days || isNaN(Number(days)) || Number(days) < 1 || Number(days) > 14) {
      return res.status(400).json({ error: "Number of days must be between 1 and 14." });
    }
    if (!budget) {
      return res.status(400).json({ error: "Budget category is required." });
    }

    if (!ai) {
      return res.status(500).json({
        error:
          "Gemini API key is not configured. Please add your GEMINI_API_KEY in the Settings > Secrets panel of Google AI Studio.",
      });
    }

    const durationDays = Number(days);

    // Prompt engineered to guarantee high-quality, practical outputs
    const prompt = `Create a comprehensive, highly realistic, day-by-day travel plan for a trip to "${destination}" for ${durationDays} day(s).
The traveler has a budget level of "${budget}" and is traveling with/as "${companion || "Solo"}".
Special interests or preferences: "${preferences || "None specified"}".

Your plan MUST strictly fit this budget:
- Economy: Budget-conscious hostels or homestays, local street food, free or cheap sights, public transport.
- Moderate: Mid-range hotels, balanced mix of dining, standard paid sights, walking and public transport.
- Luxury: High-end luxury hotels/resorts, fine dining or highly-rated local restaurants, premium private experiences, taxis or private transfers.

Ensure there are distinct food recommendations and hotel options that perfectly match the budget tier.
The itinerary must exhibit strict sequential linear flow (time-of-day progression for each day from morning to night, e.g. 09:00 AM, 01:00 PM, 06:00 PM). Ensure the pacing is linear and logical.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite concierge, travel cartographer, and local insider. You design highly visual, sequentially linear, incredibly curated travel planners that include specific times, precise hotel choices, delectable local food recommendations, and structured packing lists tailored exactly to the climate, culture, and nature of the destination.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "destination",
            "tagline",
            "bestTimeToVisit",
            "vibeSummary",
            "itinerary",
            "hotels",
            "foodRecommendations",
            "packingList",
            "budgetBreakdown",
            "transportationGuide",
            "budgetTips",
            "summary",
            "markdownPlan"
          ],
          properties: {
            destination: {
              type: Type.STRING,
              description: "The formatted name of the destination (e.g. Kyoto, Japan)",
            },
            tagline: {
              type: Type.STRING,
              description: "A short, beautiful, evocative tagline for this specific trip",
            },
            bestTimeToVisit: {
              type: Type.STRING,
              description: "Best seasons or months to visit this destination, with a 1-sentence explanation why",
            },
            vibeSummary: {
              type: Type.STRING,
              description: "A 2-sentence visual description of what the vibe of this trip feels like",
            },
            itinerary: {
              type: Type.ARRAY,
              description: "Day-by-day sequential plan showing a clear linear time flow. Include morning, afternoon, and evening activities.",
              items: {
                type: Type.OBJECT,
                required: ["day", "title", "theme", "activities"],
                properties: {
                  day: {
                    type: Type.INTEGER,
                    description: "The sequential day number (starting at 1)",
                  },
                  title: {
                    type: Type.STRING,
                    description: "An attractive title for the day's adventures",
                  },
                  theme: {
                    type: Type.STRING,
                    description: "Main theme of the day (e.g. Historic Temples, Coastal Adventure)",
                  },
                  activities: {
                    type: Type.ARRAY,
                    description: "List of linear, chronological activities for the day. Ensure a continuous, sequential progression.",
                    items: {
                      type: Type.OBJECT,
                      required: ["time", "activity", "description", "location", "cost", "duration", "category"],
                      properties: {
                        time: {
                          type: Type.STRING,
                          description: "Chronological time indicator (e.g. 09:00 AM, 01:30 PM, 06:00 PM)",
                        },
                        activity: {
                          type: Type.STRING,
                          description: "Name of the activity or site visit",
                        },
                        description: {
                          type: Type.STRING,
                          description: "Engaging 2-3 sentence description of what to do, highlights, and local tips.",
                        },
                        location: {
                          type: Type.STRING,
                          description: "The location/neighborhood name",
                        },
                        cost: {
                          type: Type.STRING,
                          description: "Estimated cost (e.g. Free, $15 USD, ¥2,000, Included)",
                        },
                        duration: {
                          type: Type.STRING,
                          description: "Approximate time spent (e.g. 2 hours, 45 mins)",
                        },
                        category: {
                          type: Type.STRING,
                          description: "Category: 'Sightseeing', 'Adventure', 'Food', 'Culture', 'Relaxation', 'Transit'",
                        },
                      },
                    },
                  },
                },
              },
            },
            hotels: {
              type: Type.ARRAY,
              description: "List of 3 highly recommended lodging options representing different price points (1. Budget, 2. Mid-range, 3. Luxury).",
              items: {
                type: Type.OBJECT,
                required: ["name", "description", "priceRange", "rating", "location", "whyItFits"],
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Hotel or accommodation name",
                  },
                  description: {
                    type: Type.STRING,
                    description: "A gorgeous 1-2 sentence description of the vibe, key amenities, and style of the lodging.",
                  },
                  priceRange: {
                    type: Type.STRING,
                    description: "Estimated price indicator per night (e.g. $40 - $60/night, $350/night)",
                  },
                  rating: {
                    type: Type.STRING,
                    description: "Star or guest rating (e.g. 4.7/5 or 4 Stars)",
                  },
                  location: {
                    type: Type.STRING,
                    description: "Neighborhood or district area",
                  },
                  whyItFits: {
                    type: Type.STRING,
                    description: "Why this fits and represents the specific tier (Budget, Mid-range, or Luxury).",
                  },
                },
              },
            },
            foodRecommendations: {
              type: Type.ARRAY,
              description: "List of 4 local culinary specialties, must-try food items, and specific restaurant suggestions. Note vegetarian options and approximate meal costs.",
              items: {
                type: Type.OBJECT,
                required: ["dishName", "description", "restaurantSuggest", "cuisine", "priceLevel", "location"],
                properties: {
                  dishName: {
                    type: Type.STRING,
                    description: "Name of local dish, street food, or dining highlight",
                  },
                  description: {
                    type: Type.STRING,
                    description: "What makes this dish unique, its flavor profile, and vegetarian friendliness (if applicable).",
                  },
                  restaurantSuggest: {
                    type: Type.STRING,
                    description: "Name of recommended restaurant, cafe, or local market stall",
                  },
                  cuisine: {
                    type: Type.STRING,
                    description: "Type of cuisine (e.g. Traditional Japanese, Vegan Cafe, Street Food)",
                  },
                  priceLevel: {
                    type: Type.STRING,
                    description: "Price level (e.g. $10 - $15 per meal, $, $$, $$$)",
                  },
                  location: {
                    type: Type.STRING,
                    description: "Location/district of the suggested spot",
                  },
                },
              },
            },
            packingList: {
              type: Type.ARRAY,
              description: "A tailored packing list organized by functional categories: Essentials, Clothing, Footwear, Electronics, Travel Documents, Health & Safety, Weather-specific.",
              items: {
                type: Type.OBJECT,
                required: ["category", "items"],
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "Category (e.g. 'Clothing', 'Footwear', 'Electronics', 'Travel Documents', 'Health & Safety', 'Weather-specific')",
                  },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                    description: "Specific packing items tailored to the weather and activities of this destination",
                  },
                },
              },
            },
            budgetBreakdown: {
              type: Type.OBJECT,
              required: ["transportation", "accommodation", "food", "activities", "miscellaneous"],
              properties: {
                transportation: { type: Type.STRING, description: "Detailed local and arrival transit cost breakdown" },
                accommodation: { type: Type.STRING, description: "Detailed hotel/stay cost breakdown" },
                food: { type: Type.STRING, description: "Estimated dining/food cost breakdown" },
                activities: { type: Type.STRING, description: "Sightseeing and booking fee breakdown" },
                miscellaneous: { type: Type.STRING, description: "Emergency fund, shopping, or SIM card cost breakdown" },
              },
            },
            transportationGuide: {
              type: Type.OBJECT,
              required: ["howToReach", "localOptions", "estimatedCosts"],
              properties: {
                howToReach: { type: Type.STRING, description: "Instructions on how to reach the destination via flights, trains, or road." },
                localOptions: { type: Type.STRING, description: "The best ways to get around (subways, taxis, bikes, walking maps)." },
                estimatedCosts: { type: Type.STRING, description: "Expected pricing overview for local transport passes or tickets." },
              },
            },
            budgetTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 4 highly practical budget optimization tips, free attractions, and local tricks to save money.",
            },
            summary: {
              type: Type.OBJECT,
              required: ["totalEstimatedCost", "bestExperiences", "importantAdvice"],
              properties: {
                totalEstimatedCost: { type: Type.STRING, description: "The calculated sum or range for the entire trip." },
                bestExperiences: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Top 3 unmissable experiences on this trip.",
                },
                importantAdvice: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Safety tips, weather awareness, booking deadlines, or visa guides.",
                },
              },
            },
            markdownPlan: {
              type: Type.STRING,
              description: "A beautifully composed travel plan in markdown format conforming strictly to the requested structure: # Trip Overview, # Day-wise Itinerary (with Morning/Afternoon/Evening), # Hotel Recommendations, # Food Recommendations, # Transportation Guide, # Packing Checklist, # Budget Optimization Tips, and # Summary. Do not omit any sections.",
            },
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No output received from Gemini API.");
    }

    const plan = JSON.parse(text);
    res.json(plan);
  } catch (error: any) {
    console.error("Error generating travel plan:", error);
    res.status(500).json({
      error: error.message || "An error occurred while generating your travel plan. Please try again.",
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite dev server in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve pre-built static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Travel Planner server running on port ${PORT}`);
  });
}

startServer();
