<template>
   <div ref="formDiv">
    <a-form class="common-form" ref="formRef" @finish="submitForm" :model="state.formData" :label-col="labelCol"
      :wrapper-col="wrapperCol" autocomplete="off">
      <div class="drawerBody">
        <Loader v-if="isEditLoading" />
        <a-row :gutter="16" v-else>
            <a-col :span="24">
            <!--- edit/new dynamacally -->
              <a-typography-title :level="2" class="common-heading">{{ typeof udid !== "undefined" ? 'Edit':'New' }} Patient</a-typography-title>        </a-col>
            <a-col :span="24">
            <a-row :gutter="[48, 16]">
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.firstName')" :name="['contact','firstName']" class="required"
                :rules="[{ required: true, message: $t('global.required') }]"
                :disabled="false"
                >
                  <NameField :placeholderData="$t('patient.onboarding.firstName')" v-model:value="state.formData.contact.firstName" :disabled="false" :max="20"/>
                  <ErrorMessage v-if="error" :name="error?.contact?.firstName ? error?.contact?.firstName[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="5" style="padding-right: 9px">
                <a-form-item :label="$t('patient.onboarding.middleName')"
                :name="['contact','middleName']"

                :disabled="false"
                >
                  <NameField :placeholderData="$t('patient.onboarding.middleName')"  v-model:value="state.formData.contact.middleName" :disabled="false" :max="20"/>
                  <ErrorMessage v-if="error" :name="error?.contact?.middleName ? error?.contact?.middleName[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="7" style="padding-left: 9px">
                <a-form-item  :label="$t('patient.onboarding.lastName')" :name="['contact','lastName']" class="required"
                :rules="[{ required: true, message: $t('global.required') }]"
                :disabled="false" >
                  <NameField :placeholderData="$t('patient.onboarding.lastName')" v-model:value="state.formData.contact.lastName" :disabled="false" :max="20"/>
                  <ErrorMessage v-if="error" :name="error?.contact?.lastName ? error?.contact?.lastName[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.gender')" :name="['contact','genderId']" class="required"
                :rules="[{ required: true, message: $t('global.required') }]"
                >
                  <SelectBox v-model:value="state.formData.contact.genderId"
                    :placeholderData="$t('patient.onboarding.secondaryLanguage')"
                    :globalCode="store.state.common.gender" :maxLength="12" :maxtag="4" />
                    <ErrorMessage v-if="error" :name="error?.contact?.genderId ? error?.contact?.genderId[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.dob')" class="required"
                :rules="[{ required: true, message: $t('global.required') },{...dobValidation,message:$t('patient.onboarding.dobMessage')}]"
                :name="['contact','dob']"
                :disabled="false"
                >
                  <a-date-picker
                    v-model:value="state.formData.contact.dob"
                    :format="[globalDateFormat,'DD/MM/YYYY']"
                    :value-format="globalDateFormat"
                    :defaultPickerValue="state.formData.contact.dob ? state.formData.contact.dob :dayjs().subtract(18,'years')"
                    style="width: 100%"
                    @focus="disableScroll"
                    :showToday="false"
                    @blur="enableScroll"
                  />
                  <ErrorMessage v-if="error" :name="error?.contact?.dob ? error?.contact?.dob[0] : ''" />
                </a-form-item>
              </a-col>
              <!-- globalcode fetch directly from common API -->
              <a-col :span="12">
                <a-form-item
                :label="$t('patient.onboarding.primaryLanguage')"
                :rules="[{ required: true, message: $t('global.required') }]"
                name="primaryLanguageId"
                class="required"
                :disabled="false"
                >
                  <SelectBox  v-model:value="state.formData.primaryLanguageId"
                    :placeholderData="$t('patient.onboarding.primaryLanguage')"
                    :globalCode="store.state.common.language" :maxLength="12" :maxtag="4" />
                    <ErrorMessage v-if="error" :name="error?.primaryLanguageId ? error?.primaryLanguageId[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                :label="$t('patient.onboarding.secondaryLanguage')"
                name="secondaryLanguageId"
                :disabled="false"
                >
                <SelectBox v-model:value="state.formData.secondaryLanguageId"
                    :placeholderData="$t('patient.onboarding.secondaryLanguage')"
                    :globalCode="store.state.common.language" :maxLength="12" :maxtag="4" />
                <ErrorMessage v-if="error" :name="error?.secondaryLanguageId ? error?.secondaryLanguageId[0] : ''" />
              </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.placeOfService')" class="required" name="placeOfServiceId"
                :rules="[{ required: true, message: $t('global.required') }]"
                >
                  <SelectBox  v-model:value="state.formData.placeOfServiceId"
                    :placeholderData="$t('patient.onboarding.placeOfService')"
                    :globalCode="store.state.common.placeOfService" :maxLength="12" :maxtag="4" />
                  <ErrorMessage v-if="error" :name="error?.placeOfServiceId ? error?.placeOfServiceId[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.timeZone')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]"
                :name="['user','timeZoneId']"
                >
                  <SelectBox  v-model:value="state.formData.user.timeZoneId"
                    :placeholderData="$t('patient.onboarding.timeZone')"
                    :globalCode="store.state.common.timeZone " :maxLength="12" :maxtag="4"
                    />
                  <ErrorMessage v-if="error" :name="error?.user?.timeZoneId ? error?.user?.timeZoneId[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <div class="form-heading">
                  <a-typography-title :level="3">Contact Details</a-typography-title>
                  <a-typography-text>Contact method</a-typography-text>
                </div>
              </a-col>
              <a-col :span="24">
                <a-checkbox v-if="typeof udid == 'undefined'" class="custom-checkbox" @change="onSNFchange">Create a user account to download Tethr app </a-checkbox>
                </a-col>
              <a-col :span="12">

                <a-form-item :label="$t('patient.onboarding.phoneNumber')" :class="[isRequired ? 'required' : '']" :name="['contact','phoneNumber']"
                :rules="[{ required: isRequired, message: $t('global.required'), pattern: regex.phoneNumber },{...invalidPhoneNumber,message:$t('global.invalidPhoneNumber')}]"

                >
                  <InputFields  v-maska="'###-###-####'" v-model:value="state.formData.contact.phoneNumber" max="12"
                    :placeholderData="$t('patient.onboarding.phoneNumber')"  :disabled="typeof udid !== 'undefined' && !store.state.patientsStore.convertSystemUser" />
                  <ErrorMessage v-if="error" :name="error?.contact?.phoneNumber ? error?.contact?.phoneNumber[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.email')" :class="[isRequired ? 'required' : '']"
                :rules="[{ required: isRequired, message: $t('global.required'),type:'email' }]"
                :name="['user','email']" >
                  <InputFields  v-model:value="state.formData.user.email"
                    :placeholderData="$t('patient.onboarding.email')"
                    :disabled="typeof udid !== 'undefined' && !store.state.patientsStore.convertSystemUser"
                    @keyup="clearEmailVal"
                    />
                  <ErrorMessage v-if="error" :name="error?.['user.email'] ? error?.['user.email'][0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.contactMethod')" :class="[isRequired ? 'required' : '']"
                :rules="[{ required: isRequired, message: $t('global.required') }]"
                name="contactMethodId"
                >
                  <SelectBox  v-model:value="state.formData.contactMethodId"
                    :placeholderData="$t('patient.onboarding.contactMethod')"
                    :globalCode="store.state.common.pmOfcontact" :maxLength="12" :maxtag="4"
                    :disabled="typeof udid !== 'undefined' && !store.state.patientsStore.convertSystemUser"
                  />
                  <ErrorMessage v-if="error" :name="error?.contactMethodId ? error?.contactMethodId[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.bestTimeToCall')" :class="[isRequired ? 'required' : '']"
                :rules="[{ required:isRequired, message: $t('global.required') }]"
                name="bestTimeToCallId"
                >
                  <SelectBox  v-model:value="state.formData.bestTimeToCallId"
                    :placeholderData="$t('patient.onboarding.bestTimeToCall')"
                    :globalCode="store.state.common.ptOfDayContact" :maxLength="12" :maxtag="4"
                    :disabled="typeof udid !== 'undefined' && !store.state.patientsStore.convertSystemUser"
                   />
                  <ErrorMessage v-if="error" :name="error?.bestTimeToCallId ? error?.bestTimeToCallId[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <div class="form-heading">
                  <a-typography-title :level="3">Address</a-typography-title>
                  <a-typography-text>Physical address for contractual needs</a-typography-text>
                </div>
              </a-col>
              <a-col :span="12">
                <a-form-item
                :label="$t('patient.onboarding.lane1')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]"
                :name="['address','line1']"
                :disabled="false"
                >
                  <InputFields
                  v-model:value="state.formData.address.line1"
                    :placeholderData="$t('patient.onboarding.lane1')"
                  />
                  <ErrorMessage v-if="error" :name="error?.address?.line1 ? error?.address?.line1[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.lane2')"
                :name="['address','line2']"
                :disabled="false">
                  <InputFields    v-model:value="state.formData.address.line2"
                    :placeholderData="$t('patient.onboarding.lane2')" />
                  <ErrorMessage v-if="error" :name="error?.address?.line2 ? error?.address?.line2[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.city')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]"
                :name="['address','city']"
                @keypress="alphabetsOnly"
                >
                  <InputFields v-model:value="state.formData.address.city"
                    :placeholderData="$t('patient.onboarding.city')" />
                  <ErrorMessage v-if="error" :name="error?.address?.city ? error?.address?.city[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="5" style="padding-right:9px;">
                <a-form-item :label="$t('patient.onboarding.state')" class="required"
                  :rules="[{ required: true, message: $t('global.required') }]"
                  :name="['address','stateId']"
                  :disabled="false"
                >
                  <SelectBox  v-model:value="state.formData.address.stateId"
                    :placeholderData="$t('patient.onboarding.state')"
                    :globalCode="store.state.common.state" :maxLength="12" :maxtag="4" />
                  <ErrorMessage v-if="error" :name="error?.address?.stateId ? error?.address?.stateId[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="7" style="padding-left:9px;"  >
                <a-form-item
                :label="$t('patient.onboarding.zipcode')" class="required"
                :rules="[{ required: true, message: $t('global.required'),pattern: regex.zipCode }]" :name="['address','zipCode']"

                >
                  <InputFields  :placeholderData="$t('patient.onboarding.zipcode')"
                v-model:value="state.formData.address.zipCode"  :max="5" @keypress="numbersOnly"/>
                <ErrorMessage v-if="error" :name="error?.address?.zipCode ? error?.address?.zipCode[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <div class="form-heading">
                  <a-typography-title :level="3">Demographics</a-typography-title>
                  <a-typography-text>Physical Demographics required here</a-typography-text>
                </div>
              </a-col>
              <a-col :span="6">
                <a-form-item  :label="$t('patient.onboarding.height')+ '(Feet/Inches)'"
                :rules="[{ required: false, message: $t('global.validValidation')+' '+$t('patient.onboarding.height') }]"
                >
                  <InputFields
                  :placeholderData="$t('patient.onboarding.height')"
                  v-model:value="state.formData.height"
                  @input="convertToCm(state.formData.height)"
                  />
                  <ErrorMessage v-if="error" :name="error?.height ? error?.height[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item  :label="$t('patient.onboarding.height')+ '(CM)'"
                :rules="[{required: false,message: $t('global.required')},{message: $t('global.validValidation')+' '+$t('patient.onboarding.height'), pattern: regex.digitWithdecimal }]"
                name="heightInCentimeter"
                >
                  <InputFields
                  :placeholderData="$t('patient.onboarding.height')"
                  v-model:value="state.formData.heightInCentimeter"
                  @input="convertToFeet(state.formData.heightInCentimeter)"
                  />
                  <ErrorMessage v-if="error" :name="error?.height ? error?.height[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.weight')+'(LBS)'"
                :rules="[{required: false,message: $t('global.required')},{pattern: regex.digitWithdecimal,message: $t('global.validValidation')+' '+$t('patient.onboarding.weight')}]" name="weight" >
                  <InputFields
                  :placeholderData="$t('patient.onboarding.weight')"
                  v-model:value="state.formData.weight"
                  />
                  <ErrorMessage v-if="error" :name="error?.weight ? error?.weight[0] : ''" />
                </a-form-item>
              </a-col>
              <template v-if="typeof udid === 'undefined'">
                <a-col :span="24">
                <div class="form-heading">
                  <a-typography-title :level="3">Insurance</a-typography-title>
                  <a-typography-text>Patient Insurance related info</a-typography-text>
                </div>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.insuranceNumber')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" :name="['insurance','insuranceNumber']">
                  <InputFields
                  :placeholderData="$t('patient.onboarding.insuranceNumber')"
                  v-model:value="state.formData.insurance.insuranceNumber"
                  :max="20"

                  />
              <ErrorMessage v-if="error" :name="error?.insurance?.insuranceNumber ? error?.insurance?.insuranceNumber[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.insuranceName')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" :name="['insurance','insuranceNameId']"
                >
                <SelectBox  v-model:value="state.formData.insurance.insuranceNameId"
                    :placeholderData="$t('patient.onboarding.insuranceName')"
                    :globalCode="store.state.common.insuranceName" :maxLength="12" :maxtag="4"
                    :notFoundContent="true"
                    @onSearch="search"
                />
                <ErrorMessage v-if="error" :name="error?.insurance?.insuranceName ? error?.insurance?.insuranceName[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.startDate')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" :name="['insurance','startDate']">
                  <DateField @focus="disableScroll" @blur="enableScroll" :disabledDateData="featureDate" v-model:value="state.formData.insurance.startDate" :globalDateFormat="globalDateFormat" />
                  <ErrorMessage v-if="error" :name="error?.insurance?.startDate ? error?.insurance?.startDate[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.endDate')" class="required"
                :rules="[{ required: true, message: $t('global.required') }]" :name="['insurance','endDate']"
                >
                  <DateField @focus="disableScroll" @blur="enableScroll" :disabledDateData="current => !current || current < dayjs(state.formData.insurance.startDate).subtract(0, 'day')" v-model:value="state.formData.insurance.endDate" :globalDateFormat="globalDateFormat" :disabled="state.formData.insurance.startDate == ''"/>
                  <ErrorMessage v-if="error" :name="error?.insurance?.endDate ? error?.insurance?.endDate[0] : ''" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <div class="form-heading">
                  <a-typography-title :level="3">Client</a-typography-title>
                  <a-typography-text>Assigning a client to patient</a-typography-text>
                </div>
              </a-col>
              <a-col :span="12">
              <a-form-item label="Client" class="required" name="clientId"
              :rules="[{ required: true, message: $t('global.required') }]"
              >
                  <SelectBox v-model:value="state.formData.clientId" entity="client"
                  :placeholderData="$t('patient.onboarding.client')"
                  :globalCode="store.state.clients.clientsList"
                  @change="changeClient"

                  />
                </a-form-item>
              </a-col>
              <a-col />
              <a-col :span="24">
                <div class="form-heading">
                  <a-typography-title :level="3">Referral</a-typography-title>
                  <a-typography-text>Referral  will go here</a-typography-text>
                </div>
              </a-col>
              <a-col :span="24">

                  <a-row :gutter="[48, 16]" >
                      <a-col :span="12">
                    <a-form-item :label="$t('patient.onboarding.referral')"  :name="['refferal','refferalId']"
                    :rules="[{ required: false, message: $t('global.required') }]"
                    >
                        <a-select
                          :placeholder="$t('patient.onboarding.referral')"
                          :options="[{...defaultOption},...store.state.patientsStore.referrals]"
                          @change="changeReferral"
                          v-model:value="state.formData.refferal.refferalId"
                        >
                            <template #suffixIcon>
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6L0.535898 0L7.4641 0L4 6Z" fill="#8A969F" />
                              </svg>
                            </template>
                        </a-select>
                      </a-form-item>
                  </a-col>
                  <a-col :span="12"></a-col>
                  <!-- add refference form  -->
                  <template v-if="addReferral">
                      <a-col :span="12">
                        <a-form-item
                          :label="$t('patient.onboarding.firstName')"
                          :name="['refferal', 'firstName']"
                          class="required"
                          :rules="[{ required: true, message: $t('global.required') }]"
                          :disabled="false"
                        >
                          <NameField
                            :placeholderData="$t('patient.onboarding.firstName')"
                            :disabled="false"
                            :max="20"
                            v-model:value="state.formData.refferal.firstName"
                          />
                          <ErrorMessage v-if="error" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="5" style="padding-right: 9px">
                        <a-form-item
                          :label="$t('patient.onboarding.middleName')"
                          :name="['refferal', 'middleName']"
                          :disabled="false"
                        >
                          <NameField
                            :placeholderData="$t('patient.onboarding.middleName')"
                            v-model:value="state.formData.refferal.middleName"
                            :disabled="false"
                            :max="20"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="7" style="padding-left: 9px">
                        <a-form-item
                          :label="$t('patient.onboarding.lastName')"
                          :name="['refferal', 'lastName']"
                          class="required"
                          :rules="[{ required: true, message: $t('global.required') }]"
                          :disabled="false"
                        >
                          <NameField
                            :placeholderData="$t('patient.onboarding.lastName')"
                            :disabled="false"
                            :max="20"
                            v-model:value="state.formData.refferal.lastName"
                          />
                        </a-form-item>
                      </a-col>
                          <a-col :span="12">

                            <a-form-item :label="$t('patient.onboarding.phoneNumber')" class="required" :name="['refferal','phoneNumber']"
                            :rules="[{ required: true, message: $t('global.required'), pattern: regex.phoneNumber },{...invalidPhoneNumber,message:$t('global.invalidPhoneNumber')}]"

                            >
                              <InputFields  v-maska="'###-###-####'" max="12" v-model:value="state.formData.refferal.phoneNumber"
                                :placeholderData="$t('patient.onboarding.phoneNumber')"  :disabled="typeof udid !== 'undefined' && !store.state.patientsStore.convertSystemUser" />
                              <ErrorMessage v-if="error" :name="error?.refferal?.phoneNumber ? error?.refferal?.phoneNumber[0] : ''" />
                            </a-form-item>
                          </a-col>
                          <a-col :span="12">
                            <a-form-item :label="$t('patient.onboarding.email')" class="required"
                            :rules="[{ required: true, message: $t('global.required'),type:'email' }]"
                            :name="['refferal','email']" >
                              <InputFields  v-model:value="state.formData.refferal.email"
                                :placeholderData="$t('patient.onboarding.email')"
                                :disabled="typeof udid !== 'undefined' && !store.state.patientsStore.convertSystemUser"
                                @keyup="clearRefEmail"
                                />
                              <ErrorMessage v-if="error" :name="error?.['refferal.email'] ? error?.['refferal.email'][0] : ''" />
                            </a-form-item>
                          </a-col>
                  </template>
                  </a-row>
              </a-col>
              <!-- <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.program')" class="required"
                name="programs" :rules="[{ required: true, message: $t('global.required') }]"
                >
                  <SelectBox
                    v-model:value="state.formData.programs"
                    mode="multiple"
                    @change="changeProgram"
                    :disabled="state.programLoading"
                    :placeholderData="$t('patient.onboarding.program')"
                    :globalCode="store.state.clients.clientProgramRecord" entity="programs" :maxLength="12" :maxtag="4"
                  />
                </a-form-item>
              </a-col> -->
              <!-- <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.site')" >
                  <SelectBox
                    :placeholderData="$t('patient.onboarding.site')"
                    @change="changeSite"
                    :disabled="state.siteLoading"
                    :globalCode="store.state.clients.sitesList" :maxLength="12" :maxtag="5"
                  />
                </a-form-item>
              </a-col> -->
              <!-- <a-col :span="12">
                <a-form-item :label="$t('patient.onboarding.careTeam')"  :name="['careTeam','careTeamId']"  :rules="[{ required: false, message: $t('global.required') }]">
                  <SelectBox
                      :placeholderData="$t('patient.onboarding.careTeam')"
                      v-model:value="state.formData.careTeam.careTeamId"
                      :disabled="state.careTeamLoading"
                      :globalCode="store.state.clients.careTeamListByClient" :maxLength="12" :maxtag="5"
                  />
                </a-form-item>
              </a-col> -->
              </template>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div class="drawerFooter">
        <a-button class="secondary-btn" @click="emit('hideDrawer')"> Cancel </a-button>
        <a-button class="primary-btn" html-type="submit" :loading="store.state.patientsStore.createPatient.isLoading">
          Save
        </a-button>
      </div>
    </a-form>
   </div>
