import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiArrowUpRight, FiArrowLeft, FiUpload, FiX, FiCheckCircle } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import api from "../services/api";
import Seo from "../components/Seo";

const steps = [
  { key: "customer", label: "Customer" },
  { key: "project", label: "Project" },
  { key: "files", label: "Files & Send" },
];

const initialForm = {
  customerName: "",
  companyName: "",
  email: "",
  phone: "",
  whatsapp: "",
  product: "",
  service: "",
  quantity: "",
  material: "",
  description: "",
  projectDetails: "",
  expectedDate: "",
  address: "",
};

export default function Quote() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  // Pre-select the service if arriving from a product's "Request quote" button.
  useEffect(() => {
    const productSlug = searchParams.get("product");
    if (!productSlug || !products.length) return;
    const match = products.find((p) => p.slug === productSlug);
    if (match) setForm((f) => ({ ...f, product: match._id, service: match.name }));
  }, [searchParams, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "product") {
      const match = products.find((p) => p._id === value);
      setForm((f) => ({ ...f, product: value, service: match?.name || "" }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const validateStep = () => {
    if (step === 0) {
      if (!form.customerName || !form.email || !form.phone) {
        toast.error("Please fill in your name, email and phone.");
        return false;
      }
      if (!form.product && !form.service) {
        toast.error("Please select the service you need.");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) data.append(key, value);
      });
      data.append("source", form.product ? "product_page" : "quote_page");
      files.forEach((f) => data.append("attachments", f));

      const res = await api.post("/inquiries", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Inquiry sent successfully.");
      setDone(res.data.inquiryId);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
        <Seo title="Request Received" path="/quote" noindex />
        <FiCheckCircle size={48} className="text-red" />
        <h1 className="heading-display mt-6 text-3xl text-white">Request received.</h1>
        <p className="mt-3 text-white/55">
          Your reference is <span className="font-bold text-white">{done}</span>. Our team will review it and get
          back to you shortly.
        </p>
        <button onClick={() => navigate("/")} className="btn-outline mt-8">
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div>
      <Seo
        title="Request a Quote"
        description="Request a custom fabrication quote from FAB Engineering. Share your project details and drawings for a fast response."
        path="/quote"
      />
      <PageHeader
        eyebrow="REQUEST A QUOTE"
        heading="Let's make"
        accentLine="something real."
        text="Share the essentials and attach a drawing if you have one. We'll review your requirement and respond with the next best step."
      />

      <section className="bg-bg pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {/* Step indicator */}
          <div className="mb-10 flex items-center gap-3 border-t border-white/10 pt-8">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-3">
                <span
                  className={`text-xs font-bold uppercase tracking-wide ${
                    i === step ? "text-white" : "text-white/30"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {s.label}
                </span>
                {i < steps.length - 1 && <span className="h-px w-8 bg-white/15 sm:w-16" />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="label-field">Your name *</label>
                      <input name="customerName" value={form.customerName} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label-field">Company name</label>
                      <input name="companyName" value={form.companyName} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label-field">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label-field">Phone *</label>
                      <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label-field">WhatsApp</label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-field">Service required *</label>
                      <select name="product" value={form.product} onChange={handleChange} className="input-field">
                        <option value="">Select one</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {form.service && (
                        <p className="mt-2 text-xs text-white/40">
                          Selected service: <span className="text-white/70">{form.service}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="label-field">Quantity</label>
                      <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label-field">Material</label>
                      <input name="material" value={form.material} onChange={handleChange} className="input-field" placeholder="e.g. Mild steel, SS304" />
                    </div>
                    <div>
                      <label className="label-field">Expected date</label>
                      <input type="date" name="expectedDate" value={form.expectedDate} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                      <label className="label-field">Delivery address</label>
                      <input name="address" value={form.address} onChange={handleChange} className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-field">Description</label>
                      <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="label-field">Project details</label>
                      <textarea name="projectDetails" value={form.projectDetails} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Tolerances, finish, deadlines, anything else useful to know." />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <label className="label-field">Attach files (drawings, references)</label>
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-6 py-10 text-center hover:border-white/40">
                      <FiUpload size={22} className="text-white/40" />
                      <span className="text-sm text-white/50">PDF, JPG, PNG, DXF, DWG or ZIP — up to 5 files</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFiles}
                        accept=".pdf,.jpg,.jpeg,.png,.dxf,.dwg,.zip"
                        className="hidden"
                      />
                    </label>

                    {files.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {files.map((f, i) => (
                          <li key={i} className="flex items-center justify-between rounded-md border border-white/10 px-3 py-2 text-sm text-white/70">
                            <span className="truncate">{f.name}</span>
                            <button type="button" onClick={() => removeFile(i)} className="text-white/40 hover:text-red">
                              <FiX size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between">
              {step > 0 ? (
                <button type="button" onClick={goBack} className="btn-outline">
                  <FiArrowLeft /> Back
                </button>
              ) : (
                <span />
              )}

              {step < steps.length - 1 ? (
                <button type="button" onClick={goNext} className="btn-primary">
                  Continue <FiArrowUpRight />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Sending..." : "Send request"} <FiArrowUpRight />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
