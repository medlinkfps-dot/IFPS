const fs = require('fs');
const path = require('path');

const mockData = require('../dist/mockData.cjs');

const TOKEN = 'vercel_blob_rw_A53IpJjUTe4iXwXY_DtqKr9S6wORYyr3M0gPMm78SJ26WTE';
const BLOB_URL = 'https://blob.vercel-storage.com/ifps_store.json';

const payload = {
  version: 1,
  last_updated: new Date().toISOString(),
  posts: mockData.INITIAL_POSTS || [],
  settings: mockData.INITIAL_SETTINGS || {},
  content_types: mockData.INITIAL_CONTENT_TYPES || [],
  categories: mockData.INITIAL_CATEGORIES || [],
  navigation: mockData.INITIAL_NAVIGATION || [],
  documents: mockData.INITIAL_DOCUMENTS || [],
  messages: [],
  audit_logs: [],
};

console.log('Seeding store to Vercel Blob...');
console.log('Posts count:', payload.posts.length);
console.log('Categories count:', payload.categories.length);
console.log('Content types count:', payload.content_types.length);
console.log('Settings keys:', Object.keys(payload.settings).length);
console.log('President Name:', payload.settings.president_name?.value_ar);

async function seed() {
  try {
    const res = await fetch(BLOB_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'x-api-version': '7',
        'x-vercel-blob-access': 'private',
        'x-add-random-suffix': '0',
        'x-allow-overwrite': '1',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', res.status);
    const body = await res.json();
    console.log('Response body:', body);

    if (res.ok) {
      console.log('✅ Successfully seeded ifps_store.json on Vercel Blob!');
    } else {
      console.error('❌ Failed to seed Vercel Blob');
    }
  } catch (err) {
    console.error('Error during seeding:', err);
  }
}

seed();
