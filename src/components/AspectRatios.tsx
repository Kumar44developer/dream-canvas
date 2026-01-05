import { Square, RectangleVertical, RectangleHorizontal, Monitor, Smartphone, Settings } from "lucide-react";

export interface AspectRatio {
  id: string;
  name: string;
  ratio: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

export const aspectRatios: AspectRatio[] = [
  { id: "square", name: "Square", ratio: "1:1", width: 1024, height: 1024, icon: <Square className="w-4 h-4" /> },
  { id: "portrait", name: "Portrait", ratio: "3:4", width: 768, height: 1024, icon: <RectangleVertical className="w-4 h-4" /> },
  { id: "landscape", name: "Landscape", ratio: "4:3", width: 1024, height: 768, icon: <RectangleHorizontal className="w-4 h-4" /> },
  { id: "widescreen", name: "Widescreen", ratio: "16:9", width: 1024, height: 576, icon: <Monitor className="w-4 h-4" /> },
  { id: "story", name: "Story", ratio: "9:16", width: 576, height: 1024, icon: <Smartphone className="w-4 h-4" /> },
  { id: "custom", name: "Custom", ratio: "Custom", width: 1024, height: 1024, icon: <Settings className="w-4 h-4" /> },
];

interface AspectRatiosProps {
  selectedRatio: string;
  onSelectRatio: (ratio: AspectRatio) => void;
}

const AspectRatios = ({ selectedRatio, onSelectRatio }: AspectRatiosProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <RectangleHorizontal className="w-4 h-4 text-primary" />
        Aspect Ratio
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.id}
            onClick={() => onSelectRatio(ratio)}
            className={`group relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-300
              ${
                selectedRatio === ratio.id
                  ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                  : "bg-muted/30 border-border/50 text-muted-foreground hover:bg-muted/50 hover:border-primary/30 hover:text-foreground"
              }`}
          >
            {/* Ratio Preview Box */}
            <div 
              className={`flex items-center justify-center transition-colors duration-300
                ${selectedRatio === ratio.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
            >
              {ratio.icon}
            </div>
            
            {/* Name */}
            <span className="text-xs font-medium truncate w-full text-center">
              {ratio.name}
            </span>
            
            {/* Ratio Label */}
            <span className={`text-[10px] transition-colors duration-300
              ${selectedRatio === ratio.id ? "text-primary/70" : "text-muted-foreground/60"}`}>
              {ratio.ratio}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatios;
