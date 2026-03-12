import { defineConfig, loadEnv } from "vite";
import vue2 from "@vitejs/plugin-vue2";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: env.VITE_BASE_URL || "/",
    plugins: [vue2()],
  };
});
