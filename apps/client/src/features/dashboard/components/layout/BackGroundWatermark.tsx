export function BackgroundWatermark() {
  return (
    <img
      alt="Muscle Monster Guardian and Sentinel"
      className="fixed bottom-0 right-0 h-[480px] object-contain opacity-[0.06] md:opacity-[0.13] pointer-events-none z-0"
      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZQ9SwMUpKvDw3LqhzZUu2kADFSvnxGx9R8WPvb0okAat2htWpcPs3qMdHgsxUNwDZe6SWx7X7BXiZCqNejFqg1X6VflZL6H83k9vwg1Guf-hFAUN9rfKFdF3X8CtqgA1Q6LMyAjiYWMj1BaJ-ZNpP7C6eWJ-u2XhutySaxheJc26A0s_zSY7W0eygB4nABEnVtYgiC712PyhBc7bIlV5-t6UGw_DB_BowZUq4X6iPDB9XrIgLxQwJlZcQYAjtvYjS5TvdSkj1QBw2"
      style={{
        mixBlendMode: "screen",
        filter:
          "grayscale(100%) sepia(100%) hue-rotate(35deg) saturate(350%) brightness(0.65)",
      }}
    />
  );
}
