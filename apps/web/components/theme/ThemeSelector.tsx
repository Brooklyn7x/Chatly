// // components/theme-selector.tsx
// "use client";

// import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
// import { cn } from "@/lib/utils";
// // import { useTheme } from "../provider/ThemeProvider";

// interface ThemeOption {
//   name: string;
//   value: string;
//   color: string;
// }

// export function ThemeSelector() {
//   // const { themeColor, setThemeColor } = useTheme();

//   const themeOptions: ThemeOption[] = [
//     {
//       name: "Default",
//       value: "default",
//       color: "bg-slate-900 dark:bg-slate-100",
//     },
//     { name: "Blue", value: "blue", color: "bg-blue-600" },
//     { name: "Green", value: "green", color: "bg-green-600" },
//     { name: "Purple", value: "purple", color: "bg-purple-600" },
//     { name: "Orange", value: "orange", color: "bg-orange-600" },
//     { name: "Pink", value: "pink", color: "bg-pink-600" },
//   ];

//   return (
//     <div className="flex flex-col space-y-4">
//       <h3 className="text-lg font-medium">Theme Colors</h3>
//       <div className="grid grid-cols-3 gap-2">
//         {themeOptions.map((option) => (
//           <Button
//             key={option.value}
//             variant="outline"
//             className={cn(
//               "relative h-8 w-full justify-start rounded-md p-0 overflow-hidden",
//               themeColor === option.value && "border-2 border-primary"
//             )}
//             onClick={() => setThemeColor(option.value as any)}
//           >
//             <span
//               className={cn(
//                 "absolute inset-0 flex items-center justify-center",
//                 themeColor === option.value ? "opacity-100" : "opacity-0"
//               )}
//             >
//               <Check className="h-4 w-4 text-primary" />
//             </span>

//             <div className="flex items-center gap-2 px-2">
//               <div className={cn("h-4 w-4 rounded-full", option.color)} />
//               <span className="text-xs">{option.name}</span>
//             </div>
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }
