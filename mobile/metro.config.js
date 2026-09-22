const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Fix: lucide-react-native@1.47.0 has a broken `exports` field that maps the
// "react-native" / "import" / "browser" conditions to a non-existent
// dist/esm/*.mjs file. Metro picks those conditions and fails.
//
// Rather than disabling package-exports resolution globally (which breaks
// better-auth subpath imports like "better-auth/react"), we intercept only
// lucide-react-native requests and redirect them straight to the working CJS
// entry, bypassing the broken exports map entirely.
const lucideRoot = path.resolve(
  __dirname,
  "node_modules/lucide-react-native",
);

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "lucide-react-native") {
    return {
      filePath: path.join(lucideRoot, "dist/cjs/lucide-react-native.js"),
      type: "sourceFile",
    };
  }
  // Delegate everything else to the default resolver (preserves exports for
  // better-auth, @better-auth/expo, etc.)
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
