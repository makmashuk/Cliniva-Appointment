<template>
    <section>
         <v-item-group multiple>
        <v-subheader>Tags</v-subheader>
        <v-item
          v-for="n in 8"
          :key="n"
          v-slot:default="{ active, toggle }"
        >
          <v-chip
            active-class="purple--text"
            :input-value="active"
            @click="toggle"
          >
            Tag {{ n }}
          </v-chip>
        </v-item>
      </v-item-group>

    <v-divider></v-divider>
    </section>
</template>
<script>
  export default {
    data: () => ({
      //
    }),
  }
</script>