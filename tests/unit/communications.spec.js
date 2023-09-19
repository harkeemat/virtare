import { shallowMount } from '@vue/test-utils'
import Communications from '@/components/communications/Communications.vue'

const factory = (values = {}) => {
  return shallowMount(Communications, {
    data () {
      return {
        ...values
      }
    }
  })
}
 

describe('Communications.vue', () => {
  it('does not render an error', () => {
    const wrapper = factory()
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
