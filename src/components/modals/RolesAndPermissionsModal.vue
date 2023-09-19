<template>
<a-modal max-width="900px" width="90%" :title="editRole ? 'Edit Role : '+roleDetails?.name : 'Create New Role'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-row :gutter="24">
        <a-col :span="24">

            <a-steps :current="current">
                <a-step v-for="item in steps" :key="item.title" :title="item.title" />
            </a-steps>
            <div class="steps-content" v-if="steps[current].title == 'Select Role'">
                <a-row :gutter="24">
                    <a-col :sm="8" :xs="24">
                        <div class="roles">
                            <h4>Select a Role</h4>
                            <a-radio-group v-model="role" @change="onRoleChange">
                                <template v-for="role in rolesAndPermissions.selectRoleRecords" :key="role.id">

                                    <div class="radioInput" v-if="roleId">
                                        <a-radio v-if="roleId === role.udid" v-model:checked="role.udid" @change="checkChangeInput()">{{ role.name }}</a-radio>
                                        <a-radio :value="role.udid" v-else @change="checkChangeInput()">{{ role.name }}</a-radio>
                                    </div>
                                    <div class="radioInput" v-else>

                                        <a-radio @change="checkChangeInput()" :value="role.udid">{{ role.name}}</a-radio>
                                    </div>
                                </template>
                            </a-radio-group>
                        </div>
                    </a-col>
                    <RolePermissionsList v-if="showList" :roleId="getId" />
                </a-row>
                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">Previous</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next">Next</a-button>
                    <a-button v-if="current == steps.length - 1" type="primary" @click="$message.success('Processing complete!')">
                        Done
                    </a-button>
                </div>
            </div>
            <div class="steps-content" v-if="steps[current].title == 'Describe Role'">
                <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,30,'id','name'),'name','udid')" :model="addRoleForm" layout="vertical" @finish="submitForm">
                    <a-row :gutter="24">
                        <a-col :sm="24" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.level')" name="level" :rules="[{ required: true, message: $t('global.level')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @handleGlobalChange="checkChangeInput();handleGlobalChange($event)" :dataId="53" v-model:value="addRoleForm.level" />
                                    <ErrorMessage v-if="errorMsg && !addRoleForm.level" :name="errorMsg.level?errorMsg.level[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="24" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('roles.name')" name="name" :rules="[{ required: true, message: $t('roles.name')+' '+$t('global.validation')  }]">
                                    <a-input v-model:value="addRoleForm.name" size="large" @change="checkChangeInput()" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="24" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('roles.description')" name="description" :rules="[{ required: true, message: $t('roles.description')+' '+$t('global.validation')  }]">
                                    <a-textarea v-model:value="addRoleForm.description" placeholder="Description" allow-clear @change="checkChangeInput()" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,30,'id','name'),'name','udid')"> </FormBaseComponents>

                        <a-col :sm="24" :xs="24">
                            <div class="steps-action">
                                <a-button v-if="!editRole || !roleId &&  current > 0" style="margin-right: 8px" @click="prev">Previous</a-button>
                                <a-button v-if="current < steps.length - 1" type="primary" html-type="submit">Next</a-button>
                                <a-button v-if="current == steps.length - 1" type="primary" @click="$message.success('Processing complete!')">
                                    Done
                                </a-button>
                            </div>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="steps-content" v-if="steps[current].title == 'Permissions'">

                <!-- Search Box -->
                <a-col :md="24" :sm="24" :xs="24" class="mb-24">
                    <a-input @change="selectedRoles($event)" size="large" placeholder="Search..." id="conditionBox" />
                </a-col>

                <h4><strong>Select Permissions</strong></h4>

                <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,31,'id','name'),'name','udid')" ref="formRef" :model="addPermissionsForm" @finish="addPermissions" v-if="rolesAndPermissions.rolePermissions.modules">

                    <!-- For Search Start -->
                    <a-row>
                        <a-col :span="24" v-for="module in rolesAndPermissions.rolePermissions.modules" :key="module.id" >
                            <div v-if="module.id==18"></div>
                            <a-col v-show="moduleId.length == 0 || moduleId.includes(module.id)" v-else :span="24">
                                <a-card :title="module.name">
                                    <div class="screens" v-for="screen in module.screens" :key="screen.moduleId">
                                        <a-checkbox v-model:checked="addPermissionsForm.screen[screen.id]" @change="checkAll(screen.actions,screen.id); checkChangeInput()"><strong>{{ screen.name }}</strong></a-checkbox>
                                        <a-divider class="transparent" />
                                        <a-checkbox class="actions" v-for="action in screen.actions" :key="action.id" v-model:checked="addPermissionsForm.action[action.id]" @change="checkStatus(screen.id,screen.actions); checkChangeInput()">{{ action.name }}</a-checkbox>
                                        <a-divider class="transparent" />
                                    </div>
                                </a-card>
                                <a-divider class="transparent" />
                            </a-col>
                        </a-col>
                       

                    </a-row>
                    <!-- For Search End -->

                    <a-row v-if="!moduleId">
                        <a-col :span="24" v-for="module in rolesAndPermissions.rolePermissions.modules" :key="module.id">
                            <div v-if="module.id==18">
                            </div>

                            <a-card v-else :title="module.name">
                                <div class="screens" v-for="screen in module.screens" :key="screen.moduleId">
                                    <a-checkbox v-model:checked="addPermissionsForm.screen[screen.id]" @change="checkAll(screen.actions,screen.id); checkChangeInput()"><strong>{{ screen.name }}</strong></a-checkbox>
                                    <a-divider class="transparent" />
                                    <a-checkbox class="actions" v-for="action in screen.actions" :key="action.id" v-model:checked="addPermissionsForm.action[action.id]" @change="checkStatus(screen.id,screen.actions); checkChangeInput()">{{ action.name }}</a-checkbox>
                                    <a-divider class="transparent" />
                                </div>
                            </a-card>
                            <a-divider class="transparent" />

                        </a-col>
                    </a-row>
                    <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,31,'id','name'),'name','udid')"> </FormBaseComponents>

                    <div class="steps-action">
                        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">Previous</a-button>
                        <a-button v-if="current < steps.length - 1" type="primary" html-type="submit">Next</a-button>
                        <a-button v-if="current == steps.length - 1" type="primary" html-type="submit">Done</a-button>
                    </div>
                </a-form>
            </div>
            <div class="steps-content" v-if="steps[current].title == 'Dashboard Widgets'">
                <h4><strong>Select Widgets</strong></h4>

                <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,32,'id','name'),'name','udid')" ref="formRef2" :model="dashboardPermission" @finish="dashboardForm" v-if="rolesAndPermissions.dashboardWidget">
                    <a-row>
                        <a-col :span="24">

                            <div class="screens" v-for="widget in rolesAndPermissions.dashboardWidget" :key="widget.id">
                                 <a-card  :title="widget.name">
                                <div class="screens" v-for="dashboard in widget.widget" :key="dashboard.id+widget.id">
                                <a-checkbox v-model:checked="dashboardPermission.widget[dashboard.id]"><strong>{{ dashboard.widgetName }}</strong></a-checkbox>
                                </div>
                                 </a-card>
                            </div>

                            <a-divider class="transparent" />
                        </a-col>
                        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,32,'id','name'),'name','udid')"> </FormBaseComponents>

                    </a-row>
                    <div class="steps-action">
                        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">Previous</a-button>
                        <a-button v-if="current < steps.length - 1" type="primary" html-type="submit">Next</a-button>
                        <a-button v-if="current == steps.length - 1" type="primary" html-type="submit">Done</a-button>
                    </div>
                </a-form>
            </div>
        </a-col>
        <Loader />
    </a-row>
