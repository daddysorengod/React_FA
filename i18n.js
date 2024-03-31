const hoistNonReactStatics = require("hoist-non-react-statics");

module.exports = {
  locales: ["default", "vn"],
  defaultLocale: "default",
  loader: false, // This deactivate the webpack loader that loads the namespaces
  pages: {
    "*": ["common"],
  },
  loadLocaleFrom: (locale, namespace) =>
    import(`./locales/${locale}/${namespace}`).then(m => m.default),
};
