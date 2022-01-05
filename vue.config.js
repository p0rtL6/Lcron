module.exports = {
    transpileDependencies: ["vuetify"],
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                squirrelWindows: {
                    iconUrl:
                        "https://github.com/p0rtL6/Lcron/blob/master/build/icon.ico?raw=true",
                    remoteReleases: true,
                },
            },
        },
    },
};
