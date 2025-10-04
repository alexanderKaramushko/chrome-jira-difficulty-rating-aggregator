import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: ["src/content.ts", "src/service-worker.ts"],
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [nodeResolve({ preferBuiltins: false }), typescript()],
};
