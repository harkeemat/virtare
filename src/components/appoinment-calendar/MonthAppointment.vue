<template>
<div class="monthCalendarView">
    <FullCalendar v-if="appointments" :options="option" ref="cal">
    </FullCalendar>
</div>
</template>

<script>
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue3'
import {
    dateFormat
} from "@/commonMethods/commonMethod"
import {
    reactive,
    ref,
    computed,
    watchPostEffect,
    onMounted,
    createVNode
} from 'vue'

import dayGridPlugin from '@fullcalendar/daygrid'
import TimeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import {
    useStore
} from "vuex"


export default {
    components: {
        FullCalendar,

    },
    props: {
        seclectDate: {
            type: String
        },
        appointment: {
            type: Array
        }

    },
    setup(props, {emit}) {

        const linkTo = "patients-summary"
        const cal = ref(null);
        const store = useStore()
        const seclectDate = reactive(props.seclectDate)
        
        function handleDateClick(e) {
            emit("is-dateClick", e)

        }
        const appointments = computed(() => {
            return store.state.appointment.searchAppointmentRecords
        })
        onMounted(()=>{
            
            appointments.value.map((item)=>{
                if(!item?.appoinmentStatus){
                        document.getElementById(item.udid).addEventListener("click", function(event) {
                        appointmentDetails(event)
                       })
                }
            })
            
        })
        watchPostEffect(()=>{
            
            
        })
        const option = {
            plugins: [dayGridPlugin, interactionPlugin, TimeGridPlugin, ListPlugin],
            headerToolbar: {
                left: 'prev next',
                center: 'title',
                right: '',
            },
            initialDate: dayjs(seclectDate).format('YYYY-MM-DD'),
            initialView: 'dayGridMonth',
            timeZone: 'UTC',
            contentHeight: 'auto',
            dayMaxEvents: 2,
            moreLinkClick: function (e) {
                handleDateClick(e.date)
                return '+' + e.num + ' More items';
            },
            showNonCurrentDates: true,
            events: reactive(props.appointment),
            eventContent: renderEventContent,
            customButtons: {
                prev: { // this overrides the prev button
                    text: 'prev',
                    click: () => {
                        nextOrPrev('prev')

                    }
                },
                next: { // this overrides the next button
                    text: 'next',
                    click: () => {
                        nextOrPrev('next')

                    }
                }
            }

        }

        function renderEventContent(clickInfo) {

            var getData = clickInfo.event._def //<div class="itemWrapper"><div class="leftWrapper">Time Zone</div><div class="rightWrapper">` +getData.extendedProps.timezone?getData.extendedProps.timezone.data.UTCOffset:'' +`</div> </div>
            var customHtml = '';
            customHtml += `<div><a class="ant-dropdown-link one ant-dropdown-trigger custom" onclick="popupShow('monthCalendarDropDown` + getData.extendedProps.time + `')"><div class="dropdown"><p><strong><span>` + getData.extendedProps.appointmentType + `</span></strong><span>` + getData.extendedProps.patient + `</span></p></div></a></div>`
            customHtml += `<div id="monthCalendarDropDown` + getData.extendedProps.time + `" class="monthCalendarDropDown ant-dropdown valueItem ant-dropdown-placement-bottomLeft" style="display:none"><ul class="ant-dropdown-menu ant-dropdown-menu-root ant-dropdown-menu-vertical ant-dropdown-menu-light ant-dropdown-content"><li class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" data-menu-id="1" aria-disabled="false"><div class="calendarDropdown"><div class="itemWrapper"><div class="leftWrapper"> Appointment Type </div>`
            customHtml += `<div class="rightWrapper">` + getData.extendedProps.appointmentType + `</div></div><div class="itemWrapper"><div class="leftWrapper">Date Time</div><div class="rightWrapper">` + dateFormat(getData.extendedProps.time) + `</div></div><div class="itemWrapper"><div class="leftWrapper">Coordinator</div><div class="rightWrapper"><a href="#/coordinator-summary/`+getData.extendedProps.staff_id+`" class="">` + getData.extendedProps.staff + `</a></div></div><div class="itemWrapper"><div class="leftWrapper">Patient</div><div class="rightWrapper"><a href="#/patients-summary/`+getData.extendedProps.patient_id+`" class="">` + getData.extendedProps.patient + `</a></div></div>`
            customHtml += ` <div class="itemWrapper"><div class="leftWrapper">Start Time</div><div class="rightWrapper">` + dayjs(dateFormat(getData.extendedProps.time)).format('hh:mm A') +' '+getData.extendedProps?.abbr + `</div></div> `
            customHtml += ` <div class="itemWrapper"><div class="leftWrapper">Duration</div><div class="rightWrapper">` + getData.extendedProps.timeGet + `</div></div>`
            customHtml += `<div class="itemWrapper"><div class="leftWrapper">Priority</div><div class="rightWrapper"><span >`+getData.extendedProps?.flagName+`</span></div></div>`
            customHtml += `<div class="itemWrapper"><div class="leftWrapper">Flags</div><div class="rightWrapper"><span class="box" title="`+getData.extendedProps.flagName+`" style="background-color: `+getData.extendedProps.flags+`"></span></div></div><div class="notesWrapper"><span>Notes</span><p>`+getData.extendedProps.notes+`</p></div><div class="notesWrapper">`
            if(getData?.extendedProps?.appoinmentStatus){
                customHtml += `<button  class="ant-btn ant-btn-primary" disabled>`+getData.extendedProps?.appoinmentStatus+`</button>` 
            }else{
            customHtml += `<button class="ant-btn ant-btn-primary" id="`+getData.extendedProps.udid+`" data-value="`+getData.extendedProps.udid+`" >Appointment Status</button>`
            }
            customHtml += `<br> </a-space></p></div></div></li></ul></div>`
            
         
            return {
                html: customHtml
            }
        }

        
        function getDate(value) {
            store.state.appointment.searchAppointmentRecords = ''
            store.dispatch("searchAppointment", {
                fromDate: value,
                toDate: value,
                tabId: 4
            })
        }

        const linkToCoordinator = "coordinator-summary"

        function nextOrPrev(text) {
            let calendarApi = cal.value.getApi();
            if (text == "next") {
                calendarApi.next();
            } else {
                calendarApi.prev();
            }
           
            emit("is-month", dayjs(calendarApi.currentData.currentDate))
        }
        function appointmentDetails(event) {
            event.target.disabled =true
            Modal.confirm({
                title: 'Please indicate appointment status: Attended or Not Attended.',
                icon: createVNode(ExclamationCircleOutlined),
                
                okText: 'Attended',
                cancelText: 'Not Attended',
                onOk() {

                    store.dispatch("appointmentStatus",{id:event.target.dataset.value,data:{appoinmentStatus:1}})
                let node =  document.getElementById(event.target.dataset.value)
                node.disabled = true;
                node.innerHTML = "Attended"
                },
                onCancel() {
                    store.dispatch("appointmentStatus",{id:event.target.dataset.value,data:{appoinmentStatus:2}})
                    let node =  document.getElementById(event.target.dataset.value)
                    node.disabled = true;
                    node.innerHTML = "Not Attended"
                },
                class: 'modalH-auto',
            });
            
    
    }
        return {
            dayGridPlugin,
            interactionPlugin,
            TimeGridPlugin,
            ListPlugin,
            dayjs,
            linkToCoordinator,
            cal,
            getDate,
            appointments,
            renderEventContent,
            handleDateClick,
            nextOrPrev,
            linkTo,
            option,
            appointmentDetails

        }
    }
}
</script>
