export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateWebsite = (website: string): boolean => {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-()]/g, ""))
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}

export interface ValidationErrors {
  firstName?: string
  lastName?: string
  email?: string
  website?: string
  company?: string
  phone?: string
  businessType?: string
}

export interface EmailGateErrors {
  email?: string
  website?: string
}

export const validateEmailGate = (data: any): EmailGateErrors => {
  const errors: EmailGateErrors = {}

  if (!validateRequired(data.email)) {
    errors.email = "Email is required"
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!validateRequired(data.website)) {
    errors.website = "Website URL is required"
  } else if (!validateWebsite(data.website)) {
    errors.website = "Please enter a valid website URL"
  }

  return errors
}

export const validateLeadForm = (data: any): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!validateRequired(data.firstName)) {
    errors.firstName = "First name is required"
  }

  if (!validateRequired(data.lastName)) {
    errors.lastName = "Last name is required"
  }

  if (!validateRequired(data.email)) {
    errors.email = "Email is required"
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  if (!validateRequired(data.company)) {
    errors.company = "Company name is required"
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = "Please enter a valid phone number"
  }

  if (!validateRequired(data.businessType)) {
    errors.businessType = "Business type is required"
  }

  return errors
}
