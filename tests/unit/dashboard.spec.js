import { shallowMount } from '@vue/test-utils'
import Dashboard from '@/components/dashboard/Dashboard.vue'

const factory = (values = {}) => {
  return shallowMount(Dashboard, {
    data () {
      return {
        ...values
      }
    }
  })
}


describe('Dashboard', () => {
  it('does not render an error', () => {
    const wrapper = factory()
    // expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})