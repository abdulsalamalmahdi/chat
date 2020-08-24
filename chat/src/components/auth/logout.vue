<template>
    <div>

    </div>
</template>
<script>
export default {
    name: 'Logout',
    data(){
        return {
            
        }
    },
created: function(){
this.$store.dispatch('removeUser')
this.$router.push('/login')
},
}
</script>