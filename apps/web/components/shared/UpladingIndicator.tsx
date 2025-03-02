import { X } from "lucide-react";

export const UploadProgressIndicator = ({
  progress,
}: {
  progress?: number;
}) => (
  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 stroke-current"
          strokeWidth="8"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        />
        <circle
          className="text-primary stroke-current"
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * (progress || 0)) / 100}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
        {Math.round(progress || 0)}%
      </span>
    </div>
  </div>
);

export const RemoveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-1 right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
  >
    <X className="h-3 w-3 text-white" />
  </button>
);
