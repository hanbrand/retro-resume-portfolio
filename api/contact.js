import { Resend } from 'resend';

const MAX_BODY_BYTES = 12_000;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 3_000;
const DEFAULT_TO_EMAIL = 'brandonh4n@gmail.com';
const DEFAULT_FROM_EMAIL = 'contact@thehanbrand.dev';

const envValue = (name, fallback = '') => {
  const raw = process.env[name] || fallback;
  const withoutKey = raw.startsWith(`${name}=`) ? raw.slice(name.length + 1) : raw;
  return withoutKey.trim().replace(/^['"]|['"]$/g, '');
};

const json = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const parseRawBody = (raw) => (raw ? JSON.parse(raw) : {});

const readBody = async (req) => {
  if (Buffer.isBuffer(req.body)) return parseRawBody(req.body.toString('utf8'));
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string') return parseRawBody(req.body);

  if (typeof req.on !== 'function') return {};

  return new Promise((resolve, reject) => {
    let raw = '';
    let settled = false;

    req.on('data', (chunk) => {
      if (settled) return;
      raw += chunk;
      if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
        settled = true;
        reject(new Error('Request body is too large.'));
      }
    });

    req.on('end', () => {
      if (settled) return;
      settled = true;
      try {
        resolve(parseRawBody(raw));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });
  });
};

const clean = (value, maxLength) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

const normalizeSender = (value) => {
  const raw = envValue('CONTACT_FROM_EMAIL', value);
  const angleMatch = raw.match(/<([^<>\s]+@[^<>\s]+\.[^<>\s]+)>/);
  if (angleMatch?.[1]) return `Portfolio Contact <${angleMatch[1]}>`;
  if (isEmail(raw)) return raw;
  return DEFAULT_FROM_EMAIL;
};

const cleanMessage = (value) =>
  String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
    .slice(0, MAX_MESSAGE_LENGTH);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildEmailBody = ({ name, email, message }) => {
  const safeName = name || 'Portfolio visitor';
  const text = [
    'New portfolio message',
    '',
    `Name: ${safeName}`,
    `Email: ${email}`,
    '',
    message
  ].join('\n');

  const html = `
    <h2>New portfolio message</h2>
    <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `;

  return { text, html };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, message: 'Method not allowed.' });
  }

  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) {
    return json(res, 413, { ok: false, message: 'Message is too large.' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return json(res, 400, { ok: false, message: 'Could not read your message.' });
  }

  const company = clean(body.company, 120);
  if (company) {
    return json(res, 200, { ok: true });
  }

  const name = clean(body.name, MAX_NAME_LENGTH);
  const email = clean(body.email, MAX_EMAIL_LENGTH);
  const message = cleanMessage(body.message);

  if (!email || !isEmail(email)) {
    return json(res, 400, { ok: false, message: 'Please enter a valid email address.' });
  }

  if (!message) {
    return json(res, 400, { ok: false, message: 'Please write a message first.' });
  }

  const resendApiKey = envValue('RESEND_API_KEY');
  if (!resendApiKey) {
    return json(res, 500, { ok: false, message: 'Contact form is not configured yet.' });
  }

  const to = envValue('CONTACT_TO_EMAIL', DEFAULT_TO_EMAIL);
  const from = normalizeSender(DEFAULT_FROM_EMAIL);
  const { text, html } = buildEmailBody({ name, email, message });
  const subjectName = name || 'Portfolio visitor';

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio message from ${subjectName}`,
    text,
    html,
    tags: [{ name: 'source', value: 'portfolio_contact' }]
  });

  if (error) {
    console.error('Resend contact form send failed', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      from,
      to
    });

    const payload = {
      ok: false,
      message: 'Message could not be sent right now.',
      detail: error.message,
      code: error.name,
      statusCode: error.statusCode
    };
    if (envValue('CONTACT_DEBUG_ERRORS') === 'true') {
      payload.from = from;
      payload.to = to;
    }

    return json(res, 502, payload);
  }

  return json(res, 200, { ok: true });
}
