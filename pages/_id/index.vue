<template>
  <section>
    <div class="container">
      <v-card class="mx-auto pa-5" tile>
        <v-row align="center" class="fill-height">
          <v-col align-self="start" class="pl-6" cols="6">
            <v-avatar class="profile" color="grey" size="164" tile>
              <v-img :src="profileImage"></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="6">
            <tbody>
              <tr>
                <td>Speciality :</td>
                <td>
                  <v-chip
                    class="ma-2"
                    color="green"
                    text-color="white"
                  >{{doctorInfo.profile.speciality}}</v-chip>
                </td>
              </tr>
              <tr>
                <td>Cases Served :</td>
                <td>
                  <v-chip class="ma-2" color="green" text-color="white">{{doctorInfo.caseServed}}</v-chip>
                </td>
              </tr>
              <tr>
                <td>Years Of Experience :</td>
                <td>
                  <v-chip class="ma-2" color="green" text-color="white">{{doctorInfo.experience}}</v-chip>
                </td>
              </tr>
            </tbody>
          </v-col>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                <v-list-item-subtitle>{{doctorInfo.profile.professional}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{doctorInfo.profile.bio}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{doctorInfo.profile.academic}}</v-list-item-subtitle>
                <br />
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6"></v-col>
        </v-row>
        <hr />
        <v-row>
          <v-col cols="12">
            <p>Video Apppointment Time :</p>

            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">Date</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 2" step="2">Time Slot</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 3" step="3">Phone Verification</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 4" step="4">Book Appointment</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="5">Payment</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-row>
                    <v-col md="8">
                      <v-card class="mb-12 schedule">
                        <div
                          class="dateDiv"
                          @click="onSelectedDate(item.date)"
                          v-for="item in this.doctorInfo.schedules"
                          :key="item.date"
                          v-bind:class="{ isActive : item.date === selectedDate   }"
                        >{{item.date}}</div>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item-content>
                            <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{doctorInfo.profile.professional}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-btn color="primary" @click="e1 = 2">Continue</v-btn>

                  <v-btn text>Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-row>
                    <v-col md="8">
                      <v-card v-if="selectedDate != ''" class="mb-12">
                        <div class="scheduleTime">
                          <div
                            class="timeDiv"
                            v-for="item in filteredItems[0].slots"
                            :key="item"
                            @click="onSelectedTime(item)"
                            v-bind:class="{ isActiveTime : item === selectedTime   }"
                          >{{item}}</div>
                        </div>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item-content>
                            <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{doctorInfo.profile.professional}}</v-list-item-subtitle>
                          </v-list-item-content>
                          <v-list-item two-line>
                            <v-list-item-content>
                              <v-list-item-subtitle>Date</v-list-item-subtitle>
                              <v-list-item-title>{{this.selectedDate}}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-btn color="primary" @click="e1 = 3">Continue</v-btn>

                  <v-btn text>Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-row>
                    <v-col md="8">
                      <v-card class="mb-12">
                        <v-text-field label="Phone Number" v-model="userPhone" outlined></v-text-field>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item-content>
                            <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{doctorInfo.profile.professional}}</v-list-item-subtitle>
                          </v-list-item-content>

                          <v-list-item two-line>
                            <v-list-item-content>
                              <v-list-item-subtitle>Date</v-list-item-subtitle>
                              <v-list-item-title>{{this.selectedDate}}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>

                          <v-list-item two-line>
                            <v-list-item-content>
                              <v-list-item-subtitle>Time</v-list-item-subtitle>
                              <v-list-item-title>{{this.selectedTime}}</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-btn color="primary" @click="onPhoneVerification">Verify</v-btn>

                  <v-btn text>Cancel</v-btn>
                </v-stepper-content>
                <v-stepper-content step="4">
                  <v-row>
                    <v-col md="8">
                      <v-card class="mb-12">
                        <v-row>
                          <v-col md="6">
                            <v-text-field label="Name" v-model="userInfo.name" outlined></v-text-field>
                          </v-col>
                          <v-col md="6">
                            <v-text-field label="Email" v-model="userInfo.email" outlined></v-text-field>
                          </v-col>
                          <v-col md="6">
                            <v-menu
                              ref="menu"
                              v-model="menu"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="userInfo.dob"
                                  label="Date Of Birth"
                                  outlined
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                ref="picker"
                                v-model="userInfo.dob"
                                :max="new Date().toISOString().substr(0, 10)"
                                min="1950-01-01"
                                @change="save"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col md="6">
                            <v-select :items="items" v-model="userInfo.sex" label="Gender" outlined></v-select>
                          </v-col>
                          <v-col md="6">
                            <v-text-field label="Height" v-model="userInfo.height" outlined></v-text-field>
                          </v-col>
                          <v-col md="6">
                            <v-text-field label="Weight" v-model="userInfo.weight" outlined></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item-content>
                            <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{doctorInfo.profile.professional}}</v-list-item-subtitle>
                          </v-list-item-content>
                          <tbody>
                            <tr>
                              <td>Date :</td>
                              <td>
                                <v-chip
                                  class="ma-2"
                                  color="green"
                                  text-color="white"
                                >{{this.selectedDate}}</v-chip>
                              </td>

                              <td>Time :</td>
                              <td>
                                <v-chip
                                  class="ma-2"
                                  color="green"
                                  text-color="white"
                                >{{this.selectedTime}}</v-chip>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2">Patient Phone :</td>
                              <td colspan="2">
                                <v-chip
                                  class="ma-2"
                                  color="green"
                                  text-color="white"
                                >{{this.userPhone}}</v-chip>
                              </td>
                            </tr>
                          </tbody>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-btn color="primary" @click="bookAppointment">Continue</v-btn>

                  <v-btn text>Cancel</v-btn>
                </v-stepper-content>
                <v-stepper-content step="5">
                  <v-row>
                    <v-col md="8">
                      <v-simple-table>
                        <template v-slot:default>
                          <tbody>
                            <tr>
                              <td>Appointment Fee</td>
                              <td>{{doctorInfo.pricing.package1}}</td>
                            </tr>
                            <tr>
                              <td>Service Charge</td>
                              <td>0</td>
                            </tr>
                            <tr>
                              <td>
                                <a>Do you have Promocode ?</a>
                              </td>
                              <!-- <td>
                                <v-text-field
                                  label="Promo"
                                  outlined
                                  dense
                                ></v-text-field>
                              </td> -->
                            </tr>

                            <tr>
                              <td>
                                <b>Total</b>
                              </td>
                              <td>0</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
          <v-col cols="4">
            <p>
              Video Apppointment Fee :
              <v-chip class="ma-2" color="primary" text-color="white">1000+</v-chip>
            </p>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </section>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    isActive: false,
    selectedDate: "",
    selectedTime: "",
    userPhone: "",
    profileImage: "",
    e1: 1,

    phoneVerifiedData: {},

    menu: false,

    items: [
      {
        text: "Male",
        value: 0
      },
      {
        text: "Female",
        value: 1
      }
    ],

    userInfo: {
      name: "",
      dob: "",
      sex: 0,
      height: 0,
      weight: 0,
      email: ""
    },

    // doctorInfo: {},
    doctorInfo: {
      profile: {
        bio: "",
        professional: "",
        academic: "",
        expertise: [],
        speciality: ""
      },
      pricing: {
        package1: 0,
        package2: 0
      },
      caseServed: 0,
      experience: 0,
      name: "",
      schedules: [
        {
          date: "",
          slots: []
        }
      ],
      nearestChamber: {
        address: "",
        distance: 0
      }
    }
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  computed: {
    filteredItems() {
      return this.doctorInfo.schedules.filter(item => {
        if (item.date === this.selectedDate) {
          return item.slots;
        }
      });
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      console.log(this.$route.params.id);
      this.profileImage = `https://test.cliniva.com.bd/resources/doctorProfilePic/${this.$route.params.id}.jpg`;
      fetch(
        "https://test.cliniva.com.bd/api/v1/search/doctor/id/5e9f02f83c02370ae7ce2beb"
      )
        .then(res => res.json())
        .then(res => {
          this.doctorInfo = res.data;
          console.log(this.doctorInfo);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
    onSelectedDate(date) {
      this.selectedDate = date;
      console.log(date);
    },
    onSelectedTime(time) {
      this.selectedTime = time;
    },
    save(date) {
      this.$refs.menu.save(date);
      console.log(date);
    },
    bookAppointment() {
      console.log(this.userInfo);

      console.log(this.phoneVerifiedData[0].id);
      const payload = {
        _id: this.phoneVerifiedData[0].id,
        name: this.userInfo.name,
        dob: this.userInfo.dob,
        sex: this.userInfo.sex,
        height: this.userInfo.height,
        weight: this.userInfo.weight,
        email: this.userInfo.email
      };

      try {
        const response = this.$axios
          .$post(
            "https://test.cliniva.com.bd/api/v1/patientaccount/signup",
            payload
          )
          .then(response => {
            this.e1 = 5;
            console.log(response);
          });
      } catch (e) {}
    },
    async onPhoneVerification() {
      const payload = {
        phone: this.userPhone,
        location: {
          coordinates: [90.392232775, 24.746932779]
        }
      };

      try {
        await this.$axios
          .$post(
            "https://test.cliniva.com.bd/api/v1/patientaccount/signup/phone",
            payload
          )
          // .then(res => res.json())
          .then(res => {
            console.log(res);
            this.phoneVerifiedData = res.data;
            this.e1 = 4;
          });
      } catch (e) {}
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  // background-color: #10618c;
  // color: #ffffff;
}

.schedule {
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  min-height: 15em;
  .dateDiv {
    font-size: 1.5em;
    width: 8em;
    height: 5em;
    color: #22acfe;
    padding: 1em;
    text-align: center;
    border-radius: 6px;
    font-weight: bold;
    border: 2px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5em;
    &:hover {
      cursor: pointer;
    }
  }
  .isActive {
    background: #22acfe;
    color: white;
    border: none;
  }
}
.scheduleTime {
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  .timeDiv {
    font-size: 1em;
    width: 6em;
    height: 4em;
    color: #22acfe;
    padding: 0em;
    text-align: center;
    border-radius: 6px;
    font-weight: bold;
    border: 2px solid;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5em;
    &:hover {
      cursor: pointer;
    }
  }
  .isActiveTime {
    background: #22acfe;
    color: white;
    border: none;
  }
}

.cardTitle {
  padding: 1em;
  margin: 0;
  background: #22acfe;
  color: white;
  font-size: large;
  font-weight: bold;
}
.v-list-item__subtitle {
  white-space: pre-wrap;
}
</style>