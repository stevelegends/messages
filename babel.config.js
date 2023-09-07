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
                        "@utils": "./src/utils",
                        "@contexts": "./src/contexts",
                        "@config": "./src/config",
                        "@constants": "./src/constants",
                        "@hoc": "./src/hoc",
                        "@hooks": "./src/hooks",
                        "@assets": "./assets"
                    }
                }
            ]
        ]
    };
};
