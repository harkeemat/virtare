<template>
<a-layout-content>
    <div class="common-bg">
        <a-row :gutter="20">
            <a-col :span="12">
                <h2 class="pageTittle">Custom Dashboard</h2>
            </a-col>
        </a-row>
        <a-row :gutter="20">
            <a-col :span="4">
                <div class="formBuilderLeft">
                    <div class="body">
                        <a-collapse v-model:activeKey="activeKey" expandIconPosition="right">
                            <a-collapse-panel key="1" header="Widget">
                                <draggable class="" :list="components" :group="{ name: 'people', pull: 'clone', put: false }" :sort="true" @change="log" :move="checkMove">
                                    <div v-for="element in components" :key="element.id">
                                        <div class="item">
                                            <FontColorsOutlined />
                                            <span> {{ element.name }}</span>
                                        </div>
                                    </div>
                                </draggable>
                            </a-collapse-panel>
                        </a-collapse>
                    </div>
                </div>
            </a-col>
            <a-col :span="20">
                <div class="formBuilderCenter">
                    <a-row>
                        <a-col :span="12" v-if="list2?.length > 0">
                            <draggable class="" :list="list2" group="people" @change="log" :move="checkMove">
                                <div v-for="(element, index) in list2" :key="index">
                                    <div class="formWrapper">
                                        <div class="sectionGroup">
                                            <div class="head">
                                                <span class="title">{{ element.name }}</span>
                                                <div class="actions">
                                                    <a-dropdown>
                                                        <a class="ant-dropdown-link" @click.prevent>
                                                            <MoreOutlined />
                                                        </a>
                                                        <template #overlay>
                                                            <a-menu>
                                                              <a-menu-item @click="remove1(index)">
                                                                    <a href="javascript:;">Remove</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">2nd menu item</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">3rd menu item</a>
                                                                </a-menu-item>
                                                            </a-menu>
                                                        </template>
                                                    </a-dropdown>
                                                    <a-dropdown>
                                                        <a class="ant-dropdown-link" @click.prevent>
                                                            <SettingOutlined />
                                                        </a>
                                                        <template #overlay>
                                                            <a-menu>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">1st menu item</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">2nd menu item</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">3rd menu item</a>
                                                                </a-menu-item>
                                                            </a-menu>
                                                        </template>
                                                    </a-dropdown>
                                                </div>
                                            </div>
                                           
                <ApexChart v-if="escalationCount && element.name=='Escalations'"  type="bar" :height="350" :options="escalationCount.code" :series="escalationCount.value" :linkTo="arrayToObjact(screensPermissions,404)?'Escalation':''" :data="escalationRecord"></ApexChart>
          
            
                <a-card v-if="escalationList && element.name=='Escalations List'" title="Escalations List" class="common-card" style="height:436px">
                    <template #extra v-if="escalationList.length > 0">
                        <router-link :to="{name:'Escalation'}">View All</router-link>
                    </template>
                    <EscaltionTable :columnData="columnData" :escalationList="escalationList" @showEscalationData="showEscalationData($event)" :height="286" :islimit="5"/>
                </a-card>
          
            
                <ApexChart v-if="clicalTask && element.name=='Tasks'" title="Tasks " type="bar" :height="350" :options="clicalTask.code" :series="clicalTask.value" :linkTo="arrayToObjact(screensPermissions,113)?'Tasks':''" listView="list" ></ApexChart>
           
            
                <a-card title="Tasks List" class="common-card" style="height:436px" v-if="tasksList && element.name=='Tasks List'">
                    <template #extra v-if="tasksList.length > 0">
                        <router-link :to="{ name:'Tasks',query: {
                            view: 'list'
                        }}">View All</router-link>
                    </template>
                    <TaskTable @is-Edit="editTask($event)" :height="285" :tasksListColumns="tasksListColumns" @dashboard="taskApiCall" :islimit="5"></TaskTable>
                </a-card>
         
            
                <ApexChart v-if="patientsFlag && element.name=='Patient Status'" title="Patient Status" type="bar" :height="350" :options="patientsFlag.code" :series="patientsFlag.value" :linkTo="arrayToObjact(screensPermissions,65)?'PatientsWithFilter':''"></ApexChart>
           
           
                <ApexChart v-if="appointmentCount && element.name=='Appointments'" title="Appointments" type="bar" :height="350" :options="appointmentCount.chartOptions" :series="appointmentCount.value" :linkTo="arrayToObjact(screensPermissions,112) ? 'AppointmnetCalendar':''"></ApexChart>
            
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                        </a-col>
                        <a-col :span="12" v-else>
                            <draggable class="" :list="list2" group="people" @change="log" :move="checkMove">
                                <div class="dragDrop">
                                    <!-- <img src="@//assets/images/drag.svg" /> -->
                                    <a-typography-title :level="4">Left widget</a-typography-title>
                                </div>
                            </draggable>
                        </a-col>
                        <a-col :span="12" v-if="list3?.length > 0">
                            <draggable class="" :list="list3" group="people" @change="log" :move="checkMove">
                                <div v-for="(element, index) in list3" :key="index">
                                    <div class="formWrapper">
                                        <div class="sectionGroup">
                                            <div class="head">
                                                <span class="title">{{ element.name }}</span>
                                                <div class="actions">
                                                    <a-dropdown>
                                                        <a class="ant-dropdown-link" @click.prevent>
                                                            <MoreOutlined />
                                                        </a>
                                                        <template #overlay>
                                                            <a-menu>
                                                                <a-menu-item @click="remove2(index)">
                                                                    <a href="javascript:;">Remove</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">2nd menu item</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">3rd menu item</a>
                                                                </a-menu-item>
                                                            </a-menu>
                                                        </template>
                                                    </a-dropdown>
                                                    <a-dropdown>
                                                        <a class="ant-dropdown-link" @click.prevent>
                                                            <SettingOutlined />
                                                        </a>
                                                        <template #overlay>
                                                            <a-menu>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">1st menu item</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">2nd menu item</a>
                                                                </a-menu-item>
                                                                <a-menu-item>
                                                                    <a href="javascript:;">3rd menu item</a>
                                                                </a-menu-item>
                                                            </a-menu>
                                                        </template>
                                                    </a-dropdown>
                                                </div>
                                            </div>
                                            <div class="body">Here is body content</div>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                        </a-col>
                        <a-col :span="12" v-else>
                            <draggable class="" :list="list3" group="people" @change="log" :move="checkMove">
                                <div class="dragDrop">
                                    
                                    <a-typography-title :level="4">Right widget</a-typography-title>
                                </div>
                            </draggable>
                        </a-col>
                    </a-row>
                </div>
            </a-col>
        </a-row>
    </div>
