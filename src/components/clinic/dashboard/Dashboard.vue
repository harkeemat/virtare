<template>
  <!-- v-if="arrayToObjact(screensPermissions, 65) ||
              arrayToObjact(widgetsPermissions, 13) ||
              arrayToObjact(widgetsPermissions, 5) ||
              arrayToObjact(widgetsPermissions, 2) ||
              arrayToObjact(widgetsPermissions, 14) ||
              arrayToObjact(widgetsPermissions, 6)" -->
<a-layout-content>
    <div class="common-bg">
        <a-row>
            <a-col :span="24">
                <h2 class="pageTittle clinicalDashboard">
                    Clinical Dashboard
                    <!-- <DateFilter :Buttons="dashBoard?.timeLineButton" @clickButtons="showButton($event)" :hideArray="hideFilterClinicDashboard" commit="timelineSuccess" v-if="widgetsPermissions?.length > 0" /> -->
                </h2>
                
                <EmptyTable  :text="'We will update soon!'" /> 
            </a-col>
            <!-- <a-col :span="24">
                <a-row :gutter="24" v-if="arrayToObjact(screensPermissions, 65) && grid">
                    <PatientCounterCards :isPatient="false" />
                </a-row>
            </a-col> -->
        </a-row>
        <!-- <a-row :gutter="20" style="margin-top:20px">
            <a-col :span="12" v-if="widgetRecords?.leftWidget?.length > 0">

                <draggable class="" :list="widgetRecords?.leftWidget" group="people" @change="log" :move="moveLeft">
                    <div v-for="(element, index) in widgetRecords?.leftWidget" :key="index">
                        <DashboardWidgets :element="element" :escalationColumn="escalationColumn" :columnData="columnData" :tasksColumns="tasksColumns" :showColumnsRecord="showColumnsRecord" @showEscalationData="showEscalationData($event)" @actionClick="remove1($event, index,'left')" @escalationColumnRecord="escalationColumnRecord($event)" @taskColumnRecord="taskColumnRecord($event)" @taskApiCall="taskApiCall" :tasksListColumns="tasksListColumns" :dateTimeLineId="Buttons?.globalCodeId"/>
                    </div>
                </draggable>
            </a-col>
            <a-col :span="12" v-if="widgetRecords?.rightWidget?.length > 0">
                <draggable :list="widgetRecords?.rightWidget" group="people" @change="log" :move="checkMoveRight">
                    <div v-for="(element, index) in widgetRecords?.rightWidget" :key="index">
                        <DashboardWidgets :element="element" :escalationColumn="escalationColumn" :columnData="columnData" :tasksColumns="tasksColumns" :showColumnsRecord="showColumnsRecord" @showEscalationData="showEscalationData($event)" @actionClick="remove1($event, index,'right')" @escalationColumnRecord="escalationColumnRecord($event)" @taskColumnRecord="taskColumnRecord($event)" @taskApiCall="taskApiCall" :tasksListColumns="tasksListColumns" :dateTimeLineId="Buttons?.globalCodeId"/>
                    </div>
                </draggable>
            </a-col>
            <a-col :span="24">
                <div class="addMoreWidget">
                    <a-popover>
                        <template #content>
                            <p>Add More Widgets</p>
                        </template>
                        <PlusCircleOutlined @click="addWidgetLeft({ show: true })" />
                    </a-popover>
                </div>
            </a-col>
        </a-row> -->
    </div>
    <DashboardLoader class="fullLoader" />
</a-layout-content>
<!-- <EscaltionViewModal v-model:visible="escaltionViewModal" />
<EscaltionModal v-model:visible="escaltionModal" @saveModal="saveModal($event)" :isEdit="isEdit" v-if="escaltionModal" />
<AddWidgetModal v-model:visible="widgetShow" v-if="widgetShow" @saveModal="getWidget($event)" :list1="widgetRecords?.leftWidget" :list2="widgetRecords?.rightWidget" :align="align" :tasksColumns="tasksColumns" :escalationColumn="escalationColumn" />
<TasksModal v-model:visible="visible" @saveTaskModal="handleOk($event)" :taskId="taskID" /> -->
</template>
<script setup>
import EmptyTable from "@/components/administration/clients/EmptyTable.vue";
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
.noData {
  height: calc(100vh - 88px);
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

