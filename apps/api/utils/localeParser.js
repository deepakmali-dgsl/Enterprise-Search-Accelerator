/**
 * Parses the client's composite "residenceCountry > missionCountry > locale"
 * strings used on both the `country.name` and `resourceGroup.locale` fields.
 * The mission segment is omitted on some entries (residence-only pages), so
 * the string can be 2 or 3 segments long; the last segment is always an
 * ISO-639 language code.
 *
 * @param {string} value - Raw composite string, e.g. "zaf > gbr > en".
 * @returns {{ residenceCode: string, missionCode: string, localeCode: string }}
 */
function parseLocaleParts(value) {
  const segments = (value || "")
    .split(">")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length >= 3) {
    const [residenceCode, missionCode, localeCode] = segments;
    return { residenceCode, missionCode, localeCode };
  }

  if (segments.length === 2) {
    const [residenceCode, localeCode] = segments;
    return { residenceCode, missionCode: "", localeCode };
  }

  return { residenceCode: segments[0] || "", missionCode: "", localeCode: "" };
}

module.exports = {
  parseLocaleParts,
};
