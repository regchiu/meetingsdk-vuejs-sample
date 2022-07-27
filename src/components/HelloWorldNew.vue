<template>
  <main>
    <h1>Zoom Meeting SDK Component View Sample Vue.js 2</h1>
    <!-- For Component View -->
    <div id="meeting-sdk-element">
      <!-- Zoom Meeting SDK Component View Rendered Here -->
    </div>
    <form @submit.prevent="startMeeting">
      <fieldset>
        <legend>Select your role:</legend>
        <div>
          <input id="attendees" v-model.number="role" type="radio" name="role" value="0" />
          <label for="attendees">Attendees</label>
        </div>
        <div>
          <input id="host" v-model.number="role" type="radio" name="role" value="1" />
          <label for="host">Host</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Enter your information:</legend>
        <div>
          <label class="required" for="user-email">User email</label>
          <input id="user-email" v-model="userEmail" type="email" name="user-email" required />
        </div>
        <div>
          <label class="required" for="user-name">User name</label>
          <input id="user-name" v-model="userName" type="text" name="user-name" required />
        </div>
        <div>
          <label class="required" for="meeting-number">Meeting/Webinar Number</label>
          <input
            id="meeting-number"
            v-model="meetingNumber"
            type="text"
            name="meeting-number"
            required
          />
        </div>
        <div>
          <label class="required" for="password">Password</label>
          <input id="password" v-model="passWord" type="password" name="password" required />
        </div>
      </fieldset>
      <button type="submit">
        {{ buttonLabel }}
      </button>
    </form>
  </main>
</template>

<script>
import ZoomMtgEmbedded from '@zoomus/websdk/embedded'

export default {
  name: 'HelloWorldNew',
  data() {
    return {
      client: ZoomMtgEmbedded.createClient(),
      // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
      sdkKey: process.env.VUE_APP_ZOOM_SDK_KEY,
      meetingNumber: '',
      passWord: '',
      /*
       * Start Webinar
       * To start a Zoom Webinar, you must use have a role value of 1 in your SDK Signature, include the userEmail property,
       * and pass in the Webinar host's zak token.
       * This enables your Web Meeting SDK to start the Webinar.
       *
       * Join Webinar
       * To join a Zoom Webinar, you must use have a role value of 0 in your SDK Signature, and include the userEmail property.
       * This enables your Web Meeting SDK to join any Webinar.
       */
      role: 0,
      userEmail: '',
      userName: '',
      // pass in the registrant's token if your meeting or webinar requires registration. More info here:
      // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/meetings#join-registered
      // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/component-view/webinars#join-registered
      registrantToken: '',
      zakToken: '',
      signature: '',
      accessToken: ''
    }
  },
  computed: {
    buttonLabel() {
      return this.role ? 'Start Meeting' : 'Join Meeting'
    },
  },
  created() {},
  methods: {
    async getSignature() {
      try {
        const response = await this.$axios.post('/signature', {
          meetingNumber: this.meetingNumber,
          role: this.role,
        })
        console.log('signature', response.data.signature)
        this.signature = response.data.signature
      } catch (error) {
        console.log(error)
      }
    },
    async getAccessToken() {
      try {
        const response = await this.$axios.get('/access-token', {
          params: {
            code: this.$route.query.code,
          },
        })
        this.accessToken = response.data.access_token
        // this.$cookies.set('access-token', response.data.access_token)
        // this.$cookies.set('refresh-token', response.data.refresh_token)
      } catch (error) {
        console.error(error)
      }
    },
    // async refreshAccessToken() {
    //   try {
    //     const response = await this.$axios.get('/refresh-access-token', {
    //       params: {
    //         refreshToken: this.$cookies.get('refresh-token'),
    //       },
    //     })
    //     this.$cookies.set('access-token', response.data.access_token)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },
    async getZak() {
      try {
        const response = await this.$axios.get('/zak', {
          params: {
            // accessToken: this.$cookies.get('access-token'),
            accessToken: this.accessToken,
          },
        })
        this.zakToken = response.data.token
        console.log('zak', this.zakToken)
      } catch (error) {
        console.error(error)
      }
    },
    async startMeeting() {
      await this.getSignature()
      if (this.role === 1) {
        // if (this.$cookies.get('refresh-token')) {
        //   await this.refreshAccessToken()
        // } else {
        //   await this.getAccessToken()
        // }
        await this.getAccessToken()
        await this.getZak()
      }
      let meetingSDKElement = document.getElementById('meeting-sdk-element')

      this.client.init({
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        customize: {
          meetingInfo: [
            'topic',
            'host',
            'mn',
            'pwd',
            'telPwd',
            'invite',
            'participant',
            'dc',
            'enctype',
          ],
          toolbar: {
            buttons: [
              {
                text: 'Custom Button',
                className: 'CustomButton',
                onClick: () => {
                  console.log('custom button')
                },
              },
            ],
          },
        },
      })

      this.client.join({
        sdkKey: this.sdkKey,
        signature: this.signature,
        meetingNumber: this.meetingNumber,
        password: this.passWord,
        userName: this.userName,
        userEmail: this.userEmail,
        tk: this.registrantToken,
        zak: this.zakToken
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  margin-top: 20px;
  background-color: #2d8cff;
  color: #ffffff;
  text-decoration: none;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 40px;
  padding-right: 40px;
  display: inline-block;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  outline: none;
}

button:hover {
  background-color: #2681f2;
}

legend {
  background-color: #000000;
  color: #ffffff;
  padding: 3px 6px;
}

input {
  margin: 0.4rem;
}

label.required::before {
  content: ' * ';
  color: red;
}
</style>
