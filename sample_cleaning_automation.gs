/**
 * AI-assisted survey data cleaning (Google Apps Script)
 * ------------------------------------------------------------------
 * Cleaning utilities for turning raw survey exports into analysis-ready data:
 *   - Clean messy free-text gender into Female / Male / Other
 *   - Group ethnicity into standard categories (multi-select aware)
 *   - AI proposes category mappings for human review; rules act as a fallback
 *
 * Approved mappings are stored in a review sheet and applied during cleaning.
 */

/* ---------- 1. Gender cleaning (whole-word matching) ---------- */
// Uses word boundaries so gender words are caught even inside a
// sentence (e.g. "I'm a boy" -> Male). Female is checked before Male
// so "she/her/woman/girl" are never mis-hit by male words. Anything
// with no clear gender word (names, jokes, blanks) -> "Other".
function cleanGender(value) {
  if (value == null) return 'Other';
  var g = ' ' + String(value).trim().toLowerCase() + ' ';
  g = g.replace(/[\/_\-]/g, ' ');          // "she/her" -> "she her"
  if (g.trim() === '') return 'Other';

  var FEMALE = [' female ', ' woman ', ' women ', ' girl ', ' she ',
                ' her ', ' wahine ', ' fem ', ' famale '];
  var MALE   = [' male ', ' man ', ' men ', ' boy ', ' guy ',
                ' he ', ' him ', ' tane ', ' males '];

  for (var i = 0; i < FEMALE.length; i++) if (g.indexOf(FEMALE[i]) !== -1) return 'Female';
  for (var j = 0; j < MALE.length;  j++) if (g.indexOf(MALE[j])  !== -1) return 'Male';
  return 'Other';
}

/* ---------- 2. Ethnicity classification (single term) ---------- */
function classifyEthnicity(label) {
  var l = String(label || '').toLowerCase();
  if (l.indexOf('maori') !== -1 || l.indexOf('m\u0101ori') !== -1) return 'Maori';
  if (['chinese','indian','asian','sri lankan','filipino','korean']
        .some(function (k) { return l.indexOf(k) !== -1; })) return 'Asian';
  if (['samoan','tongan','niuean','fijian','pacific','pasifika']
        .some(function (k) { return l.indexOf(k) !== -1; })) return 'Pasifika';
  if (l.indexOf('european') !== -1 || l.indexOf('pakeha') !== -1) return 'NZ European/Pakeha';
  if (!l || l === 'none' || l.indexOf('prefer not') !== -1) return 'Not stated';
  return 'Other';
}

/* ---------- 3. Ethnicity as MULTI-SELECT ---------- */
// A person may list several ethnicities ("NZ European; Samoan").
// Count them in EVERY group they belong to (matches how such reports
// count ethnicity, so totals can exceed the number of respondents).
// approvedMap is the human-reviewed mapping; it overrides the rules.
function ethnicityGroups(value, approvedMap) {
  var raw = String(value == null ? '' : value).trim();
  if (!raw) return [];
  var parts = raw.split(/[;,]/).map(function (p) {
    return p.replace(/^\s*other\s*:\s*/i, '').trim();   // drop "Other:" prefix
  }).filter(function (p) { return p.length > 0; });

  var groups = {};
  parts.forEach(function (p) {
    var g = (approvedMap && approvedMap[p]) || classifyEthnicity(p);
    if (g && g !== 'Not stated') groups[g] = 1;
  });
  return Object.keys(groups);
}

/* ---------- 4. AI-proposes / human-reviews pattern ---------- */
// The distinct raw values are sent to an AI model, which PROPOSES a
// category for each. Proposals are written to a review sheet; a person
// approves/edits them before they are applied. This keeps the speed of
// AI with the safety of human review.
function suggestMappings(distinctValues) {
  // Pseudocode of the pattern (API call omitted for the sample):
  //   var proposals = callAiModel(distinctValues);   // {value: category}
  //   writeToReviewSheet(proposals);                 // human reviews
  //   return proposals;
  return distinctValues.map(function (v) {
    return { value: v, suggestedCategory: classifyEthnicity(v) };
  });
}

/* ---------- 5. Age band from date of birth ---------- */
function ageGroup(age) {
  var a = parseFloat(age);
  if (isNaN(a)) return 'Unknown';
  if (a < 13) return 'under 13';
  if (a <= 15) return '13-15';
  if (a <= 17) return '16-17';
  if (a <= 24) return '18-24';
  return '25+';
}
