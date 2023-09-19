<template>

<Card v-for="item in totalPatients" :key="item.count" :count="parseInt(item.total)" :text='item.text' link="PatientsWithFilter" :xl="grid.xlGrid" :color="item.color" :sm="grid.smGrid" :textColor="item.textColor" :patientsFiltter="isPatient" @patientRedirect="patientRedirect" :type="item?.type"></Card>
</template>

<script>
import {  useStore} from 'vuex'
import Card from "@/components/common/cards/Card"
export default {
    props: {
        isPatient: Boolean
    },
    components: {
        Card,
    },
    setup(props, {
        emit
    }) {
        const store = useStore()
        const totalPatients = props.isPatient && props.isPatient == true ? store.getters.patientFlags : store.getters.totalPatientcount
        const grid = props.isPatient && props.isPatient == true ? store.getters.grids : store.getters.grid
        const patientRedirect = () => {
            emit("patientRedirect")
        }
        return {
            totalPatients,
            grid,
            patientRedirect
        }
    }
}
</script>
