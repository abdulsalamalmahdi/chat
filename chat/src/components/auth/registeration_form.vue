<template>
  <div>
    <v-card width="400" class="mx-auto mt-5">
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="name"
            label="name *"
            prepend-icon="mdi-account-circle"
             :rules="[rules.required]"
          />
          <v-text-field
            v-model="last_name"
            label="lastname *"
            prepend-icon="mdi-account-circle"
             :rules="[rules.required]"
          />
          <v-text-field
            v-model="email"
            label="email *"
            prepend-icon="mdi-email"
             :rules="[rules.required]"
          />

          <v-text-field
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show ? 'text' : 'password'"
            name="password"
            label="Enter Password *"
            hint="At least 8 characters"
            counter
            @click:append="show = !show"
          ></v-text-field>

          <v-text-field
            v-model="rePassword"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min, passwordConfirmationRule]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Re-enter Password *"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>

          <v-text-field v-model="Age" label="Age" prepend-icon="mdi-calendar" />
          <v-text-field
            v-model="address"
            label="Address"
            prepend-icon="mdi-map-marker-outline"
          />
        </v-form>
      </v-card-text>
<v-card v-if="this.err" class="err">
{{this.err}}
</v-card>
      <v-row class="`d-flex justify-space-between ml-2 mr-2 `">
        <v-card-actions>
          <v-btn :text="true" @click.prevent="submit" color="info"
            >Sign up</v-btn
          >
        </v-card-actions>

        <v-card-actions>
          <v-btn :text="true" @click.prevent="clear" color="red"
            >Clear All</v-btn
          >
        </v-card-actions>
      </v-row>
    </v-card>

    <v-list>
      <ul></ul>
    </v-list>
  </div>
</template>
<script>
import userApi from "../../api/user";

export default {
  name: "Signup",

  data() {
    return {
      err:"",
      name:"",
      last_name:"",
      email: "",
      password: "",
      rePassword:"",
      age:"",
      address:"",
       show: false,
      show1: false,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match"
      }

    };
  },
  computed:{
     passwordConfirmationRule() {
      return this.password === this.rePassword || "Password must match";
    }
  },
  methods:{
    submit(){
         if(!this.rules.required){
this.err="fill in the required fields"
this.$refs.form.inputs.map(el=> el.rules[0](false) )
         }else if(!this.passwordConfirmationRule){
this.err="passwords does not match"
         }else{
            const first_name =this.name;
     const last_name= this.last_name;
     const email= this.email;
     const password= this.password;
     const age= this.age;
     const address= this.address;
     const body={
       first_name,
       last_name,
       email,
       password,
       age,
       address,
       role:"admin"
     }
   userApi.signUp(body);
   this.$router.push('/Login');
         }
      
        
        },

       clear(){
         this.name="";
      this.last_name="";
      this.email= "";
      this.password= "";
      this.rePassword="";
      this.age="";
      this.address="";
       this.show= false;
      this.show1= false;
       }

    },

  }
</script>
<style scoped>
.err{
  background: white;
  width: fit-content;
  left: 7em;
  font-style: oblique;
  color:red;
  border: 1px solid red;
}
</style>