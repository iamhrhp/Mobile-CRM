const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'src', 'i18n', 'locales');

if (!fs.existsSync(localesPath)) {
  fs.mkdirSync(localesPath, { recursive: true });
}

const translations = {
  en: {
    tabs: { dashboard: "Dashboard", users: "Users", pipeline: "Pipeline", forecast: "Forecast", insights: "Insights" },
    header: { dashboard: "Dashboard", aiLeadIntelligence: "AI Lead Intelligence", pipelineOverview: "Pipeline Overview", revenueForecast: "Revenue Forecast", clientInsights: "Client Insights", aiClientOverview: "AI Client Overview" },
    dashboard: { addNewLead: "Add New Lead", totalLeads: "Total Leads", conversionRate: "Conversion Rate", revenueGrowth: "Revenue Growth", monthlyRecurring: "Monthly Recurring Revenue", overview: "Overview" },
    users: { newLeads: "NEW LEADS", recentlyRequested: "Recently requested a proposal", interestedEnterprise: "Interested in enterprise plan", highInterest: "High Interest", mediumInterest: "Medium Interest", source: "Source", referral: "Referral", agentAdded: "Agent Added", organicSearch: "Organic Search", webinar: "Webinar", status: "Status", callScheduled: "Call Scheduled", followUpEmail: "Follow-up Email", proposalSent: "Proposal Sent", converted: "Converted", inProgress: "In Progress", closed: "Closed" },
    pipeline: { europe: "Europe", kanbanView: "Kanban View", contacted: "Contacted", marketingProposal: "Marketing Proposal", followUp: "Follow up" },
    forecast: { projection90Day: "90-Day Projection", recurringRevenue: "Recurring Revenue", newCustomers: "New Customers", closedWon: "Closed Won", increasedThisMonth: "Increased this month", week1: "Week 1", week2: "Week 2", week3: "Week 3" },
    insights: { topNewLead: "Top New Lead", newMessages: "New Messages", needsAttention: "Needs Attention", totalClients: "Total Clients", activeClients: "Active Clients", engagementVsLtv: "Engagement vs Lifetime Value", thisWeek: "This Week", allRegions: "All Regions" },
    placeholders: { addNewLead: "Add New Lead", totalLeads: "Total Leads Details", conversionRate: "Conversion Rate Details", revenueGrowth: "Revenue Growth Details", notifications: "Notifications", settings: "Settings", filterSort: "Filter & Sort" }
  },
  hi: {
    tabs: { dashboard: "डैशबोर्ड", users: "उपयोगकर्ता", pipeline: "पाइपलाइन", forecast: "पूर्वानुमान", insights: "अंतर्दृष्टि" },
    header: { dashboard: "डैशबोर्ड", aiLeadIntelligence: "एआई लीड इंटेलिजेंस", pipelineOverview: "पाइपलाइन अवलोकन", revenueForecast: "राजस्व पूर्वानुमान", clientInsights: "ग्राहक अंतर्दृष्टि", aiClientOverview: "एआई क्लाइंट अवलोकन" },
    dashboard: { addNewLead: "नया लीड जोड़ें", totalLeads: "कुल लीड्स", conversionRate: "रूपांतरण दर", revenueGrowth: "राजस्व वृद्धि", monthlyRecurring: "मासिक आवर्ती राजस्व", overview: "अवलोकन" },
    users: { newLeads: "नए लीड्स", recentlyRequested: "हाल ही में प्रस्ताव मांगा", interestedEnterprise: "एंटरप्राइज प्लान में रुचि", highInterest: "उच्च रुचि", mediumInterest: "मध्यम रुचि", source: "स्रोत", referral: "रेफरल", agentAdded: "एजेंट जोड़ा गया", organicSearch: "ऑर्गेनिक खोज", webinar: "वेबिनार", status: "स्थिति", callScheduled: "कॉल निर्धारित", followUpEmail: "फॉलो-अप ईमेल", proposalSent: "प्रस्ताव भेजा गया", converted: "रूपांतरित", inProgress: "प्रगति पर", closed: "बंद" },
    pipeline: { europe: "यूरोप", kanbanView: "कानबन दृश्य", contacted: "संपर्क किया", marketingProposal: "विपणन प्रस्ताव", followUp: "फ़ॉलो अप" },
    forecast: { projection90Day: "90-दिवसीय प्रक्षेपण", recurringRevenue: "आवर्ती राजस्व", newCustomers: "नए ग्राहक", closedWon: "बंद/जीता", increasedThisMonth: "इस महीने में वृद्धि", week1: "सप्ताह 1", week2: "सप्ताह 2", week3: "सप्ताह 3" },
    insights: { topNewLead: "शीर्ष नया लीड", newMessages: "नए संदेश", needsAttention: "ध्यान देने की आवश्यकता है" },
    placeholders: { addNewLead: "नया लीड जोड़ें", totalLeads: "कुल लीड्स विवरण", conversionRate: "रूपांतरण दर विवरण", revenueGrowth: "राजस्व वृद्धि विवरण", notifications: "सूचनाएं", settings: "सेटिंग्स", filterSort: "फ़िल्टर और सॉर्ट करें" }
  },
  te: {
    tabs: { dashboard: "డాష్‌బోర్డ్", users: "వినియోగదారులు", pipeline: "పైప్‌లైన్", forecast: "సూచన", insights: "అంతర్దృష్టులు" },
    header: { dashboard: "డాష్‌బోర్డ్", aiLeadIntelligence: "AI లీడ్ ఇంటెలిజెన్స్", pipelineOverview: "పైప్‌లైన్ అవలోకనం", revenueForecast: "ఆదాయ సూచన", clientInsights: "క్లయింట్ అంతర్దృష్టులు", aiClientOverview: "AI క్లయింట్ అవలోకనం" },
    dashboard: { addNewLead: "కొత్త లీడ్‌ను జోడించండి", totalLeads: "మొత్తం లీడ్స్", conversionRate: "మార్పిడి రేటు", revenueGrowth: "ఆదాయ వృద్ధి", monthlyRecurring: "నెలవారీ పునరావృత ఆదాయం", overview: "అవలోకనం" },
    users: { newLeads: "కొత్త లీడ్స్", recentlyRequested: "ఇటీవల ప్రతిపాదనను అభ్యర్థించారు", interestedEnterprise: "ఎంటర్‌ప్రైజ్ ప్లాన్‌లో ఆసక్తి", highInterest: "అధిక ఆసక్తి", source: "మూలం", referral: "రిఫరల్", agentAdded: "ఏజెంట్ జోడించబడ్డారు", status: "స్థితి", callScheduled: "కాల్ షెడ్యూల్ చేయబడింది", inProgress: "పురోగతిలో ఉంది", closed: "మూసివేయబడింది" },
    pipeline: { europe: "యూరప్", kanbanView: "కాన్బన్ వీక్షణ", contacted: "సంప్రదించారు", marketingProposal: "మార్కెటింగ్ ప్రతిపాదన", followUp: "ఫాలో అప్" },
    forecast: { projection90Day: "90-రోజుల అంచనా", recurringRevenue: "పునరావృత ఆదాయం", newCustomers: "కొత్త కస్టమర్‌లు", closedWon: "మూసివేయబడింది/గెలిచింది" },
    insights: { topNewLead: "టాప్ కొత్త లీడ్", newMessages: "కొత్త సందేశాలు", needsAttention: "శ్రద్ధ అవసరం" },
    placeholders: { addNewLead: "కొత్త లీడ్‌ను జోడించండి", totalLeads: "మొత్తం లీడ్స్ వివరాలు", conversionRate: "మార్పిడి రేటు వివరాలు", revenueGrowth: "ఆదాయ వృద్ధి వివరాలు", notifications: "నోటిఫికేషన్‌లు", settings: "సెట్టింగ్‌లు", filterSort: "ఫిల్టర్ & క్రమబద్ధీకరించు" }
  },
  ta: {
    tabs: { dashboard: "கட்டுப்பாட்டகம்", users: "பயனர்கள்", pipeline: "பைப்லைன்", forecast: "முன்னறிவிப்பு", insights: "நுண்ணறிவுகள்" },
    header: { dashboard: "கட்டுப்பாட்டகம்", aiLeadIntelligence: "AI முன்னணி நுண்ணறிவு", pipelineOverview: "பைப்லைன் மேலோட்டம்", revenueForecast: "வருவாய் முன்னறிவிப்பு", clientInsights: "வாடிக்கையாளர் நுண்ணறிவு", aiClientOverview: "AI வாடிக்கையாளர் மேலோட்டம்" },
    dashboard: { addNewLead: "புதிய லீட்டைச் சேர்க்கவும்", totalLeads: "மொத்த லீட்ஸ்", conversionRate: "மாற்று விகிதம்", revenueGrowth: "வருவாய் வளர்ச்சி", monthlyRecurring: "மாதாந்திர தொடர் வருவாய்", overview: "கண்ணோட்டம்" },
    users: { newLeads: "புதிய லீட்ஸ்", recentlyRequested: "சமீபத்தில் ஒரு திட்டத்தைக் கோரினார்", interestedEnterprise: "நிறுவனத் திட்டத்தில் ஆர்வம்", highInterest: "அதிக ஆர்வம்", source: "ஆதாரம்", referral: "பரிந்துரை", agentAdded: "முகவர் சேர்க்கப்பட்டார்", status: "நிலை", callScheduled: "அழைப்பு திட்டமிடப்பட்டுள்ளது", inProgress: "செயல்பாட்டில் உள்ளது", closed: "மூடப்பட்டது" },
    pipeline: { europe: "ஐரோப்பா", kanbanView: "கான்பன் பார்வை", contacted: "தொடர்பு கொள்ளப்பட்டது", marketingProposal: "சந்தைப்படுத்தல் திட்டம்", followUp: "பின்தொடர்தல்" },
    forecast: { projection90Day: "90 நாள் மதிப்பீடு", recurringRevenue: "தொடர் வருவாய்", newCustomers: "புதிய வாடிக்கையாளர்கள்", closedWon: "மூடப்பட்டது/வெற்றி" },
    insights: { topNewLead: "சிறந்த புதிய லீட்", newMessages: "புதிய செய்திகள்", needsAttention: "கவனம் தேவை" },
    placeholders: { addNewLead: "புதிய லீட்டைச் சேர்க்கவும்", totalLeads: "மொத்த லீட்ஸ் விவரங்கள்", conversionRate: "மாற்று விகித விவரங்கள்", revenueGrowth: "வருவாய் வளர்ச்சி விவரங்கள்", notifications: "அறிவிப்புகள்", settings: "அமைப்புகள்", filterSort: "வடிகட்டி & வரிசைப்படுத்து" }
  },
  gu: {
    tabs: { dashboard: "ડેશબોર્ડ", users: "વપરાશકર્તાઓ", pipeline: "પાઇપલાઇન", forecast: "આગાહી", insights: "આંતરદૃષ્ટિ" },
    header: { dashboard: "ડેશબોર્ડ", aiLeadIntelligence: "AI લીડ ઇન્ટેલિજન્સ", pipelineOverview: "પાઇપલાઇન વિહંગાવલોકન", revenueForecast: "આવકની આગાહી", clientInsights: "ગ્રાહક આંતરદૃષ્ટિ", aiClientOverview: "AI ગ્રાહક વિહંગાવલોકન" },
    dashboard: { addNewLead: "નવી લીડ ઉમેરો", totalLeads: "કુલ લીડ્સ", conversionRate: "રૂપાંતરણ દર", revenueGrowth: "આવક વૃદ્ધિ", monthlyRecurring: "માસિક રિકરિંગ આવક", overview: "વિહંગાવલોકન" },
    users: { newLeads: "નવી લીડ્સ", recentlyRequested: "તાજેતરમાં દરખાસ્તની વિનંતી કરી", interestedEnterprise: "એન્ટરપ્રાઇઝ પ્લાનમાં રસ", highInterest: "ઉચ્ચ રસ", source: "સ્ત્રોત", referral: "સંદર્ભ", agentAdded: "એજન્ટ ઉમેરાયો", status: "સ્થિતિ", callScheduled: "કોલ સુનિશ્ચિત", inProgress: "પ્રગતિમાં છે", closed: "બંધ" },
    pipeline: { europe: "યુરોપ", kanbanView: "કાનબન દૃશ્ય", contacted: "સંપર્ક કર્યો", marketingProposal: "માર્કેટિંગ દરખાસ્ત", followUp: "ફોલો અપ" },
    forecast: { projection90Day: "90-દિવસનું અનુમાન", recurringRevenue: "રિકરિંગ આવક", newCustomers: "નવા ગ્રાહકો", closedWon: "બંધ/જીત્યા" },
    insights: { topNewLead: "ટોચની નવી લીડ", newMessages: "નવા સંદેશાઓ", needsAttention: "ધ્યાન આપવાની જરૂર છે" },
    placeholders: { addNewLead: "નવી લીડ ઉમેરો", totalLeads: "કુલ લીડ્સ વિગતો", conversionRate: "રૂપાંતરણ દર વિગતો", revenueGrowth: "આવક વૃદ્ધિ વિગતો", notifications: "સૂચનાઓ", settings: "સેટિંગ્સ", filterSort: "ફિલ્ટર અને સોર્ટ કરો" }
  },
  bn: {
    tabs: { dashboard: "ড্যাশবোর্ড", users: "ব্যবহারকারী", pipeline: "পাইপলাইন", forecast: "পূর্বাভাস", insights: "অন্তর্দৃষ্টি" },
    header: { dashboard: "ড্যাশবোর্ড", aiLeadIntelligence: "এআই লিড ইন্টেলিজেন্স", pipelineOverview: "পাইপলাইন ওভারভিউ", revenueForecast: "রাজস্ব পূর্বাভাস", clientInsights: "ক্লায়েন্ট অন্তর্দৃষ্টি", aiClientOverview: "এআই ক্লায়েন্ট ওভারভিউ" },
    dashboard: { addNewLead: "নতুন লিড যোগ করুন", totalLeads: "মোট লিডস", conversionRate: "রূপান্তর হার", revenueGrowth: "রাজস্ব বৃদ্ধি", monthlyRecurring: "মাসিক পুনরাবৃত্তিমূলক রাজস্ব", overview: "ওভারভিউ" },
    users: { newLeads: "নতুন লিডস", recentlyRequested: "সম্প্রতি একটি প্রস্তাব অনুরোধ করেছেন", interestedEnterprise: "এন্টারপ্রাইজ প্ল্যানে আগ্রহী", highInterest: "উচ্চ আগ্রহ", source: "উৎস", referral: "রেফারেল", agentAdded: "এজেন্ট যোগ করা হয়েছে", status: "স্ট্যাটাস", callScheduled: "কল নির্ধারিত", inProgress: "প্রক্রিয়াধীন", closed: "বন্ধ" },
    pipeline: { europe: "ইউরোপ", kanbanView: "কানবান দৃশ্য", contacted: "যোগাযোগ করা হয়েছে", marketingProposal: "মার্কেটিং প্রস্তাব", followUp: "ফলো আপ" },
    forecast: { projection90Day: "৯০ দিনের পূর্বাভাস", recurringRevenue: "পুনরাবৃত্তিমূলক রাজস্ব", newCustomers: "নতুন গ্রাহক", closedWon: "বন্ধ/জয়ী" },
    insights: { topNewLead: "শীর্ষ নতুন লিড", newMessages: "নতুন বার্তা", needsAttention: "মনোযোগ প্রয়োজন" },
    placeholders: { addNewLead: "নতুন লিড যোগ করুন", totalLeads: "মোট লিডস বিবরণ", conversionRate: "রূপান্তর হার বিবরণ", revenueGrowth: "রাজস্ব বৃদ্ধি বিবরণ", notifications: "বিজ্ঞপ্তি", settings: "সেটিংস", filterSort: "ফিল্টার এবং সাজান" }
  },
  mr: {
    tabs: { dashboard: "डॅशबोर्ड", users: "वापरकर्ते", pipeline: "पाइपलाइन", forecast: "अंदाज", insights: "अंतर्दृष्टी" },
    header: { dashboard: "डॅशबोर्ड", aiLeadIntelligence: "एआय लीड इंटेलिजन्स", pipelineOverview: "पाइपलाइन विहंगावलोकन", revenueForecast: "महसूल अंदाज", clientInsights: "क्लायंट अंतर्दृष्टी", aiClientOverview: "एआय क्लायंट विहंगावलोकन" },
    dashboard: { addNewLead: "नवीन लीड जोडा", totalLeads: "एकूण लीड्स", conversionRate: "रूपांतरण दर", revenueGrowth: "महसूल वाढ", monthlyRecurring: "मासिक आवर्ती महसूल", overview: "विहंगावलोकन" },
    users: { newLeads: "नवीन लीड्स", recentlyRequested: "नुकतीच प्रस्तावाची विनंती केली", interestedEnterprise: "एंटरप्राइझ योजनेत स्वारस्य", highInterest: "उच्च स्वारस्य", source: "स्रोत", referral: "संदर्भ", agentAdded: "एजंट जोडला", status: "स्थिती", callScheduled: "कॉल शेड्यूल केला", inProgress: "प्रगतीपथावर", closed: "बंद" },
    pipeline: { europe: "युरोप", kanbanView: "कानबन दृश्य", contacted: "संपर्क साधला", marketingProposal: "मार्केटिंग प्रस्ताव", followUp: "फॉलो अप" },
    forecast: { projection90Day: "90-दिवसीय अंदाज", recurringRevenue: "आवर्ती महसूल", newCustomers: "नवीन ग्राहक", closedWon: "बंद/जिंकले" },
    insights: { topNewLead: "शीर्ष नवीन लीड", newMessages: "नवीन संदेश", needsAttention: "लक्ष देण्याची गरज आहे" },
    placeholders: { addNewLead: "नवीन लीड जोडा", totalLeads: "एकूण लीड्स तपशील", conversionRate: "रूपांतरण दर तपशील", revenueGrowth: "महसूल वाढ तपशील", notifications: "सूचना", settings: "सेटिंग्ज", filterSort: "फिल्टर आणि क्रमवारी लावा" }
  },
  pa: {
    tabs: { dashboard: "ਡੈਸ਼ਬੋਰਡ", users: "ਉਪਭੋਗਤਾ", pipeline: "ਪਾਈਪਲਾਈਨ", forecast: "ਭਵਿੱਖਬਾਣੀ", insights: "ਅੰਤਰਦ੍ਰਿਸ਼ਟੀ" },
    header: { dashboard: "ਡੈਸ਼ਬੋਰਡ", aiLeadIntelligence: "ਏਆਈ ਲੀਡ ਇੰਟੈਲੀਜੈਂਸ", pipelineOverview: "ਪਾਈਪਲਾਈਨ ਸੰਖੇਪ ਜਾਣਕਾਰੀ", revenueForecast: "ਮਾਲੀਆ ਭਵਿੱਖਬਾਣੀ", clientInsights: "ਗਾਹਕ ਅੰਤਰਦ੍ਰਿਸ਼ਟੀ", aiClientOverview: "ਏਆਈ ਕਲਾਇੰਟ ਸੰਖੇਪ ਜਾਣਕਾਰੀ" },
    dashboard: { addNewLead: "ਨਵਾਂ ਲੀਡ ਸ਼ਾਮਲ ਕਰੋ", totalLeads: "ਕੁੱਲ ਲੀਡਸ", conversionRate: "ਪਰਿਵਰਤਨ ਦਰ", revenueGrowth: "ਮਾਲੀਆ ਵਾਧਾ", monthlyRecurring: "ਮਾਸਿਕ ਆਵਰਤੀ ਮਾਲੀਆ", overview: "ਸੰਖੇਪ ਜਾਣਕਾਰੀ" },
    users: { newLeads: "ਨਵੇਂ ਲੀਡਸ", recentlyRequested: "ਹਾਲ ਹੀ ਵਿੱਚ ਪ੍ਰਸਤਾਵ ਦੀ ਬੇਨਤੀ ਕੀਤੀ", interestedEnterprise: "ਐਂਟਰਪ੍ਰਾਈਜ਼ ਯੋਜਨਾ ਵਿੱਚ ਦਿਲਚਸਪੀ", highInterest: "ਉੱਚ ਦਿਲਚਸਪੀ", source: "ਸਰੋਤ", referral: "ਹਵਾਲਾ", agentAdded: "ਏਜੰਟ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ", status: "ਸਥਿਤੀ", callScheduled: "ਕਾਲ ਤਹਿ ਕੀਤੀ ਗਈ", inProgress: "ਪ੍ਰਗਤੀ ਵਿੱਚ", closed: "ਬੰਦ" },
    pipeline: { europe: "ਯੂਰਪ", kanbanView: "ਕਾਨਬਨ ਦ੍ਰਿਸ਼", contacted: "ਸੰਪਰਕ ਕੀਤਾ", marketingProposal: "ਮਾਰਕੀਟਿੰਗ ਪ੍ਰਸਤਾਵ", followUp: "ਫਾਲੋ ਅਪ" },
    forecast: { projection90Day: "90-ਦਿਨ ਦਾ ਅਨੁਮਾਨ", recurringRevenue: "ਆਵਰਤੀ ਮਾਲੀਆ", newCustomers: "ਨਵੇਂ ਗਾਹਕ", closedWon: "ਬੰਦ/ਜਿੱਤਿਆ" },
    insights: { topNewLead: "ਚੋਟੀ ਦਾ ਨਵਾਂ ਲੀਡ", newMessages: "ਨਵੇਂ ਸੁਨੇਹੇ", needsAttention: "ਧਿਆਨ ਦੇਣ ਦੀ ਲੋੜ ਹੈ" },
    placeholders: { addNewLead: "ਨਵਾਂ ਲੀਡ ਸ਼ਾਮਲ ਕਰੋ", totalLeads: "ਕੁੱਲ ਲੀਡਸ ਵੇਰਵੇ", conversionRate: "ਪਰਿਵਰਤਨ ਦਰ ਵੇਰਵੇ", revenueGrowth: "ਮਾਲੀਆ ਵਾਧਾ ਵੇਰਵੇ", notifications: "ਸੂਚਨਾਵਾਂ", settings: "ਸੈਟਿੰਗਾਂ", filterSort: "ਫਿਲਟਰ ਅਤੇ ਕ੍ਰਮਬੱਧ ਕਰੋ" }
  },
  ur: {
    tabs: { dashboard: "ڈیش بورڈ", users: "صارفین", pipeline: "پائپ لائن", forecast: "پیشن گوئی", insights: "بصیرت" },
    header: { dashboard: "ڈیش بورڈ", aiLeadIntelligence: "اے آئی لیڈ انٹیلی جنس", pipelineOverview: "پائپ لائن کا جائزہ", revenueForecast: "آمدنی کی پیشن گوئی", clientInsights: "کلائنٹ کی بصیرت", aiClientOverview: "اے آئی کلائنٹ کا جائزہ" },
    dashboard: { addNewLead: "نئی لیڈ شامل کریں", totalLeads: "کل لیڈز", conversionRate: "تبادلوں کی شرح", revenueGrowth: "آمدنی میں اضافہ", monthlyRecurring: "ماہانہ بار بار آنے والی آمدنی", overview: "جائزہ" },
    users: { newLeads: "نئی لیڈز", recentlyRequested: "حال ہی میں ایک تجویز کی درخواست کی", interestedEnterprise: "انٹرپرائز پلان میں دلچسپی", highInterest: "اعلی دلچسپی", source: "ذریعہ", referral: "حوالہ", agentAdded: "ایجنٹ شامل کیا گیا", status: "حیثیت", callScheduled: "کال کا وقت مقرر", inProgress: "جاری ہے", closed: "بند" },
    pipeline: { europe: "یورپ", kanbanView: "کانبن کا منظر", contacted: "رابطہ کیا", marketingProposal: "مارکیٹنگ کی تجویز", followUp: "فالو اپ" },
    forecast: { projection90Day: "90 دن کا تخمینہ", recurringRevenue: "بار بار آنے والی آمدنی", newCustomers: "نئے گاہک", closedWon: "بند/جیت لیا" },
    insights: { topNewLead: "سب سے اوپر نئی لیڈ", newMessages: "نئے پیغامات", needsAttention: "توجہ کی ضرورت ہے" },
    placeholders: { addNewLead: "نئی لیڈ شامل کریں", totalLeads: "کل لیڈز کی تفصیلات", conversionRate: "تبادلوں کی شرح کی تفصیلات", revenueGrowth: "آمدنی میں اضافے کی تفصیلات", notifications: "اطلاعات", settings: "ترتیبات", filterSort: "فلٹر اور ترتیب دیں" }
  },
  ar: {
    tabs: { dashboard: "لوحة القيادة", users: "المستخدمين", pipeline: "مسار العميل", forecast: "توقعات", insights: "رؤى" },
    header: { dashboard: "لوحة القيادة", aiLeadIntelligence: "ذكاء العملاء الاصطناعي", pipelineOverview: "نظرة عامة على المسار", revenueForecast: "توقعات الإيرادات", clientInsights: "رؤى العملاء", aiClientOverview: "نظرة عامة على العملاء" },
    dashboard: { addNewLead: "إضافة عميل محتمل جديد", totalLeads: "إجمالي العملاء المحتملين", conversionRate: "معدل التحويل", revenueGrowth: "نمو الإيرادات", monthlyRecurring: "الإيرادات المتكررة الشهرية", overview: "نظرة عامة" },
    users: { newLeads: "عملاء محتملون جدد", recentlyRequested: "طلب عرضًا مؤخرًا", interestedEnterprise: "مهتم بخطة المؤسسة", highInterest: "اهتمام كبير", source: "المصدر", referral: "إحالة", agentAdded: "تمت إضافة الوكيل", status: "الحالة", callScheduled: "مكالمة مجدولة", inProgress: "قيد التقدم", closed: "مغلق" },
    pipeline: { europe: "أوروبا", kanbanView: "عرض كانبان", contacted: "تم الاتصال به", marketingProposal: "اقتراح تسويق", followUp: "متابعة" },
    forecast: { projection90Day: "توقعات 90 يومًا", recurringRevenue: "الإيرادات المتكررة", newCustomers: "عملاء جدد", closedWon: "مغلق/تم الفوز" },
    insights: { topNewLead: "أهم عميل محتمل جديد", newMessages: "رسائل جديدة", needsAttention: "بحاجة للاهتمام" },
    placeholders: { addNewLead: "إضافة عميل محتمل جديد", totalLeads: "تفاصيل إجمالي العملاء المحتملين", conversionRate: "تفاصيل معدل التحويل", revenueGrowth: "تفاصيل نمو الإيرادات", notifications: "إشعارات", settings: "إعدادات", filterSort: "تصفية وفرز" }
  }
};

Object.keys(translations).forEach(lang => {
  fs.writeFileSync(
    path.join(localesPath, `${lang}.json`),
    JSON.stringify(translations[lang], null, 2)
  );
});

console.log('Locales generated successfully!');
