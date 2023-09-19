<template>
  <a-col :span="12">
    <a-breadcrumb>
      <a-breadcrumb-item> <router-link v-if="rolesPermissionFind(store.state.screenPermissions?.screensPermissions, [62,65])" :to="{ name: 'PatientsList' }">Patients</router-link></a-breadcrumb-item>
    </a-breadcrumb>
    <div class="heading-with-status">
    <a-typography-title :level="2" class="common-heading">
      {{ patientInformation?.contact?.fullName && patientInformation?.contact?.fullName != "" ? patientInformation?.contact?.fullName : patientInformation?.contact?.firstName }}
    </a-typography-title>
    <span  class="patient-detail-status" :style="{ 'background-color': patientInformation?.color, 'width': patientInformation?.continueReading > 0 ? '' : '34px' }">
      <template v-if="patientInformation?.color == '#5E6971'">
        <svg width="11" height="13" viewBox="0 0 7 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.124 5.688C2.124 5.176 2.22 4.772 2.412 4.476C2.612 4.18 2.916 3.932 3.324 3.732C3.54 3.62 3.692 3.516 3.78 3.42C3.868 3.324 3.912 3.196 3.912 3.036C3.912 2.876 3.844 2.74 3.708 2.628C3.58 2.508 3.408 2.448 3.192 2.448C2.992 2.448 2.824 2.512 2.688 2.64C2.56 2.76 2.496 2.92 2.496 3.12H0.264C0.264 2.608 0.384 2.152 0.624 1.752C0.864 1.352 1.212 1.04 1.668 0.816C2.124 0.592 2.664 0.48 3.288 0.48C3.888 0.48 4.408 0.584 4.848 0.792C5.296 1 5.636 1.28 5.868 1.632C6.108 1.976 6.228 2.348 6.228 2.748C6.228 3.612 5.824 4.248 5.016 4.656C4.752 4.784 4.556 4.932 4.428 5.1C4.3 5.26 4.236 5.456 4.236 5.688V6.012H2.124V5.688ZM4.296 9H2.064V6.816H4.296V9Z" fill="white"/>
        </svg>
      </template>
      <template v-else>
        <span v-for="count in patientInformation?.continueReading" :key="count">
          <template v-if="!(count > 3)">+</template>
        </span>
      </template>
      <span class="check-mark" v-if="patientInformation?.reviewed">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.54448 7.5L0.333008 4.16383L1.49967 2.83333L3.54448 5.16667L8.49967 0.5L9.66634 1.14043L3.54448 7.5Z" fill="white"/>
        </svg>
      </span>
      </span>
    </div>

    <a-typography-text class="common-tag-line caption">
      <template v-if="patientInformation?.contact?.gender && patientInformation?.contact?.gender != ''">
        {{ patientInformation?.contact?.gender }},
      </template>
      <template v-if="patientInformation?.contact?.age != null">
        {{ patientInformation?.contact?.age }},
      </template>
      <template v-if="patientInformation?.placeOfService && patientInformation?.placeOfService != ''">
        at {{ patientInformation?.placeOfService }}
      </template>
      <span class="non-system-user" v-if="patientInformation?.snf">{{ patientInformation?.snf ? 'Non System User' : 'System User'  }}</span>
    </a-typography-text>

    <div class="patient-status-wrapper" v-if="patientInformation?.flagName">
      <span class="patient-status" style="background-color: #fe8139">
        <svg width="4" height="5" viewBox="0 0 4 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.38384 4.052H1.62384V2.54H0.231844V1.82H1.62384V0.308H2.38384V1.82H3.77584V2.54H2.38384V4.052Z"
            fill="white" />
        </svg>

        <span class="check-mark">
          <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.37634 3.5L0 2.07021L0.5 1.5L1.37634 2.5L3.5 0.5L4 0.774468L1.37634 3.5Z" fill="white" />
          </svg>
        </span>
      </span>
      <a-typography-text>{{ patientInformation?.flagName }}</a-typography-text>
    </div>
    <a-form-item label="Watchlist" class="watchlist">
      <a-switch :checked="patientInformation?.isWatchList" size="small" @change="updateStatus(patientInformation.udid, $event)"/>
    </a-form-item>
  </a-col>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { arrayToObjectData ,rolesPermissionFind} from '@/commonMethods/commonMethod';
export default {
  setup() {
    const store = useStore()

    const patientInformation = computed(() => {
      return store.state.patientsStore.patientInformation
    })
    const updateStatus = (id, status) => {
      const data = {
        "isWatchList": status
      };
      patientInformation.value.isWatchList = status
      store.dispatch('watchList', {id, data}).then(() => {

      })
    }
    return {
      store,
      rolesPermissionFind,
      updateStatus,
      patientInformation,
      arrayToObjectData,
      screensPermissions : store.getters.screensPermissions
    }
  }
}
</script>
