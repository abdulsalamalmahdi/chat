<template>
  <div class="body">
    <v-container  class=" container d-flex flex-row main">
      <v-col cols="2" class="container-user-card pa-2">
        <v-img
          :src="this.image"
          class="profiler"
          alt=""
          aspect-ratio="0.9"
          height="40%"
          width="100%"
        ></v-img>

        <v-form class="form">
          <v-text-field
            v-if="show"
            v-model="image"
            label="gravatar URL"
            prepend-icon="mdi-link"
          >
          </v-text-field>
          <v-btn v-if="show" id="urlBtn" @click.prevent="submit" color="info"
            ><v-icon class="ico">mdi-link</v-icon></v-btn
          >
        </v-form>

        <h6>Name: {{ user.first_name }}</h6>
        <h6>age: {{ user.age }}</h6>
        <h6>work: {{ user.work }}</h6>
        <h6>place: {{ user.place }}</h6>
      </v-col>

     
         <!-- <v-col> -->
          <v-card class="welcome" >
            welcom: {{ user.first_name + " " + user.last_name }}
          </v-card> 
           <!-- <v-spacer></v-spacer> -->
          <!-- <v-card>
            <Requests :msgs="messages" />
          </v-card>  -->
        
        <v-spacer> </v-spacer> 

        <Friends class="friends" @openPopup="openPopup" :friends="this.friends" />

        <!-- <v-col>
          <v-card max-width="fit-content">
            <v-btn
              v-if="this.user.role === 'client'"
              v-on:click="clickButton"
              color="primary"
              dark
            >
              <v-icon>
                mdi-account-plus
              </v-icon>
            </v-btn>
          </v-card>
        </v-col> -->
      <!-- </v-col> -->
    </v-container>
    </div>
    </template>
