<template>
	
	<a-list class="critical-notes" style="width:100%" size="small" :data-source="patientCriticalNotes">
		
		<template #renderItem="{item}">
			
			<a-list-item class="critcal-note">
				<Alert v-if="item.criticalNote" :itemId="item.id" :text="item.criticalNote" type="error" :closable="true" :patientUdid="patientUdid" :isPin="true" />
			</a-list-item>
		</template>
	</a-list>
</template>

<script>
import Alert from "@/components/common/Alert/Alert";
import { computed ,watchEffect} from "vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
export default {
	components: {
    Alert,
	},
	props: {
    patientUdid: {
			type: Number
		},
    patientPins: {
			type: Array
		},
	},
	setup(props) {
		const store = useStore()
		const route = useRoute();
		const patientId = props.patientUdid ? props.patientUdid : route.params.udid

    const patientCriticalNotes = props.patientPins ? props.patientPins :
		computed(() => {
      return store.state.patients.patientCriticalNotes
    })

		watchEffect(() => {
			store.dispatch('patientCriticalNotes', patientId)
		})

		return {
			patientCriticalNotes,
		}
	}
}
</script>