import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(process.cwd(), '.analytics_db.json');

// Default initial database state
const INITIAL_DB = {
  visitors: [],
  sessions: [],
  pageViews: [],
  heartbeats: []
};

// Known bot/crawler User-Agent substrings
const BOT_USER_AGENTS = [
  'googlebot', 'bingbot', 'yandexbot', 'duckduckbot', 'slurp', 'baiduspider',
  'facebookexternalhit', 'twitterbot', 'rogerbot', 'linkedinbot', 'embedly',
  'quora link preview', 'showyouhavebox', 'outbrain', 'pinterest/0.',
  'developers.google.com/+/web/snippet', 'slackbot', 'vkShare', 'w3c_validator',
  'redditbot', 'applebot', 'whatsapp', 'flipboard', 'tumblr', 'bitlybot',
  'skypeuripreview', 'nuzzel', 'discordbot', 'google page speed', 'qwantify',
  'lighthouse', 'headlesschrome', 'phantomjs', 'puppeteer'
];

export function isBotUserAgent(userAgent = '') {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
      return INITIAL_DB;
    }
    const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading analytics DB:', err);
    return INITIAL_DB;
  }
}

function writeDb(db) {
  try {
    // Keep DB size reasonable by retaining last 10,000 pageviews and heartbeats
    if (db.pageViews.length > 10000) {
      db.pageViews = db.pageViews.slice(-10000);
    }
    if (db.heartbeats.length > 10000) {
      db.heartbeats = db.heartbeats.slice(-10000);
    }
    if (db.sessions.length > 5000) {
      db.sessions = db.sessions.slice(-5000);
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing analytics DB:', err);
  }
}

export function recordPageViewEvent({
  anonymousId,
  sessionId,
  path: pagePath,
  language = 'ar',
  device = 'desktop',
  browser = 'unknown',
  referrer = '',
  userAgent = ''
}) {
  if (isBotUserAgent(userAgent)) return { tracked: false, reason: 'bot' };

  const db = readDb();
  const now = new Date().toISOString();
  const timestamp = Date.now();

  // 1. Unique Visitor Record
  let visitor = db.visitors.find(v => v.anonymousId === anonymousId);
  if (!visitor) {
    visitor = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      anonymousId,
      firstSeen: now,
      lastSeen: now,
      device
    };
    db.visitors.push(visitor);
  } else {
    visitor.lastSeen = now;
  }

  // 2. Session Record (30 min inactivity threshold)
  const THIRTY_MINS_MS = 30 * 60 * 1000;
  let session = db.sessions.find(s => s.id === sessionId);

  if (!session) {
    session = {
      id: sessionId || `s_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visitorId: visitor.id,
      startedAt: now,
      lastActivityAt: now,
      endedAt: null,
      device,
      browser,
      language,
      referrer,
      pagesVisitedCount: 1
    };
    db.sessions.push(session);
  } else {
    const lastActiveTime = new Date(session.lastActivityAt).getTime();
    if (timestamp - lastActiveTime > THIRTY_MINS_MS) {
      // Start new session due to inactivity timeout
      session = {
        id: `s_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        visitorId: visitor.id,
        startedAt: now,
        lastActivityAt: now,
        endedAt: null,
        device,
        browser,
        language,
        referrer,
        pagesVisitedCount: 1
      };
      db.sessions.push(session);
    } else {
      session.lastActivityAt = now;
      session.pagesVisitedCount = (session.pagesVisitedCount || 1) + 1;
    }
  }

  // 3. Page View Record
  const pageView = {
    id: `pv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sessionId: session.id,
    visitorId: visitor.id,
    path: pagePath || '/',
    language,
    device,
    timestamp
  };
  db.pageViews.push(pageView);

  writeDb(db);
  return { tracked: true, visitorId: visitor.id, sessionId: session.id };
}

export function recordHeartbeatEvent({
  anonymousId,
  sessionId,
  path: pagePath,
  language = 'ar',
  device = 'desktop',
  userAgent = ''
}) {
  if (isBotUserAgent(userAgent)) return { tracked: false };

  const db = readDb();
  const now = new Date().toISOString();
  const timestamp = Date.now();

  let visitor = db.visitors.find(v => v.anonymousId === anonymousId);
  if (!visitor) {
    visitor = {
      id: `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      anonymousId,
      firstSeen: now,
      lastSeen: now,
      device
    };
    db.visitors.push(visitor);
  } else {
    visitor.lastSeen = now;
  }

  let session = db.sessions.find(s => s.id === sessionId);
  if (session) {
    session.lastActivityAt = now;
  }

  // Record active heartbeat
  const heartbeat = {
    id: `hb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sessionId: sessionId || 'unknown',
    visitorId: visitor.id,
    anonymousId,
    path: pagePath || '/',
    language,
    device,
    timestamp
  };

  db.heartbeats.push(heartbeat);
  writeDb(db);
  return { tracked: true };
}

export function getDashboardMetrics() {
  const db = readDb();
  const nowMs = Date.now();

  // Active Users: Heartbeat or page view within last 5 minutes (300,000 ms)
  const FIVE_MINS_MS = 5 * 60 * 1000;
  const activeThreshold = nowMs - FIVE_MINS_MS;

  // Filter recent heartbeats
  const recentHeartbeats = db.heartbeats.filter(hb => hb.timestamp >= activeThreshold);
  const recentPageViews = db.pageViews.filter(pv => pv.timestamp >= activeThreshold);

  // Group active visitors by anonymousId
  const activeVisitorsMap = new Map();

  recentHeartbeats.forEach(hb => {
    activeVisitorsMap.set(hb.anonymousId || hb.visitorId, {
      path: hb.path,
      language: hb.language,
      device: hb.device,
      timestamp: hb.timestamp
    });
  });

  recentPageViews.forEach(pv => {
    if (!activeVisitorsMap.has(pv.visitorId)) {
      activeVisitorsMap.set(pv.visitorId, {
        path: pv.path,
        language: pv.language,
        device: pv.device,
        timestamp: pv.timestamp
      });
    }
  });

  const activeNowCount = activeVisitorsMap.size;

  // Active Users Breakdown by Page
  const activeByPage = {};
  const activeByLanguage = {};
  const activeByDevice = {};

  activeVisitorsMap.forEach(info => {
    activeByPage[info.path] = (activeByPage[info.path] || 0) + 1;
    activeByLanguage[info.language] = (activeByLanguage[info.language] || 0) + 1;
    activeByDevice[info.device] = (activeByDevice[info.device] || 0) + 1;
  });

  // Unique Visitors Time Windows
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;
  const THIRTY_DAYS_MS = 30 * ONE_DAY_MS;

  const todayStartMs = new Date().setHours(0, 0, 0, 0);

  const visitorsToday = db.visitors.filter(v => new Date(v.lastSeen).getTime() >= todayStartMs).length;
  const visitors7Days = db.visitors.filter(v => new Date(v.lastSeen).getTime() >= (nowMs - SEVEN_DAYS_MS)).length;
  const visitors30Days = db.visitors.filter(v => new Date(v.lastSeen).getTime() >= (nowMs - THIRTY_DAYS_MS)).length;
  const visitorsAllTime = db.visitors.length;

  // Popular Pages Breakdown
  const pageViewsPerRoute = {};
  db.pageViews.forEach(pv => {
    pageViewsPerRoute[pv.path] = (pageViewsPerRoute[pv.path] || 0) + 1;
  });

  const popularPages = Object.entries(pageViewsPerRoute)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views);

  // Visitors Over Time (Daily aggregation for last 7 days)
  const dailyVisitorsMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(nowMs - i * ONE_DAY_MS);
    const dayStr = d.toISOString().split('T')[0];
    dailyVisitorsMap[dayStr] = 0;
  }

  db.visitors.forEach(v => {
    const dayStr = v.firstSeen.split('T')[0];
    if (dailyVisitorsMap[dayStr] !== undefined) {
      dailyVisitorsMap[dayStr] += 1;
    }
  });

  const visitorsOverTime = Object.entries(dailyVisitorsMap).map(([date, count]) => ({ date, count }));

  return {
    activeNow: activeNowCount,
    activeByPage,
    activeByLanguage,
    activeByDevice,
    uniqueVisitors: {
      today: visitorsToday,
      last7Days: visitors7Days,
      last30Days: visitors30Days,
      allTime: visitorsAllTime
    },
    totalPageViews: db.pageViews.length,
    totalSessions: db.sessions.length,
    popularPages,
    visitorsOverTime
  };
}
