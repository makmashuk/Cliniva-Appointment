export const state = () => ({
  snackMsg: '',
  snackColor:''
})

export const mutations = {
  setSnack (state, snack) {
    state.snackMsg = snack
  },
  setSnackBg(state,bgColor){
    state.snackColor =bgColor
  }
}

export const actions = {
  successMessage(context, msg){
    context.commit('setSnackBg', 'success')
    context.commit('setSnack',msg)
  },
  errorMessage(context, msg){
    context.commit('setSnackBg', 'error')
    context.commit('setSnack',msg)
  },
  warningMessage(context, msg){
    context.commit('setSnackBg', 'warning')
    context.commit('setSnack',msg)
  }
}
