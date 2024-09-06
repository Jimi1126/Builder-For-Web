const componentFiles = import.meta.glob(`./*/*.vue`, {
  import: "componentInfo",
  eager: true,
});

const modules: any = {};

for (const path in componentFiles) {
  const match = path.match(/\/(.*)\//);
  if (!match || match.length < 2) break;
  const dirname = match[1];
  modules[dirname] = modules[dirname] || [];
  modules[dirname].push(componentFiles[path]);
}

export const componentInfos = modules;
