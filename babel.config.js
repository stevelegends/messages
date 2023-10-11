module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "@screens": "./src/screens",
                        "@components": "./src/components",
                        "@atoms": "./src/components/atoms",
                        "@molecules": "./src/components/molecules",
                        "@organisms": "./src/components/organisms",
                        "@page": "./src/components/page",
                        "@templates": "./src/components/templates",
                        "@utils": "./src/utils",
                        "@contexts": "./src/contexts",
                        "@config": "./src/config",
                        "@constants": "./src/constants",
                        "@hoc": "./src/hoc",
                        "@hooks": "./src/hooks",
                        "@navigation": "./src/navigation",
                        "@services": "./src/services",
                        "@theme": "./src/theme",
                        "@store": "./src/store",
                        "@assets": "./assets"
                    }
                }
            ],
            "react-native-reanimated/plugin",
            "macros"
        ]
    };
};
