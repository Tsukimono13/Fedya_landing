// Single source of truth for the FAQ section. The body field holds the rich
// HTML that goes inside .faq__item__body — preserving the exact markup
// (lists, ordered lists, nested divs, .--last modifier on the final <p>) that
// the original hand-written HTML had.
//
// `bodyExtraClass` adds modifiers to the body wrapper (e.g. --flex, spaced).
// Items are rendered into static HTML at build time by the static-partials
// Vite plugin — no runtime DOM mutation, so SEO crawlers see the full text.
export const faq = [
  {
    question: 'How to prepare for the session',
    bodyExtraClass: 'faq__item__body--flex',
    body: `
      <p>
        A tattoo is a stress and trauma for the body. So, I recommend
        choosing a session date with the healing process in mind.
      </p>
      <p>
        Pick a day when you have 1-2 days off afterward to let the
        tattoo start healing. Avoid physical exertion for a week.
      </p>
      <p>
        Before the session, ensure you get a good night's sleep, have
        breakfast, and avoid alcohol.
      </p>
      <p>
        It's also recommended to exfoliate or scrub the skin with a
        washcloth the day before the session to remove dead skin
        cells.
      </p>
      <p class="faq__item__body__text faq__item__body__text--last">
        Bring comfortable clothing. For example, a sleeveless shirt
        for a tattoo on your arm or shorts for work on your leg.
        Choose clothes that you don't mind getting dirty.
      </p>
    `,
  },
  {
    question: 'How long do large projects take?',
    body: `
      <p>
        The time required for a tattoo is quite unpredictable since it
        involves a drawing process. It depends on your size, skin
        quality, and the complexity of the project. However, I can
        provide some rough estimates based on my experience:
      </p>
      <div class="faq__item__body__steps">
        <p>Forearm - 1-2 sessions</p>
        <p>Shin - 2-3 sessions</p>
        <p>Shoulder - 2-3 sessions</p>
        <p>Half sleeve - 4-5 sessions</p>
        <p>Full sleeves, back, and torso - 8-12 sessions</p>
      </div>
      <p class="faq__item__body__text faq__item__body__text--last">
        Again, everything is individual and will be discussed during
        the initial consultation.
      </p>
    `,
  },
  {
    question: 'What are the contraindications?',
    body: `
      <p>Absolute contraindications:</p>
      <ul class="faq__item__body__list">
        <li>Blood clotting disorders</li>
        <li>Malignant tumors</li>
        <li>HIV</li>
        <li>Epilepsy</li>
        <li>High blood pressure</li>
        <li>Serious heart diseases</li>
        <li>Allergic reactions to anesthetics</li>
        <li>Rheumatoid arthritis</li>
        <li>Exacerbation of skin diseases</li>
        <li>Type 1 diabetes</li>
        <li>Pregnancy</li>
      </ul>
      <p>Relative contraindications:</p>
      <ul class="faq__item__body__list">
        <li>Breastfeeding</li>
        <li>Hepatitis</li>
        <li>Type 2 diabetes</li>
        <li>Menstruation</li>
      </ul>
    `,
  },
  {
    question: 'Pricing and deposit',
    bodyExtraClass: 'spaced',
    body: `
      <p>
        I charge hourly and work with a timer, counting only the
        actual tattooing time, excluding preparation and breaks. The
        hourly rate is $230, and the total price is calculated at the
        end of the session. On average, for larger pieces, it takes
        about 5 hours a day. It's important to understand that each
        project is unique, and the time spent can vary from client to
        client.
      </p>
      <p>
        At this moment, we only accept cash. Payments for tattoo
        sessions are due immediately at the end of each session.
      </p>
      <p>
        A deposit of $100 is required to confirm your appointment.
        Deposits are non-refundable. The deposit can be paid in cash
        or online via Zelle, Venmo, or PayPal.
      </p>
      <p>
        The deposit serves to reserve all your booking dates and will
        be applied to the final tattoo session if the project requires
        multiple sessions. If it is a single session, it will be
        applied to that instead.
      </p>
      <p>
        If you need to change the date of your appointment due to
        unforeseen circumstances, you must let us know at least 3 days
        prior to the session so we can rearrange our schedules. A new
        deposit will be required to continue working together if you
        cancel or reschedule with less than 3 days’ notice. You can
        reschedule your appointment only once without losing your
        deposit.
      </p>
      <p class="faq__item__body__text faq__item__body__text--last">
        If you do not show up for the appointment - you lose your
        deposit and we will not be able to work together. In paying
        your deposit, you agree to the entire policy above and agree
        that the deposit cannot be refunded for any reason whatsoever.
      </p>
    `,
  },
  {
    question: 'How to care for a tattoo',
    bodyExtraClass: 'spaced',
    body: `
      <p>
        Since a tattoo is a large wound, there's a risk of infection.
        Cover it with absorbing pads when going outside and when
        sleeping. At home, you can skip the absorbing pad unless you
        have pets; in that case, keep it covered.
      </p>
      <div>
        <p>Here's the care routine:</p>
        <ol class="care-routine">
          <li>
            When you get home after the session, remove the absorbing
            pad, wash the tattoo with warm water, and gently pat dry
            the shiny areas with plasma using a paper towel.
          </li>
          <li>Let the tattoo air dry for about half an hour.</li>
          <li>
            Apply a thin layer of cream (a thick layer will prevent
            the skin from breathing and slow down healing).
          </li>
          <li>
            Before sleeping and going outside, cover the tattoo with
            an absorbing pad over the cream.
          </li>
          <li>
            While at home, keep an eye on the tattoo. If plasma
            accumulates over the cream, repeat the cleaning and drying
            process.
          </li>
        </ol>
      </div>
      <p>
        After two nights, plasma discharge should stop. This means you
        can stop using absorbing pads. From this point, apply cream
        more frequently to prevent the tattoo from drying out. Wear
        loose clothing that you don't mind getting stained with cream.
      </p>
      <p>
        After 4-5 days, the tattoo will start peeling. Don’t pick at
        the peeling skin, and continue applying cream until it's fully
        healed.
      </p>
      <p>
        Once the tattoo has finished peeling, continue to moisturize
        it with regular lotion for up to a month.
      </p>
      <div>
        <p>For 1-2 weeks during the healing process, avoid:</p>
        <ul class="faq__item__body__list">
          <li>Tanning beds</li>
          <li>Saunas</li>
          <li>Baths</li>
          <li>Sunbathing</li>
          <li>Physical activities</li>
          <li>Swimming in pools and open water</li>
        </ul>
      </div>
    `,
  },
  {
    question: 'Can I purchase a gift certificate?',
    body: `
      <p class="faq__item__body__text faq__item__body__text--last">
        Yes, you can purchase a gift certificate for a tattoo from me
        as a gift for any occasion. Terms of use: It can be used by
        any adult who does not have any contraindications. The
        certificate can be used within 6 months from the date of
        purchase. The amount on the certificate can be any value.
      </p>
    `,
  },
  {
    question: 'How to get to the studio',
    body: `
      <p class="faq__item__body__text faq__item__body__text--last">
        The studio is still under renovation. Opening soon! For the
        address, please send me a DM.
      </p>
    `,
  },
];

export function renderFaq() {
  return faq
    .map(({ question, body, bodyExtraClass }) => {
      const bodyClass = bodyExtraClass
        ? `faq__item__body ${bodyExtraClass}`
        : 'faq__item__body';
      return `
        <div class="faq__item">
          <h3 class="faq__item__question">
            <button class="faq__item__header faq__toggle" aria-expanded="false">
              <span>${question}</span>
              <img src="assets/icons/faq_icon.svg" alt="" aria-hidden="true">
            </button>
          </h3>
          <div class="${bodyClass}">${body}</div>
        </div>
      `;
    })
    .join('');
}

// Schema.org FAQPage schema — Google reads this directly from JSON-LD without
// executing JS, so it powers rich-result snippets even before client render.
// Google allows limited HTML in the answer (h1-h6, br, ol, ul, li, a, p, div,
// b, strong, i, em); our bodies stay within those tags.
export function renderFaqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ question, body }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: body.trim(),
      },
    })),
  };
  // JSON.stringify does not escape "</script>", and the answer bodies above
  // are raw HTML — one containing that string would close this block early and
  // spill the rest of the JSON into the markup. Escaping every "<" to its
  // JSON unicode escape is still valid JSON and parses back identically.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}
