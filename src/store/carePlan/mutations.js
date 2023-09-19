
import {
  dateOnlyFormat,
} from '@/commonMethods/commonMethod';

export const carePlansList = async (state, carePlans) => {
  state.carePlansList = carePlans.map(carePlan => {
    carePlan.startDate = dateOnlyFormat(carePlan.startDate)
    carePlan.endDate = dateOnlyFormat(carePlan.endDate)
    return carePlan;
  })
}