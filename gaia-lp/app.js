/* Gaia landing page — page-level behaviour.
   The Before/After and conversation sections carry their own scripts (see build.py). */
(function () {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reveal on scroll: add .in to [data-reveal] sections once ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* ---------- Logo grid: two copies of the 16 logos, scrolling behind the copy ---------- */
  const LOGOS = [
    ['tommyjohn.svg', 112, 24], ['tushy', 112, 20], ['suitshop.svg', 112, 19], ['arcteryx.svg', 68, 56],
    ['timbuk2.svg', 112, 32], ['bareminerals.svg', 112, 16], ['billabong.svg', 49, 42], ['drbronners.svg', 112, 45],
    ['orthofeet.svg', 106, 25], ['osea.svg', 67, 41], ['comfrt.svg', 112, 30], ['perfectted.svg', 75, 40],
    ['castore.svg', 51, 42], ['analuisa.svg', 112, 20], ['aliceolivia.svg', 112, 23], ['mizzenmain.svg', 111, 13]
  ];
  const track = document.getElementById('logosTrack');
  if (track) {
    const tile = ([f, w, h]) => f === 'tushy'
      ? `<div class="logos__tile"><span class="mask"></span></div>`
      : `<div class="logos__tile"><img src="assets/img/logos/${f}" alt="" style="width:${w}px;height:${h}px"></div>`;
    track.innerHTML = LOGOS.map(tile).join('') + LOGOS.map(tile).join('');
  }

  /* ---------- Start with a sentence: cards, two copies for a seamless loop ---------- */
  const PROMPTS = [
    ['“Review my existing AI Agent guidances and draft improved versions that reduce handovers.”', 'Optimization'],
    ['“Review my current AI Agent guidance and suggest improvements.”', 'Audit'],
    ['“Analyze my AI Agent performance metrics and tell me what’s dragging automation down.”', 'Analytics'],
    ['“Resolve conflicts across my macros, knowledge base, and guidances.”', 'Analytics'],
    ['“Find the Skills that stopped matching in the last 30 days and tell me why.”', 'Diagnose'],
    ['“Draft a return-policy answer in our voice from the last 50 return tickets.”', 'Draft']
  ];
  const st = document.getElementById('sentenceTrack');
  if (st) {
    const card = ([q, l]) => `<div class="pcard"><p>${q}</p><span class="lbl">${l}</span></div>`;
    st.innerHTML = PROMPTS.map(card).join('') + PROMPTS.map(card).join('');
  }

  /* ---------- Diagnose: shimmer that sweeps across the three cards, left to right ---------- */
  const dcards = document.getElementById('dcards');
  if (dcards && !reduced) {
    const cards = [...dcards.children];
    let t0 = 0;
    const PERIOD = 6000, SWEEP = 3200;        // one sweep every 6s, lasting 3.2s
    function frame(t) {
      if (!t0) t0 = t;
      const p = ((t - t0) % PERIOD) / SWEEP;   // 0..1 during the sweep, >1 while resting
      const rowW = dcards.offsetWidth;
      const x = -160 + (rowW + 320) * Math.min(1, p);
      cards.forEach(c => {
        const local = x - c.offsetLeft;
        c.style.setProperty('--sx', p > 1 ? '-999px' : local + 'px');
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Shared chats: messages arrive one by one when the section first shows ---------- */
  const shared = document.getElementById('sharedApp');
  if (shared) {
    const msgs = [...shared.querySelectorAll('.sc__msg')];
    const once = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      once.disconnect();
      const delays = [500, 1500, 3100, 4300];
      msgs.forEach((m, i) => setTimeout(() => m.classList.add('show'), reduced ? 0 : delays[i]));
    }, { threshold: 0.5 });
    once.observe(shared);
  }

  /* ---------- FAQ ---------- */
  const FAQ = [
    ['What is Gaia?', 'Gaia is the AI for your support team. AI Agent works with your shoppers; Gaia works with your team. Tell it what you want handled, and it builds the setup with you, finds what’s holding your automation back, and drafts fixes when you ask.'],
    ['Does Gaia change anything without my approval?', 'No. Gaia reports what it finds and drafts a fix only when you ask. Nothing reaches your live setup until you approve it.'],
    ['How does Gaia decide what to fix?', 'It reads handovers, low-CSAT replies and conflicting knowledge across your account, then ranks the gaps by how much automation they are costing you.'],
    ['What is Gaia Hub?', 'The new front door to Gorgias. It shows how your account is doing at a glance, with a place to ask Gaia what moved, what is slipping, or what to fix first.'],
    ['Can agents still work the queue the same way?', 'Yes. Gaia sits alongside the queue. Agents can summarize a ticket, look up a customer or draft a reply without leaving the conversation.'],
    ['Can a Routine reply to a customer?', 'No. Routines read and report. They never send anything to a shopper.'],
    ['Where do Routine results show up?', 'In the chat where the Routine was created, in Gorgias, at the time you set. Everyone in that chat sees them.'],
    ['Who can see a shared chat?', 'Anyone on your team you share the link with. The link stays read-only and inside your account.'],
    ['Who on my team can use Gaia?', 'Everyone, with the same permissions each person already has in Gorgias. Admins and leads can also set up and coach AI Agent and create Routines.'],
    ['How much does Gaia cost?', 'Gaia is included with Gorgias AI plans. Talk to your account manager for details.']
  ];
  const faq = document.getElementById('faq');
  if (faq) {
    faq.innerHTML = FAQ.map(([q, a], i) => `
      <div class="faq__item${i === 0 ? ' open' : ''}">
        <button class="faq__q" aria-expanded="${i === 0}"><span>${q}</span><span class="ico"><img src="assets/img/faq-plus.svg" alt=""></span></button>
        <div class="faq__a"><div><p>${a}</p></div></div>
      </div>`).join('');
    faq.addEventListener('click', (e) => {
      const b = e.target.closest('.faq__q'); if (!b) return;
      const item = b.parentElement, open = item.classList.toggle('open');
      b.setAttribute('aria-expanded', String(open));
    });
  }
})();
