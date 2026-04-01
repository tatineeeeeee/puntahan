export const CHECKLIST_TEMPLATES: Record<string, string[]> = {
  Beach: [
    "Sunscreen (SPF 50+)",
    "Swimsuit",
    "Beach towel",
    "Sunglasses",
    "Waterproof phone pouch",
    "Reef-safe sunscreen",
    "Flip flops / sandals",
    "Snorkel gear (or rent locally)",
  ],
  Mountain: [
    "Hiking shoes / trail runners",
    "Rain jacket / windbreaker",
    "Headlamp / flashlight",
    "Water bottle (1L+)",
    "Trail mix / energy bars",
    "First aid kit",
    "Warm layer (it gets cold at summit)",
    "Trekking poles (optional)",
  ],
  City: [
    "Comfortable walking shoes",
    "Day pack / crossbody bag",
    "Portable charger",
    "Cash (small bills for jeepneys)",
    "Umbrella / rain gear",
    "Light jacket for AC malls",
  ],
  "Island Hopping": [
    "Dry bag for electronics",
    "Underwater camera / GoPro",
    "Reef-safe sunscreen",
    "Aqua shoes",
    "Snorkel set",
    "Motion sickness meds",
    "Waterproof pouch for phone",
  ],
  Historical: [
    "Comfortable walking shoes",
    "Camera",
    "Notebook / journal",
    "Water bottle",
    "Light clothing (long sleeves for churches)",
    "Guidebook or downloaded maps",
  ],
  "Food Trip": [
    "Antacid / digestive meds",
    "Wet wipes / hand sanitizer",
    "Reusable water bottle",
    "Food journal / notes app",
    "Cash for street food",
    "Appetite!",
  ],
};

export function getTemplateForCategories(categories: string[]): string[] {
  const items = new Set<string>();
  for (const cat of categories) {
    const template = CHECKLIST_TEMPLATES[cat];
    if (template) {
      template.forEach((item) => items.add(item));
    }
  }
  return [...items];
}
