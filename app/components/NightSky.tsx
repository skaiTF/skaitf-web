/* Fixed starfield and crescent moon behind every page. Styles live in globals.css (.night-sky). */
export default function NightSky() {
  return (
    <div className="night-sky pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        className="absolute top-[16%] right-[14%] h-12 w-12 md:h-16 md:w-16"
        style={{ filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.35))" }}
      >
        <defs>
          <mask id="crescent">
            <rect width="100" height="100" fill="white" />
            <circle cx="36" cy="40" r="40" fill="black" />
          </mask>
        </defs>
        <circle cx="50" cy="50" r="40" fill="#f4f1ff" mask="url(#crescent)" />
      </svg>
    </div>
  );
}