</a-modal>
</template>

<script>
import {
    reactive,
    ref,
    watchEffect,
    onMounted,
    computed
} from "vue";
import {
    useStore
} from "vuex"
import RolePermissionsList from "@/components/administration/rolesAndPermissions/RolePermissionsList"
// import rolePermissions from "@/data/permissions.json"
import Loader from "./../loader/Loader"
import {
    warningSwal,
    arrayToObjact,
    arrayToObjectData,formTitleNames
} from "@/commonMethods/commonMethod"
import {
    messages
} from "./../../config/messages";
//import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
//import ModalButtons from "@/components/common/button/ModalButtons";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue"
import FormBaseComponents from "@/components/modals/FormBaseComponents"
export default {
    components: {
        RolePermissionsList,
        Loader,
        GlobalCodeDropDown,
        FormBaseComponents
    },
    props: {
        roleId: {
            type: String
        },
        editRole: {
            type: String
        }
    },
    setup(props, {
        emit
    }) {
        const store = useStore();
        const current = ref(0);
        const getId = ref(null);

        const showList = ref(false);
        const checkedValue = ref(true);

        const rolesAndPermissions = store.getters.rolesAndPermissionsRecord.value
        const formRef = ref()
        const formRef2 = ref()

        const addRoleForm = reactive({
            level: '',
            name: '',
            description: ''
        })

        const addPermissionsForm = reactive({
            action: [],
            screen: []
        })
        const dashboardPermission = reactive({
            widget: []
        })
        const rolesList = rolesAndPermissions.rolesList

        const globalCodes = computed(() => {
            return store.state.common;
        });
        const roleDetails = computed(() => {
            return store.state.rolesAndPermissions.roleDetails
        })

        const onRoleChange = (event) => {
            getId.value = event.target.value;
            showList.value = true;
            store.dispatch('editPermissions', event.target.value).then(() => {
                copyPermission()

            })
        }
        getId.value = props.editRole ? reactive(props.editRole) : reactive(props.roleId)
        getId.value ? current.value++ : ''

        watchEffect(() => {

            if (props.editRole) {

                Object.assign(addRoleForm, rolesAndPermissions.roleDetails ? rolesAndPermissions.roleDetails : '')
                if (rolesAndPermissions.editRolesAndPermissions) {
                    copyPermission()

                }

            } else if (props.roleId) {

                store.dispatch('editdWidget', props.roleId)
                store.dispatch('editPermissions', props.roleId).then(() => {
                    copyPermission()

                })

            }

        })
        onMounted(() => {
            store.dispatch('selectRoleRecords')
            store.dispatch('rolePermissions')
            store.dispatch('dashboardWidget')
        })
        ///role submit
        const submitForm = () => {

            let getRoleId = props.editRole ? reactive(props.editRole) : rolesAndPermissions.addRole ? rolesAndPermissions.addRole.udid : ""

            if (getRoleId) {

                store.dispatch('UpdateRole', {
                    data: {
                        ...addRoleForm
                    },
                    id: getRoleId,
                    show: false
                }).then((resp)=>{
                    if(resp==true){
                        store.dispatch('rolesList')
                        store.dispatch("permissions")
                    }
                })
            } else {
                store.dispatch('addRole', addRoleForm).then((resp)=>{
                    if(resp==true){
                        store.dispatch('rolesList')
                        store.dispatch("permissions")
                    }
                })
            }
           
            current.value++;
        }
        //permission submit
        const addPermissions = () => {
            let action = []
            let check = ''
            addPermissionsForm.action.forEach(function (Element, i) {
                if (Element) {
                    action.push(i);
                    check = Element
                }
            });
            if (props.editRole) {
                store.dispatch("addPermissions", {
                    data: {
                        actions: action
                    },
                    id: props.editRole,
                    check: check
                })
            } else {
                let udid = rolesAndPermissions.addRole.udid
                store.dispatch("addPermissions", {
                    data: {
                        actions: action
                    },
                    id: udid,
                    check: check
                })
            }
            current.value++;

        }
        //dasboard widgets
        const dashboardForm = () => {
            let widget = []
            let check = ''

            dashboardPermission.widget.forEach(function (Element, i) {
                if (Element) {
                    widget.push(i);
                    check = Element
                }
            });
            if (props.editRole) {
                store.dispatch("addDashboardWidget", {
                    data: {
                        widgets: widget
                    },
                    id: props.editRole,
                    check: check
                })
            } else {
                let udid = rolesAndPermissions.addRole.udid
                store.dispatch("addDashboardWidget", {
                    data: {
                        widgets: widget
                    },
                    id: udid,
                    check: check
                })
                store.commit('checkChangeInput', false)
            }
            reset();
            rolesAndPermissions.addRole = ''
            emit('on-submit')
            emit("is-visible", false);
        }

        function copyPermission() {
            rolesAndPermissions.editRolesAndPermissions.forEach((Element) => {

                Element.screen.forEach((screenElement) => {

                    screenElement.forEach((getData) => {

                        rolesAndPermissions.rolePermissions ? rolesAndPermissions.rolePermissions.modules.forEach((formModule) => {
                            let screens = arrayToObjact(formModule.screens, getData.id)

                            if (screens) {

                                getData.action ? getData.action.length === screens.actions.length ? addPermissionsForm.screen[getData.id] = true : '' : ''
                            }

                        }) : ''

                        getData.action ? getData.action.forEach((action) => {
                            action.forEach((getAction) => {
                                addPermissionsForm.action[getAction.id] = true
                            })
                        }) : ""
                    })
                })

            })
            rolesAndPermissions.editWidget ? rolesAndPermissions.editWidget.forEach((Element) => {
                dashboardPermission.widget[Element.id] = true
            }) : ''

        }

        function checkAll(actions, value) {

            actions.map((item) => {

                addPermissionsForm.screen[value] == true ? addPermissionsForm.action[item.id] = true : addPermissionsForm.action[item.id] = false
            })
        }

        function checkStatus(value, check) {
            let checkBox = true
            check.forEach((item) => {
                addPermissionsForm.action[item.id] == true ? '' : checkBox = false
            })
            checkBox ? addPermissionsForm.screen[value] = true : addPermissionsForm.screen[value] = false
            //addPermissionsForm.action[actions] == true ? "" : addPermissionsForm.screen[value] = false
        }
        const form = reactive({
            ...addRoleForm,
        });
        const formSecond = reactive({
            ...addPermissionsForm,
        });
        const formThird = reactive({
            ...dashboardPermission,
        });

        function checkChangeInput() {
            store.commit('checkChangeInput', true)
        }

        const checkFieldsData = computed(() => {
            return store.state.common.checkChangeInput;
        })

        function closeModal() {
            emit("is-visible", true)
            if (checkFieldsData.value) {
                warningSwal(messages.modalWarning).then((response) => {
                    if (response == true) {
                        reset()
                        emit("is-visible", false);
                        store.commit('checkChangeInput', false)
                    } else {
                        emit("is-visible", true);
                    }
                })
            } else {
                reset()
                emit("is-visible", false)
            }
        }

        function reset() {
            //formRef.value.resetFields();
            //formRef2.value.resetFields()
            Object.assign(addRoleForm, form)
            Object.assign(addPermissionsForm, formSecond)
            Object.assign(dashboardPermission, formThird)
            store.state.rolesAndPermissions.addRole = null
            store.state.rolesAndPermissions.editRolesAndPermissions = null
            store.state.rolesAndPermissions.dashboardWidget = null
            store.state.rolesAndPermissions.rolePermissions = null
            // props.editRole = null
            //props.roleId = null

        }
        const next = () => {
            current.value++;
        }

        const prev = () => {
            current.value--;
        }

        /* For Search Start */

        let moduleId = ref([])
        const selectedRoles = (event) => {
            const searchedValue = (event.target.value).toLowerCase()
            if(searchedValue == "" || searchedValue == null) {
                moduleId.value = []
            }
            else {
                moduleId.value = []
                rolesAndPermissions.rolePermissions.modules.map(element => {
                        element.screens.map(screen => {
                                screen.actions.map(action => {
                                    if (action.name.toLowerCase().includes(searchedValue) || screen.name.toLowerCase().includes(searchedValue) || element.name.toLowerCase().includes(searchedValue)) {
                                        if(moduleId.value.indexOf(element.id) === -1) {
                                            moduleId.value.push(element.id)
                                        }
                                        else {
                                            const indexOfObject = moduleId.value.findIndex(object => {
                                                return object === element.id;
                                            });
                                            moduleId.value.splice(indexOfObject, 1);
                                        }
                                    }
                                })
                        })
                })
            }
        }

        /* For Search End */

        const handleGlobalChange = (data) => {
            addRoleForm.level = data;
        }

        return {
            handleGlobalChange,
            moduleId,        // For Search
            selectedRoles,   // For Search
            checkFieldsData,
            checkChangeInput,
            rolesAndPermissions,
            addRoleForm,
            addPermissionsForm,
            submitForm,
            addPermissions,
            getId,
            rolesList,
            showList,
            onRoleChange,
            next,
            prev,
            current,
            checkedValue,
            closeModal,
            formRef,
            formRef2,
            checkAll,
            checkStatus,
            dashboardForm,
            dashboardPermission,
            globalCodes,
            roleDetails,
            formTitleNames,
            arrayToObjectData,
            formData:store.getters.formTitle,
            steps: [{
                    title: "Select Role",
                    content: "First-content",
                },
                {
                    title: "Describe Role",
                    content: "Second-content",
                },
                {
                    title: "Permissions",
                    content: "Second-content",
                },
                {
                    title: "Dashboard Widgets",
                    content: "Third-content",
                }
            ],
        }
    }
}
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
</style><style scoped>
.actions {
    margin-left: 30px;
    display: block;
}

.transparent {
    margin: 5px 0 !important;
}
</style>
