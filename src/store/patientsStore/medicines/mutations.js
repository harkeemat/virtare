export const medicinesList = (state, data) => {
  state.medicinesList = data?.data
  state.medicinesMeta = data?.meta ? data?.meta?.pagination : ''
}
