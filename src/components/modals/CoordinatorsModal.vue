<template>
<a-modal max-width="1140px" width="100%" :title="staffType == 342 ? $t('careCoordinator.coordinatorsModal.addNewCoordinator') : $t('specialists.addSpecialist')" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-row :gutter="24">
        <a-col :span="24">  
            <a-steps v-if="staffType == 342" v-model:current="current">
                <a-step v-for="item in steps" :key="item.title" :title="item.title?item.title:''" />
            </a-steps>
            <div class="steps-content" v-if="steps[current].title == 'Personal Information'">
                <a-form :model="personalInfoData" :scrollToFirstError="true" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,staffType == 342 ? 8:15,'id','name'),'name','udid')" ref="formRef" class="basic" name="basic"  autocomplete="off" layout="vertical" @finish="personalInfo" @finishFailed="onFinishFailed">
                    <!-- <PersonalInformation /> -->
                    <a-row :gutter="24">
                        <a-col :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: true, message: $t('global.firstName')+' '+$t('global.validation') }]">                                 
                                    <a-input v-model:value.trim="personalInfoData.firstName" class="firstName" @change="checkChangeInput()" size="large"/>
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.firstName" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.middleName')" name="middleName">
                                    <a-input v-model:value.trim="personalInfoData.middleName" class="middleName" @change="checkChangeInput()" size="large"/>
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.middleName" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="12" :xs="12" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: true, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                    <a-input v-model:value.trim="personalInfoData.lastName" @change="checkChangeInput()" size="large"/>
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.lastName" :name="errorMsg.lastName?errorMsg.lastName[0]:''" />
                                </a-form-item>
                                
                            </div>
                        </a-col> 
                        <a-col v-if="staffType == 342" :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <!-- <a-form-item name="designationId" :label="$t('global.designation')" :rules="[{ required: true, message: $t('global.designation')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.designationId" :dataId="17" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.designationId')" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.designationId" :name="errorMsg.designationId?errorMsg.designationId[0]:''" />
                                </a-form-item> -->
                                <a-form-item :label="$t('careCoordinator.roles.role')" name="roles" :rules="[{ required: true, message: $t('careCoordinator.roles.role')+' '+$t('global.validation') }]">
                                    <RoleDropDown v-model:value="personalInfoData.roles" @handleRoleChange="handleRoleChange($event)" @change="checkChangeInput()"/>
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.roles?errorMsg.roles:''" />
                                </a-form-item>
                            </div>

                        </a-col>
                        <a-col :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item name="genderId" :label="$t('global.gender')" :rules="[{ required: true, message: $t('global.gender')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.genderId" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.genderId')" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.genderId" :name="errorMsg.genderId?errorMsg.genderId[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.email')" name="email" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(),type: 'email' }]">
                                    <a-input v-model:value.trim="personalInfoData.email" size="large" placeholder="test@test.com" @blur="emailChange()" @change="checkChangeInput()" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.email?errorMsg.email[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                         <a-col :sm="8" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: true, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                                    <a-input v-maska="'###-###-####'" max="12" @change="checkChangeInput()"  v-model:value="personalInfoData.phoneNumber" placeholder="Please enter 10 digit number" size="large"  style="width: 100%" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.phoneNumber" :name="errorMsg.phoneNumber?errorMsg.phoneNumber[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col v-if="staffType == 342" :sm="4" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item label="Extension" name="extension" :rules="[{ required: false, message: $t('global.validValidation')+' '+'Extension'.toLowerCase(),pattern:regex.extension}]">
                                    <a-input  @change="checkChangeInput()"  v-model:value="personalInfoData.extension" placeholder="Enter 4 digit number" size="large" maxlength="4"  style="width: 100%" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.extension" :name="errorMsg.extension?errorMsg.extension[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.specialization')" name="specializationId" :rules="[{ required: true, message: $t('global.specialization')+' '+$t('global.validation') }]">

                                    <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.specializationId" :dataId="2" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.specializationId')" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.specializationId" :name="errorMsg.specializationId?errorMsg.specializationId[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col v-if="staffType == 342" :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.network')" name="networkId" :rules="[{ required: true, message: $t('global.network')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.networkId"  :dataId="10" @handleGlobalChange="handleGlobalChange($event,'personalInfoData.networkId')" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.networkId" :name="errorMsg.networkId?errorMsg.networkId[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        
                        <!-- <a-col :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item :label="$t('careCoordinator.coordinatorsModal.defaultLocation')" name="defaultLocation" :rules="[{ required: false, message: $t('careCoordinator.coordinatorsModal.defaultLocation')+' '+$t('global.validation') }]">
                                    <a-tree-select
                                        :getPopupContainer="triggerNode => triggerNode.parentNode"
                                        v-model:value="personalInfoData.defaultLocation"
                                        show-search
                                        style="width: 100%"
                                        placeholder="Select Location"
                                        :tree-data="parentProviderLocations"
                                        @treeExpand="getSubLocations"
                                        @select="selectLocation"
                                    />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.defaultLocation" :name="errorMsg.defaultLocation?errorMsg.defaultLocation[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col> -->

                        <a-col :span="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.provider')" name="provider" :rules="[{ required: false, message: $t('global.provider')+' '+$t('global.validation') }]">
                                    <ProvidersDropdown mode="multiple" v-model:value="personalInfoData.providers" placeholder="Search Provider" @handleProviderChange="handleProviderChange($event)" :fromStaff="true" />
                                    <!-- <ProvidersDropdown mode="multiple" :defaultProviderData="defaultProviderData" v-model:value="personalInfoData.providerId" @handleProviderChange="selectProvider($event)" placeholder="Search Location" /> -->
                                </a-form-item>
                            </div>
                        </a-col>

                        <a-col :span="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.defaultProvider')" name="defaultProvider" :rules="[{ required: true, message: $t('global.defaultProvider')+' '+$t('global.validation') }]">
									<select class="customSelect" v-model="personalInfoData.defaultProvider" size="large" ref="select" >
										<option hidden value="">Select Default Provider</option>
										<option v-for="provider in addedProviders" :key="provider.value" :value="provider.value">
											{{ provider.label }}
										</option>
									</select>
                                </a-form-item>
                            </div>
                        </a-col>

                        <!-- <template v-if="(dropdownProviderLocations && dropdownProviderLocations.length > 0) && isSuperAdmin" class="">
                            <a-col :span="8" v-for="(locations, index) in dropdownProviderLocations" :key="locations.id">
                                <a-form-item :label="dropdownProviderLocations[index][0].subLocationLevel ? dropdownProviderLocations[index][0].subLocationLevel : dropdownProviderLocations[index][0].entityType" name="defaultLocation" :rules="[{required: false, message:dropdownProviderLocations[index][0].subLocationLevel ? dropdownProviderLocations[index][0].subLocationLevel : dropdownProviderLocations[index][0].entityType+' '+$t('global.validation')}]">
                                    <select class="customSelect" v-model="personalInfoData.defaultLocation[index]" size="large" ref="select" placeholder="Location" @change="selectLocation($event, index);">
                                        <option v-for="location in locations" :key="location.id" :value="location">
                                            {{ location.name }}
                                        </option>
                                    </select> -->
                                    <!-- <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="personalInfoData.defaultLocation[index]" size="large" ref="select" placeholder="Locations" @change="selectLocation($event, index)">
                                        <a-select-option v-for="location in locations" :key="location.id" :value="location">
                                            {{ location.name }}
                                        </a-select-option>
                                    </a-select> -->
                                <!-- </a-form-item>
                            </a-col>
                        </template> -->
                        
                        <!-- <a-col v-if="staffType == 342 && isSuperAdmin && personalInfoData.defaultLocation.length > 0" :sm="12" :xs="24" :xl="12">
                            <div class="form-group">
                                <a-form-item :label="$t('careCoordinator.coordinatorsModal.program')" name="program" :rules="[{ required: true, message: $t('careCoordinator.coordinatorsModal.program')+' '+$t('global.validation') }]">
                                    <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-model:value="personalInfoData.program" size="large">
                                        <a-select-option v-for="program in programsDropdownList" :key="program.programId" :value="program.programId">{{ program.program }}</a-select-option>
                                    </a-select>
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.program" :name="errorMsg.program?errorMsg.program[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col> -->

                        <a-col v-if="staffType == 343" :sm="4" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item label="Organisation" name="organisation" :rules="[{ required: true, message: 'Organisation '+$t('global.validation') }]">
                                    <a-input @change="checkChangeInput()" v-model:value="personalInfoData.organisation" size="large" style="width: 100%" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.organisation" :name="errorMsg.organisation ? errorMsg.organisation[0] : ''" />
                                </a-form-item>
                            </div>
                        </a-col>

                        <a-col v-if="staffType == 343" :sm="4" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item label="Location" name="location" :rules="[{ required: false, message: 'Location '+$t('global.validation') }]">
                                    <a-input @change="checkChangeInput()" v-model:value="personalInfoData.location" size="large" style="width: 100%" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.location" :name="errorMsg.location ? errorMsg.location[0] : ''" />
                                </a-form-item>
                            </div>
                        </a-col>

                        <a-col v-if="staffType == 343" :sm="4" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item label="Building" name="building" :rules="[{ required: false, message: 'Building '+$t('global.validation') }]">
                                    <a-input @change="checkChangeInput()" v-model:value="personalInfoData.building" size="large" style="width: 100%" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.building" :name="errorMsg.building ? errorMsg.building[0] : ''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <!-- <a-col :sm="12" :xs="24" :xl="8">
                            <div class="form-group">
                                <a-form-item name="staffType" :label="$t('global.staffType')" :rules="[{ required: false, message: $t('global.staffType')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.type" :dataId="75" @handleGlobalChange="handleGlobalChange($event, 'personalInfoData.type')" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.type" :name="errorMsg.type ? errorMsg.type[0] : ''" />
                                </a-form-item>
                            </div>
                        </a-col> -->
                        <!-- <a-col :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.level')" name="level" :rules="[{ required: true, message: $t('global.level')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="checkChangeInput()" v-model:value="personalInfoData.level" :globalCode="careCordinator.staffLevels" />
                                    <ErrorMessage v-if="errorMsg && !personalInfoData.level" :name="errorMsg.level?errorMsg.level[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col> -->
                    </a-row>
                    <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,staffType == 342 ? 8:15,'id','name'),'name','udid')"> </FormBaseComponents>
                    <div v-if="staffType == 343" class="steps-action personalInformation">
                        <FormButtons @onCancel="closeModal"  :submitButton="update ? $t('global.update') : $t('global.save')" />
                    </div>

                    <div v-else class="steps-action personalInformation">
                        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                        <a-button v-if="current < steps.length - 1" type="primary" html-type="submit">{{$t('global.next')}}</a-button>
                    </div>

                </a-form>
            </div>

            <div class="steps-content" v-if="steps[current].title == 'Emergency Contacts'">
                <Contacts id="contact" />
                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next">{{$t('global.next')}}</a-button>
                </div>
            </div>

            <div class="steps-content" v-if="steps[current].title == 'Availability'" @click="stepperClick(2)">
                <Availability />
                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next">{{$t('global.next')}}</a-button>

                </div>
            </div>
            <!--<div class="steps-content" v-if="steps[current].title == 'Roles'">
                <Roles />
                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next">{{$t('global.next')}}</a-button>
                </div>
            </div> -->
            <div class="steps-content" v-if="steps[current].title == 'Documents'">
                <StaffDocuments entity="staff" />
                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next">{{$t('global.next')}}</a-button>
                    <a-button v-if="current == steps.length - 1" type="primary" @click="saveModal()">
                        {{$t('global.save')}}
                    </a-button>
                </div>
            </div>

        </a-col>
    </a-row>
    <Loader />
</a-modal>
</template>

<script>
import {
    reactive,
    computed,
    onUnmounted,
    watchEffect,
    ref,
    onMounted,
		defineAsyncComponent,
		defineComponent
} from "vue";
import Contacts from "@/components/modals/forms/Contacts";
import Availability from "@/components/modals/forms/Availability";
// import Roles from "@/components/modals/forms/Roles";
import StaffDocuments from "@/components/modals/forms/StaffDocuments";
import {
    useStore
} from "vuex";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import {
    regex
} from "@/RegularExpressions/regex";
import {
    successSwal,
    warningSwal,
    arrayToObjectData,
    formTitleNames,
    errorSwal,deCodeString, key
} from "@/commonMethods/commonMethod";
import {
    messages
} from "@/config/messages";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import FormButtons from "@/components/common/button/FormButtons"
// import PhoneNumber from "@/components/modals/forms/fields/PhoneNumber"
import Loader from "@/components/loader/Loader";
import FormBaseComponents from "@/components/modals/FormBaseComponents"
import RoleDropDown from "@/components/modals/search/RoleDropdownSearch.vue"
export default defineComponent({
    components: {
        Contacts,
        Availability,
        // Roles,
        StaffDocuments,
        ErrorMessage,
        GlobalCodeDropDown,
        FormButtons,
        ProvidersDropdown: defineAsyncComponent(()=>import("@/components/modals/search/ProvidersDropdown")),
        Loader,
        FormBaseComponents,
        // PhoneNumber
        // PhoneNumber,
        RoleDropDown
    },
    props: {
        staffType: {
            type: Number
        }
    },
    setup(props, {
        emit
    }) {
        const store = useStore();
        const phone = ref()
        const formRef = ref();
        const isSuperAdmin = ref(true);
        const current = computed({
            get: () =>
                store.state.careCoordinator.counter,
            set: (value) => {
                if (addStaff.value) {
                    store.state.careCoordinator.counter = value;
                }
                else {
                    if (Object.values(personalInfoData).filter(item => item != '').length >= 8) {
                        personalInfo();
                    }
                    else {
                        errorSwal(messages.fieldsRequired)
                        store.state.careCoordinator.counter = 0;
                    }
                }

            },
        })
        const authUser = JSON.parse(localStorage.getItem("auth")).user;
        const authStaff = authUser.staff

        const staffsRoleList = computed(() => {
            return store.state.careCoordinator.roleList;
        });

        const personalInfoData = reactive({
            firstName: "",
            middleName: "",
            lastName: "",
            designationId: "",
            genderId: "",
            email: "",
            phoneNumber: "",
            specializationId: "",
            networkId: "",
            roles: "",
            // level: "",
            extension: "",
            type: props.staffType,
            organisation: "",
            location: "",
            building: "",
            // defaultLocation: [],
            entityType: "",
            providers: [],
            defaultProvider: "",
            program: "",
        });

        const setPhoneNumber = (value) => {
            personalInfoData.phoneNumber = value
        }

        const personalInfo = () => {
            personalInfoData.phoneNumber = personalInfoData.phoneNumber.replace(/-/g,'')
            let dataRecord = {
                firstName: personalInfoData.firstName,
                middleName: personalInfoData.middleName,
                lastName: personalInfoData.lastName,
                designationId: personalInfoData.designationId,
                genderId: personalInfoData.genderId,
                email: personalInfoData.email,
                phoneNumber: personalInfoData.phoneNumber,
                specializationId: personalInfoData.specializationId,
                networkId: props.staffType == 343 ? 5 : personalInfoData.networkId,
                roleId: personalInfoData.roles,
                providers: personalInfoData.providers,
                defaultProvider: personalInfoData.defaultProvider,
                organisation: personalInfoData.organisation,
                location: personalInfoData.location,
                extension:personalInfoData.extension,
				type:props?.staffType?props?.staffType:''
            }
            // setTimeout(() => {
           
            if (addStaff.value == null) {
                store.dispatch("addStaff", dataRecord).then((status)=>{
                store.dispatch("staffs");
                personalInfoData.firstName = deCodeString(key,personalInfoData.firstName)
                personalInfoData.middleName = deCodeString(key,personalInfoData.middleName)
                personalInfoData.lastName = deCodeString(key,personalInfoData.lastName)
                if(status == true && personalInfoData.roles){
                    store.dispatch("addStaffRole", {
                      id: addStaff.value.id,
                      data: {roles:[personalInfoData.roles]},
                    })
                }else{
                    emit('closeSpecialistModal',false)
                    store.dispatch("specialists")
                }
                })
            }
            if (addStaff.value != null) {
                store.dispatch("staffs");
                store.state.careCoordinator.errorMsg = ''
                store.dispatch("updateStaff", {
                    id: addStaff.value.id,
                    data: dataRecord
                }).then(()=>{
                store.dispatch("staffs");
                personalInfoData.firstName = deCodeString(key,personalInfoData.firstName)
                personalInfoData.middleName = deCodeString(key,personalInfoData.middleName)
                personalInfoData.lastName = deCodeString(key,personalInfoData.lastName)
                })
            }
        };

        const next = () => {
            store.commit("counterPlus");
        };
        const prev = () => {
            store.commit("counterMinus");
        };

        const onFinishFailed = (value) => {
            // errorSwal(messages.fieldsRequired);
            console.log("test", value);
        };

        const handleChange = () => {};

        const careCordinator = computed(() => {
            return store.state.common;
        });

        const addStaff = computed(() => {
            return store.state.careCoordinator.addStaff;
        });

        const errorMsg = computed(() => {
            return store.state.careCoordinator.errorMsg;
        });

        function emailChange() {
            errorMsg.value.email ? errorMsg.value.email[0] = null : ''
        }

        const form = reactive({
            ...personalInfoData,
        });

        /* function findNodeWithId(key, locationsList) {
            for(let location of locationsList) {
                if(location.key === key) {
                    return location
                }
                if(location.children) {
                    const idFoundInChildren = findNodeWithId(key, location.children)
                    if(idFoundInChildren !== null) {
                        return idFoundInChildren
                    }
                }
            }
            return null
        } */

        /* const getSubLocations = (value) => {
            let findNode = findNodeWithId(value, parentProviderLocations.value)
            findNode.children = []
            store.dispatch('subLocationsList', {
                providerId: selectedProvider.value.id,
                locationId: findNode.id,
                entityType: findNode.entityType,
                parentKey: findNode.key,
            }).then(() => {
                subLocationsList.value.map(subLocation => {
                    if(subLocation.parentKey == findNode.key) {
                    findNode.children.push({
                        value: subLocation,
                        title: subLocation.title,
                        id: subLocation.id,
                        key: subLocation.key,
                        parentKey: subLocation.parentKey,
                        udid: subLocation.udid,
                        name: subLocation.name,
                        parentId: subLocation.parentId,
                        parentName: subLocation.parentName,
                        providerId: subLocation.providerId,
                        providerName: subLocation.providerName,
                        entityType: subLocation.entityType,
                        programs: subLocation.programs,
                        children: [{}],
                    })
                    }
                })
            })
        } */

        function saveModal() {
            if (addStaff.value) {
                emit("saveModal", false);
                successSwal(messages.formSuccess);
                Object.assign(personalInfoData, form);
                store.dispatch("staffs");
                store.dispatch('specializationStaff')
                store.dispatch('networkStaff')
                store.commit("resetCounter");
                store.state.careCoordinator.errorMsg = ''
                store.state.careCoordinator.addStaff = null
            } else {
                warningSwal('No data have to save!').then((response) => {
                    if (response == true) {
                        emit("saveModal", false)
                        store.commit("resetCounter")
                    } else {
                        emit("saveModal", true);
                    }
                })
            }
        }

        function checkChangeInput() {
            store.commit('checkChangeInput', true)
        }

        const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput;
        })

        // const locationPrograms = computed(() => {
        //     return store.state.provider.locationPrograms
        // })

        // const getProviderPrograms = computed(() => {
        //     return store.state.provider.getProviderPrograms
        // })

        const parentProviderLocations = computed(() => {
            return store.state.provider.parentProviderLocations
        })

        /* const subLocationsList = computed(() => {
            return store.state.provider.subLocationsList
        }) */

        function closeModal() {
            store.state.provider.dropdownProviderLocations = []
            /* if(authStaff.providerId == "") {
							store.commit('selectedProvider', "")
            } */
            programsDropdownList.value = null
            emit("saveModal", true)
            emit("closeModal")
            if (checkFieldsData.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        emit("saveModal", false)
                        emit("closeModal")
                        store.state.careCoordinator.errorMsg = ''
                        Object.assign(personalInfoData, form);
                        
                        store.dispatch("staffs")
                        store.dispatch('specializationStaff')
                        store.dispatch('networkStaff')
                        store.commit("resetCounter")
                        store.commit('checkChangeInput', false)
                        store.state.careCoordinator.addStaff = null
                         formRef.value.resetFields()

                    } else {
                       
                        emit("saveModal", true);
                        emit("closeModal");
                    }
                });
            }else{
                store.state.careCoordinator.addStaff = null
                Object.assign(personalInfoData, form);
                store.commit("resetCounter")
                store.state.careCoordinator.errorMsg = ''
                emit("saveModal", false)
                emit("closeModal")
                formRef.value.resetFields()
            }
        }

        const selectedProvider = computed(() => {
            return store.state.provider.selectedProvider
        })

        /* const selectedLocation = computed(() => {
            return store.state.provider.selectedLocation
        }) */

        const providerLocations = computed(() => {
            return store.state.provider.providerLocations
        })
    
        const programsDropdownList = ref(null)
        const isProviderDisabled = ref(false)

        onMounted(()=>{
            let userRoles = authStaff?.role?.map(role => {
                return role.name
            })
            if(userRoles?.includes("Super Admin")) {
                isSuperAdmin.value = false
            }
            store.state.careCoordinator.documentStaffDetails=null
            if(props.staffType == 343) {
                personalInfoData.networkId = 5
            }
            if(selectedProvider.value != null && selectedProvider.value != "") {
                isProviderDisabled.value = true
                // if(authStaff.providerId != "") {
                //     store.dispatch('providerLocations', selectedProvider.value.id).then(() => {
                //         store.commit('dropdownProviderLocations', providerLocations.value)
                //     })
                // }
                // else {
                //     store.state.provider.dropdownProviderLocations = []
                //     personalInfoData.defaultLocation = []
                // }
                store.dispatch('editSingleProvider', selectedProvider.value)
                // personalInfoData.providerId = selectedProvider.value.id
            }
        })
        onUnmounted(() => {
            store.commit('errorMsg', null)
            store.state.careCoordinator.addStaff =null
        })
        watchEffect(() => {
                
            if (addStaff.value) {
                store.dispatch("roleList", addStaff.value.id);
                store.dispatch("availabilityList", addStaff.value.id);
                store.dispatch("staffContactList", addStaff.value.id);
                store.dispatch("staffDocuments", addStaff.value.id);
                

            }
        })
        const paramId = addStaff.value ? addStaff.value.id : ''

         const handleGlobalChange = (data, type) => {
            if (type == "personalInfoData.designationId") {
                personalInfoData.designationId = data;
            }
            if (type == "personalInfoData.genderId") {
                personalInfoData.genderId = data;
            }
            if (type == "personalInfoData.specializationId") {
                personalInfoData.specializationId = data;
            }
            if (type == "personalInfoData.networkId") {
                personalInfoData.networkId = data;
            }
            // if (type == "personalInfoData.type") {
            //     personalInfoData.type = data;
            // }
        }

        let steps = [{
                title: "Personal Information",
                content: "First-content",
            },
            {
                title: "Emergency Contacts",
                content: "Second-content",
            },
            {
                title: "Availability",
                content: "Second-content",
            },
            /* {
                title: "Roles",
                content: "Second-content",
            }, */
            {
                title: "Documents",
                content: "Second-content",
            },
        ]

        /* const selectLocation = (selected, index) => {
            let location = selected.target.selectedOptions[0]._value
            store.commit('loadingStatus', true)
            // personalInfoData.defaultLocation = location.name
            dropdownProviderLocations.value.splice(index+1, 100)
            store.dispatch('locationPrograms', {
                providerID: selectedProvider.value.id,
                locationID: location.id,
                entityType: location.entityType,
            }).then(() => {
                programsDropdownList.value = location.programs
                if(location.programs.length == 0) {
                    store.commit('errorMsg', {
                        program: {
                            0: "Please add programs for the selected location"
                        }
                    })
                }
                else {
                    store.commit('errorMsg', null)
                }
            })
            store.dispatch('dropdownSubLocations', {
                providerId: selectedProvider.value.id,
                locationId: location.id,
                entityType: location.entityType,
            }).then(() => {
                store.commit('selectedLocation', location)
                store.commit('loadingStatus', false)
            })
        } */

        /* const selectProvider = (provider) => {
            personalInfoData.providerId = provider
            store.commit('loadingStatus', true)
            store.state.provider.dropdownProviderLocations = []
            store.commit('selectedProvider', {
                id: provider
            })
            store.dispatch('getProviderPrograms', provider).then(() => {
                programsDropdownList.value = getProviderPrograms.value
            })
            store.dispatch('dropdownProviderLocations', provider).then(() => {
                store.commit('loadingStatus', false)
            })
        } */

        const providersList = computed(() => {
            return store.state.provider.providersListAll
        })

        const dropdownProviderLocations = computed(() => {
            return store.state.provider.dropdownProviderLocations
        })

        const defaultProviderData = computed(() => {
            return store.state.provider.defaultProviderData
        })

        const addedProviders = computed(() => {
            return store.state.provider.addedProviders
        })
        const handleRoleChange = (val) => {
            personalInfoData.roles = val;
        };

			const handleProviderChange = (selectedList) => {
				let list = []
				selectedList.map(element => {
					list.push(element.value)
				})
				personalInfoData.providers = list;
				store.commit('addedProviders', selectedList)
			};

        return {
            handleProviderChange,
            handleRoleChange,
            staffsRoleList,
            defaultProviderData,
            addedProviders,
            dropdownProviderLocations,
            // selectProvider,
            providersList,
            handleGlobalChange,
            setPhoneNumber,
            phone,
            formRef,
            checkFieldsData,
            checkChangeInput,
            paramId,
            closeModal,
            form,
            saveModal,
            emailChange,
            handleChange,
            regex,
            errorMsg,
            addStaff,
            careCordinator,
            personalInfoData,
            current,
            personalInfo,
            steps,
            next,
            prev,
            onFinishFailed,
            providerLocations,
            programsDropdownList,
            parentProviderLocations,
            // getSubLocations,
            // selectLocation,
            isSuperAdmin,
            isProviderDisabled,
            formData:store.getters.formTitle,
            arrayToObjectData,
            formTitleNames,
            deCodeString,
            key
        };
    },
});
</script>

<style scoped>
.steps-content {
    margin-top: 16px;
    border-radius: 6px;
    min-height: 200px;
    text-align: left;
    padding: 12px 0;
    overflow-x: hidden;
    overflow-y: auto;
}

.steps-action {
    text-align: right;
}
.personalInformation {
    margin: 10px 0 0;
}
.ant-select {
    display: block !important;
}
</style>
