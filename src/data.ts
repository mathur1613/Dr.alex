import { DoctorInfo, MedicalService, BlogPost, FAQ } from "./types";

// Specialty Presets
export const SPECIALTY_PRESETS: Record<string, {
  info: DoctorInfo;
  services: MedicalService[];
  blogPosts: BlogPost[];
  faqs: FAQ[];
}> = {
  Cardiology: {
    info: {
      name: "Alex Mercer",
      specialty: "Consultant Cardiologist & Vascular Specialist",
      clinicName: "Mercer Vascular & Heart Institute",
      tagline: "Precision Cardiology for a Vibrant, Healthy Life",
      qualifications: [
        "M.D. in Cardiovascular Medicine - Johns Hopkins University School of Medicine",
        "Fellowship in Interventional Cardiology - Cleveland Clinic",
        "Board Certified in Advanced Heart Failure & Transplant Cardiology",
        "B.S. in Biomedical Sciences - Stanford University"
      ],
      experience: 16,
      achievements: [
        "Awarded 'Top Cardiologist of the Year' by Medical Association (2025)",
        "Published 30+ peer-reviewed articles in the Journal of American College of Cardiology",
        "Lead Investigator for the 2024 Cardiovascular Health and Prevention Trial",
        "Chief Medical Board Advisor for Healthy Heart Foundation"
      ],
      bio: "Dr. Alex Mercer is a double board-certified cardiologist with over 16 years of clinical excellence. His practice focuses on preventative cardiovascular treatments, advanced non-invasive imaging, and customized vascular therapies. Dr. Mercer combines state-of-the-art diagnostic technology with a deep, patient-focused listening style to treat the underlying roots of cardiac health.",
      approach: "I believe that standard cardiology treats problems, but premium cardiology prevents them. My approach is rooted in understanding each patient's genetics, lifestyle, and fitness levels to design lifelong preventative heart-health plans. We work as partners to optimize your health before disease has a chance to take root.",
      address: "Suite 410, Medical Plaza Tower, 742 Evergreen Dr, San Francisco, CA 94110",
      phone: "+1 (555) 301-3000",
      email: "dr.mercer@mercerheart.com",
      workingHours: [
        "Monday - Thursday: 8:30 AM - 5:00 PM",
        "Friday: 8:30 AM - 3:00 PM",
        "Saturday: Emergencies Only",
        "Sunday: Closed"
      ],
      themeColor: "blue",
      emergencyPhone: "+1 (555) 911-HEART",
      onlineConsultation: true,
      avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop"
    },
    services: [
      {
        id: "c-1",
        title: "Comprehensive Cardiac Assessment",
        description: "An intensive evaluation of heart health including advanced physical examinations, risk profiling, and tailored preventative guidance.",
        details: ["Detailed Medical History Analysis", "Blood Pressure & Resting ECG", "Advanced Lipid Panel Analysis", "Atherosclerotic Risk Scoring"],
        price: "$150 - $220",
        iconName: "stethoscope"
      },
      {
        id: "c-2",
        title: "Diagnostic Echocardiography",
        description: "High-resolution ultrasound imaging of your heart chambers, valves, and blood flow patterns to detect structural abnormalities.",
        details: ["2D & 3D Heart Mapping", "Color Doppler Flow Studies", "Systolic & Diastolic Function Analysis", "Instant Doctor Reporting"],
        price: "$280 - $350",
        iconName: "activity"
      },
      {
        id: "c-3",
        title: "Hypertension & Vascular Care",
        description: "State-of-the-art diagnostic monitoring and therapeutic management to control high blood pressure and promote strong arterial elasticity.",
        details: ["24-Hour Ambulatory BP Monitoring", "Arterial Stiffness Analysis", "Customized Pharmacological Optimization", "Stress & Diet Reduction Therapy"],
        price: "$120 - $180",
        iconName: "activity"
      },
      {
        id: "c-4",
        title: "Preventative Cardiology Planning",
        description: "A tailored, holistic lifestyle prescription incorporating clinical nutrition, target exercise parameters, and vascular longevity assessments.",
        details: ["Vascular Age Assessment", "VO2 Max Consultation & Tracking", "Anti-inflammatory Nutritional Plans", "Continuous Behavioral Coaching"],
        price: "Included in Checkup",
        iconName: "heart"
      }
    ],
    blogPosts: [
      {
        id: "cb-1",
        title: "5 Hidden Habits that Quietly Strain Your Heart",
        excerpt: "Many factors beyond diet and basic exercise dictate cardiovascular health. Learn the five subtle daily habits you must address.",
        content: "Cardiovascular health is governed by a delicate balance of physical, psychological, and environmental inputs. While everyone knows that saturated fat and smoking harm the cardiovascular system, several silent factors often go unnoticed.\n\n1. **Chronic Micro-Stress**: Sitting in heavy traffic, persistent work deadlines, and poor screen-hygiene elevate cortisol levels. This chronic inflammation constricts blood vessels and places a persistent workload on the heart.\n\n2. **Inadequate Deep Sleep**: During deep sleep, your heart rate slows and blood pressure drops. Skipping deep sleep deprives the blood vessels of this healing, self-repair phase.\n\n3. **Dehydration and Arterial Thickening**: When you don't drink enough water, your blood volume shrinks, making blood slightly thicker. Your heart has to pump with higher pressure to move this fluid through your body.\n\n4. **Sedentary Desk Stretches**: Even if you exercise for 30 minutes at night, sitting for 8 continuous hours during the day raises arterial stiffness. Make sure to walk for 2 minutes every hour.\n\n5. **Over-relying on Sodium Preservatives**: Many 'healthy' prepared meals have extremely high levels of sodium to extend shelf-life. This increases fluid retention and raises pressure on heart walls.\n\nDr. Alex Mercer recommends checking your blood pressure at the same time each week to track trends.",
        category: "Heart Health",
        readTime: "4 min read",
        date: "2026-06-15"
      },
      {
        id: "cb-2",
        title: "Understanding Cholesterol: The Good, The Bad, and The Essential",
        excerpt: "Cholesterol is often demonized, but it is critical for cellular energy. Discover how to interpret your advanced lipid profile.",
        content: "For decades, dietary cholesterol was labeled public enemy number one. Today, modern cardiology views cholesterol through a far more nuanced lens.\n\n**LDL vs. HDL: A Better Visual Analog**\nInstead of calling LDL 'bad' and HDL 'good', think of them as transport trucks. LDL carries cholesterol molecules from the liver out to the cells to repair cell walls and create hormones. HDL acts as the garbage trucks, cleaning up excess cholesterol and carrying it back to the liver.\n\n**Why Particle Size Matters**\nNot all LDL is created equal. Large, fluffy LDL particles bounce around harmlessly in the bloodstream. Small, dense, oxidized LDL particles are the ones that easily get trapped in microscopic tears in your arterial walls, initiating plaque. This is why Dr. Mercer orders ApoB and LDL particle tests for a comprehensive vascular risk assessment.\n\n**Tips to Optimize Your Ratio**\n- **Soluble Fiber**: Oats, chia seeds, and legumes bind bile acids in the gut, forcing the liver to use circulating LDL to create more.\n- **Omega-3 Fatty Acids**: High-quality fish oil and walnuts improve arterial flexibility and lower triglycerides.",
        category: "Nutrition",
        readTime: "6 min read",
        date: "2026-06-22"
      }
    ],
    faqs: [
      {
        id: "cf-1",
        question: "When should I consult a cardiologist instead of a general physician?",
        answer: "You should see a cardiologist if you have a family history of early heart disease, feel chest discomfort, experience frequent shortness of breath, have unexplained dizzy spells, or have consistent high blood pressure that general treatments haven't resolved.",
        category: "General"
      },
      {
        id: "cf-2",
        question: "Do you accept medical insurance plans?",
        answer: "Yes, our clinic accepts major PPO insurance providers, Medicare, and several HMO plans. Please reach out to our administration with your policy number prior to your appointment for complete pre-authorization checks.",
        category: "Insurance"
      },
      {
        id: "cf-3",
        question: "What should I bring to my first heart assessment?",
        answer: "Please bring a complete list of your current medications (including dosages), any recent blood test reports, an ID card, and loose, comfortable clothing in case a treadmill stress test or ECG is performed.",
        category: "Appointments"
      }
    ]
  },

  Pediatrics: {
    info: {
      name: "Sophia Martinez",
      specialty: "Board-Certified Pediatrician & Childhood Development Specialist",
      clinicName: "Little Sprouts Pediatric Care",
      tagline: "Gentle, Expert Care for Growing Smiles and Bright Futures",
      qualifications: [
        "M.D. in Pediatric Medicine - Harvard Medical School",
        "Residency in Pediatrics - Children's Hospital of Philadelphia",
        "Fellowship in Neurodevelopmental Pediatrics - Boston Children's Hospital",
        "Member, American Academy of Pediatrics (AAP)"
      ],
      experience: 12,
      achievements: [
        "Voted 'Best Pediatrician in the Bay Area' (2024)",
        "Founder of 'Healthy Kids, Bright Futures' Community Wellness Initiative",
        "Published author of 'Nurturing Growth: A Guide to the Crucial First 5 Years'",
        "Distinguished Public Service Award for pediatric nutrition advocacy"
      ],
      bio: "Dr. Sophia Martinez has dedicated her 12-year career to providing cheerful, gentle, and comprehensive healthcare for infants, toddlers, children, and adolescents. She believes that pediatric care goes far beyond physical exams; it involves nurturing emotional wellness, tracking developmental milestones, and supporting parents with clear, sensible, and scientific guidance.",
      approach: "My clinical philosophy is that visits to the doctor should be warm, fun, and completely stress-free. I take time to connect with children on their level, using play and interactive instruments to perform exams. I focus on preventative nutrition, natural immune defense, and positive developmental habits to help every child thrive.",
      address: "Building B, Family Health Center, 120 Oakridge Way, San Francisco, CA 94121",
      phone: "+1 (555) 512-5437",
      email: "care@littlesproutspediatrics.com",
      workingHours: [
        "Monday - Friday: 8:00 AM - 4:30 PM",
        "Saturday: 9:00 AM - 12:00 PM (Acute Sick Visits)",
        "Sunday: Closed"
      ],
      themeColor: "emerald",
      emergencyPhone: "+1 (555) 512-KIDS",
      onlineConsultation: true,
      avatarUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=600&auto=format&fit=crop"
    },
    services: [
      {
        id: "p-1",
        title: "Well-Child Developmental Exams",
        description: "Comprehensive physical checkups, immunization updates, and developmental milestone charting for kids of all ages.",
        details: ["Height, Weight & Growth Percentiles", "Motor Skill & Cognitive Screening", "Immunization Tracking & Administration", "Hearing and Vision Testing"],
        price: "$95 - $140",
        iconName: "baby"
      },
      {
        id: "p-2",
        title: "Infant Care & Lactation Support",
        description: "Specialized monitoring for newborns including feeding evaluations, sleep hygiene counseling, and gentle physical checks.",
        details: ["Newborn Weight Gain Monitoring", "Feeding & Latch Assessment", "Gentle Infantile Colic Treatments", "New Parent Education & Guidance"],
        price: "$110 - $160",
        iconName: "baby"
      },
      {
        id: "p-3",
        title: "Pediatric Nutrition & Allergy Consulting",
        description: "Expert dietary evaluations to address picky eating, food intolerances, gut health, asthma, and childhood allergies.",
        details: ["Comprehensive Food Allergy Testing", "Gut Microbiome Nutritional Plans", "Healthy Childhood Growth Diet Plans", "Eczema and Asthma Management"],
        price: "$130 - $190",
        iconName: "stethoscope"
      },
      {
        id: "p-4",
        title: "Same-Day Acute Care (Sick Visits)",
        description: "Priority appointments for unexpected symptoms like fevers, earaches, coughs, rashes, or minor childhood injuries.",
        details: ["Rapid Strep, Flu & COVID Testing", "Ear Infection Diagnostics", "Gentle Nebulizer Treatments", "Instant Digital Prescriptions"],
        price: "$85 - $120",
        iconName: "stethoscope"
      }
    ],
    blogPosts: [
      {
        id: "pb-1",
        title: "The Ultimate Guide to Regulating Kids' Screen Time Comfortably",
        excerpt: "Discover research-backed tips to establish healthy screen boundaries without causing friction or stress.",
        content: "As digital devices become deeply integrated into family life, screen time is one of the most common topics parents ask about.\n\n**The Pediatric Perspective**\nExcessive high-stimulation screen time can overstimulate a child's sensory nervous system, affecting sleep, attention span, and language development. However, complete isolation is neither practical nor necessary. The key lies in creating consistent routines.\n\n1. **Establish 'Device-Free' Zones**: Designate the dinner table and bedrooms as screen-free zones. This promotes face-to-face conversation and sleep hygiene.\n\n2. **The 1-Hour Buffer Before Bed**: Exposure to blue light suppresses melatonin production. Ensure all screens are turned off at least 60 minutes before bedtime.\n\n3. **Co-viewing and Interactive Play**: Whenever possible, watch educational shows together. Turn static viewing into active conversation by asking: 'What do you think happens next?'\n\n4. **Encourage 'Green Time' to Screen Time Balance**: For every hour of screen usage, match it with an hour of active outdoor play. This stimulates motor coordination and offers valuable vitamin D.",
        category: "Lifestyle",
        readTime: "5 min read",
        date: "2026-05-18"
      },
      {
        id: "pb-2",
        title: "Strengthening Your Child's Immune System Naturally",
        excerpt: "Learn five simple, natural methods to keep your children healthy and resilient as they enter daycare and school.",
        content: "Children's immune systems are still developing, making them susceptible to minor bugs. While catching mild viruses is a natural part of building immunity, you can strengthen their natural defenses.\n\n**1. Prioritize Colorful Eating**: Introduce berries, bell peppers, carrots, and leafy greens. These foods are packed with Vitamin C, antioxidants, and bioflavonoids that protect cell walls.\n\n**2. Leverage Probiotic Gut Health**: Up to 70% of immune cells reside in the gut. Offer natural unsweetened yogurt, kefir, or kid-friendly prebiotics to support friendly gut bacteria.\n\n**3. Ensure Consistent Sleeping Hours**: Growing toddlers need 11 to 14 hours of sleep, and school-aged children need 9 to 11 hours. Sleep deprivation actively weakens cytokine production, making them prone to infections.\n\n**4. Play in the Dirt**: Sensible exposure to outdoor soil, trees, and sand exposes children to harmless microbes, training their immune systems to recognize friendly vs. hostile cells.\n\nAlways wash hands with simple warm water and soap for 20 seconds before eating, rather than relying solely on harsh alcohol gels.",
        category: "Pediatrics",
        readTime: "4 min read",
        date: "2026-06-05"
      }
    ],
    faqs: [
      {
        id: "pf-1",
        question: "What is your clinic's vaccine policy?",
        answer: "We strongly support and follow the immunization schedule recommended by the American Academy of Pediatrics (AAP) and CDC. Vaccines are the safest, most effective way to protect children against severe preventable illnesses. We are happy to discuss any concerns in a respectful, educational manner.",
        category: "General"
      },
      {
        id: "pf-2",
        question: "How do I secure a same-day urgent care spot for a sick child?",
        answer: "We reserve dedicated slots every morning for urgent sick visits. Please submit our booking form with 'Urgent Sick Visit' selected, or phone our front desk at 8:00 AM sharp to secure a morning appointment.",
        category: "Appointments"
      },
      {
        id: "pf-3",
        question: "Do you offer virtual/telehealth consultations for busy parents?",
        answer: "Yes! For non-emergency symptoms (such as mild rashes, sleep questions, behavioral counseling, or prescription refills), we offer high-definition video calls so your child can consult comfortably from home.",
        category: "Services"
      }
    ]
  },

  Dentistry: {
    info: {
      name: "Benjamin Vance",
      specialty: "Doctor of Dental Surgery & Cosmetic Biomimetic Specialist",
      clinicName: "Vance Dental Studio",
      tagline: "Minimally Invasive Dentistry for an Authentically Beautiful Smile",
      qualifications: [
        "Doctor of Dental Surgery (D.D.S.) - University of California, San Francisco (UCSF)",
        "Advanced Residency in Cosmetic Dentistry - NYU College of Dentistry",
        "Certified in Biomimetic Restorative Dentistry - Academy of Biomimetic Dentistry",
        "Member of American Academy of Cosmetic Dentistry (AACD)"
      ],
      experience: 14,
      achievements: [
        "Innovative Dentist Award for biomimetic (tooth-preserving) clinical methods",
        "Featured Speaker at the California Dental Association annual congress",
        "Completed 5,000+ successful cosmetic smile designs and restorations",
        "Recognized as a leading Bay Area dental practice for 'Ultra-Low-Radiation Diagnostics'"
      ],
      bio: "Dr. Benjamin Vance specializes in biomimetic restorative dentistry—an advanced, conservationist discipline that preserves original tooth structure and replicates nature's design. Utilizing state-of-the-art diagnostic microscopes, gentle lasers, and ceramic overlays, Dr. Vance treats tooth decay and wear comfortably while prioritizing long-term oral-body wellness.",
      approach: "My mission is to eliminate dental anxiety and preserve as much original tooth as possible. We do not jump to heavy drilling or unnecessary crowns. Instead, we use highly cohesive dental ceramics and micro-restorative techniques to restore your teeth's native flexibility, strength, and light reflection. We combine luxury comfort with exceptional clinical precision.",
      address: "100 California St, Plaza Suite A, San Francisco, CA 94111",
      phone: "+1 (555) 742-8338",
      email: "concierge@vancedentalstudio.com",
      workingHours: [
        "Tuesday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 3:00 PM (By Appointment Only)",
        "Monday & Sunday: Closed"
      ],
      themeColor: "teal",
      emergencyPhone: "+1 (555) 742-PAIN",
      onlineConsultation: false,
      avatarUrl: "https://images.unsplash.com/photo-1622960210965-7e9900117a15?q=80&w=600&auto=format&fit=crop"
    },
    services: [
      {
        id: "d-1",
        title: "Biomimetic Ceramic Restorations",
        description: "Instead of traditional crowns that destroy original tooth walls, we bond micro-thin custom ceramic onlays that rebuild native strength.",
        details: ["Conservative Decay Removal", "Tooth Structure Preservation", "Advanced Adhesion Bonding", "Natural Elasticity Matching"],
        price: "$180 - $290",
        iconName: "smile"
      },
      {
        id: "d-2",
        title: "Comprehensive Health Cleaning & Spa",
        description: "A luxury wellness scaling and polish including ultra-low radiation digital radiographs and localized microbiome health checks.",
        details: ["Ultrasonic Plaque Scaling", "Air-Flow Stain Removal", "Gum Health Pocket Measurement", "Low-Radiation Digital Radiographs"],
        price: "$110 - $160",
        iconName: "smile"
      },
      {
        id: "d-3",
        title: "Micro-Veneers & Custom Smile Design",
        description: "Ultra-thin porcelain laminates fabricated with advanced digital microscopy to restore natural luminosity, shape, and balance.",
        details: ["Photographic Smile Simulation", "Zero-to-Minimal Prep Veneers", "Artisanal Shade Matching", "Bio-Compatible Durable Ceramics"],
        price: "Consultation Required",
        iconName: "smile"
      },
      {
        id: "d-4",
        title: "Guided Gum & Periodontal Care",
        description: "Non-invasive laser therapy and personalized biome optimization to stop bleeding, promote healing, and protect teeth support structures.",
        details: ["Gentle Diode Laser Disinfection", "Salivary Pathogen Assessments", "Home Care Microbiome Protocols", "Deep Supportive Root Scaling"],
        price: "$140 - $210",
        iconName: "stethoscope"
      }
    ],
    blogPosts: [
      {
        id: "db-1",
        title: "Why Traditional Dental Crowns Can Be Premature",
        excerpt: "Discover the philosophy of Biomimetic Dentistry: why protecting original tooth structure is vital for lifetime strength.",
        content: "For decades, the standard response to a fractured or heavily decayed tooth was to grind it down into a tiny peg and cover it with a metal or porcelain crown. While this solves the immediate structure problem, it destroys up to 70% of healthy natural tooth structure.\n\n**The Biomimetic Alternative**\nBiomimetic dentistry means 'to copy nature'. Instead of aggressive drilling, we remove only the diseased tissue. We then use advanced adhesive science and dental ceramics that flex exactly like natural dentin and enamel.\n\n**The Lifetime Benefits**\n- **Reduced Root Canals**: Grinding down a tooth causes severe friction and heat, which often kills the nerve and leads to root canals years later. Tooth preservation avoids this trauma.\n- **Unmatched Longevity**: Because biomimetic restorations are bonded cohesively rather than cemented, they prevent micro-leakage and recurrent decay far more effectively.",
        category: "Dental Care",
        readTime: "5 min read",
        date: "2026-06-10"
      },
      {
        id: "db-2",
        title: "The Mouth-Body Connection: Gum Health and Heart Disease",
        excerpt: "Your mouth is the gateway to your vital systems. Learn how treating gum swelling protects your arteries and longevity.",
        content: "Many people treat dental health as separate from overall physical health. However, clinical cardiology and periodontology agree that your mouth is an active indicator of systemic health.\n\n**The Inflammatory Highway**\nChronic gum disease (periodontitis) is a continuous bacterial infection. When your gums are consistently red, swollen, and bleeding, harmful mouth bacteria can easily enter your blood capillaries.\n\nThese bacteria release toxins that promote plaque buildup in your arteries, raising the risk of heart attacks and stroke. In fact, patients with untreated gum disease are up to twice as likely to suffer from cardiovascular issues.\n\n**Simple Protective Actions**\n1. **Floss below the gumline**: Toothbrush bristles cannot reach the critical spaces between teeth where anaerobic bacteria multiply.\n2. **Avoid alcohol-based mouthwashes**: They dry your saliva, killing friendly enzymes that control bad bacteria.\n3. **Schedule ultrasonic cleanings**: Once plaque hardens into tartar, it cannot be brushed away; it must be cleared professionally.",
        category: "Preventative",
        readTime: "4 min read",
        date: "2026-06-25"
      }
    ],
    faqs: [
      {
        id: "df-1",
        question: "Does biomimetic dentistry hurt less than standard drilling?",
        answer: "Absolutely! Because we prioritize tooth conservation, we work in the outer, non-sensitive enamel and superficial dentin as much as possible. This means far less drilling, less vibration, and highly reduced post-treatment tooth sensitivity.",
        category: "General"
      },
      {
        id: "df-2",
        question: "How long do custom porcelain micro-veneers last?",
        answer: "With biomimetic bonding and proper hygiene, micro-veneers can easily last 15 to 20 years. Because we preserve the original supportive enamel layer, the bond is incredibly strong and durable.",
        category: "Services"
      },
      {
        id: "df-3",
        question: "Do you offer emergency dental treatments for pain or chips?",
        answer: "Yes, we prioritize active dental emergencies. We have a dedicated urgent line and set aside same-day appointment times for severe toothaches, chipped teeth, or lost restorations.",
        category: "Appointments"
      }
    ]
  },

  "General Medicine": {
    info: {
      name: "Marcus Reynolds",
      specialty: "Primary Care Physician & Integrative Longevity Expert",
      clinicName: "Reynolds Family Medicine & Longevity",
      tagline: "Empowering Your Wellness Journey through Science and Compassion",
      qualifications: [
        "M.D. in Family Practice - Columbia University Vagelos College of Physicians and Surgeons",
        "Residency in Family & Preventive Medicine - Mayo Clinic",
        "Board Certified in Family Medicine & Anti-Aging Medicine",
        "B.S. in Nutritional Biochemistry - Cornell University"
      ],
      experience: 20,
      achievements: [
        "Recipient of the Lifetime Achievement in Family Medicine Excellence Award",
        "Author of the wellness curriculum 'Integrative Longevity: Living to Your 100s'",
        "Successfully managed care plans for over 10,000 families in Northern California",
        "Co-Founder of the Bay Area Health and Nutrition Summit"
      ],
      bio: "Dr. Marcus Reynolds has spent two decades providing trusted, highly integrated primary care to patients of all ages. He believes in treating the whole person—blending classic clinical medicine with nutritional science, genetic diagnostics, and cardiovascular preventive care to prolong healthy lifespan (healthspan) and active longevity.",
      approach: "My mission is to shift medicine from reactive treatment to proactive longevity optimization. I sit down and understand your nutrition, physical patterns, toxic loads, and genetic risk profiles. We treat minor chronic symptoms before they turn into major disorders. Your healthspan is my ultimate metric.",
      address: "Suite 102, Wellness Center Commons, 550 Magnolia Blvd, San Francisco, CA 94107",
      phone: "+1 (555) 200-5500",
      email: "dr.reynolds@reynoldspreventive.com",
      workingHours: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 1:00 PM (By Appointment)",
        "Sunday: Closed"
      ],
      themeColor: "indigo",
      emergencyPhone: "+1 (555) 200-URGENT",
      onlineConsultation: true,
      avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop"
    },
    services: [
      {
        id: "g-1",
        title: "Comprehensive Longevity & Wellness",
        description: "Full preventive metabolic testing, blood lipid profiling, physical stamina checkups, and systemic tumor markers assessment.",
        details: ["Complete Cellular Energy Panel", "Metabolic Marker Screening", "Cardiorespiratory Fitness (VO2 Max) review", "Comprehensive Genetics Counseling"],
        price: "$160 - $250",
        iconName: "heart"
      },
      {
        id: "g-2",
        title: "Integrative Diet & Bio-Identical Therapy",
        description: "Tailored clinical nutritional prescriptions, microbiome restoration, and bio-identical metabolic optimization.",
        details: ["Micronutrient and Inflammatory Panel", "Custom Microbiome Restoration Protocol", "Hormonal & Thyroid Wellness reviews", "Sustainable Weight Management Plans"],
        price: "$140 - $190",
        iconName: "stethoscope"
      },
      {
        id: "g-3",
        title: "Chronic Condition Reversal & Control",
        description: "Targeted clinical therapy programs to reverse pre-diabetes, safely lower cholesterol, and resolve fatty liver disease.",
        details: ["Continuous Glucose Monitor (CGM) Review", "Insulin Sensitivity Optimization", "Vascular Elasticity Exercises", "Non-Pharmacological Reversal Trials"],
        price: "$130 - $200",
        iconName: "activity"
      },
      {
        id: "g-4",
        title: "Acute Illness & General Health Exams",
        description: "Quick, effective primary care visits for allergies, acute infections, physicals, vaccines, and diagnostic requests.",
        details: ["Rapid Bacterial and Viral Screening", "School, Sports and Travel Physicals", "Minor Injury & Suture management", "E-Prescriptions Sent to Your Pharmacy"],
        price: "$80 - $130",
        iconName: "stethoscope"
      }
    ],
    blogPosts: [
      {
        id: "gb-1",
        title: "The Longevity Blueprint: How to Maximize Your Healthspan",
        excerpt: "Living long is excellent, but living well is the real goal. Learn the three key pillars of clinical healthspan extension.",
        content: "In modern medicine, we have successfully extended the lifespan—how many years we live. However, we have often neglected 'healthspan'—the number of years we live free from chronic pain, fatigue, and cognitive decline.\n\n**The Three Pillars of Healthspan Extension**\n\n1. **Maintain High Insulin Sensitivity**: High blood sugar causes 'glycation', where sugars stick to protein molecules and stiffen your blood vessels, skin, and joints. Keep insulin low by walking after meals, lifting weights, and eating protein and fiber before simple carbs.\n\n2. **Build Zone 2 Aerobic Base**: Zone 2 exercise is a steady cardio pace where you can comfortably carry out a conversation but are working. It triggers the creation of new mitochondria, the energy powerhouses of your cells, keeping your cellular battery charged.\n\n3. **Enable Cellular Cleanup (Autophagy)**: Incorporating simple 14-hour overnight fasts allows your cells to digest damaged internal parts and misfolded proteins, essentially conducting a cellular clean-up.",
        category: "Lifestyle",
        readTime: "6 min read",
        date: "2026-06-20"
      },
      {
        id: "gb-2",
        title: "How Gut Microbes Guide Your Energy levels and Brain Health",
        excerpt: "Your gut has its own nervous system containing trillions of organisms. Learn how a high-fiber diet fights fatigue.",
        content: "We often think of our stomach simply as an engine that digests food. In reality, your gut is a complex ecosystem containing over 100 trillion microbial cells, deeply connected to your mood, metabolism, and immune resilience.\n\n**The Gut-Brain Connection**\nDid you know that over 90% of your body's serotonin—the hormone responsible for happiness and calm—is manufactured in your gut? The vagus nerve acts as a bidirectional superhighway, constantly sending microbial signals up to your brain.\n\n**Rebuilding Your Gut Ecosystem**\n- **Eat Diverse Fibers**: Dr. Marcus Reynolds recommends eating 30 different plant-based foods each week (including nuts, herbs, seeds, and vegetables) to feed diverse strains of gut bacteria.\n- **Limit Preservatives and Artificial Sweeteners**: They act like antibiotics, killing off friendly gut strains.\n- **Include Fermented Superfoods**: Sauerkraut, raw kimchi, and unsweetened kefir introduce rich, living bacteria strains directly into your digestive system.",
        category: "Nutrition",
        readTime: "5 min read",
        date: "2026-06-28"
      }
    ],
    faqs: [
      {
        id: "gf-1",
        question: "What is an Integrative Primary Care consultation?",
        answer: "Unlike standard rapid checkups, our Integrative Primary Care consultations combine classical clinical diagnostics with detailed nutritional mapping, cellular fitness review, stress tracking, and long-term lifespan planning.",
        category: "General"
      },
      {
        id: "gf-2",
        question: "How do I communicate with Dr. Reynolds between visits?",
        answer: "We offer a premium digital patient portal where patients can securely send short medical questions, view lab results, request prescription renewals, and receive response within 24 hours.",
        category: "Services"
      },
      {
        id: "gf-3",
        question: "What insurances or payment options do you support?",
        answer: "We accept major PPO insurance plans and Medicare. For premium longevity testing that falls outside standard insurance, we provide itemized receipts (Superbills) which you can submit to your HSA or FSA for pre-tax reimbursement.",
        category: "Insurance"
      }
    ]
  }
};

// General FAQ Preset for all types
export const CLINIC_GENERAL_FAQS: FAQ[] = [
  {
    id: "gfaq-1",
    question: "Do you offer telehealth or online consultation?",
    answer: "Yes! Many consultations, follow-ups, developmental counseling, and health results reviews can be performed via high-definition video calls directly in our system.",
    category: "Services"
  },
  {
    id: "gfaq-2",
    question: "How can I reschedule or cancel my booking?",
    answer: "We kindly request at least 24 hours' notice for cancellations. You can reschedule or cancel directly online through your booking confirmation portal, or call our clinic during working hours.",
    category: "Appointments"
  },
  {
    id: "gfaq-3",
    question: "What should I do in case of a medical emergency?",
    answer: "If you are experiencing life-threatening symptoms, chest pain, difficulty breathing, or severe sudden weakness, call emergency services (911 or your local emergency line) immediately, or proceed to the nearest emergency room. For urgent but non-life-threatening concerns, call our dedicated 24/7 clinic emergency line.",
    category: "General"
  }
];
