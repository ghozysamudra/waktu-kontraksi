<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import ChartNoAxesColumn from '@lucide/svelte/icons/chart-no-axes-column';
  import Clock3 from '@lucide/svelte/icons/clock-3';
  import History from '@lucide/svelte/icons/history';
  import Hourglass from '@lucide/svelte/icons/hourglass';
  import LockKeyhole from '@lucide/svelte/icons/lock-keyhole';
  import Play from '@lucide/svelte/icons/play';
  import Square from '@lucide/svelte/icons/square';
  import Timer from '@lucide/svelte/icons/timer';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import X from '@lucide/svelte/icons/x';
  import '@fontsource-variable/dm-sans/wght.css';
  import '@fontsource-variable/lora/wght.css';
  import dmSansLatinFont from '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2?url';
  import loraLatinFont from '@fontsource-variable/lora/files/lora-latin-wght-normal.woff2?url';

  import logo from '../../assets/logo.png';
  import sprig from './sprig.webp';
  import { formatDuration, formatElapsed, readSession, storageKey, type Session } from './contractions';
  import { getCanonicalUrl, getOgImageUrl, getRoutePath, siteName, siteUrl } from './site';
  import { translations, type Language } from './translations';

  let { language }: { language: Language } = $props();

  const languageKey = 'waktu-kontraksi.language';
  const languageLabels = { id: 'ID – Bahasa Indonesia', en: 'EN – English' } as const;
  const lightDismissAttr = { closedby: 'any' } as Record<string, string>;

  let copy = $derived(translations[language]);
  let nextLanguage: Language = $derived(language === 'id' ? 'en' : 'id');
  let otherRoute = $derived(getRoutePath(nextLanguage));

  let canonicalUrl = $derived(getCanonicalUrl(language));
  let idUrl = getCanonicalUrl('id');
  let enUrl = getCanonicalUrl('en');
  let ogImageUrl = $derived(getOgImageUrl(language));
  let ogLocale = $derived(language === 'id' ? 'id_ID' : 'en_US');
  let ogAlternateLocale = $derived(language === 'id' ? 'en_US' : 'id_ID');

  let structuredDataJson = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          name: siteName,
          url: idUrl,
          inLanguage: ['id', 'en']
        },
        {
          '@type': 'WebApplication',
          '@id': `${canonicalUrl}#app`,
          name: copy.appName,
          alternateName: ['Waktu Kontraksi', 'Timer Kontraksi', 'Contraction Timer'],
          url: canonicalUrl,
          description: copy.description,
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Any',
          browserRequirements: 'Requires JavaScript',
          inLanguage: language,
          isAccessibleForFree: true,
          image: ogImageUrl,
          featureList: copy.featureList,
          isPartOf: { '@id': `${siteUrl}/#website` },
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: language === 'id' ? 'IDR' : 'USD'
          }
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          inLanguage: language,
          isPartOf: { '@id': `${siteUrl}/#website` },
          mainEntity: copy.faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        }
      ]
    }).replace(/</g, '\\u003c')
  );

  let session = $state.raw<Session>({ activeStart: null, records: [] });
  let ready = $state(false);
  let storageUnavailable = $state(false);
  let now = $state(0);
  let message = $state<keyof typeof copy.feedback | null>(null);
  let guideDialog: HTMLDialogElement;
  let deleteDialog: HTMLDialogElement;
  let historyTitle: HTMLHeadingElement;
  let deleteTarget = $state<number | 'all'>('all');

  let locale = $derived(language === 'id' ? 'id-ID' : 'en-GB');
  let dateFormat = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }));
  let timeFormat = $derived(
    new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  );

  let records = $derived(session.records);
  let running = $derived(session.activeStart !== null);
  let elapsed = $derived(session.activeStart === null ? 0 : now - session.activeStart);
  let average = $derived(
    records.length
      ? records.reduce((sum, record) => sum + record.endedAt - record.startedAt, 0) / records.length
      : null
  );
  let latestInterval = $derived(
    records.length > 1 ? records[0].startedAt - records[1].startedAt : null
  );

  function syncStorage() {
    if (!storageUnavailable) {
      try {
        session = readSession(localStorage.getItem(storageKey));
      } catch {
        storageUnavailable = true;
      }
    }
    now = Date.now();
  }

  function rememberNextLanguage() {
    try {
      localStorage.setItem(languageKey, nextLanguage);
    } catch {
      // Navigation still applies the chosen language.
    }
  }

  $effect(() => {
    document.documentElement.lang = language;
  });

  onMount(() => {
    if (language === 'id') {
      try {
        if (localStorage.getItem(languageKey) === 'en') {
          void goto('/en', { replaceState: true });
          return;
        }
      } catch {
        // Keep the current page when storage is blocked.
      }
    }

    syncStorage();
    ready = true;

    function handleStorage(event: StorageEvent) {
      if (event.key === storageKey || event.key === null) syncStorage();
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') syncStorage();
    }

    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  });

  $effect(() => {
    if (!running) return;
    const ticker = window.setInterval(() => (now = Date.now()), 200);
    return () => window.clearInterval(ticker);
  });

  function save(nextSession: Session) {
    session = nextSession;
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextSession));
      storageUnavailable = false;
    } catch {
      storageUnavailable = true;
    }
  }

  function toggleTimer() {
    const visibleStart = session.activeStart;
    syncStorage();
    if (session.activeStart !== visibleStart) return;

    if (visibleStart === null) {
      const lastStart = session.records[0]?.startedAt ?? 0;
      save({ ...session, activeStart: Math.max(now, lastStart + 1) });
      message = null;
      return;
    }

    const endedAt = Math.max(now, visibleStart);
    save({
      activeStart: null,
      records: [{ startedAt: visibleStart, endedAt }, ...session.records]
    });
    message = storageUnavailable ? 'temporary' : 'saved';
  }

  function cancelTimer() {
    const visibleStart = session.activeStart;
    syncStorage();
    if (visibleStart === null || session.activeStart !== visibleStart) return;
    save({ ...session, activeStart: null });
    message = 'cancelled';
  }

  function askDelete(target: number | 'all') {
    deleteTarget = target;
    deleteDialog.showModal();
  }

  async function handleDelete() {
    const confirmed = deleteDialog.returnValue === 'delete';
    deleteDialog.returnValue = '';
    if (!confirmed) return;

    syncStorage();
    save({
      ...session,
      records:
        deleteTarget === 'all'
          ? []
          : session.records.filter((record) => record.startedAt !== deleteTarget)
    });
    message = storageUnavailable ? 'unsaved' : deleteTarget === 'all' ? 'cleared' : 'deleted';

    await tick();
    if (document.activeElement === document.body) historyTitle.focus();
  }
