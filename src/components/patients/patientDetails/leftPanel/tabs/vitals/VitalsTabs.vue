<template>
	<div class="patient-vitals">
		<a-typography-text class="time">Today, {{ today }}</a-typography-text>
		<a-tabs v-model:activeKey="activeKey" type="card" @change="vitalTabChange" v-if="rolesPermissionFind(screensPermissions, [94])">

			<!-- Blood Pressure Tab -->
			<a-tab-pane key="bloodPressure" v-if="isBloodPressure">
				<template #tab>
					<span class="patient-status vitals-tabs" :style="{'background-color': patientLatestVitals?.bloodPressure?.color}">
						<!-- <svg v-if="patientLatestVitals?.bloodPressure?.status == 'high'" width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.842 1.63188e-08L3.052 0L5.88 2.842L5.88 5.068H5.74L3.976 3.304H3.906L3.906 9.8L1.988 9.8L1.988 3.304H1.918L0.14 5.068H2.18929e-07L0 2.842L2.842 1.63188e-08Z" fill="white"/>
						</svg>
						<svg v-else-if="patientLatestVitals?.bloodPressure?.status == 'low'" width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3.05065 10.7997L2.84065 10.8003L0.0053231 7.96558L-0.000422977 5.73958L0.139576 5.73922L1.90812 7.49866L1.97812 7.49848L1.96136 1.0025L3.87935 0.997552L3.89612 7.49353L3.96612 7.49335L5.73956 5.72477L5.87956 5.72441L5.8853 7.9504L3.05065 10.7997Z" fill="white"/>
						</svg> -->
						<template v-if="patientLatestVitals?.bloodPressure?.systolic?.value == 'Unknown' && patientLatestVitals?.bloodPressure?.diastolic?.value == 'Unknown'">
						<svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.124 5.688C2.124 5.176 2.22 4.772 2.412 4.476C2.612 4.18 2.916 3.932 3.324 3.732C3.54 3.62 3.692 3.516 3.78 3.42C3.868 3.324 3.912 3.196 3.912 3.036C3.912 2.876 3.844 2.74 3.708 2.628C3.58 2.508 3.408 2.448 3.192 2.448C2.992 2.448 2.824 2.512 2.688 2.64C2.56 2.76 2.496 2.92 2.496 3.12H0.264C0.264 2.608 0.384 2.152 0.624 1.752C0.864 1.352 1.212 1.04 1.668 0.816C2.124 0.592 2.664 0.48 3.288 0.48C3.888 0.48 4.408 0.584 4.848 0.792C5.296 1 5.636 1.28 5.868 1.632C6.108 1.976 6.228 2.348 6.228 2.748C6.228 3.612 5.824 4.248 5.016 4.656C4.752 4.784 4.556 4.932 4.428 5.1C4.3 5.26 4.236 5.456 4.236 5.688V6.012H2.124V5.688ZM4.296 9H2.064V6.816H4.296V9Z" fill="white"/>
						</svg>
						</template>
						<template v-else>
							<span v-for="count in patientLatestVitals?.bloodPressure?.continueReading" :key="count">
								<template v-if="!(count > 3)">+</template>
							</span>
						</template>
						<span class="check-mark" v-if="patientLatestVitals?.bloodPressure?.reviewed">
							<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3.54448 7.5L0.333008 4.16383L1.49967 2.83333L3.54448 5.16667L8.49967 0.5L9.66634 1.14043L3.54448 7.5Z" fill="white"/>
							</svg>
						</span>
					</span>
					<a-typography-title :level="2" v-if="patientLatestVitals?.bloodPressure?.systolic?.value != 'Unknown' || patientLatestVitals?.bloodPressure?.diastolic?.value != 'Unknown'">
						<span :style="{'color': patientLatestVitals?.bloodPressure?.systolic?.color == vitalFlagColors.wnl ? vitalFlagColors.text : patientLatestVitals?.bloodPressure?.systolic?.color}">{{ patientLatestVitals?.bloodPressure?.systolic?.value }}</span>/
						<span :style="{'color': patientLatestVitals?.bloodPressure?.diastolic?.color == vitalFlagColors.wnl ? vitalFlagColors.text : patientLatestVitals?.bloodPressure?.diastolic?.color}" >{{ patientLatestVitals?.bloodPressure?.diastolic?.value }}</span>
					</a-typography-title>
					<a-typography-title v-else :level="2" :style="{'color': vitalFlagColors.unknown}"><span>Unknown</span></a-typography-title>
					<a-typography-text class="type">BLOOD PRESSURE</a-typography-text>
				</template>
				<BloodPressure />
			</a-tab-pane>

			<!-- Heart Rate Tab -->
			<a-tab-pane key="heartRate" v-if="isHeartRate">
				<template #tab>
					<span class="patient-status vitals-tabs" :style="{'background-color': patientLatestVitals?.bpm?.color}">
						<template v-if="patientLatestVitals?.bpm?.value == 'Unknown'">
							<svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.124 5.688C2.124 5.176 2.22 4.772 2.412 4.476C2.612 4.18 2.916 3.932 3.324 3.732C3.54 3.62 3.692 3.516 3.78 3.42C3.868 3.324 3.912 3.196 3.912 3.036C3.912 2.876 3.844 2.74 3.708 2.628C3.58 2.508 3.408 2.448 3.192 2.448C2.992 2.448 2.824 2.512 2.688 2.64C2.56 2.76 2.496 2.92 2.496 3.12H0.264C0.264 2.608 0.384 2.152 0.624 1.752C0.864 1.352 1.212 1.04 1.668 0.816C2.124 0.592 2.664 0.48 3.288 0.48C3.888 0.48 4.408 0.584 4.848 0.792C5.296 1 5.636 1.28 5.868 1.632C6.108 1.976 6.228 2.348 6.228 2.748C6.228 3.612 5.824 4.248 5.016 4.656C4.752 4.784 4.556 4.932 4.428 5.1C4.3 5.26 4.236 5.456 4.236 5.688V6.012H2.124V5.688ZM4.296 9H2.064V6.816H4.296V9Z" fill="white"/>
							</svg>
						</template>
						<template v-else>
							<span v-for="count in patientLatestVitals?.bpm?.continueReading" :key="count">
								<template v-if="!(count > 3)">+</template>
							</span>
						</template>
						<span class="check-mark" v-if="patientLatestVitals?.bpm?.reviewed">
							<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3.54448 7.5L0.333008 4.16383L1.49967 2.83333L3.54448 5.16667L8.49967 0.5L9.66634 1.14043L3.54448 7.5Z" fill="white"/>
							</svg>
						</span>
					</span>
					<a-typography-title :level="2" :style="{'color': patientLatestVitals?.bpm?.color == vitalFlagColors.wnl ? vitalFlagColors.text : patientLatestVitals?.bpm?.color}">
						<span>{{ patientLatestVitals?.bpm?.value }}</span>
					</a-typography-title>
					<a-typography-text class="type">Heart Rate</a-typography-text>
				</template>
				<HeartRate />
			</a-tab-pane>

			<!-- Oxygen levels Tab -->
			<a-tab-pane key="oxygenLevels" v-if="isOxygenSaturation">
				<template #tab>
					<span class="patient-status vitals-tabs" :style="{'background-color': patientLatestVitals?.spo2?.color}">
						<template v-if="patientLatestVitals?.spo2?.value == 'Unknown'">
							<svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.124 5.688C2.124 5.176 2.22 4.772 2.412 4.476C2.612 4.18 2.916 3.932 3.324 3.732C3.54 3.62 3.692 3.516 3.78 3.42C3.868 3.324 3.912 3.196 3.912 3.036C3.912 2.876 3.844 2.74 3.708 2.628C3.58 2.508 3.408 2.448 3.192 2.448C2.992 2.448 2.824 2.512 2.688 2.64C2.56 2.76 2.496 2.92 2.496 3.12H0.264C0.264 2.608 0.384 2.152 0.624 1.752C0.864 1.352 1.212 1.04 1.668 0.816C2.124 0.592 2.664 0.48 3.288 0.48C3.888 0.48 4.408 0.584 4.848 0.792C5.296 1 5.636 1.28 5.868 1.632C6.108 1.976 6.228 2.348 6.228 2.748C6.228 3.612 5.824 4.248 5.016 4.656C4.752 4.784 4.556 4.932 4.428 5.1C4.3 5.26 4.236 5.456 4.236 5.688V6.012H2.124V5.688ZM4.296 9H2.064V6.816H4.296V9Z" fill="white"/>
							</svg>
						</template>
						<template v-else>
							<span v-for="count in patientLatestVitals?.spo2?.continueReading" :key="count">
								<template v-if="!(count > 3)">+</template>
							</span>
						</template>
						<span class="check-mark" v-if="patientLatestVitals?.spo2?.reviewed">
							<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3.54448 7.5L0.333008 4.16383L1.49967 2.83333L3.54448 5.16667L8.49967 0.5L9.66634 1.14043L3.54448 7.5Z" fill="white"/>
							</svg>
						</span>
					</span>
					<a-typography-title :level="2" :style="{'color': patientLatestVitals?.spo2?.color == vitalFlagColors.wnl ? vitalFlagColors.text : patientLatestVitals?.spo2?.color}"><span>{{ patientLatestVitals?.spo2?.value }}</span></a-typography-title>
					<a-typography-text class="type">Oxygen Levels</a-typography-text>
				</template>
				<OxygenLevels />
			</a-tab-pane>

			<!-- Glucose levels Tab -->
			<a-tab-pane key="glucoseLevels" v-if="isGlucose">
				<template #tab>
					<span class="patient-status vitals-tabs" :style="{'background-color': patientLatestVitals?.glucose?.color}">
						<template v-if="patientLatestVitals?.glucose?.value == 'Unknown'">
							<svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2.124 5.688C2.124 5.176 2.22 4.772 2.412 4.476C2.612 4.18 2.916 3.932 3.324 3.732C3.54 3.62 3.692 3.516 3.78 3.42C3.868 3.324 3.912 3.196 3.912 3.036C3.912 2.876 3.844 2.74 3.708 2.628C3.58 2.508 3.408 2.448 3.192 2.448C2.992 2.448 2.824 2.512 2.688 2.64C2.56 2.76 2.496 2.92 2.496 3.12H0.264C0.264 2.608 0.384 2.152 0.624 1.752C0.864 1.352 1.212 1.04 1.668 0.816C2.124 0.592 2.664 0.48 3.288 0.48C3.888 0.48 4.408 0.584 4.848 0.792C5.296 1 5.636 1.28 5.868 1.632C6.108 1.976 6.228 2.348 6.228 2.748C6.228 3.612 5.824 4.248 5.016 4.656C4.752 4.784 4.556 4.932 4.428 5.1C4.3 5.26 4.236 5.456 4.236 5.688V6.012H2.124V5.688ZM4.296 9H2.064V6.816H4.296V9Z" fill="white"/>
							</svg>
						</template>
						<template v-else>
							<span v-for="count in patientLatestVitals?.glucose?.continueReading" :key="count">
								<template v-if="!(count > 3)">+</template>
							</span>
						</template>
						<span class="check-mark" v-if="patientLatestVitals?.glucose?.reviewed">
							<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M3.54448 7.5L0.333008 4.16383L1.49967 2.83333L3.54448 5.16667L8.49967 0.5L9.66634 1.14043L3.54448 7.5Z" fill="white"/>
							</svg>
						</span>
					</span>
					<a-typography-title :level="2" :style="{'color': patientLatestVitals?.glucose?.color == vitalFlagColors.wnl ? vitalFlagColors.text : patientLatestVitals?.glucose?.color}"><span>{{ patientLatestVitals?.glucose?.value }}</span></a-typography-title>
					<a-typography-text class="type">Glucose Levels</a-typography-text>
				</template>
				<GlucoseLevels />
			</a-tab-pane>

			<!-- Behavioral Health Tab -->
			<a-tab-pane key="behavioralHealth" v-if="isBehavioralHealth">
				<template #tab>
					<span class="patient-status vitals-tabs" :style="{'background-color': vitalFlagColors.unknown}">
						<svg width="7" height="9" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.124 5.688C2.124 5.176 2.22 4.772 2.412 4.476C2.612 4.18 2.916 3.932 3.324 3.732C3.54 3.62 3.692 3.516 3.78 3.42C3.868 3.324 3.912 3.196 3.912 3.036C3.912 2.876 3.844 2.74 3.708 2.628C3.58 2.508 3.408 2.448 3.192 2.448C2.992 2.448 2.824 2.512 2.688 2.64C2.56 2.76 2.496 2.92 2.496 3.12H0.264C0.264 2.608 0.384 2.152 0.624 1.752C0.864 1.352 1.212 1.04 1.668 0.816C2.124 0.592 2.664 0.48 3.288 0.48C3.888 0.48 4.408 0.584 4.848 0.792C5.296 1 5.636 1.28 5.868 1.632C6.108 1.976 6.228 2.348 6.228 2.748C6.228 3.612 5.824 4.248 5.016 4.656C4.752 4.784 4.556 4.932 4.428 5.1C4.3 5.26 4.236 5.456 4.236 5.688V6.012H2.124V5.688ZM4.296 9H2.064V6.816H4.296V9Z" fill="white"/>
						</svg>
					</span>
					<a-typography-title :level="2" :style="{'color': vitalFlagColors.unknown}"><span>Unknown</span></a-typography-title>
					<a-typography-text class="type">Behavioral Health </a-typography-text>
				</template>
				<BehavioralHealth />
			</a-tab-pane>

		</a-tabs>
		<PatientVitalsLoader />
	</div>
