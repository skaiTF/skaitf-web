// Lets TypeScript accept side-effect CSS imports like `import "./globals.css"`.
// Needed for TypeScript 6+ (e.g. VS Code's bundled version), which checks these imports by default.
declare module "*.css";
