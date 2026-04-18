import HeroTile from "@/components/home/HeroTile";
import { projects } from "@/content/projects";

export default function TileGrid() {
  const large = projects.filter((p) => p.gridSize === "large");
  const medium = projects.filter((p) => p.gridSize === "medium");
  const small = projects.filter((p) => p.gridSize === "small");

  return (
    <section
      style={{
        paddingLeft: "clamp(24px, 3.33vw, 48px)",
        paddingRight: "clamp(24px, 3.33vw, 48px)",
        paddingBottom: "160px",
        maxWidth: "1440px",
        margin: "0 auto",
      }}
    >
      {/* Row 1: two large tiles (7 + 5 col split) */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "7fr 5fr", marginBottom: "16px" }}
      >
        {large[0] && <HeroTile project={large[0]} index={0} />}
        {large[1] && <HeroTile project={large[1]} index={1} />}
      </div>

      {/* Row 2: two medium tiles (5 + 7 col split — reversed rhythm) */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "5fr 7fr", marginBottom: "16px" }}
      >
        {medium[0] && <HeroTile project={medium[0]} index={2} />}
        {medium[1] && <HeroTile project={medium[1]} index={3} />}
      </div>

      {/* Row 3: two small tiles + breathing room (4 + 4 + 4 col) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {small[0] && <HeroTile project={small[0]} index={4} />}
        {small[1] && <HeroTile project={small[1]} index={5} />}
      </div>
    </section>
  );
}
