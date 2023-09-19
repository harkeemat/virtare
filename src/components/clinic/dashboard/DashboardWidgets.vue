<template>
    <a-card v-if="arrayToObjact(widgetsPermissions, 14) && escalationList && element?.id == 14"
      :title="element?.title" class="common-card" style="height:436px">
      <template #extra >
        <a-space :size="large">
          <router-link :to="{ name: 'Escalation' }" v-if="escalationList.length > 0">View All</router-link>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              Select
              <DownOutlined />
            </a>
            <template #overlay>
              <a-checkbox-group v-model:value="showColumn.escalation">
                <a-menu>
                  <a-menu-item v-for="escalationRecord in columnData" :key="escalationRecord.id">
                    <a-checkbox :value="escalationRecord.id" @change="escalationColumnRecord($event)">
                      {{escalationRecord.title}}</a-checkbox>
                  </a-menu-item>

                </a-menu>

              </a-checkbox-group>
            </template>
          </a-dropdown> -->
          <CloseOutlined style="font-size:19px;cursor: pointer;"
            @click="remove1({ event: 'remove' })" />
        </a-space>
      </template>
      <EscaltionTable :columnData="escalationColumn" :escalationList="escalationList"
        @showEscalationData="showEscalationData($event)" :height="280" :islimit="5" />
    </a-card>
    <ApexChart v-if="arrayToObjact(widgetsPermissions, 5) && clicalTask && element?.id == 5"
      :title="element?.title" :type="element.widgetType" :height="335" :options="barChartOption(clicalTask,'Task Count')"
      :series="barChartSeries(clicalTask,'Task')"
      :linkTo="arrayToObjact(screensPermissions, 113) ? 'Tasks' : ''" listView="list"
      @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId">
    </ApexChart>
    <a-card :title="element?.title" class="common-card" style="height:436px"
      v-if="arrayToObjact(widgetsPermissions, 6) && tasksList && element?.id == 6">
      <template #extra >
        <a-space :size="large">
          <router-link :to="{
            name: 'Tasks', query: {
              view: 'list'
            }
          }" v-if="tasksList.length > 0">View All</router-link>
          <!-- <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              Select
              <DownOutlined />
            </a>
            <template #overlay>
              <a-checkbox-group v-model:value="showColumn.task">
                <a-menu>
                  <a-menu-item v-for="task in tasksListColumns" :key="task.id">
                    <a-checkbox :value="task.id" @change="taskColumnRecord($event)">{{task.title}}
                    </a-checkbox>
                  </a-menu-item>

                </a-menu>

              </a-checkbox-group>
            </template>
          </a-dropdown> -->
          <CloseOutlined style="font-size:19px;cursor: pointer;"
            @click="remove1({ event: 'remove' }, index,'left')" />
        </a-space>
      </template>
      <TaskTable @is-Edit="editTask($event)" :height="285" :tasksListColumns="tasksColumns"
        @dashboard="taskApiCall" :islimit="5">
      </TaskTable>
    </a-card>
    <a-card :title="element?.title" class="common-card" style="height:436px"
      v-if="arrayToObjact(widgetsPermissions, 15)  && element?.id == 15">
      <template #extra >
        <a-space :size="large">
          <!-- <router-link :to="{
            name: 'Tasks', query: {
              view: 'list'
            }
          }" v-if="tasksList.length > 0">View All</router-link> -->
          <!-- <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              Select
              <DownOutlined />
            </a>
            <template #overlay>
              <a-checkbox-group v-model:value="showColumn.task">
                <a-menu>
                  <a-menu-item v-for="task in tasksListColumns" :key="task.id">
                    <a-checkbox :value="task.id" @change="taskColumnRecord($event)">{{task.title}}
                    </a-checkbox>
                  </a-menu-item>

                </a-menu>

              </a-checkbox-group>
            </template>
          </a-dropdown> -->
          <CloseOutlined style="font-size:19px;cursor: pointer;"
            @click="remove1({ event: 'remove' }, index,'left')" />
        </a-space>
      </template>
      <Appointment   :columns="appointmentCollumn"  />
      </a-card>
    
    <ApexChart v-if="arrayToObjact(widgetsPermissions, 1) && patientsFlag && element?.id == 1"
      :title="element?.title" :type="element.widgetType" :height="335" :options="barChartOption(patientsFlag,'Patients Status Count')"
      :series="barChartSeries(patientsFlag,'Patients Status')" :linkTo="arrayToObjact(screensPermissions, 65) ? 'PatientsWithFilter' : ''"
      @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId">
    </ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions, 2) && appointmentCount && element.widgetType == 'bar' &&element?.id == 2"
      :title="element?.title" :type="element.widgetType" :height="335" :options="barChartOption(appointmentCount?.categories,'Number of appointments',appointmentCount.format,appointmentCount.type)"
      :series="barChartSeries(appointmentCount?.data,'New Appointment')"
      :linkTo="arrayToObjact(screensPermissions, 112) ? 'AppointmnetCalendar' : ''"
      @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId">
    </ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions, 2) && appointmentCount && element.widgetType == 'line' &&element?.id == 2"
      :title="element?.title" type="line" :options="lineChartOption(appointmentCount.categories,'Number of appointments',false,appointmentCount.format,appointmentCount.type)"
      :series="lineChartSeries(appointmentCount.data,'New Appointment')"
      :linkTo="arrayToObjact(screensPermissions, 112) ? 'AppointmnetCalendar' : ''"
      @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId">
    </ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions, 2) && appointmentCount && element.widgetType == 'area' &&element?.id == 2"
      :title="element?.title" :type="element.widgetType"  :options="barChartOption(appointmentCount.categories,'Number of appointments',appointmentCount.format,appointmentCount.type)"
      :series="barChartSeries(appointmentCount.data,'New Appointment')"
      :linkTo="arrayToObjact(screensPermissions, 112) ? 'AppointmnetCalendar' : ''"
      @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId">
    </ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions, 2) && appointmentCount && element.widgetType == 'pie' && element?.id == 2"
      :title="element?.title" :type="element.widgetType"  :options="pieChartOption(appointmentCount.categories,false)"
      :series="pieChartSeries(appointmentCount.data)"
      :linkTo="arrayToObjact(screensPermissions, 112) ? 'AppointmnetCalendar' : ''"
      @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId">
    </ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions, 13) && escalationRecord && element?.id == 13"
      :title="element?.title" :type="element.widgetType" :height="335" :options="barChartOption(escalationRecord,'Escalations Count')"
      :series="barChartSeries(escalationRecord,'Escalations')" :linkTo="arrayToObjact(screensPermissions, 404) ? 'Escalation' : ''"
      :data="escalationRecord" @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId"></ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions,3) && callStatus && element.id==3" :title="element?.title" type="bar" :height="360" :options="callStatus.calloption" :series="callStatus.callseries" linkTo="Communications" listView="list"  @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId"/>
    <ApexChart v-if="arrayToObjact(widgetsPermissions,8) &&  cptCodeValue && element.id==8" :title="element?.title" type="bar" :height="360" :options="cptCodeValue.code" :series="cptCodeValue.value" linkTo="TimeLogReport"  @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId"></ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions,9) &&  referalCount && element.id==9" :title="element?.title" type="bar" :height="360" :options="referalCount.code" :series="referalCount.value" linkTo="Referral" :data="referalCountRecord"  @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId"></ApexChart>
    <ApexChart v-if="arrayToObjact(widgetsPermissions,7) && financialValue && element.id==7" :title="element?.title" type="pie" :height="340" :options="financialValue.billed" :series="financialValue.due" linkTo="time-log-report"  @actionClick="remove1($event)" :show="true" :dateTimeLineId="dateTimeLineId"></ApexChart>
