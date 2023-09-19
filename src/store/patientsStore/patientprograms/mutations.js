import { dateFormatClient } from "@/commonMethods/commonMethod";

export default {
  /** patient programs  */
  patientLoading(state, loading) {
    state.programsLoading = loading;
  },
  patientPrograms(state, programs) {
    state.patientPrograms = [];
    /** mapping timestamp fields */
    if (typeof programs?.data != "undefined" && programs?.data?.length > 0) {
      state.patientPrograms = programs?.data.map(
        ({
          id,
          program,
          billingStartDate,
          dischargeDate,
          endDate,
          enrollmentDate,
          isActive,
        }) => ({
          id:id,
          billingStartDate:
            billingStartDate != "" && billingStartDate != "-"
              ? dateFormatClient(billingStartDate)
              : billingStartDate,
          endDate:
            endDate != "" && endDate != "-"
              ? dateFormatClient(endDate)
              : endDate,
          enrollmentDate:
            enrollmentDate != "" && enrollmentDate != "-"
              ? dateFormatClient(enrollmentDate)
              : enrollmentDate,
          dischargeDate:
            dischargeDate != "" && dischargeDate != "-"
              ? dateFormatClient(dischargeDate)
              : dischargeDate,
          program,
          status: isActive ? "Active" : "Inactive",
        })
      );
    }

    state.patientProgramsMeta = programs?.meta;
  },
  patientProgramError(state, error) {
    state.patientProgram.error = error;
  },
  patientProgramLoading(state, loading) {
    state.patientProgram.isLoading = loading;
  },
  patientProgramAdded(state, status) {
    state.patientProgramAdded = status;
  },
  PATIENTS_PROGRAMS_ASSIGN_DETAIL(state , data){
    state.patientProgramDetail = data
    state.patientProgramDetail.billingStartDate = data?.billingStartDate != "" && data?.billingStartDate != "-"? dateFormatClient(data?.billingStartDate): '',
    state.patientProgramDetail.consentedDate=data?.enrollmentDate != "" && data?.enrollmentDate != "-"
            ? dateFormatClient(data?.enrollmentDate)
            : ''
  }
};
