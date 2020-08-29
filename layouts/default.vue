<template>
  <v-app>
    <AppHeader/>
    <nuxt/>
    <AppSnackbar/>
    <AppFooter/>
  </v-app>
</template>

<script>
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import AppSnackbar from '../components/AppSnackbar';
export default {
  components:{
    AppHeader,
    AppFooter,
    AppSnackbar
  },
  data () {
    return {
    }
  }
}
</script>
