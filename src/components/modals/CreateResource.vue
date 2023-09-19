<template>
    <a-modal width="100%" title="Add Resource" centered :footer="null">
    
           <a-row :gutter="16">
                            <a-col :span="24">
                                <h2 class="pageTittle">Create Resources</h2>
                            </a-col>
                        </a-row>
                        <a-row :gutter="24">
                            <a-col :sm="12" :xs="24">
                              <div class="form-group">
                                <label>Resource Name</label>
                                <a-input
                                  v-model:value="value1"
                                  placeholder="Enter Resource Name"
                                  style="width: 100%"
                                  size="large"
                                />
                              </div>
                            </a-col>
                            <a-col :sm="12" :xs="24">
                              <div class="form-group">
                                <label>Address</label>
                                <a-input
                                  v-model:value="value2"
                                  placeholder="Enter Address"
                                  style="width: 100%"
                                  size="large"
                                />
                              </div>
                            </a-col>
            
                            <a-col :sm="12" :xs="24">
                              <div class="form-group">
                                <label>Phone No.</label>
                                <a-input
                                  v-model:value="value3"
                                  placeholder="123456790"
                                  style="width: 100%"
                                  size="large"
                                />
                              </div>
                            </a-col>
                            <a-col :sm="12" :xs="24">
                              <div class="form-group">
                                <label>Contact Person</label>
                                <a-input
                                  v-model:value="value4"
                                  placeholder="Enter Contact Person Name"
                                  style="width: 100%"
                                  size="large"
                                />
                              </div>
                            </a-col>
            
                            <a-col :sm="24" :xs="24" class="text-right mt-25">
                              <a-button class="btn blueBtn">Save</a-button>
                            </a-col>
                          </a-row>
    </a-modal>
    
    <!--modals-->
    
    <!---->
    </template>
    
      
    <script>
    import {
        
        defineComponent
    } from "vue";
    
    export default defineComponent({
       
        setup() {
           
    
        },
    });
    </script>
    