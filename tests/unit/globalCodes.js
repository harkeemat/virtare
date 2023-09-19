import { shallowMount } from '@vue/test-utils'
import Globalcode from '@/components/administration/globalCodes/Globalcode.vue'

const factory = (values = {}) => {
  return shallowMount(Globalcode, {
    data () {
      return {
        ...values
      }
    }
  })
} 


describe('Globalcode.vue', () => {
  it('does not render an error', () => {
    const wrapper = factory()
    expect(wrapper.find('.error').exists()).toBeFalsy()
  })
})