</template>
<script>
import { CloseOutlined } from "@ant-design/icons-vue";

import { computed, reactive, } from "vue";

import ApexChart from "@/components/common/charts/ApexChart.vue";
import { arrayToObjact, barChartOption, barChartSeries, pieChartOption, pieChartSeries,lineChartSeries,lineChartOption } from "@/commonMethods/commonMethod";
import { useStore } from "vuex";
import EscaltionTable from "@/components/common/tables/EscalationTable.vue";
import TaskTable from "@/components/tasks/TaskTable.vue";
import Appointment from '@/components/clinic/dashboard/Appointment.vue'

const appointmentCollumn = [
    {
      title: "Patient Name",
      dataIndex: "patient",
      slots: {
        customRender: "patientName",
      },
      width: '30%',
      onCell: () => {
         return {
            style: {
               whiteSpace: 'nowrap',
               maxWidth: 10,
            }
         }
      },
      // render: (text) => (
      //    <Tooltip title={text}>
      //       <div style="textOverflow: ellipsis, overflow: hidden">{text}</div>
      //    </Tooltip>
      // )
  },
    {
      title: "Date Time",
      dataIndex: 'date',
    },
    {
      title: "Appointment With",
      dataIndex: "staff",
      slots: {
        customRender: "staff",
      },
    },
  ];
