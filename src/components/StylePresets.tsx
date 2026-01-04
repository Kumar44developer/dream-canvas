import { cn } from "@/lib/utils";

export interface StylePreset {
  id: string;
  name: string;
  prompt: string;
  gradient: string;
  icon: string;
}

export const stylePresets: StylePreset[] = [
  {
    id: "none",
    name: "None",
    prompt: "",
    gradient: "from-muted to-muted-foreground/20",
    icon: "✨",
  },
  {
    id: "anime",
    name: "Anime",
    prompt: "anime style, vibrant colors, cel shading, manga inspired, Japanese animation aesthetic",
    gradient: "from-pink-500 to-purple-600",
    icon: "🎌",
  },
  {
    id: "photorealistic",
    name: "Photorealistic",
    prompt: "photorealistic, ultra realistic, 8K UHD, DSLR quality, professional photography, hyperrealistic details",
    gradient: "from-slate-600 to-zinc-800",
    icon: "📷",
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    prompt: "oil painting style, classical art, rich textures, brushstroke details, museum quality, Renaissance inspired",
    gradient: "from-amber-700 to-orange-900",
    icon: "🖼️",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    prompt: "watercolor painting, soft washes, delicate colors, artistic flow, paper texture, impressionistic",
    gradient: "from-sky-400 to-teal-500",
    icon: "🎨",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    prompt: "cyberpunk style, neon lights, futuristic cityscape, high tech, dystopian, synthwave colors, blade runner aesthetic",
    gradient: "from-cyan-400 to-fuchsia-600",
    icon: "🌆",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    prompt: "epic fantasy art, magical atmosphere, ethereal lighting, mythical creatures, enchanted world, concept art style",
    gradient: "from-violet-600 to-indigo-800",
    icon: "🧙",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    prompt: "minimalist design, clean lines, simple shapes, negative space, modern aesthetic, geometric",
    gradient: "from-gray-200 to-gray-400",
    icon: "◻️",
  },
  {
    id: "pop-art",
    name: "Pop Art",
    prompt: "pop art style, bold colors, Ben-Day dots, Andy Warhol inspired, comic book aesthetic, high contrast",
    gradient: "from-yellow-400 to-red-500",
    icon: "💥",
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    prompt: "pixel art, 16-bit style, retro gaming aesthetic, pixelated, nostalgic, sprite art",
    gradient: "from-green-500 to-emerald-700",
    icon: "👾",
  },
  {
    id: "3d-render",
    name: "3D Render",
    prompt: "3D render, Octane render, ray tracing, volumetric lighting, studio lighting, CGI quality, Blender style",
    gradient: "from-blue-500 to-purple-700",
    icon: "🎮",
  },
];

interface StylePresetsProps {
  selectedStyle: string;
  onSelectStyle: (style: StylePreset) => void;
}

const StylePresets = ({ selectedStyle, onSelectStyle }: StylePresetsProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-foreground font-medium">
        Choose a style
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {stylePresets.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style)}
            className={cn(
              "group relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300",
              "hover:scale-105 hover:shadow-lg",
              selectedStyle === style.id
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "hover:ring-1 hover:ring-border"
            )}
          >
            {/* Gradient Background */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl bg-gradient-to-br opacity-80 transition-opacity",
                style.gradient,
                selectedStyle === style.id ? "opacity-100" : "group-hover:opacity-90"
              )}
            />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <span className="text-2xl">{style.icon}</span>
              <span className="text-xs font-medium text-white drop-shadow-md text-center leading-tight">
                {style.name}
              </span>
            </div>

            {/* Selected Indicator */}
            {selectedStyle === style.id && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StylePresets;
