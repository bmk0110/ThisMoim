<template>
  <div class="pa-5">
    <v-row>
      <v-col cols="12" class="mb-4">
        <v-row>
          <v-col cols="6">
            <v-menu
              ref="dateOpen"
              v-model="dateOpen"
              :close-on-content-click="false"
              :return-value.sync="start"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="start"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  dense
                  readonly
                  outlined
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>

              <v-date-picker v-model="start" no-title>
                <v-spacer />
                <v-btn text color="primary" @click="dateOpen = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dateOpen.save(start)">OK</v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="type"
              :items="typeOptions"
              label="Type"
              class="my-auto"
              hide-details
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
        <div class="text-center mb-3 display-1">{{start | moment('YYYY MMMM')}}</div>
        <v-sheet height="500">
          <v-calendar
            ref="calendar"
            :start="start"
            :events="events"
            @click:date="open"
            @click:event="showEvent"
            :type="type"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
    <Dialog v-if="$store.state.calendar.dialog" />
    <EventDetail v-if="$store.state.calendar.eventDetail" />
    <v-footer absolute>{{ $store.state.calendar }}</v-footer>
  </div>
</template>

<script>
import Dialog from "./calendar/Dialog";
import EventDetail from "./calendar/EventDetail";

export default {
  name: "Calendar",
  components: {
    Dialog,
    EventDetail,
  },
  computed: {
    events() {
      return this.$store.state.calendar.events;
    },
  },
  created() {
    var today = new Date();
    this.start =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
  },
  data() {
    return {
      dateOpen: false,
      start: "",
      type: "month",
      typeOptions: [
        { text: "Day", value: "day" },
        { text: "Week", value: "week" },
        { text: "Month", value: "month" },
      ],
    };
  },
  methods: {
    open(date) {
      this.$store.commit("OPEN_CALENDAR_DIALOG", date);
    },
    showEvent(event) {
      console.log(event);
      this.$store.commit("OPEN_CALENDAR_EVENT", event);
    },
  },
};
</script>

<style>
</style>

