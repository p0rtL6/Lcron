<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          @click:prepend="dataPathDialog"
          label="Data Folder"
          v-model="dataPath"
          clearable
          prepend-icon="mdi-folder-open"
          append-icon="mdi-restore"
          @click:append="resetDataPath"
          @change="setPath"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-dialog v-model="dialog" persistent max-width="290">
          <template v-slot:activator="{ attrs }">
            <v-file-input
              v-bind="attrs"
              @click:append="dialog = true"
              :append-icon="importFile ? 'mdi-upload' : null"
              v-model="importFile"
              accept=".json"
              label="Import Jobs"
            ></v-file-input>
          </template>
          <v-card>
            <v-card-title class="text-h5"> Import Jobs? </v-card-title>
            <v-card-text>This action will override existing jobs.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="dialog = false"> Cancel </v-btn>
              <v-btn color="green" text @click="handleImport"> Ok </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-btn
      color="primary"
      fab
      class="mx-4 my-4"
      dark
      fixed
      right
      bottom
      @click="shareDialog"
    >
      <v-icon dark> mdi-share </v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dataPath: window.storageApi.getCurrentPath(),
      importFile: null,
      dialog: false,
    };
  },
  methods: {
    async dataPathDialog() {
      const dataPath = await window.storageApi.showDialog();
      if (dataPath) this.dataPath = dataPath;
      this.setPath();
    },
    resetDataPath() {
      this.dataPath = window.storageApi.getDefaultPath();
      this.setPath();
    },
    setPath() {
      if (this.dataPath) window.storageApi.setPath(this.dataPath);
    },
    handleImport() {
      this.dialog = false;
      if (!this.importFile) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        window.storageApi.importFile(JSON.parse(evt.target.result));
      };
      reader.readAsText(this.importFile);
      this.importFile = null;
    },
    shareDialog() {
      window.storageApi.shareDialog();
    },
  },
  name: "Settings",
};
</script>
