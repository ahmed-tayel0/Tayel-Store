/**
 * Translation utility for dynamic category and brand names
 * Provides Arabic translations for known terms
 */

const arMap: Record<string, string> = {
  // Categories
  "Men's Fashion": "أزياء رجالي",
  "Women's Fashion": "أزياء حريمي",
  "Electronics": "إلكترونيات",
  "SuperMarket": "سوبر ماركت",
  "Baby & Toys": "أطفال وألعاب",
  "Books": "كتب",
  "Beauty & Health": "جمال وصحة",
  "Mobiles": "هواتف",
  "Home & Kitchen": "منزل ومطبخ",
  "Sports & Outdoors": "رياضة وهواة",
  "Automotive": "سيارات",
  "Health & Personal Care": "صحة وعناية شخصية",
  "Toys & Games": "ألعاب",
  "Pet Supplies": "مستلزمات الحيوانات",
  "Grocery": "بقالة",

  // Brands
  "Canon": "كانون",
  "Sony": "سوني",
  "Apple": "أبل",
  "Samsung": "سامسونج",
  "Dell": "ديل",
  "Lenovo": "لينوفو",
  "HP": "إتش بي",
  "ASUS": "أسوس",
  "Acer": "إيسر",
  "LG": "إل جي",
  "Xiaomi": "شاومي",
  "Huawei": "هواوي",
  "Nike": "نايك",
  "Adidas": "أديداس",
  "Puma": "بوما",
  "Under Armour": "أندرو أرمور",
  "Zara": "زارا",
  "H&M": "إتش آند إم",
  "Uniqlo": "يونيكلو",
  "Gucci": "غوتشي",
  "Prada": "برادا",
  "Louis Vuitton": "لويس فويتون",
  "Rolex": "رولكس",
  "Omega": "أوميغا",
  "TAG Heuer": "تاغ هوير",
  "Seiko": "سيكو",
  "Citizen": "سيتيزن",
  "Casio": "كاسيو",
  "G-Shock": "جي شوك",
  "Fossil": "فوسيل",
  "Michael Kors": "مايكل كورس",
  "Coach": "كوتش",
  "Tommy Hilfiger": "تومي هيلفيغر",
  "Calvin Klein": "كالفن كلاين",
  "Ralph Lauren": "رالف لورين",
  "Levi's": "ليفايز",
  "Wrangler": "رैंجلر",
  "Lee": "لي",
  "Columbia": "كولومبيا",
  "The North Face": "ذا نورث فيس",
  "Patagonia": "باتاغونيا",
  "Arc'teryx": "أركتيريكس",
  "Mammut": "ماموت",
  "Black Diamond": "بلاك دايموند",
  "Petzl": "بيتزل",
  "MSR": "إم إس آر",
  "Therm-a-Rest": "ثيرم-أ-ريست",
  "REI": "آر إي آي",
  "Osprey": "أوسبري",
  "Deuter": "دوتر",
  "Gregory": "جريجوري",
  "Kelty": "كيلتي",
  "Marmot": "مارموت",
  "Mountain Hardwear": "ماونتن هاردوير",
  "Outdoor Research": "أوتدور ريسيرش",
  "Rab": "راب",
  "Haglöfs": "هاغلوفز",
  "Fjällräven": "فييلرافن",
  "Salomon": "سولومون",
  "La Sportiva": "لا سبورتيفا",
  "Scarpa": "سكاربا",
  "Five Ten": "فايف تين",
  "Black Diamond Equipment": "بلاك دايموند إكويبمنت",
  "Grivel": "غريفيل",
  "Camp": "كامب",
  "Simond": "سيموند",
  "Beal": "بيل",
  "Edelrid": "إدلريد",
  "Mammut Sports Group": "ماموت سبورتس جروب",
  "Arc'teryx Equipment": "أركتيريكس إكويبمنت",
};

/**
 * Translates a term to Arabic if locale is 'ar', otherwise returns the original term
 * @param term - The English term to translate
 * @param locale - The current locale ('ar' or 'en')
 * @returns The translated term or original term
 */
export function translateTerm(term: string, locale: string): string {
  if (locale === 'ar') {
    return arMap[term] || term;
  }
  return term;
}

/**
 * Translates an array of terms
 */
export function translateTerms(terms: string[], locale: string): string[] {
  return terms.map(term => translateTerm(term, locale));
}