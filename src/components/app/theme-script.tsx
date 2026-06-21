export function ThemeScript() {
  const code = `
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const dark = stored ? stored === "dark" : prefersDark;
      document.documentElement.classList.toggle("dark", dark);
    } catch {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