</template>

<script setup>
	import {
		computed,
		onMounted,
		ref,
	onUnmounted,
	watchEffect} from 'vue';
	import BloodPressure from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/bloodPressure/BloodPressure";
	import GlucoseLevels from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/glucoseLevels/GlucoseLevels";
	import BehavioralHealth from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/behavioralHealth/BehavioralHealth";
	import OxygenLevels from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/oxygenLevels/OxygenLevels";
	import HeartRate from "@/components/patients/patientDetails/leftPanel/tabs/vitals/tabs/heartRate/HeartRate";
	import PatientVitalsLoader from "@/components/patients/patientDetails/leftPanel/tabs/vitals/PatientVitalsLoader";
	import { useStore } from 'vuex';
	import { useRoute } from 'vue-router';
	import { deviceIds, vitalFlagColors } from "@/config/common";
	import moment from 'moment';
	import { globalDateFormat, rolesPermissionFind } from '@/commonMethods/commonMethod';

	const store= useStore()
	const route = useRoute()
	const today = moment().format(globalDateFormat)
	const vitalType = ref(5)
	
	const screensPermissions = store.getters.screensPermissions
	const isBloodPressure = ref(false)
	const isHeartRate = ref(false)
	const isOxygenSaturation = ref(false)
	const isGlucose = ref(false)
	const isBehavioralHealth = ref(false)

	const patientLatestVitals = computed(() => {
		return store.state.vitals.patientLatestVitals
	})
	const activeKey = computed(() => {
		return store.state.vitals.vitalTabs
	})

	const deviceList = computed(() => {
		return store.state.device.deviceList
	})

  const endParams = computed(() => {
    return store.state.vitals.endParams
  })

	watchEffect(() => {
		
	})

	onMounted(async() => {
		try{
		await store.dispatch("deviceList", { id: route?.params?.udid })
        deviceList.value?.map(device => {
			if(device.deviceType == 'Blood Pressure') {
				isBloodPressure.value = true
			}
			if(device.deviceType == 'Blood Pressure' || device.deviceType == 'Oximeter') {
				isHeartRate.value = true
			}
			if(device.deviceType == 'Oximeter') {
				isOxygenSaturation.value = true
			}
			if(device.deviceType == 'Glucose') {
				isGlucose.value = true
			}
			if(device.deviceType == 'Behavioral Health') {
				isBehavioralHealth.value = true
			}
		})

		if(isBehavioralHealth.value) {
			store.vitalTabs = 'behavioralHealth'
		}
		if(isGlucose.value) {
			store.commit('vitals/vitalTabs','glucoseLevels')
		}
		if(isOxygenSaturation.value) {
			store.commit('vitals/vitalTabs','oxygenLevels')
		}
		if(isHeartRate.value) {
			store.commit('vitals/vitalTabs','heartRate')
		}
		if(isBloodPressure.value) {
			store.commit('vitals/vitalTabs','bloodPressure')
		}
		// store.dispatch('vitals/patientVitalsTable', {
		// 			patientId: route.params.udid,
		// 			deviceType: deviceIds.bloodPressureDeviceId,
		// 			activeTab: "bloodPressure",
		// 		})
        // store.dispatch('vitals/patientVitalsTable', {
		// 			patientId: route.params.udid,
		// 			deviceType: deviceIds.heartRateDeviceId,
		// 			activeTab: "heartRate",
		// 		})
			
        // store.dispatch('vitals/patientVitalsTable', {
		// 			patientId: route.params.udid,
		// 			deviceType: deviceIds.bloodOxygenDeviceId,
		// 			activeTab: "oxygenLevels",
		// 		})
				
        
				// store.dispatch('vitals/patientVitalsGraph', {
				// 	patientId: route.params.udid,
				// 	deviceType: deviceIds.glucoseDeviceId,
				// 	activeTab: "glucoseLevels",
				// 	vitalType: vitalType.value,
				// })
				
				store.dispatch('vitals/deviceTypes')
				store.dispatch('vitals/vitalStatus')
				store.dispatch('vitals/vitalFeelingStatus')
				tabChanged(activeKey.value)
				store.dispatch('vitals/patientLatestVitals', route.params.udid)
			// if(activeKey.value == "bloodPressure") {
			// 	store.dispatch('vitals/patientVitalsTable', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.bloodPressureDeviceId,
			// 		activeTab: "bloodPressure",
			// 	})
			// 	store.dispatch('vitals/patientVitalsGraph', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.bloodPressureDeviceId,
			// 		activeTab: "bloodPressure",
			// 	})
			// }
			// if(activeKey.value == "heartRate") {
			// 	store.dispatch('vitals/patientVitalsTable', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.heartRateDeviceId,
			// 		activeTab: "heartRate",
			// 	})
			// 	store.dispatch('vitals/patientVitalsGraph', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.heartRateDeviceId,
			// 		activeTab: "heartRate",
			// 	})
			// }
			// if(activeKey.value == "oxygenLevels") {
			// 	store.dispatch('vitals/patientVitalsTable', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.bloodOxygenDeviceId,
			// 		activeTab: "oxygenLevels",
			// 	})
			// 	store.dispatch('vitals/patientVitalsGraph', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.bloodOxygenDeviceId,
			// 		activeTab: "oxygenLevels",
			// 	})
			// }
			// if(activeKey.value == "glucoseLevels") {
			// 	store.dispatch('vitals/patientVitalsTable', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.glucoseDeviceId,
			// 		activeTab: "glucoseLevels",
			// 	})
			// 	store.dispatch('vitals/patientVitalsGraph', {
			// 		patientId: route.params.udid,
			// 		deviceType: deviceIds.glucoseDeviceId,
			// 		activeTab: "glucoseLevels",
			// 		vitalType: vitalType.value,
			// 	})
			// }
			// if(activeKey.value == "behavioralHealth") {
			// }
		}catch(error){
			console.warn(error)
		}
		//store.commit("patientsTab", 'vital');
    //   store.commit("patientTabsEnabled", true);
    //   store.commit("patientVitalsEnabled", true);
	})

	// watch(activeKey,key => {
	// 	store.state.vitals.vitalTabs=key
	// 	tabChanged(key)
	// })
	onUnmounted(() => {
		store.commit('vitals/vitalTabs','')
	})
    const vitalTabChange = (key)=>{
		store.commit('vitals/vitalTabs',key)
		tabChanged(key)
	}
	
	const tabChanged = (key) => {
    store.commit('vitals/endParams', '&page=1')
		if(key == 'bloodPressure') {
			store.dispatch('vitals/patientVitalsTable', {
				patientId: route.params.udid,
				deviceType: deviceIds.bloodPressureDeviceId,
				activeTab: "bloodPressure",
				endParams: endParams.value,
			})
			store.dispatch('vitals/patientVitalsGraph', {
				patientId: route.params.udid,
				deviceType: deviceIds.bloodPressureDeviceId,
				activeTab: "bloodPressure",
			})
			store.dispatch('vitals/getBPVitalDefaults', {
				patientId: route.params.udid,
				deviceType: deviceIds.bloodPressureDeviceId
			})
		}
		if(key == 'heartRate') {
			store.dispatch('vitals/patientVitalsTable', {
				patientId: route.params.udid,
				deviceType: deviceIds.heartRateDeviceId,
				activeTab: "heartRate",
				endParams: endParams.value,
			})
			store.dispatch('vitals/patientVitalsGraph', {
				patientId: route.params.udid,
				deviceType: deviceIds.heartRateDeviceId,
				activeTab: "heartRate",
			})
			store.dispatch('vitals/getHeartRateVitalDefaults', {
				patientId: route.params.udid,
				deviceType: deviceIds.heartRateDeviceId
			})
		}
		if(key == 'oxygenLevels') {
			store.dispatch('vitals/patientVitalsTable', {
				patientId: route.params.udid,
				deviceType: deviceIds.bloodOxygenDeviceId,
				activeTab: "oxygenLevels",
				endParams: endParams.value,
			})
			store.dispatch('vitals/patientVitalsGraph', {
				patientId: route.params.udid,
				deviceType: deviceIds.bloodOxygenDeviceId,
				activeTab: "oxygenLevels",
			})
			store.dispatch('vitals/getOxygenVitalDefaults', {
				patientId: route.params.udid,
				deviceType: deviceIds.bloodOxygenDeviceId
			})
		}
		if(key == 'glucoseLevels') {
			store.dispatch('vitals/patientVitalsTable', {
				patientId: route.params.udid,
				deviceType: deviceIds.glucoseDeviceId,
				activeTab: "glucoseLevels",
				endParams: endParams.value,
			})
			store.dispatch('vitals/patientVitalsGraph', {
				patientId: route.params.udid,
				deviceType: deviceIds.glucoseDeviceId,
				activeTab: "glucoseLevels",
				vitalType: vitalType.value,
			})
			store.dispatch('vitals/getGlucoseVitalDefaults', {
				patientId: route.params.udid,
				deviceType: deviceIds.glucoseDeviceId,
				vitalType: vitalType.value,
			})
		}
		if(key == 'behavioralHealth') {
			console.log(key, 'in tabs ')
		}
	}

</script>

<style>
.patient-status.vitals-tabs {
	font-size: 17px;
	padding: 0 7px;
}
</style>
