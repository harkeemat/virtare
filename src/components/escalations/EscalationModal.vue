<template>
  <a-modal class="escalationModal" max-width="1140px" width="95%" :title="'Report Escalation'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
      <a-row :gutter="24">
          <a-col :span="patientDetails.patientDetails?14:24" v-if="!previewStatus">
              <a-row :gutter="24">
                  <a-col :span="24">
                      <a-steps v-model:current="current" >
                          <a-step v-for="item in steps" :key="item.title" :title="item.title ? item.title : ''" />
                      </a-steps>
                  </a-col>
                  <a-col :span="24" style="padding-top:25px">
                      <div class="steps-content" v-if="steps[current]?.title == 'Escalation Info'">
                          <a-form layout="vertical" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,4,'id','name'),'name','udid')" ref="formRef" :model="escalationInfo" @finish="submitInfo" @finishFailed="onFinishFailed">
                              <div class="innerForm">
                                  <a-row :gutter="24">
                                      <a-col :sm="24" :xs="24" v-if="!paramId && !patientId">
                                          <div class="form-group" >
                                              <a-form-item label="Patient" name="referenceId" :rules="[{ required: true, message: 'Patient'+' '+$t('global.validation')  }]">
                                                  <PatientDropDown  :editDataPatient="editDataPatient" v-model:value="escalationInfo.referenceId" @handlePatientChange="handlePatientChange($event);checkChangeInput()" :close="closeValue" />
                                              </a-form-item>
                                          </div>
                                      </a-col>
                                      <a-col :sm="24" :xs="24">
                                        <div class="form-group" >
                                          <a-form-item  label="Escalation Type" name="type" :rules="[{ required: false, message: 'Type' + ' ' + $t('global.validation') }]">
                                              <a-radio-group v-model:value="escalationInfo.type" class="d-flex ">
                                                  <a-radio v-for="esc in globalCode.escalationType" :key="esc.id" :value="esc.id">{{esc.name}}</a-radio>
                                              </a-radio-group>
                                          </a-form-item>
                                        </div>
                                      </a-col>
                                    <a-col :sm="24" :xm="24" >
                                    <div class="form-group">
                                      <a-form-item label="Reason For Escalation" name="reason" :rules="[{ required: false, message: $t('tasks.tasksModal.longDescription')+' '+$t('global.validation')  }]">
                                          <a-textarea v-model:value="escalationInfo.reason" placeholder="Description" :auto-size="{ minRows: 3 }" @change="checkChangeInput()" />
                                      </a-form-item>
                                  </div>
                              </a-col>
                                  </a-row>
                              </div>
                              <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,4,'id','name'),'name','udid')"> </FormBaseComponents>
                              <div class="steps-action">
                                  <a-button type="primary" html-type="submit">{{ $t('global.next') }}</a-button>
                              </div>
                          </a-form>
                      </div>
                  </a-col>
                  <a-col :span="24">
                      <div class="steps-content" v-if="steps[current]?.title == 'Assign To'">
                          <a-form layout="vertical" ref="formRef" :model="escalationAssignTo" @finish="submitAssignTo" @finishFailed="onFinishFailed">
                              <div class="innerForm">
                                  <a-row :gutter="24">
                                      <a-col :sm="24">
                                        <div v-if="assignToError" class="errorMsg">{{assignToError}}</div>
                                          <a-tabs v-model:activeKey="assignTo">
                                              <a-tab-pane key="1" tab="Care Coordinator">
                                                  <!-- <SearchField endPoint="patientCareCoordinatorsList" class="mb-24" /> -->
                                                  <a-table  class="sortIconTable" rowKey="staffId" :scroll="{ x:'',y:'calc(100vh - 490px)' }" :row-selection="{ selectedRowKeys: escalationAssignTo.staffIds, onChange: onSelectCareCoordinator, getCheckboxProps:(record) => ({   disabled: record.isPrimary }) }" :columns="escalationData.staffColumns" :data-source="careTeam.physiciansList" @change="onChange" :pagination="false">
                                                      <template #name="{text,record}">
                                                          <span>{{ text }}</span>
                                                          <a @click="showStaffModal( record.staffId)" class="nameInfoIcon">
                                                              <InfoCircleOutlined />
                                                          </a>
                                                      </template>
                                                      <template #designation="{record}">
                                                          <span>{{ record.staffData.data.designation }}</span>
                                                      </template>
                                                      <template #specialization="{record}">
                                                          <span>{{ record.staffData.data.specialization }}</span>
                                                      </template>
                                                      <template #role="{ record }">
                                                          <span v-for="(role,i) in record.role" :key="role.id">
                                                              <br v-if="i > 0" /> {{ i!= 0  ? ', '+  role.name :  role.name }}
                                                          </span>
                                                      </template>
                                                  </a-table>
                                              </a-tab-pane>
                                              <a-tab-pane key="2" tab="Care Circle">
                                                  <!-- <SearchField endPoint="" class="mb-24" /> -->
                                                  <a-table class="sortIconTable" rowKey="staffId" :scroll="{ x:'',y:'calc(100vh - 490px)' }" :row-selection="{ selectedRowKeys: escalationAssignTo.careCircleIds, onChange: onSelectChangeCareCircle,getCheckboxProps:(record) => ({   disabled: record.isPrimary }) }" :columns="escalationData.staffColumns" :data-source="careTeam.careTeamList" @change="onChange" :pagination="false">
                                                      <template #name="{text,record}">
                                                          <span>{{ text }}</span>
                                                          <a @click="showStaffModal( record.staffId)" class="nameInfoIcon">
                                                              <InfoCircleOutlined />
                                                          </a>
                                                      </template>
                                                      <template #designation="{record}">
                                                          <span>{{ record.staffData.data.designation }}</span>
                                                      </template>
                                                      <template #specialization="{record}">
                                                          <span>{{ record.staffData.data.specialization }}</span>
                                                      </template>
                                                    
                                                  </a-table>
                                              </a-tab-pane>
                                              <a-tab-pane key="3" tab="Specialist">
                                                  <div class="d-flex mb-24">
                                                    <!-- <SearchField endPoint="" class="mb-24" /> -->
                                                      <!-- <a-input-search v-model:value="value" placeholder="Search Specialist" @search="onSearch" /> -->
                                                      <a-button type="primary"  class="ml-10" @click="showProvider" v-if="careTeam.specialist?.length<1 && !patientDetails.referralDetail?.name">
                                                          <template #icon>
                                                              <PlusOutlined />
                                                          </template>
                                                          New
                                                      </a-button>
                                                  </div>
                                                  <a-table class="sortIconTable" rowKey="staffId" :scroll="{ x:'',y:'calc(100vh - 490px)' }" :row-selection="{ selectedRowKeys: escalationAssignTo.specialistIds, onChange: onSelectSpecialist }" :dataSource="careTeam.specialist" :columns="escalationData.specialistColumn" @change="onChange" :pagination="false">
                                                    <template #name="{text,record}">
                                                          <span>{{ text }}</span>
                                                          <a @click="showStaffModal( record.staffId)" class="nameInfoIcon">
                                                              <InfoCircleOutlined />
                                                          </a>
                                                    </template>  
                                                    <template #designation="{record}">
                                                          <span>{{ record.staffData.data?.designation?record.staffData.data?.designation:'N/A' }}</span>
                                                    </template>
                                                    <template #specialization="{record}">
                                                          <span>{{ record.staffData.data?.specialization }}</span>
                                                    </template>
                                                    <template #select>
                                                          <a-checkbox v-model:checked="checked"></a-checkbox>
                                                      </template>
                                                  </a-table>
                                              </a-tab-pane>
                                          </a-tabs>
  
                                      </a-col>
                                  </a-row>
                              </div> 
                              <div class="steps-action mt-28">
                                  <a-button style="margin-right: 8px" @click="prev">{{ $t('global.previous') }}</a-button>
                                  <a-button type="primary" html-type="submit">{{ $t('global.next') }}</a-button>
                              </div>
                          </a-form>
                      </div>
                  </a-col>
                  <a-col :span="24">
                      <div class="steps-content" v-if="steps[current]?.title == 'Details'">
                          <a-form layout="vertical" ref="formRef" :model="escalationDetails" @finish="submitDetailsForm" @finishFailed="onFinishFailed">
                              <div class="innerForm">
                                  <a-row :gutter="24" v-if="detailTabs==1">
                                      <a-col :xl="24" :xs="24" style="padding:20px;">
                                          <div class="detailTopFilters" style="float:right">
                                              <div class="vitalFilter">
                                                  <a-input-number @change="dateFliter" :min="10" :max="360" v-model:value="daysFilter" />
                                                  <span> Days</span>
                                              </div>
                                          </div>
                                      </a-col>
                                  </a-row>
                                  <a-row :gutter="24" v-else>
                                      <a-col :xl="24" :xs="24" style="padding:20px;">
                                          <div class="pageTittle" v-if="detailTabs!=1">
                                              <DateFilter  :hideArray="hideFilterEscalationModal" :Buttons="timeLineButton?.timeLineButton" @clickButtons="showButton($event);checkChangeInput()" :custom="true" hideCustom=""  commit="timelineSuccess" />
                                          </div>
                                      </a-col>
                                      <!-- <a-col :sm="12" :xs="24" v-if="button ==426"></a-col> -->
                                      <a-col :sm="6" :xs="24" v-if="timeLineButton?.timeLineButton?.globalCodeId == 426">
                                          <div class="form-group">
                                              <a-form-item label="Start Date" name="summaryStart" :rules="[{ required: false, message: 'Due Date'+' '+$t('global.validation')  }]">
                                                    <DateField :disabledDateData="current => !current || current > dayjs(dateSelect).subtract(1,'day')" v-model:value="escalationDetails.summaryStart" :globalDateFormat="globalDateFormat" :value-format="globalDateFormat" :size="size" style="width: 100%" @change="checkChangeInput(); changeDate();"/>
                                                  </a-form-item>
                                          </div>
                                      </a-col>
                                      <a-col :sm="6" :xs="24" v-if="timeLineButton?.timeLineButton?.globalCodeId == 426">
                                          <div class="form-group">
                                              <a-form-item label="End Date" name="summaryEnd" :rules="[{ required: false, message: 'Due Date'+' '+$t('global.validation')  }]">
                                                    <DateField :disabledDate="current => !current || current < dayjs(escalationDetails.summaryStart).subtract(0,'day')" v-model:value="escalationDetails.summaryEnd" :globalDateFormat="globalDateFormat" :value-format="globalDateFormat" :size="size" style="width: 100%" @change="checkChangeInput(); changeDate();dateChange();"/>
                                                  </a-form-item>
                                          </div>
                                      </a-col>
                                  </a-row>
                                  <a-tabs v-model:activeKey="detailTabs">
                                      <a-tab-pane key="1" tab="Vitals">
                                        <div class="form-group ">
                                                  <a-table class="sortIconTable" :scroll="{ x: 800, y: 'calc(100vh - 490px)' }" rowKey="id" :row-selection="onSelectChangeVitals" :columns="escalationData.vitalColumns" :data-source="escalationData.escalationVitalList" :pagination="false">
                                                  <template #color="{ record }">
                                                      <a-tooltip placement="bottom">
                                                          <template #title>
                                                              <span>{{ record.flagName }}</span>
                                                          </template>
                                                          <a class="icons">
                                                              <Flags :flag="record.color" /></a>
                                                      </a-tooltip>
                                                  </template>
                                              </a-table>
                                            </div>
                                      </a-tab-pane>
                                      <a-tab-pane key="2" tab="Flag">
                                          <div class="form-group ">
                                              <a-form-item name="notesId" :rules="[{ required: false, message: 'Notes' + ' ' + $t('global.validation') }]">
                                                  <!-- <a-input-search v-model:value="value" class="mb-24" placeholder="Search Notes" @search="onSearch" /> -->
                                                  <a-table class="sortIconTable" :scroll="{ x: 800, y: 'calc(100vh - 490px)' }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.flagIds, onChange: onSelectChangeFlags }" :columns="escalationData.flagColumns" :data-source="patientFlagList" :pagination="false">
                                                      <template #name="{ record }">
                                                          <span>{{record.flagName}}</span>
                                                      </template>
                                                      <template #color="{ record }">
                                                          <a-tooltip placement="bottom">
                                                              <template #title>
                                                                  <span>{{ record.flagName }}</span>
                                                              </template>
                                                              <a class="icons">
                                                                  <Flags :flag="record.color" /></a>
                                                          </a-tooltip>
                                                      </template>
                                                  </a-table>
                                              </a-form-item>
                                          </div>
                                      </a-tab-pane>
                                      <a-tab-pane key="3" tab="Notes" @change="allNotes">
                                      <div class="form-group ">
                                        <a-table class="sortIconTable" :scroll="{ x: 800, y: 'calc(100vh - 490px)' }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.notesId, onChange: onSelectChangeNotes }" :columns="escalationData.notesColumns" :data-source="escalationData.escalationNotesList" :pagination="false">
                                            <template #addedBy="{ record }">
                                                <a @click="showModal(record.addedById)">{{ record.addedBy }}</a>
                                            </template>
                                            <template #note="{ record }">  
                                               <a-tooltip placement="bottom">
                                                 <template #title>
                                                   <span>{{record.note}}</span>
                                                  </template>
                                                  <span class="icons">
                                                    {{ record?.note.substring(0,20)}}
                                                  </span>
                                                </a-tooltip>
                                              </template>
                                            <template #color="{ record }">
                                                <span>{{ record.flag }}</span>
                                            </template>
                                        </a-table>
                                      </div>
                                          
                                      </a-tab-pane>
                                      <a-tab-pane key="4" tab="Care Plan" v-if="tabs.carePlanChecked">
                                          <div class="form-group ">
                                              <a-table :scroll="{ x: 800, y: 'calc(100vh - 490px)' }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.carePlanId, onChange: onSelectChangeCarePlan }" :columns="escalationData.carePlanColumns" :data-source="escalationData.esacalationCarePlansList" :pagination="false">
                                              </a-table>
                                          </div>
                                      </a-tab-pane>
                                      <a-tab-pane key="5" tab="Esc. History" v-if="tabs.escalationChecked">
                                          <div class="form-group ">
                                              <a-table class="sortIconTable" :scroll="{ x: 800, y: 'calc(100vh - 490px)' }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.escalationId, onChange: onSelectChangeEscalation }" :columns="columnData" :data-source="escalationData.escalationHistory" :pagination="false">
                                                  <template #assignedBy="{ record }" v-if="arrayToObjact(screensPermissions, 408)">
                                                          <router-link v-if="record.assignedBy" :to="{ name: 'CoordinatorSummary', params: { udid: record.assignedBy.id } }">{{ record.assignedBy.fullName>12?record.assignedBy?.fullName?.substring(0,10)+'...':record.assignedBy.fullName }}</router-link>
                                                          <a v-if="record.assignedBy" @click="showStaffModal(record.assignedBy.id)" class="nameInfoIcon"> <InfoCircleOutlined/></a>
                                                  </template>
                                                  <template #escalationAssignedTo="{ record }" v-if="arrayToObjact(screensPermissions, 419)">
                                                    <a v-if="record.escalationAssignTo?.length>0 && record.escalationAssignTo[0]?.staff.fullName" @click="showDetails(record.escalationAssignTo)">{{record.escalationAssignTo[0]?.staff.fullName.substring(0,20)+'...'}}</a>
                                                  </template>
                                                  <!-- <template #escalationAssignedTo="{ record }" v-if="arrayToObjact(screensPermissions, 408) && record?.escalationAssignTo[0]?.staff.fullName">
                                                      <a v-if="record.escalationAssignTo?.length>0" @click="showDetails(record.escalationAssignTo)">{{record.escalationAssignTo[0]?.staff.fullName?.substring(0,20)+'...'}}</a>
                                                  </template> -->
                                                  <template #escalationStaff="{ record }" v-else>
                                                      <span v-for="esc,i in record.escalationStaff.data" :key="esc.id">
                                                          {{i==0?' ':','}} <span>{{ esc.staffName }}</span>
                                                      </span>
                                                  </template>
                                                  <template #reason="{ record }">
                                                  <a-tooltip placement="bottom">
                                                    <template #title>
                                                          <span>{{record.reason}}</span>
                                                  </template>
                                                      <span class="icons">
                                                        {{record.reason?.length>30?record?.reason?.substring(0,30)+'...':record.reason}}
                                                      </span>
                                                  </a-tooltip>
                                              </template>
                                                  <template #type="{ record }">
                                                      <span>{{record.type}}</span>
                                                  </template>
                                              </a-table>
                                          </div>
                                      </a-tab-pane>
                                      <template #tabBarExtraContent>
                                          <div class="detailFilters">
                                              <a-dropdown :trigger="['click']">
                                                  <a class="ant-dropdown-link" @click.prevent>
                                                      Section
                                                      <DownOutlined />
                                                  </a>
                                                  <template #overlay>
                                                      <a-menu>
                                                          <a-menu-item key="1">
                                                              <a-checkbox v-model:checked="tabs.carePlanChecked">Care Plan</a-checkbox>
                                                          </a-menu-item>
                                                          <a-menu-item key="2">
                                                              <a-checkbox v-model:checked="tabs.escalationChecked">Esc History</a-checkbox>
                                                          </a-menu-item>
                                                      </a-menu>
                                                  </template>
                                              </a-dropdown>
                                          </div>
                                      </template>
                                  </a-tabs>
                              </div>
                            
                              <div class="steps-action mt-5">
                                  <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{ $t('global.previous') }}
                                  </a-button>
                                  <a-button v-if="current < steps.length - 1" type="primary" @click="next">{{ $t('global.save') }}
                                  </a-button>
                                  <a-button v-if="current == steps.length - 1" type="primary" @click="preview(true)" >
                                      {{ 'Preview'}}
                                  </a-button>
                              </div>
                          </a-form>
                      </div>
                  </a-col>
              </a-row>
          </a-col>
          <a-col :span="previewStatus?24:10" v-if="patientDetails.patientDetails">
              <div class="previewEscalation">
                  <h3>Preview</h3>
                  <div class="patientDetail" v-if="patientDetails.patientDetails">
                      <img v-if="patientDetails.patientDetails?.profilePhoto" :src="patientDetails.patientDetails?.profilePhoto" alt="image" />
                      <img v-else src="@/assets/images/userAvatar.png" alt="image" />
                      <div>
                          <h2><a @click="showPatientModal(patientDetails.patientDetails?.id)">{{ patientDetails.patientDetails?.fullName }}</a></h2>
                          <p><b>DOB :</b> {{patientDetails.patientDetails?.patientDob}}</p>
                          <p><b>Gender :</b> {{patientDetails.patientDetails?.genderName}}</p>
                          <p v-if="patientDetails.patientDetails?.age==0"><b>Age :</b> {{1}}</p>
                          <p v-else><b>Age :</b> {{patientDetails.patientDetails?.age}}</p>
                          
                      </div>
                      
                      <div class="referalPhysican" >
                          <h4>Referral Physician </h4>
                          <p><b>Name :</b> {{patientDetails.referralDetail?.name?patientDetails.referralDetail?.name:'N/A'}}</p>
                          <p><b>Organization :</b> {{'N/A'}}</p>
                          <p><b>Location :</b> {{'N/A'}}</p>
                      </div>
                  </div>
                  <div class="escalationType" v-if="patientDetails.patientDetails">
                        <p><b>Escalation Type :</b> <template v-for="esc in globalCode.escalationType" :key="esc.id"><a-tag v-if="esc.id==escalationInfo.type" :color="esc?.color">{{esc?.name}}</a-tag> </template></p>
                      </div>
                      <div class="escalationType" v-if="patientDetails.patientDetails">
                        <p><b>Reason for escalation :</b>  {{escalationInfo.reason}}</p>
                      </div>
                  <div class="assignedTo details"  v-if="escalationData?.escalationCounter==1 ||escalationData?.escalationCounter==2">
                    <div v-if="escalationAssignTo.specialist.length>0 || patientDetails.referralDetail?.name">
                      <h4>Specialist</h4>
                      <a-tag color="#108ee9" v-if="patientDetails.referralDetail?.name" @click="showStaffModal(patientDetails.referralDetail?.id)">{{patientDetails.referralDetail?.name}}</a-tag>
                      <a-tag closable v-for="specialist,i in escalationAssignTo.specialist" :key="i" @close="removeSpecialist(specialist.id)">
                          <a @click="showStaffModal(specialist.staffId)">{{specialist.staff }}</a>
                      </a-tag>
                  </div>
                    <div v-if="careTeam.physiciansList?.length>0">
                      <h4>Care Coordinator</h4>
                      <span v-for="physician,i in careTeam.physiciansList" :key="i">
                        <a-tag color="#108ee9" v-if="physician.isPrimary==1 || physician.isPrimary=='Yes'" @click="showStaffModal(physician.staffId)">{{physician.name}}</a-tag>
                      </span>
                      <span v-for="staff,i in escalationAssignTo.staffs" :key="i">
                        <a-tag closable  @close="removeCareCoordinator(staff.id)" v-if="staff.isPrimary==0 || staff.isPrimary=='No'">
                            <a @click="showStaffModal(staff.staffId)">{{staff.name }}</a>
                        </a-tag>
                      </span>
                      </div>
                      <div v-if="careTeam.careTeamList?.length>0">
                      <h4>Care Circle</h4>
                      <span v-for="careTeam,i in careTeam.careTeamList" :key="i">
                      <a-tag color="#108ee9" v-if="careTeam.isPrimary=='Yes' || careTeam.isPrimary==1" @click="showStaffModal(careTeam.staffId)">{{careTeam.name}}</a-tag>
                      </span>
                      <span v-for="careCircle,i in escalationAssignTo.careCircle" :key="i">
                        <a-tag closable  @close="removeCareCircle(careCircle.id)" v-if=" careCircle.isPrimary ==0 || careCircle.isPrimary=='No' ">
                            <a @click="showStaffModal(careCircle.staffId)">{{careCircle.name }}</a>
                        </a-tag>
                      </span>
                      </div>
                      
                  </div>
                  <div class="assignedTo details" v-if="escalationData?.escalationCounter==2">
                      <h4 >Latest Reading</h4>
                      <!-- <a-col class="mb-10" :sm="24" v-if="!patientDetails.devices?.length>0">
                                      <a-alert message="No devices are assigned to this Patient. Please assign device(s) to see Vitals." type="error" />
                                  </a-col> -->
                      <a-row :gutter="20"  >
                       <!-- bloodOxygen -->
                       <a-col :span="8" v-if="vitals?.bloodOxygen?.length>0">
                                      <vue-speedometer 
                                      :width="230"
                                      :height="230"
                                      :labelFontSize="10"
                                      :valueTextFontSize="11"
                                      :needleHeightRatio="0.5"
                                      :minValue="10"
                                      :maxValue="110"
                                      :value="vitals?.bloodOxygen[0]?.oximeter_spo2<110?vitals?.bloodOxygen[0]?.oximeter_spo2:110"
                                      :customSegmentStops='[10, 20, 30,40,50,60,70,80,90,100,110]'
                                      :segmentColors='["#f54b42", "#f54b42", "#f54b42","#f54b42","#f54b42","#f54b42","#f54b42","#f54b42","#f5ad42","#26bf28"]'
                                      :currentValueText="`SPO2 Level (`+vitals?.bloodOxygen[0].takeDate +' ' +vitals?.bloodOxygen[0].takeOnlyTime+')'"
                                      :customSegmentLabels='[
                                          
                                          {
                                          text: "10",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "20",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "30",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "40",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "50",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "60",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "70",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "80",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "90",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "100",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          
                                          
                                      ]'
                                      :ringWidth="47"
                                      :needleTransitionDuration="3333"
                                      needleTransition="easeElastic"
                                      needleColor="#a7ff83"
                                      textColor="#000000"
                                      />
                        </a-col>
                        <a-col :span="8" v-if="vitals?.bloodOxygen?.length>0">
                                      <vue-speedometer 
                                      :width="230"
                                      :height="230"
                                      :labelFontSize="10"
                                      :valueTextFontSize="11"
                                      :needleHeightRatio="0.5"
                                      :minValue="0"
                                      :maxValue="130"
                                      :value="vitals?.bloodOxygen[0]?.oximeter_bpm<130?vitals?.bloodOxygen[0]?.oximeter_bpm:130"
                                      :customSegmentStops='[0,10, 20, 30,40,50,60,70,80,90,100,110,120,130]'
                                      :segmentColors='["#f54b42", "#f54b42", "#f54b42","#f54b42","#f54b42","#adf542", "#26bf28","#26bf28","#10b011","#f5c842","#f54b42","#f54b42","#f54b42"]'
                                      :currentValueText="`BPM Level (`+vitals?.bloodOxygen[0].takeDate+' ' + vitals?.bloodOxygen[0].takeOnlyTime+')'"
                                      :customSegmentLabels='[
                                          
                                          {
                                          text: "10",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "20",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "30",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "40",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "50",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "60",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "70",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "80",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "90",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "100",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "110",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "120",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "130",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          
                                          
                                      ]'
                                      :ringWidth="47"
                                      :needleTransitionDuration="3333"
                                      needleTransition="easeElastic"
                                      needleColor="#a7ff83"
                                      textColor="#000000"
                                      />
                        </a-col>
                        <!-- bloodGlucose -->
                        <a-col :span="8" v-if="vitals?.bloodGlucose?.length>0">
                                      <vue-speedometer 
                                      :width="230"
                                      :height="230"
                                      :labelFontSize="10"
                                      :valueTextFontSize="11"
                                      :needleHeightRatio="0.5"
                                      :minValue="0"
                                      :maxValue="200"
                                      :value="vitals?.bloodGlucose[0]?.value<200?vitals?.bloodGlucose[0]?.value:200"
                                      :customSegmentStops='[0,20, 40, 60,80,100,120,140,160,180,200]'
                                      :segmentColors='["#f54b42","#f54b42","#f54b42","#f5ad42","#10b011","#10b011","#f5ad42","#f54b42", "#f54b42","#f54b42"]'
                                      :currentValueText="`Glucose  (`+vitals?.bloodGlucose[0].takeDate+' ' + vitals?.bloodGlucose[0].takeOnlyTime+')'"
                                      :customSegmentLabels='[
                                          
                                          {
                                          text: "20",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "40",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "60",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "80",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "100",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "120",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "140",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "160",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "180",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "200",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          
                                          
                                      ]'
                                      :ringWidth="47"
                                      :needleTransitionDuration="3333"
                                      needleTransition="easeElastic"
                                      needleColor="#a7ff83"
                                      textColor="#000000"
                                      />
                        </a-col>
                        <!-- bloodPressure -->
                        <a-col :span="8" v-if="vitals?.bloodPressure?.length>0">
                                      <vue-speedometer 
                                      :width="230"
                                      :height="230"
                                      :labelFontSize="10"
                                      :valueTextFontSize="11"
                                      :needleHeightRatio="0.5"
                                      :minValue="0"
                                      :maxValue="200"
                                      :value="vitals?.bloodPressure[0]?.blood_pressure_systolic<200?vitals?.bloodPressure[0]?.blood_pressure_systolic:200"
                                      :customSegmentStops='[0,20, 40, 60,80,100,120,140,160,180,200]'
                                      :segmentColors='["#f54b42","#f58742","#f5ad42","#d4f542","#90d42c","#90d42c","#d4f542","#f58742", "#f57242","#f54b42"]'
                                      :currentValueText="`BP(Systolic) (`+vitals?.bloodPressure[0].takeDate+' ' + vitals?.bloodPressure[0].takeOnlyTime+')'"
                                      :customSegmentLabels='[
                                          
                                          {
                                          text: "20",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "40",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "60",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "80",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "100",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "120",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "140",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "160",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "180",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "200",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          
                                          
                                      ]'
                                      :ringWidth="47"
                                      :needleTransitionDuration="3333"
                                      needleTransition="easeElastic"
                                      needleColor="#a7ff83"
                                      textColor="#000000"
                                      />
                        </a-col>
                        <a-col :span="8" v-if="vitals?.bloodPressure?.length>0">
                                      <vue-speedometer 
                                      :width="230"
                                      :height="230"
                                      :labelFontSize="10"
                                      :valueTextFontSize="11"
                                      :needleHeightRatio="0.5"
                                      :minValue="0"
                                      :maxValue="200"
                                      :value="vitals?.bloodPressure[0]?.blood_pressure_diastolic<200?vitals?.bloodPressure[0]?.blood_pressure_diastolic:200"
                                      :customSegmentStops='[0,20, 40, 60,80,100,120,140,160,180,200]'
                                      :segmentColors='["#f54b42","#f58742","#d4f542","#90d42c","#f5c842","#f58742","#f54b42","#f54b42", "#f54b42","#f54b42"]'
                                      :currentValueText="`BP(Diastolic) (`+vitals?.bloodPressure[0].takeDate+' ' + vitals?.bloodPressure[0].takeOnlyTime+')'"
                                      :customSegmentLabels='[
                                          
                                          {
                                          text: "20",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "40",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "60",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "80",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "100",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "120",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "140",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "160",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "180",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          {
                                          text: "200",
                                          position: "INSIDE",
                                          color: "#333435",
                                          },
                                          
                                          
                                      ]'
                                      :ringWidth="47"
                                      :needleTransitionDuration="3333"
                                      needleTransition="easeElastic"
                                      needleColor="#a7ff83"
                                      textColor="#000000"
                                      />
                        </a-col>
                      </a-row>
  
                      <a-col :sm="24" :xs="8">
                                  <h4 class="mb-10 ">Details </h4>
                              </a-col>
                              <a-col :sm="24" :xs="24">
                                  <a-tabs v-model:activeKey="activeKeyVital" type="card">
                                    <a-tab-pane key="1" tab="Vitals">
                                      <PatientVitalsGrid :isEscalationAction="true" :escalationAdd="true" :patientId="patientId?patientId:escalationInfo.referenceId"/>
                                    </a-tab-pane>
                                    <a-tab-pane key="2" tab="Notes" v-if="escalationDetails.notes?.length>0">
                                      <a-table class="sortIconTable" :scroll="{ x: 800, y: 300 }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.notesId, onChange: onSelectChangeNotes }" :columns="escalationData.notesColumns" :data-source="escalationData.escalationNotesList" :pagination="false">
                                            <template #addedBy="{ record }">
                                                <a @click="showModal(record.addedById)">{{ record.addedBy }}</a>
                                            </template>
                                            <template #note="{ record }">  
                                               <a-tooltip placement="bottom">
                                                 <template #title>
                                                   <span>{{record.note}}</span>
                                                  </template>
                                                  <a class="icons">
                                                    {{ record?.note.substring(0,20)}}
                                                  </a>
                                                </a-tooltip>
                                              </template>
                                            <template #color="{ record }">
                                                <span>{{ record.flag }}</span>
                                            </template>
                                        </a-table>
                                    </a-tab-pane>
                                    <a-tab-pane key="3" tab="Flags" v-if="escalationDetails.flags?.length>0">
                                      <a-table class="sortIconTable" :scroll="{ x: 800, y: 300 }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.flagIds, onChange: onSelectChangeFlags }" :columns="escalationData.flagColumns" :data-source="patientFlagList" :pagination="false">
                                          <template #name="{ record }">
                                              <span>{{record.flagName}}</span>
                                          </template>
                                          <template #color="{ record }">
                                              <a-tooltip placement="bottom">
                                                  <template #title>
                                                      <span>{{ record.flagName }}</span>
                                                  </template>
                                                  <a class="icons">
                                                      <Flags :flag="record.color" /></a>
                                              </a-tooltip>
                                          </template>
                                      </a-table>
                                    </a-tab-pane>
                                    <a-tab-pane key="4" tab="Care Plans" v-if="escalationDetails.carePlan?.length>0">
                                      <a-table :scroll="{ x: 800, y: 300 }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.carePlanId, onChange: onSelectChangeCarePlan }" :columns="escalationData.carePlanColumns" :data-source="escalationData.esacalationCarePlansList" :pagination="false">
                                              </a-table>
                                    </a-tab-pane>
                                    
                                    <a-tab-pane key="5" tab="Escalation" v-if="escalationDetails.escalation?.length>0">
                                      <a-table class="sortIconTable" :scroll="{ x: 800, y: 300 }" rowKey="id" :row-selection="{ selectedRowKeys: escalationDetails.escalationId, onChange: onSelectChangeEscalation }" :columns="columnData" :data-source="escalationData.escalationHistory" :pagination="false">
                                                  <template #assignedBy="{ record }" v-if="arrayToObjact(screensPermissions, 408)">
                                                          <router-link v-if="record.assignedBy" :to="{ name: 'CoordinatorSummary', params: { udid: record.assignedBy.id } }">{{ record.assignedBy.fullName>12?record.assignedBy?.fullName?.substring(0,10)+'...':record.assignedBy.fullName }}</router-link>
                                                          <a v-if="record.assignedBy" @click="showStaffModal(record.assignedBy.id)" class="nameInfoIcon"> <InfoCircleOutlined/></a>
                                                  </template>
                                                  <template #escalationAssignedTo="{ record }" v-if="arrayToObjact(screensPermissions, 419)">
                                                    <a v-if="record.escalationAssignTo?.length>0 && record.escalationAssignTo[0]?.staff.fullName" @click="showDetails(record.escalationAssignTo)">{{record.escalationAssignTo[0]?.staff.fullName.substring(0,20)+'...'}}</a>
                                                  </template>
                                                  <template #escalationStaff="{ record }" v-else>
                                                      <span v-for="esc,i in record.escalationStaff.data" :key="esc.id">
                                                          {{i==0?' ':','}} <span>{{ esc.staffName }}</span>
                                                      </span>
                                                  </template>
                                                  <template #reason="{ record }">
                                                  <a-tooltip placement="bottom">
                                                    <template #title>
                                                          <span>{{record.reason}}</span>
                                                  </template>
                                                      <a class="icons">
                                                        {{record.reason?.length>30?record?.reason?.substring(0,30)+'...':record.reason}}
                                                      </a>
                                                  </a-tooltip>
                                              </template>
                                                  <template #escalationType="{ record }">
                                                      <span>{{record.type}}</span>
                                                  </template>
                                              </a-table>
                                      </a-tab-pane>
                                  </a-tabs>
                              </a-col>
                      
                      <!-- <h4 v-if="escalationDetails.flags?.length>0">Flag</h4>
                      <span v-for="flag in escalationDetails.flags" :key="flag.id">
                      <a-tag closable  @close="removeflag(flag.id)">
                            {{flag.flagName}}
                        </a-tag>
                      </span>
                      <h4 v-if="escalationDetails.notes?.length>0">Notes</h4>
                      <span v-for="note in escalationDetails.notes" :key="note.id">
                      <a-tag closable  @close="removeEscalationNotes(note.id)">
                            {{note.note}}
                        </a-tag>
                      </span>
                      <h4 v-if="escalationDetails.carePlan?.length>0">Care Plan</h4>
                      <span v-for="carePlan in escalationDetails.carePlan" :key="carePlan.id">
                      <a-tag closable  @close="removeCarePlan(carePlan.id)">
                            {{carePlan.flagName}}
                        </a-tag>
                      </span>
                      <h4 v-if="escalationDetails.escalation?.length>0">Escalation</h4>
                      <span v-for="escaltion in escalationDetails.escalation" :key="escaltion.id">
                      <a-tag closable  @close="removeEscalation(escaltion.id)">
                            {{escaltion.type}}
                        </a-tag>
                      </span> -->
                  </div>
              </div>
          </a-col>
          <a-col :sm="24" :xs="24" class="mt-28">
          <div class="steps-action " v-if="previewStatus">
              <a-button v-if="current == steps.length - 1" style="margin-right: 8px" @click="preview(false)">{{ 'Edit' }}
              </a-button>
              <a-button v-if="current == steps.length - 1" type="primary" @click="submitDetailsForm" >
                  {{ 'Send'}}
              </a-button>
            </div>
          </a-col>
      </a-row>
      <Loader />
      <SpecialistModal v-if="visibleProvider" v-model:visible="visibleProvider" @closeSpecialistModal="closeSpecialistModal($event)" @assignToPatient="assignToPatient($event)" :staffType="343" :escalation="true" />
      <EscaltionViewModal v-if="escaltionViewModal" v-model:visible="escaltionViewModal" />
      <ViewDetails :arrayData="escalationAssignToData" v-if="viewModal" v-model:visible="viewModal" />
  </a-modal>
  </template>
