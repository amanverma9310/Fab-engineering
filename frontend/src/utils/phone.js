/**
 * Normalizes a phone number to E.164 format for tel: and wa.me links.
 * Strips all non-digits and ensures proper country code.
 * For Indian numbers, expects 10 digits and adds +91 prefix.
 */
export function normalizePhoneToE164(phone, defaultCountryCode = "91") {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.length === 10) {
    return `+${defaultCountryCode}${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+${defaultCountryCode}${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith(defaultCountryCode)) {
    return `+${digits}`;
  }
  if (digits.length === 13 && digits.startsWith(`+${defaultCountryCode}`)) {
    return `+${digits.slice(1)}`;
  }
  if (digits.startsWith("+")) {
    return digits;
  }
  return `+${digits}`;
}

/**
 * Formats a phone number for human-readable display.
 * Keeps spaces/formatting if present, otherwise adds basic formatting.
 */
export function formatPhoneForDisplay(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    const d = digits.slice(1);
    return `${d.slice(0, 5)} ${d.slice(5)}`;
  }
  return phone;
}

/**
 * Validates if a phone number is a plausible Indian mobile number.
 * Returns { valid: boolean, normalized: string }
 */
export function validateIndianPhone(phone) {
  if (!phone) return { valid: false, normalized: "" };
  const normalized = normalizePhoneToE164(phone);
  const digits = normalized.replace(/\D/g, "");
  const isValid = digits.length === 12 && digits.startsWith("91") && /^[6-9]\d{9}$/.test(digits.slice(2));
  return { valid: isValid, normalized };
}