export default {
    components: {
        ApexChart,
        EscaltionTable,
        TaskTable,
        CloseOutlined,
        Appointment
        //DownOutlined
    },
props:{
    element:Object,
    escalationColumn:Array,
    columnData:Array,
    tasksColumns:Array,
    showColumnsRecord:Array,
    tasksListColumns:Array,
    dateTimeLineId:Number
},
    setup(props,{emit}) {
        const store = useStore();
        const showColumn= reactive(props.showColumnsRecord)
        const showEscalationData = (event) => {
            emit("showEscalationData",event)
        }
        const escalationList = computed(() => {
            return store.state.escalations.escalation;
        });
        const chartTypeRecordOption = (data,type,name=null,format=null,xtype=null) =>{
               if(type=="bar"){
               return  barChartOption(data,name,format,xtype)
               }else if(type=="pie"){
                return  barChartOption(data,name,format,xtype)
               }
        }
        const screensPermissions = store.getters.screensPermissions;
        const taskUrl = arrayToObjact(screensPermissions.value, 113) ? "Tasks" : "";
        const PatientUrl = arrayToObjact(screensPermissions.value, 65)
            ? "PatientsWithFilter"
            : "";
        const AppointmentsUrl = arrayToObjact(screensPermissions.value, 112)
            ? "AppointmnetCalendar"
            : "";
        const escalationUrl = arrayToObjact(screensPermissions.value, 404)
            ? "Escalation"
            : "";
        function taskApiCall() {
           emit("taskApiCall")
        }

        const remove1 = (event) => {
            emit("actionClick",event)
        };
        const escalationColumnRecord = (event) => {
            emit("escalationColumnRecord",event)

        }
        const taskColumnRecord = (event) => {
           emit("taskColumnRecord",event)
        }

        // const clicalTask = computed(()=>{
        //   return store.state.clinicalDashboard.clicalTask 
        // })

        return {
            clicalTask: store.getters.clicalTask,
            patientsFlag: store.getters.patientsFlag,
            appointmentCount: store.getters.appointmentCount,
            widgetsPermissions: store.getters.widgetsPermissions,
            escalationRecord: store.getters.escalationRecord,
            arrayToObjact,

            escalationList,
            showEscalationData,
            tasksList: store.getters.tasksList,
            taskApiCall,
            screensPermissions,
            taskUrl,
            PatientUrl,
            AppointmentsUrl,
            escalationUrl,
            remove1, 
            barChartOption,
            barChartSeries,
            pieChartOption,
            pieChartSeries,
            escalationColumnRecord,
            taskColumnRecord,
            showColumn,
            chartTypeRecordOption,
            lineChartSeries,
            lineChartOption,
            referalCountRecord:store.getters.referalCountRecord,
            callStatus:store.getters.callStatus,
            cptCodeValue:store.getters.cptCodeValue,
            financialValue:store.getters.financialValue,
            referalCount:store.getters.referalCount,
            appointmentCollumn
        };
    },
};
</script>
<style lang="scss" scoped>
.dragDrop {
    width: 100%;
    height: 400px;
}

.addMoreWidget {
    height: 440px;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .anticon {
        font-size: 150px;
        cursor: pointer;
    }
}
</style>