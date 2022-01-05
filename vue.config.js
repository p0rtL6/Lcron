module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Lcron",
        appId: "com.link.cron",
        directories: {
          buildResources: "build",
        },
        // files: ["build/**/*"],
        win: {
          target: "nsis",
          icon: "build/icon.png",
        },
        nsis: {
          installerIcon: "build/icon.ico",
          installerHeaderIcon: "build/icon.ico",
          deleteAppDataOnUninstall: true,
        },
      },
    },
  },
};
