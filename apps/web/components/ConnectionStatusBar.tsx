interface ConnectionStatusBarProps {
  status: any;
}

export default function ConnectionStatusBar({
  status,
}: ConnectionStatusBarProps) {
  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 h-1 transition-all duration-300 z-50 ${
          status.showConnectionAlert ? `bg-${status.color}-500` : "opacity-0"
        }`}
      />
      <div
        className={`fixed top-1 left-0 right-0 text-center text-sm py-1 transition-all duration-300 ${
          status.showConnectionAlert
            ? `text-${status.color}-500 opacity-100`
            : "opacity-0"
        }`}
      >
        {status.message}
      </div>
    </>
  );
}
