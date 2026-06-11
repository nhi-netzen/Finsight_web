import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../contexts/UserContext";
import {
  Search, Bell, User, LogOut, ChevronDown, TrendingUp, TrendingDown,
  Brain, Activity, Globe, X, Building2, AlertCircle,
} from "lucide-react";
import { PremiumLogo } from "./PremiumLogo";

interface DashboardPageProps {
  language: "en" | "vi";
  onLanguageChange: (lang: "en" | "vi") => void;
  onLogout: () => void;
}

const translations = {
  en: {
    searchPlaceholder: "Search company code or name...",
    selectYear: "Year",
    analyze: "Analyze",
    analyzeCNN: "Analyze via CNN Model",
    analyzeFuzzy: "Analyze via Fuzzy + CNN Hybrid",
    financialMetrics: "Financial Data Extraction",
    extractedFrom: "Extracted from Financial Statements",
    noData: "Select a company and year to extract financial data",
    notifications: "Notifications",
    dataLastUpdated: "Data last updated",
    systemOnline: "System Online",
    modelReady: "AI Models Ready",
    grossProfit: "Gross Profit",
    grossProfitVI: "Lợi nhuận gộp",
    totalAssets: "Total Assets",
    totalAssetsVI: "Tổng cộng tài sản",
    totalLiabilities: "Total Liabilities",
    totalLiabilitiesVI: "Tổng nợ phải trả",
    shortTermDebt: "Short-term Debt",
    shortTermDebtVI: "Nợ ngắn hạn",
    longTermDebt: "Long-term Debt",
    longTermDebtVI: "Nợ dài hạn",
    netRevenue: "Net Revenue",
    netRevenueVI: "Doanh thu thuần",
    opCashFlow: "Operating Cash Flow",
    opCashFlowVI: "Lưu chuyển tiền từ HĐKD",
    invCashFlow: "Investing Cash Flow",
    invCashFlowVI: "Lưu chuyển tiền từ HĐĐT",
    finCashFlow: "Financing Cash Flow",
    finCashFlowVI: "Lưu chuyển tiền từ HĐTC",
    grossProfitMargin: "Gross Profit Margin",
    netProfitMargin: "Net Profit Margin",
    opm: "OPM",
    opmFull: "Operating Profit Margin",
    debtToAsset: "Debt-to-Asset Ratio",
    cnnNeuralDesc: "Neural Network Analysis",
    fuzzyHybridDesc: "Hybrid Intelligence Analysis",
    favorable: "Favorable",
    watch: "Watch",
    vsPriorYear: "vs prior year",
    logout: "Logout",
    noResults: "No results found",
    notifDataUpdated: "financial data synchronized",
    notifModelReady: "AI model analysis ready",
    notifReportAvailable: "annual report available",
    notifRiskAlert: "risk indicators updated",
    minAgo: "min ago",
    hrAgo: "hr ago",
  },
  vi: {
    searchPlaceholder: "Tìm kiếm mã công ty hoặc tên...",
    selectYear: "Năm",
    analyze: "Phân tích",
    analyzeCNN: "Phân tích với Mô hình CNN",
    analyzeFuzzy: "Phân tích với Hybrid Fuzzy + CNN",
    financialMetrics: "Trích xuất Dữ liệu Tài chính",
    extractedFrom: "Trích xuất từ Báo cáo Tài chính",
    noData: "Chọn công ty và năm để trích xuất dữ liệu tài chính",
    notifications: "Thông báo",
    dataLastUpdated: "Dữ liệu cập nhật lúc",
    systemOnline: "Hệ thống Trực tuyến",
    modelReady: "Mô hình AI Sẵn sàng",
    grossProfit: "Gross Profit",
    grossProfitVI: "Lợi nhuận gộp",
    totalAssets: "Total Assets",
    totalAssetsVI: "Tổng cộng tài sản",
    totalLiabilities: "Total Liabilities",
    totalLiabilitiesVI: "Tổng nợ phải trả",
    shortTermDebt: "Short-term Debt",
    shortTermDebtVI: "Nợ ngắn hạn",
    longTermDebt: "Long-term Debt",
    longTermDebtVI: "Nợ dài hạn",
    netRevenue: "Net Revenue",
    netRevenueVI: "Doanh thu thuần",
    opCashFlow: "Operating Cash Flow",
    opCashFlowVI: "Lưu chuyển tiền từ HĐKD",
    invCashFlow: "Investing Cash Flow",
    invCashFlowVI: "Lưu chuyển tiền từ HĐĐT",
    finCashFlow: "Financing Cash Flow",
    finCashFlowVI: "Lưu chuyển tiền từ HĐTC",
    grossProfitMargin: "Gross Profit Margin",
    netProfitMargin: "Net Profit Margin",
    opm: "OPM",
    opmFull: "Biên lợi nhuận hoạt động",
    debtToAsset: "Tỷ lệ Nợ/Tài sản",
    cnnNeuralDesc: "Phân tích Mạng Nơ-ron",
    fuzzyHybridDesc: "Phân tích Trí tuệ Hybrid",
    favorable: "Thuận lợi",
    watch: "Cảnh báo",
    vsPriorYear: "so với năm trước",
    logout: "Đăng xuất",
    noResults: "Không tìm thấy kết quả",
    notifDataUpdated: "dữ liệu tài chính đã đồng bộ",
    notifModelReady: "mô hình AI sẵn sàng phân tích",
    notifReportAvailable: "báo cáo năm có sẵn",
    notifRiskAlert: "chỉ số rủi ro đã cập nhật",
    minAgo: "phút trước",
    hrAgo: "giờ trước",
  },
};

