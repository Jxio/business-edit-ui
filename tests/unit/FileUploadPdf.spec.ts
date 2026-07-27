import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import FileUploadPdf from '@/components/common/FileUploadPdf.vue'
import { DocumentTypes, FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module/'
import { LegalServices } from '@/services/'

const vuetify = new Vuetify({})

describe('FileUploadPdf - document upload', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FileUploadPdf, {
      vuetify,
      propsData: {
        businessIdentifier: 'CP1002605',
        documentType: DocumentTypes.COOP_RULES,
        entityType: CorpTypeCd.COOP,
        filingId: 111,
        filingType: FilingTypes.SPECIAL_RESOLUTION,
        userId: 'keycloak-guid'
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    wrapper.destroy()
  })

  it('uploads the file and returns the document key', async () => {
    const uploadDocument = vi.spyOn(LegalServices, 'uploadDocument').mockResolvedValue(
      { key: 'COOP-DS0100001003', documentServiceId: 'DS0100001003' }
    )

    const file = new File(['data'], 'rules.pdf', { type: 'application/pdf' })
    const key = await wrapper.vm.uploadFile(file)

    expect(uploadDocument).toHaveBeenCalledWith(file, FilingTypes.SPECIAL_RESOLUTION,
      CorpTypeCd.COOP, DocumentTypes.COOP_RULES, 'keycloak-guid', 'CP1002605', 111)
    expect(key).toBe('COOP-DS0100001003')
  })

  it('returns null and sets an error message when the upload fails', async () => {
    vi.spyOn(LegalServices, 'uploadDocument').mockRejectedValue(new Error('went wrong'))

    const file = new File(['data'], 'rules.pdf', { type: 'application/pdf' })
    const key = await wrapper.vm.uploadFile(file)

    expect(key).toBeNull()
    expect(wrapper.vm.errorMessages).toEqual(['An error occurred while uploading. Please try again.'])
  })
})
