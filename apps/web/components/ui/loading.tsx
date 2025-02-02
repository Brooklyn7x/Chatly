import { Spinner } from "./spinner";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="w-8 h-8" />
    </div>
  );
};
