import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Rewrite Netlify functions path to local API path
app.use((req, res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    req.url = req.url.replace("/.netlify/functions/api", "/api");
  }
  next();
});

// Initialize Supabase client lazily
let supabaseClient: any = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (supabaseUrl && supabaseKey) {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
  }
  return supabaseClient;
}


// In-memory persistence for appointments, contact messages, and reviews
// Clients also sync these to localStorage for complete durability.
let appointments = [
  {
    id: "appt-1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-0199",
    date: "2026-07-05",
    time: "10:30",
    reason: "Annual physical and blood pressure checkup",
    status: "Confirmed",
    createdAt: new Date().toISOString()
  },
  {
    id: "appt-2",
    name: "Robert Chen",
    email: "robert.chen@example.com",
    phone: "555-0144",
    date: "2026-07-06",
    time: "14:15",
    reason: "Mild chest tightness and cholesterol monitoring",
    status: "Pending",
    createdAt: new Date().toISOString()
  }
];

let testimonials = [
  {
    id: "test-1",
    author: "Sarah Jenkins",
    relationship: "Patient for 3 years",
    rating: 5,
    comment: "The most compassionate care I have ever received. The doctor takes time to listen to my concerns and explains everything in details that are easy to understand. Highly recommend!",
    date: "2026-05-12",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "test-2",
    author: "David Vance",
    relationship: "Cardiac Patient",
    rating: 5,
    comment: "Incredible expertise and excellent bedside manner. The clinic environment is exceptionally peaceful, clean, and organized. Booking an appointment was effortless.",
    date: "2026-06-01",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "test-3",
    author: "Elena Rostova",
    relationship: "Parent of patient",
    rating: 5,
    comment: "Extremely professional, thorough, and polite. My son was very comfortable during his pediatric wellness check. Thank you for being such a wonderful doctor!",
    date: "2026-06-20",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
  }
];

let contactMessages: any[] = [];

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// API Routes

// Get all appointments
app.get("/api/appointments", async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.message && (error.message.includes("does not exist") || error.message.includes("schema cache"))) {
          console.log("Supabase info: Table 'appointments' is not yet created in the database schema. Local memory fallback is active.");
        } else {
          console.log("Supabase message:", error.message);
        }
        return res.json(appointments);
      }

      if (data) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          date: item.date,
          time: item.time,
          reason: item.reason,
          status: item.status,
          createdAt: item.created_at || item.createdAt
        }));
        return res.json(mapped);
      }
    }
  } catch (err: any) {
    console.warn("Supabase connection threw exception. Falling back to in-memory storage:", err.message || err);
  }
  res.json(appointments);
});

// Book a new appointment
app.post("/api/appointments", async (req, res) => {
  const { name, email, phone, date, time, reason } = req.body;
  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ error: "Missing required fields for booking." });
  }

  const newAppt = {
    id: `appt-${Date.now()}`,
    name,
    email,
    phone,
    date,
    time,
    reason: reason || "General Consultation",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  // Add to in-memory as backup fallback
  appointments.unshift(newAppt);

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from("appointments")
        .insert({
          id: newAppt.id,
          name: newAppt.name,
          email: newAppt.email,
          phone: newAppt.phone,
          date: newAppt.date,
          time: newAppt.time,
          reason: newAppt.reason,
          status: newAppt.status,
          created_at: newAppt.createdAt
        });

      if (error) {
        console.log("Supabase insert notice:", error.message);
        return res.status(201).json({ 
          success: true, 
          appointment: newAppt,
          warning: "Saved to local memory, but Supabase sync failed: " + error.message 
        });
      }
    }
  } catch (err: any) {
    console.log("Supabase connection details on insert:", err.message || err);
    return res.status(201).json({ 
      success: true, 
      appointment: newAppt,
      warning: "Saved to local memory, but Supabase connection failed."
    });
  }

  res.status(201).json({ success: true, appointment: newAppt });
});

// Update appointment status
app.patch("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      status: status || appointments[index].status
    };
  }

  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from("appointments")
        .update({ status: status })
        .eq("id", id);

      if (error) {
        console.log("Supabase update notice:", error.message);
      }
    }
  } catch (err: any) {
    console.log("Supabase update connection info:", err.message || err);
  }

  if (index === -1) {
    // If not found in memory, but could exist in Supabase
    return res.json({ success: true, message: "Status update processed." });
  }

  res.json({ success: true, appointment: appointments[index] });
});

