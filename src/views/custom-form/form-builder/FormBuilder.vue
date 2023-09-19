<template>
  <a-layout-content>
      <div class="common-bg">
          <a-row :gutter="20">
              <a-col :span="12">
                  <h2 class="pageTittle">Form Builder</h2>
              </a-col>
              <a-col :span="12">
                  <a-space style="justify-content: flex-end; width: 100%">
                      <a-input v-model:value="formName" placeholder="Form Name" style="width: 300px" class="formName" />
                      <a-button type="primary" @click="saveForm">Save Form</a-button>
                  </a-space>
              </a-col>
          </a-row>
          <a-row :gutter="20">
              <a-col :span="4">
                  <div class="formBuilderLeft">
                      <div class="body">
                          <a-collapse v-model:activeKey="activeKey" expandIconPosition="right">
                              <a-collapse-panel key="1" header="Components">
                                  <draggable class="" v-model="components"  :group="{ name: 'people', pull: 'clone', put: false }" :clone="cloneData" @change="log" :move="checkMove">
                                      <div v-for="element in components" :key="element.id">
                                          <FieldTypes className="item" :fieldTypes="element.type" :fieldName="element.name" />
                                      </div>
                                  </draggable>
                              </a-collapse-panel>
                              <a-collapse-panel key="2" header="Stepper">
                                  <div>
                                    <draggable class="" :list="components" :group="{ name: 'people', pull: 'clone', put: false }" :clone="cloneData"  :sort="true" @change="log" :move="checkMove">
                                          <div v-for="element in components" :key="element.id">
                                              <div class="item" v-if="element.type=='stepper2'|| element.type=='stepper3'">{{element.name}}</div>
                                          </div>
                                      </draggable>
                                  </div>
                              </a-collapse-panel>
                              <a-collapse-panel key="3" header="Questionnaire">
                                    <draggable class="" :list="components" :group="{ name: 'people', pull: 'clone', put: false }" :clone="cloneData"  :sort="true" @change="log" :move="checkMove">
                                          <div v-for="element in components" :key="element.id">
                                            <div class="item" v-if="element.type=='questionnaire'">{{element.name}}</div>
                                          </div>
                                    </draggable>
                              </a-collapse-panel>
                              <a-collapse-panel key="4" header="Address">
                                  <draggable class="" :list="components" :group="{ name: 'people', pull: 'clone', put: false }" :clone="cloneData"  :sort="true" @change="log" :move="checkMove">
                                          <div v-for="element in components" :key="element.id">
                                            <div class="item" v-if="element.type=='address'">{{element.name}}</div>
                                          </div>
                                    </draggable>
                              </a-collapse-panel>
                              <a-collapse-panel key="5" header="Notes">
                                  <div>
                                      <div>
                                          <div class="item">Notes</div>
                                      </div>
                                  </div>
                              </a-collapse-panel>
                              <a-collapse-panel key="6" header="Layout">
                                  <div>
                                      <draggable class="" :list="components" :group="{ name: 'people', pull: 'clone', put: false }" :clone="cloneData" :sort="true" @change="log" :move="checkMove">
                                          <div v-for="element in components" :key="element.id">
                                              <div class="item" v-if="element.type=='section'|| element.type=='line'">{{element.name}}</div>
                                          </div>
                                      </draggable>
                                  </div>
                              </a-collapse-panel>
                              <a-collapse-panel key="7" header="Widget">
                                  <div>
                                      <div>
                                          <div class="item">Grid layout</div>
                                          <div class="item">Graph layout</div>
                                      </div>
                                  </div>
                              </a-collapse-panel>
                          </a-collapse>
                      </div>
                  </div>
              </a-col>
  
              <a-col :span="controlProperties || questionProperties?16:20">
                  <div class="formBuilderCenter">
                      <div class="formWrapper" v-if="list2?.length > 0">
                          <div class="sectionGroup">
                              <div class="head">
                                  <span class="title">{{formName}} Preview</span>
                              </div>
                              <div class="body" v-if="list2?.length > 0">
                                  <draggable class="" :list="list2" :group="{ name: 'people', pull: 'clone', put: true }" @change="log1" :move="checkMove">
                                      <div class="" v-for="element, index in list2" :key="index">
                                          <div class=" formGroup">
                                              <label :style="{'font-size':fontProp.fontSize+'px','color':fontProp.fontColor,'font-family':fontProp.fontFamily, 'font-style':fontProp.style.includes('italic')?'italic':'','font-weight':fontProp.style.includes('bold')?'bold':'','text-decoration':fontProp.style.includes('underline')?'underline':''}" class="formLabel" v-if="element.type !='line' && element.type !='section' && element.type!='button' && element.type!='stepper2' && element.type!='stepper3' && element.type!='questionnaire' && element.type!='address'"><span style="color:red" v-if="element.required">*
                                                  </span>{{ element.name }}</label>
                                              <a-input :type="element.type" :placeholder="element.properties?.place_holder" v-if="element.type !='line' && element.type !='section' && element.type !='textarea' &&element.type!='button' && element.type!='stepper2' && element.type!='stepper3' && element.type!='questionnaire' && element.type!='address' && element.type !='image'" />
                                              <div v-if="element.type=='line'">
                                                  <hr style="padding:5px">
                                              </div>
                                              <!-- Upload Image -->
                                              <a-upload v-if="element.type =='image'"
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                :multiple="true"
                                                :file-list="fileList"
                                                @change="handleChange"
                                              >
                                                <a-button>
                                                  <UploadOutlined></UploadOutlined>
                                                  Upload
                                                </a-button>
                                              </a-upload>
                                              <!-- Import here -->
                                             
                                              <a-textarea v-model:value="value1" v-if="element.type=='textarea'" />
                                              <!-- Address fields components -->
                                              <AddressFields v-if="element.type=='address'"/>
                                              <!-- Button component -->
                                              <a-button  type="primary" v-if="element.type=='button'">Submit</a-button>
                                              <div>
                                                <!-- Stepper components  -->
                                                <Stepper2Vue v-if="element.type=='stepper2'">
                                                  <!-- Drag stepper data here -->
                                                  <template v-slot:first>
                                                  <draggable v-if="stepper?.length>0" class="" :list="stepper" :group="{ name: 'people', pull: 'clone', put: true }" @change="log1" :move="checkMove">
                                                      <div class="" v-for="element, index in stepper" :key="index">
                                                          <div class="formGroup">
                                                            <label class="formLabel" v-if="element.type !='line' && element.type !='section' && element.type!='button' && element.type!='stepper2' && element.type!='stepper3' && element.type!='address'"><span style="color:red" v-if="element.required">*
                                                              </span>{{ element.name }}</label>
                                                                <a-input :type="element.type" :placeholder="element.properties?.place_holder" v-if="element.type !='line' && element.type !='section' && element.type !='textarea' &&element.type!='button' && element.type!='stepper2' && element.type!='stepper3' && element.type!='address'" />
                                                                <div v-if="element.type=='line'">
                                                                    <hr style="padding:5px">
                                                                </div>
                                                                <a-textarea v-model:value="value1" v-if="element.type=='textarea'" />
                                                                <a-button type="primary" v-if="element.type=='button'">Submit</a-button>
                                                              <div class="actions">
                                                                  <a-tooltip @click="properties(element.id, index,'stepper')">
                                                                      <template #title>Edit</template>
                                                                      <EditOutlined />
                                                                  </a-tooltip>
                                                                  <a-tooltip @click="cloneStpField(element, index)">
                                                                      <template #title>Clone</template>
                                                                      <CopyOutlined />
                                                                  </a-tooltip>
                                                                  <a-tooltip @click="removeStpFields(index)">
                                                                      <template #title>Delete</template>
                                                                      <DeleteOutlined />
                                                                  </a-tooltip>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </draggable>
                                                
                                                  <div v-else>
                                                    <draggable class="" :list="stepper" group="people" @change="log" :move="checkMove">
                                                        <div class="dragDrop">
                                                            <img src="@//assets/images/drag.svg" />
                                                            <a-typography-title :level="4">Drag elements here</a-typography-title>
                                                        </div>
                                                    </draggable>
                                                  </div>
                                                  </template>
                                                  <template v-slot:second>
                                                  <draggable v-if="stepper2?.length>0" class="" :list="stepper2" :group="{ name: 'people', pull: 'clone', put: true }" @change="log1" :move="checkMove">
                                                      <div class="" v-for="element, index in stepper2" :key="index">
                                                          <div class="formGroup">
                                                            <label class="formLabel" v-if="element.type !='line' && element.type !='section' && element.type!='button' && element.type!='stepper2' && element.type!='stepper3' && element.type!='address'"><span style="color:red" v-if="element.required">*
                                                              </span>{{ element.name }}</label>
                                                                <a-input :type="element.type" :placeholder="element.properties.place_holder" v-if="element.type !='line' && element.type !='section' && element.type !='textarea' &&element.type!='button' && element.type!='stepper2' && element.type!='stepper3' && element.type!='address'" />
                                                                <div v-if="element.type=='line'">
                                                                    <hr style="padding:5px">
                                                                </div>
                                                                <a-textarea v-model:value="value1" v-if="element.type=='textarea'" />
                                                                <a-button type="primary" v-if="element.type=='button'">Submit</a-button>
                                                              <div class="actions">
                                                                  <a-tooltip @click="properties(element.id, index,'step2')">
                                                                      <template #title>Edit</template>
                                                                      <EditOutlined />
                                                                  </a-tooltip>
                                                                  <a-tooltip @click="cloneStpField(element, index,'step2')">
                                                                      <template #title>Clone</template>
                                                                      <CopyOutlined />
                                                                  </a-tooltip>
                                                                  <a-tooltip @click="removeStpFields(index,'step2')">
                                                                      <template #title>Delete</template>
                                                                      <DeleteOutlined />
                                                                  </a-tooltip>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </draggable>
                                                
                                                  <div v-else>
                                                    <draggable class="" :list="stepper2" group="people" @change="log" :move="checkMove">
                                                        <div class="dragDrop">
                                                            <img src="@//assets/images/drag.svg" />
                                                            <a-typography-title :level="4">Drag elements here</a-typography-title>
                                                        </div>
                                                    </draggable>
                                                  </div>
                                                  </template>
                                                </Stepper2Vue>
                                                <Stepper3Vue v-if=" element.type=='stepper3'"></Stepper3Vue>
                                              </div>
                                              <!-- Questionnaire fields -->
                                              <div v-if="element.type=='questionnaire'">
                                                <div v-if="element.type=='questionnaire'"><b>{{element.name}}: </b>{{customFormData?.getTemplateDetails?.template_name}}</div>
                                                <div v-for="item,i in customFormData?.getTemplateDetails?.sectionsTotalQuestions" :key="i">Sections Questions: {{item}}</div>
                                                <div>Total Sections: {{customFormData?.getTemplateDetails?.total_sections}}</div>
                                              </div>
                                              <!-- section -->
                                              <div class="formWrapper" v-if="element.type =='section'">
                                                  <div class="sectionGroup">
                                                      <div class="head">
                                                          <span class="title">{{element.name}}</span>
                                                      </div>
                                                      <div class="body" v-if="list2?.length > 0">
                                                          <draggable v-if="element?.section?.length>0" class="" :list="element.section" :group="{ name: 'people', pull: 'clone', put: true }" @change="log" :move="checkMove">
                                                              <div class="" v-for="element, i in element?.section" :key="i">
                                                                  <div class="formGroup">
                                                                      <label class="formLabel" :style="{'font-size':fontProp.fontSize+'px','color':fontProp.fontColor,'font-family':fontProp.fontFamily, 'font-style':fontProp.style.includes('italic')?'italic':'','font-weight':fontProp.style.includes('bold')?'bold':'','text-decoration':fontProp.style.includes('underline')?'underline':''}" v-if="element.type !='line'  && element.type !='section' && element.type!='button' && element.type!='stepper2' && element.type!='stepper3' && element.type!='questionnaire' && element.type!='address' && element.type!='questionnaire' && element.type!='address'">
                                                                        <span style="color:red" v-if="element.validation">*</span>
                                                                        {{ element.name }}
                                                                      </label>
                                                                      <a-input :type="element.type" :placeholder="element?.place_holder" v-if="element.type !='line' && element.type!='questionnaire' && element.type!='address'" />
                                                                      <div v-if="element.type=='line'">
                                                                          <hr>
                                                                      </div>
                                                                       <!-- Address fields components -->
                                                                      <AddressFields v-if="element.type=='address'"/>
                                                                      <!-- Questionnaire fields -->
                                                                      <div v-if="element.type=='questionnaire'">
                                                                        <div v-if="element.type=='questionnaire'"><b>{{element.name}}: </b>{{customFormData?.getTemplateDetails?.template_name}}</div>
                                                                        <div v-for="item,i in customFormData?.getTemplateDetails?.sectionsTotalQuestions" :key="i">Sections Questions: {{item}}</div>
                                                                        <div>Total Sections: {{customFormData?.getTemplateDetails?.total_sections}}</div>
                                                                      </div>
                                                                      <a-button  type="primary" v-if="element.type=='button'">Submit</a-button>
                                                                      <div class="actions">
                                                                          <a-tooltip @click="propertiesSectionField(element.id, i,element.type)">
                                                                              <template #title>Edit1</template>
                                                                              <EditOutlined />
                                                                          </a-tooltip>
                                                                          <a-tooltip @click="cloneSectionField(element, index,'section')">
                                                                              <template #title>Clone</template>
                                                                              <CopyOutlined />
                                                                          </a-tooltip>
                                                                          <a-tooltip @click="removeSectionField(i)">
                                                                              <template #title>Delete</template>
                                                                              <DeleteOutlined />
                                                                          </a-tooltip>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </draggable>
                                                          <div class="body" v-else>
                                                          <draggable class="" :list="element.section" group="people" @change="log" :move="checkMove">
                                                              <div class="dragDrop">
                                                                  <img src="@//assets/images/drag.svg" />
                                                                  <a-typography-title :level="4">Drag elements here</a-typography-title>
                                                              </div>
                                                          </draggable>
                                                      </div>
                                                      </div>
                                                      <div class="body" v-else>
                                                          <draggable class="" :list="list2" group="people" @change="log" :move="checkMove">
                                                              <div class="dragDrop">
                                                                  <img src="@//assets/images/drag.svg" />
                                                                  <a-typography-title :level="4">Drag elements here</a-typography-title>
                                                              </div>
                                                          </draggable>
                                                      </div>
                                                  </div>
                                              </div>
                                              <!-- end section -->
  
                                              <div class="actions">
                                                  <a-tooltip @click="properties(element.id, index,element.type)" v-if="element.type !='line'">
                                                      <template #title>Edit</template>
                                                      <EditOutlined />
                                                  </a-tooltip>
                                                  <a-tooltip @click="cloneField(element, index)">
                                                      <template #title>Clone</template>
                                                      <CopyOutlined />
                                                  </a-tooltip>
                                                  <a-tooltip @click="remove1(index)">
                                                      <template #title>Delete</template>
                                                      <DeleteOutlined />
                                                  </a-tooltip>
                                              </div>
                                          </div>
                                      </div>
                                  </draggable>
                              </div>
                              <div class="body" v-else>
                                  <draggable class="" :list="list2" group="people" @change="log" :move="checkMove">
                                      <div class="dragDrop">
                                          <img src="@//assets/images/drag.svg" />
                                          <a-typography-title :level="4">Drag elements here</a-typography-title>
                                      </div>
                                  </draggable>
                              </div>
                          </div>
                      </div>
                      <div v-else>
                          <draggable class="" :list="list2" group="people" @change="log" :move="checkMove">
                              <div class="dragDrop">
                                  <img src="@//assets/images/drag.svg" />
                                  <a-typography-title :level="4">Drag elements here</a-typography-title>
                              </div>
                          </draggable>
                      </div>
                  </div>
              </a-col>
  
              <a-col :span="4">
                  <!-- import field properties here -->
                  <!-- <FieldProperties /> -->
                  <div class="formBuilderLeft properties" v-if="controlProperties">
                      <div class="head">Properties</div>
                      <div class="body">
                          <a-form-item label="Label">
                              <a-input v-model:value="label" />
                          </a-form-item>
                          <a-form-item label="Placeholder">
                              <a-input v-model:value="placeholder" />
                          </a-form-item>
                          
                          <a-form-item label="Font-Size">
                            <a-input type="number" v-model:value="fontProp.fontSize" :min="15" :max="100" addon-after="px" />
                          </a-form-item>
                          <a-form-item label="Font-Color">
                              <a-input type="color" v-model:value="fontProp.fontColor" />
                          </a-form-item>
                          <a-form-item label="Font-Family">
                              <!-- <a-select
                              :getPopupContainer="triggerNode => triggerNode.parentNode"
                                v-model:value="fontProp.fontFamily"
                                label-in-value
                                style="width: 100%"
                                :options="options"
                                @change="handleChange"
                              >
                              </a-select> -->
                              <a-select
                              :getPopupContainer="triggerNode => triggerNode.parentNode"
                                v-model:value="fontProp.fontFamily"
                                :options="options"
                                style="width: 200px"
                                @change="handleChange"
                              ></a-select>
                          </a-form-item>
                          <a-form-item label="Style">
                              <!-- <a-select
                                mode="multiple"
                                :getPopupContainer="triggerNode => triggerNode.parentNode"
                                v-model:value="fontProp.style"
                                label-in-value
                                placeholder="Please select..."
                                style="width: 100%"
                                :options="styleOptions"
                                @change="handleChange"
                              >
                              </a-select> -->
                              <a-select
                              :getPopupContainer="triggerNode => triggerNode.parentNode"
                              mode="multiple"
                                v-model:value="fontProp.style"
                                :options="styleOptions"
                                style="width: 200px"
                                @change="handleChange"
                              ></a-select>
                          </a-form-item>
                          <a-checkbox v-model:checked="validation">Required</a-checkbox>
                          <a-space style="margin: 15px 0 0">
                              <a-button @click="close">Cancel</a-button>
                              <a-button type="primary" @click="update">Update</a-button>
                          </a-space>
                      </div>
                  </div>
                  <div class="formBuilderLeft properties" v-if="questionProperties">
                      <div class="head">Properties</div>
                      <div class="body">
                          <a-form-item label="Select Template">
                            <ArrayDataSearch v-if="questionnaireTemplateList" v-model:value="dropdownData" :globalCode="questionnaireTemplateList"   />
                          </a-form-item>
                          <a-space style="margin: 15px 0 0">
                              <a-button @click="close">Cancel</a-button>
                              <a-button type="primary" @click="update">Update</a-button>
                          </a-space>
                      </div>
                  </div>
              </a-col>
          </a-row>
          <!-- <a-row>
            <a-col :span="6">
              <pre>Main::{{ JSON.stringify(components, undefined, 5) }}</pre>
            </a-col>
            <a-col :span="6">
              <pre>Copyt::{{ JSON.stringify(list2, undefined, 5) }}</pre>
            </a-col>
          </a-row> -->

      </div>
  </a-layout-content>
  </template>

