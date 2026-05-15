import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import { defineConfig } from "vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { buildEmailTheme } from "keycloakify-emails";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    keycloakify({
      accountThemeImplementation: "none",
      themeName: "shadcn",
      environmentVariables: [
        {
          name: "SHADCN_THEME_LOGO_WHITE_URL",
          default: "",
        },
        {
          name: "SHADCN_THEME_LOGO_DARK_URL",
          default: "",
        },
        { name: "SHADCN_THEME_APP_NAME", default: "Aviate Soft" },
        { name: "SHADCN_THEME_LAYOUT", default: "centered-card" },
        { name: "SHADCN_THEME_SIDE_IMAGE_URL", default: "" },
        { name: "SHADCN_THEME_PRESET", default: "blue" },
        { name: "SHADCN_THEME_BASE", default: "neutral" },
        { name: "SHADCN_THEME_RADIUS", default: "default" },
        { name: "SHADCN_THEME_FONT", default: "inter" },
        { name: "SHADCN_THEME_PLACEHOLDER", default: "true" },
      ],
      postBuild: async (buildContext) => {
        await buildEmailTheme({
          templatesSrcDirPath: path.join(
            buildContext.themeSrcDirPath,
            "email",
            "templates",
          ),
          i18nSourceFile: path.join(
            buildContext.themeSrcDirPath,
            "email",
            "i18n.ts",
          ),
          themeNames: buildContext.themeNames,
          keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
          locales: ["en"],
          cwd: import.meta.dirname,
          environmentVariables: buildContext.environmentVariables,
          esbuild: {}, // optional esbuild options
        });
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