// Patient Portal: Verify by email or phone and fetch all matching appointments
app.post("/api/patient-portal/verify", async (req, res) => {
  const { emailOrPhone } = req.body;
  if (!emailOrPhone) {
    return res.status(400).json({ error: "Email or phone number is required to verify." });
  }

  const queryTerm = emailOrPhone.trim().toLowerCase();

  // Try fetching from Supabase first
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      // Fetch both email equals OR phone equals
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .or(`email.ilike.${queryTerm},phone.ilike.${queryTerm}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Supabase error during portal verification:", error.message);
      } else if (data && data.length > 0) {
        const mapped = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          date: item.date,
          time: item.time,
          reason: item.reason,
          status: item.status,
          createdAt: item.created_at || item.createdAt
        }));
        return res.json({ success: true, appointments: mapped });
      }
    }
  } catch (err: any) {
    console.log("Supabase portal verification exception:", err.message || err);
  }

  // Fallback to searching in-memory appointments
  const matched = appointments.filter(
    (a) =>
      a.email.toLowerCase() === queryTerm ||
      a.phone.toLowerCase() === queryTerm ||
      a.email.toLowerCase().includes(queryTerm) ||
      a.phone.toLowerCase().includes(queryTerm)
  );

  res.json({ success: true, appointments: matched });
});

// Patient Portal: Reschedule appointment
app.patch("/api/appointments/:id/reschedule", async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ error: "Reschedule date and time are required." });
  }

  // Update in memory
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      date,
      time,
      status: "Rescheduled"
    };
  }

  // Update in Supabase
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from("appointments")
        .update({ date, time, status: "Rescheduled" })
        .eq("id", id);

      if (error) {
        console.log("Supabase error on reschedule:", error.message);
      }
    }
  } catch (err: any) {
    console.log("Supabase reschedule exception:", err.message || err);
  }

  if (index === -1) {
    return res.json({ success: true, message: "Reschedule request processed." });
  }

  res.json({ success: true, appointment: appointments[index] });
});

// Patient Portal: Cancel appointment (sets status to 'Cancelled')
app.post("/api/appointments/:id/cancel", async (req, res) => {
  const { id } = req.params;

  // Update in memory
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      status: "Cancelled"
    };
  }

  // Update in Supabase
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "Cancelled" })
        .eq("id", id);

      if (error) {
        console.log("Supabase error on cancel:", error.message);
      }
    }
  } catch (err: any) {
    console.log("Supabase cancel exception:", err.message || err);
  }

  if (index === -1) {
    return res.json({ success: true, message: "Cancellation request processed." });
  }

  res.json({ success: true, appointment: appointments[index] });
});

// Patient Portal: Delete appointment completely
app.delete("/api/appointments/:id", async (req, res) => {
  const { id } = req.params;

  // Remove from in-memory
  const index = appointments.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointments.splice(index, 1);
  }

  // Delete from Supabase
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (error) {
        console.log("Supabase error on delete:", error.message);
      }
    }
  } catch (err: any) {
    console.log("Supabase delete exception:", err.message || err);
  }

  res.json({ success: true, message: "Appointment deleted successfully." });
});


// Database Connection Status check
app.get("/api/database-status", async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.json({
      connected: false,
      message: "Supabase environment variables are missing.",
      setupInstructions: "Set SUPABASE_URL and SUPABASE_KEY in your environment."
    });
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.json({
        connected: false,
        message: "Failed to construct Supabase client."
      });
    }

    // Attempt a lightweight read on appointments table
    const { error } = await supabase.from("appointments").select("id").limit(1);

    if (error) {
      // Check if table does not exist
      if (error.code === "PGRST116" || error.message?.includes("does not exist")) {
        return res.json({
          connected: true,
          tableExists: false,
          message: "Connected to Supabase, but the 'appointments' table was not found.",
          sqlSetup: `CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`
        });
      }
      return res.json({
        connected: false,
        message: `Supabase Error: ${error.message} (Code: ${error.code})`
      });
    }

    return res.json({
      connected: true,
      tableExists: true,
      message: "Connected to Supabase. Table 'appointments' verified!"
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      message: `Database connection threw: ${err.message || String(err)}`
    });
  }
});


// Get all testimonials
app.get("/api/testimonials", (req, res) => {
  res.json(testimonials);
});

// Add a testimonial
app.post("/api/testimonials", (req, res) => {
  const { author, relationship, rating, comment } = req.body;
  if (!author || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields for testimonial." });
  }

  const avatarPool = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
  ];
  const randomAvatar = avatarPool[Math.floor(Math.random() * avatarPool.length)];

  const newTestimonial = {
    id: `test-${Date.now()}`,
    author,
    relationship: relationship || "Patient",
    rating: parseInt(rating) || 5,
    comment,
    date: new Date().toISOString().split("T")[0],
    avatarUrl: randomAvatar
  };

  testimonials.unshift(newTestimonial);
  res.status(201).json({ success: true, testimonial: newTestimonial });
});

// Submit a contact form message
app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required contact fields." });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone: phone || "Not provided",
    message,
    date: new Date().toISOString()
  };

  contactMessages.push(newMessage);
  res.status(200).json({ success: true, message: "Thank you for reaching out! We will contact you soon." });
});

// Ask Doctor AI endpoint
app.post("/api/chat", async (req, res) => {
  const { messages, doctorInfo } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  // Get current prompt message
  const userPrompt = messages[messages.length - 1]?.content;
  if (!userPrompt) {
    return res.status(400).json({ error: "Latest message content is missing." });
  }

  const systemInstruction = `You are "Dr. AI", an advanced, friendly, and compassionate virtual medical assistant representing "${doctorInfo?.clinicName || "CarePulse Clinic"}". You help patients answer general medical questions, understand potential symptoms, learn about healthy lifestyles, and direct them to schedule a formal appointment with Dr. ${doctorInfo?.name || "Alex Mercer"} (${doctorInfo?.specialty || "Cardiology & General Medicine"}).

CRITICAL SAFETY GUIDELINES:
1. ALWAYS preface clinical insights with a short, compassionate medical disclaimer stating that this is virtual advice, and they should see a doctor or dial emergency numbers for acute conditions.
2. Provide high-quality, scientifically sound, and reassuring explanations. Break complex medical terminology into clear, layman-friendly steps.
3. Suggest relevant questions they might want to ask Dr. ${doctorInfo?.name || "Alex Mercer"} during an appointment.
4. If symptoms sound urgent (e.g. severe chest pain, sudden numbness, extreme breathing difficulties), urge them to immediately call emergency services or visit the nearest emergency room.
5. Keep your tone highly professional, empathetic, warm, and structured (using bullet points and bolding for readability).
`;

  try {
    const client = getGeminiClient();
    if (!client) {
      // Return a professional mock/fallback medical assistant response if Gemini is not set up
      const mockResponses: Record<string, string> = {
        chest: `**DISCLAIMER**: I am Dr. AI, a virtual assistant, not a replacement for professional medical evaluation. If you are experiencing active chest pain, pressure, or shortness of breath, please **call emergency services (911 or your local emergency line) immediately**.

If this is a chronic concern or mild discomfort:
1. **Understand Potential Causes**: Mild chest pain can sometimes be linked to muscle strain, acid reflux, anxiety, or cardiorespiratory factors.
2. **Consult with Dr. ${doctorInfo?.name || "Mercer"}**: We highly recommend booking an evaluation. Dr. ${doctorInfo?.name} can perform an ECG, analyze blood pressure, and recommend appropriate treatment plans.
3. **What to expect**: A consultation is standard, non-invasive, and designed to give you peace of mind.

*Would you like to use our booking form above to request an appointment?*`,
        headache: `**DISCLAIMER**: I am Dr. AI, a virtual assistant. If your headache is sudden, severe (a "thunderclap" headache), accompanied by fever, stiff neck, confusion, or difficulty speaking, seek **immediate emergency medical care**.

For standard, tension, or migraine headaches:
- Ensure you are fully hydrated. Dehydration is a common trigger.
- Rest in a quiet, dark room.
- Limit screen time.
- Consider tracking triggers (stress, caffeine, sleep patterns).

To discuss persistent headaches, you can easily schedule a consultation with Dr. ${doctorInfo?.name || "Mercer"} right here on our booking page.`,
        default: `**DISCLAIMER**: I am Dr. AI, a virtual medical assistant. This information is for general educational purposes and does not constitute formal medical advice.

Thank you for your inquiry! As Dr. ${doctorInfo?.name || "Mercer"}'s assistant:
1. **We are here to help**: Please describe your symptoms or wellness questions in detail (e.g. headaches, physical fitness, nutrition, prevention).
2. **Personalized care**: Dr. ${doctorInfo?.name} specializes in **${doctorInfo?.specialty || "General Medicine"}** and treats patients with customized diagnostics and compassionate therapy.
3. **Action Steps**:
   - Stay hydrated and rest if you are feeling unwell.
   - Use our online **Appointment Book** to secure a comprehensive checkup.

How else can I assist you with health tips or booking information today?`
      };

      const promptLower = userPrompt.toLowerCase();
      let selectedResponse = mockResponses.default;
      if (promptLower.includes("chest") || promptLower.includes("heart") || promptLower.includes("cardiac")) {
        selectedResponse = mockResponses.chest;
      } else if (promptLower.includes("head") || promptLower.includes("migraine") || promptLower.includes("headache")) {
        selectedResponse = mockResponses.headache;
      }

      // Add a slight artificial delay for a realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));
      return res.json({ text: selectedResponse });
    }

    // Call Gemini 3.5 Flash using the @google/genai SDK
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "I apologize, I could not formulate a response at this time." });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to communicate with AI helper.",
      details: error.message || String(error)
    });
  }
});

// Start the server or mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

if (!process.env.NETLIFY) {
  startServer();
}

export { app };