const COMPANIES = [
  { code: "AAA", name: "An Phat Bioplastics" }, { code: "AAS", name: "AAS Securities" },
  { code: "AAT", name: "Asia-Atlantic Technology" }, { code: "ABB", name: "An Binh Commercial Bank" },
  { code: "ABS", name: "Agribank Securities" }, { code: "ABT", name: "Ben Tre Aquaproducts Import Export" },
  { code: "ACB", name: "Asia Commercial Bank" }, { code: "ACG", name: "An Cuong Wood Working" },
  { code: "ACL", name: "Cuu Long An Giang Fish" }, { code: "ACV", name: "Airports Corporation Vietnam" },
  { code: "ADC", name: "Agrideco Vietnam" }, { code: "AGF", name: "An Giang Fisheries" },
  { code: "AGG", name: "An Gia Investment" }, { code: "AGM", name: "An Giang Import Export" },
  { code: "AGR", name: "Agribank Securities Corp" }, { code: "ALT", name: "Altima JSC" },
  { code: "AME", name: "AME Group" }, { code: "AMV", name: "AmVac Vietnam" },
  { code: "ANV", name: "Nam Viet Corporation" }, { code: "APG", name: "Asia Pacific Group" },
  { code: "APH", name: "An Phat Holdings" }, { code: "APS", name: "APS Asset Management" },
  { code: "ARM", name: "Armed Forces Housing" }, { code: "ASG", name: "Sao Giai Phong Logistics" },
  { code: "ASM", name: "Sametel Corporation" }, { code: "ASP", name: "Asia Petro-Chemical" },
  { code: "ATG", name: "Agriculture Technology" }, { code: "ATS", name: "Auto Tech Services" },
  { code: "BAB", name: "Bac A Commercial Bank" }, { code: "BAF", name: "B&A Pharma" },
  { code: "BAX", name: "Baria Packaging" }, { code: "BBC", name: "Bibica Corporation" },
  { code: "BCC", name: "Bim Son Cement" }, { code: "BCI", name: "Binh Chanh Construction" },
  { code: "BCM", name: "Binh Duong Industry Commerce" }, { code: "BFC", name: "Binh Dien Fertilizer" },
  { code: "BHN", name: "Ha Noi Beer Alcohol Beverage" }, { code: "BIC", name: "BIDV Insurance" },
  { code: "BID", name: "Bank for Investment Development" }, { code: "BMI", name: "Bao Minh Insurance" },
  { code: "BMP", name: "Binh Minh Plastics" }, { code: "BRC", name: "Ben Tre Rubber" },
  { code: "BSC", name: "BIDV Securities" }, { code: "BSI", name: "BIDV Securities Investment" },
  { code: "BTP", name: "Ba Ria Thermal Power" }, { code: "BTS", name: "Bac Thanh Construction" },
  { code: "BVH", name: "Bao Viet Holdings" }, { code: "BVS", name: "Bao Viet Securities" },
  { code: "BWE", name: "BWE Water Corporation" }, { code: "CAG", name: "Cang Agriculture" },
  { code: "CCI", name: "Construction Consulting" }, { code: "CCL", name: "Can Tho Land" },
  { code: "CII", name: "Ho Chi Minh City Infrastructure" }, { code: "CLC", name: "Cat Loi" },
  { code: "CLG", name: "Can Tho Land Investment" }, { code: "CMC", name: "CMC Technology Group" },
  { code: "CMG", name: "CMG Corporation" }, { code: "CNG", name: "CNG Vietnam" },
  { code: "COM", name: "Petrolimex Material" }, { code: "CSM", name: "Casumina Rubber" },
  { code: "CTB", name: "CTB Fund" }, { code: "CTD", name: "Cotec Construction" },
  { code: "CTF", name: "City Auto" }, { code: "CTG", name: "Vietnam Joint Stock Commercial Bank" },
  { code: "CTI", name: "Tien Giang Construction" }, { code: "CTR", name: "Viettel Construction" },
  { code: "DAG", name: "Dong A Plastic" }, { code: "DAT", name: "Dat Xanh Services" },
  { code: "DBC", name: "Dabaco Group" }, { code: "DCM", name: "Ca Mau Fertilizer" },
  { code: "DHG", name: "Hau Giang Pharmaceutical" }, { code: "DHM", name: "Duc Hung Mineral" },
  { code: "DIG", name: "Development Investment Group" }, { code: "DLG", name: "Duc Long Gia Lai" },
  { code: "DMC", name: "Domesco Medical Import Export" }, { code: "DPM", name: "Petrovietnam Fertilizer" },
  { code: "DPR", name: "Dong Phu Rubber" }, { code: "DQC", name: "Dien Quang Lamp" },
  { code: "DRC", name: "Da Nang Rubber" }, { code: "DSE", name: "Da Lat Sanest" },
  { code: "DTC", name: "Delta Corp" }, { code: "DVP", name: "Dinh Vu Port" },
  { code: "EIB", name: "Vietnam Export Import Bank" }, { code: "EVE", name: "Ever Textile Vietnam" },
  { code: "EVF", name: "EVN Finance" }, { code: "EVG", name: "Everland" },
  { code: "EVS", name: "Everest Securities" }, { code: "FCM", name: "Fuco Mineral" },
  { code: "FCN", name: "FECON Corporation" }, { code: "FDC", name: "Fin Development" },
  { code: "FIT", name: "F.I.T Group" }, { code: "FLC", name: "FLC Group" },
  { code: "FMC", name: "Sao Ta Foods" }, { code: "FPT", name: "FPT Corporation" },
  { code: "FRM", name: "Fafim Farm" }, { code: "FRT", name: "FPT Retail" },
  { code: "FTS", name: "FPT Securities" }, { code: "GAS", name: "PetroVietnam Gas" },
  { code: "GDT", name: "Gỗ Đức Thành" }, { code: "GEG", name: "Gia Lai Electricity" },
  { code: "GEX", name: "GEX Group" }, { code: "HAG", name: "Hoang Anh Gia Lai" },
  { code: "HAH", name: "Hai An Transport" }, { code: "HAI", name: "Hai Duong Agriculture" },
  { code: "HAP", name: "Hai Phong Transport" }, { code: "HAS", name: "Ha Noi Stone" },
  { code: "HAX", name: "Hang Xanh Motors" }, { code: "HBC", name: "Hoa Binh Construction" },
  { code: "HCC", name: "Hai Chau Commerce" }, { code: "HCM", name: "HSC Securities" },
  { code: "HDC", name: "Binh Thuan Housing" }, { code: "HDG", name: "Ha Do Group" },
  { code: "HHC", name: "Hai Ha Confectionery" }, { code: "HHS", name: "Hung Hai" },
  { code: "HID", name: "Hoang Long Industry" }, { code: "HLC", name: "Ha Long Construction" },
  { code: "HMC", name: "Ho Chi Minh Metal" }, { code: "HNA", name: "Ha Noi Alcohol Beverage" },
  { code: "HNI", name: "Ha Noi Industrial" }, { code: "HPG", name: "Hoa Phat Group" },
  { code: "HQC", name: "Hoang Quan Consulting" }, { code: "HRC", name: "Hoa Binh Rubber" },
  { code: "HSG", name: "Hoa Sen Group" }, { code: "HT1", name: "Ha Tien 1 Cement" },
  { code: "HTC", name: "Hanoi Trade Corporation" }, { code: "HVH", name: "Hung Vuong Holdings" },
  { code: "HVT", name: "Hung Vuong Telecom" }, { code: "IBC", name: "Investment Bank Corp" },
  { code: "ICG", name: "Incomex Construction" }, { code: "IMP", name: "Imexpharm Pharma" },
  { code: "ITC", name: "Investment Technology Corp" }, { code: "KBC", name: "Kinh Bac City" },
  { code: "KDC", name: "Kido Group" }, { code: "KDH", name: "Khang Dien Housing" },
  { code: "KHG", name: "Khang Hai Group" }, { code: "KLB", name: "Kien Long Bank" },
  { code: "KSB", name: "Khoang San Binh Duong" }, { code: "LAF", name: "Long An Food" },
  { code: "LBM", name: "Lam Dong Building Material" }, { code: "LCG", name: "LICOGI 166" },
  { code: "LDG", name: "Long Dien Construction" }, { code: "LGC", name: "Loc Giang Construction" },
  { code: "LHG", name: "Long Hau Industrial" }, { code: "LM7", name: "LICOGI 7" },
  { code: "LPB", name: "LienVietPostBank" }, { code: "LSS", name: "Lam Son Sugar" },
  { code: "MAC", name: "Mai Linh Corporation" }, { code: "MCH", name: "Masan Consumer Holdings" },
  { code: "MCP", name: "My Chau Paper" }, { code: "MCM", name: "Masan Consumer Material" },
  { code: "MHC", name: "MHC Holdings" }, { code: "MIG", name: "Military Insurance" },
  { code: "MPC", name: "Minh Phu Seafood" }, { code: "MSB", name: "Maritime Bank" },
  { code: "MSN", name: "Masan Group" }, { code: "MTP", name: "Minh Tan Pharma" },
  { code: "MWG", name: "Mobile World Group" }, { code: "NAF", name: "Nafoods Group" },
  { code: "NAG", name: "Nghe An Agriculture" }, { code: "NBB", name: "NBB Investment" },
  { code: "NED", name: "Northeast Energy Dev" }, { code: "NHH", name: "Nhua Ha Noi" },
  { code: "NKG", name: "Nam Kim Steel" }, { code: "NLG", name: "Nam Long Group" },
  { code: "NRC", name: "Northern Rural Credit" }, { code: "NTL", name: "Nam Tan Uyen" },
  { code: "NTP", name: "Tien Phong Plastics" }, { code: "NVB", name: "Nam Viet Bank" },
  { code: "NVL", name: "Novaland Group" }, { code: "OGC", name: "Ocean Group" },
  { code: "OPC", name: "OPC Pharma" }, { code: "PAC", name: "Dong Nai Battery" },
  { code: "PAN", name: "PAN Group" }, { code: "PC1", name: "Power Construction 1" },
  { code: "PDR", name: "Phat Dat Real Estate" }, { code: "PGC", name: "Petrolimex Gas" },
  { code: "PGD", name: "PetroVietnam Gas Distribution" }, { code: "PGI", name: "Petrolimex Insurance" },
  { code: "PHR", name: "Phuoc Hoa Rubber" }, { code: "PLX", name: "Petrolimex" },
  { code: "PNJ", name: "Phu Nhuan Jewelry" }, { code: "POW", name: "PetroVietnam Power" },
  { code: "PPC", name: "Pha Lai Thermal Power" }, { code: "PSI", name: "Petrolimex Securities" },
  { code: "PTB", name: "Phu Tai" }, { code: "PTI", name: "Post and Telecom Insurance" },
  { code: "PVB", name: "PetroVietnam Bank" }, { code: "PVC", name: "PetroVietnam Coating" },
  { code: "PVD", name: "PetroVietnam Drilling" }, { code: "PVI", name: "PVI Holdings" },
  { code: "PVL", name: "PetroVietnam Land" }, { code: "PVP", name: "PetroVietnam Transport" },
  { code: "PVS", name: "PetroVietnam Technical Services" }, { code: "PVT", name: "PetroVietnam Transportation" },
  { code: "QCG", name: "Quoc Cuong Gia Lai" }, { code: "QNC", name: "Quang Ninh Cement" },
  { code: "QTC", name: "Quang Trung Construction" }, { code: "RAL", name: "Rang Dong Light Source" },
  { code: "RCL", name: "Resort Corp Land" }, { code: "REE", name: "Refrigeration Electrical Eng" },
  { code: "SAB", name: "Sabeco (SABMILLER Vietnam)" }, { code: "SAM", name: "Sacom" },
  { code: "SAV", name: "Southern Agriculture" }, { code: "SBS", name: "Sacombank Securities" },
  { code: "SC5", name: "Construction Co 5" }, { code: "SCC", name: "Sai Gon Commercial" },
  { code: "SCR", name: "Sacomreal" }, { code: "SCS", name: "Saigon Cargo Service" },
  { code: "SDT", name: "Song Da Tourism" }, { code: "SFC", name: "Saigon Fuel" },
  { code: "SFG", name: "Southern Fertilizer" }, { code: "SFI", name: "Saigon Freight" },
  { code: "SGN", name: "Saigon Noi Bai Cargo" }, { code: "SHB", name: "Saigon Hanoi Bank" },
  { code: "SHI", name: "Song Hong Garment" }, { code: "SHP", name: "Song Hinh Hydropower" },
  { code: "SII", name: "Saigon Investment Infrastructure" }, { code: "SJC", name: "Saigon Jewelry" },
  { code: "SJD", name: "Can Don Hydropower" }, { code: "SJS", name: "Song Da Urban" },
  { code: "SKG", name: "Superdong Kien Giang" }, { code: "SLC", name: "Southern Livestock" },
  { code: "SLP", name: "SLP Industrial Property" }, { code: "SMB", name: "Saigon Beer" },
  { code: "SMC", name: "SMC Investment Trading" }, { code: "SSB", name: "SeA Bank" },
  { code: "SSI", name: "SSI Securities" }, { code: "STC", name: "Saigon Tourist Commerce" },
  { code: "STG", name: "Song Tien Logistics" }, { code: "STK", name: "Century Synthetic Fiber" },
  { code: "SVC", name: "Saigon Trading" }, { code: "SZL", name: "Sonadezi Long Thanh" },
  { code: "TCB", name: "Techcombank" }, { code: "TCH", name: "Hoang Huy Investment" },
  { code: "TCI", name: "T&C Infrastructure" }, { code: "TCL", name: "Cau Long Mineral" },
  { code: "TCO", name: "Transco Logistics" }, { code: "TDC", name: "Binh Duong Trade Development" },
  { code: "TDG", name: "Thung Lung Xanh" }, { code: "TDH", name: "Thu Duc Housing" },
  { code: "TDM", name: "Thu Dau Mot Water" }, { code: "TDW", name: "Thu Duc Water" },
  { code: "TGG", name: "The Golden Gate" }, { code: "TH1", name: "Thu Duc 1" },
  { code: "THB", name: "Thinh Hung Industrial" }, { code: "TIG", name: "Tasco" },
  { code: "TIX", name: "Tan Binh Import Export" }, { code: "TLG", name: "Thien Long Group" },
  { code: "TLH", name: "Tay Ninh Steel" }, { code: "TMC", name: "Toa My Corp" },
  { code: "TMP", name: "Thac Mo Hydropower" }, { code: "TMS", name: "Trans-Pacific Shipper" },
  { code: "TNI", name: "TNI Holdings" }, { code: "TPC", name: "Tan Phu Cement" },
  { code: "TPB", name: "TienPhong Bank" }, { code: "TRC", name: "Tay Ninh Rubber" },
  { code: "TSC", name: "Agriculture Materials" }, { code: "TTC", name: "TTC Group" },
  { code: "TTF", name: "Truong Thanh Furniture" }, { code: "TVB", name: "Tri Viet Securities" },
  { code: "TVN", name: "Vietnam Stainless Steel" }, { code: "TVS", name: "Tran Vinh Securities" },
  { code: "UAB", name: "United Asia Bank" }, { code: "UIC", name: "Urban Infrastructure" },
  { code: "VCA", name: "Vinafor Can Tho" }, { code: "VCB", name: "Vietcombank" },
  { code: "VCC", name: "Vinaconex Construction" }, { code: "VCF", name: "Vinacafe Bien Hoa" },
  { code: "VCG", name: "Vinaconex" }, { code: "VCI", name: "Vietcap Securities" },
  { code: "VCT", name: "Vinacomin Transport" }, { code: "VDS", name: "Rong Viet Securities" },
  { code: "VGC", name: "Viglacera" }, { code: "VGI", name: "Viettel Global" },
  { code: "VHC", name: "Vinh Hoan Corporation" }, { code: "VHG", name: "Vinafor Ha Giang" },
  { code: "VHM", name: "Vinhomes" }, { code: "VIC", name: "Vingroup" },
  { code: "VIX", name: "VIX Securities" }, { code: "VJC", name: "VietJet Air" },
  { code: "VMC", name: "Vinamex Corporation" }, { code: "VMD", name: "Vi Medical" },
  { code: "VNA", name: "Vietnam Airlines (subsidiary)" }, { code: "VNB", name: "VietinBank" },
  { code: "VNC", name: "Vinacomin" }, { code: "VND", name: "VNDirect Securities" },
  { code: "VNE", name: "VNE Corporation" }, { code: "VNF", name: "Vietnam Finance" },
  { code: "VNG", name: "VNG Corporation" }, { code: "VNI", name: "Vietnam Investment" },
  { code: "VNL", name: "Vinalines Logistics" }, { code: "VNM", name: "Vinamilk" },
  { code: "VNR", name: "Vinare Reinsurance" }, { code: "VNS", name: "Vietnam Ocean Ship" },
  { code: "VNT", name: "Vinatrans Logistics" }, { code: "VOS", name: "Vietnam Ocean Shipping" },
  { code: "VPB", name: "VPBank" }, { code: "VPG", name: "Van Phu Invest" },
  { code: "VPH", name: "Van Phu Housing" }, { code: "VPS", name: "VPS Securities" },
  { code: "VRC", name: "Viet Russia Petroleum" }, { code: "VRE", name: "Vincom Retail" },
  { code: "VSC", name: "Viet Son Container" }, { code: "VSH", name: "Vinh Son Song Hinh Hydropower" },
  { code: "VSI", name: "Viet My Industry" }, { code: "VSM", name: "VSMC" },
  { code: "VTC", name: "Viettel Telecom Corp" }, { code: "VTG", name: "Vietnam Textiles" },
  { code: "VTI", name: "Viet Tien Investment" }, { code: "VTK", name: "Viet Kien Technology" },
  { code: "VTL", name: "Viet Thanh Long" }, { code: "VTM", name: "Viet Thai Mineral" },
  { code: "VTO", name: "Vitaco Holdings" }, { code: "VTP", name: "ViettelPost" },
  { code: "VTS", name: "Viet Thanh Securities" }, { code: "VTV", name: "Vietnam Television Film" },
  { code: "XMC", name: "Xuan Mai Construction" }, { code: "YEG", name: "Yeah1 Group" },
];


