/**
 * Resolves the client's Contentful country codes (mostly ISO 3166-1 alpha-3,
 * e.g. "gbr", "ind") into human-readable display names. Names are derived
 * from Node's built-in Intl.DisplayNames via a static alpha-3 -> alpha-2
 * table, so any ISO country works without hardcoding a specific country
 * list. Codes outside the ISO table (the client's data includes a few
 * internal/non-standard entity codes) fall back to an uppercased label
 * instead of failing.
 */

const ALPHA3_TO_ALPHA2 = {
  afg: "AF", alb: "AL", dza: "DZ", and: "AD", ago: "AO", atg: "AG", arg: "AR",
  arm: "AM", aus: "AU", aut: "AT", aze: "AZ", bhs: "BS", bhr: "BH", bgd: "BD",
  brb: "BB", blr: "BY", bel: "BE", blz: "BZ", ben: "BJ", btn: "BT", bol: "BO",
  bih: "BA", bwa: "BW", bra: "BR", brn: "BN", bgr: "BG", bfa: "BF", bdi: "BI",
  cpv: "CV", khm: "KH", cmr: "CM", can: "CA", caf: "CF", tcd: "TD", chl: "CL",
  chn: "CN", col: "CO", com: "KM", cog: "CG", cod: "CD", cri: "CR", civ: "CI",
  hrv: "HR", cub: "CU", cyp: "CY", cze: "CZ", dnk: "DK", dji: "DJ", dma: "DM",
  dom: "DO", ecu: "EC", egy: "EG", slv: "SV", gnq: "GQ", eri: "ER", est: "EE",
  swz: "SZ", eth: "ET", fji: "FJ", fin: "FI", fra: "FR", gab: "GA", gmb: "GM",
  geo: "GE", deu: "DE", gha: "GH", grc: "GR", grd: "GD", gtm: "GT", gin: "GN",
  gnb: "GW", guy: "GY", hti: "HT", hnd: "HN", hun: "HU", isl: "IS", ind: "IN",
  idn: "ID", irn: "IR", irq: "IQ", irl: "IE", isr: "IL", ita: "IT", jam: "JM",
  jpn: "JP", jor: "JO", kaz: "KZ", ken: "KE", kir: "KI", kwt: "KW", kgz: "KG",
  lao: "LA", lva: "LV", lbn: "LB", lso: "LS", lbr: "LR", lby: "LY", lie: "LI",
  ltu: "LT", lux: "LU", mdg: "MG", mwi: "MW", mys: "MY", mdv: "MV", mli: "ML",
  mlt: "MT", mhl: "MH", mrt: "MR", mus: "MU", mex: "MX", fsm: "FM", mda: "MD",
  mco: "MC", mng: "MN", mne: "ME", mar: "MA", moz: "MZ", mmr: "MM", nam: "NA",
  nru: "NR", npl: "NP", nld: "NL", nzl: "NZ", nic: "NI", ner: "NE", nga: "NG",
  prk: "KP", mkd: "MK", nor: "NO", omn: "OM", pak: "PK", plw: "PW", pan: "PA",
  png: "PG", pry: "PY", per: "PE", phl: "PH", pol: "PL", prt: "PT", qat: "QA",
  rou: "RO", rus: "RU", rwa: "RW", kna: "KN", lca: "LC", vct: "VC", wsm: "WS",
  smr: "SM", stp: "ST", sau: "SA", sen: "SN", srb: "RS", syc: "SC", sle: "SL",
  sgp: "SG", svk: "SK", svn: "SI", slb: "SB", som: "SO", zaf: "ZA", kor: "KR",
  ssd: "SS", esp: "ES", lka: "LK", sdn: "SD", sur: "SR", swe: "SE", che: "CH",
  syr: "SY", twn: "TW", tjk: "TJ", tza: "TZ", tha: "TH", tls: "TL", tgo: "TG",
  ton: "TO", tto: "TT", tun: "TN", tur: "TR", tkm: "TM", tuv: "TV", uga: "UG",
  ukr: "UA", are: "AE", gbr: "GB", usa: "US", ury: "UY", uzb: "UZ", vut: "VU",
  vat: "VA", ven: "VE", vnm: "VN", yem: "YE", zmb: "ZM", zwe: "ZW",
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/**
 * @param {string} code - Country code as stored in Contentful (any case).
 * @returns {string} Human-readable country name, or the uppercased code
 *   when it isn't a recognized ISO 3166-1 alpha-3 code.
 */
function resolveCountryName(code) {
  const normalized = (code || "").trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  const alpha2 = ALPHA3_TO_ALPHA2[normalized];

  if (!alpha2) {
    return normalized.toUpperCase();
  }

  try {
    return regionNames.of(alpha2) || normalized.toUpperCase();
  } catch {
    return normalized.toUpperCase();
  }
}

module.exports = {
  resolveCountryName,
};
