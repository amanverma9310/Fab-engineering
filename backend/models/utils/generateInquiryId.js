// Generates ids like "INQ-20260912-4F2A" — sortable by date, short enough to
// read over the phone, and collision-resistant enough without a DB counter.
function generateInquiryId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INQ-${date}-${rand}`;
}

module.exports = { generateInquiryId };
