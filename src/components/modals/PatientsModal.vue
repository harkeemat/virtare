<template>
<a-modal class="patientModal"  max-width="1140px" width="100%" :title="isEdit == true ? 'Edit Patient' : 'Add New Patient'" centered :footer="false" :maskClosable="false" @cancel="closeModal()">
    <a-row :gutter="24">
        <div class="common-btn mb-24" ref="customScrollTop">
            <a-button type="primary" @click="showSearchPatient" v-if="!isEdit && current==0">
                Bitrix Lookup
            </a-button>
        </div>
        <a-col :span="24">
            <a-steps v-model:current="current" @change="scrollToTop($event)">
                <a-step v-for="item in steps" :key="item.title" :title="item.title?item.title:''"><span :id="item"></span></a-step>
            </a-steps>
            <div class="steps-content" v-if="steps[current].title === 'Demographics'">
                <!-- <Demographics /> --> 
                <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,16,'id','name'),'name','udid')"> </FormBaseComponents>  
                <a-form :model="demographics" :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,16,'id','name'),'name','udid')" name="basic" ref="formRef"  scrollToFirstError=true autocomplete="off" layout="vertical" @finish="demographic()" @finishFailed="demographicsFailed">
                  
                  <!-- <a-row :gutter="4"> -->
                    <a-col :span="24">
                      <div class="form-group">
                        <a-form-item :label="$t('patient.isApp')" name="isApp">
                          <div class="btn toggleButton" :class="!isSnfPatient ? '' : 'active'" @click="buttonToggle(); checkChangeInput()">
                            <span class="btn-content">{{ $t('global.yes') }}</span>
                          </div>
                          <div class="btn toggleButton" :class="isSnfPatient ? '' : 'active'" @click="buttonToggle(); checkChangeInput()">
                            <span class="btn-content">{{ $t('global.no') }}</span>
                          </div>
                          <a-input type="hidden" id="isApp" :value="isSnfPatient ? demographics.isApp= true : demographics.isApp = false" />
                        </a-form-item>
                      </div>
                    </a-col>
                  <!-- </a-row> -->

                    <a-row :gutter="24">
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: true, message: $t('global.firstName')+' '+$t('global.validation')}]">
                                    <NameField @keyup="changedValue" :placeholder="'Please enter first name'" v-model:value="demographics.firstName" size="large" :max="20"/>
                                    <ErrorMessage class="error" v-if="errorMsg" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                                  <NameField @keyup="changedValue" :placeholder="'Please enter middle name'" v-model:value="demographics.middleName" size="large" :max="20"/>
                                  <ErrorMessage v-if="errorMsg" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: true, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                    <NameField @keyup="changedValue" :placeholder="'Please enter last name'" v-model:value="demographics.lastName" size="large" :max="20"/>
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.lastName ? errorMsg.lastName[0] : ''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.nickName')" name="nickName" :rules="[{ required: false, message: $t('patient.demographics.nickName')+' '+$t('global.validation')}]">
                                  <NameField @keyup="changedValue" :placeholder="'Please enter nick name'" v-model:value="demographics.nickName" size="large" :max="20"/>
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.dateOfBirth')" name="dob" :rules="[{ required: true, message: $t('global.dateOfBirth')+' '+$t('global.validation') }]">
                                    <!-- <a-date-picker @keyup="changedValue" v-model:value="demographics.dob" :disabledDate="d => !d || d.isAfter(moment())" :format="globalDateFormat" value-format="YYYY-MM-DD" :size="size" style="width: 100%" /> -->
                                      <DateField  @keyup="changedValue" v-model:value="demographics.dob" :disabledDateData="d => !d || d.isAfter(moment())" :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :size="size" style="width: 100%" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.dob?errorMsg.dob[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24" class="snfConditional">
                          <div class="form-group">
                            <a-form-item :label="$t('global.email')" name="email" :rules="[{ required: !isSnfPatient ? true : false, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(), type: 'email' }]">
                              <a-input @keyup="changedValue" v-model:value="demographics.email" placeholder="test@test.com" size="large" @blur="emailChange()" />
                              <ErrorMessage v-if="errorMsg" :name="errorMsg.email ? errorMsg.email[0] : ''" />
                            </a-form-item>
                          </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24" class="snfConditional">
                          <div class="form-group">
                            <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: !isSnfPatient ? true : false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                              <a-input v-maska="'###-###-####'" max="12" @keyup="changedValue" v-model:value="demographics.phoneNumber" placeholder="Please enter 10 digit number" size="large" style="width: 100%" />
                              <ErrorMessage v-if="errorMsg && !demographics.phoneNumber" :name="errorMsg.phoneNumber ? errorMsg.phoneNumber[0] : ''" />
                            </a-form-item>
                          </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.gender')" name="gender" :rules="[{ required: true, message: $t('global.gender')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.gender" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'gender')" />
                                    <ErrorMessage v-if="errorMsg && !demographics.gender" :name="errorMsg.gender ? errorMsg.gender[0] : ''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.language')" name="language" :rules="[{ required: false, message: $t('patient.demographics.language')+' '+$t('global.validation') }]">
                                    <!-- <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.language" :globalCode="globalCode.language" /> -->
                                   <GlobalCodeDropDown  v-model:value="demographics.language" @handleGlobalChange="handleGlobalChange($event,'singleLang')" :dataId="13" :close="closeValue" />
                                   <ErrorMessage v-if="errorMsg" :name="errorMsg.language?errorMsg.language[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.otherLanguage')" name="otherLanguage" :rules="[{ required: false, message: $t('patient.demographics.otherLanguage')+' '+$t('global.validation') }]">
                                    <!-- <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.otherLanguage" mode="multiple" :globalCode="globalCode.language" /> -->
                                    <GlobalCodeDropDown mode="multiple" v-model:value="demographics.otherLanguage" @handleGlobalChange="handleGlobalChange($event,'multiLang')" :dataId="13" :close="closeValue" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.otherLanguage?errorMsg.otherLanguage[0]:''" />
                                </a-form-item>

                            </div>
                        </a-col>

                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.weight') + '(lbs)'" name="weight" :rules="[{ required: false, message: $t('patient.demographics.weight')+' '+$t('global.validation'), pattern: regex.digitWithdecimal }]">
                                    <a-input-number @keyup="changedValue" style="width: 100%" v-model:value="demographics.weight" placeholder="Please enter weight in lbs" size="large" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="4" :sm="12" :xs="24" >
                            <div class="form-group">
                                <a-form-item  :label="$t('patient.demographics.height')+ '(Feet/Inches)'" name="height" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('patient.demographics.height'), pattern: regex.height }]">
                                    <a-input @keyup="changedValue" @input="convertToCm(demographics.height)" style="width: 100%" v-model:value="demographics.height" size="large" placeholder="Format example -  5'7&quot"  />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="4" :sm="12" :xs="24">
                          <div class="form-group" >
                                <a-form-item :label="$t('patient.demographics.height')+ '(CM)'" name="heightInCentimeter" :rules="[{ required: false, message:  $t('global.validValidation')+' '+$t('patient.demographics.height'), pattern: regex.digitWithdecimal }]">
                                    <a-input  @keyup="changedValue" @input="convertToFeet(demographics.heightInCentimeter)" style="width: 100%" v-model:value="demographics.heightInCentimeter" placeholder="Height in centemeter " size="large" />
                                </a-form-item>
                            </div>
                        </a-col>

                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="contactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
                                    <!-- <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.contactType" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'contactType')" /> -->
                                    <a-select :disabled="isUnprocessed" :getPopupContainer="triggerNode => triggerNode.parentNode"  mode="multiple" v-model:value="demographics.contactType" style="width: 100%" size="large" @change="checkChangeInput('type')">
                                        <a-select-option value="" disabled>{{'Select Message Type'}}</a-select-option>
                                        <template v-for="type in messageType" >
                                            <a-select-option v-if="type.name == 'App Message' || type.name == 'Email' || type.name == 'SMS'" :key="type.id" :value="type.id">{{ type.name }}</a-select-option>
                                        </template>
                                    </a-select>
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.contactType?errorMsg.contactType[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="contactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.contactTime" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'contactTime')" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.contactTime?errorMsg.contactTime[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.placeOfService')" name="placeOfService" :rules="[{ required: false, message: $t('global.placeOfService')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.placeOfService" :dataId="67" @handleGlobalChange="handleGlobalChange($event,'placeOfService')" />

                                </a-form-item>
                            </div>
                        </a-col>
                    </a-row>

                    <a-row :gutter="24">
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.country')" name="country" :rules="[{ required: false, message: $t('global.country')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.country" :dataId="20" @handleGlobalChange="handleGlobalChange($event,'country')" />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.state')" name="state" :rules="[{ required: false, message: $t('global.state')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.state" :dataId="21" @handleGlobalChange="handleGlobalChange($event,'state')" placeholder="Please enter State"  />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.state?errorMsg.state[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.city')" name="city" :rules="[{ required: false, message: $t('global.city')+' '+$t('global.validation') }]">
                                    <a-input @keyup="changedValue" placeholder="Please enter City" v-model:value="demographics.city" size="large" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.city?errorMsg.city[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.zipcode')" name="zipCode" :rules="[{ required: false, message:$t('global.validValidation')+' '+ $t('global.zipcode').toLowerCase(),pattern: regex.zipCode }]">
                                    <a-input-number @keyup="changedValue" style="width:100%" v-model:value="demographics.zipCode" placeholder="Please enter 5 digit number" size="large" maxlength="5" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.zipCode?errorMsg.zipCode[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :span="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.address')" name="address" :rules="[{ required: false, message: $t('global.address')+' '+$t('global.validation') }]">
                                    <a-textarea size="large" @keyup="changedValue" v-model:value="demographics.address" allow-clear placeholder="Please enter Address" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.address?errorMsg.address[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.address')+' 2'" name="appartment" :rules="[{ required: false, message: $t('global.address')+' '+$t('global.validation') }]">
                                    <a-textarea size="large" @keyup="changedValue" v-model:value="demographics.appartment" allow-clear placeholder="Please enter Address 2" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.appartment?errorMsg.appartment[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>

                        <a-col :span="8">
                            <div class="form-group">
                                <a-form-item :label="$t('clients.careTeam')" name="providers" :rules="[{ required: true, message: $t('clients.careTeam')+' '+$t('global.validation') }]">
                                    <ProvidersDropdown v-model:value="demographics.providers" :defaultProviderData="demographics?.providerArray"  @handleProviderChange="handleProviderChange($event)" :fromStaff="true" :disabled="disabledProvider" />
                                </a-form-item>
                            </div>
                        </a-col>

                        <!-- <a-col :span="8">
                            <div class="form-group">
                                <a-form-item :label="$t('global.defaultProvider')" name="defaultProvider" :rules="[{ required: true, message: $t('global.defaultProvider')+' '+$t('global.validation') }]">
																	<select class="customSelect" v-model="demographics.defaultProvider" size="large" ref="select" >
																		<option hidden value="">Select Default Provider</option>
																		<option v-for="provider in addedProviders" :key="provider.value" :value="provider.value">
																			{{ provider.label }}
																		</option>
																	</select>
                                </a-form-item>
                            </div>
                        </a-col> -->

                    </a-row>

                    <a-row :gutter="24">
                        <a-col :span="24">
                            <div class="formHeading">
                                <h2>{{$t('patient.demographics.responsiblePerson')}}</h2>
                            </div>
                        </a-col>
                    </a-row>
                    <a-row :gutter="24">
                        <a-col :md="24" :sm="24" :xs="24" class="mb-24">
                            <a-checkbox @change="changeSelf" v-model:checked="responsiblePersonForm.self">
                                {{$t('patient.demographics.self')}}
                            </a-checkbox>
                        </a-col>
                    </a-row>

                    <a-row :gutter="24" v-if="responsiblePersonForm.self">
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.relation')" name="relation" :rules="[{ required: false, message: $t('global.relation')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.relationName" :dataId="8" @handleGlobalChange="handleGlobalChange($event,'relation')" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation') }]">
                                  <NameField @change="changedValue" :placeholder="'Please enter first name'" v-model:value="demographics.firstName" size="large" :disabled="disableResponsiblePerson"  :max="20"/>
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                                  <NameField @change="changedValue" :placeholder="'Please enter middle name'" v-model:value="demographics.middleName" size="large" :disabled="disableResponsiblePerson"   :max="20"/>
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                  <NameField @change="changedValue" :placeholder="'Please enter last name'" v-model:value="demographics.lastName" size="large" :disabled="disableResponsiblePerson" :max="20"/>

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.emailAddress')" name="email" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('patient.demographics.emailAddress').toLowerCase(), type: 'email' }]">
                                    <a-input @change="changedValue" v-model:value="demographics.email" placeholder="test@test.com" size="large" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                                    <a-input v-maska="'###-###-####'" max="12" @keyup="changedValue" v-model:value="demographics.phoneNumber" placeholder="Please enter 10 digit number" size="large" :disabled="disableResponsiblePerson" style="width: 100%" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="contactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @keyup="changedValue" v-model:value="responsiblePersonForm.contactType" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.contactType')"  />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="contactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.contactTime" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'contactTime')" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>

                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.gender')" name="gender" :rules="[{ required: false, message: $t('global.gender')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.gender" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'gender')" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>

                    </a-row>

                    <a-row :gutter="24" v-else>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.relation')" name="relation" :rules="[{ required: false, message: $t('global.relation')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.relation" :dataId="8" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.relation')" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation') }]">
                                  <NameField @keyup="changedValue" :placeholder="'Please enter first name'" v-model:value="responsiblePersonForm.firstName" size="large" :disabled="disableResponsiblePerson" :max="20"/> 
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                                  <NameField @keyup="changedValue" :placeholder="'Please enter middle name'" v-model:value="responsiblePersonForm.middleName" size="large" :disabled="disableResponsiblePerson" :max="20"/> 
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                  <NameField @keyup="changedValue" :placeholder="'Please enter last name'" v-model:value="responsiblePersonForm.lastName" size="large" :disabled="disableResponsiblePerson" :max="20"/>
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.emailAddress')" name="email" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('patient.demographics.emailAddress').toLowerCase(), type: 'email' }]">
                                    <a-input @keyup="changedValue" v-model:value="responsiblePersonForm.email" placeholder="test@test.com" size="large" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                                    <a-input v-maska="'###-###-####'" max="12" @keyup="changedValue" v-model:value="responsiblePersonForm.phoneNumber" placeholder="Please enter 10 digit number" size="large" :disabled="disableResponsiblePerson" style="width: 100%" />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="contactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.contactType" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.contactType')" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="contactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.contactTime" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.contactTime')" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>

                        <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('global.gender')" name="gender" :rules="[{ required: false, message: $t('global.gender')+' '+$t('global.validation') }]">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.gender" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.gender')" :disabled="disableResponsiblePerson" />

                                </a-form-item>
                            </div>
                        </a-col>

                    </a-row>

                    <div v-if="emergencyContactShow">
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <div class="formHeading">
                                    <h2>{{$t('patient.demographics.emergencyContact')}}</h2>
                                </div>
                            </a-col>
                        </a-row>

                        <a-row>
                            <a-col :md="24" :sm="24" :xs="24" class="mb-24">
                                <a-checkbox @keyup="changeResponsible" v-model:checked="emergencyContactForm.sameAsPrimary">
                                    {{$t('patient.demographics.sameAsResponsiblePersonInfo')}}
                                </a-checkbox>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" v-if="emergencyContactForm.sameAsPrimary && responsiblePersonForm.self">

                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter first name'" v-model:value="demographics.firstName" size="large" :disabled="disableResponsiblePerson" :max="20"/>
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter middle name'" v-model:value="demographics.middleName" size="large" :disabled="disableResponsiblePerson" :max="20"/>

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter last name'" v-model:value="demographics.lastName" size="large" :disabled="disableResponsiblePerson" :max="20"/>
                                      
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.emailAddress')" name="email" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('patient.demographics.emailAddress').toLowerCase(), type: 'email' }]">
                                        <a-input @keyup="changedValue" v-model:value="demographics.email" placeholder="test@test.com" size="large" :disabled="disableResponsiblePerson" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber}]">
                                        <a-input v-maska="'###-###-####'" max="12" @keyup="changedValue" v-model:value="demographics.phoneNumber" placeholder="Please enter 10 digit number" size="large" :disabled="disableResponsiblePerson" style="width: 100%" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                 
                                    <a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="contactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.contactType" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'contactType')" :disabled="disableResponsiblePerson" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="contactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.contactTime" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'contactTime')" :disabled="disableResponsiblePerson" />

                                    </a-form-item>
                                </div>
                            </a-col>

                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.gender')" name="gender" :rules="[{ required: false, message: $t('global.gender')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="demographics.gender" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'gender')" :disabled="disableResponsiblePerson" />

                                    </a-form-item>
                                </div>
                            </a-col>

                        </a-row>
                        <a-row :gutter="24" v-else-if="emergencyContactForm.sameAsPrimary">
                            <!-- <a-col :md="8" :sm="12" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.demographics.fullName')" name="fullName" :rules="[{ required: false, message: $t('patient.demographics.fullName')+' '+$t('global.validation') }]">
                                    <a-input @change="changedValue" v-model:value="responsiblePersonForm.fullName" size="large" disabled />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.fullName?errorMsg.fullName[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col> -->
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter first name'" v-model:value="responsiblePersonForm.firstName" size="large" :disabled="disableEmergencyContact" :max="20"/>
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.firstName?emergencyErrorMsg.firstName[0]:''" />
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter middle name'" v-model:value="responsiblePersonForm.middleName" size="large" :disabled="disableEmergencyContact" :max="20"/>
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.middleName?emergencyErrorMsg.middleName[0]:''" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter last name'" v-model:value="responsiblePersonForm.lastName" size="large" :disabled="disableEmergencyContact" :max="20"/>
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.lastName?emergencyErrorMsg.lastName[0]:''" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.emailAddress')" name="email" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('patient.demographics.emailAddress').toLowerCase(), type: 'email' }]">
                                        <a-input @keyup="changedValue" v-model:value="responsiblePersonForm.email" placeholder="test@test.com" size="large" :disabled="disableEmergencyContact" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.emailAddress?emergencyErrorMsg.emailAddress[0]:''" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.phoneNo')" name="phoneNumber" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase(),pattern:regex.phoneNumber }]">
                                        <a-input v-maska="'###-###-####'" max="12" @keyup="changedValue" size="large" v-model:value="responsiblePersonForm.phoneNumber" style="width: 100%" :disabled="disableEmergencyContact" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.phoneNo?emergencyErrorMsg.phoneNo[0]:''" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="contactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.contactType" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.contactType')" :disabled="disableEmergencyContact" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.preferredMethodofContact?emergencyErrorMsg.preferredMethodofContact[0]:''" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="contactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.contactTime" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.contactTime')" :disabled="disableEmergencyContact" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.preferredTimeofDayforContact?emergencyErrorMsg.preferredTimeofDayforContact[0]:''" />

                                    </a-form-item>
                                </div>
                            </a-col>

                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.gender')" name="gender" :rules="[{ required: false, message: $t('global.gender')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="responsiblePersonForm.gender" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'responsiblePersonForm.gender')" :disabled="disableEmergencyContact" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.gender?errorMsg.gender[0]:''" />

                                    </a-form-item>
                                </div>
                            </a-col>
                        </a-row>

                        <a-row :gutter="24" v-else>

                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter first name'" v-model:value="emergencyContactForm.firstName" size="large" :max="20"/>
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.firstName ? emergencyErrorMsg.firstName[0] : ''" />
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter middle name'" v-model:value="emergencyContactForm.middleName" size="large" :max="20"/>
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.middleName ? emergencyErrorMsg.middleName[0] : ''" />
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter last name'" v-model:value="emergencyContactForm.lastName" size="large" :max="20"/>
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.lastName ? emergencyErrorMsg.lastName[0] : ''" />
                                    </a-form-item>
                                </div>
                            </a-col>

                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.emailAddress')" name="emergencyEmail" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('patient.demographics.emailAddress').toLowerCase(), type: 'email' }]">
                                        <a-input @keyup="changedValue" v-model:value="emergencyContactForm.emergencyEmail" placeholder="test@test.com" size="large" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.emergencyEmail ? emergencyErrorMsg.emergencyEmail[0] : ''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.phoneNo')" name="emergencyPhoneNumber" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase() }]">
                                        <!-- <PhoneNumber  @change="changedValue" v-model.trim:value="demographics.emergencyPhoneNumber" @setPhoneNumber="setPhoneNumberEmergencyPhoneNumber" /> -->
                                        <a-input v-maska="'###-###-####'" max="12" @keyup="changedValue" v-model:value="emergencyContactForm.phoneNumber" placeholder="Please enter 10 digit number" size="large" style="width: 100%" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.phoneNumber ? emergencyErrorMsg.phoneNumber[0] : ''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.preferredMethodofContact')" name="emergencyContactType" :rules="[{ required: false, message: $t('patient.demographics.preferredMethodofContact')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="emergencyContactForm.contactType" mode="multiple" :dataId="14" @handleGlobalChange="handleGlobalChange($event,'emergencyContactForm.contactType')" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.pmOfcontact ? emergencyErrorMsg.pmOfcontact[0] : ''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.demographics.preferredTimeofDayforContact')" name="emergencyContactTime" :rules="[{ required: false, message: $t('patient.demographics.preferredTimeofDayforContact')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="emergencyContactForm.contactTime" mode="multiple" :dataId="15" @handleGlobalChange="handleGlobalChange($event,'emergencyContactForm.contactTime')" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.ptOfDayContact ? emergencyErrorMsg.ptOfDayContact[0] : ''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.gender')" name="emergencyGender" :rules="[{ required: false, message: $t('global.gender')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" v-model:value="emergencyContactForm.gender" :dataId="9" @handleGlobalChange="handleGlobalChange($event,'emergencyContactForm.gender')" />
                                        <ErrorMessage v-if="emergencyErrorMsg" :name="emergencyErrorMsg.gender ? emergencyErrorMsg.gender[0] : ''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <div v-if="referalFormShow">
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <div class="formHeading">
                                    <h2>{{$t('patient.referralSource')}}</h2>
                                </div>
                            </a-col>
                        </a-row>

                        <a-row :gutter="24">
                            <a-col :md="16" :sm="12" :xs="24" v-if="ShowReferralId">
                                <div class="form-group">
                                    <a-form-item label="Select Referral User" name="referral" :rules="[{ required: false, message: 'User  '+$t('global.validation') }]">
                                        <!-- <GlobalCodeDropDown v-if="referralData" @change="changedValue" v-model:value="referal.referral" :globalCode="referralData" /> -->
                                        <ReferralSearch :editDataReferral="editDataReferral" v-model:value="referal.referral" @handleReferralChange="handleReferralChange($event)" @clearValidtion="clearValidtion" />
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                              
                                <a-button type="primary" class="mt-28 mb-24 "  @click="newReferral">{{ShowReferral == false ? 'Add New Referral' : 'Back'}}</a-button>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24" v-if="ShowReferral">
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.firstName')" name="firstName" :rules="[{ required: false, message: $t('global.firstName')+' '+$t('global.validation')}]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter first name'" @input="onKeyUp('firstName')" v-model:value="referal.firstName" size="large" :max="20"/>
                                        <ErrorMessage class="error" v-if="errorMsg" :name="errorMsg.firstName?errorMsg.firstName[0]:''" />
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.middleName')" name="middleName" :rules="[{ required: false, message: $t('global.middleName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter middle name'" @input="onKeyUp('middleName')" v-model:value="referal.middleName" size="large" :max="20"/>
                                        <ErrorMessage v-if="errorMsg" :name="errorMsg.middleName?errorMsg.middleName[0]:''" />
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.lastName')" name="lastName" :rules="[{ required: false, message: $t('global.lastName')+' '+$t('global.validation') }]">
                                      <NameField @keyup="changedValue" :placeholder="'Please enter last name'" @input="onKeyUp('lastName')" v-model:value="referal.lastName" size="large" :max="20"/>

                                    </a-form-item>
                                </div>
                            </a-col>

                            <!-- <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.designation')" name="referralDesignation" :rules="[{ required: false, message: $t('global.designation')+' '+$t('global.validation') }]">
                                        <GlobalCodeDropDown @change="changedValue" @input="onKeyUp('referralDesignation')" v-model:value="referal.referralDesignation" :globalCode="globalCode.designations" />

                                    </a-form-item>
                                </div>
                            </a-col> -->
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.email')" name="referralEmail" :rules="[{ required: referalEmail, message: $t('global.validValidation')+' '+$t('global.email').toLowerCase(), type: 'email' }]">
                                        <a-input @keyup="changedValue" @input="onKeyUp('referralEmail')" v-model:value="referal.referralEmail" placeholder="test@test.com" size="large" />
                                        <ErrorMessage v-if="errorMsg && referalEmail" :name="errorMsg.referralEmail?errorMsg.referralEmail[0]:''" />
                                    </a-form-item>

                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.phoneNo')" name="referralPhoneNumber" :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('global.phoneNo').toLowerCase() }]">
                                        <a-input v-maska="'###-###-####'" max="12" @keyup="changedValue" @input="onKeyUp('referralPhoneNumber')" v-model:value.trim="referal.referralPhoneNumber" placeholder="Please enter 10 digit number" size="large" style="width: 100%" />

                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('patient.fax')" name="referralFax" :rules="[{ required: false, message: $t('patient.fax')+' '+$t('global.validation') }]">
                                        <a-input @keyup="changedValue" @input="onKeyUp('referralFax')" v-model:value="referal.referralFax" size="large" />
                                        <ErrorMessage v-if="referralErrorMsg" :name="referralErrorMsg.referralFax?referralErrorMsg.referralFax[0]:''" />
                                    </a-form-item>
                                </div>
                            </a-col>
                            <a-col :md="8" :sm="12" :xs="24">
                                <div class="form-group">
                                    <a-form-item :label="$t('global.address')" name="address" :rules="[{ required: false, message: $t('patient.fax')+' '+$t('global.validation') }]">
                                        <a-input @keyup="changedValue"  v-model:value="referal.address" size="large" />
                                        <!-- <ErrorMessage v-if="referralErrorMsg" :name="referralErrorMsg.referralFax?referralErrorMsg.referralFax[0]:''" /> -->
                                    </a-form-item>
                                </div>
                            </a-col>
                        </a-row>
                    </div>
                    <PatientSearch v-model:visible="patientSearch" @closeSearchPatient="closeSearchPatient($event)" @clearValidtion="clearValidtion" />
                    <div class="steps-action">
                        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                        <a-button v-if="current < steps.length - 1" type="primary" @click="scrollToTop(current);" html-type="submit">{{$t('global.save')}}</a-button>
                        <a-button v-if="current == steps.length - 1" type="primary" @click="$message.success('Processing complete!')">
                            {{$t('global.done')}}
                        </a-button>
                    </div>
                </a-form>
                <!--  -->
            </div>
            <div class="steps-content" v-if="steps[current].title === 'Devices'">
                <Devices :idPatient="idPatient" @onChange="changedValue" v-if="steps[current].title === 'Devices'"/>
                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next();scrollToTop(current);">{{$t('global.next')}}</a-button>
                </div>
            </div>
            <div class="steps-content" v-if="steps[current].title === 'Programs'">

                <Programs :idPatient="idPatient" @onChange="changedValue" />

                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next();scrollToTop(current)">{{$t('global.next')}}</a-button>
                </div>
                <!-- end  -->
            </div>
            <div class="steps-content" v-if="steps[current].title === 'Conditions'">
              <PatientConditions  v-if="idPatient" :idPatient="idPatient" @onChange="changedValue" />

              <div class="steps-action mt-28">
                <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                <a-button v-if="current < steps.length - 1" type="primary" @click="next();scrollToTop(current)">{{$t('global.next')}}</a-button>
              </div>
              <Loader />
            </div>
            <div class="steps-content" v-if="steps[current].title == 'History & Meds'">
                <ClinicalData :idPatient="idPatient? idPatient : patients.addDemographic.id" @onChange="changedValue" />
                <div class="steps-action">
                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" type="primary" @click="next();scrollToTop(current)">{{$t('global.next')}}</a-button>
                    <a-button v-if="current == steps.length - 1" type="primary" @click="saveModal()">
                        {{$t('global.save')}}
                    </a-button>
                </div>
            </div>
            <div class="steps-content" v-if="steps[current].title == 'Insurance'">
                <!-- <Insurance /> -->
                <a-form :id="arrayToObjectData(formData,arrayToObjectData(formTitleNames,19,'id','name'),'name','udid')" :model="insuranceData" name="basic" scrollToFirstError=true autocomplete="off" layout="vertical" @finish="insuranceForm" @finishFailed="insuranceDataFailed">
                    <Loader />
                    <a-row :gutter="24" v-for=" insuranceName,i in globalCode.insuranceType" :key="insuranceName.id">
                        <a-col :span="24">
                            <div class="formHeading">
                                <h2>{{insuranceName.name}}</h2>
                                <a-input @change="changedValue" type="hidden" :name="insuranceData.insuranceType[i]" :value="insuranceData.insuranceType[i]=insuranceName.id" />
                                <ErrorMessage v-if="errorMsg" :name="errorMsg.insuranceType?errorMsg.insuranceType[0]:''" />
                            </div>
                        </a-col>
                        <a-col :sm="8" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.insurance.insuranceNumber')" name="insuranceNumber" :rules="i==0?[{ required: true, message: $t('patient.insurance.insuranceNumber')+' '+$t('global.validation') }]:''">
                                    <a-input @change="changedValue" v-model:value="insuranceData.insuranceNumber[i]" size="large" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.insuranceNumber?errorMsg.insuranceNumber[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="8" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.insurance.insuranceName')" name="insuranceName" :rules="i==0?[{ required: true, message: $t('patient.insurance.insuranceName')+' '+$t('global.validation') }]:''">
                                    <GlobalCodeDropDown @change="changedValue" v-model:value="insuranceData.insuranceName[i]" :dataId="18" @handleGlobalChange="handleGlobalChange($event,'insuranceName'+i)" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.insuranceName?errorMsg.insuranceName[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <a-col :sm="8" :xs="24">
                            <div class="form-group">
                                <a-form-item :label="$t('patient.insurance.expirationDate')" name="expirationDate" :rules="i==0?[{ required: false, message: $t('patient.insurance.expirationDate')+' '+$t('global.validation') }]:''">
                                      <DateField :placeholder="'Ex - Jan 01, 2000'" :disabledDateData="current => !current || current < dayjs().subtract(1,'day')" @change="changedValue" v-model:value="insuranceData.expirationDate[i]" :globalDateFormat="globalDateFormat" value-format="YYYY-MM-DD" :size="size"  style="width: 100%" />
                                    <ErrorMessage v-if="errorMsg" :name="errorMsg.expirationDate?errorMsg.expirationDate[0]:''" />
                                </a-form-item>
                            </div>
                        </a-col>
                        <FormBaseComponents :formId="arrayToObjectData(formData,arrayToObjectData(formTitleNames,19,'id','name'),'name','udid')"> </FormBaseComponents>
                    </a-row>
                    <div class="steps-action">
                        <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                        <a-button v-if="current < steps.length - 1" type="primary" @click="scrollToTop(current)" html-type="submit">{{$t('global.save')}}</a-button>
                        <a-button v-if="current == steps.length - 1" type="primary" @click="saveModal()">
                            {{$t('global.save')}}
                        </a-button>
                    </div>
                </a-form>
            </div>
            <div class="steps-content" v-if="steps[current].title == 'Documents'">
                <Documents entity="patient" :idPatient="idPatient? idPatient : patients.addDemographic.id" @onChange="changedValue" />

                <div class="steps-action">

                    <a-button v-if="current > 0" style="margin-right: 8px" @click="prev">{{$t('global.previous')}}</a-button>
                    <a-button v-if="current < steps.length - 1" @click="next(); scrollToTop(current)" type="primary" html-type="submit">{{$t('global.next')}}</a-button>

                </div>
            </div>
        </a-col>
    </a-row>

</a-modal>
</template>

<script>
import {
  ref,
  computed,
  reactive,
  watchEffect,
  defineComponent,
  defineAsyncComponent,
  onUnmounted,
  onMounted,
  
} from "vue";
import dayjs from 'dayjs';
import { useStore } from "vuex";
import ErrorMessage from "@/components/common/messages/ErrorMessage.vue";
import { regex } from "@/RegularExpressions/regex";
import Loader from "@/components/loader/Loader";
// import Language from "@/components/modals/search/LanguageSearch.vue";
import {
  successSwal,
  warningSwal,
  globalDateFormat,
  errorSwal,
  formTitleNames,
  arrayToObjectData,
} from "@/commonMethods/commonMethod";
import { messages } from "../../config/messages";
import { useRoute } from "vue-router";
import GlobalCodeDropDown from "@/components/modals/search/GlobalCodeSearch.vue";
import DateField from "@/components/modals/search/DateField.vue";
import moment from "moment";
//import PhoneNumber from "@/components/modals/forms/fields/PhoneNumber"
import PatientConditions from "@/components/modals/forms/PatientConditions"
import NameField from "@/components/form-fields/NameField.vue"
export default defineComponent({
  props: {
    isEdit: Boolean,
  },
  components: {
    DateField,
    // Language,
    // PhoneNumber,
    //StaffDropDown,
    PatientConditions,
    GlobalCodeDropDown,
    NameField,
    FormBaseComponents:defineAsyncComponent(() =>
      import("@/components/modals/FormBaseComponents")
    ),
    Programs: defineAsyncComponent(() =>
      import("@/components/modals/forms/Programs")
    ),
    Devices: defineAsyncComponent(() =>
      import("@/components/modals/forms/Devices")
    ),
    ClinicalData: defineAsyncComponent(() =>
      import("@/components/modals/forms/ClinicalData")
    ),
    Documents: defineAsyncComponent(() =>
      import("@/components/modals/forms/Documents")
    ),
    ErrorMessage,
    Loader,
    PatientSearch: defineAsyncComponent(() =>
      import("../modals/search/PatientModal")
    ),
    ReferralSearch: defineAsyncComponent(() =>
      import("../modals/search/ReferralDropdownSearch")
    ),
    ProvidersDropdown: defineAsyncComponent(()=>import("@/components/modals/search/ProvidersDropdown")),
  },

  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const isValueChanged = ref(false);
    const formRef = ref();
    const patientSearch = ref(false);
    const customScrollTop = ref();
    const disableResponsiblePerson = ref(false);
    const disableEmergencyContact = ref(false);
    const emergencyContactShow = ref(true);
    const referalFormShow = ref(true);
    const ShowReferral = ref(false);
    const selectHeight = ref('1')
    const editPatientPopup = props.isEdit ? ref(true) : ref(false)
    const globalCode = computed(() => {
      return store.state.common;
    });

    const patients = computed(() => {
      return store.state.patients;
    });
    const patientDetails = computed(() => {
      return store.state.patients.patientDetails
    })
    
    const isSnfPatient = ref(false);

    function buttonToggle() {
      isSnfPatient.value = !isSnfPatient.value;
      demographics.isApp = isSnfPatient.value ? true : false
      if(!props.isEdit) {
        Object.assign(demographics, {
          email: demographics.email,
          phoneNumber: demographics.phoneNumber,
        });
      }
      else {
        if(isSnfPatient.value) {
          Object.assign(demographics, {
            email: demographics.email,
            phoneNumber: demographics.phoneNumber,
          });
        }
        else {
          Object.assign(demographics, {
            email: demographics.email,
            phoneNumber: demographics.phoneNumber,
          });
        }
      }

      const snfConditional = document.getElementsByClassName('snfConditional');
      if(snfConditional.length > 0) {
        for(var i = 0; i < snfConditional.length; i++) {
          const element = snfConditional[i]
          if(isSnfPatient.value) {
            const querySelectorError = element.querySelector('.ant-form-item-explain-error')
            if(querySelectorError != null) {
              const querySelectorField = element.querySelector('.ant-form-item-has-error')
              querySelectorError.classList.remove("ant-form-item-explain-error")
              querySelectorError.classList.add("customErrorMessage")
              querySelectorField.classList.add("customErrorField")
              querySelectorField.classList.remove("ant-form-item-has-error")
            }
          }
          else {
            if(demographics.email == "" || demographics.phoneNumber == "") {
              const querySelectorError = element.querySelector('.customErrorMessage')
              if(querySelectorError != null) {
                const querySelectorField = element.querySelector('.customErrorField')
                querySelectorError.classList.remove("customErrorMessage")
                querySelectorError.classList.add("ant-form-item-explain-error")
                querySelectorField.classList.add("ant-form-item-has-error")
                querySelectorField.classList.remove("customErrorField")
              }
            }
          }
        }
      }
    }

    const ShowReferralId = ref(true);

    const errorMsg = computed(() => {
      return store.state.patients.errorMsg;
    });

    const referralErrorMsg = computed(() => {
      return store.state.patients.referralErrorMsg;
    });

    const physicianErrorMsg = computed(() => {
      return store.state.patients.physicianErrorMsg;
    });

    const emergencyErrorMsg = computed(() => {
      return store.state.patients.emergencyErrorMsg;
    });

    const selectedProvider = computed(() => {
      return store.state.provider.selectedProvider;
    });

   
    const changedValue = () => {
      store.commit("isEditPatient", false);
      isValueChanged.value = true;
    };

    const changedPhoneNumber = () => {
      store.commit("isEditPatient", false);
      isValueChanged.value = true;
    };

    const showSearchPatient = () => {
      patientSearch.value = true;
    };
    const closeSearchPatient = (value) => {
      patientSearch.value = value;
    };

    const idPatient = ref(null);
    const responsiblePerson = computed(() => {
      return store.state.patients.responsiblePerson;
    });
    const emergencyContact = computed(() => {
      return store.state.patients.emergencyContact;
    });
    // const patientReferralSource = computed(() => {
    //     return store.state.patients.patientReferralSource;
    // });
    const isEditPatient = computed(() => {
      return store.state.patients.isEditPatient;
    });
    const emailUserDefined = patientDetails.value?.emailUserDefined;
    const phoneUserDefined = patientDetails.value?.phoneUserDefined;
    //const title = isEditPatient.value == true ? 'Edit Patient' : 'Add New Patient'
    const disabled = isEditPatient.value == true ? true : false;

    const demographics = reactive({
      isApp: false,
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      language: "",
      otherLanguage: [],
      nickName: "",
      weight: "",
      height: "",
      email: "",
      phoneNumber: "",
      contactType: [],
      contactTime: [],
      medicalRecordNumber: "",
      country: 19,
      state: "",
      city: "",
      zipCode: "",
      appartment: "",
      address: "",
      placeOfService: "",
      heightInCentimeter:"",
      emailUserDefined: 1,
      phoneUserDefined: 1,
      providers: [],
      defaultProvider: "",
    });

    const responsiblePersonForm = reactive({
      id: "",
      self: false,
      relation: "",
      relationName: "Self",
      relationId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      contactType: [],
      contactTime: [],
      gender: "",
    });

    const emergencyContactForm = reactive({
      id: "",
      sameAsPrimary: false,
      firstName: "",
      middleName: "",
      lastName: "",
      emergencyEmail: "",
      phoneNumber: "",
      contactType: [],
      contactTime: [],
      gender: "",
    });

    const referal = reactive({
      firstName: "",
      middleName: "",
      lastName: "",
      id: "",
      referralName: "",
      referralDesignation: "",
      referralEmail: "",
      referralPhoneNumber: "",
      referralFax: "",
      referral: "",
    });

    const insuranceData = reactive({
      betrix:false,
      insuranceNumber: [],
      insuranceName: [],
      expirationDate: [],
      insuranceType: [],
    });

    const handleReferralChange = (value) => {
      referal.referral = value;
    };

    const emergencyForm = reactive({
      ...emergencyContactForm,
    });
    const responsiblePersonReactiveForm = reactive({
      ...responsiblePersonForm,
    });
    const referalForm = reactive({
      ...referal,
    });
const insuranceDataReset = reactive({
  ...insuranceData
    });
    function newReferral() {
      if (ShowReferral.value == false) {
        ShowReferral.value = true;
        ShowReferralId.value = false;
      } else {
        ShowReferral.value = false;
        ShowReferralId.value = true;
        let referalData = referal.referral;
        Object.assign(referal, referalForm);
        referal.referral = referalData;
      }
    }
    const current = computed({
      get: () => store.state.patients.counter,
      set: (value) => {
        if(value == 5) {
          store.commit('isConditionEdit', false)
        }
        if (props.isEdit || patients.value.addDemographic) {
          store.state.patients.counter = value;
        } else {
          if (
            demographics.firstName &&
            demographics.lastName &&
            demographics.dob &&
            demographics.email &&
            demographics.phoneNumber &&
            referalEmail.value == false
          ) {
            if (store.state.patients.counter < 1) {
              demographic(value);
            }
          } else {
            errorSwal(messages.fieldsRequired);
            store.state.patients.counter = 0;
          }
        }
      },
    });
    const form = reactive({
      ...demographics,
    });
    const disabledProvider = ref(false)

    onMounted(() => {
      if(selectedProvider.value != "" && selectedProvider.value != null) {
        demographics.providers.push(selectedProvider.value.id)
        demographics.defaultProvider = selectedProvider.value.id
        disabledProvider.value = true
      }
      else {
        disabledProvider.value = false
      }
      Object.assign(demographics, form);
      //   store.dispatch("referralList");
      isSnfPatient.value = patients.value.patientDetails != null ? patients.value.patientDetails.isApp : false
    });
    
    onUnmounted(() => {
      disabledProvider.value = false
    })
    const referalEmail = ref(false);
    watchEffect(() => {
      idPatient.value = patients.value.addDemographic
        ? patients.value.addDemographic.id
        : route.name == "PatientSummary" && props.isEdit
        ? route.params.udid
        : null;
      // Bitrix data assign

      if (patients.value.fetchFromBitrix) {
        Object.assign(demographics, patients.value.fetchFromBitrix);
        Object.assign(insuranceData, patients.value.fetchFromBitrixInsurance);
          if(insuranceData.insuranceNumber.length>0){
            insuranceData.betrix = true

          }

      } else if (!patients.value.fetchFromBitrix) {
        Object.assign(demographics, form);
      }

      //responsiblePerson.value && responsiblePerson.value.self ? disableResponsiblePerson.value = true : disableResponsiblePerson.value = false
      //emergencyContact.value && emergencyContact.value.sameAsPrimary ? disableEmergencyContact.value = true : disableEmergencyContact.value = false

     
      if (props.isEdit && responsiblePerson.value) {
        
        Object.assign(responsiblePersonForm, responsiblePerson.value);
        if(responsiblePerson.value.self) {
          disableResponsiblePerson.value = true
        }else{
          disableResponsiblePerson.value = false
        }
      }
      // if (patients.value.addDemographic || (patients.value.patientDetails&&props.isEdit)) {
      if (patients.value.addDemographic || (patients.value.patientDetails && props.isEdit)) {
        Object.assign(
          demographics,
          patients.value.addDemographic
            ? patients.value.addDemographic
            : patients.value.patientDetails
        );
        
       
        
        
      }
      if (patients.value.patientReferralSource != null && !props.isEdit) {
        //referalFormShow.value = false
        ShowReferral.value = false;
        ShowReferralId.value = true;
        Object.assign(referal, referalForm);
        referal.referral = patients.value.patientReferralSource.id;
      }
      if (patients.value.patientInsurance != null && props.isEdit) {
        Object.assign(insuranceData, patients.value.patientInsurance);
      }

      if (props.isEdit) {
        referalFormShow.value = false;
        emergencyContactShow.value = false;
        emergencyContactForm.sameAsPrimary = false;
        // responsiblePersonForm.self = false;
      }
      // }
    });

    const parameters = reactive([]);

    const demographic = (counteValue = null) => {
       demographics.phoneNumber = isSnfPatient.value ? "" : demographics.phoneNumber.replace(/-/g,'')
      // demographics.email = isSnfPatient.value ? "" : demographics.email
      responsiblePersonForm.phoneNumber = responsiblePersonForm.phoneNumber.replace(/-/g,'')
      emergencyContactForm.phoneNumber = emergencyContactForm.phoneNumber.replace(/-/g,'')
      referal.referralPhoneNumber = referal.referralPhoneNumber.replace(/-/g,'')
      if (responsiblePersonForm.self == true && !responsiblePerson.value) {
        let contactType = []
        contactType = responsiblePersonForm.contactType
        Object.assign(responsiblePersonForm, demographics);
        responsiblePersonForm.contactType = contactType
      }
      if (
        emergencyContactForm.sameAsPrimary == true &&
        !emergencyContact.value
      ) {
        if (responsiblePersonForm.self) {
        
          let contactType = responsiblePersonForm.contactType
          Object.assign(emergencyContactForm, demographics);
          emergencyContactForm.emergencyEmail = demographics.email;
          emergencyContactForm.contactType = contactType
          emergencyContactForm.sameAsPrimary = true;
          
        } else {
          Object.assign(emergencyContactForm, responsiblePersonForm);
       
          emergencyContactForm.emergencyEmail = responsiblePersonForm.email;
          emergencyContactForm.sameAsPrimary = true;
        }
      }
      let demographicRecord = {...demographics}
      let referalRecord = {...referal}
      let responsiblePersonFormRecord = {...responsiblePersonForm}
      let emergencyContactFormRecord = {...emergencyContactForm}
      if (
        (referal.firstName ||
          referal.middleName ||
          referal.lastName ||
          referal.referralDesignation ||
          referal.referralFax ||
          referal.referralPhoneNumber) &&
        referal.referralEmail == ""
      ) {
        store.state.patients.referralErrorMsg["referralEmail"] =
          "Please enter valid email";
      }
      else {
        if(demographics.isApp) {
          if(demographics.email != "") {
            demographics.emailUserDefined = 1
          }
          else {
            demographics.emailUserDefined = 0
          }
          if(demographics.phoneNumber != "") {
            demographics.phoneUserDefined = 1
          }
          else {
            demographics.phoneUserDefined = 0
          }
        }
        if (props.isEdit && (patients.value.addDemographic != null || patients.value.patientDetails != null)) {
          store.dispatch("updateDemographic", {
            data: {
              demographics: demographicRecord,
              referal: referalRecord,
              responsiblePerson: responsiblePersonFormRecord,
              emergencyContactForm: emergencyContactFormRecord,
            },
            referalId: null,
            responsiblePersonId: responsiblePerson.value
              ? responsiblePerson.value.id
              : null,
            emergencyContactId:
              emergencyContact.value && !props.isEdit
                ? emergencyContact.value.id
                : null,
            patientUdid: patients.value.addDemographic
              ? patients.value.addDemographic.id
              :props.isEdit ?  patients.value.patientDetails.id : null,
          })
          .then(() => {
            //   store.dispatch("referralList");
            isValueChanged.value = false
            if (route.name == "PatientSummary") {
              store.dispatch("patientDetails", route.params.udid);
              store.dispatch("responsiblePerson", route.params.udid);
              store.dispatch("emergencyContact", route.params.udid);
              
            }
          });
        }
        else if (!props.isEdit && (patients.value.addDemographic != null)) {
          store.dispatch("updateDemographic", {
            data: {
              demographics: demographicRecord,
              referal: referalRecord,
              responsiblePerson: responsiblePersonFormRecord,
              emergencyContactForm: emergencyContactFormRecord,
            },
            referalId: null,
            responsiblePersonId: responsiblePerson.value
              ? responsiblePerson.value.id
              : null,
            emergencyContactId:
              emergencyContact.value && !props.isEdit
                ? emergencyContact.value.id
                : null,
            patientUdid: patients.value.addDemographic
              ? patients.value.addDemographic.id
              : null,
          }).then(() => {
            isValueChanged.value = false
            if (counteValue && !errorMsg.value) {
              store.state.patients.counter = counteValue;
            }
            //   store.dispatch("referralList");
            if (route.name == "PatientSummary") {
              store.dispatch("patientDetails", route.params.udid);
              store.dispatch("responsiblePerson", route.params.udid);
              store.dispatch("emergencyContact", route.params.udid);
            
            }
          });
        }
        else {
          store.dispatch("addDemographic", {
            demographics: demographicRecord,
            referal: referalRecord,
            responsiblePerson: responsiblePersonFormRecord,
            emergencyContactForm: emergencyContactFormRecord,
          }).then(() => {
            //   store.dispatch("referralList");
            isValueChanged.value = false
            if (counteValue && !errorMsg.value) {
              store.state.patients.counter = counteValue;
            }

            if (route.name == "PatientSummary") {
              store.dispatch("patientDetails", route.params.udid);
              store.dispatch("responsiblePerson", route.params.udid);
              store.dispatch("emergencyContact", route.params.udid);
            
            }
          });
        }
      }
    };

    const parameter = () => {
      store
        .dispatch("parameter", {
          vital: parameters,
          id: patients.value.addDemographic.id,
        })
        .then(() => {
          isValueChanged.value = false;
        });
    };

    const insuranceForm = () => {
      
      if (idPatient.value != null) {
        store
          .dispatch("addInsurance", {
            data: {
              insurance: [insuranceData],
              betrix:insuranceData.betrix
            },
            id: idPatient.value,
          })
          .then(() => {
            isValueChanged.value = false;
            
          });
      } else {
        store
          .dispatch("addInsurance", {
            data: {
              insurance: [insuranceData],
              betrix:insuranceData.betrix
            },
            id: patients.value.addDemographic.id,
          })
          .then(() => {
            isValueChanged.value = false;
           
          });
      }
    };

    const next = () => {
      store.commit("counterPlus");
      if(current.value == 5) {
        store.commit('isConditionEdit', false)
      }
    };

    const prev = () => {
      //isValueChanged.value= false
      if (patients.value.addDemographic && current.value == 1) {
        Object.assign(demographics, patients.value.addDemographic);
        
      }
      if(current.value == 6) {
        store.commit('isConditionEdit', false)
      }

      // if(patients.value.addDemographic && current.value == 1) {
      // 	Object.assign(demographics, patients.value.addDemographic);
      // }
      store.commit("counterMinus");
      customScrollTop.value.scrollIntoView({
        behavior: "smooth",
      });
    };

    const demographicsFailed = () => {
      
    };

    const insuranceDataFailed = () => {};

    const err = computed(() => {
      return store.state.patients.errorMessage;
    });
    const errorMessage = err.value;

    function parameterFields(id) {
      store.dispatch("parameterFields", id);
    }

    const fields = computed(() => {
      return store.state.patients.parameterFields;
    });

    function saveModal() {
      store.commit("resetCounter");
      current.value = 0;
      emit("closeModal", {
              modal: "editPatient",
              value: false,
            });

      // store.commit("resetCounter");
      successSwal(messages.formSuccess);
      common();

      store.dispatch("patients");
      // store.commit("resetCounter");
     
      store.state.patients.editPatientReferral = null;
    }

    const bitrixFormCheck = computed(() => {
      return store.state.patients.bitrixFormCheck;
    });

    function common() {
      store.commit("bitrixFormCheck", false);
      store.state.patients.addDemographic = null;
      
        
        //store.state.patients.patientDetails = null;
        store.state.patients.emergencyContact = null;
        store.state.patients.patientReferralSource = null;
        store.state.patients.responsiblePerson = null;
        store.state.patients.patientConditions = null
        store.state.patients.fetchFromBitrix = "";
        store.state.patients.uploadFile = "";
        store.state.patients.patientInsurance = "";
      store.commit("resetCounter");
      clearValidtion()
      Object.assign(demographics, form);
      isValueChanged.value = false;
      emergencyContactForm.sameAsPrimary = false;
      responsiblePersonForm.self = false;
      Object.assign(insuranceData, insuranceDataReset)
      Object.assign(responsiblePersonForm, responsiblePersonReactiveForm);
      Object.assign(referal, referalForm);
      Object.assign(emergencyContactForm, emergencyForm);
      ShowReferral.value = false;
      disableResponsiblePerson.value = false;
      disableEmergencyContact.value = false;
    }

    function closeModal() {
      isSnfPatient.value = patientDetails.value?.isApp;
      if (isValueChanged.value || bitrixFormCheck.value) {
        // emit("saveModal", true)
        // emit("closeModal", {
        //   modal: "editPatient",
        //   value: false,
        // })
        emit("closeModal", {
              modal: "editPatient",
              value: true,
            });
        warningSwal(messages.modalWarning).then((response) => {
          if (response == true) {
            //store.commit("addDemographic", null);
            store.commit("resetCounter")
            common();
             //emit("saveModal", false);
            emit("closeModal", {
              modal: "editPatient",
              value: false,
            });
            store.state.patients.editPatientReferral = null;
            // saveModal()
          } else {
            // emit("saveModal", true);
            emit("closeModal", {
              modal: "editPatient",
              value: true,
            });
            store.commit("resetCounter")
            store.state.patients.editPatientReferral = null;
          }
        });
      }
      else {
       common()
        emit("closeModal", {
          modal: "editPatient",
          value: false,
        })
        // emit("saveModal", false)
        
      }
    }

    function emailChange() {
      errorMsg.value && errorMsg.value.email ? (errorMsg.value.email[0] = null) : "";
    }

    function stepperClick() {
     
    }

    onUnmounted(() => {
      store.commit("errorMsg", null);
      store.commit("referralErrorMsg", null);
      store.commit("physicianErrorMsg", null);
    });

    function clearValidtion() {
      formRef?.value?.resetFields();
      Object.assign(demographics, patients.value.fetchFromBitrix);
    }

    const onKeyUp = (event) => {
      if (
        (referal.firstName ||
          referal.middleName ||
          referal.lastName ||
          referal.referralDesignation ||
          referal.referralFax ||
          referal.referralPhoneNumber ||
          referal.referralEmail) &&
        !referal.referralEmail.match(regex.emailValidation)
      ) {
        referalEmail.value = true;
      } else {
        referalEmail.value = false;
      }

      if (event == "referralEmail") {
        if (referal.referralEmail.match(regex.emailValidation)) {
          referalEmail.value = false;
        }
      }
    };

    function scrollToTop() {
      customScrollTop.value.scrollIntoView({
        behavior: "smooth",
      });
    }

    const handleStaffChange = () => {
      
    };

    function checkChangeInput() {
      store.commit("checkChangeInput", true);
    }

    function changeResponsible(e) {
      isValueChanged.value = true;
      disableEmergencyContact.value = true;

      if (e.target.checked) {
        store.commit("isEditPatient", true);
        //         if(responsiblePersonForm.self){
        //            Object.assign(emergencyContactForm, demographics);
        //         emergencyContactForm.emergencyEmail = demographics.email;
        //         emergencyContactForm.sameAsPrimary = true;
        //         }else{
        // Object.assign(emergencyContactForm, responsiblePersonForm);
        //         emergencyContactForm.emergencyEmail = responsiblePersonForm.email;
        //         emergencyContactForm.sameAsPrimary = true;
        //         }
      } else {
        Object.assign(emergencyContactForm, emergencyForm);
        emergencyContactForm.sameAsPrimary = false;
        disableEmergencyContact.value = false;
      }
    }

    function changeSelf(event) {
      const relationId = ref("");
      globalCode.value.relation.some((relation) => {
        if (relation.name === "Self") {
          relationId.value = relation.id;
        }
      });

      if (!editPatientPopup.value) {
        if (event.target.checked) {
          
          Object.assign(responsiblePersonForm, demographics);
          responsiblePersonForm.contactType = []
          responsiblePersonForm.self = true;
          disableResponsiblePerson.value = true;
          responsiblePersonForm.relationId = relationId.value;
          responsiblePersonForm.relation = relationId.value;
          responsiblePersonForm.email = demographics.email;
          responsiblePersonForm.phoneNumber = demographics.phoneNumber;
        }
        else {
          Object.assign(responsiblePersonForm, responsiblePersonReactiveForm);
          responsiblePersonForm.self = false;
          responsiblePersonForm.relation = ''
          emergencyContactForm.sameAsPrimary = false
          disableResponsiblePerson.value = false;
        }
      }
      else {
        if (event.target.checked) {
          Object.assign(responsiblePersonForm, demographics);
          responsiblePersonForm.self = true;
          responsiblePersonForm.contactType = []
          disableResponsiblePerson.value = true;
          responsiblePersonForm.relationId = relationId.value;
          responsiblePersonForm.relation = relationId.value;
          responsiblePersonForm.email = demographics.email;
          responsiblePersonForm.phoneNumber = demographics.phoneNumber;
        }
        else {

          Object.assign(responsiblePersonForm, responsiblePerson.value);
          responsiblePersonForm.relation = ''
          responsiblePersonForm.self = false;
          emergencyContactForm.sameAsPrimary = false
          disableResponsiblePerson.value = false;
        }
      }

      store.commit("isEditPatient", true);
      isValueChanged.value = true;
    }
    const editDataReferral = computed(() => {
      return store.state.patients.editPatientReferral;
    });
    

    //height convert to centemeter
    function convertToCm(inchInput) {
      var rex = /^(\d+)'(\d+)(?:''|")$/;
      var match = rex.exec(inchInput);
      var feet, inch;
      if (match) {
        feet = parseInt(match[1], 10);
        inch = parseInt(match[2], 10);
        demographics.heightInCentimeter = (((feet * 12) + inch)*2.54).toFixed(2)
      } else {
        demographics.heightInCentimeter=''
      }
    }

    //height convert to feet/inches
    function convertToFeet(n) {
      if(n){
        var realFeet = ((n*0.393700) / 12);
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
         demographics.height = feet +"'" + inches+'"' ;
      }else{
        demographics.height =''
      }
    }

    const handleGlobalChange = (data,type)=>{
      if(type=='singleLang'){
        demographics.language = data
      }
      if(type=='multiLang'){
        demographics.otherLanguage = data
      }
      if(type=='gender'){
        demographics.gender = data
      }
      if(type=='contactType'){
        demographics.contactType = data
      }
      if(type=='contactTime'){
        demographics.contactTime = data
      }
      if(type=='placeOfService'){
        demographics.placeOfService = data
      }
      if(type=='state'){
        demographics.state = data
      }
      if(type=='country'){
        demographics.country = data
      }
      if(type == 'responsiblePersonForm.relation'){
        responsiblePersonForm.relation =data
      }
      if(type=='responsiblePersonForm.contactType'){
        responsiblePersonForm.contactType = data
      }
      if(type=='responsiblePersonForm.contactTime'){
        responsiblePersonForm.contactTime = data
      }
      if(type=='responsiblePersonForm.gender'){
        responsiblePersonForm.gender = data
      }
      if(type=='emergencyContactForm.contactType'){
        emergencyContactForm.contactType = data
      }
      if(type=='emergencyContactForm.contactTime'){
        emergencyContactForm.contactTime = data
      }
      if(type=='emergencyContactForm.gender'){
        emergencyContactForm.gender = data
      }
      if(type=='insuranceName0'){
        insuranceData.insuranceName[0] = data
      }
       if(type=='insuranceName1'){
        insuranceData.insuranceName[1] = data
      }
       if(type=='insuranceName2'){
        insuranceData.insuranceName[2] = data
      }
    }

    const messageType = computed(() => {
            return store.state.common.messageType;
        });

    const addedProviders = computed(() => {
      return store.state.provider.addedProviders
    })

    const handleProviderChange = (selectedList) => {
      let list = []
      if(Array.isArray(selectedList)) {
        selectedList.map(element => {
          list.push(element.value)
        }) 
      }
      else {
        list.push(selectedList)
      }
      demographics.providers = list;
      demographics.defaultProvider = list[0];
      store.commit('addedProviders', selectedList)
     
    };

    return {
      addedProviders,
      handleProviderChange,
      messageType,
      handleGlobalChange,
      convertToFeet,
      convertToCm,
      selectHeight,
      editDataReferral,
      handleReferralChange,
      disableResponsiblePerson,
      disableEmergencyContact,
      handleStaffChange,
      checkChangeInput,
      customScrollTop,
      changeSelf,
      // setPhoneNumberEmergencyPhoneNumber,
      // setPhoneNumberDemographics,
      scrollToTop,
      formRef,
      clearValidtion,
      changedValue,
      changedPhoneNumber,
      closeSearchPatient,
      showSearchPatient,
      patientSearch,
      stepperClick,
      emailChange,
      insuranceDataFailed,
      closeModal,
      warningSwal,
      form,
      successSwal,
      saveModal,
      regex,
      dayjs,
      insuranceForm,
      insuranceData,
      parameter,
      parameters,
      fields,
      parameterFields,
      errorMsg,
      referralErrorMsg,
      physicianErrorMsg,
      emergencyErrorMsg,
      errorMessage,
      patients,
      current,
      globalCode,
      demographic,
      steps:[
      {
        title: "Demographics",
        key: "demographics",
        content: "First-content",
      },
      {
        title: "Devices",
        key: "devices",
        content: "Second-content",
      },
      {
        title: "Programs",
        key: "programs",
        content: "Third-content",
      },
      {
        title: "Insurance",
        key: "insurance",
        content: "Fourth-content",
      },
      {
        title: "Documents",
        key: "documents",
        content: "Fifth-content",
      },
      {
        title: "Conditions",
        key: "conditions",
        content: "Sixth-content",
      },

      {
        title: "History & Meds",
        key: "clinicalData",
        content: "Seventh-content",
      },
    ],
      next,
      prev,
      size: ref("large"),
      search: ref(),
      demographics,
      demographicsFailed,
      idPatient,
      patientDetails,
      isEditPatient,
      disabled,
      onKeyUp,
      bindProps: store.state.common.bindProps,
      moment,
      globalDateFormat,
      responsiblePersonForm,
      emergencyContactForm,
      referal,
      changeResponsible,
      emergencyContactShow,
      referalFormShow,
      ShowReferral,
      newReferral,
      //   referralData: store.getters.referralList,
      ShowReferralId,
      referalEmail,
      buttonToggle,
      isSnfPatient,
      emailUserDefined,
      phoneUserDefined,
      formTitleNames,
      arrayToObjectData,
      formData:store.getters.formTitle,
      disabledProvider,
    };
  },
});
</script>

<style lang="scss">
  .patientModal {
    .ant-modal-body {
      min-height: calc(100vh - 300px) !important;
    }
  }
@media (max-width: 1199px) {
  .ant-steps-item {
    display: flex;

    .ant-steps-item-container {
      text-align: center;

      .ant-steps-item-icon {
        margin: 0;
      }

      .ant-steps-item-content {
        display: block;

        .ant-steps-item-title {
          padding: 0;
          font-size: 13px;

          &::after {
            display: none;
          }
        }
      }
    }
  }
}

.steps-content {
  margin-top: 16px;
  border-radius: 6px;
  min-height: 200px;
  text-align: left;
  padding: 12px 0;
}

.steps-action {
  text-align: right;
}
.steps-action  .ant-row {
  margin-bottom: 0!important;
}
.validation {
  color: red;
}

.ant-input-number-handler-wrap {
  display: none;
}

label.ant-checkbox-wrapper.ant-checkbox-wrapper-checked {
  width: fit-content;
}
.toggleButton {
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 6px 16px;
  display: inline-block;
  cursor: pointer;
  width: fit-content!important;
  text-align: center;
}

.toggleButton.active {
  background-color: #777;
  color: #fff;
}

.customErrorMessage {
  visibility: hidden;
}
</style>