<script>
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
  watchEffect,
  defineAsyncComponent,
} from "vue";
import { useStore } from "vuex";
import moment from "moment";
import dayjs from 'dayjs';
import {
  globalDateFormat,
  timeStamp,
  endTimeAdd,
  warningSwal,
  errorSwal,
  startimeAdd,
  showStaffModal,
  showPatientModal,
  successSwal,
  arrayToObjact,
  arrayToObjectData,
  formTitleNames,
  hideFilterEscalationModal,
} from "@/commonMethods/commonMethod";
import { messages } from "@/config/messages";
import PatientDropDown from "@/components/modals/search/PatientDropdownSearch.vue";
import Flags from "@/components/common/flags/Flags";
import { useRoute } from "vue-router";
import Loader from "@/components/loader/Loader.vue";
import { PlusOutlined, DownOutlined } from "@ant-design/icons-vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import DateField from "@/components/modals/search/DateField.vue";
import PatientVitalsGrid from "@/components/patients/patientSummary/views/PatientVitalsGrid";
import FormBaseComponents from "@/components/modals/FormBaseComponents";
const columnData = [
  {
    title: "Type",
    dataIndex: "type",
    slots: {
      customRender: "type",
    },
    sorter: (a, b) => a.type.localeCompare(b.type),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Send To",
    dataIndex: "assignedTo",
    slots: {
      customRender: "escalationAssignedTo",
    },
    filterMultiple: false,
  },
  {
    title: "Created By",
    dataIndex: "assignedBy",
    slots: {
      customRender: "assignedBy",
    },
    sorter: (a, b) =>
      a.assignedBy?.fullName.localeCompare(b.assignedBy?.fullName),
    sortDirections: ["descend", "ascend"],
  },

  {
    title: "Reason",
    dataIndex: "reason",
    slots: {
      customRender: "reason",
    },
    sorter: (a, b) => a.reason.localeCompare(b.reason),
    sortDirections: ["descend", "ascend"],
  },

  {
    title: "Status",
    dataIndex: "status",
    slots: {
      customRender: "status",
    },
    sorter: (a, b) => a.status.localeCompare(b.status),
    sortDirections: ["descend", "ascend"],
  },
];
export default {
  components: {
    PatientVitalsGrid,
    DateField,
    InfoCircleOutlined,
    PatientDropDown,
    Loader,
    DateFilter: defineAsyncComponent(() =>
      import("@/components/common/DateFilter.vue")
    ),
    Flags,
    FormBaseComponents,
    SpecialistModal: defineAsyncComponent(() =>
      import("./AddSpecialistModal.vue")
    ),
    PlusOutlined,
    DownOutlined,
    EscaltionViewModal: defineAsyncComponent(() =>
      import("./EscalationViewModal.vue")
    ),
    ViewDetails: defineAsyncComponent(() =>
      import("@/components/escalations/ViewDetails.vue")
    ),
  },
  props: {
    isEdit: String,
    patientId: String,
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const activeKey = ref([]);
    const activeKeyVital = ref("1");
    const errorMsg = ref([]);
    const button = ref(2);
    const status = ref(false);
    const formRef = ref();
    const toggleTo = ref(false);
    const visibleProvider = ref(false);
    const escaltionViewModal = ref(false);
    const daysFilter = ref(10);
    const notesTabs = ref("1");
    const viewModal = ref(false);
    const assignToError = ref();
    const escalationAssignToData = ref();
    const previewStatus = ref();
    const paramId = ref(route.params.udid);
    const tabs = reactive({
      carePlanChecked: true,
      escalationChecked: true,
    });
    const escalationInfo = reactive({
      referenceId: paramId.value ? paramId.value : "",
      entityType: "patient",
      type: 340,
      reason: "",
    });

    const escalationAssignTo = reactive({
      staffs: [],
      staffIds: [],
      careCircle: [],
      careCircleIds: [],
      specialist: [],
      specialistIds: [],
    });

    const escalationDetails = reactive({
      notesId: [],
      notes: [],
      vitalId: [],
      carePlanId: [],
      carePlan: [],
      flagIds: [],
      flags: [],
      escalationId: [],
      escalation: [],
      summaryStart: "",
      summaryEnd: "",
    });

    const current = computed({
      get: () => store.state.escalations.escalationCounter,
      set: (value) => {
        if (addEscalation.value) {
          if (value == 1) {
            submitInfo();
          }
          if (value == 2) {
            submitAssignTo();
          }
          if (value != 2) {
            store.state.escalations.escalationCounter = value;
          }
        } else {
          if (
            Object.values(escalationInfo).filter((item) => item != "").length >=
              3 ||
            addEscalation.value
          ) {
            submitInfo();
          } else {
            errorSwal(messages.fieldsRequired);
            store.state.escalations.escalationCounter = 0;
          }
        }
      },
    });

    const escalationData = computed(() => {
      return store.state.escalations;
    });

    watchEffect(() => {
      if (props.patientId) {
        paramId.value = props.patientId;
        store.dispatch(
          "patientDetails",
          paramId.value ? paramId.value : escalationInfo.referenceId
        );
        store.dispatch(
          "careCircle",
          paramId.value ? paramId.value : escalationInfo.referenceId
        );
        store.dispatch(
          "referralDetail",
          paramId.value ? paramId.value : escalationInfo.referenceId
        );
        store.dispatch("patientCareCoordinatorsList", {
          patientUdid: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          type: "Staff",
        });
        store.dispatch("patientCareCoordinatorsList", {
          patientUdid: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          type: 0,
        });
        store.dispatch("patientCareCoordinatorsList", {
          patientUdid: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          type: "Specialist",
        });

        let fromDate = addDays((daysFilter.value = 10));
        let dateFormat = {
          toDate: Date.now(),
          fromDate: fromDate,
        };
        store.dispatch("escalationVitalList", {
          id: paramId.value ? paramId.value : escalationInfo.referenceId,
          date: dateFormat,
        });
        store.dispatch("escalation", {
          referenceId: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          entityType: "patient",
        });

        store.dispatch("esacalationCarePlansList", {
          id: paramId.value ? paramId.value : escalationInfo.referenceId,
          date: dateFormat,
        });
      } else if (escalationInfo.referenceId && escalationData.value.escalationCounter == 1) {
        store.dispatch(
          "devices",
          paramId.value ? paramId.value : escalationInfo.referenceId
        );
        store.dispatch(
          "careCircle",
          paramId.value ? paramId.value : escalationInfo.referenceId
        );
        store.dispatch("patientCareCoordinatorsList", {
          patientUdid: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          type: "Staff",
        });
        store.dispatch("patientCareCoordinatorsList", {
          patientUdid: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          type: 0,
        });
        store.dispatch("patientCareCoordinatorsList", {
          patientUdid: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          type: "Specialist",
        });
        // store.dispatch("escalationVitalList", {
        //   id: paramId.value?paramId.value:escalationInfo.referenceId,
        //   date: '',
        // });
        // store.dispatch("escalationHistory", {
        //   referenceId: paramId.value
        //     ? paramId.value
        //     : escalationInfo.referenceId,
        //   // entityType: "patient",
        // });
        // store.dispatch("esacalationCarePlansList", {
        //   id: paramId.value ? paramId.value : escalationInfo.referenceId,
        //   date: "",
        // });
        // dateFliter();
      }

      // if (escalationData.value.escalationCounter == 2) {
      //   dateFliter();
      // }
    });

    onMounted(() => {
      escalationData.value.escalationCounter = 0
      // store.dispatch("flagsList");
      // store
      //   .dispatch("timeLine", {
      //     id: 344,
      //     commit: "timelineSuccess",
      //   })
      //   .then(() => {
      //     apiCall(timeLineButton.value);
      //   });
    });

    const patientDetails = computed(() => {
      return store.state.patients;
    });

    const careTeamList = computed(() => {
      return store.state.careTeam.careTeamList;
    });

    const careTeam = computed(() => {
      return store.state.careTeam;
    });

    const physiciansList = computed(() => {
      return store.state.careTeam.physiciansList;
    });

    const globalCode = computed(() => {
      return store.state.common;
    });

    const next = () => {
      store.commit("escalationCounterPlus", 1);
    };
    const prev = () => {
      store.commit("escalationCounterMinus");
    };

    const addEscalation = computed(() => {
      return store.state.escalations.addBasicEscalation;
    });

    const formEscalationDetails = reactive({
      ...escalationDetails,
    });

    function submitInfo(value = 1) {
      if (addEscalation.value == null) {
        store
          .dispatch("addBasicEscalation", {
            type: escalationInfo.type,
            referenceId: escalationInfo.referenceId
              ? escalationInfo.referenceId
              : paramId.value,
            entityType: "patient",
            reason: escalationInfo.reason,
            value: value,
          })
          .then((response) => {
            if (response == true) {
              store.state.escalations.escalationCounter = 1;
              // store
              //   .dispatch("timeLine", {
              //     id: 344,
              //     commit: "timelineSuccess",
              //   })
              //   .then(() => {
              //     button.value = 344;
              //     apiCall(timeLineButton.value);
                  
                // });
                errorMsg.value = [];
                  assignToError.value = null;
            }
          });
      } else {
        store
          .dispatch("updateBasicEscalation", {
            referenceId: escalationInfo.referenceId
              ? escalationInfo.referenceId
              : paramId.value,
            entityType: "patient",
            type: escalationInfo.type,
            reason: escalationInfo.reason,
            escalationId: props.isEdit ? props.isEdit : addEscalation.value.id,
            value: value,
          })
          .then((response) => {
            if (response == true) {
              store.state.escalations.escalationCounter = 1;
              // store
              //   .dispatch("timeLine", {
              //     id: 344,
              //     commit: "timelineSuccess",
              //   })
              //   .then(() => {
              //     button.value = 344;
              //     apiCall(timeLineButton.value);
              //   });
                errorMsg.value = [];
                assignToError.value = null;
            }
          });
        Object.assign(escalationDetails, formEscalationDetails);
      }
    }

    function submitAssignTo(value = 1) {
      let specialist = [];
      let entityType = null;
      if (patientDetails.value.referralDetail?.id) {
        entityType = "referral";
        specialist = [
          ...escalationAssignTo.specialistIds,
          patientDetails.value.referralDetail?.id,
        ];
      } else {
        specialist = [...escalationAssignTo.specialistIds];
      }
      let careTeamsList = careTeamList.value.filter(
        (item) => item.isPrimary == "Yes" || item.isPrimary == 1
      );
      let physicianList = physiciansList.value?.filter(
        (item) => item.isPrimary == "Yes" || item.isPrimary == 1
      );
      let assign = [
        {
          entityType: "careCoordinator",
          referenceId:
            physicianList?.length > 0
              ? [
                  ...physicianList?.map((item) => item.staffId),
                  ...escalationAssignTo?.staffIds,
                ]
              : null,
        },
        {
          entityType: "careCircle",
          referenceId:
            careTeamsList?.length > 0
              ? [
                  ...careTeamsList?.map((item) => item.staffId),
                  ...escalationAssignTo?.careCircleIds,
                ]
              : null,
        },
        {
          entityType: entityType ? entityType : "specialist",
          referenceId: specialist,
        },
      ];
      if (addEscalation.value != null) {
        let validate = assign.filter((item) => item.referenceId?.length > 0);
        if (validate?.length > 0) {
          assignToError.value = null;
          store
            .dispatch("addAssignTo", {
              assign: assign,
              escalationId: props.isEdit
                ? props.isEdit
                : addEscalation.value.id,
              value: value,
            })
            .then((response) => {
              if (response == true) {
                store.state.escalations.escalationCounter = 2;
                store
                  .dispatch("timeLine", {
                    id: 122,
                    commit: "timelineSuccess",
                  })
                  .then(() => {
                    button.value = 122;
                    apiCall(timeLineButton.value?.timeLineButton);
                  });
              }
            });
        } else {
          assignToError.value =
            "Please select at least one primary/specialist member.";
        }
      }
    }

    const addStaff = computed(() => {
      return store.state.careCoordinator.addStaff;
    });
    const vitals = computed(() => {
      return store.state.patients;
    });

    function assignToPatient() {
      let data = {
        staff: addStaff.value.id,
        type: 1,
        isPrimary: 1,
      };
      store
        .dispatch("assignSpecialistToPatient", {
          data: data,
          id: escalationInfo.referenceId
            ? escalationInfo.referenceId
            : paramId.value,
        })
        .then((resp) => {
          if (resp == true) {
            store.dispatch("patientCareCoordinatorsList", {
              patientUdid: escalationInfo.referenceId
                ? escalationInfo.referenceId
                : paramId.value,
              type: "Specialist",
            });
          }
        });
    }

    const form = reactive({
      ...escalationInfo,
    });

    const formAssignTo = reactive({
      ...escalationAssignTo,
    });
    const formDetails = reactive({
      ...escalationDetails,
    });

    function submitDetailsForm() {
      store
        .dispatch("addEscalationDetails", {
          detail: [
            {
              fromDate: addDays(daysFilter.value),
              toDate: Date.now(),
              entityType: "vitals",
              value: JSON.stringify(
                escalationData.value.esacalationCarePlansList
              ),
            },
            {
              fromDate: addDays(daysFilter.value),
              toDate: Date.now(),
              entityType: "flag",
              value: JSON.stringify(escalationDetails.flags),
            },
            {
              fromDate: addDays(daysFilter.value),
              toDate: Date.now(),
              entityType: "notes",
              value: JSON.stringify(escalationDetails.notes),
            },
            {
              fromDate: addDays(daysFilter.value),
              toDate: Date.now(),
              entityType: "carePlan",
              value: JSON.stringify(escalationDetails.carePlan),
            },
            {
              fromDate: addDays(daysFilter.value),
              toDate: Date.now(),
              entityType: "escalation",
              value: JSON.stringify(escalationDetails.escalation),
            },
          ],
          escalationId: props.isEdit ? props.isEdit : addEscalation.value.id,
        })
        .then((response) => {
          if (response == true) {
            successSwal("Data saved Successfully!");
            if(paramId.value){
              store.dispatch("escalation", {
                referenceId: paramId.value,
                entityType: "patient",
              });
            }else{
              store.dispatch("escalation");
              store.state.patients.patientDetails = null;
              escalationInfo.referenceId = null;
            }
            emit("saveModal", false);
            status.value = false;
            assignToError.value = null;
            previewStatus.value = false;
            store.state.escalations.addBasicEscalation = null;
            Object.assign(escalationInfo, form);
            Object.assign(escalationAssignTo, formAssignTo);
            Object.assign(escalationDetails, formDetails);
            store.commit("resetEscalationCounter");
          }
        });
    }

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }
    const checkFieldsData = computed(() => {
      return store.state.common.checkChangeInput;
    });

    const closeSpecialistModal = (value) => {
      visibleProvider.value = value ? value : false;
    };

    const closeModal = () => {
      emit("saveModal", true);
      if (checkFieldsData.value) {
        if (addEscalation.value) {
          warningSwal(messages.modalWarning).then((response) => {
            if (response == true) {
              emit("saveModal", false);
              Object.assign(escalationInfo, form);
              Object.assign(escalationAssignTo, formAssignTo);
              Object.assign(escalationDetails, formDetails);
              previewStatus.value = false;
              store.commit("resetEscalationCounter");
              store.commit("checkChangeInput", false);
              store
                .dispatch("escalationDelete", addEscalation.value.id)
                .then((resp) => {
                  if (resp == true) {
                    store.dispatch("escalation");
                  }
                });
              store.state.escalations.addBasicEscalation = null;
              assignToError.value = null;
              if (!paramId.value) {
                store.state.patients.patientDetails = null;
              }
              errorMsg.value = [];
            } else {
              emit("saveModal", true);
            }
          });
        } else if (addEscalation.value == null) {
          warningSwal(messages.modalWarning).then((response) => {
            if (response == true) {
              emit("saveModal", false);
              Object.assign(escalationInfo, form);
              Object.assign(escalationAssignTo, formAssignTo);
              Object.assign(escalationDetails, formDetails);
              store.commit("resetEscalationCounter");
              store.commit("checkChangeInput", false);
              store.state.escalations.addBasicEscalation = null;
              assignToError.value = null;
              previewStatus.value = false;
              if (!paramId.value) {
                store.state.patients.patientDetails = null;
              }
              errorMsg.value = [];
            } else {
              emit("saveModal", true);
            }
          });
        }
      } else {
        formRef.value.resetFields();
        assignToError.value = null;
        emit("saveModal", false);
        if (!paramId.value) {
          store.state.patients.patientDetails = null;
        }
      }
    };

    const carePlanList = computed(() => {
      return store.state.escalations.esacalationCarePlansList;
    });
    const patientFlagList = computed(() => {
      return store.state.escalations.esacalationFlagList;
    });

    const timeLineButton = store.getters.dashBoard;

    function showButton(id) {
      button.value = id;
      if (id != 426) {
        apiCall(timeLineButton.value?.timeLineButton);
      }
    }

    const handlePatientChange = (val) => {
      escalationInfo.referenceId = val;
      store.dispatch("patientDetails", val);
      store.dispatch("referralDetail",val);
    };

    let from = moment();
    let to = moment();
    const dateSelect = ref(null);

    function dateChange() {
      dateSelect.value = moment(escalationDetails.summaryEnd).add(1, "day");
    }

    function changeDate() {
      if (escalationDetails.summaryStart && escalationDetails.summaryEnd) {
        let dateFormate = {
          fromDate: timeStamp(
            startimeAdd(moment(escalationDetails.summaryStart))
          ),
          toDate: timeStamp(endTimeAdd(moment(escalationDetails.summaryEnd))),
        };

        // if (paramId.value && route.name == "PatientSummary") {
        //   store.dispatch("escalationNotesList", {
        //     id: paramId.value,
        //     date: dateFormate,
        //   });
        //   store.dispatch("escalationVitalList", {
        //     id: paramId.value,
        //     date: dateFormate,
        //   });
        //   store.dispatch("esacalationCarePlansList", {
        //     id: paramId.value,
        //     date: dateFormate,
        //   });
        //   store.dispatch("esacalationFlagList", {
        //     id: paramId.value,
        //     date: dateFormate,
        //   });
        //   store.dispatch("escalationHistory", {
        //     referenceId: paramId.value
        //       ? paramId.value
        //       : escalationInfo.referenceId,
        //     date: dateFormate,
        //   });
        // } else if (escalationInfo.referenceId) {
          store.dispatch("escalationNotesList", {
            id: escalationInfo.referenceId,
            date: dateFormate,
          });
          store.dispatch("escalationVitalList", {
            id: escalationInfo.referenceId,
            date: dateFormate,
          });
          store.dispatch("esacalationCarePlansList", {
            id: escalationInfo.referenceId,
            date: dateFormate,
          });
          store.dispatch("esacalationFlagList", {
            id: escalationInfo.referenceId,
            date: dateFormate,
          });
          store.dispatch("escalationHistory", {
            referenceId: paramId.value
              ? paramId.value
              : escalationInfo.referenceId,
            date: dateFormate,
          });
        // }
      }
    }

    function apiCall(data) {
     
      let dateFormate = "";
      if (data?.globalCodeId == 122) {
        from = moment();
        to = moment().subtract(data?.number, data?.intervalType);
      } else if (data?.globalCodeId == 123) {
        from = moment();

        to = moment().subtract(data?.number, data?.intervalType);
      } else if (data?.globalCodeId == 344) {
        from = moment();
        to = moment().subtract(data?.number, data?.intervalType);
      } else {
        from = moment();
        to = moment().subtract(data?.number, data?.intervalType);
      }

      if (data?.globalCodeId == 122) {
        dateFormate = {
          fromDate: from ? timeStamp(startimeAdd(from)) : "",
          toDate: to ? timeStamp(endTimeAdd(to)) : "",
        };
      } else {
        dateFormate = {
          fromDate: timeStamp(startimeAdd(to)),
          toDate: timeStamp(endTimeAdd(from)),
        };
      }
      // if (paramId.value && route.name == "PatientSummary") {
      //   store.dispatch("escalationNotesList", {
      //     id: paramId.value,
      //     date: dateFormate,
      //   });
      //   store.dispatch("escalationVitalList", {
      //     id: paramId.value,
      //     date: dateFormate,
      //   });
      //   store.dispatch("esacalationCarePlansList", {
      //     id: paramId.value,
      //     date: dateFormate,
      //   });
      //   store.dispatch("esacalationFlagList", {
      //     id: paramId.value,
      //     date: dateFormate,
      //   });
      //   store.dispatch("escalationHistory", {
      //     referenceId: paramId.value
      //       ? paramId.value
      //       : escalationInfo.referenceId,
      //     date: dateFormate,
      //   });
      // } else if (escalationInfo.referenceId) {
        store.dispatch("escalationNotesList", {
          id: escalationInfo.referenceId,
          date: dateFormate,
        });
        store.dispatch("escalationVitalList", {
          id: escalationInfo.referenceId,
          date: dateFormate,
        });
        store.dispatch("esacalationCarePlansList", {
          id: escalationInfo.referenceId,
          date: dateFormate,
        });
        store.dispatch("esacalationFlagList", {
          id: escalationInfo.referenceId,
          date: dateFormate,
        });
        store.dispatch("escalationHistory", {
          referenceId: paramId.value
            ? paramId.value
            : escalationInfo.referenceId,
          date: dateFormate,
        });
        dateFliter();
      // }
    }

    const onSelectCareCoordinator = (selectedRowKeys, row) => {
      escalationAssignTo.staffs = row;
      escalationAssignTo.staffIds = selectedRowKeys;
    };

    const onSelectChangeCareCircle = (selectedRowKeys, row) => {
      escalationAssignTo.careCircle = row;
      escalationAssignTo.careCircleIds = selectedRowKeys;
    };
    const onSelectSpecialist = (selectedRowKeys, row) => {
      escalationAssignTo.specialist = row;
      escalationAssignTo.specialistIds = selectedRowKeys;
    };

    const onSelectChangeNotes = (selectedRowKeys, row) => {
      escalationDetails.notesId = selectedRowKeys;
      escalationDetails.notes = row;
    };

    const onSelectChangeNoteVitals = (selectedRowKeys, row) => {
      console.log("selectedRowKeys", selectedRowKeys);
      escalationDetails.notes = row;
    };
    const onSelectChangeCarePlan = (selectedRowKeys, row) => {
      
      escalationDetails.carePlanId = selectedRowKeys;
      escalationDetails.carePlan = row;
    };
    const onSelectChangeFlags = (selectedRowKeys, row) => {
      
      escalationDetails.flagIds = selectedRowKeys;
      escalationDetails.flags = row;
    };

    const onSelectChangeEscalation = (selectedRowKeys, row) => {
    
      escalationDetails.escalationId = selectedRowKeys;
      escalationDetails.escalation = row;
    };
    const editDataStaff = computed(() => {
      return store.state.escalations.editEscalationStaff;
    });

    const editDataPatient = computed(() => {
      return store.state.escalations.editEscalationPatient;
    });

    function showModal(id) {
      store.dispatch("staffSummary", id);
      store.commit("showStaffDetailsModal");
    }
    const handleGlobalChange = (data, type) => {
      if (type == "escalation.type") {
        escalationInfo.type = data;
      }
    };

    const onFinishFailed = () => {
     
    };
    const showProvider = () => {
      visibleProvider.value = true;
    };

    function dateFliter() {
      let fromDate = addDays(daysFilter.value);
      let dateFormat = {
        toDate: moment(Date.now()).format("X"),
        fromDate: fromDate,
      };
      if (escalationInfo.referenceId) {
        store.dispatch("escalationVitalList", {
          id: escalationInfo.referenceId,
          date: dateFormat,
        });
        store.dispatch("patientVitals", {
          patientId: escalationInfo.referenceId
            ? escalationInfo.referenceId
            : paramId.value,
          deviceType: 99,
          filter: dateFormat
            ? "&fromDate=" +
              dateFormat.fromDate +
              "&toDate=" +
              dateFormat.toDate
            : "",
        });
        store.dispatch("patientVitals", {
          patientId: escalationInfo.referenceId
            ? escalationInfo.referenceId
            : paramId.value,
          deviceType: 100,
          filter: dateFormat
            ? "&fromDate=" +
              dateFormat.fromDate +
              "&toDate=" +
              dateFormat.toDate
            : "",
        });
        store.dispatch("patientVitals", {
          patientId: escalationInfo.referenceId
            ? escalationInfo.referenceId
            : paramId.value,
          deviceType: 101,
          filter: dateFormat
            ? "&fromDate=" +
              dateFormat.fromDate +
              "&toDate=" +
              dateFormat.toDate
            : "",
        });
      }
    }
    function addDays(value) {
      let toDate = new Date();
      let fromDate = toDate.setDate(toDate.getDate() - value);
      return moment(fromDate).format("X");
    }

    let staffs = [];
    let Notes = [];

    const removeCareCoordinator = (id) => {
      staffs = escalationAssignTo.staffs;
      let temp = [];
      temp = staffs.filter((item) => item.id !== id);
      escalationAssignTo.staffs = temp;
      onSelectCareCoordinator(
        escalationAssignTo.staffs.map((item) => item.staffId),
        toRaw(escalationAssignTo.staffs)
      );
    };
    const removeCareCircle = (id) => {
      staffs = escalationAssignTo.careCircle;
      let temp = [];
      temp = staffs.filter((item) => item.id !== id);
      escalationAssignTo.careCircle = temp;
      onSelectChangeCareCircle(
        escalationAssignTo.careCircle.map((item) => item.staffId),
        toRaw(escalationAssignTo.careCircle)
      );
    };

    const removeSpecialist = (id) => {
      staffs = escalationAssignTo.specialist;
      let temp = [];
      temp = staffs.filter((item) => item.id !== id);
      escalationAssignTo.specialist = temp;
      onSelectSpecialist(
        escalationAssignTo.specialist.map((item) => item.staffId),
        toRaw(escalationAssignTo.specialist)
      );
    };

    const removeEscalationNotes = (id) => {
      Notes = escalationDetails.notes;
      let temp = [];
      temp = Notes.filter((item) => item.id !== id);
      escalationDetails.notes = temp;
      onSelectChangeNotes(
        escalationDetails.notes.map((item) => item.id),
        toRaw(escalationDetails.notes)
      );
    };

    const removeCarePlan = (id) => {
      Notes = escalationDetails.carePlan;
      let temp = [];
      temp = Notes.filter((item) => item.id !== id);
      escalationDetails.carePlan = temp;
      onSelectChangeCarePlan(
        escalationDetails.carePlan.map((item) => item.id),
        toRaw(escalationDetails.carePlan)
      );
    };

    const removeEscalation = (id) => {
      Notes = escalationDetails.escalation;
      let temp = [];
      temp = Notes.filter((item) => item.id !== id);
      escalationDetails.escalation = temp;
      onSelectChangeEscalation(
        escalationDetails.escalation.map((item) => item.id),
        toRaw(escalationDetails.escalation)
      );
    };

    const removeflag = (id) => {
      Notes = escalationDetails.flags;
      let temp = [];
      temp = Notes.filter((item) => item.id !== id);
      escalationDetails.flags = temp;
      onSelectChangeFlags(
        escalationDetails.flags.map((item) => item.id),
        toRaw(escalationDetails.flags)
      );
    };

    function showDetails(data) {
      (viewModal.value = true), (escalationAssignToData.value = data);
    }

    function preview(status) {
      previewStatus.value = status;
    }

    return {
      physiciansList,
      careTeamList,
      previewStatus,
      preview,
      formDetails,
      removeflag,
      removeEscalation,
      removeCarePlan,
      removeEscalationNotes,
      onSelectChangeNoteVitals,
      assignToError,
      formAssignTo,
      escalationAssignToData,
      showDetails,
      viewModal,
      tabs,
      columnData,
      onSelectChangeEscalation,
      addStaff,
      closeSpecialistModal,
      submitDetailsForm,
      assignToPatient,
      submitAssignTo,
      escalationInfo,
      escalationAssignTo,
      showPatientModal,
      removeSpecialist,
      onSelectSpecialist,
      removeCareCircle,
      removeCareCoordinator,
      onSelectCareCoordinator,
      addDays,
      dateFliter,
      daysFilter,
      careTeam,
      onSelectChangeCareCircle,
      showStaffModal,
      escaltionViewModal,
      vitals,
      showProvider,
      visibleProvider,
      toggleTo,
      onSelectChangeNotes,
      onSelectChangeCarePlan,
      onSelectChangeFlags,
      onFinishFailed,
      escalationData,
      handleGlobalChange,
      showModal,
      editDataPatient,
      editDataStaff,
      formRef,
      errorMsg,
      formEscalationDetails,
      paramId,
      handlePatientChange,
      timeline: store.getters.timeline,
      timeLineButton,
      screensPermissions: store.getters.screensPermissions,
      status,
      form,
      checkFieldsData,
      checkChangeInput,
      button,
      showButton,
      addEscalation,
      patientFlagList,
      carePlanList,
      activeKey,
      activeKeyVital,
      submitInfo,
      closeModal,
      globalDateFormat,
      moment,
      dayjs,
      arrayToObjact,
      globalCode,
      escalationDetails,
      current,
      next,
      prev,
      patientDetails,
      changeDate,
      dateSelect,
      dateChange,
      size: ref("large"),
      assignTo: ref("1"),
      detailTabs: ref("1"),
      VitalTab: ref("1"),
      notesTabs,
      formData: store.getters.formTitle,
      arrayToObjectData,
      formTitleNames,
      hideFilterEscalationModal,
      steps: [
        {
          title: "Escalation Info",
          content: "First-content",
        },
        {
          title: "Assign To",
          content: "Second-content",
        },
        {
          title: "Details",
          content: "Third-content",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.ant-table-body) {
  min-height:110px;
}
.escalationModal {
  .steps-content {
    .ant-form {
      .innerForm {
        min-height: calc(100vh - 500px);
        padding: 0 12px;
        .ant-tabs-nav {
          .ant-tabs-tab {
            font-size: 16px;
            color: #1890ff;
          }
        }
      }
      .steps-action {
        text-align: right;
      }
    }
  }
}

.dangerValue {
  padding: 5px;
  background-color: #f03131f3;
  color: #fff;
}

.errorMsg {
  color: #f03131f3;
}

// .ant-form-item-required {
//   font-weight: 700;
// }

.ant-modal-footer {
  display: none;
}

.toggleButton {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 6px 16px;
  display: inline-block;
  cursor: pointer;
  width: fit-content;
}

.toggleButton.active {
  background-color: #777;
  color: #fff;
}

.escalationPatient {
  .ant-select-dropdown {
    .ant-select-item-option-content {
      img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }
}

.ant-descriptions-view {
  margin: 10px 0 0;

  .ant-descriptions-item-container {
    .ant-descriptions-item-label {
      font-weight: 600;
    }
  }
}

.previewEscalation {
  border: 1px solid #e3e3e3;
  overflow: auto;
  max-height: calc(100vh - 190px);
  h3 {
    text-align: center;
    background: #e3e3e3;
  }

  .patientDetail {
    display: flex;
    align-content: center;
    gap: 15px;
    padding: 15px 15px 0;
    > div {
      padding-bottom: 15px;
    }
    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 50%;
    }

    .referalPhysican {
      border-left: 1px solid #e3e3e3;
      padding: 0px 0 15px 15px;

      h4 {
        labelfontsize: 16px;
      }
    }
  }

  .assignedTo {
    padding: 0 15px 15px;

    h4 {
      padding: 15px 0 0;
    }

    .ant-tag {
      display: inline-flex;
      align-items: center;
    }

    &.details {
      border-top: 1px solid #e3e3e3;
    }
  }
  .escalationType {
    padding: 15px;
    border-top: 1px solid #e3e3e3;
  }
}

.detailFilters {
  display: flex;
  align-items: center;

  .ant-input-number {
    width: 55px;
    margin: 0 10px 0 15px;
  }

  .ant-dropdown-link {
    .anticon {
      margin: 0 0 0 5px;
    }
  }
  .detailFilters {
    .ant-dropdown-link {
      .anticon {
        margin: 0 0 0 5px;
      }
    }
  }
  .detailTopFilters {
    text-align: right;
    .vitalFilter {
      display: inline-flex;
      align-items: center;
      .ant-input-number {
        width: 55px;
        margin: 0 10px 0 15px;
      }
    }
  }
}
</style>
