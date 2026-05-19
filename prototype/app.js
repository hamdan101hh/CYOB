/* cyob.live · master engine
   handles: intake storage, plan generation, auth simulation, refresh, copy, navigation */

const CYOB = {
  /* ============ STORAGE ============ */
  store: {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem('cyob_' + key);
        return v ? JSON.parse(v) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('cyob_' + key, JSON.stringify(value)); }
      catch (e) { console.warn('storage failed', e); }
    },
    remove(key) { localStorage.removeItem('cyob_' + key); },
    clear() {
      Object.keys(localStorage)
        .filter(k => k.startsWith('cyob_'))
        .forEach(k => localStorage.removeItem(k));
    },
  },

  /* ============ STATE ============ */
  intake: null,
  plan: null,
  user: null,
  tier: 'free',

  init() {
    this.intake = this.store.get('intake');
    this.plan = this.store.get('plan');
    this.user = this.store.get('user');
    this.tier = this.store.get('tier') || 'free';
  },

  /* ============ INTAKE ============ */
  saveIntake(data) {
    data.updatedAt = new Date().toISOString();
    data.id = data.id || 'cy_' + Math.random().toString(36).slice(2, 11);
    this.intake = data;
    this.store.set('intake', data);
    return data;
  },

  /* ============ USER (mocked auth) ============ */
  setUser(email) {
    const user = {
      email,
      id: 'usr_' + Math.random().toString(36).slice(2, 11),
      createdAt: new Date().toISOString(),
      verified: true,
    };
    this.user = user;
    this.store.set('user', user);
    return user;
  },

  setTier(tier) {
    this.tier = tier;
    this.store.set('tier', tier);
  },

  logout() {
    this.store.remove('user');
    this.user = null;
    this.tier = 'free';
    this.store.set('tier', 'free');
  },

  /* ============ NAVIGATION ============ */
  go(page) { window.location.href = page; },

  /* ============ PLAN GENERATION ============ */
  generatePlan(intake) {
    const ind = (intake.industry || '').toLowerCase();
    const isLuxury = /lux|premium/i.test(intake.vibe || '');
    const isYouth = /bold|youth/i.test(intake.vibe || '');
    const isCraft = /craft/i.test(intake.vibe || '');

    const plan = {
      meta: { ...intake, generatedAt: new Date().toISOString() },
      pulse: this._pulse(ind),
      trends: this._trends(ind, intake),
      gaps: this._gaps(intake),
      priorities: this._priorities(intake, isLuxury, isYouth),
      roadmap: this._roadmap(intake),
      campaigns: this._campaigns(intake, isLuxury, isYouth, isCraft),
      future: this._future(intake),
      competitors: this._competitors(ind, intake),
    };

    this.plan = plan;
    this.store.set('plan', plan);
    return plan;
  },

  _pulse(industry) {
    const map = {
      'real estate': [
        { label: 'Market temperature', value: 'Heating', delta: '↑ 19% YoY transactions', dir: 'up' },
        { label: 'Avg luxury PSF', value: 'AED 4,820', delta: '↑ 11% vs Q1 2025', dir: 'up' },
        { label: 'Foreign buyer share', value: '68%', delta: 'IN · RU · UK lead', dir: 'flat' },
        { label: 'Branded residences', value: '142 pipeline', delta: '↑ 38% · global #1', dir: 'up' },
      ],
      'perfume': [
        { label: 'GCC category growth', value: '+12% YoY', delta: 'Niche outpacing mass', dir: 'up' },
        { label: 'Avg luxury ticket', value: 'AED 950', delta: '↑ 8% YoY', dir: 'up' },
        { label: 'Online share', value: '34%', delta: '↑ from 22% in 2023', dir: 'up' },
        { label: 'TikTok mentions', value: '+4.1× YoY', delta: 'Scent-tok dominant', dir: 'up' },
      ],
      'restaurant': [
        { label: 'F&B inflation (UAE)', value: '+6.8% YoY', delta: 'Margin pressure', dir: 'down' },
        { label: 'Premium avg ticket', value: 'AED 420', delta: '↑ 9% YoY', dir: 'up' },
        { label: 'Delivery share', value: '38%', delta: 'Stable post-COVID', dir: 'flat' },
        { label: 'New openings (2025)', value: '210+', delta: 'Saturated mid-tier', dir: 'flat' },
      ],
      'fashion': [
        { label: 'Modest luxury growth', value: '+14% YoY', delta: 'GCC outperforming', dir: 'up' },
        { label: 'Resale market', value: '+22% YoY', delta: 'Vestiaire, FARFETCH gaining', dir: 'up' },
        { label: 'Social commerce share', value: '29%', delta: '↑ from 18% in 2024', dir: 'up' },
        { label: 'Influencer ROAS', value: 'Declining', delta: 'Macro fatigue', dir: 'down' },
      ],
      'skincare': [
        { label: 'MENA category growth', value: '+16% YoY', delta: 'K-beauty + clean lead', dir: 'up' },
        { label: 'Avg basket size', value: 'AED 380', delta: 'Premiumization', dir: 'up' },
        { label: 'TikTok discovery', value: '52%', delta: 'For under-35 buyers', dir: 'up' },
        { label: 'DTC penetration', value: '41%', delta: 'Sephora still dominant', dir: 'flat' },
      ],
      'cafe': [
        { label: 'Specialty growth', value: '+18% YoY', delta: 'Third wave maturing', dir: 'up' },
        { label: 'Avg ticket', value: 'AED 42', delta: 'Flat — competition-capped', dir: 'flat' },
        { label: 'Evening daypart', value: '+24%', delta: 'Coffee-as-bar rising', dir: 'up' },
        { label: 'IG saturation', value: 'High', delta: 'Differentiator declining', dir: 'down' },
      ],
      'hospitality': [
        { label: 'GCC RevPAR', value: '+11% YoY', delta: 'Recovery extended', dir: 'up' },
        { label: 'Avg daily rate', value: 'AED 1,240', delta: '↑ 14% vs 2024', dir: 'up' },
        { label: 'Direct booking %', value: '38%', delta: '↑ from 27% in 2023', dir: 'up' },
        { label: 'Wellness demand', value: '+31% YoY', delta: 'Longevity-led rising', dir: 'up' },
      ],
      'tech': [
        { label: 'MENA SaaS growth', value: '+34% YoY', delta: 'Fastest globally', dir: 'up' },
        { label: 'AI-native share', value: '67%', delta: 'Of new funding', dir: 'up' },
        { label: 'Avg ACV (MENA)', value: '$18K', delta: '↑ 22% YoY', dir: 'up' },
        { label: 'Cold outbound ROI', value: 'Declining', delta: 'AI-spam fatigue', dir: 'down' },
      ],
      'fitness': [
        { label: 'Premium gym growth', value: '+19% YoY', delta: 'Boutique outperforming', dir: 'up' },
        { label: 'Avg membership', value: 'AED 850', delta: '↑ 16% YoY', dir: 'up' },
        { label: 'Wellness/longevity', value: '+38% YoY', delta: 'Hottest sub-category', dir: 'up' },
        { label: 'Gen-Z attendance', value: '+27%', delta: 'New core demographic', dir: 'up' },
      ],
      'jewelry': [
        { label: 'Luxury watch resale', value: '+14% YoY', delta: 'Pre-owned premium', dir: 'up' },
        { label: 'Lab-grown diamond', value: '+62% YoY', delta: 'Disrupting natural', dir: 'up' },
        { label: 'GCC gold buying', value: 'Sustained high', delta: 'Cultural anchor', dir: 'flat' },
        { label: 'IG-led discovery', value: '58%', delta: 'For under-40 buyers', dir: 'up' },
      ],
    };
    for (const k in map) if (industry.includes(k)) return map[k];
    return [
      { label: 'Category growth', value: '+10–15% YoY', delta: 'Directional', dir: 'up' },
      { label: 'Online discovery', value: 'Rising', delta: 'Social-led shift', dir: 'up' },
      { label: 'Premium tier', value: 'Outperforming', delta: 'Premiumization', dir: 'up' },
      { label: 'Saturation level', value: 'Mid-high', delta: 'Differentiation matters', dir: 'flat' },
    ];
  },

  _trends(industry, intake) {
    return [
      {
        name: 'First-person POV vertical creator content (9–15s)',
        heat: 88,
        dir: 'up',
        why: 'Algorithm reward + trust signal. Vertical content from real humans outperforms polished brand content by 2-4× on TikTok and Reels.',
        evidence: [
          { label: 'TikTok hashtag explore', url: `https://www.tiktok.com/tag/${this._tag(industry)}` },
          { label: 'Google Trends signal', url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(industry + ' tips')}` },
        ],
      },
      {
        name: `"Move to [city]" / "I bought in [location]" creator series`,
        heat: 84,
        dir: 'up',
        why: 'Relocation and discovery content has 3-4× the engagement of brand-owned content. Foreign-audience pull is strong.',
        evidence: [
          { label: '#movetodubai', url: 'https://www.tiktok.com/tag/movetodubai' },
          { label: '#realestatedubai', url: 'https://www.tiktok.com/tag/realestatedubai' },
        ],
      },
      {
        name: 'Sub-1-minute documentary storytelling',
        heat: 76,
        dir: 'up',
        why: 'Real people, restrained edit, story arc inside 60 seconds. Saves and shares outperform raw views.',
        evidence: [
          { label: 'YouTube Shorts trending', url: 'https://www.youtube.com/feed/trending?bp=4gIcGhpyZWdpb25fdHJlbmRpbmdfc2hvcnRzX2hvbWU%3D' },
        ],
      },
      {
        name: 'AI-personalized customer journeys',
        heat: 62,
        dir: 'up early',
        why: 'Cost curve on bilingual conversational AI collapsed below junior staff hourly cost. Early-mover window before category saturates.',
        evidence: [
          { label: 'Anthropic Claude API', url: 'https://www.anthropic.com/api' },
          { label: 'OpenAI Assistants API', url: 'https://platform.openai.com/docs/assistants' },
        ],
      },
      {
        name: 'Bilingual / multilingual creator content',
        heat: 71,
        dir: 'up',
        why: 'Indian, Russian, Chinese, UK buyers each want native-language discovery. English-only loses share rapidly.',
        evidence: [
          { label: '#dubaipropertyhindi', url: 'https://www.tiktok.com/tag/dubaipropertyhindi' },
        ],
      },
      {
        name: 'Longevity / wellness-led product framing',
        heat: 68,
        dir: 'up',
        why: 'Air, water, light, biophilia, calm are rising in buyer language across categories from real estate to skincare to F&B.',
        evidence: [
          { label: 'Google Trends: longevity', url: 'https://trends.google.com/trends/explore?q=longevity' },
        ],
      },
      {
        name: 'Generic skyline / hero shot brand content',
        heat: 38,
        dir: 'down',
        why: 'Engagement on aerial/architecture-only content declining ~30% YoY. Algorithm penalty on low-saves content.',
        evidence: [],
      },
      {
        name: 'Corporate launch films with voiceover',
        heat: 31,
        dir: 'down',
        why: 'Sub-7-second view-through on Reels. Algorithm de-prioritization. Cuts of TVCs perform worst of all formats.',
        evidence: [],
      },
    ];
  },

  _tag(industry) {
    const map = { 'real estate': 'realestate', 'perfume': 'fragrance', 'restaurant': 'foodie', 'fashion': 'fashion', 'skincare': 'skincaretok', 'cafe': 'coffeetok', 'hospitality': 'travel', 'tech': 'tech', 'fitness': 'fittok', 'jewelry': 'jewelry' };
    for (const k in map) if (industry.includes(k)) return map[k];
    return 'business';
  },

  _gaps(intake) {
    const co = intake.company || 'the company';
    return [
      {
        name: 'No human storytelling layer',
        severity: 'High',
        sevTag: 'red',
        doing: `${co}'s content likely skews product/feature/architecture-led. Customers and people are largely absent from primary brand assets.`,
        market: 'Customer-led and human-led narrative is the highest-engaging format across consumer categories on Reels and TikTok.',
        exploiter: 'Smaller, faster competitors moving on creator partnerships in days, not quarters.',
        fix: 'Stand up a structured customer-creator program. Editorial guardrails. Light incentive. Distribution muscle.',
        evidence: [{ label: 'Example customer-led format', url: 'https://www.tiktok.com/discover/realestate-customer-stories' }],
      },
      {
        name: 'Below-market TikTok presence',
        severity: 'High',
        sevTag: 'red',
        doing: `Most ${(intake.size || '').toLowerCase()} brands in ${intake.industry || 'this category'} have marginal native TikTok presence and reuse Instagram cuts.`,
        market: 'Discovery for under-50 audience starts on TikTok across most consumer categories.',
        exploiter: 'Brands a tenth the size with native creator teams.',
        fix: 'Native creator team: creative director + 2 creators + 1 editor. Daily vertical cadence. Distinct tone from Instagram.',
        evidence: [{ label: 'TikTok creator discovery', url: 'https://www.tiktok.com/business/en/inspirations' }],
      },
      {
        name: 'Weak post-purchase ecosystem narrative',
        severity: 'High',
        sevTag: 'red',
        doing: 'Brand storytelling ends at the transaction. The post-purchase relationship is unspoken, unmarketed.',
        market: 'Premium brands compete on world-after-purchase: membership, calendar, service, community.',
        exploiter: 'Brands that productize and market the post-purchase ecosystem as a brand asset.',
        fix: '"Life After [purchase]" as a marketed offer, not buried in customer-service decks.',
        evidence: [],
      },
      {
        name: 'Funnel handoff loses brand identity',
        severity: 'Medium',
        sevTag: 'amber',
        doing: 'Brand-generated leads pass to brokers/retailers/affiliates and lose identity during nurture.',
        market: 'Best-in-class brands maintain owned-channel nurture in parallel.',
        exploiter: 'Brands running internal sales for top-tier leads.',
        fix: 'Owned nurture layer. Closed-loop attribution. Internal team for top-tier prospects.',
        evidence: [],
      },
      {
        name: 'Customer/owner UGC under-mobilized',
        severity: 'Medium',
        sevTag: 'amber',
        doing: 'No formal customer-creator program. UGC use is incidental, not structured.',
        market: 'Customers are the highest-trust signal across most purchase decisions.',
        exploiter: 'Sharper competitors moving on structured ambassador programs.',
        fix: 'Formal ambassador program: content templates, kit, light incentive, editorial guardrails.',
        evidence: [],
      },
      {
        name: 'CRM personalization tier missing',
        severity: 'Low (high upside)',
        sevTag: 'blue',
        doing: 'Generic email/CRM flow. Limited persona segmentation.',
        market: 'AI-personalized journeys becoming table stakes within 18 months.',
        exploiter: 'Smaller, AI-native competitors piloting now.',
        fix: 'AI assistant as a branded product — multilingual, instant, on-brand. First-mover moat for 12-18 months.',
        evidence: [{ label: 'Claude API for AI assistants', url: 'https://www.anthropic.com/api' }],
      },
      {
        name: 'Multilingual content discipline',
        severity: 'Medium',
        sevTag: 'amber',
        doing: 'English-primary content. Other languages translated, not originated.',
        market: 'Top buyer geographies expect native-language discovery — origination, not translation.',
        exploiter: 'Brands running dedicated language-vertical channels.',
        fix: 'Structured editorial calendar per language. Native creators per geography.',
        evidence: [],
      },
    ];
  },

  _priorities(intake, isLuxury, isYouth) {
    const co = intake.company || 'the company';
    return [
      {
        rank: '01',
        name: 'Customer-led brand layer',
        logic: `Convert ${co}'s real customers into the brand's strongest emotional layer. Editorial framework, light incentive, distribution muscle. The asset already exists — it just needs to be activated.`,
        horizon: '90 days',
        budget: 'Medium',
        owner: 'New role: Director of Customer Storytelling',
      },
      {
        rank: '02',
        name: 'TikTok + Reels native ownership',
        logic: 'Native creator team, daily vertical, multilingual where audience warrants. Not corporate cuts of TVCs. Treats the platform as its own medium with its own grammar.',
        horizon: '120 days',
        budget: 'Medium-Large',
        owner: 'CMO with new social creative director',
      },
      {
        rank: '03',
        name: 'AI customer/investor concierge',
        logic: 'Branded, multilingual, instant-response assistant as a brand asset, not an internal tool. 12-month competitive edge before the category catches up.',
        horizon: '180 days',
        budget: 'Large',
        owner: 'CDO + CMO joint sponsorship',
      },
      {
        rank: '04',
        name: '"Life After Purchase" ecosystem',
        logic: 'Productize and market the post-purchase relationship — concierge, community, member access, calendar. The moat competitors cannot copy without inventory.',
        horizon: '12 months',
        budget: 'Large (operational)',
        owner: 'COO + CMO joint',
      },
      {
        rank: '05',
        name: isLuxury ? 'Longevity & wellness positioning' : (isYouth ? 'Subculture-native creator ecosystem' : 'Category-defining positioning shift'),
        logic: isLuxury
          ? 'Reframe product through air, water, light, biophilia. Buildings/products stay; positioning shifts.'
          : (isYouth
            ? 'Identify 2-3 emerging subcultures the brand can authentically resonate with. Embed.'
            : 'Reframe product through a rising lens (longevity, craft, belonging) before the category catches up.'),
        horizon: '12-36 months',
        budget: 'Medium',
        owner: 'CMO with development/design partnership',
      },
    ];
  },

  _roadmap(intake) {
    const co = intake.company || 'the brand';
    return [
      { week: 'Week 1', body: `Audit ${co}'s last 90 days of content across IG, TikTok, YouTube, LinkedIn. Identify top 10 and bottom 10 by engagement.`, milestone: 'Audit complete' },
      { week: 'Week 2', body: 'Hire / appoint Director of Customer Storytelling at director level. Internal mandate, P&L visibility.' },
      { week: 'Week 3', body: 'Cast 12-18 customer narrators. Light editorial-rights agreements with creative guardrails.' },
      { week: 'Week 4', body: 'Pilot vertical episode 1 produced. 90 seconds. Real customer, restrained edit, cinema-grade.' },
      { week: 'Week 5', body: 'Episode 2 + 3 produced. Establish weekly publishing cadence.' },
      { week: 'Week 6', body: 'Native TikTok creative director hired. Brief written. Vertical-tone doc separate from Instagram tone.' },
      { week: 'Week 7', body: 'AI Concierge vendor shortlist. Multilingual model evaluation. Conversation IP scoped.' },
      { week: 'Week 8', body: 'Hero campaign 01 production begins. Long-form 60-90s + 6 cutdowns + OOH lines.', milestone: 'Hero in production' },
      { week: 'Week 9', body: 'TikTok team fully seated: creative director, 2 creators, 1 editor, 1 strategist.' },
      { week: 'Week 10', body: 'Sunset generic hero-shot cadence. Reallocate budget to vertical creator content.' },
      { week: 'Week 11', body: 'Hero campaign 01 ships across hero, social, OOH.' },
      { week: 'Week 12', body: '90-day review. Lead quality, save-rate, follower velocity, perception lift.', milestone: '90-day review' },
      { week: 'Week 13', body: 'Episodes 5-8 of customer-led series shipped. Quarterly creator partnership commitments.' },
      { week: 'Week 14', body: 'AI Concierge enters private beta with internal team + 20 vetted prospects.' },
      { week: 'Week 15', body: 'Seasonal campaign 01 (Ramadan or culturally relevant moment) produced.' },
      { week: 'Week 16', body: 'Bilingual editorial calendar live in Hindi + Russian + English. Mandarin in development.' },
      { week: 'Week 17', body: 'Funnel rebuild: top-tier leads routed through internal team.' },
      { week: 'Week 18', body: 'Customer ambassador program formalized — content kit, guidelines, light comp.', milestone: 'Ambassador program live' },
      { week: 'Week 19', body: 'Hero campaign 02 ships.' },
      { week: 'Week 20', body: 'AI Concierge expanded beta — 200 prospects. Multilingual coverage measured.' },
      { week: 'Week 21', body: 'Episodes 9-12 shipped. Series becomes ongoing pillar.' },
      { week: 'Week 22', body: '"Life After Purchase" ecosystem program scoped with operations.' },
      { week: 'Week 23', body: 'Annual brand-health study fielded — warmth, belonging, modernity attributes.' },
      { week: 'Week 24', body: 'AI Concierge public launch readiness review.', milestone: 'Launch readiness' },
      { week: 'Week 25', body: '6-month executive review. Win/kill conditions checked.', milestone: '6-month review' },
      { week: 'Week 26', body: 'Next-half roadmap drafted. Category positioning shift prioritized for months 7-12.' },
    ];
  },

  _campaigns(intake, isLuxury, isYouth, isCraft) {
    const co = intake.company || 'the brand';
    return [
      {
        title: 'The Quiet Hour',
        type: 'Brand film · Hero',
        bigIdea: `5 a.m. The city before the city wakes. Real ${co} customers in their daily ritual. No voiceover, no music swell. Restraint as luxury.`,
        scenes: [
          'Scene 1 — 4:50 a.m. silhouette pouring coffee, window unfocused, city lights distant.',
          'Scene 2 — 5:15 a.m. a parent walking a child across a quiet podium garden.',
          'Scene 3 — 5:30 a.m. a swimmer crossing an infinity edge as the horizon lights.',
          'Scene 4 — First sun. Slow lift. No logo until the last frame.',
        ],
        cutdowns: [
          '9s · the coffee pour, ending on city waking',
          '12s · parent and child walking, child says one line',
          '15s · swimmer crossing the edge, sunrise frame',
          '9s · empty hallway at 5 a.m., light on a single object',
          '12s · barista preparing first coffee in a podium venue',
          '15s · elevator descent from the highest floor',
        ],
        ooh: [
          'The city is louder when you don\'t have to wake up to see it.',
          'Most people see Dubai from a window. A few see it from a balcony.',
          'Some hours belong to those who live here.',
          'The first floor that catches the sun.',
        ],
        prompts: [
          'Cinematic wide shot, 5 a.m., silhouetted figure at floor-to-ceiling glass overlooking city before sunrise, only city lights visible, warm interior lamp glow, palette of indigo and amber, shot on Arri Alexa, 35mm, shallow depth, mood of stillness and intimacy, luxury restraint, no text.',
          'A child\'s small hand holding an adult\'s hand, walking across a podium garden at dawn, soft light filtering through trees, palette of cool green and rose gold, intimate framing, no faces visible, cinematic 35mm.',
          'Swimmer\'s arm cresting water at infinity edge of beachfront pool, skyline distant and unfocused, first light of sunrise, palette of pale blue and coral, ultra-wide cinematic, no logos, no faces.',
          'Empty marble corridor at 5 a.m., one wall lamp lit, soft natural light from distant window, deep luxury restraint, palette of warm grey and bronze, architectural elegance, no people, cinematic single frame, 50mm.',
        ],
        videoPrompts: [
          'Vertical 9:16, 10 seconds, cinematic slow push-in toward a window at dawn, soft light entering, no text, restrained luxury, palette of indigo and amber.',
          'Vertical 9:16, 10 seconds, hand reaching for a coffee cup on a marble counter, morning light, palette of warm grey and bronze, cinematic 50mm tone.',
        ],
        artStyle: 'cinematic-restraint',
      },
      {
        title: 'Inherited Light',
        type: 'Seasonal · Ramadan',
        bigIdea: 'Three generations gathering for iftar. The grandfather tells a story. The granddaughter inherits the address, not the lecture.',
        scenes: [
          'Scene 1 — lanterns being lit at dusk.',
          'Scene 2 — three generations seated at one long table.',
          'Scene 3 — grandfather\'s hand on the table, story begins in voiceover.',
          'Scene 4 — the table cleared. The granddaughter still seated. End.',
        ],
        cutdowns: [
          '15s · lanterns lighting one by one',
          '15s · grandfather\'s hand on table',
          '30s · the story in voiceover',
          '15s · granddaughter watching',
          '15s · table cleared',
          '20s · next morning, same room, empty',
        ],
        ooh: [
          'Some homes are bought once and inherited twice.',
          'Iftar at the same table for three generations.',
          'A first home becomes a family.',
        ],
        prompts: [
          'Three generations of family at iftar table at dusk, lanterns and dates and fresh dishes, soft warm light, intimate cinematic framing, palette of warm amber and deep blue, no close-up faces, mood of belonging and quiet pride, 50mm lens.',
          'Grandfather\'s weathered hand resting on a polished walnut dining table at iftar, candles, a child\'s plate nearby, palette of bronze and ivory, macro detail shot, cinematic.',
          'Wide table view at iftar, three generations, food untouched at the moment of breaking fast, soft lantern light, palette of amber and indigo, cinematic anamorphic frame.',
          'A small hand reaching for a date at iftar, soft focus other guests in background, warm lamp light, palette of bronze and warm white, intimate macro, cinematic.',
        ],
        videoPrompts: [
          'Vertical 9:16, 10 seconds, slow tilt-down on a Ramadan table at dusk, lanterns lighting, hands reaching, no faces close, palette of amber and indigo, cinematic.',
          'Vertical 9:16, 8 seconds, close-up of a date being picked up at iftar, soft warm focus, cinematic 85mm tone.',
        ],
        artStyle: 'warm-cinematic',
      },
      {
        title: 'Why I Stayed',
        type: '12-episode series',
        bigIdea: 'Real customers. 60-90 seconds each. One question: "why didn\'t you go back?" No host, no script, no music. Editorial restraint as the brand voice.',
        scenes: [
          'Each episode = one customer, one location (their home / office / favorite spot), one question.',
          'Vertical 9:16. Cinema-grade. Distribution: TikTok, Reels, YouTube Shorts.',
          'Quarterly release rhythm. Three per quarter.',
        ],
        cutdowns: [
          '12 episode briefs covering: origin, family, daily ritual, the wrong reasons, the right reasons, the morning, the evening, the doubt, the moment, the regret, the return, the silence',
        ],
        ooh: ['Digital-native series. No OOH executions.'],
        prompts: [
          'Cinematic interview portrait, real person sitting in their living room, natural light from window, looking past camera, restrained framing, palette of warm grey and oat, no styling, no makeup, mood of honest stillness, 85mm lens, documentary tone.',
          'Documentary still: hands holding a coffee cup at a kitchen counter, morning light, vertical 9:16, palette of warm white and cream, no people visible above shoulders.',
          'Real person seated on a balcony at dusk, city distant and unfocused, palette of warm grey and amber, cinematic 50mm, intimate documentary framing.',
          'Hands resting on a dining table mid-conversation, soft natural light, palette of oat and warm white, vertical 9:16, documentary macro.',
        ],
        videoPrompts: [
          'Vertical 9:16, 12 seconds, slow handheld portrait of a real person speaking off-camera, soft window light, palette of warm grey and oat, documentary tone.',
          'Vertical 9:16, 10 seconds, hands on a kitchen counter, no faces, morning light, intimate cinematic.',
        ],
        artStyle: 'documentary',
      },
      {
        title: 'The Address You Don\'t Need to Say',
        type: 'OOH + print',
        bigIdea: 'Pure restraint. Black and white. One image per execution. One line. Anti-marketing. The audience is the audience that already knows.',
        scenes: [
          'Static print and OOH only. No film.',
          'Distribution: DIFC, Downtown, City Walk, key airports.',
          'Eight executions in the launch wave.',
        ],
        cutdowns: ['8 print + OOH executions, each a single photograph + one line'],
        ooh: [
          'The address you don\'t need to say.',
          'Some keys are heavier than others.',
          'Few. Quiet. Yours.',
          'Built before the city expected it.',
          'A name that opens doors. Including this one.',
          'You don\'t move here. You return.',
          'The first floor that catches the sun.',
          'Some homes are bought once and inherited twice.',
        ],
        prompts: [
          'Black and white still photograph, a single ornate brass door key resting on folded white linen, top-down, soft natural light, palette of pure black white cream, fine grain, mood of restraint and prestige, no logo, no text.',
          'Black and white architectural photograph, single doorway shot from inside looking out into bright daylight, palette of deep black and bright white, fine grain, restrained framing, no people.',
          'Black and white close-up of a brass house number on a stone wall, morning shadow, palette of pure black white, fine grain texture, no other elements visible.',
          'Black and white wide architectural shot of an empty elegant lobby at dawn, marble floor, single column, palette of pure black white, fine grain, no people, no text.',
        ],
        videoPrompts: [
          'Vertical 9:16, 8 seconds, slow zoom on a brass door handle being touched, black and white, cinematic restraint.',
          'Vertical 9:16, 10 seconds, slow push-in on an empty lobby at dawn, black and white, palette of pure black white, no movement except dust in light.',
        ],
        artStyle: 'monochrome-luxury',
      },
    ];
  },

  _future(intake) {
    return [
      {
        horizon: '+1 year · 2027',
        prediction: `AI-personalized discovery replaces broker/retailer first-touch for 30-50% of HNW leads in ${intake.industry || 'this category'}. Whoever owns the AI layer owns the lead.`,
        confidence: 'High',
        signal: 'Smaller competitors piloting now. Cost curve on multilingual conversational AI has collapsed below junior-staff hourly cost.',
        bet: 'Launch AI Concierge as a branded product before competitors catch up. Window closes by Q4 2027.',
        color: 'var(--green)',
      },
      {
        horizon: '+3 years · 2029',
        prediction: '"Longevity / wellness" becomes a recognized buyer category. Air, water, light, biophilia enter the buyer\'s first three questions.',
        confidence: 'Medium-high',
        signal: 'Six Senses-led wellness residences. Buyer fluency in longevity science rising. HEPA and air-quality questions entering design briefs.',
        bet: 'Reframe pipeline under a longevity narrative now. Products stay as designed; positioning shifts.',
        color: 'var(--blue)',
      },
      {
        horizon: '+5 years · 2031',
        prediction: 'Branded products saturate. Premium shifts from the brand on the door to the membership, service ecosystem, and community around it.',
        confidence: 'Medium',
        signal: 'Branded-residence pipeline growth flattening in mature markets. Member-program emphasis rising across luxury categories.',
        bet: 'Begin "Life After Purchase" ecosystem build now. Competitors who haven\'t started by 2028 cannot catch up.',
        color: 'var(--purple)',
      },
    ];
  },

  _competitors(industry, intake) {
    const map = {
      'real estate': [
        { name: 'Sobha Realty', strength: 'Resident-led storytelling, A Day In series', weakness: 'Smaller portfolio reach', threat: 'High' },
        { name: 'Damac Properties', strength: 'Bold creator partnerships, Cavalli branded residences', weakness: 'Polarizing aesthetic', threat: 'High' },
        { name: 'Aldar Properties', strength: 'Abu Dhabi government anchor, Yas Island lifestyle', weakness: 'Less Dubai-centric', threat: 'Medium' },
        { name: 'Binghatti', strength: 'Aggressive digital, viral architectural language', weakness: 'Brand prestige still building', threat: 'Medium' },
        { name: 'Ellington Properties', strength: 'Design-led, wellness-first positioning', weakness: 'Smaller pipeline', threat: 'Medium' },
      ],
      'perfume': [
        { name: 'Amouage', strength: 'Heritage Omani luxury, gallery retail', weakness: 'Tradition-anchored, slow to digital', threat: 'High' },
        { name: 'Le Labo', strength: 'Cult positioning, store-as-brand', weakness: 'Premium price ceiling', threat: 'High' },
        { name: 'Rasasi', strength: 'GCC distribution depth, mass-premium', weakness: 'Lower luxury cachet', threat: 'Medium' },
        { name: 'Maison Francis Kurkdjian', strength: 'Parisian craft, niche-luxury', weakness: 'Less GCC-native', threat: 'Medium' },
        { name: 'Roja Parfums', strength: 'Ultra-luxury positioning, master perfumer brand', weakness: 'Distribution narrow', threat: 'Medium' },
      ],
      'cafe': [
        { name: '%Arabica', strength: 'Minimalist brand IP, global expansion', weakness: 'Aesthetic now copied', threat: 'High' },
        { name: 'Stumptown / Blue Bottle', strength: 'Third-wave heritage', weakness: 'Mass-acquired, soul questioned', threat: 'Medium' },
        { name: 'Local craft roasters', strength: 'Authenticity, founder-led story', weakness: 'Scale-limited', threat: 'Medium' },
      ],
    };
    for (const k in map) if (industry.includes(k)) return map[k];
    return [
      { name: 'Top competitor 1', strength: 'Larger marketing budget, established creator relationships', weakness: 'Slow to innovate, brand fatigue setting in', threat: 'High' },
      { name: 'Top competitor 2', strength: 'Native to TikTok, viral content cadence', weakness: 'Premium positioning weaker', threat: 'High' },
      { name: 'Top competitor 3', strength: 'Strong CRM, retention focus', weakness: 'Top-of-funnel discovery underweight', threat: 'Medium' },
      { name: 'Emerging challenger', strength: 'AI-native, fast iteration', weakness: 'Small brand recognition', threat: 'Medium' },
      { name: 'Adjacent category disruptor', strength: 'Different category, similar customer', weakness: 'Outside your category proper', threat: 'Low-Medium' },
    ];
  },

  /* ============ COPY HELPERS ============ */
  copy(text, el) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (el) {
        const prev = el.textContent;
        el.textContent = 'Copied';
        el.classList.add('copied');
        setTimeout(() => {
          el.textContent = prev;
          el.classList.remove('copied');
        }, 1400);
      }
      this.toast('Copied to clipboard');
      return true;
    }
    return false;
  },

  toast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  },

  /* ============ REFRESH (Claude integration prompt builder) ============ */
  buildRefreshPrompt(intake, plan) {
    return `You are running the Trend Analyst agent of the cyob.live war room system. Refresh the trend radar for the target below.

TARGET
Company: ${intake.company}
Industry: ${intake.industry}
Geography: ${intake.geography}
Size: ${intake.size}
Vibe: ${intake.vibe}
Audience: ${intake.audience}
Budget tier: ${intake.budget}

CURRENT TRENDS IN THE SYSTEM
${plan.trends.map(t => `- ${t.name} · heat ${t.heat} · ${t.dir}`).join('\n')}

YOUR TASK
1. Web-search for current (last 30 days) trend signals in this industry and geography on TikTok, Instagram Reels, Google Trends, and paid ads.
2. Update the heat score for each existing trend. Mark dead trends.
3. Add up to 3 NEW trends I'm missing, with named evidence (creator handles, hashtags, search queries, ad examples).
4. For each trend, provide a clickable evidence URL.
5. End with the 5 emerging trends nobody in this category is using yet — the white space.

OUTPUT
Be specific. Cite evidence. Do not hedge.`;
  },
};

CYOB.init();
window.CYOB = CYOB;
