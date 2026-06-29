/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  Search,
  CheckCircle,
  MessageSquare,
  Shield,
  Star,
  Plus,
  AlertCircle,
  Video,
  X,
  Send,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  User,
  Activity,
  Heart,
  Baby,
  Smile,
  FileText,
  ThumbsUp,
  ExternalLink,
  Database,
  Server,
  Check,
  Key,
  RefreshCw,
  Trash2,
  LogOut,
  Lock
} from "lucide-react";
import { DoctorInfo, MedicalService, BlogPost, FAQ, Appointment, Testimonial } from "./types";
import { SPECIALTY_PRESETS, CLINIC_GENERAL_FAQS } from "./data";

export default function App() {
  // --- Branding Customization State ---
  const [selectedPreset, setSelectedPreset] = useState<string>("Cardiology");
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo>(SPECIALTY_PRESETS["Cardiology"].info);
  const [services, setServices] = useState<MedicalService[]>(SPECIALTY_PRESETS["Cardiology"].services);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(SPECIALTY_PRESETS["Cardiology"].blogPosts);
  const [faqs, setFaqs] = useState<FAQ[]>([...SPECIALTY_PRESETS["Cardiology"].faqs, ...CLINIC_GENERAL_FAQS]);
  
  // Custom form state for customization panel
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customName, setCustomName] = useState(doctorInfo.name);
  const [customSpecialty, setCustomSpecialty] = useState(doctorInfo.specialty);
  const [customClinic, setCustomClinic] = useState(doctorInfo.clinicName);
  const [customTagline, setCustomTagline] = useState(doctorInfo.tagline);
  const [customPhone, setCustomPhone] = useState(doctorInfo.phone);
  const [customEmail, setCustomEmail] = useState(doctorInfo.email);
  const [customAddress, setCustomAddress] = useState(doctorInfo.address);
  const [customColor, setCustomColor] = useState<DoctorInfo["themeColor"]>(doctorInfo.themeColor);
  const [customOnlineConsultation, setCustomOnlineConsultation] = useState(doctorInfo.onlineConsultation);

  // --- Sandbox Display State ---
  // Automatically hidden on live production environments (like Netlify) to keep things professional,
  // but shown in development (localhost / dev urls) or if "?sandbox=true" is in the address bar.
  const [showSandboxBar, setShowSandboxBar] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      // If the user has explicitly dismissed/hidden the sandbox bar, respect their choice permanently
      if (localStorage.getItem("sandbox-bar-hidden") === "true") {
        return false;
      }
      const isLocal = window.location.hostname === "localhost" || 
                      window.location.hostname === "127.0.0.1" || 
                      window.location.hostname.includes("ais-dev-");
      const hasQuery = window.location.search.includes("sandbox=true");
      return isLocal || hasQuery;
    }
    return true;
  });

  // --- Database Integration State ---
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    tableExists?: boolean;
    message: string;
    sqlSetup?: string;
  } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  // --- Patient Portal State ---
  const [bookingMode, setBookingMode] = useState<"book" | "portal">("book");
  const [portalEmailOrPhone, setPortalEmailOrPhone] = useState("");
  const [portalVerifiedUser, setPortalVerifiedUser] = useState<string | null>(null);
  const [portalAppointments, setPortalAppointments] = useState<Appointment[]>([]);
  const [isVerifyingPortal, setIsVerifyingPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [reschedulingApptId, setReschedulingApptId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isSavingReschedule, setIsSavingReschedule] = useState(false);
  const [portalSuccessMessage, setPortalSuccessMessage] = useState<string | null>(null);

  // --- Dynamic Content State ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<string>("All");
  const [faqCategory, setFaqCategory] = useState<string>("All");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // --- Interactive Form Submissions ---
  // Appointment Form
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow default
    time: "10:30",
    reason: ""
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);

  // Review / Testimonial Form
  const [reviewForm, setReviewForm] = useState({
    author: "",
    relationship: "Patient",
    rating: 5,
    comment: ""
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Contact Form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // --- Virtual Assistant Chat State ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; date: string }>>([
    {
      sender: "bot",
      text: "Hello! I am Dr. AI, your secure medical helper. I can explain symptoms, suggest lifestyle changes, or guide you on when to schedule an evaluation with our clinic. How are you feeling today?",
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // AI Daily Tip Generator
  const [dailyTipGoal, setDailyTipGoal] = useState("Energy & Sleep");
  const [customTip, setCustomTip] = useState<string>("");
  const [generatingTip, setGeneratingTip] = useState(false);

  // --- Sync with Selected Preset ---
  useEffect(() => {
    const preset = SPECIALTY_PRESETS[selectedPreset];
    if (preset) {
      setDoctorInfo(preset.info);
      setServices(preset.services);
      setBlogPosts(preset.blogPosts);
      setFaqs([...preset.faqs, ...CLINIC_GENERAL_FAQS]);
      
      // Update customization values
      setCustomName(preset.info.name);
      setCustomSpecialty(preset.info.specialty);
      setCustomClinic(preset.info.clinicName);
      setCustomTagline(preset.info.tagline);
      setCustomPhone(preset.info.phone);
      setCustomEmail(preset.info.email);
      setCustomAddress(preset.info.address);
      setCustomColor(preset.info.themeColor);
      setCustomOnlineConsultation(preset.info.onlineConsultation);
    }
  }, [selectedPreset]);

  // Load Initial Server Data
  useEffect(() => {
    fetchAppointments();
    fetchTestimonials();
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch("/api/database-status");
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.error("Error checking database status:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  // Handle Custom Branding Apply
  const applyCustomBranding = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorInfo(prev => ({
      ...prev,
      name: customName,
      specialty: customSpecialty,
      clinicName: customClinic,
      tagline: customTagline,
      phone: customPhone,
      email: customEmail,
      address: customAddress,
      themeColor: customColor,
      onlineConsultation: customOnlineConsultation
    }));
    setIsCustomizing(false);
  };

  // Save Booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.date || !bookingForm.time) {
      alert("Please fill out all required fields.");
      return;
    }
    setIsSubmittingBooking(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm)
      });
      if (res.ok) {
        const data = await res.json();
        setBookingSuccess(data.appointment);
        fetchAppointments(); // Refresh list
        fetchDbStatus(); // Refresh database connection status
        // Reset form except defaults
        setBookingForm({
          name: "",
          email: "",
          phone: "",
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          time: "10:30",
          reason: ""
        });
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // --- Patient Portal Actions ---
  const handlePortalVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalEmailOrPhone.trim()) {
      setPortalError("Please enter your email or phone number.");
      return;
    }
    setIsVerifyingPortal(true);
    setPortalError(null);
    setPortalSuccessMessage(null);
    try {
      const res = await fetch("/api/patient-portal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: portalEmailOrPhone })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPortalAppointments(data.appointments);
          setPortalVerifiedUser(portalEmailOrPhone);
          if (data.appointments.length === 0) {
            setPortalError("No upcoming or historical appointments found with these details.");
          }
        } else {
          setPortalError(data.error || "Verification failed.");
        }
      } else {
        setPortalError("Could not reach the clinical server.");
      }
    } catch (err) {
      console.error("Error verifying patient portal:", err);
      setPortalError("An unexpected connection error occurred.");
    } finally {
      setIsVerifyingPortal(false);
    }
  };

  const refreshPortalAppointments = async () => {
    if (!portalVerifiedUser) return;
    try {
      const res = await fetch("/api/patient-portal/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: portalVerifiedUser })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPortalAppointments(data.appointments);
        }
      }
    } catch (err) {
      console.error("Error refreshing portal appointments:", err);
    }
  };

  const handleRescheduleSubmit = async (apptId: string) => {
    if (!rescheduleDate || !rescheduleTime) {
      alert("Please select a date and time to reschedule.");
      return;
    }
    setIsSavingReschedule(true);
    try {
      const res = await fetch(`/api/appointments/${apptId}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: rescheduleDate, time: rescheduleTime })
      });
      if (res.ok) {
        setPortalSuccessMessage("Appointment rescheduled successfully!");
        setReschedulingApptId(null);
        setRescheduleDate("");
        setRescheduleTime("");
        refreshPortalAppointments();
        fetchAppointments(); // Refresh public live list too
      } else {
        alert("Failed to reschedule. Please try again.");
      }
    } catch (err) {
      console.error("Error rescheduling:", err);
    } finally {
      setIsSavingReschedule(false);
    }
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await fetch(`/api/appointments/${apptId}/cancel`, {
        method: "POST"
      });
      if (res.ok) {
        setPortalSuccessMessage("Appointment status updated to Cancelled.");
        refreshPortalAppointments();
        fetchAppointments();
      } else {
        alert("Failed to cancel. Please try again.");
      }
    } catch (err) {
      console.error("Error cancelling:", err);
    }
  };

  const handleDeleteAppointment = async (apptId: string) => {
    if (!confirm("Are you sure you want to completely delete this booking record? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/appointments/${apptId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setPortalSuccessMessage("Booking record deleted successfully.");
        refreshPortalAppointments();
        fetchAppointments();
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleSignOutPortal = () => {
    setPortalVerifiedUser(null);
    setPortalAppointments([]);
    setPortalEmailOrPhone("");
    setPortalError(null);
    setPortalSuccessMessage(null);
    setReschedulingApptId(null);
  };

  // Submit Testimonial

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.comment) {
      alert("Please enter your name and a brief comment.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm)
      });
      if (res.ok) {
        setReviewSuccess(true);
        fetchTestimonials(); // Refresh list
        setReviewForm({
          author: "",
          relationship: "Patient",
          rating: 5,
          comment: ""
        });
        setTimeout(() => setReviewSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Submit Contact Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setIsSubmittingContact(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
        setTimeout(() => setContactSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Error sending contact message:", err);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Send Chat message to Dr. AI
  const sendChatMessage = async (textToSend?: string) => {
    const input = textToSend || currentChatInput;
    if (!input.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: input,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setCurrentChatInput("");
    setChatLoading(true);

    try {
      const messagesPayload = chatMessages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        content: m.text
      }));
      messagesPayload.push({ role: "user", content: input });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesPayload,
          doctorInfo
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, {
          sender: "bot",
          text: data.text,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("Chat request failed");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, {
        sender: "bot",
        text: "I apologize, our secure AI system is experiencing temporary connectivity issues. For immediate support, please schedule an appointment or contact our clinical team at " + doctorInfo.phone,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Generate Personalized AI Health Tip
  const generatePersonalizedTip = async () => {
    setGeneratingTip(true);
    try {
      const userPrompt = `Give me a concise, scientifically proven 3-bullet medical wellness tip tailored specifically for my goal of "${dailyTipGoal}". Keep it highly professional and actionable.`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt }],
          doctorInfo
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCustomTip(data.text);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      setCustomTip("• Drink 3 liters of water daily to support metabolic transport.\n• Maintain 7-8 hours of continuous sleep to lower morning cortisol levels.\n• Walk outside for 10-15 minutes after major meals to optimize glucose uptake.");
    } finally {
      setGeneratingTip(false);
    }
  };

  // Theme color maps
  const colorThemeMap = {
    blue: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      primaryText: "text-blue-600",
      accentBg: "bg-blue-50 text-blue-700",
      border: "border-blue-100",
      shadow: "shadow-blue-100",
      ring: "focus:ring-blue-500",
      badge: "bg-blue-50 text-blue-700",
      svgColor: "text-blue-200",
      themeBadge: "bg-blue-100 text-blue-800",
      bgGradient: "from-blue-50 to-white",
      clinicNav: "text-blue-600 hover:text-blue-800"
    },
    emerald: {
      primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
      primaryText: "text-emerald-600",
      accentBg: "bg-emerald-50 text-emerald-700",
      border: "border-emerald-100",
      shadow: "shadow-emerald-100",
      ring: "focus:ring-emerald-500",
      badge: "bg-emerald-50 text-emerald-700",
      svgColor: "text-emerald-200",
      themeBadge: "bg-emerald-100 text-emerald-800",
      bgGradient: "from-emerald-50 to-white",
      clinicNav: "text-emerald-600 hover:text-emerald-800"
    },
    teal: {
      primary: "bg-teal-600 hover:bg-teal-700 text-white",
      primaryText: "text-teal-600",
      accentBg: "bg-teal-50 text-teal-700",
      border: "border-teal-100",
      shadow: "shadow-teal-100",
      ring: "focus:ring-teal-500",
      badge: "bg-teal-50 text-teal-700",
      svgColor: "text-teal-200",
      themeBadge: "bg-teal-100 text-teal-800",
      bgGradient: "from-teal-50 to-white",
      clinicNav: "text-teal-600 hover:text-teal-800"
    },
    indigo: {
      primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      primaryText: "text-indigo-600",
      accentBg: "bg-indigo-50 text-indigo-700",
      border: "border-indigo-100",
      shadow: "shadow-indigo-100",
      ring: "focus:ring-indigo-500",
      badge: "bg-indigo-50 text-indigo-700",
      svgColor: "text-indigo-200",
      themeBadge: "bg-indigo-100 text-indigo-800",
      bgGradient: "from-indigo-50 to-white",
      clinicNav: "text-indigo-600 hover:text-indigo-800"
    },
    sky: {
      primary: "bg-sky-600 hover:bg-sky-700 text-white",
      primaryText: "text-sky-600",
      accentBg: "bg-sky-50 text-sky-700",
      border: "border-sky-100",
      shadow: "shadow-sky-100",
      ring: "focus:ring-sky-500",
      badge: "bg-sky-50 text-sky-700",
      svgColor: "text-sky-200",
      themeBadge: "bg-sky-100 text-sky-800",
      bgGradient: "from-sky-50 to-white",
      clinicNav: "text-sky-600 hover:text-sky-800"
    }
  };

  const currentTheme = colorThemeMap[doctorInfo.themeColor] || colorThemeMap.blue;

  // Filter blog posts by category and search
  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesCategory = selectedBlogCategory === "All" || post.category === selectedBlogCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Unique categories for blog posts
  const blogCategories = ["All", "Heart Health", "Nutrition", "Lifestyle", "Pediatrics", "Preventative", "Dental Care"].filter(cat => 
    cat === "All" || blogPosts.some(post => post.category === cat)
  );

  // Filter FAQs by category
  const filteredFaqs = faqs.filter(faq => {
    return faqCategory === "All" || faq.category === faqCategory;
  });

  // Render correct Lucide icon based on metadata name
  const renderServiceIcon = (iconName: string) => {
    const props = { className: `w-6 h-6 ${currentTheme.primaryText}` };
    switch (iconName) {
      case "heart": return <Heart {...props} />;
      case "baby": return <Baby {...props} />;
      case "smile": return <Smile {...props} />;
      case "stethoscope": return <Stethoscope {...props} />;
      case "activity": return <Activity {...props} />;
      default: return <Stethoscope {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      
      {/* ========================================================= */}
      {/* 1. BRANDING CUSTOMIZER FLOATING DRAWER */}
      {/* ========================================================= */}
      {showSandboxBar && (
        <div className="bg-slate-950 text-white border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 text-slate-950 font-bold px-2.5 py-1 rounded text-xs tracking-wider uppercase">
              SANDBOX CONTROL
            </span>
            <p className="text-sm text-slate-300 font-medium">
              Toggle specialty presets or live-edit branding info to see updates!
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick Presets */}
            <div className="flex rounded-md bg-slate-900 p-0.5 border border-slate-700">
              {Object.keys(SPECIALTY_PRESETS).map((presetKey) => (
                <button
                  key={presetKey}
                  onClick={() => setSelectedPreset(presetKey)}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${
                    selectedPreset === presetKey
                      ? "bg-slate-700 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                  id={`preset-btn-${presetKey.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {presetKey}
                </button>
              ))}
            </div>

            {/* Customizer Toggle */}
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition"
              id="toggle-customizer-btn"
            >
              <Sliders className="w-3.5 h-3.5" />
              {isCustomizing ? "Close Form" : "Edit Details"}
            </button>

            {/* Hide Sandbox Bar */}
            <button
              onClick={() => {
                setShowSandboxBar(false);
                if (typeof window !== "undefined") {
                  localStorage.setItem("sandbox-bar-hidden", "true");
                }
              }}
              className="flex items-center justify-center w-7 h-7 bg-slate-900 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 rounded transition border border-slate-700 hover:border-rose-900/40"
              id="hide-sandbox-btn"
              title="Dismiss Sandbox Control Panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Customizer Panel Drawer */}
        {isCustomizing && (
          <div className="bg-slate-900 border-t border-slate-800 px-4 py-6 max-w-7xl mx-auto">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Customize Clinic Identity & Theme
            </h3>
            <form onSubmit={applyCustomBranding} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Doctor's Full Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  placeholder="e.g. Dr. Jane Foster"
                  id="customizer-name-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Specialization Label</label>
                <input
                  type="text"
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  placeholder="e.g. Integrative Cardiologist"
                  id="customizer-specialty-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Clinic Name</label>
                <input
                  type="text"
                  value={customClinic}
                  onChange={(e) => setCustomClinic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  id="customizer-clinic-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Homepage Catchy Tagline</label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  id="customizer-tagline-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Theme Color Profile</label>
                <select
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value as DoctorInfo["themeColor"])}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  id="customizer-color-select"
                >
                  <option value="blue">Blue (Calming Medical & Cardiology)</option>
                  <option value="emerald">Emerald (Children Pediatrics)</option>
                  <option value="teal">Teal (Biomimetic Dental & Ortho)</option>
                  <option value="indigo">Indigo (Preventative Family Practice)</option>
                  <option value="sky">Sky Blue (Clean Specialists Care)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Clinic Phone</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  id="customizer-phone-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Clinic Email</label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  id="customizer-email-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Video Telehealth Consultation</label>
                <div className="flex items-center mt-2.5">
                  <input
                    type="checkbox"
                    checked={customOnlineConsultation}
                    onChange={(e) => setCustomOnlineConsultation(e.target.checked)}
                    className="w-4 h-4 text-sky-500 bg-slate-800 border-slate-700 rounded focus:ring-sky-500"
                    id="customizer-consultation-checkbox"
                  />
                  <span className="ml-2 text-sm text-slate-300">Enable online consultation features</span>
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Clinic Address Location</label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                  id="customizer-address-input"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                  id="customizer-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-slate-950 font-bold rounded text-xs uppercase tracking-wider transition shadow-md"
                  id="customizer-save-btn"
                >
                  Apply Live Branding
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      )}

      {/* ========================================================= */}
      {/* 2. STICKY NAVIGATION BAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className={`w-10 h-10 ${currentTheme.primary} rounded-lg flex items-center justify-center transition shadow-lg`}>
              <Stethoscope className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-none">
                {doctorInfo.clinicName.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-tight mt-0.5 block">
                {doctorInfo.clinicName.split(" ").slice(2).join(" ") || "Family Health"}
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#services" className="hover:text-slate-900 transition">Services</a>
            <a href="#about" className="hover:text-slate-900 transition">Meet Dr. {doctorInfo.name.split(" ").pop()}</a>
            <a href="#testimonials" className="hover:text-slate-900 transition">Patient Reviews</a>
            <a href="#tips" className="hover:text-slate-900 transition">Health Tips</a>
            <a href="#faq" className="hover:text-slate-900 transition">FAQs</a>
            <a href="#contact" className="hover:text-slate-900 transition">Contact</a>
            <a 
              href="#book" 
              onClick={() => setBookingMode("portal")}
              className="text-sky-600 hover:text-sky-700 transition flex items-center gap-1 font-bold border-l pl-4 border-slate-200"
            >
              <Lock className="w-3.5 h-3.5" /> Patient Portal
            </a>
          </nav>

          {/* CTA & Telehealth */}
          <div className="flex items-center gap-4">
            {doctorInfo.onlineConsultation && (
              <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-100">
                <Video className="w-3.5 h-3.5" />
                Telehealth Ready
              </span>
            )}
            <a
              href="#book"
              onClick={() => setBookingMode("book")}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${currentTheme.primary} shadow-md`}
              id="nav-book-btn"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. DYNAMIC HERO SECTION */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold uppercase tracking-wider border border-sky-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Accepting New Patients & Consultation Requests
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {doctorInfo.tagline.split(" ").slice(0, -2).join(" ")}{" "}
              <span className={`${currentTheme.primaryText}`}>
                {doctorInfo.tagline.split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Dr. {doctorInfo.name}, {doctorInfo.specialty.split("&")[0]}, delivers patient-centered preventative medicine and state-of-the-art diagnostics tailored to your lifetime wellness journey.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#book"
                className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-xl hover:-translate-y-0.5 transition ${currentTheme.primary}`}
                id="hero-book-btn"
              >
                <Calendar className="w-4 h-4" />
                Book Clinic Visit
              </a>
              <button
                onClick={() => setChatOpen(true)}
                className="px-8 py-4 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 transition text-sm flex items-center justify-center gap-2"
                id="hero-ai-btn"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Consult Dr. AI (Virtual Helper)
              </button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{doctorInfo.experience}+ Years</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-0.5">Clinical Practice</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">12k+</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-0.5">Happy Patients</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">4.9★</div>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-0.5">Patient Rating</div>
              </div>
            </div>
          </div>

          {/* Interactive Profile Badge Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-[40px] rotate-3 transform translate-y-4`}></div>
            <div className="relative bg-white rounded-[32px] shadow-2xl overflow-hidden border-4 border-white">
              
              {/* Doctor Visual Illustration Header */}
              <div className="bg-slate-100 aspect-square relative overflow-hidden group/pic">
                {doctorInfo.avatarUrl ? (
                  <img
                    src={doctorInfo.avatarUrl}
                    alt={`Dr. ${doctorInfo.name}`}
                    className="w-full h-full object-cover transition duration-500 group-hover/pic:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-emerald-50 opacity-80 flex items-center justify-center">
                    <div className="text-center flex flex-col items-center">
                      <div className={`w-24 h-24 rounded-full ${currentTheme.accentBg} flex items-center justify-center mb-4 border border-white shadow-md`}>
                        <Stethoscope className={`w-12 h-12 ${currentTheme.primaryText}`} />
                      </div>
                      <span className="text-xs uppercase font-extrabold text-slate-500 tracking-widest block mb-1">Clinic Center</span>
                      <div className="text-xl font-bold text-slate-800">{doctorInfo.clinicName}</div>
                      <div className="text-sm font-semibold text-slate-500 mt-0.5">Premium Healthcare Specialist</div>
                    </div>
                  </div>
                )}
                
                {/* Subtle overlay for image contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-slate-200/50 flex items-center gap-3 shadow-lg z-10">
                  <Award className="w-8 h-8 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">Board Certified Specialist</span>
                    <span className="text-[10px] text-slate-500 block">Accredited Clinical Excellence</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Doctor Information Details */}
              <div className="p-6 bg-white space-y-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-extrabold text-slate-900">Dr. {doctorInfo.name}</h3>
                  <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                    Active
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  {doctorInfo.specialty}
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-xs text-slate-400 font-semibold ml-1.5">(2.4k Reviews)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. EMERGENCY & QUICK STATS BANNER */}
      {/* ========================================================= */}
      <section className="bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Urgent & Emergency Line</span>
              <p className="text-sm text-slate-300">
                Experiencing critical medical symptoms? Call emergency line or dial 911 immediately.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${doctorInfo.emergencyPhone}`}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition tracking-wide shadow"
              id="emergency-call-btn"
            >
              Emergency: {doctorInfo.emergencyPhone}
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. SERVICES SECTION */}
      {/* ========================================================= */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className={`text-xs uppercase font-extrabold tracking-widest ${currentTheme.primaryText} block`}>
              Specialist Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Innovative Clinical Procedures & Diagnostics
            </h2>
            <p className="text-slate-600 text-base">
              Providing modern, evidence-based therapies and diagnostics designed with comfortable patient interactions in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                id={`service-card-${service.id}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${currentTheme.accentBg} flex items-center justify-center mb-5 border border-white shadow-sm`}>
                    {renderServiceIcon(service.iconName)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="border-t border-slate-200/60 pt-4 mb-5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Key Offerings</span>
                    <ul className="space-y-1.5">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Cost</span>
                    <span className="text-xs font-extrabold text-slate-700">{service.price || "Free Initial"}</span>
                  </div>
                  <button
                    onClick={() => {
                      setBookingForm(prev => ({
                        ...prev,
                        reason: `Consultation: ${service.title}`
                      }));
                      const bookEl = document.getElementById("book");
                      if (bookEl) bookEl.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition flex items-center gap-1`}
                    id={`book-service-${service.id}`}
                  >
                    Select
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="mt-12 bg-blue-50/50 rounded-2xl p-5 border border-blue-100 flex flex-col sm:flex-row items-center gap-4">
            <Shield className="w-10 h-10 text-sky-600 shrink-0" />
            <div className="text-xs text-slate-600 leading-relaxed text-center sm:text-left">
              <span className="font-bold text-slate-800 block mb-0.5">Important Healthcare Notice</span>
              The services and prices listed represent estimated baseline clinical and laboratory charges. Custom consultation diagnostics depend on physical exams and personalized treatment requirements formulated during the initial doctor evaluation.
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. ABOUT THE DOCTOR SECTION */}
      {/* ========================================================= */}
      <section id="about" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Qualifications & Approach info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              {doctorInfo.avatarUrl && (
                <img
                  src={doctorInfo.avatarUrl}
                  alt={`Dr. ${doctorInfo.name}`}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md shadow-slate-200"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <span className={`text-xs uppercase font-extrabold tracking-widest ${currentTheme.primaryText} block`}>
                  Meet Your Care Partner
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Dr. {doctorInfo.name}
                </h2>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {doctorInfo.bio}
            </p>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-widest block text-emerald-600">
                Philosophy of Care
              </span>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "{doctorInfo.approach}"
              </p>
            </div>
          </div>

          {/* Education background list & professional highlights */}
          <div className="lg:col-span-7 space-y-8">
            {/* Qualifications Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Education, Fellowship & Board Certifications
              </h3>
              <div className="space-y-4">
                {doctorInfo.qualifications.map((qual, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center shrink-0 mt-0.5 border border-sky-100">
                      <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">
                      {qual}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Professional Milestones & Recognition
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctorInfo.achievements.map((ach, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-3">
                    <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600 font-semibold leading-relaxed">
                      {ach}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. INTERACTIVE APPOINTMENT BOOKING FORM */}
      {/* ========================================================= */}
      <section id="book" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className={`text-xs uppercase font-extrabold tracking-widest ${currentTheme.primaryText} block`}>
              {bookingMode === "book" ? "Simple Appointment Request" : "Access Confirmed Registrations"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {bookingMode === "book" ? "Secure Your Consult Today" : "Clinical Patient Portal"}
            </h2>
            <p className="text-slate-600 text-base">
              {bookingMode === "book" 
                ? "Fill out our simple form. Our administration team will verify details and reach out within 2 hours of submission."
                : "Manage, reschedule, or cancel your existing appointments directly. Verify your registered email or phone to proceed."
              }
            </p>
          </div>

          {/* Segmented Control Mode Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setBookingMode("book")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  bookingMode === "book"
                    ? "bg-white text-slate-950 shadow-md"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Calendar className="w-4 h-4 text-sky-500" />
                Book Consultation
              </button>
              <button
                type="button"
                onClick={() => setBookingMode("portal")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  bookingMode === "portal"
                    ? "bg-white text-sky-600 shadow-md"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Lock className="w-4 h-4 text-emerald-500" />
                Patient Portal
              </button>
            </div>
          </div>

          {bookingMode === "book" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Booking Form Card */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className={`w-5 h-5 ${currentTheme.primaryText}`} />
                Consultation Booking Form
              </h3>

              {bookingSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4" id="booking-success-banner">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Appointment Request Sent Successfully!</h4>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      Thank you, <strong className="text-slate-800">{bookingSuccess.name}</strong>. We have registered your request for <strong className="text-slate-800">{bookingSuccess.date}</strong> at <strong className="text-slate-800">{bookingSuccess.time}</strong>.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-left max-w-sm mx-auto space-y-2">
                    <div className="text-xs text-slate-500 flex justify-between"><span className="font-semibold">Patient:</span> <span>{bookingSuccess.name}</span></div>
                    <div className="text-xs text-slate-500 flex justify-between"><span className="font-semibold">Reason:</span> <span className="truncate">{bookingSuccess.reason}</span></div>
                    <div className="text-xs text-slate-500 flex justify-between"><span className="font-semibold">Status:</span> <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">{bookingSuccess.status}</span></div>
                    <div className="text-xs text-slate-500 flex justify-between"><span className="font-semibold">ID Code:</span> <span className="font-mono">{bookingSuccess.id}</span></div>
                  </div>
                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded-lg transition"
                    id="dismiss-booking-success-btn"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        id="booking-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(555) 000-0000"
                        id="booking-phone-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        id="booking-email-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Select Preferred Service / Reason *</label>
                      <select
                        value={bookingForm.reason}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="booking-reason-select"
                      >
                        <option value="">-- Choose Option --</option>
                        {services.map(s => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                        <option value="Urgent Sick Visit">Urgent Sick Visit</option>
                        <option value="General Health Consultation">General Medical Checkup</option>
                        <option value="Online Video Telehealth">Online Video Telehealth</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="booking-date-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Preferred Slot *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["09:00", "10:30", "11:15", "14:00", "15:30", "16:15"].map((timeSlot) => (
                          <button
                            key={timeSlot}
                            type="button"
                            onClick={() => setBookingForm(prev => ({ ...prev, time: timeSlot }))}
                            className={`py-2 text-xs font-bold rounded-lg border transition ${
                              bookingForm.time === timeSlot
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                            }`}
                            id={`time-slot-${timeSlot.replace(':', '-')}`}
                          >
                            {timeSlot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition uppercase ${currentTheme.primary}`}
                    id="submit-booking-form"
                  >
                    {isSubmittingBooking ? "Securing Slot..." : "Secure My Appointment Request"}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    By submitting, you agree to our patient confidentiality terms. Clinic staff will verify and call to confirm details.
                  </p>
                </form>
              )}
            </div>

            {/* In-Memory Calendar List / Active Live Queues */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold">Active Live Bookings</h3>
                    <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest">
                      Real-time Schedule
                    </span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {appointments.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No clinical reservations placed yet today.</p>
                  ) : (
                    appointments.map((appt) => (
                      <div key={appt.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700/80 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-white block">{appt.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">{appt.reason}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                            appt.status === "Confirmed"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                              : "bg-amber-950 text-amber-400 border border-amber-900"
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-700/60 pt-2">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-sky-400" /> {appt.time}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-sky-400" /> {appt.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-slate-800 p-4 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300 block">Queue Capacity Indicator</span>
                    Normal waiting times expected today. Peak hours generally fall between 1:00 PM and 3:00 PM.
                  </div>
                </div>
              </div>

              {/* Supabase Connection Status Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-sky-500" />
                    <h4 className="text-sm font-extrabold text-slate-800">Supabase Integration</h4>
                  </div>
                  {dbStatus?.connected ? (
                    dbStatus.tableExists ? (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 border border-emerald-200">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 border border-amber-200">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        TABLE NEEDED
                      </span>
                    )
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 border border-rose-200">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      OFFLINE
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <p>
                    {dbStatus?.connected 
                      ? (dbStatus.tableExists 
                          ? "Success! All clinical booking submissions are securely saved in real-time inside your Supabase project."
                          : "Connected to Supabase! However, the 'appointments' table must be created in your database schema."
                        )
                      : "Booking is running in high-speed local memory backup mode. Set up SUPABASE_URL and SUPABASE_KEY in your configuration to connect."
                    }
                  </p>
                  
                  {dbStatus?.connected && !dbStatus.tableExists && dbStatus.sqlSetup && (
                    <div className="mt-3 space-y-2 bg-slate-900 text-slate-300 rounded-2xl p-4 font-mono text-[10px] relative border border-slate-800">
                      <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2 mb-2 text-[9px] uppercase tracking-wider font-sans font-bold">
                        <span>SQL Setup Script</span>
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(dbStatus.sqlSetup || "");
                            setSqlCopied(true);
                            setTimeout(() => setSqlCopied(false), 2000);
                          }}
                          className="hover:text-white transition flex items-center gap-1 text-[9px] font-bold py-1 px-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer"
                        >
                          {sqlCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Database className="w-3 h-3 text-sky-400" />}
                          {sqlCopied ? "Copied!" : "Copy SQL Code"}
                        </button>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre leading-tight text-slate-200 select-all p-2 bg-slate-950/50 rounded-lg">{dbStatus.sqlSetup}</pre>
                      <span className="text-[10px] font-sans text-amber-300 font-medium block mt-2.5 leading-tight">
                        💡 Go to your Supabase Dashboard &gt; SQL Editor, paste the code above, and click Run.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Hours Details */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Clinical Operational Hours
                </h4>
                <div className="space-y-2.5">
                  {doctorInfo.workingHours.map((hours, idx) => {
                    const parts = hours.split(":");
                    const day = parts[0];
                    const timeRange = parts.slice(1).join(":");
                    return (
                      <div key={idx} className="flex justify-between text-xs font-medium pb-2 border-b border-slate-100 last:border-none last:pb-0">
                        <span className="text-slate-500">{day}</span>
                        <span className="text-slate-800 font-bold">{timeRange}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Patient Portal View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Portal Verification Card */}
            <div className="lg:col-span-4 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm h-fit space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-sky-500" />
                  Portal Security Panel
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Securely retrieve, reschedule, or cancel your patient appointment registrations.
                </p>
              </div>

              {portalSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3 flex items-start gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Success</p>
                    <p className="text-[11px] text-emerald-700">{portalSuccessMessage}</p>
                  </div>
                </div>
              )}

              {portalVerifiedUser === null ? (
                <form onSubmit={handlePortalVerify} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-700 uppercase">Registered Detail *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Your email or phone number"
                        value={portalEmailOrPhone}
                        onChange={(e) => setPortalEmailOrPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                      />
                      <div className="absolute left-3.5 top-3.5 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                      Enter the exact email address or mobile number you registered during booking to retrieve matching schedules.
                    </p>
                  </div>

                  {portalError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{portalError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifyingPortal}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingPortal ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Retrieving Slot...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        Verify & Access Portal
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 font-extrabold px-2 py-0.5 rounded-full inline-block">
                      SESSION ACTIVE
                    </span>
                    <h4 className="text-sm font-bold text-slate-800">Verified Credentials</h4>
                    <p className="text-xs text-slate-600 font-mono truncate">{portalVerifiedUser}</p>
                  </div>

                  <button
                    type="button"
                    onClick={refreshPortalAppointments}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh Appointments
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOutPortal}
                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-rose-200 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Disconnect Session
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Portal Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold">Upcoming Reservation Statuses</h3>
                    <span className="text-[10px] text-sky-400 font-extrabold uppercase tracking-widest">
                      Interactive clinical dashboard
                    </span>
                  </div>
                  <Lock className="w-5 h-5 text-sky-400" />
                </div>

                {portalVerifiedUser === null ? (
                  <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-200">Dashboard Locked</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Verify your phone or email credentials on the left to securely retrieve and manage your upcoming consultations.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {portalAppointments.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <p className="text-xs font-bold">No active clinical bookings discovered.</p>
                        <p className="text-[10px] text-slate-500 mt-1">Try another registration detail or switch back to book a consultation.</p>
                      </div>
                    ) : (
                      portalAppointments.map((appt) => (
                        <div key={appt.id} className="bg-slate-800 rounded-2xl p-5 border border-slate-700/80 space-y-4 animate-fadeIn">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/50 pb-3">
                            <div>
                              <span className="text-xs font-bold text-white block">{appt.name}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">ID: <span className="font-mono">{appt.id}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                                appt.status === "Confirmed"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                                  : appt.status === "Cancelled"
                                  ? "bg-rose-950 text-rose-400 border border-rose-900"
                                  : appt.status === "Rescheduled"
                                  ? "bg-sky-950 text-sky-400 border border-sky-900"
                                  : "bg-amber-950 text-amber-400 border border-amber-900"
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Scheduled Date</span>
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                                {appt.date}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Preferred Time</span>
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-sky-400" />
                                {appt.time}
                              </span>
                            </div>
                            <div className="col-span-2 sm:col-span-1 space-y-0.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Consultation Reason</span>
                              <span className="text-[11px] truncate block text-slate-400">{appt.reason}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/30">
                            {appt.status !== "Cancelled" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReschedulingApptId(appt.id);
                                    setRescheduleDate(appt.date);
                                    setRescheduleTime(appt.time);
                                  }}
                                  className="bg-slate-700 hover:bg-slate-600 text-white hover:text-sky-300 py-1.5 px-3.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  Reschedule Date/Time
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleCancelAppointment(appt.id)}
                                  className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 py-1.5 px-3.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-rose-900/40 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Cancel Booking
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteAppointment(appt.id)}
                              className="bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 py-1.5 px-3.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700/80 hover:border-rose-900/40 ml-auto cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Record
                            </button>
                          </div>

                          {/* Nested Reschedule Interface */}
                          {reschedulingApptId === appt.id && (
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mt-3 space-y-4">
                              <h5 className="text-xs font-extrabold text-white flex items-center gap-1">
                                <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                                Specify New Reservation Details
                              </h5>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Select Date</label>
                                  <input
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    className="w-full bg-slate-850 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-900"
                                    required
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Select Time Slot</label>
                                  <select
                                    value={rescheduleTime}
                                    onChange={(e) => setRescheduleTime(e.target.value)}
                                    className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-950"
                                    required
                                  >
                                    {["09:00", "10:30", "11:15", "14:00", "15:30", "16:15"].map((slot) => (
                                      <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 text-xs pt-1">
                                <button
                                  type="button"
                                  onClick={() => setReschedulingApptId(null)}
                                  className="px-3 py-1.5 text-slate-400 hover:text-white transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={isSavingReschedule}
                                  onClick={() => handleRescheduleSubmit(appt.id)}
                                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition cursor-pointer"
                                >
                                  {isSavingReschedule ? "Saving..." : "Confirm Reschedule"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>

      {/* ========================================================= */}
      {/* 8. INTERACTIVE TESTIMONIALS & REVIEWS */}
      {/* ========================================================= */}
      <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className={`text-xs uppercase font-extrabold tracking-widest ${currentTheme.primaryText} block`}>
              Verified Patient Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Compassionate Care, Proven Results
            </h2>
            <p className="text-slate-600 text-base">
              Discover stories from patients who have trusted Dr. {doctorInfo.name} with their heart, teeth, children, or family health.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews Card list */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {testimonials.map((test) => (
                  <div key={test.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between" id={`review-card-${test.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        "{test.comment}"
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-5 flex justify-between items-center text-[10px] text-slate-400">
                      <div className="flex items-center gap-3">
                        {test.avatarUrl ? (
                          <img
                            src={test.avatarUrl}
                            alt={test.author}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 font-bold text-xs">
                            {test.author.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-slate-800 block">{test.author}</span>
                          <span>{test.relationship}</span>
                        </div>
                      </div>
                      <span className="shrink-0">{test.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave a review form */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900">Submit Clinical Review</h3>
                  <p className="text-xs text-slate-500">Your experiences help other patients discover empathetic care.</p>
                </div>

                {reviewSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2 text-emerald-800" id="review-success-banner">
                    <CheckCircle className="w-8 h-8 mx-auto" />
                    <span className="text-xs font-bold block">Review Submitted!</span>
                    <p className="text-[10px]">Your feedback is now visible live on this platform.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={reviewForm.author}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="John Doe"
                        id="review-author-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Patient Relationship</label>
                      <input
                        type="text"
                        value={reviewForm.relationship}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, relationship: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Patient for 2 years"
                        id="review-relationship-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Star Rating Score</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: starVal }))}
                            className="p-1 hover:scale-110 transition"
                            id={`star-btn-${starVal}`}
                          >
                            <Star className={`w-6 h-6 ${reviewForm.rating >= starVal ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Your Feedback / Review *</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Detail your clinical care, environment comfort, and listening approach..."
                        id="review-comment-textarea"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${currentTheme.primary}`}
                      id="submit-review-btn"
                    >
                      {isSubmittingReview ? "Submitting..." : "Post Verified Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. HEALTH TIPS BLOG SECTION & AI DAILY TIP GENERATOR */}
      {/* ========================================================= */}
      <section id="tips" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className={`text-xs uppercase font-extrabold tracking-widest ${currentTheme.primaryText} block`}>
              Patient Health Awareness
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Clinical Insights & Wellness Tips
            </h2>
            <p className="text-slate-600 text-base">
              Browse professional research-based health articles, or let Dr. AI formulate a custom daily tip just for you!
            </p>
          </div>

          {/* AI Interactive Health Tip Generator Card */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white mb-16 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl translate-y-12 -translate-x-12" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dr. AI Copilot
                </span>
                <h3 className="text-2xl font-extrabold">Generate Your Personalized AI Health Tip</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Choose your active health focus. Our server-side medical assistant will compose scientific advice tailored specifically for your lifestyle.
                </p>

                <div className="space-y-3 pt-2">
                  <label className="block text-[10px] font-bold text-slate-300 uppercase">Select Focus Goal</label>
                  <div className="flex flex-wrap gap-2">
                    {["Cardiovascular Fitness", "Energy & Sleep", "Gut Biome Health", "Pediatric Resilience", "Biomimetic Oral Hygiene"].map((goal) => (
                      <button
                        key={goal}
                        onClick={() => setDailyTipGoal(goal)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          dailyTipGoal === goal
                            ? "bg-white text-slate-950 border-white font-bold"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        }`}
                        id={`goal-btn-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generatePersonalizedTip}
                  disabled={generatingTip}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                  id="generate-tip-btn"
                >
                  {generatingTip ? "Formulating Scientific Steps..." : "Compose AI Health Prescription"}
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 min-h-[220px] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-3">
                      Virtual Wellness Prescription (Formulated Live)
                    </span>
                    {customTip ? (
                      <div className="text-xs text-slate-300 space-y-2 leading-relaxed whitespace-pre-line" id="custom-tip-display">
                        {customTip}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic py-8 text-center">
                        Select a focus goal and click generate to populate customized clinical guidelines here.
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-800 pt-4 mt-4 flex justify-between items-center text-[10px] text-slate-500">
                    <span>Target Goal: <strong>{dailyTipGoal}</strong></span>
                    <span>Medical Disclaimer Applies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Article Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles (e.g. cholesterol, gut, kids, sleep)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                id="blog-search-input"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedBlogCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    selectedBlogCategory === cat
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  id={`blog-cat-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogPosts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12 col-span-2">No research articles match your selected filters.</p>
            ) : (
              filteredBlogPosts.map((post) => (
                <article key={post.id} className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between" id={`blog-post-${post.id}`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="bg-sky-50 text-sky-800 font-bold px-2.5 py-0.5 rounded uppercase border border-sky-100">
                        {post.category}
                      </span>
                      <span className="text-slate-400 font-semibold">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </div>
                  </div>
                  <div className="border-t border-slate-200/60 pt-4 mt-6 flex justify-between items-center text-[10px] text-slate-400">
                    <span>Estimated: <strong>{post.readTime}</strong></span>
                    <span className="font-semibold text-slate-500">Authored by Dr. {doctorInfo.name.split(" ").pop()}</span>
                  </div>
                </article>
              ))
            )}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. CLINIC FAQ SECTION */}
      {/* ========================================================= */}
      <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className={`text-xs uppercase font-extrabold tracking-widest ${currentTheme.primaryText} block`}>
              Patients Knowledge Center
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Explore common details regarding pricing, scheduling, pediatric wellness, dental restorations, and clinic policies.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {["All", "General", "Appointments", "Services", "Insurance"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                  faqCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
                id={`faq-cat-btn-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden" id={`faq-accordion-${faq.id}`}>
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition"
                    id={`faq-toggle-${faq.id}`}
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {faq.question}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50" id={`faq-answer-${faq.id}`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. CONTACT & LOCATION INFO SECTION */}
      {/* ========================================================= */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Quick Info & Maps */}
          <div className="lg:col-span-5 space-y-6">
            <span className={`text-xs uppercase font-extrabold tracking-widest ${currentTheme.primaryText} block`}>
              Location & Details
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Visit Dr. {doctorInfo.name.split(" ").pop()}'s Clinic
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We are situated in the heart of San Francisco. Parking is fully validated for patient visits up to two hours.
            </p>

            {/* Quick list */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs text-slate-900 block font-bold uppercase tracking-wide">Clinic Address</strong>
                  <span className="text-xs text-slate-600">{doctorInfo.address}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs text-slate-900 block font-bold uppercase tracking-wide">Phone Number</strong>
                  <a href={`tel:${doctorInfo.phone}`} className="text-xs text-blue-600 font-semibold underline">{doctorInfo.phone}</a>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs text-slate-900 block font-bold uppercase tracking-wide">Email</strong>
                  <a href={`mailto:${doctorInfo.email}`} className="text-xs text-blue-600 font-semibold underline">{doctorInfo.email}</a>
                </div>
              </div>
            </div>

            {/* Location Map mockup representation */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm aspect-video relative bg-slate-100 flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-50 to-emerald-50 opacity-90" />
              <div className="relative z-10 space-y-2">
                <MapPin className="w-8 h-8 text-red-500 mx-auto animate-bounce" />
                <span className="text-xs font-bold text-slate-800 block">Clinic HQ Medical Plaza Map Representation</span>
                <span className="text-[10px] text-slate-500 block max-w-xs mx-auto">
                  Intersection of Health Blvd and Plaza Commons, San Francisco, CA.
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(doctorInfo.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-sky-600 font-bold hover:underline"
                >
                  View on Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Drop us a Message</h3>
                <p className="text-xs text-slate-500">Got non-urgent questions about our programs, scheduling, or records transfer?</p>
              </div>

              {contactSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3" id="contact-success-banner">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">Message Dispatched Comfortably!</h4>
                  <p className="text-xs text-slate-600">Your message is securely stored. Our triage team will follow up via email.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Sarah Connor"
                        id="contact-name-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="sarah@example.com"
                        id="contact-email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="(555) 000-0000"
                      id="contact-phone-input"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">Your Message / Inquiry *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Ask about second opinions, billing transfers, or specific therapeutic routines..."
                      id="contact-message-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${currentTheme.primary}`}
                    id="submit-contact-btn"
                  >
                    {isSubmittingContact ? "Sending securely..." : "Submit Message Request"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 12. FLOATING VIRTUAL ASSISTANT BOT WIDGET */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Chat window */}
        {chatOpen && (
          <div className="bg-white w-[350px] sm:w-[400px] h-[520px] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4 transform transition-all animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Dr. AI Assistant</span>
                  <span className="text-[9px] text-slate-400">Clinic Helper & Health Tips</span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
                id="close-chat-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Medical Disclaimer Banner */}
            <div className="bg-amber-50 text-amber-900 px-3 py-2 text-[10px] leading-tight font-semibold flex items-start gap-1.5 border-b border-amber-100">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>DISCLAIMER:</strong> Virtual help is for educational info. For emergencies, call 911 or Dr. {doctorInfo.name} at {doctorInfo.phone}.
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                  }`}>
                    <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                    <span className="text-[8px] text-slate-400 text-right block mt-1">{msg.date}</span>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs text-slate-500">
                    <span className="animate-pulse">Thinking / Formulating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt presets */}
            <div className="px-3 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto">
              {selectedPreset === "Cardiology" && (
                <>
                  <button onClick={() => sendChatMessage("What are the core causes of persistent heart pressure?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">Heart pressure causes?</button>
                  <button onClick={() => sendChatMessage("How does high blood pressure harm blood vessel walls?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">BP & vessels?</button>
                </>
              )}
              {selectedPreset === "Pediatrics" && (
                <>
                  <button onClick={() => sendChatMessage("How to strengthen my infant child's immune cells?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">Infant immunity?</button>
                  <button onClick={() => sendChatMessage("What is the suggested maximum screen time for a 3 year old?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">Kids screen guidelines?</button>
                </>
              )}
              {selectedPreset === "Dentistry" && (
                <>
                  <button onClick={() => sendChatMessage("What is Biomimetic Dentistry and why preserve teeth?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">Biomimetic dental?</button>
                  <button onClick={() => sendChatMessage("Is there a connection between gum health and heart health?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">Mouth-body links?</button>
                </>
              )}
              {selectedPreset === "General Medicine" && (
                <>
                  <button onClick={() => sendChatMessage("What are the key pillars of longevity and healthspan?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">Longevity secrets?</button>
                  <button onClick={() => sendChatMessage("How do gut microbes influence my afternoon energy levels?")} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 shrink-0 font-medium">Gut & tiredness?</button>
                </>
              )}
            </div>

            {/* Footer Input */}
            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Ask Dr. AI a question..."
                value={currentChatInput}
                onChange={(e) => setCurrentChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                id="chat-message-input"
              />
              <button
                onClick={() => sendChatMessage()}
                className="w-8.5 h-8.5 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition"
                id="send-chat-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Trigger Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl transition hover:scale-105 active:scale-95"
          id="floating-chat-trigger"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="text-xs font-bold tracking-wide">Consult Dr. AI Helper</span>
        </button>

      </div>

      {/* ========================================================= */}
      {/* 13. FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-8 shrink-0">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-900 pb-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center text-white font-extrabold text-sm">
                +
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{doctorInfo.clinicName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Providing exceptional primary care, advanced diagnostics, and preventive longevity planning. We partner with families to create paths for optimized lifetime health.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Clinic Presets</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <button onClick={() => setSelectedPreset("Cardiology")} className="hover:text-white transition text-left">Cardiology (Dr. Mercer)</button>
              <button onClick={() => setSelectedPreset("Pediatrics")} className="hover:text-white transition text-left">Pediatrics (Dr. Martinez)</button>
              <button onClick={() => setSelectedPreset("Dentistry")} className="hover:text-white transition text-left">Dentistry (Dr. Vance)</button>
              <button onClick={() => setSelectedPreset("General Medicine")} className="hover:text-white transition text-left">General Practice & Longevity (Dr. Reynolds)</button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Quick Navigation</h4>
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <a href="#services" className="hover:text-white transition">Medical Services</a>
              <a href="#about" className="hover:text-white transition">Qualifications & Credentials</a>
              <a href="#book" className="hover:text-white transition">Book Appointment</a>
              <a href="#testimonials" className="hover:text-white transition">Patient Stories</a>
              <a href="#faq" className="hover:text-white transition">Frequently Asked Questions</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Administrative Notice</h4>
            <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>For records transfer requests or standard billing assistance, please communicate directly with our medical concierge.</p>
              <p className="font-semibold text-white">Direct Phone: {doctorInfo.phone}</p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 {doctorInfo.clinicName}. All Rights Reserved. HIPAA Compliant Patient Portal.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">HIPAA Guidelines</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
