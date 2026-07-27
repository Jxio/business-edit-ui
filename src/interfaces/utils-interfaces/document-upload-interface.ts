/** Response object from LegalServices.uploadDocument(). */
export interface DocumentUploadIF {
  /** File key to store in the filing, eg "COOP-DS0100001003" (legacy path: Minio key). */
  key: string
  /** DRS document service id, eg "DS0100001003" (absent on legacy path). */
  documentServiceId?: string
}
