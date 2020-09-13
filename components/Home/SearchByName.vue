<template>
  <section class="py-5">
    <div class="container">
      <v-row class="pa-2 banner h-100">
        <v-col cols="12" md="6" class="flexBanner">
          <p class="bannerText">
            Connect with doctor any time
            <br />you need
          </p>
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            label="Search Doctor's"
            outlined
            shaped
            v-model="searchByName"
            v-on:input="callEvent"
          ></v-text-field>
          <v-card v-if="showPreviewList">
            <v-boilerplate class="mb-6" type="table-heading, list-item-two-line"></v-boilerplate>
            <v-list>
              <v-list-item
                class="item"
                @click="$router.push(`/${item._id}`)"
                v-for="item in previewList"
                :key="item._id"
              >
                <v-avatar size="40">
                  <img
                    @error="$event.target.src='https://api.cliniva.com.bd/resources/defaultDoctor.png'"
                    :src="`https://test.cliniva.com.bd/resources/doctorProfilePic/${item._id}.png`"
                    alt="item.name"
                  />
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <p class="caption">{{item.profile.speciality}}</p>
                </v-list-item-content>
                <p class="caption ma-2">Years Of Experience</p>
                <v-avatar color="primary" size="40">
                  <span class="white--text">{{item.experience}}</span>
                </v-avatar>
              </v-list-item>
            </v-list>
          </v-card>
          <div class="categoryList" v-if="!showPreviewList">
            <v-card
              shaped
              class="category"
              @click="openDialog(item)"
              v-for="item in categoryList"
              :key="item.name"
            >
              <div class="icon">
                <img :src="`https://api.cliniva.com.bd/resources/specialities/${item.english}.png`" />
              </div>
              <p class="ctitle">{{item.bengali}}</p>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-row justify="center">
      <v-dialog v-model="dialog" width="600px">
        <v-card>
          <v-progress-linear v-if="loader" indeterminate color="primary darken-2"></v-progress-linear>
          <p class="cardTitle">{{this.selectedSpeciality}}</p>

          <v-list v-if="specialityDoctorList.length>0">
            <v-list-item
              class="item"
              @click="$router.push(`/${item._id}`)"
              v-for="item in specialityDoctorList"
              :key="item._id"
            >
              <v-avatar size="40">
                <img
                  @error="$event.target.src='https://api.cliniva.com.bd/resources/defaultDoctor.png'"
                  :src="`https://test.cliniva.com.bd/resources/doctorProfilePic/${item._id}.png`"
                  alt="item.name"
                />
              </v-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <p class="caption">{{item.profile.speciality}}</p>
              </v-list-item-content>
              <p class="caption ma-2">Years Of Experience</p>
              <v-avatar color="primary" size="40">
                <span class="white--text">{{item.experience}}</span>
              </v-avatar>
            </v-list-item>
          </v-list>
          <p
            v-if="specialityDoctorList.length===0 && loader === false"
            class="text-center"
          >No Doctor Available</p>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </section>
</template>
<style lang="scss" scoped>
section {
  min-height: 85vh;
}
.v-list-item__content {
  padding: 12px;
}
.caption {
  margin: 0;
}
.cardTitle {
  background: #22acfe !important;
  color: white !important;
  padding: 1.5em;
}
.banner {
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  .flexBanner {
    display: flex;
    align-items: center;
  }
  .bannerText {
    color: #2aafff;
    font-weight: 500;
    font-size: 2em;
    font-family: cursive;
  }
  .categoryList {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    max-height: 20em;
  }
  .category {
    height: 7em;
    width: 6em;
    padding: 0.5em;
    margin: 0.3em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .icon {
      img {
        height: 2.5em;
      }
    }
    .ctitle {
      font-size: 0.65em;
      font-weight: bold;
      text-align: center;
      padding: 0;
      margin: 0;
    }
    :hover {
      cursor: pointer;
    }
  }
}
.v-list {
  max-height: 20em;
  overflow-y: scroll;
  margin: 0;
  padding: 0;
}
.item {
  border-bottom: 2px solid #22acfe;
  padding: 0 1em;
}
.item:hover {
  // background: #22acfe;
  // color: white;
  cursor: pointer;
}
</style>

<script>
export default {
  data: () => ({
    searchByName: null,
    previewList: [],
    showPreviewList: false,
    categoryList: [],
    selectedSpeciality: "",
    specialityDoctorList: [],
    loader: true,
    dialog: false
  }),
  created() {
    this.getCategoryList();
  },
  watch: {
    searchByName(value) {
      if (value == "") {
        this.showPreviewList = false;
        console.log(this.showPreviewList);
      }
    }
  },
  methods: {
    callEvent() {
      this.previewList = [];
      this.showPreviewList = false;
      fetch(
        "https://test.cliniva.com.bd/api/v1/search/doctor/" + this.searchByName
      )
        .then(res => res.json())
        .then(res => {
          this.previewList = res.data;
          if (this.previewList.length > 0) {
            this.showPreviewList = true;
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
    getCategoryList() {
      fetch("https://test.cliniva.com.bd/api/v1/doctor/specialities")
        .then(res => res.json())
        .then(res => {
          console.log(res);
          this.categoryList = res.data;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
    openDialog(item) {
      this.dialog = true;
      this.loader = true;
      this.specialityDoctorList = [];
      var lat = 23.8103;
      var lang = 90.4125;
      this.selectedSpeciality = item.bengali;

      fetch(
        `https://test.cliniva.com.bd/api/v1/search/doctor/speciality/${item.english}/${lat}/${lang}`
      )
        .then(res => res.json())
        .then(res => {
          setTimeout(() => {
            this.loader = false;
            this.specialityDoctorList = res.data;
          }, 3000);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>