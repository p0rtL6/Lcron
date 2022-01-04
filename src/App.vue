<template>
    <v-app>
        <!-- <v-app-bar app color="primary" dark dense> </v-app-bar> -->
        <v-navigation-drawer
            mini-variant
            app
            permanent
            class="light-blue darken-3"
        >
            <v-list dense>
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content> </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-cog</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content> </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-icon>
                        <v-icon>mdi-close-thick</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content> </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",
};
</script>
