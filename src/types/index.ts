// ── Invoice ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'Valid' | 'Invalid' | 'InProgress' | 'Error' | 'Submitted' | 'Processing' | ''

export interface Invoice {
  invoice_id: string
  issue_date: string
  issue_time: string
  invoice_type_code: string
  list_version_id: string
  document_currency_code: string
  tax_currency_code: string
  billing_invoice_id: string
  billing_invoice_uuid: string
  additional_doc_id: string
  supplier_additional_account_id: string
  supplier_scheme_agency_name: string
  supplier_industry_classification_code: string
  supplier_industry_name: string
  partyidentification_id_1: string
  partyidentification_id_1_scheme: string
  partyidentification_id_2: string
  partyidentification_id_2_scheme: string
  partyidentification_id_3: string
  partyidentification_id_3_scheme: string
  partyidentification_id_4: string
  partyidentification_id_4_scheme: string
  supplier_city_name: string
  supplier_postal_zone: string
  supplier_country_subentity_code: string
  supplier_address_line: string
  supplier_identificationcode: string
  supplier_country_list_id: string
  supplier_country_list_agency_id: string
  supplier_registration_name: string
  supplier_telephone: string
  supplier_email: string
  customer_city_name: string
  customer_postal_zone: string
  customer_country_subentity_code: string
  customer_address_line: string
  customer_country_code: string
  customer_country_list_id: string
  customer_country_list_agency_id: string
  customer_registration_name: string
  customer_partyidentification_id_1: string
  customer_partyidentification_id_1_scheme: string
  customer_partyidentification_id_2: string
  customer_partyidentification_id_2_scheme: string
  customer_telephone: string
  customer_email: string
  payment_terms_note: string
  tax_total_amount: number
  tax_total_currency: string
  tax_subtotal_taxable_amount: number
  tax_subtotal_taxable_currency: string
  tax_subtotal_tax_amount: number
  tax_subtotal_tax_currency: string
  tax_category_id: string
  tax_scheme_id: string
  tax_scheme_scheme_id: string
  tax_scheme_agency_id: string
  line_extension_amount: number
  line_extension_currency: string
  tax_exclusive_amount: number
  tax_exclusive_currency: string
  tax_inclusive_amount: number
  tax_inclusive_currency: string
  allowance_total_amount: number
  allowance_currency: string
  charge_total_amount: number
  charge_currency: string
  payable_rounding_amount: number
  payable_rounding_currency: string
  payable_amount: number
  payable_currency: string
  created_at: string
  QR_CODE: string
  STATUS: InvoiceStatus
  uuid: string
  e_invoice_status: string
  submissionUid: string
  e_invoice_error: string
  invoice_trx_id: string
  invoice_update_status: string
  format: string
  documenthash: string
  base64document: string
  validationerror: string
  customer_id: string
  d: string
  a: string
  b: string
}

// ── Stats ────────────────────────────────────────────────────────────────────
export interface InvoiceStats {
  total: number
  valid_count: number
  invalid_count: number
  inprogress_count: number
  error_count: number
  blank_count: number
  submitted_count?: number
  processing_count?: number
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface InvoicesResponse {
  data: Invoice[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// ── Filters ──────────────────────────────────────────────────────────────────
export interface InvoiceFilters {
  status: string
  invoiceSearch: string
  buyerSearch: string
  supplierSearch: string
  startDate: string
  endDate: string
}

// ── Toggle ───────────────────────────────────────────────────────────────────
export type InvoiceMode = 'AR' | 'AP'

// ── Schedule ─────────────────────────────────────────────────────────────────
export type ScheduleStatus = 'ongoing' | 'finished' | 'upcoming'
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom'

export interface Schedule {
  id: string
  name: string
  description: string
  customer_name: string
  customer_id: string
  invoice_type: string
  mode: InvoiceMode
  status: ScheduleStatus
  frequency: ScheduleFrequency
  start_date: string
  end_date: string
  next_run: string
  last_run: string
  total_invoices: number
  successful: number
  failed: number
  created_by: string
  created_at: string
}

export interface CreateSchedulePayload {
  name: string
  description: string
  customer_name: string
  customer_id: string
  invoice_type: string
  mode: InvoiceMode
  frequency: ScheduleFrequency
  start_date: string
  end_date: string
  custom_interval_days?: number
  notify_email?: string
}
