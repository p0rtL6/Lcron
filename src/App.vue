<template>
    <v-app class="app">
        <v-app-bar app class="navbar primary">
            <v-btn icon large @click="navigate('Dashboard')" to="/">
                <v-icon>mdi-view-dashboard</v-icon>
            </v-btn>
            <v-btn
                icon
                large
                disabled
                @click="navigate('Settings')"
                to="/settings"
                class="mx-2"
            >
                <v-icon>mdi-cog</v-icon>
            </v-btn>
            <v-app-bar-title>{{ page }}</v-app-bar-title>

            <v-spacer></v-spacer>

            <v-btn icon large @click="close">
                <v-icon>mdi-close-thick</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main class="main">
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            page: "Dashboard",
        };
    },
    methods: {
        navigate(name) {
            this.page = name;
        },
        close() {
            window.electron.closeButton();
        },
    },
};
</script>

<style>
.main {
    /* margin-top: 56px;
    padding: 0 !important;
    max-height: 544px; */
    max-height: 600px;
    overflow-y: auto;
}

.navbar {
    border-radius: 10px 10px 0 0 !important;
}

.app {
    border-radius: 10px;
    user-select: none;
    -webkit-user-select: none;
}

*::-webkit-scrollbar {
    width: 0;
    height: 0;
}
/* *::-webkit-scrollbar-thumb {
    background: #263238;
    border-radius: 10px;
}
*::-webkit-scrollbar-thumb:hover {
    background: #37474f;
}
*::-webkit-scrollbar-track {
    background: transparent;
} */
</style>
