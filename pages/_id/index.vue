<template>
  <section>
    <v-card outlined class="mx-auto pa-5 profile">
      <div class="container">
        <v-row class="fill-height">
          <v-col class="d-flex flex-column flex-md-row" cols="12" md="6">
            <v-avatar class="profile" size="164">
              <img
                @error="$event.target.src='https://api.cliniva.com.bd/resources/defaultDoctor.png'"
                :src="`https://test.cliniva.com.bd/resources/doctorProfilePic/${this.$route.params.id}.jpg`"
                alt="item.name"
              />
            </v-avatar>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                <v-list-item-subtitle class=" white--text">{{doctorInfo.profile.speciality}}</v-list-item-subtitle>
                <v-list-item-subtitle class="mt-3 white--text">{{doctorInfo.profile.professional}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right" style="border-left: 1px solid gray;">
            <v-list-item  class="pl-0">
              <v-list-item-content>
                <v-list-item-subtitle class=" white--text">
                  <strong class="greenText">{{doctorInfo.experience}}</strong> Years Of Experience
                </v-list-item-subtitle>
                <v-list-item-subtitle class=" white--text">
                  <strong class="greenText">{{doctorInfo.caseServed}}</strong> Cases Served
                </v-list-item-subtitle>
                <v-list-item-subtitle class=" white--text">
                  <i>{{doctorInfo.profile.bio}}</i>
                </v-list-item-subtitle>
                <v-list-item-subtitle class=" white--text">
                  <i>{{doctorInfo.profile.academic}}</i>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </div>
    </v-card>
    <div class="container">
      <p class="font-weight-bold px-5">Video Appointment Booking</p>
      <v-row>
        <v-col
          cols="12"
          md="3"
          class="timeSchedule"
          v-for="(item,i) in doctorInfo.schedules"
          :key="i"
        >
          <div class="datediv" @click="expandTimeSlot(i)">{{ moment(item.date).format("dd, MMM Do")}}</div>
          <div class="scroll" v-if=" i === showTime">
            <div
              class="timediv"
              @click="onAppointmentModal(item.date,time)"
              v-for="(time,i) in item.slots"
              :key="i"
            >{{time}}</div>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-row justify="center">
      <v-dialog
        v-model="appointmentModal"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <div class="container">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Patient Information</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="appointmentModal = false">
                  <v-icon>mdi-close</v-icon>Close
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-row class="flex-column-reverse flex-md-row">
              <v-col md="6">
                <v-card v-if="!showPaymentPanel" class="pa-5" outlined>
                  <v-row>
                    <v-col>
                      <v-text-field label="Fitst Name" v-model="userInfo.fname" outlined></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field label="Last Name" v-model="userInfo.lname" outlined></v-text-field>
                    </v-col>
                  </v-row>
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
                        append-icon="event"
                        solo
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

                  <v-row>
                    <v-col>
                      <vue-tel-input class="telInput" defaultCountry="BD" v-model="userInfo.phone"></vue-tel-input>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div>
                        <v-chip :class="userInfo.sex === 0 ? 'activeGender mr-2':'mr-2' " @click="selectGender(0)">
                          Male
                        </v-chip>
                        <v-chip :class="userInfo.sex === 1 ? 'activeGender mr-2':'mr-2' " @click="selectGender(1)">
                          Female
                        </v-chip>
                        <v-chip :class="userInfo.sex === 2 ? 'activeGender mr-2':'mr-2' " @click="selectGender(2)">
                          Other
                        </v-chip>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col md="12">
                      <!-- <v-select :items="items" v-model="userInfo.sex" label="Gender" solo></v-select> -->

                      <v-text-field
                        :append-icon="password ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="password ? 'text' : 'password'"
                        outlined
                        label="Password"
                        hint="At least 6 characters"
                        v-model="userInfo.password"
                        class="input-group--focused"
                        @click:append="password = !password"
                      ></v-text-field>
                    </v-col>
                    <!-- <v-col md="6">
                      <v-text-field
                        label="Weight"
                        suffix="kg"
                        number
                        v-model="userInfo.weight"
                        outlined
                      ></v-text-field>
                    </v-col>-->
                  </v-row>
                  <!-- <v-row>
                    <v-col md="6">
                      <v-select
                        outlined
                        :items="feet"
                        v-model="userInfo.feet"
                        suffix="feet"
                        label="height"
                      ></v-select>
                    </v-col>
                    <v-col md="6">
                      <v-select outlined :items="inch" v-model="userInfo.inch" suffix="inch"></v-select>
                    </v-col>
                  </v-row>-->

                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      :loading="loadingConfirmAppointment"
                      :disabled="loadingConfirmAppointment"
                      block
                      @click="confirmAppointment"
                    >Confirm Patient Info</v-btn>
                  </v-card-actions>
                </v-card>

                <v-card v-if="showPaymentPanel">
                  <p class="cardTitle">Payment</p>
                  <table>
                    <tbody>
                      <tr>
                        <td>Appointment Fee</td>
                        <td>{{doctorInfo.pricing.package1}}</td>
                      </tr>
                      <tr>
                        <td>Service Charge</td>
                        <td>0</td>
                      </tr>

                      <tr v-if="promoAdded">
                        <td>
                          <v-chip
                            class="ma-2"
                            color="green"
                            text-color="white"
                          >PROMOCODE : {{this.validPromoCode}}</v-chip>
                        </td>
                        <td>{{this.discount}}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Total</b>
                        </td>
                        <td>{{parseInt(doctorInfo.pricing.package1) - parseInt(this.discount) }}</td>
                      </tr>
                      <tr>
                        <td>
                          <a>Do you have Promocode ?</a>
                          <v-switch v-model="promoSwitch" :label=" promoSwitch? 'Yes' : 'No' "></v-switch>
                        </td>
                        <td v-if="promoSwitch">
                          <v-text-field v-model="promoEntry" label="Type Promocode here" solo dense></v-text-field>
                          <v-btn color="primary" @click="checkPromo" block>Add</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-btn
                      color="primary"
                      :loading="loadingAppointmentCreate"
                      :disabled="loadingAppointmentCreate"
                      @click="appointmentCreate"
                    >Book Appointment</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col md="4" offset-md="2">
                <v-card class="appointmentInfo w-100">
                  <p class="cardTitle text-md-right h1">Appointment Info</p>

                  <div class="pa-3 text-md-right">
                    <v-list-item class="pl-0">
                      <v-list-item-content>
                        <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                        <v-list-item-title>Video Apppointment Fee : {{doctorInfo.pricing.package1}}</v-list-item-title>
                        <br />
                        <v-divider></v-divider>
                        <br />
                        <v-list-item-title>
                          <v-icon>event</v-icon>
                          {{ moment(selectedDate).format("dddd, MMMM Do YYYY")}}
                        </v-list-item-title>
                        <v-list-item-title>
                          <v-icon>schedule</v-icon>
                          {{ this.selectedTime }}
                        </v-list-item-title>

                        <!-- <v-list-item-title v-if="showPaymentPanel">
                          {{bookedAppointmentData.name}}
                          <v-icon>account_circle</v-icon>
                        </v-list-item-title> -->
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- <div>
        <v-row>
          <v-col cols="12">
            <v-stepper v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">তারিখ</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 2" step="2">সময়সূচি</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 3" step="3">ফোন নম্বর</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="e1 > 4" step="4">রোগীর তথ্য</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="5">পেমেন্ট</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-row>
                    <v-col md="8">
                      <v-card outlined>
                        <div class="content">
                          <p class="cardTitle">Select Appointment Date</p>
                          <div class="selectedContainer">
                            <div
                              class="selectedItem"
                              @click="onSelectedDate(item.date)"
                              v-for="(item,i) in this.doctorInfo.schedules"
                              :key="i"
                              v-bind:class="{ isActive : item.date === selectedDate   }"
                            >{{ moment(item.date).format("dddd, MMMM Do YYYY")}}</div>
                          </div>
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn text @click="e1 = 1">Cancel</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card outlined class="appointmentInfo">
                        <p class="cardTitle">
                          <v-icon>calendar-check</v-icon>Appointment Info
                        </p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item class="pl-0">
                            <v-list-item-content>
                              <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                              <v-list-item-subtitle>Video Apppointment Fee : {{doctorInfo.pricing.package1}}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-row>
                    <v-col md="8">
                      <v-card v-if="selectedDate != ''" class="mb-12">
                        <div class="content">
                          <p class="cardTitle">Select Appointment Time</p>
                          <div class="selectedContainer">
                            <div
                              class="selectedItem"
                              v-for="(item,i) in filteredItems[0].slots"
                              :key="i"
                              @click="onSelectedTime(item)"
                              v-bind:class="{ isActiveTime : item === selectedTime   }"
                            >{{item}}</div>
                          </div>
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn text>Cancel</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <v-divider></v-divider>
                        <div class="pa-3">
                          <v-list-item class="pl-0">
                            <v-list-item-content>
                              <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                              <v-list-item-subtitle>Video Apppointment Fee : {{doctorInfo.pricing.package1}}</v-list-item-subtitle>
                              <br />
                              <v-divider></v-divider>
                              <br />
                              <v-list-item-subtitle>Date : {{ moment(selectedDate).format("dddd, MMMM Do YYYY")}}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-row>
                    <v-col md="8">
                      <v-card>
                        <div class="content">
                          <p class="cardTitle">Verify Phone Number</p>
                          <div class="py-3">
                            <v-text-field
                              prefix="+880"
                              label="Phone Number"
                              v-model="userPhone"
                              outlined
                            ></v-text-field>
                          </div>
                        </div>
                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-btn
                            :loading="loadingVerifyPhone"
                            :disabled="loadingVerifyPhone"
                            color="primary"
                            class="white--text"
                            @click="onPhoneVerification"
                          >Verify Phone</v-btn>
                          <v-btn text>Cancel</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item class="pl-0">
                            <v-list-item-content>
                              <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                              <v-list-item-subtitle>Video Apppointment Fee : {{doctorInfo.pricing.package1}}</v-list-item-subtitle>
                              <br />
                              <v-divider></v-divider>
                              <br />
                              <v-list-item-subtitle>Date : {{ moment(selectedDate).format("dddd, MMMM Do YYYY")}}</v-list-item-subtitle>
                              <v-list-item-subtitle>Time : {{ this.selectedTime }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content step="4">
                  <v-row>
                    <v-col md="8">
                      <v-card>
                        <div class="content">
                          <p class="cardTitle">{{ switch1?'Create appointment with new patient':'Select Patient Name'}}</p>
                          <v-switch
                            v-model="switch1"
                            label="Create appointment with new patient'"
                          ></v-switch>

                          <v-row v-if="this.switch1">
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
                              <v-select
                                :items="items"
                                v-model="userInfo.sex"
                                label="Gender"
                                outlined
                              ></v-select>
                            </v-col>
                            <v-col md="6">
                              <v-text-field
                                label="Height"
                                suffix="cm"
                                v-model="userInfo.height"
                                outlined
                              ></v-text-field>
                            </v-col>
                            <v-col md="6">
                              <v-text-field
                                label="Weight"
                                suffix="kg"
                                v-model="userInfo.weight"
                                outlined
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <div v-if="!this.switch1" class="selectedContainer">
                            <div
                              class="selectedItem"
                              v-for="item in this.existingAccountList"
                              :key="item.id"
                              @click="onSelectedPatient(item)"
                              v-bind:class="{ isActive : item === selectedPatient   }"
                            >{{item.name}}</div>
                          </div>
                        </div>
                        <v-divider></v-divider>
                        <v-card-actions>
                          <v-btn color="primary" @click="confirmPatient">Confirm Patient</v-btn>
                          <v-btn text>Cancel</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item class="pl-0">
                            <v-list-item-content>
                              <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                              <v-list-item-subtitle>Video Apppointment Fee : {{doctorInfo.pricing.package1}}</v-list-item-subtitle>
                              <br />
                              <v-divider></v-divider>
                              <br />
                              <v-list-item-subtitle>Date : {{ moment(selectedDate).format("dddd, MMMM Do YYYY")}}</v-list-item-subtitle>
                              <v-list-item-subtitle>Time : {{ this.selectedTime }}</v-list-item-subtitle>
                              <v-list-item-subtitle>Contact : {{ this.userPhone }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content step="5">
                  <v-row>
                    <v-col md="8">
                      <v-card>
                        <div class="content">
                          <p class="cardTitle">Payment</p>
                          <table>
                            <tbody>
                              <tr>
                                <td>Appointment Fee</td>
                                <td>{{doctorInfo.pricing.package1}}</td>
                              </tr>
                              <tr>
                                <td>Service Charge</td>
                                <td>0</td>
                              </tr>

                              <tr v-if="promoAdded">
                                <td>
                                  <v-chip
                                    class="ma-2"
                                    color="green"
                                    text-color="white"
                                  >PROMOCODE : {{this.validPromoCode}}</v-chip>
                                </td>
                                <td>{{this.discount}}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Total</b>
                                </td>
                                <td>{{parseInt(doctorInfo.pricing.package1) - parseInt(this.discount) }}</td>
                              </tr>
                              <tr>
                                <td>
                                  <a>Do you have Promocode ?</a>
                                  <v-switch
                                    v-model="promoSwitch"
                                    :label=" promoSwitch? 'Yes' : 'No' "
                                  ></v-switch>
                                </td>
                                <td v-if="promoSwitch">
                                  <v-text-field
                                    v-model="promoEntry"
                                    label="Type Promocode here"
                                    solo
                                    dense
                                  ></v-text-field>
                                  <v-btn color="primary" @click="checkPromo" block>Add</v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-btn
                            color="primary"
                            :loading="loadingAppointmentCreate"
                            :disabled="loadingAppointmentCreate"
                            @click="appointmentCreate"
                          >Create Appointment</v-btn>
                          <v-btn text>Cancel</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                    <v-col md="4">
                      <v-card class="appointmentInfo">
                        <p class="cardTitle">Appointment Info</p>
                        <hr />
                        <div class="pa-3">
                          <v-list-item class="pl-0">
                            <v-list-item-content>
                              <v-list-item-title class="title">{{doctorInfo.name}}</v-list-item-title>
                              <v-list-item-subtitle>Video Apppointment Fee : {{doctorInfo.pricing.package1}}</v-list-item-subtitle>
                              <br />
                              <v-divider></v-divider>
                              <br />
                              <v-list-item-subtitle>Date : {{ moment(selectedDate).format("dddd, MMMM Do YYYY")}}</v-list-item-subtitle>
                              <v-list-item-subtitle>Time : {{ this.selectedTime }}</v-list-item-subtitle>
                              <v-list-item-subtitle>Contact : {{ this.userPhone }}</v-list-item-subtitle>
                              <v-list-item-subtitle>Patient Name : {{ this.patient.name }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-col>
        </v-row>
    </div>-->
  </section>
</template>
<script>
import { VueTelInput } from "vue-tel-input";
import moment from "~/node_modules/moment";
export default {
  components: {
    moment,
    VueTelInput
  },
  data: () => ({

    showTime :null,
    appointmentModal: false,
    feet: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    inch: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    password: false,
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 6 || "Min 8 characters"
    },
    showPaymentPanel: false,

    moment: moment,
    showAppointmentBooking: false,
    loadingVerifyPhone: false,
    loadingAppointmentCreate: false,
    dialog: false,
    isActive: false,

    loadingConfirmAppointment: false,

    selectedDate: "",
    selectedTime: "",

    profileImage: "",

    patientId: 0,

    promoSwitch: false,
    promoEntry: "",
    validPromoCode: "",
    discount: 0,
    promoAdded: false,

    menu: false,
    bookedAppointmentData: {
      name: ""
    },

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
      fname: "",
      lname: "",
      password: "",
      dob: "",
      sex: 0,
      feet: 0,
      inch: 0,
      weight: 0,
      phone: ""
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
  computed: {},
  created() {
    this.initialize();
  },
  methods: {

    expandTimeSlot(i){
      this.showTime =i;
    },
    selectGender(i){
      this.userInfo.sex=i;
    },
    onAppointmentModal(date, time) {
      this.appointmentModal = true;
      this.selectedDate = date;
      this.selectedTime = time;
    },

    async confirmAppointment() {
      this.loadingConfirmAppointment = true;
      const request_absolute_uri =
        "https://test.cliniva.com.bd/api/v1/patientaccount/create";
      const payload = {
        phone: this.userInfo.phone,
        password: this.userInfo.password,
        name: this.userInfo.fname + this.userInfo.lname ,
        dob: this.userInfo.dob,
        sex: this.userInfo.sex
      };
      await this.$axios
        .$post(request_absolute_uri, payload)
        .then(response => {
          setTimeout(
            () => (
              (this.loadingConfirmAppointment = false),
              (this.showPaymentPanel = true)
            ),
            2000
          );
          this.bookedAppointmentData = response.data;

          this.patientId = response.data._id;

          this.$store.dispatch(
            "snackbar/successMessage",
            `Appointment Booked`,
            {
              root: true
            }
          );
        })
        .catch(error => {
          console.log(error);
          this.loadingConfirmAppointment = false;
          this.$store.dispatch("snackbar/errorMessage", error, { root: true });
        });
    },
    checkPromo() {
      const payload = {
        code: this.promoEntry,
        patientId: this.patientId
      };

      this.$axios
        .$post("https://test.cliniva.com.bd/api/v1/promo/verify", payload)
        .then(response => {
          if (response.success) {
            this.validPromoCode = this.promoEntry;
            this.promoSwitch = false;
            this.promoAdded = true;
            this.discount = response.discount;
            this.$store.dispatch("snackbar/successMessage", response.message, {
              root: true
            });
          }
          if (!response.success) {
            this.$store.dispatch("snackbar/errorMessage", response.message, {
              root: true
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    async appointmentCreate() {
      this.loadingAppointmentCreate = true;
      const payload = {
        chiefComplaints: [],
        patientId: this.patientId,
        doctorId: this.$route.params.id,
        date: moment(this.selectedDate + this.selectedTime, [
          "YYYY-MM-DD hh:mm A"
        ]).format(),
        promo: this.promoEntry
      };

      await this.$axios
        .$post(
          "https://test.cliniva.com.bd/api/v1/appointment/virtual/create",
          payload
        )
        .then(response => {
          this.$store.dispatch(
            "snackbar/successMessage",
            "ধন্যবাদ। আপনার অ্যাকাউন্ট সফল ভাবে তৈরি হয়েছে।",
            { root: true }
          );
          console.log(response);
          setTimeout(
            () => (
              (this.loadingAppointmentCreate = false),
              // (this.$router.push(response.data.GatewayPageURL))
              // (window.open(response.data.GatewayPageURL, "_blank"))

              (window.location.href = response.data.GatewayPageURL)
            ),
            2000
          );
        })
        .catch(err => {
          console.log(err);
        });
    },

    save(date) {
      this.$refs.menu.save(date);
    },

    initialize() {
      fetch(
        `https://test.cliniva.com.bd/api/v1/search/doctor/id/${this.$route.params.id}`
      )
        .then(res => res.json())
        .then(res => {
          this.doctorInfo = res.data;
        })
        .catch(err => {
          console.log("appointmentCreate ERR");
        })
        .finally(() => (this.isLoading = false));
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  min-height: 85vh;
}
.v-card {
  border: none;
  border-radius: 0;
}
.profile {
  background-color: $backgroundColor;
  color: white;
}
.telInput {
  border: 1px solid #bbbbbb;
  margin-bottom: 1.5em;
  height: 3.4em;
}

.activeGender{
  background: $mainColor!important;
  color: white;
}
.timeSchedule {
  border-radius: 5px;
  text-align: center;
  padding: 10px 30px;

  div {
    padding: 0.5em 0;
  }
  .datediv {
    background:   $secondaryColor;
    font-weight: bold;
    padding: 1em 0;

    &:hover{
      cursor: pointer;
    }
  }
  .scroll {
    max-height: 20em;
    overflow-y: scroll;
    border: 1px solid gainsboro;
  }
  .timediv {
    border-bottom: 1px solid $secondaryColor;
    &:hover {
      cursor: pointer;
      background: $mainColor;
      color: white;
    }
  }
}
.title {
  color: $mainColor;
}
.greenText {
  color: $greenColor;
}
table {
  width: 100%;
  tr {
    td {
      padding: 1em;
      border-bottom: 1px solid #e8dfdf;
    }
  }
}
.v-card__actions {
  padding: 0 !important;
  display: flex;
  .v-btn {
    padding: 25px;
    margin: 0;
    width: 100%;
  }
}
.content {
  min-height: 24em;
}
.selectedContainer {
  display: flex;
  flex-wrap: wrap;
  max-height: 20em;
  overflow-y: scroll;
  .selectedItem {
    font-size: small;
    width: 12em;
    height: 6em;
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