</a-layout-content>
</template>

<script>
import {  defineComponent,   onMounted,  reactive,   ref,   watch,computed} from "vue";

import {  FontColorsOutlined} from "@ant-design/icons-vue";
//import { VueDraggableNext} from "vue-draggable-next";
import { MoreOutlined, SettingOutlined} from "@ant-design/icons-vue";
import moment from "moment";
import { useStore } from "vuex";
import ApexChart from "@/components/common/charts/ApexChart"
import {
    startimeAdd,
    endTimeAdd,
    timeStamp,
    arrayToObjact
} from '@/commonMethods/commonMethod'
const columnData = [{
        title: "Name",
        dataIndex: "patientName",
        sorter: true,
        slots: {
            customRender: "patientName",
        },
    },
    {
        title: "Type",
        dataIndex: "escalationType",
        sorter: true,
        slots: {
            customRender: "escalationType",
        },
    },

    
    {
  title: "Assigned By",
  dataIndex: "assignedBy",
  sorter: true,
  slots:{
      customRender: "assignedBy",
  },
  },

    {
        title: "Action",
        dataIndex: "action",
        slots: {

            customRender: "action",
        },
    },
];
const tasksListColumns = [{
        title: 'Task Name',
        dataIndex: 'title',
        sorter: true,
        slots: {
            customRender: 'taskName'
        }

    },

    {
        title: 'Priority ',
        dataIndex: 'priority',

    },
    {
        title: 'Category',
        dataIndex: 'category',
        sorter: true,
        slots: {
            customRender: 'category'
        }
    },
    {
        title: 'Start Date ',
        dataIndex: 'startDate',
        sorter: true
    },

    {
        title: 'Due Date ',
        dataIndex: 'dueDate',
        sorter: true
    },

];
export default defineComponent({
    components: {
        MoreOutlined,
        SettingOutlined,
        FontColorsOutlined,
        //draggable: VueDraggableNext,
        ApexChart
    },
    setup() {
      const store = useStore()
        const components = reactive([{
                id: 1,
                name: "Escalations",
                type: "bar",
                placeholder: "",
            },
            {
                id: 2,
                name: "Escalations List",
                type: "table",
                placeholder: "",
            },
            {
                id: 3,
                name: "Tasks",
                type: "bar",
                placeholder: "",
            },
            {
                id: 4,
                name: "Tasks List",
                type: "table",
                placeholder: "",
            },
            {
                id: 5,
                name: "Patient Status",
                type: "bar",
                placeholder: "",
            },
            {
                id: 6,
                name: "Appointments",
                type: "bar",
                placeholder: "",
                validation: null,
            },
        ]);
        const list2 = ref([]);
        const list3 = ref([]);
        const escalationList = computed(() => {
            return store.state.escalations.escalation;
        });
        
        onMounted(()=>{
        
         let  dateFormate = {
                    fromDate: timeStamp(startimeAdd(moment())),
                    toDate: timeStamp(endTimeAdd(moment()))
                }
          store.dispatch("permissions")
            store.dispatch("clicalTask", dateFormate)
            store.dispatch("callStatus", dateFormate)
            store.dispatch("patientsFlag", dateFormate)

            store.dispatch("tasksList", "?fromDate=" + dateFormate.fromDate + "&toDate=" + dateFormate.toDate + '&islimit=5');
            store.dispatch("appointmentCount", dateFormate)
            store.dispatch("escalationCount", dateFormate)
            store.dispatch("escalation", "?fromDate=" + dateFormate.fromDate + "&toDate=" + dateFormate.toDate + "&islimit=5" + "&entityType=patient")
        })
        const update = () => {};

        const close = () => {};

        const remove1 = (value) => {
            let temp = [];
            temp = list2.value;
            list2.value = temp.filter((item, index) => index !== value);
        };
        const remove2 = (value) => {
            let temp = [];
            temp = list3.value;
            list3.value = temp.filter((item, index) => index !== value);
        };
        const handleClick = (event) => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
        };
        const activeKey = ref();
        watch(activeKey, () => {
            
        });
        const setDimensions = () => {
           
        };

        return {
            close,

            update,
            remove1,
            remove2,
            components,
            list2,
            list3,
 
            handleClick,
            activeKey,
            setDimensions,
            clicalTask: store.getters.clicalTask,
            
            escalationCount: store.getters.escalationCount,
            patientsFlag: store.getters.patientsFlag,
            appointmentCount: store.getters.appointmentCount,
            widgetsPermissions: store.getters.widgetsPermissions,
            escalationRecord: store.getters.escalationRecord,
            // totalPatients: store.getters.totalPatientcount,
            arrayToObjact,
            columnData,
            escalationList,
            tasksList: store.getters.tasksList,
            tasksListColumns,
            screensPermissions: store.getters.screensPermissions,
        };
    },
});
</script>

