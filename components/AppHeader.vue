<template>
    <section>
       <div class="container">
            <div class="logo" @click="$router.push('/')">
             <img class="logo" :src="require(`@/assets/img/ctlogo.png`)" alt />
        </div>
       </div>
    </section>
</template>
<style lang="scss" scoped>
section{
    background: #cacacf;
    border: none;
}
.logo{
    img{
        height: 2.5em;
    }
}
</style>