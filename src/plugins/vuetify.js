import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);
const color = window.electron.color();

export default new Vuetify({
    theme: {
        dark: true,
        themes: { dark: { primary: `#${color.substr(0, 6)}` } },
    },
});