</script>

<svelte:head>
  <title>{copy.title}</title>
  <meta name="description" content={copy.description} />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta name="application-name" content={siteName} />
  <meta name="apple-mobile-web-app-title" content={siteName} />

  <link rel="canonical" href={canonicalUrl} />
  <link rel="alternate" hreflang="id" href={idUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={idUrl} />

  <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="ard" href="/.well-known/ard.json" />

  <link rel="preload" href={loraLatinFont} as="font" type="font/woff2" crossorigin="anonymous" />
  <link rel="preload" href={dmSansLatinFont} as="font" type="font/woff2" crossorigin="anonymous" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:title" content={copy.ogTitle} />
  <meta property="og:description" content={copy.description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogAlternateLocale} />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:secure_url" content={ogImageUrl} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={copy.ogImageAlt} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={copy.ogTitle} />
  <meta name="twitter:description" content={copy.description} />
  <meta name="twitter:image" content={ogImageUrl} />
  <meta name="twitter:image:alt" content={copy.ogImageAlt} />

  {@html `<script type="application/ld+json">${structuredDataJson}</script>`}
</svelte:head>

<header class="site-header">
  <div class="shell header-inner">
    <div class="brand">
      <img class="brand-logo" src={logo} width="44" height="44" decoding="async" alt="" />
      <span lang="id">{siteName}</span>
    </div>
    <div class="header-actions">
      <button type="button" class="header-button" onclick={() => guideDialog.showModal()}>
        <BookOpen size={17} strokeWidth={1.7} aria-hidden="true" />
        {copy.guide}
      </button>
      <a
        href={otherRoute}
        hreflang={nextLanguage}
        class="header-button language-button"
        lang={nextLanguage}
        aria-label={languageLabels[nextLanguage]}
        onclick={rememberNextLanguage}
      >
        {nextLanguage.toUpperCase()}
      </a>
    </div>
  </div>
</header>

<main class="shell">
  <div class="intro">
    <h1>{copy.heading}</h1>
    <p>{copy.intro}</p>
  </div>

  <div class="dashboard">
    <section class="card timer-card" aria-labelledby="timer-title">
      <div class="card-heading timer-heading">
        <div class="heading-label">
          <span class="icon-tile rose"><Timer size={20} strokeWidth={1.7} aria-hidden="true" /></span>
          <h2 id="timer-title">{copy.timer}</h2>
        </div>
        <span class="state-pill" class:running role="status">
          <span class="state-dot" aria-hidden="true"></span>
          {running ? copy.recording : copy.ready}
        </span>
      </div>

      <div class="timer-face" class:running>
        <div class="timer-dial">
          <Timer size={22} strokeWidth={1.45} aria-hidden="true" />
          <div class="clock" class:long-clock={elapsed >= 3_600_000} role="timer" aria-label={copy.timerLabel} aria-describedby="clock-units">
            {formatElapsed(elapsed)}
          </div>
          <span class="clock-label" id="clock-units">{elapsed >= 3_600_000 ? copy.longClockLabel : copy.shortClockLabel}</span>
        </div>
      </div>

      <button class="primary timer-action" class:running type="button" onclick={toggleTimer} disabled={!ready}>
        {#if running}
          <Square size={15} fill="currentColor" aria-hidden="true" />
          {copy.stop}
        {:else}
          <Play size={17} fill="currentColor" aria-hidden="true" />
          {copy.start}
        {/if}
      </button>

      <p class="timer-hint">
        {running ? copy.stopHint : copy.startHint}
      </p>
      <div class="timer-feedback">
        {#if running}
          <button class="text-button" type="button" onclick={cancelTimer}>{copy.cancelTimer}</button>
        {:else}
          <span role="status">{message ? copy.feedback[message] : ''}</span>
        {/if}
      </div>
      {#if storageUnavailable}
        <p class="storage-error" role="alert">{copy.storageError}</p>
      {/if}
    </section>

    <div class="sidebar">
      <section class="card summary-card" aria-labelledby="summary-title">
        <div class="card-heading">
          <div class="heading-label">
            <span class="icon-tile sage"><ChartNoAxesColumn size={20} strokeWidth={1.7} aria-hidden="true" /></span>
            <h2 id="summary-title">{copy.summary}</h2>
          </div>
        </div>

        <dl class="stats">
          <div>
            <dt><History size={17} aria-hidden="true" /> {copy.total}</dt>
            <dd>{records.length}{#if copy.totalUnit}<span>{copy.totalUnit}</span>{/if}</dd>
          </div>
          <div>
            <dt><Hourglass size={17} aria-hidden="true" /> {copy.average}</dt>
            <dd>{average === null ? '—' : formatDuration(average, language)}</dd>
          </div>
          <div>
            <dt><Clock3 size={17} aria-hidden="true" /> {copy.latestInterval}</dt>
            <dd>{latestInterval === null ? '—' : formatDuration(latestInterval, language)}</dd>
          </div>
        </dl>
      </section>

      <section class="card guide-card" aria-labelledby="guide-card-title">
        <img class="sprig" src={sprig} width="300" height="450" decoding="async" alt="" />
        <div class="guide-copy">
          <BookOpen size={20} strokeWidth={1.7} aria-hidden="true" />
          <h2 id="guide-card-title">{copy.guideCardTitle}</h2>
          <p>{copy.guideCardText}</p>
          <button type="button" class="guide-button" onclick={() => guideDialog.showModal()}>
            {copy.openGuide}
          </button>
        </div>
      </section>
    </div>
  </div>

  <section class="card history-card" aria-labelledby="history-title">
    <div class="card-heading history-heading">
      <div class="heading-label">
        <span class="icon-tile rose"><History size={20} strokeWidth={1.7} aria-hidden="true" /></span>
        <h2 bind:this={historyTitle} tabindex="-1" id="history-title">{copy.history}</h2>
      </div>
      {#if records.length}
        <button class="text-button delete-all" type="button" onclick={() => askDelete('all')}>{copy.clearHistory}</button>
      {/if}
    </div>

    {#if records.length}
      <p class="history-note" id="history-note">{copy.intervalDefinition}</p>
      <table aria-labelledby="history-title" aria-describedby="history-note">
        <thead>
          <tr>
            <th scope="col">{copy.startedAt}</th>
            <th scope="col">{copy.duration}</th>
            <th scope="col">{copy.interval}</th>
            <th scope="col"><span class="sr-only">{copy.actions}</span></th>
          </tr>
        </thead>
        <tbody>
          {#each records as record, index (record.startedAt)}
            {@const previous = records[index + 1]}
            <tr>
              <td>
                <time datetime={new Date(record.startedAt).toISOString()}>
                  <strong>{timeFormat.format(record.startedAt)}</strong>
                  <span class="record-date">{dateFormat.format(record.startedAt)}</span>
                </time>
              </td>
              <td>{formatDuration(record.endedAt - record.startedAt, language)}</td>
              <td>{previous ? formatDuration(record.startedAt - previous.startedAt, language) : '—'}</td>
              <td>
                <button
                  type="button"
                  class="icon-button"
                  aria-label={copy.deleteRecordLabel(dateFormat.format(record.startedAt), timeFormat.format(record.startedAt))}
                  onclick={() => askDelete(record.startedAt)}
                >
                  <Trash2 size={17} strokeWidth={1.65} aria-hidden="true" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <div class="empty-history">
        <span class="empty-icon"><Clock3 size={22} strokeWidth={1.5} aria-hidden="true" /></span>
        <p><strong>{copy.emptyHistory}</strong></p>
        <p>{copy.emptyHint}</p>
      </div>
    {/if}
  </section>

  <section class="card faq-card" id="panduan" aria-labelledby="faq-title">
    <div class="card-heading">
      <div class="heading-label">
        <span class="icon-tile sage"><BookOpen size={20} strokeWidth={1.7} aria-hidden="true" /></span>
        <h2 id="faq-title">{copy.faqSectionTitle}</h2>
      </div>
    </div>

    <p class="faq-intro">{copy.faqSectionIntro}</p>

    <dl class="guide-definitions inline-definitions">
      <div>
        <dt>{copy.duration}</dt>
        <dd>{copy.durationDefinition}</dd>
      </div>
      <div>
        <dt>{copy.interval}</dt>
        <dd>{copy.intervalDefinition}</dd>
      </div>
    </dl>

    <div class="faq-list">
      {#each copy.faqItems as item (item.question)}
        <details class="faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      {/each}
    </div>

    <div class="care-note inline-care-note">
      <h3>{copy.careTitle}</h3>
      <p>{copy.care}</p>
      <p><strong>{copy.urgentCareLead}</strong> {copy.urgentCare}</p>
      <a href="https://www.nhs.uk/pregnancy/labour-and-birth/signs-that-labour-has-begun/" target="_blank" rel="noopener noreferrer">{copy.source}</a>
    </div>
  </section>
</main>

<footer class="page-footer shell">
  <LockKeyhole size={15} aria-hidden="true" />
  <span>{copy.privacy}</span>
</footer>

<dialog bind:this={guideDialog} aria-labelledby="guide-title" {...lightDismissAttr}>
  <div class="dialog-heading">
    <h2 id="guide-title">{copy.guideTitle}</h2>
    <form method="dialog">
      <button type="submit" class="icon-button" aria-label={copy.closeGuide}>
        <X size={22} aria-hidden="true" />
      </button>
    </form>
  </div>
  <dl class="guide-definitions">
    <div>
      <dt>{copy.duration}</dt>
      <dd>{copy.durationDefinition}</dd>
    </div>
    <div>
      <dt>{copy.interval}</dt>
      <dd>{copy.intervalDefinition}</dd>
    </div>
  </dl>
  <h3>{copy.patternsTitle}</h3>
  <p>{copy.patterns}</p>
  <p>{copy.assessment}</p>
  <div class="care-note">
    <h3>{copy.careTitle}</h3>
    <p>{copy.care}</p>
    <p><strong>{copy.urgentCareLead}</strong> {copy.urgentCare}</p>
    <a href="https://www.nhs.uk/pregnancy/labour-and-birth/signs-that-labour-has-begun/" target="_blank" rel="noopener noreferrer">{copy.source}</a>
  </div>
</dialog>

<dialog bind:this={deleteDialog} onclose={handleDelete} aria-labelledby="delete-title" aria-describedby="delete-description">
  <h2 id="delete-title">{deleteTarget === 'all' ? copy.confirmClear : copy.confirmDelete}</h2>
  <p id="delete-description">{copy.deleteDescription}</p>
  <form class="dialog-actions" method="dialog">
    <button class="secondary" type="submit" value="cancel">{copy.cancel}</button>
    <button class="primary" type="submit" value="delete">{copy.delete}</button>
  </form>
</dialog>

<style>
  :global(html) {
    color-scheme: light;
    background: #faf6ef;
  }

  :global(body) {
    --ink: #362923;
    --muted: #6c5d54;
    --cream: #fffdf9;
    --line: #e9ded3;
    --rose: #a24e43;
    --sage: #46533a;
    --serif: 'Lora Variable', Georgia, serif;
    margin: 0;
    color: var(--ink);
    font-family: 'DM Sans Variable', system-ui, sans-serif;
    line-height: 1.5;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(:focus-visible) {
    outline: 2px solid #754036;
    outline-offset: 4px;
  }

  h1, h2, h3, p, dl, dd {
    margin: 0;
  }

  h1, h2, h3 {
    line-height: 1.2;
    text-wrap: balance;
  }

  p { text-wrap: pretty; }

  button,
  .language-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    min-block-size: 44px;
    min-inline-size: 44px;
    padding: 0.5rem 0.9rem;
    border: 1px solid transparent;
    border-radius: 0.7rem;
    color: inherit;
    background: transparent;
    font: inherit;
    font-weight: 650;
    text-decoration: none;
    cursor: pointer;
    touch-action: manipulation;
    transition: background-color 140ms ease, transform 130ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  button:active,
  .language-button:active { transform: scale(0.98); }
  button:disabled { cursor: wait; opacity: 0.65; }

  @media (hover: hover) and (pointer: fine) {
    button:not(.primary):hover,
    .language-button:hover { background-color: #f3e9df; }
    .primary:hover { background: #924338; }
    .timer-action.running:hover { background: #74332c; }
    button.guide-button:hover { background-color: #e2e8d8; }
    .faq-item summary:hover { color: var(--rose); }
  }

  .shell {
    width: min(calc(100% - 3rem), 66rem);
    margin-inline: auto;
  }

  .site-header {
    border-bottom: 1px solid var(--line);
    background: #fffbf6;
  }

  .header-inner {
    min-block-size: 4.55rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-family: var(--serif);
    font-weight: 650;
    font-size: 1.12rem;
    letter-spacing: -0.045em;
  }

  .icon-tile, .empty-icon {
    display: grid;
    place-items: center;
    flex: none;
    inline-size: 2.5rem;
    block-size: 2.5rem;
    border-radius: 0.8rem;
  }

  .brand-logo {
    flex: none;
    display: block;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .language-button { padding-inline: 0.6rem; }

  .header-button {
    border-color: var(--line);
    font-size: 0.9rem;
    background: var(--cream);
  }

  .intro {
    padding-block: 2.75rem 1.85rem;
  }

  .intro h1 {
    font-family: var(--serif);
    font-size: clamp(2.1rem, 5.2vw, 3.55rem);
    font-weight: 560;
    letter-spacing: -0.06em;
  }

  .intro p {
    margin-top: 0.6rem;
    color: var(--muted);
    font-size: clamp(1rem, 1.75vw, 1.1rem);
  }

  .dashboard {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
    gap: 1.25rem;
  }

  .card {
    min-inline-size: 0;
    border: 1px solid var(--line);
    border-radius: 1.35rem;
    background: var(--cream);
    box-shadow: 0 3px 14px #53352606;
  }

  .card-heading, .heading-label {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .card-heading {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .heading-label h2 {
    font-size: 1.12rem;
    font-weight: 720;
    letter-spacing: -0.035em;
  }

  .rose {
    background: #f7e8e1;
    color: #984b40;
  }

  .sage {
    background: #edf0e5;
    color: var(--sage);
  }

  .timer-card {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1.45rem 1.55rem 0.55rem;
  }

  .timer-heading {
    align-self: stretch;
  }

  .state-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.34rem 0.65rem;
    border-radius: 5rem;
    background: #edf0e5;
    color: var(--sage);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .state-pill.running {
    background: #f8e5df;
    color: #873c34;
  }

  .state-dot {
    inline-size: 0.46rem;
    block-size: 0.46rem;
    border-radius: 50%;
    background: currentColor;
  }

  .timer-face {
    display: grid;
    place-items: center;
    width: min(100%, 14.4rem);
    aspect-ratio: 1;
    margin-block: 0.8rem 1.15rem;
    padding: 0.55rem;
    border: 1px dashed #d9aa9a;
    border-radius: 50%;
    background: #fffbf7;
  }

  .timer-dial {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid #f0d6cc;
    border-radius: 50%;
    background: radial-gradient(circle at 48% 47%, #fff9f5 15%, #f9e9e1 100%);
    color: var(--rose);
  }

  .timer-face.running {
    border-color: var(--rose);
  }

  .running .timer-dial {
    border-color: #d89c8e;
    background: radial-gradient(circle at 48% 47%, #fff7f1 12%, #f6d8cd 100%);
  }

  .clock {
    color: var(--ink);
    font-variant-numeric: tabular-nums;
    font-size: clamp(2.75rem, 7vw, 4rem);
    font-weight: 575;
    line-height: 1.13;
    letter-spacing: -0.065em;
    margin-block: 0.24rem 0.15rem;
  }

  .clock.long-clock { font-size: clamp(1.6rem, 6vw, 2.45rem); }

  .clock-label {
    color: #8a5447;
    text-transform: uppercase;
    font-size: 0.68rem;
    font-weight: 720;
    letter-spacing: 0.14em;
  }

  .primary {
    border-color: #91463c;
    background: var(--rose);
    color: white;
  }

  .timer-action {
    width: min(100%, 22rem);
    min-block-size: 3.65rem;
    border-radius: 0.9rem;
    box-shadow: 0 3px 8px #8b3b3428;
    font-size: 1.125rem;
  }

  .timer-action.running { background: #843d35; }

  .timer-hint {
    margin-top: 0.65rem;
    color: var(--muted);
    text-align: center;
    font-size: 0.9rem;
  }

  .timer-feedback {
    min-block-size: 44px;
    display: grid;
    place-items: center;
    color: var(--sage);
    font-size: 0.87rem;
    text-align: center;
  }

  .text-button {
    color: #873e35;
    font-size: 0.85rem;
  }

  .storage-error {
    margin-bottom: 0.75rem;
    padding: 0.65rem 0.8rem;
    border-radius: 0.6rem;
    background: #f8e5df;
    color: #75362e;
    font-size: 0.9rem;
  }

  .sidebar {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 1.25rem;
  }

  .summary-card, .guide-card, .history-card, .faq-card {
    padding: 1.35rem 1.45rem;
  }

  .stats {
    margin-top: 0.75rem;
  }

  .stats > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.15rem 0.5rem;
    padding-block: 0.55rem;
    border-bottom: 1px solid var(--line);
  }

  .stats > div:last-child {
    padding-bottom: 0.05rem;
    border-bottom: 0;
  }

  .stats dt {
    display: flex;
    align-items: center;
    gap: 0.58rem;
    color: var(--muted);
    font-size: 0.91rem;
  }

  .stats dt :global(svg) { color: #7a826a; }

  .stats dd {
    font-size: 1.02rem;
    font-variant-numeric: tabular-nums;
    font-weight: 725;
  }

  .stats dd span {
    margin-inline-start: 0.25em;
    color: var(--muted);
    font-size: 0.82rem;
    font-weight: 500;
  }

  .guide-card {
    display: flex;
    align-items: center;
    position: relative;
    isolation: isolate;
    border-color: #dbe0cf;
    background: #edf0e5;
    color: var(--sage);
  }

  .sprig {
    position: absolute;
    z-index: -1;
    inset-block: 0;
    inset-inline-end: 0.2rem;
    margin-block: auto;
    width: min(40%, 10rem);
    height: 95%;
    object-fit: contain;
    opacity: 0.88;
    pointer-events: none;
  }

  .guide-copy { width: min(72%, 15rem); }

  .guide-copy h2 {
    margin-top: 0.3rem;
    font-family: var(--serif);
    font-weight: 625;
    font-size: 1.68rem;
    letter-spacing: -0.045em;
  }

  .guide-copy p {
    margin-block: 0.44rem 0.9rem;
    font-size: 0.9rem;
  }

  .guide-button {
    border-color: #c8d0ba;
    background: #f8faf3;
    font-size: 0.87rem;
  }

  .history-card,
  .faq-card {
    margin-top: 1.25rem;
  }

  .empty-history {
    display: grid;
    justify-items: center;
    gap: 0.25rem;
    border-top: 1px solid var(--line);
    margin-top: 1rem;
    padding-block: 1.2rem 0.5rem;
    text-align: center;
  }

  .empty-icon {
    background: #f5ede4;
    color: #986554;
    margin-bottom: 0.25rem;
  }

  .empty-history p:last-child,
  .history-note,
  .faq-intro {
    color: var(--muted);
    font-size: 0.92rem;
  }

  .history-note {
    margin-block: 0.7rem 0.65rem;
  }

  .faq-intro {
    margin-top: 0.75rem;
  }

  .inline-definitions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem 1.25rem;
    margin-block: 1rem 0.35rem;
  }

  .faq-list {
    margin-top: 0.35rem;
  }

  .faq-item {
    border-bottom: 1px solid var(--line);
  }

  .faq-item:last-child {
    border-bottom: 0;
  }

  .faq-item summary {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-block-size: 48px;
    padding-block: 0.75rem;
    font-size: 0.97rem;
    font-weight: 660;
    color: var(--ink);
    cursor: pointer;
    touch-action: manipulation;
    transition: color 140ms ease;
  }

  .faq-item summary::-webkit-details-marker {
    display: none;
  }

  .faq-item summary::before {
    content: '';
    inline-size: 1.05rem;
    block-size: 1.05rem;
    flex-shrink: 0;
    background-color: var(--rose);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")
      no-repeat center / contain;
    rotate: -90deg;
  }

  .faq-item[open] > summary::before {
    rotate: 0deg;
  }

  .faq-item::details-content {
    interpolate-size: allow-keywords;
    overflow: clip;
    contain: layout;
  }

  .faq-item:not([open])::details-content {
    block-size: 0;
  }

  .faq-item p {
    padding: 0 0 0.95rem 1.7rem;
    color: var(--muted);
    font-size: 0.93rem;
    line-height: 1.62;
    max-inline-size: 72ch;
  }

  .inline-care-note {
    margin-top: 1rem;
  }

  .inline-care-note h3 {
    font-size: 0.98rem;
  }

  .inline-care-note p {
    margin-top: 0.45rem;
    font-size: 0.92rem;
  }

  @media (prefers-reduced-motion: no-preference) {
    .faq-item summary::before {
      transition: rotate 180ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    .faq-item::details-content {
      transition: block-size, content-visibility, display;
      transition-duration: 240ms;
      transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
      transition-behavior: allow-discrete;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: start;
    font-variant-numeric: tabular-nums;
  }

  th, td {
    padding: 0.4rem 0.35rem;
    text-align: start;
    border-bottom: 1px solid var(--line);
    overflow-wrap: anywhere;
  }

  th {
    color: var(--muted);
    font-size: 0.85rem;
    font-weight: 700;
  }

  td:last-child { text-align: end; }

  tbody tr:last-child td { border-bottom: 0; }

  .record-date {
    display: block;
    color: var(--muted);
    font-size: 0.8rem;
  }

  .icon-button {
    padding: 0;
    color: #884840;
  }

  .page-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding-block: 1.45rem 1.75rem;
    color: var(--muted);
    font-size: 0.84rem;
    text-align: center;
  }

  dialog {
    width: min(calc(100% - 1.75rem), 33rem);
    max-block-size: calc(100% - 1.75rem);
    padding: 1.4rem;
    border: 1px solid var(--line);
    border-radius: 1.2rem;
    color: var(--ink);
    background: var(--cream);
    box-shadow: 0 1rem 4rem #39241b32;
  }

  dialog:modal { overscroll-behavior: contain; }

  dialog::backdrop {
    background: #34282188;
    overflow: hidden;
    overscroll-behavior: contain;
  }

  dialog h2 {
    font-family: var(--serif);
    font-size: 1.55rem;
    font-weight: 650;
  }

  dialog h3 { font-size: 1rem; }
  dialog p { margin-block: 0.55rem; }

  .dialog-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .guide-definitions {
    display: grid;
    gap: 0.55rem;
    margin-block: 0.55rem 1.05rem;
    padding: 0.85rem;
    background: #f8f0e6;
    border-radius: 0.75rem;
  }

  .guide-definitions dt { font-weight: 720; }

  .guide-definitions dd {
    margin-top: 0.15rem;
    color: var(--muted);
    font-size: 0.92rem;
  }

  .care-note {
    margin-top: 1rem;
    padding: 0.85rem;
    border-radius: 0.75rem;
    background: #edf0e5;
    color: #394630;
  }

  .care-note a {
    display: inline-flex;
    align-items: center;
    min-block-size: 44px;
    color: inherit;
    font-weight: 650;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .secondary { border-color: var(--line); }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (max-width: 46rem) {
    .shell { width: min(calc(100% - 1.5rem), 34rem); }
    .header-inner { min-block-size: 3.75rem; }
    .brand { font-size: 1rem; }
    .header-button { padding-inline: 0.65rem; }
    .intro { padding-block: 1.45rem 1.1rem; }

    .dashboard {
      grid-template-columns: minmax(0, 1fr);
      gap: 0.85rem;
    }

    .timer-card { padding: 0.9rem 0.9rem 0.25rem; }
    .timer-heading, .timer-heading .heading-label { gap: 0.5rem; }
    .timer-heading .icon-tile { inline-size: 2.2rem; block-size: 2.2rem; }
    .timer-heading h2 { font-size: 1rem; }
    .state-pill { min-inline-size: 5.6rem; justify-content: center; padding-inline: 0.5rem; }
    .timer-face { width: min(100%, 11.35rem); margin-block: 0.65rem 0.9rem; }
    .timer-action { width: 100%; }
    .sidebar { gap: 0.85rem; }

    .summary-card, .guide-card, .history-card, .faq-card {
      padding: 0.95rem;
    }

    .sprig { width: min(35%, 10rem); }
    .history-card, .faq-card { margin-top: 0.85rem; }
    .inline-definitions { grid-template-columns: minmax(0, 1fr); }
    .faq-item p { padding-inline-start: 1.55rem; }
    td { font-size: 0.89rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    button,
    .language-button,
    .faq-item summary { transition: none; }
    button:active,
    .language-button:active { transform: none; }
  }
</style>