<style lang="scss">
.formName {
  border: 0.5px solid transparent;

  &:hover {
    border: 0.5px solid #e3e3e3;
  }

  &:focus {
    border: 1px solid #40a9ff;
  }
}

.formBuilderLeft {
  background-color: #f9f9f9;
  height: 100%;

  .head {
    padding: 10px 15px;
    font-size: 18px;
    border-bottom: 1px solid #000;
  }

  .body {
    // height: calc(100vh - 215px);
    height: calc(100vh - 166px);
    overflow: auto;

    .ant-collapse {
      border: none;

      .ant-collapse-item {
        .ant-collapse-header {
          padding: 10px 15px;
          font-size: 15px;
          border: none;
          font-weight: 600;
        }

        .ant-collapse-content {
          border: none;

          .ant-collapse-content-box {
            padding: 0;
            border: 1px solid #d9d9d9;
            border-bottom: none;

            > div {
              &:last-child {
                .item {
                  border: none;
                }
              }
            }
          }
        }
      }
    }

    .item {
      padding: 10px 12px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      cursor: pointer;

      span {
        margin-left: 10px;
      }
    }
  }

  &.properties {
    .body {
      padding: 15px;
    }
  }
}

.formBuilderCenter {
  height: calc(100vh - 165px);
  border: 1px solid #d9d9d9;
  overflow: auto;
  padding: 10px;

  .dragDrop {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 100px;
      margin: 0 0 20px;
    }
  }

  .formWrapper {
    padding: 10px;

    .formGroup {
      margin: 0 0 15px;
      position: relative;

      &:hover {
        .actions {
          visibility: visible;
        }
      }

      label.formLabel {
        font-size: 16px;
        line-height: 35px;
        display: block;
      }

      .actions {
        position: absolute;
        right: 0;
        top: 10px;
        gap: 10px;
        align-items: center;
        display: flex;
        visibility: hidden;

        .anticon {
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
  }

  .sectionGroup {
    margin: 10px;
    border: 1px solid #e3e3e3;
    display: inline-block;
    min-width: 200px;
    min-height: 100px;
    resize: both;
    overflow: auto;
    vertical-align: top;
    width: 100%;

    .head {
      position: relative;
      padding: 10px 60px 10px 10px;
      background-color: #f9f9f9;

      span.title {
        display: inline-block;
        font-size: 15px;
      }

      .actions {
        position: absolute;
        right: 10px;
        top: 14px;
        gap: 10px;
        align-items: center;
        display: flex;

        .anticon {
          font-size: 18px;
          cursor: pointer;
        }
      }
    }

    .body {
      padding: 15px;
    }
  }
}

.item {
  padding: 10px 12px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
}

</style>