const YEARS = ["2021", "2022", "2023", "2024", "2025"];

// ==========================================
// 2. HELPER FUNCTIONS & COMPONENTS
// ==========================================
function formatNum(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return "0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
  return value.toLocaleString();
}

function NeuralIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="4" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="4" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="26" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="28" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.5" y1="10" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="6.5" y1="10" x2="13.5" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="6.5" y1="10" x2="13.5" y2="25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="6.5" y1="22" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="6.5" y1="22" x2="13.5" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="6.5" y1="22" x2="13.5" y2="25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="18.5" y1="6.5" x2="25.5" y2="15" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="18.5" y1="16" x2="25.5" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
      <line x1="18.5" y1="25.5" x2="25.5" y2="17" stroke="currentColor" strokeWidth="1" strokeOpacity="0.7" />
    </svg>
  );
}

function CompanyCombobox({ value, onChange, language }: { value: string; onChange: (code: string) => void; language: "en" | "vi" }) {
  const t = translations[language];
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = COMPANIES.find((c) => c.code === value);
  const filtered = query.length === 0
    ? COMPANIES
    : COMPANIES.filter((c) => c.code.toLowerCase().includes(query.toLowerCase()) || c.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative" style={{ minWidth: 280 }}>
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all"
        style={{
          background: "#171717",
          border: `1px solid ${open ? "#C00000" : "rgba(255,255,255,0.1)"}`,
          boxShadow: open ? "0 0 0 2px rgba(192,0,0,0.15)" : "none",
        }}
        onClick={() => { setOpen(!open); if (!open) setQuery(""); }}
      >
        <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: "#9CA3AF" }} />
        {open ? (
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#FFFFFF" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm" style={{ color: selected ? "#FFFFFF" : "#6B7280" }}>
            {selected ? (
              <><span className="font-semibold" style={{ color: "#FF3B3B" }}>{selected.code}</span> — {selected.name}</>
            ) : t.searchPlaceholder}
          </span>
        )}
        <div className="flex items-center gap-1">
          {selected && !open && (
            <button onClick={(e) => { e.stopPropagation(); onChange(""); }} style={{ color: "#6B7280" }}>
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className="w-4 h-4 transition-transform" style={{ color: "#6B7280", transform: open ? "rotate(180deg)" : "none" }} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
            style={{ background: "#1A1A1A", border: "1px solid rgba(192,0,0,0.25)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", maxHeight: 280 }}
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: 280 }}>
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm" style={{ color: "#6B7280" }}>No results found</div>
              ) : (
                filtered.map((company) => (
                  <button
                    key={company.code}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-all"
                    style={{
                      background: value === company.code ? "rgba(192,0,0,0.12)" : "transparent",
                      borderLeft: value === company.code ? "2px solid #C00000" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = value === company.code ? "rgba(192,0,0,0.12)" : "transparent"; }}
                    onClick={() => { onChange(company.code); setOpen(false); setQuery(""); }}
                  >
                    <span className="text-xs font-bold w-12 flex-shrink-0" style={{ color: "#FF3B3B" }}>{company.code}</span>
                    <span className="text-sm truncate" style={{ color: "#D1D5DB" }}>{company.name}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 3. MAIN DASHBOARD PAGE COMPONENT
// ==========================================
export function DashboardPage({ language, onLanguageChange, onLogout }: DashboardPageProps) {
  const navigate = useNavigate();
  const t = translations[language] || translations["vi"];
  const { user } = useUser() || {};

  // Các State Quản Lý Giao Diện
  const [selectedCompany, setSelectedCompany] = useState("VNM");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo khung dữ liệu trống (mặc định bằng 0)
  const emptyData = {
    grossProfit: 0, totalAssets: 0, totalLiabilities: 0, shortTermDebt: 0, longTermDebt: 0,
    netRevenue: 0, operatingCashFlow: 0, investingCashFlow: 0, financingCashFlow: 0,
    grossProfitMargin: 0, netProfitMargin: 0, operatingProfitMargin: 0, debtToAssetRatio: 0,
    notFound: false
  };

  const [financialData, setFinancialData] = useState(emptyData);
  const companyInfo = COMPANIES.find((c) => c.code === selectedCompany);

  // Hàm quét file CSV thực tế
  const loadRealDataFromCSV = async (company: string, year: string) => {
  setDataLoaded(false);
  setError(null);

  try {
    console.log("========== LOAD CSV ==========");
    console.log("INPUT COMPANY:", company);
    console.log("INPUT YEAR:", year);

    const response = await fetch("/Data_Raw.csv");

    console.log("STATUS:", response.status);

    if (!response.ok) {
      throw new Error("Không đọc được Data_Raw.csv");
    }

    const csvText = await response.text();

    const lines = csvText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    console.log("TOTAL LINES:", lines.length);

    if (lines.length < 2) {
      throw new Error("CSV rỗng");
    }

    const splitCSVLine = (line: string) => {
      const result = [];
      let cell = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          inQuotes = !inQuotes;
        } else if (line[i] === "," && !inQuotes) {
          result.push(cell.trim());
          cell = "";
        } else {
          cell += line[i];
        }
      }

      result.push(cell.trim());
      return result;
    };

    const cleanString = (str: string) => {
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]/g, "");
    };

    const rawHeaders = splitCSVLine(lines[0]);
    const headers = rawHeaders.map(cleanString);

    console.log("HEADERS:", headers);

    const codeIdx = headers.findIndex(h => h.includes("macongty"));
    const yearIdx = headers.findIndex(h => h.includes("nam"));
    const gpIdx = headers.findIndex(h => h.includes("loinhuangop"));
    const taIdx = headers.findIndex(h => h.includes("tongcongtaisan"));
    const tlIdx = headers.findIndex(h => h.includes("tongnophaitra"));
    const sdIdx = headers.findIndex(h => h.includes("nonganhan"));
    const ldIdx = headers.findIndex(h => h.includes("nodaihan"));
    const revIdx = headers.findIndex(h => h.includes("doanhthuthuan"));
    const ocfIdx = headers.findIndex(h => h.includes("kinhdoanh"));
    const icfIdx = headers.findIndex(h => h.includes("dautu"));
    const fcfIdx = headers.findIndex(h => h.includes("taichinh"));
    const gpmIdx = headers.findIndex(h => h.includes("grossprofit"));
    const npmIdx = headers.findIndex(h => h.includes("netprofit"));
    const opmIdx = headers.findIndex(h => h.includes("opm"));
    const dtaIdx = headers.findIndex(h => h.includes("debttoasset"));

    console.log({
      codeIdx,
      yearIdx,
      gpIdx,
      taIdx,
      tlIdx,
      sdIdx,
      ldIdx,
      revIdx,
      ocfIdx,
      icfIdx,
      fcfIdx,
      gpmIdx,
      npmIdx,
      opmIdx,
      dtaIdx
    });

    let match = null;

    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVLine(lines[i]);

      const currentCompany = cols[codeIdx]
        ?.replace(/\uFEFF/g, "")
        .trim()
        .toUpperCase();

      const currentYear = cols[yearIdx]
        ?.replace(/[^0-9]/g, "");

      const targetCompany = company
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();

      const targetYear = year
        .toString()
        .replace(/[^0-9]/g, "");

      if (i < 5) {
        console.log({
          currentCompany,
          currentYear,
          targetCompany,
          targetYear
        });
      }

      if (
        currentCompany === targetCompany &&
        currentYear === targetYear
      ) {
        console.log("MATCH FOUND");
        console.log(cols);

        const getCleanNumber = (idx: number) => {
          if (idx === -1 || !cols[idx]) return 0;

          const cleanStr = cols[idx]
            .replace(/[^0-9.-]/g, "");

          return Number(cleanStr) || 0;
        };

        match = {
          grossProfit: getCleanNumber(gpIdx),
          totalAssets: getCleanNumber(taIdx),
          totalLiabilities: getCleanNumber(tlIdx),
          shortTermDebt: getCleanNumber(sdIdx),
          longTermDebt: getCleanNumber(ldIdx),
          netRevenue: getCleanNumber(revIdx),
          operatingCashFlow: getCleanNumber(ocfIdx),
          investingCashFlow: getCleanNumber(icfIdx),
          financingCashFlow: getCleanNumber(fcfIdx),
          grossProfitMargin: getCleanNumber(gpmIdx) * 100,
          netProfitMargin: getCleanNumber(npmIdx) * 100,
          operatingProfitMargin: getCleanNumber(opmIdx) * 100,
          debtToAssetRatio: getCleanNumber(dtaIdx) * 100,
          notFound: false
        };

        break;
      }
    }

    if (match) {
      console.log("SUCCESS:", match);
      setFinancialData(match);
    } else {
      console.log(
        `KHÔNG TÌM THẤY: ${company} - ${year}`
      );

      setFinancialData({
        ...emptyData,
        notFound: true
      });
    }
  } catch (err: any) {
    console.error("CSV ERROR:", err);

    setError(err?.message || "Lỗi đọc CSV");

    setFinancialData({
      ...emptyData,
      notFound: true
    });
  }

  setDataLoaded(true);
};

  // Tự động Load dữ liệu khi vào trang lần đầu hoặc khi đổi mã Combobox
  useEffect(() => {
    loadRealDataFromCSV(selectedCompany, selectedYear);
  }, [selectedCompany, , selectedYear]);

  // Cấu hình 13 Metrics hiển thị trên giao diện từ dữ liệu thật
  const metrics = [
    { key: "grossProfit", label: t.grossProfit, subLabel: t.grossProfitVI, value: `₫${formatNum(financialData.grossProfit)}`, raw: financialData.grossProfit, isPercent: false, positive: true },
    { key: "totalAssets", label: t.totalAssets, subLabel: t.totalAssetsVI, value: `₫${formatNum(financialData.totalAssets)}`, raw: financialData.totalAssets, isPercent: false, positive: true },
    { key: "totalLiabilities", label: t.totalLiabilities, subLabel: t.totalLiabilitiesVI, value: `₫${formatNum(financialData.totalLiabilities)}`, raw: financialData.totalLiabilities, isPercent: false, positive: false },
    { key: "shortTermDebt", label: t.shortTermDebt, subLabel: t.shortTermDebtVI, value: `₫${formatNum(financialData.shortTermDebt)}`, raw: financialData.shortTermDebt, isPercent: false, positive: false },
    { key: "longTermDebt", label: t.longTermDebt, subLabel: t.longTermDebtVI, value: `₫${formatNum(financialData.longTermDebt)}`, raw: financialData.longTermDebt, isPercent: false, positive: false },
    { key: "netRevenue", label: t.netRevenue, subLabel: t.netRevenueVI, value: `₫${formatNum(financialData.netRevenue)}`, raw: financialData.netRevenue, isPercent: false, positive: true },
    { key: "operatingCashFlow", label: t.opCashFlow, subLabel: t.opCashFlowVI, value: `₫${formatNum(financialData.operatingCashFlow)}`, raw: financialData.operatingCashFlow, isPercent: false, positive: financialData.operatingCashFlow >= 0 },
    { key: "investingCashFlow", label: t.invCashFlow, subLabel: t.invCashFlowVI, value: `₫${formatNum(financialData.investingCashFlow)}`, raw: financialData.investingCashFlow, isPercent: false, positive: financialData.investingCashFlow >= 0 },
    { key: "financingCashFlow", label: t.finCashFlow, subLabel: t.finCashFlowVI, value: `₫${formatNum(financialData.financingCashFlow)}`, raw: financialData.financingCashFlow, isPercent: false, positive: financialData.financingCashFlow >= 0 },
    { key: "grossProfitMargin", label: t.grossProfitMargin, subLabel: "", value: `${financialData.grossProfitMargin}%`, raw: financialData.grossProfitMargin, isPercent: true, positive: financialData.grossProfitMargin >= 20 },
    { key: "netProfitMargin", label: t.netProfitMargin, subLabel: "", value: `${financialData.netProfitMargin}%`, raw: financialData.netProfitMargin, isPercent: true, positive: financialData.netProfitMargin >= 10 },
    { key: "opm", label: t.opm, subLabel: t.opmFull, value: `${financialData.operatingProfitMargin}%`, raw: financialData.operatingProfitMargin, isPercent: true, positive: financialData.operatingProfitMargin >= 15 },
    { key: "debtToAsset", label: t.debtToAsset, subLabel: "", value: `${financialData.debtToAssetRatio}%`, raw: financialData.debtToAssetRatio, isPercent: true, positive: financialData.debtToAssetRatio <= 60 },
  ];

  const notifications = [
    { id: 1, text: `${selectedCompany} ${t.notifDataUpdated}`, time: `2 ${t.minAgo}`, type: "info" },
    { id: 2, text: `${selectedCompany} ${t.notifModelReady}`, time: `5 ${t.minAgo}`, type: "success" },
    { id: 3, text: `${selectedCompany} ${selectedYear} ${t.notifReportAvailable}`, time: `1 ${t.hrAgo}`, type: "info" },
    { id: 4, text: `${selectedCompany} ${selectedYear} ${t.notifRiskAlert}`, time: `3 ${t.hrAgo}`, type: "warning" },
  ];


  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0B0B0B", fontFamily: "Inter, sans-serif" }}>
      {/* TOP NAVIGATION BAR */}
      <div className="sticky top-0 z-40 border-b" style={{ background: "#111111", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-4 px-6 h-16">
          <div className="flex items-center gap-3 flex-shrink-0 mr-2">
            <PremiumLogo size={32} variant="symbol" animated={false} />
            <span className="text-white font-bold tracking-wide text-sm hidden sm:block">FinSight AI</span>
          </div>

          <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />

          {/* Ô Combobox Chọn Công Ty */}
          <CompanyCombobox value={selectedCompany} onChange={setSelectedCompany} language={language} />

          {/* Nút Phân Tích Thực Sự */}
          <motion.button
            onClick={() => loadRealDataFromCSV(selectedCompany, selectedYear)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #C00000 0%, #FF3B3B 100%)",
              color: "#FFFFFF", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(192,0,0,0.3)",
            }}
            whileHover={{ scale: 1.03, boxShadow: "0 6px 20px rgba(192,0,0,0.45)" }}
            whileTap={{ scale: 0.97 }}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{t.analyze}</span>
          </motion.button>

          {/* Ô Lựa Chọn Năm */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={selectedYear}
              onChange={(e) => {
                const newYear = e.target.value;
                setSelectedYear(newYear);
                loadRealDataFromCSV(selectedCompany, newYear); 
              }}
              className="px-3 py-2.5 rounded-xl cursor-pointer text-sm"
              style={{ background: "#171717", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
            >
              {YEARS.map((y) => (
                <option key={y} value={y} style={{ background: "#171717" }}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex-1" />

          {/* Notification & User Settings (Bên phải) */}
          <div className="hidden lg:flex items-center gap-4 text-xs" style={{ color: "#4B5563" }}>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> {t.systemOnline}</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" /> {t.modelReady}</span>
          </div>
          <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />

          <div className="relative">
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center relative transition-all"
              style={{ background: showNotif ? "rgba(192,0,0,0.15)" : "rgba(255,255,255,0.04)", color: "#9CA3AF" }}
              onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <AnimatePresence>
              {showNotif && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden z-50"
                  style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}><span className="text-white text-sm font-semibold">{t.notifications}</span></div>
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 flex items-start gap-3 border-b last:border-b-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.type === "success" ? "#10B981" : "#3B82F6" }} />
                      <div><div className="text-sm text-gray-300">{n.text}</div><div className="text-xs mt-0.5 text-gray-500">{n.time}</div></div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{ background: showUserMenu ? "linear-gradient(135deg, #C00000, #FF3B3B)" : "linear-gradient(135deg, #8B0000, #C00000)" }}
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
            >
              <User className="w-5 h-5 text-white" />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
                  style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <div className="text-white text-sm font-semibold">{user?.name || "Analyst"}</div>
                    <div className="text-xs text-gray-500">{user?.email || "analyst@finsight.ai"}</div>
                  </div>
                  <button onClick={() => { setShowUserMenu(false); onLogout(); }} className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-500 transition-all hover:bg-white/5">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Globe className="w-4 h-4" style={{ color: "#6B7280" }} />
            <select value={language} onChange={(e) => onLanguageChange(e.target.value as "en" | "vi")} className="bg-transparent outline-none cursor-pointer text-sm text-gray-300">
              <option value="en" style={{ background: "#171717" }}>EN</option>
              <option value="vi" style={{ background: "#171717" }}>VI</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT DASHBOARD */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white mb-1" style={{ fontSize: 18, fontWeight: 700 }}>
              {t.financialMetrics}
              {companyInfo && <span className="ml-3" style={{ color: "#FF3B3B", fontSize: 16 }}>{companyInfo.code}</span>}
            </h2>
            <p style={{ color: "#6B7280", fontSize: 13 }}>
              {t.extractedFrom} · {selectedYear} {companyInfo && ` · ${companyInfo.name}`}
            </p>
            {error && <p className="text-red-500 text-xs mt-2 font-medium">⚠️ {error}</p>}
          </div>
        </div>

        {/* 13 METRIC CARDS */}
        <AnimatePresence mode="wait">
          {dataLoaded ? (
            <motion.div key={`${selectedCompany}-${selectedYear}`} className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.key} className="rounded-xl px-5 py-4 relative overflow-hidden group"
                  style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)" }}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.3 }}
                  whileHover={{ borderColor: "rgba(192,0,0,0.3)", background: "#181818" }}
                >
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(192,0,0,0.1)", color: "#C00000" }}>{i + 1}</div>
                  <div className="mb-3 pr-8">
                    <div className="font-semibold" style={{ color: "#9CA3AF", fontSize: 12, letterSpacing: "0.04em" }}>{metric.label.toUpperCase()}</div>
                    {metric.subLabel && <div className="mt-0.5" style={{ color: "#4B5563", fontSize: 11 }}>{metric.subLabel}</div>}
                  </div>
                  <div className="font-bold mb-2" style={{ fontSize: 22, color: metric.positive ? "#FFFFFF" : "#FF6B6B", letterSpacing: "-0.02em" }}>
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {metric.positive ? <TrendingUp className="w-3.5 h-3.5" style={{ color: "#10B981" }} /> : <TrendingDown className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />}
                    <span style={{ color: metric.positive ? "#10B981" : "#EF4444", fontSize: 11 }}>{metric.positive ? "Favorable" : "Watch"}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(90deg, transparent, #C00000, transparent)" }} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="loading" className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[...Array(13)].map((_, i) => (
                <div key={i} className="rounded-xl px-5 py-4 h-28" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 rounded w-2/3" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-6 rounded w-1/2" style={{ background: "rgba(255,255,255,0.08)" }} />
                    <div className="h-3 rounded w-1/3" style={{ background: "rgba(255,255,255,0.04)" }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI ACTION BUTTONS */}
        <motion.div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
          {/* CNN Button */}
          <motion.button
            onClick={() => navigate(`/analysis/loading?type=cnn&company=${selectedCompany}`)}
            className="relative rounded-2xl p-8 flex items-center gap-6 overflow-hidden group text-left"
            style={{ background: "linear-gradient(135deg, #1A0000 0%, #2D0000 50%, #3D0000 100%)", border: "1px solid rgba(192,0,0,0.4)", boxShadow: "0 8px 32px rgba(192,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            whileHover={{ borderColor: "rgba(255,59,59,0.6)", boxShadow: "0 12px 48px rgba(192,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)", scale: 1.01 }} whileTap={{ scale: 0.99 }}
          >
            <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at left 50%, rgba(192,0,0,0.12) 0%, transparent 70%)" }} transition={{ duration: 0.3 }} />
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10" style={{ background: "linear-gradient(135deg, #C00000, #FF3B3B)", boxShadow: "0 8px 24px rgba(192,0,0,0.4)" }}><NeuralIcon className="w-8 h-8 text-white" /></div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-1"><div className="text-white font-bold" style={{ fontSize: 17 }}>{t.analyzeCNN}</div><Brain className="w-4 h-4" style={{ color: "#FF3B3B" }} /></div>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>{t.cnnNeuralDesc}</div>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(192,0,0,0.2)", color: "#FF3B3B" }}>94.2% Accuracy</span>
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>13 Features</span>
              </div>
            </div>
            <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#FF3B3B" }}><ChevronDown className="w-5 h-5 -rotate-90" /></div>
          </motion.button>

          {/* Fuzzy-CNN Button */}
          <motion.button
            onClick={() => navigate(`/analysis/loading?type=fuzzy-cnn&company=${selectedCompany}`)}
            className="relative rounded-2xl p-8 flex items-center gap-6 overflow-hidden group text-left"
            style={{ background: "linear-gradient(135deg, #0A0A1A 0%, #0F0F28 50%, #1A1A3D 100%)", border: "1px solid rgba(192,0,0,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)" }}
            whileHover={{ borderColor: "rgba(255,59,59,0.5)", boxShadow: "0 12px 48px rgba(192,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)", scale: 1.01 }} whileTap={{ scale: 0.99 }}
          >
            <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at left 50%, rgba(192,0,0,0.08) 0%, transparent 70%)" }} transition={{ duration: 0.3 }} />
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10" style={{ background: "linear-gradient(135deg, #8B0000 0%, #C00000 50%, #FF3B3B 100%)", boxShadow: "0 8px 24px rgba(192,0,0,0.3)" }}><Activity className="w-8 h-8 text-white" /></div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2 mb-1"><div className="text-white font-bold" style={{ fontSize: 17 }}>{t.analyzeFuzzy}</div><AlertCircle className="w-4 h-4" style={{ color: "#FF3B3B" }} /></div>
              <div style={{ color: "#9CA3AF", fontSize: 13 }}>{t.fuzzyHybridDesc}</div>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(192,0,0,0.2)", color: "#FF3B3B" }}>96.7% Accuracy</span>
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#9CA3AF" }}>Fuzzy Logic</span>
              </div>
            </div>
            <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#FF3B3B" }}><ChevronDown className="w-5 h-5 -rotate-90" /></div>
          </motion.button>
        </motion.div>

        <div className="mt-8 pt-4 border-t text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.06)", color: "#374151" }}>
          <span>Data Source: Vietnam Stock Exchange (HOSE / HNX / UPCoM) · FinSight AI v2.4.1 · {selectedYear} Fiscal Data</span>
        </div>
      </div>
    </div>
  );
}