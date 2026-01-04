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
    gradient: "from-slate-700 to-slate-800",
    icon: "✨",
  },
  {
    id: "anime",
    name: "Anime",
    prompt: "anime style, vibrant colors, cel shading, manga inspired, Japanese animation aesthetic",
    gradient: "from-pink-500 to-rose-600",
    icon: "🎌",
  },
  {
    id: "photorealistic",
    name: "Photo",
    prompt: "photorealistic, ultra realistic, 8K UHD, DSLR quality, professional photography, hyperrealistic details",
    gradient: "from-zinc-500 to-zinc-700",
    icon: "📷",
  },
  {
    id: "oil-painting",
    name: "Oil Paint",
    prompt: "oil painting style, classical art, rich textures, brushstroke details, museum quality, Renaissance inspired",
    gradient: "from-amber-600 to-orange-800",
    icon: "🖼️",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    prompt: "watercolor painting, soft washes, delicate colors, artistic flow, paper texture, impressionistic",
    gradient: "from-cyan-400 to-teal-600",
    icon: "🎨",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    prompt: "cyberpunk style, neon lights, futuristic cityscape, high tech, dystopian, synthwave colors, blade runner aesthetic",
    gradient: "from-fuchsia-500 to-cyan-500",
    icon: "🌆",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    prompt: "epic fantasy art, magical atmosphere, ethereal lighting, mythical creatures, enchanted world, concept art style",
    gradient: "from-violet-500 to-purple-700",
    icon: "🧙",
  },
  {
    id: "minimalist",
    name: "Minimal",
    prompt: "minimalist design, clean lines, simple shapes, negative space, modern aesthetic, geometric",
    gradient: "from-gray-400 to-gray-600",
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
    gradient: "from-emerald-500 to-green-700",
    icon: "👾",
  },
  {
    id: "3d-render",
    name: "3D Render",
    prompt: "3D render, Octane render, ray tracing, volumetric lighting, studio lighting, CGI quality, Blender style",
    gradient: "from-blue-500 to-indigo-700",
    icon: "🎮",
  },
];

interface StylePresetsProps {
  selectedStyle: string;
  onSelectStyle: (style: StylePreset) => void;
}

const StylePresets = ({ selectedStyle, onSelectStyle }: StylePresetsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-foreground font-medium">
          Choose a style
        </label>
        {selectedStyle !== "none" && (
          <span className="text-xs text-muted-foreground">
            Selected: <span className="text-primary font-medium">{stylePresets.find(s => s.id === selectedStyle)?.name}</span>
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-3">
        {stylePresets.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelectStyle(style)}
            className={cn(
              "group relative aspect-square rounded-xl transition-all duration-200",
              "hover:scale-105 hover:-translate-y-0.5",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              selectedStyle === style.id
                ? "ring-2 ring-primary shadow-lg shadow-primary/25"
                : "hover:shadow-md"
            )}
          >
            {/* Gradient Background */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl bg-gradient-to-br transition-all duration-200",
                style.gradient,
                selectedStyle === style.id 
                  ? "opacity-100" 
                  : "opacity-75 group-hover:opacity-100"
              )}
            />
            
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/30 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-1.5">
              <span className="text-xl sm:text-2xl mb-1 drop-shadow-md">{style.icon}</span>
              <span className="text-[10px] sm:text-xs font-medium text-white drop-shadow-lg text-center leading-tight line-clamp-1">
                {style.name}
              </span>
            </div>

            {/* Selected Indicator */}
            {selectedStyle === style.id && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
