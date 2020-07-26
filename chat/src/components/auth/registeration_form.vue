<template>
  <div>
    <v-card width="400" class="mx-auto mt-5">
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="name"
            label="name"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            v-model="name"
            label="lastname"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            v-model="email"
            label="email"
            prepend-icon="mdi-email"
          />
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            label="password"
            v-model="password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-text-field v-model="Age" label="Age" prepend-icon="mdi-calendar" />
          <v-text-field
            v-model="address"
            label="Address"
            prepend-icon="mdi-map-marker-outline"
          />
        </v-form>
      </v-card-text>

      <p>{{ pro }}</p>
      <v-card-actions>
        <v-btn @click.prevent="submit" color="info">Sign up</v-btn>
      </v-card-actions>
    </v-card>

    <v-list >
   <ul>    
   </ul>
    </v-list>
  </div>
</template>
<script>
import userApi from "../../api/user";
export default {
  name: "Signup",

  data() {
    return {
      name:"",
      lastname:"",
      email: "",
      password: "",
      age:"",
      address:""
    };
  },
  methods:{
    submit(){
     const name =this.name;
     const lastname= this.lastname;
     const email= this.email;
     const password= this.password;
     const age= this.age;
     const address= this.address;
     const body={
       name,
       lastname,
       email,
       password,
       age,
       address,
       role:"admin"
     }
   userApi.signUp(body);
   this.$router.push('/Login');
    }
  }
};
</script>
