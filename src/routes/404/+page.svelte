<script lang="ts">
  import '@fontsource-variable/dm-sans/wght.css';
  import '@fontsource-variable/lora/wght.css';
  import logo from '../../../assets/logo.png';
  import { siteName } from '../../lib/site';
</script>

<svelte:head>
  <title>404 — {siteName}</title>
  <meta name="robots" content="noindex" />
  <link rel="icon" type="image/png" sizes="96x96" href="/icon-96.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
</svelte:head>

<main class="not-found">
  <div class="card">
    <div class="brand">
      <img src={logo} width="44" height="44" decoding="async" alt="" />
      <span>{siteName}</span>
    </div>
    <p class="code">404</p>
    <h1>Halaman tidak ditemukan</h1>
    <p class="description">
      Tautan yang Anda buka tidak tersedia.
      <span lang="en">The page you requested could not be found.</span>
    </p>
    <div class="actions">
      <a class="primary" href="/">Timer Kontraksi (ID)</a>
      <a class="secondary" href="/en" hreflang="en" lang="en">Contraction Timer (EN)</a>
    </div>
  </div>
</main>

<style>
  :global(html) {
    color-scheme: light;
    background: #faf6ef;
  }

  :global(body) {
    margin: 0;
    color: #362923;
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

  .not-found {
    min-block-size: 100svh;
    display: grid;
    place-items: center;
    padding: 1.5rem;
  }

  .card {
    width: min(100%, 30rem);
    padding: 2rem;
    border: 1px solid #e9ded3;
    border-radius: 1.35rem;
    background: #fffdf9;
    box-shadow: 0 3px 14px #53352606;
    text-align: center;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: 'Lora Variable', Georgia, serif;
    font-weight: 650;
    font-size: 1.05rem;
    letter-spacing: -0.04em;
  }

  .brand img {
    display: block;
  }

  .code {
    margin: 1.2rem 0 0.25rem;
    color: #a24e43;
    font-weight: 720;
    font-size: 0.9rem;
    letter-spacing: 0.14em;
  }

  h1 {
    margin: 0;
    font-family: 'Lora Variable', Georgia, serif;
    font-size: clamp(1.65rem, 4.5vw, 2.1rem);
    font-weight: 580;
    line-height: 1.2;
    letter-spacing: -0.045em;
    text-wrap: balance;
  }

  .description {
    margin: 0.7rem 0 1.5rem;
    color: #6c5d54;
    font-size: 0.95rem;
    text-wrap: pretty;
  }

  .description span {
    display: block;
    margin-top: 0.2rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.65rem;
  }

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-block-size: 44px;
    padding: 0.55rem 1.05rem;
    border-radius: 0.75rem;
    font-size: 0.92rem;
    font-weight: 650;
    text-decoration: none;
    touch-action: manipulation;
    transition: background-color 140ms ease, transform 130ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  a:active {
    transform: scale(0.98);
  }

  .primary {
    border: 1px solid #91463c;
    background: #a24e43;
    color: #fff;
  }

  .secondary {
    border: 1px solid #e9ded3;
    background: #fffdf9;
    color: #362923;
  }

  @media (hover: hover) and (pointer: fine) {
    .primary:hover {
      background: #924338;
    }

    .secondary:hover {
      background: #f3e9df;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    a {
      transition: none;
    }

    a:active {
      transform: none;
    }
  }
</style>
