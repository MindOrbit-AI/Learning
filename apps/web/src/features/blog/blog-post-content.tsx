import type { BlogSection } from "./types";

export function BlogPostContent({ sections }: { sections: readonly BlogSection[] }) {
  return (
    <div className="space-y-6 text-base font-semibold leading-relaxed text-muted-foreground sm:text-lg [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-extrabold [&_h3]:tracking-tight [&_h3]:text-foreground [&_li]:flex [&_li]:gap-3 [&_ul]:mt-4 [&_ul]:space-y-3">
      {sections.map((section, index) => {
        switch (section.type) {
          case "paragraph":
            return <p key={index}>{section.text}</p>;
          case "heading":
            if (section.level === 2) {
              return <h2 key={index}>{section.text}</h2>;
            }
            return <h3 key={index}>{section.text}</h3>;
          case "list":
            return (
              <ul key={index}>
                {section.items.map((item) => (
                  <li key={item}>
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
