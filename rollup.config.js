import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default {
  input: ["src/content.ts", "src/service-worker.ts", "src/popup/popup.tsx"],
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
  ],
};
