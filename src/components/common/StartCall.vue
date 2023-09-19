<template>
  <a-col :span="8">
    <div class="moreAction" @click="startCall">
      <div class="moreActionImg darkGreenBgColor">
        <PhoneOutlined/>
      </div>
      <p  :class="isBold == true ? 'bold' : ''">Start Call</p>
    </div>
  </a-col>
</template>

<script>
import {
  computed,
  ref,
  reactive,
} from 'vue-demi'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  enCodeStringVideoURL,
} from "@/commonMethods/commonMethod"
import { PhoneOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PhoneOutlined,
  },
  props: {
    isBold: {
      type: Boolean
    },
    patientId: {
      type: Number
    },
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()

    const conferenceId = computed(() => {
			return store.state.videoCall.conferenceId
		})

		const flagsList = computed(() => {
			return store.state.flags.flagsList
		})

    const patientFlag = ref(null)
    flagsList.value?.forEach(flag => {
      if(flag.name == 'Normal') {
        patientFlag.value = flag.id
      }
    })

    const startCallForm = reactive({
      flag: patientFlag,
      note: "Call",
      patientId: props.patientId,
    })
    const startCall = () => {
      store.commit('loadingStatus', true)
      store.dispatch("appointmentCalls", startCallForm).then((response)=>{
        if(response == true && conferenceId.value) {
          store.commit('loadingStatus', false)
          let redirect = router.resolve({name: 'videoCall', params: {id: enCodeStringVideoURL(conferenceId.value)}})
          window.open(redirect.href, '_blank')
        }
      })
     
    }

    return {
      startCall,
      enCodeStringVideoURL
    }
  }
}
</script>

<style scoped>
.anticon {
  color: #ffffff;
  font-size: 20px !important;
  position: relative !important;
  top: -2px !important;
}
</style>