</template>

<script>
import InputFields from "@/components/form-fields/InputFields.vue";
import DateField from "@/components/modals/search/DateField.vue";
import {  reactive,onMounted, watch,computed,onUnmounted ,ref,onBeforeUnmount } from "vue";
import { regex } from "@/RegularExpressions/regex";
import { useStore} from "vuex";
import {useRoute} from 'vue-router';
import SelectBox from "@/components/form-fields/SelectBox.vue";
import ErrorMessage from "@/components/common/messages/ErrorMessage";
import { globalDateFormat,dateFormatClient,numbersOnly,dobDate,featureDate,alphabetsOnly,invalidPhoneNumber,defaultOption} from '@/commonMethods/commonMethod';
import NameField from "@/components/form-fields/NameField.vue";
import Loader from './Loader.vue';
import dayjs from 'dayjs';
import {
  API_ENDPOINTS_V3,
} from "@/config/apiConfig"
import api from '@/services/api';
import { message } from 'ant-design-vue';

export default {
  components: {
    InputFields,
    DateField,
    SelectBox,
    ErrorMessage,
    NameField,
    Loader
   },
  props: {
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const formRef = ref()
    const clientId = ref("")
    const formDiv = ref(null);
    const {udid} = route.params
    const isEditLoading = ref(false)
    // const editData = ref(null);

    /** open/close dropdown menu  */
    const openDropDown = ref(true);
    const isRequired = ref(false);

    const state = reactive({
      formData:{
      primaryLanguageId:"",
      secondaryLanguageId:"",
      contactMethodId:"",
      bestTimeToCallId:"",
      height:"",
      weight:"",
      heightInCentimeter:'',
      user:{
          bitrixId:"",
          email:"",
          timeZoneId:"",
      },
      contact: {
          firstName: "",
          middleName: "",
          lastName: "",
          dob: "",
          phoneNumber: "",
          genderId: ""
      },
      address:{
          line1: "",
          line2: "",
          city: "",
          stateId: "",
          zipCode: "",

      },
      insurance:{
          insuranceNumber: "",
          insuranceNameId: "",
          startDate: "",
          endDate: "",

      },
      // programs: [],
      clientId:'',
      // careTeam: {
      //   careTeamId:"",
      //   nurseId:"",
      // },
      placeOfServiceId: "",
      snf:true,
      refferal:{
        refferalId:"",
          firstName: "",
          middleName: "",
          lastName: "",
          phoneNumber: "",
          email:""
      }

    },
    programLoading:true,
    siteLoading:true,
    careTeamLoading:true,
    });

    /** referral */
    const addReferral = ref(false);

    /** 18 year validation. */
    const dobValidation = {
       trigger: 'change',
        async validator(rule,value)
        {
            if(dayjs(value) > dayjs().subtract(18,'years'))
             return Promise.reject();
            else
              return Promise.resolve();
        }
    }

     //height convert to centemeter
     function convertToCm(inchInput) {
      var rex = /^(\d+)'(\d+)(?:''|")$/;
      var match = rex.exec(inchInput);
      var feet, inch;
      if (match) {
        feet = parseInt(match[1], 10);
        inch = parseInt(match[2], 10);
        state.formData.heightInCentimeter = (((feet * 12) + inch)*2.54).toFixed(2)
      } else {
        state.formData.heightInCentimeter=''
      }
    }

    //height convert to feet/inches
    function convertToFeet(n) {
      if(!isNaN(n) && n != ''){
        var realFeet = ((n*0.393700) / 12);
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        state.formData.height = feet +"'" + inches+'"' ;
      }else{
        state.formData.height =''
      }
    }


    const submitForm = () => {
      /** edit and create action  */
     store.dispatch("createUpdatePatient",state.formData)
    }

    const fetchPatient = async (patientId) => {
         isEditLoading.value = true;
         try {
           const {data} = await api.get(API_ENDPOINTS_V3['patient']+`/${patientId}`);

           delete data.data.vitals;
           let  editData = data.data;
          for (const key in editData)
          {
              if(typeof editData[key] === "object")
              {
                  for (const key2 in editData[key])
                  {
                    if(key2 =='dob')

                      state.formData.contact.dob  = /\d/.test(editData.contact.dob) ? dayjs(editData.contact.dob).format(globalDateFormat) : ''
                    else
                       state.formData[key][key2] = editData[key][key2]
                  }
              }else
                state.formData[key] = editData[key]

          }

          // state.formData.snf = editData.snf == "1"
          state.height = editData.heightInCentimeter != ""  ? convertToFeet(editData.heightInCentimeter) : ""
          state.formData[udid] = udid

          /** convert system user  */
          if(store.state.patientsStore.convertSystemUser)
          {
            state.formData.snf = false;
            isRequired.value = true;
          }

         } catch (error) {
            message.error('something went wrong please try again')
            emit("hideDrawer")
         }
        isEditLoading.value = false;
    }

    const createPatientCompleted  = computed(() => store.state.patientsStore.createPatient.isCompleted);
    const error = computed(() =>store.state.patientsStore.createPatient.error)
    // const editData = computed(() => store.getters.patientFormInfo)
    /** watching create api is completed for closing drawer  */
    watch(createPatientCompleted, (status) => {
      if(status) emit("hideDrawer")
    });


    onMounted(() => {
        store.dispatch("clientsList",{"filter":"?type=active"})
        store.dispatch("timeZone")
        store.dispatch('referrals');
        /** check uiid for showing edit form */
        if(typeof udid !== "undefined")
        {
          fetchPatient(udid);
        }

        /** bitrix patient details setup  */
        if (typeof udid === "undefined" && Object.keys(store.state.bitrix.patient).length > 0) {
          let bitrixData = { ...store.state.bitrix.patient };
          for (const key in bitrixData) {
            if (typeof bitrixData[key] === "object") {
              for (const key2 in bitrixData[key])
              {
                if(key2 =='dob')
                {
                  state.formData.contact.dob = typeof bitrixData.contact.dob == "number" ? dateFormatClient(bitrixData.contact.dob):'';
                }else
                 state.formData[key][key2] = bitrixData[key][key2]

              }

            } else
            {
              state.formData[key] = bitrixData[key]
            }

          }
          // state.formData.snf = false;
        }
    })

    /** this hook will reset form before closing drawer  */
    onBeforeUnmount(() => {
      // formRef.value.resetFields();
    })

    onUnmounted(() => {
        store.commit("CREATE_PATIENTS_COMPLETED", false);
        store.commit('CREATE_PATIENTS_ERROR',null)
        store.commit("convertSystemUser",false);
        store.commit('bitrixPatient',{})
        isEditLoading.value = false;
    })

    const changeClient = async id => {
      clientId.value = id;
      state.programLoading = true;
      state.formData.programs = []
      try {
         await  store.dispatch("clientProgramRecord",{id})
      // store.dispatch("careTeamListByClient",{clientId:clientId.value})
      } catch (error) {
         console.log(error)
      }

      state.programLoading = false;

    }

    const changeProgram = async () => {
      state.siteLoading = true;
      try {
       await  store.dispatch("sitesList",{clientId:clientId.value})

      } catch (error) {
        console.log(error)
      }
      state.siteLoading = false;
      }

    const changeSite = async () => {
      state.careTeamLoading = true;
       try {
         await  store.dispatch("careTeamListByClient",{clientId:clientId.value})

       } catch (error) {
           console.log(error)
       }
       state.careTeamLoading = false;
    }

    const clearEmailVal = () => {
          if(error.value != null && typeof error.value['user.email'] !== "undefined")
            error.value['user.email'] =''
    }

    const clearRefEmail = () => {

          if(error.value != null && typeof error.value['refferal.email'] !== "undefined")
           error.value['refferal.email'] =''
    }

    const search = value => {
      /** check searched value present is in list */
      let isValuePresent = store.state.common.insuranceName.find(({name}) => new RegExp(value,'i').test(name));
      if(typeof isValuePresent === 'undefined')
          state.formData.insurance.insuranceNameId = value;
    }

    /** add referral */
    const changeReferral =  referral => {
      addReferral.value = referral === "add";
    }

    const onSNFchange = e => {
      isRequired.value = e.target.checked;
      state.formData.snf = !e.target.checked
    }

    const preventScroll = e => {
      e.preventDefault();
      // e.stopPropagation();
      return false;
    }

    const enableScroll = () => {
      formDiv.value.removeEventListener('wheel',preventScroll)
    }

    const disableScroll = () => {
      formDiv.value.addEventListener('wheel',preventScroll);
    }

    return {
      formRef,
      formDiv,
      emit,
      state,
      submitForm,
      changeClient,
      changeProgram,
      changeSite,
      dateFormatClient,
      globalDateFormat,
      regex,
      store,
      udid,
      error,
      numbersOnly,
      labelCol: { span: 24 },
      convertToFeet,
      convertToCm,
      clearEmailVal,
      // editData,
      dayjs,
      dobDate,
      search,
      featureDate,
      openDropDown,
      changeReferral,
      addReferral,
      clearRefEmail,
      enableScroll,
      disableScroll,
      onSNFchange,
      alphabetsOnly,
      isRequired,
      invalidPhoneNumber,
      defaultOption,
      isEditLoading,
      dobValidation
    };
  },
};
</script>

<style lang="scss" scoped>
  .new-patient-heading {
    margin-bottom: 74px;

    .common-heading.ant-typography {
      margin-bottom: 7px;

    }
  }
</style>