<script>
import {
  defineComponent,
  onMounted,
  // onMounted,
  // reactive,
  ref,
  watch,
  computed,
  reactive,
} from "vue";
import FieldTypes from "./FieldTypes.vue";
// import FieldProperties from "./FieldProperties.vue";
import { VueDraggableNext } from "vue-draggable-next";
import Stepper2Vue from "@/components/custom-form-components/steppers/Stepper2.vue";
import Stepper3Vue from "@/components/custom-form-components/steppers/Stepper3.vue";
import AddressFields from "@/components/custom-form-components/address-fields/AddressFields.vue";
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  UploadOutlined
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ArrayDataSearch from "@/components/modals/search/ArrayDataSearch.vue";
export default defineComponent({
  components: {
    EditOutlined,
    DeleteOutlined,
    FieldTypes,
    CopyOutlined,
    UploadOutlined,
    // FieldProperties,
    draggable: VueDraggableNext,
    Stepper2Vue,
    Stepper3Vue,
    AddressFields,
    ArrayDataSearch
  },
  setup() {
    const formName = ref("Untitled Form");
    const label = ref();
    const store = useStore();
    const router = useRouter()
    const placeholder = ref();
    const validation = ref(true);
    const fontProp = reactive({
      fontFamily:'arial',
      fontSize:15,
      fontColor:'#000',
      style:'bold'
    })
    const dropdownData = ref()
    const dataList2 = ref([])
    const components = [
      {
        id: 1,
        name: "Text",
        type: "text",
        properties: {
				place_holder: "",

				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 2,
        name: "Number",
        type: "number",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 3,
        name: "Email",
        type: "email",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 4,
        name: "Phone",
        type: "phone",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 5,
        name: "Textarea",
        type: "textarea",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 6,
        name: "Checkbox",
        type: "checkbox",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 7,
        name: "Radio",
        type: "radio",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 11,
        name: "Date/Time",
        type: "date",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
        required: 1,
      },
      {
        id: 12,
        name: "File Input",
        type: "file",
        "properties": {
				"place_holder": "",
				"class": "",
				"id": ""
			},
        required: 1,
      },
      {
        id: 8,
        name: "Section",
        type: "section",
      },
      {
        id: 9,
        name: "Horizontal Line",
        type: "line",
      },
      {
        id: 10,
        name: "Button",
        type: "button",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
      required:1
      },

      {
        id: 13,
        name: "Two-Stepper",
        type: "stepper2",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
      required:1
      },
      {
        id: 14,
        name: "Three-Stepper",
        type: "stepper3",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
      required:1
      },

      {
        id: 15,
        name: "Questionnaire",
        type: "questionnaire",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
      required:1
      },

      {
        id: 16,
        name: "Address",
        type: "address",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
      required:1
      },
      {
        id: 17,
        name: "Image Upload",
        type: "image",
        properties: {
				place_holder: "",
				class: "",
				id: ""
			},
      required:1
      },

    ];

    const layout = ref([
      {
        id: 1,
        name: "Section",
        type: "section",
      },
      {
        id: 2,
        name: "Horizontal Line",
        type: "line",
      },
    ]);
    const list2 = ref([]);
    const list3 = ref([]);
    const stepper = ref([])
    const stepper2 = ref([])
    const indexId = ref();
    const controlProperties = ref(null)
    const questionProperties = ref(null)
    const stepperProperties = ref(null)
    const step2Properties = ref(null)
    const sectionField = ref(null)
    const options = ref([
      {
        value: 'openSans-regular',
        label: 'OpenSans-Regular',
      },
      {
        value: 'arial',
        label: 'Arial',
      },
      {
        value: 'verdana',
        label: 'Verdana',
      },
    ]);
    const styleOptions = ref([
    {
        value: 'italic',
        label: 'Italic',
      },
      {
        value: 'bold',
        label: 'Bold',
      },
      
      {
        value: 'underline',
        label: 'Underline',
      },
    ]);

    const form = reactive({
      ...fontProp,
    });
    
    function properties(id,index,type) {
      if(type=='questionnaire'){
        questionProperties.value = true
      }if(type=='stepper'){
        stepperProperties.value = true
        step2Properties.value = null
        controlProperties.value = id!=null?true:false;
      }if(type=='step2'){
        step2Properties.value = true
        stepperProperties.value = null
        controlProperties.value = id!=null?true:false;
      }
      
      else{
        controlProperties.value = id!=null?true:false;
      }
      indexId.value = index;
      validation.value = true
      sectionField.value =null
    }

    function propertiesSectionField(id,index,type) {
      console.log(type)
      sectionField.value = true 
      controlProperties.value = id!=null?true:false;
      indexId.value = index;
      validation.value = true
    }
    const customFormData = computed(()=>{
        return store.state.customForm
    })
    const update = () => {
      dataList2.value = list2.value
     if(indexId.value!=null && stepperProperties.value==null && step2Properties.value==null){
      let objIndex = dataList2.value.findIndex(((obj,i) => i == indexId.value));
      dataList2.value.map((item, index) => {
        if (index == objIndex) {
            item.name = label.value ? label.value : item.name,
            item.properties.place_holder = placeholder.value,
            item.required = validation.value==true?1:0;
            return item
        }
      })
      controlProperties.value = null;
      // label.value = null;
      store.dispatch('getTemplateDetails',dropdownData.value)
     }if(stepperProperties.value){
      let objIndex = stepper.value.findIndex(((obj,i) => i == indexId.value));
      stepper.value.map((item, index) => {
        if (index == objIndex) {
            item.name = label.value ? label.value : item.name,
            item.properties.place_holder = placeholder.value,
            item.required = validation.value==true?1:0;
            return item
        }
      })
      controlProperties.value = null;
      // label.value = null;
      store.dispatch('getTemplateDetails',dropdownData.value)
     }if(step2Properties.value){
      let objIndex = stepper2.value.findIndex(((obj,i) => i == indexId.value));
      stepper2.value.map((item, index) => {
        if (index == objIndex) {
            item.name = label.value ? label.value : item.name,
            item.properties.place_holder = placeholder.value,
            item.required = validation.value==true?1:0;
            return item
        }
      })
      controlProperties.value = null;
      // label.value = null;
      store.dispatch('getTemplateDetails',dropdownData.value)
     }else{
      store.dispatch('getTemplateDetails',dropdownData.value)
     }
     if(sectionField.value){
      let objIndex = list2.value?.map(((obj) => obj.section.findIndex((obj,i)=>i==indexId.value) ));
      list2.value?.map((element) => {
        element.section.map((item,index)=>{
          if (index == objIndex[0]) {
            item.name = label.value ? label.value : item.name,
            item.properties.place_holder = placeholder.value,
            item.required = validation.value==true?1:0;
            return item
        }
        })
        
      })
      controlProperties.value = null;
      label.value = null;
      store.dispatch('getTemplateDetails',dropdownData.value)
     }else{
      store.dispatch('getTemplateDetails',dropdownData.value)
     }

     
    };

    const cloneField = (item, index) => {
      list2.value.push(item);
      console.log('index',index);
    };

    const cloneStpField = (item, index,type) => {
      if(type=='step2'){
        stepper2.value.push(item);
      }else{
        stepper.value.push(item);
      }
      console.log('index',index);
    };

    const questionnaireTemplateList = computed(()=>{
      return store.state.questionnaireTemplate.questionnaireTemplateList
    })

    const close = () => {
      controlProperties.value = null;
      questionProperties.value = null
    };

    const remove1 = (value) => {
      let temp = [];
      temp = list2.value;
      list2.value = temp.filter((item, index) => index !== value);
    };

    const removeSectionField = (index) =>{
      let temp = [];
      temp = list2.value;
      list2.value =temp?.filter((item) => item.section.filter((entry,i) => i !== index));
    }

    const removeStpFields = (value,type) => {
      if(type=='step2'){
        let temp = [];
      temp = stepper2.value;
      stepper2.value = temp.filter((item, index) => index !== value);
      }else{
        let temp = [];
      temp = stepper.value;
      stepper.value = temp.filter((item, index) => index !== value);
      }
    };
    const handleClick = (event) => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    };

    const checkMove = (event) => {
      console.log("Future index: " + event.draggedContext.futureIndex);
    };

    function log(event) {
      const { moved, added } = event;
      if (moved) console.log("moved", moved);
      if (added) console.log("added", added, added.element);
    }

    function log1(event) {
      const { moved, added } = event;
      if (moved) console.log("moved1", moved);
      if (added) list2.value[0]
    }

    const activeKey = ref(['1']);
    watch(activeKey, (val) => {
      console.log(val);
    });

    onMounted(()=>{
      store.dispatch('questionnaireTemplateList')
    })

    const saveForm = () => {
      // let data = {
      //   form_name:formName.value,
      //   fields:list2.value.map((item,index)=>{
      //   item.order = index
      //   item.id = item.type=='questionnaire'?dropdownData.value:item.id
      //   return item
      // })
      // }

      let stepData={
        first:stepper.value.map((item,index)=>{
          item.order = index
          return item
        }),
        second:stepper2.value.map((item,index)=>{
          item.order = index
          return item
        }),
        type:['stepper']
      
      }

      let data = {
        form_name:formName.value,
        fields:stepData,
      }
      
      store.dispatch('saveForm',data).then((resp)=>{
        if(resp==true){
          router.push('/admin/custom-form')
        }
      })
    }
    let idGlobal = 0;
    function cloneData({ name,type,required }) {
      if(type=='questionnaire'){
        questionProperties.value = true
      }
      // if(type=='section'){

      // }
      return {
        id: idGlobal++,
        name: `${name}`,
        type: `${type}`,
        properties: {
				place_holder: "",
				class: "",
				id: "",
        },
        section:type=='section'?[]:null,
        required:`${required}`
      }
      }
    return {
      removeSectionField,
      form,
      propertiesSectionField,
      sectionField,
      styleOptions,
      options,
      fontProp,
      step2Properties,
      stepper2,
      stepperProperties,
      cloneStpField,
      removeStpFields,
      questionProperties,
      customFormData,
      dropdownData,
      questionnaireTemplateList,
      cloneData,
      dataList2,
      stepper,
      saveForm,
      layout,
      checkMove,
      log,
      log1,
      cloneField,
      placeholder,
      validation,
      indexId,
      close,
      controlProperties,
      properties,
      update,
      remove1,
      components,
      list2,
      list3,
      formName,
      label,
      handleClick,
      activeKey,
      
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
  padding: 20px;

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
    padding: 20px;

    .formGroup {
      margin: 0 0 15px;
      position: relative;

      &:hover {
        .actions {
          visibility: visible;
        }
      }
      .ant-steps {
        padding-top: 40px;
      }
      .steps-content {
        text-align: left;
      }

      label.formLabel {
        // font-size: 16px;
        // line-height: 35px;
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

      input[type="radio"],
      input[type="checkbox"] {
        width: auto;
      }
    }
  }

  .sectionGroup {
    margin: 0 0 10px;

    &:hover {
      .head {
        .actions {
          visibility: visible;
        }
      }
    }

    .head {
      position: relative;

      span.title {
        background-color: #1890ff;
        border-radius: 5px 5px 0 0;
        padding: 5px 10px;
        color: #fff;
        display: inline-block;
      }

      .actions {
        position: absolute;
        right: 0;
        top: 5px;
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

    .body {
      padding: 20px;
      border: 1px solid #e3e3e3;
      background-color: #f9f9f9;
    }
  }
}
</style>
