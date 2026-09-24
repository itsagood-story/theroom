import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('./', import.meta.url);
const data = JSON.parse(await readFile(new URL('communities.json', root), 'utf8'));
assert(Array.isArray(data.communities) && data.communities.length > 0, 'Directory must contain communities');
const ids = new Set();
for (const record of data.communities) {
  assert(typeof record.id === 'string' && /^[a-z0-9-]+$/.test(record.id), 'Invalid ID');
  assert(!ids.has(record.id), `Duplicate ID: ${record.id}`); ids.add(record.id);
  assert(typeof record.name === 'string' && record.name.trim(), 'Missing name');
  for (const field of ['categories','pathways','notes','sourceRows','fees','referrals']) assert(Array.isArray(record[field]), `${record.name}: ${field} must be an array`);
  for (const field of ['fee','referral','location','goodFor']) assert(typeof record[field] === 'string' && record[field], `${record.name}: missing ${field}`);
  for (const field of ['categories','pathways','notes','fees','referrals']) assert(record[field].every(value => typeof value === 'string'), `Invalid ${field}`);
  assert(record.description === null || typeof record.description === 'string', 'Invalid description');
  assert(record.pathways.every(value => ['founders','fractional','marketing','women','executive','speaking'].includes(value)), 'Unknown pathway');
  if (record.url) assert(['https:','http:'].includes(new URL(record.url).protocol), 'Unsafe URL scheme');
}
for (const file of ['index.html','styles.css','app.js','.nojekyll']) await access(new URL(file, root));
console.log(`Validated ${ids.size} communities, unique IDs, required fields, link schemes and site assets.`);
