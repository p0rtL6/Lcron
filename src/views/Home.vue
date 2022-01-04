<template>
    <v-container>
        <v-row no-gutters>
            <v-col><h1 class="text-h2 font-weight-bold">Dashboard</h1></v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-row v-for="job in jobs" v-bind:key="job.id"
            ><v-col>
                <v-card class="mx-auto" max-width="344">
                    <v-card-text>
                        <div>{{ job.link }}</div>
                        <p class="text-h4 text--primary">{{ job.title }}</p>
                        <p>Every {{ job.weekday.join(", ") }}</p>
                        <div class="text--primary">
                            {{ tConvert(job.time) }}
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="primary"> Edit </v-btn>
                        <v-btn
                            @click="
                                jobs = jobs.filter(
                                    jobQuery => !job.id == jobQuery.id
                                )
                            "
                            text
                            color="red"
                        >
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col></v-row
        >
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            fab
                            class="mx-4 my-4"
                            dark
                            fixed
                            right
                            bottom
                            v-bind="attrs"
                            v-on="on"
                        >
                            <v-icon dark> mdi-plus </v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Add Job</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            label="Title"
                                            v-model="title"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field
                                            label="Link"
                                            v-model="link"
                                            required
                                        ></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <v-autocomplete
                                            :items="items"
                                            label="Weekday"
                                            v-model="weekday"
                                            multiple
                                        ></v-autocomplete>
                                    </v-col>

                                    <v-col cols="12" sm="6"
                                        ><v-dialog
                                            ref="dialog"
                                            v-model="modal2"
                                            :return-value.sync="time"
                                            persistent
                                            width="290px"
                                        >
                                            <template
                                                v-slot:activator="{ on, attrs }"
                                            >
                                                <v-text-field
                                                    v-model="time"
                                                    label="Time"
                                                    prepend-icon="mdi-clock-time-four-outline"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-time-picker
                                                v-if="modal2"
                                                v-model="time"
                                                full-width
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    @click="modal2 = false"
                                                >
                                                    Cancel
                                                </v-btn>
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    @click="
                                                        $refs.dialog.save(time)
                                                    "
                                                >
                                                    OK
                                                </v-btn>
                                            </v-time-picker>
                                        </v-dialog>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="cancel">
                                Cancel
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="validate">
                                Add
                            </v-btn>
                        </v-card-actions>
                        <v-snackbar v-model="snackbar">
                            All Inputs Are Required

                            <template v-slot:action="{ attrs }">
                                <v-btn
                                    color="red"
                                    text
                                    v-bind="attrs"
                                    @click="snackbar = false"
                                >
                                    Close
                                </v-btn>
                            </template>
                        </v-snackbar>
                    </v-card>
                </v-dialog>
            </v-row>
        </template>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            jobs: [],
            link: null,
            time: null,
            menu2: false,
            modal2: false,
            weekday: null,
            title: null,
            snackbar: false,
            items: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            dialog: false,
        };
    },
    methods: {
        cancel() {
            this.clearInput();
            this.dialog = false;
        },
        validate() {
            if (
                this.time != null &&
                this.weekday != null &&
                this.title != null &&
                this.link != null
            ) {
                this.dialog = false;
                this.handleJob(this.title, this.weekday, this.time, this.link);
            } else {
                this.snackbar = true;
            }
        },
        handleJob(title, weekday, time, link) {
            this.jobs.push({
                title: title,
                weekday: weekday,
                time: time,
                link: link,
                id: this.jobs.length,
            });
            this.clearInput();
        },
        clearInput() {
            this.title = null;
            this.weekday = null;
            this.time = null;
            this.link = null;
        },
        tConvert(time) {
            // Check correct time format and split into components
            time = time
                .toString()
                .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

            if (time.length > 1) {
                // If time format correct
                time = time.slice(1); // Remove full string match value
                time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
                time[0] = +time[0] % 12 || 12; // Adjust hours
            }
            return time.join(""); // return adjusted time or original string
        },
    },
    name: "Home",
};
</script>
