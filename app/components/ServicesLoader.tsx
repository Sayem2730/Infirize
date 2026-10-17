import Services from "./Services";
import { getServices } from "../lib/content";

const GLYPHS = ["</>", "{ }", "i.", "+", "/", "#", "&", "@"];

export default async function ServicesLoader() {
  const rows = await getServices();
  if (rows === null) return <Services />; // database unreachable: show the built-in cards
  if (rows.length === 0) return null; // you deleted them all
  const items = rows.map((r, i) => ({
    no: String(i + 1).padStart(2, "0"),
    title: r.title,
    text: r.text,
    glyph: GLYPHS[i % GLYPHS.length],
  }));
  return <Services items={items} />;
}
