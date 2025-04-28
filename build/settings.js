import esbuildPluginTsc from "esbuild-plugin-tsc";

export function createBuildSettings(options) {
  return {
    platform: 'browser', // or 'node' if it's for backend
    target: ['ES6'], // or your desired target
    entryPoints: ["src/main.ts"],

    outfile: "dist/main.js",
    bundle: true,
    sourcemap: false,
    logLevel: 'info',
    plugins: [
      esbuildPluginTsc({
        force: true,
      }),
    ],
    ...options,
  };
}
