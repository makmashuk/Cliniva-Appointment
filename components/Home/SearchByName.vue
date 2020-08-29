<template>
  <section>
    <v-img :aspect-ratio="16/9" :max-height="600" :src="require(`@/assets/img/banner.jpg`)">
      <v-row class="lightbox white--text pa-2 fill-height banner">
        <v-col offset-md="1" md="4">
          <p class="headline">
            Connect with doctor any time
            <br />you need
          </p>
        </v-col>
        <v-col offset-md="1" md="4">
          <v-text-field
            label="Search Doctor's"
            single-line
            solo
            v-model="searchByName"
            v-on:input="callEvent"
          ></v-text-field>
          <v-card v-if="showPreviewList">
            <v-list>
              <v-list-item class="item" @click="$router.push(`/${item._id}`)" v-for="item in previewList" :key="item._id">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <p class="caption">{{item.profile.speciality}}</p>
                </v-list-item-content>
                <p class="caption ma-2">Years Of Experience</p>
                <v-avatar color="indigo" size="40">
                  <span class="white--text">{{item.experience}}</span>
                </v-avatar>
              </v-list-item>
            </v-list>
          </v-card>
          <div class="categoryList" v-if="!showPreviewList">
            <v-card shaped class="category" v-for="item in categoryList" :key="item.name">
              <div class="icon">
                <img :src="require(`@/assets/img/${item.icon}`)" alt />
              </div>
              <p class="ctitle">{{item.name}}</p>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </section>
</template>
<style lang="scss" scoped>
.banner {
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  margin-top: 7em;
  .headline {
    margin-top: 30%;
    color: black;
    font-weight: 500;
  }
  .categoryList {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    max-height: 20em;
  }
  .category {
    height: 6.5em;
    width: 6em;
    padding: 0.75em;
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
      font-size: small;
      font-weight: bold;
    }
    :hover {
      cursor: pointer;
    }
  }
}
/* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(154, 163, 212);
}
.v-list {
  max-height: 20em;
  overflow-y: scroll;
}
.item {
  border-bottom: 1px solid rgb(154, 163, 212);
  padding: 0 1em;
}
.item:hover {
  background: rgb(154, 163, 212);
  cursor: pointer;
}
</style>

<script>
export default {
  data: () => ({
    searchByName: null,
    previewList: [],
    showPreviewList: false,
    categoryList: [
      {
        name: "Cardiologist",
        icon: "icon1.png"
      }
     
    
    ]
  }),
  watch: {
    searchByName(value){
     if(value==""){
       this.showPreviewList=false;
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
          // this.showPreviewList=false;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>