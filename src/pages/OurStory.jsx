import { brandAsset } from '../lib/assets'

function StorySection({ image, imageAlt, imagePosition = 'right', eyebrow, title, paragraphs }) {
  const imageOnRight = imagePosition === 'right'

  return (
    <section className="relative bg-black overflow-hidden">
      <img
        src={image}
        alt={imageAlt}
        className={`absolute top-0 w-1/2 h-full object-cover object-top ${
          imageOnRight ? 'right-0' : 'left-0'
        }`}
      />
      <div
        className={`absolute inset-y-0 w-1/2 ${
          imageOnRight
            ? 'right-0 bg-gradient-to-l from-transparent via-transparent to-black'
            : 'left-0 bg-gradient-to-r from-transparent via-transparent to-black'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className={`w-full md:w-1/2 space-y-6 ${imageOnRight ? '' : 'md:ml-auto'}`}>
          {eyebrow && (
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-4xl md:text-5xl text-white leading-[0.95]">{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function OurStory() {
  return (
    <div>
      <section className="relative bg-black overflow-hidden">
        <img
          src={brandAsset('P1258598.jpg')}
          alt="Larry Nolan, founder of Bulletproof Fitness Equipment"
          className="absolute right-0 top-0 w-1/2 h-full object-cover object-top"
        />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-transparent via-transparent to-black" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="font-display text-6xl md:text-7xl text-white mb-4">Our Story</h1>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              At 15, Larry Nolan was told he'd never lift, never train, never play sports again —
              rheumatoid arthritis and Raynaud's phenomenon were supposed to end that possibility
              before it started. Instead, he picked up a rusty barbell and began training anyway,
              eventually training his way through the diagnosis entirely.
            </p>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              He got his personal training certification at 16 — using a fake ID to work the floor
              at 24 Hour Fitness while still in high school. Fitness won out over everything else:
              he dropped out to pursue it full time.
            </p>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              In 2007, with his wife Nadia's belief in him and two clients — her and his mother —
              he launched a bootcamp in a local park. He built his own equipment to stand out
              before he even had a building: braised squat racks, stacked in the back of a U-Haul.
            </p>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              That bootcamp became Hardcore Fitness — 5x Inc. 5000, #3 Fastest-Growing Private
              Company in Los Angeles. And it stayed a family business the whole way: his sister
              Nicole is now his business partner, and his mother — one of his very first clients —
              left her career to hand-pack every order that ships, with a handwritten thank-you
              note in the box.
            </p>
            <p className="text-white/90 font-medium leading-relaxed text-lg flex-shrink-1">
              "It's just us — me, my sister, and my mom."
            </p>
          </div>
        </div>
      </section>

      {/* Text-only, matching the source page's Diagnosis / Early Career sections —
          no photos exist for these on their site either, so instead of forcing an
          image, the two run side by side as a two-column pair. */}
      <section className="bg-black py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
              The Diagnosis
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-[0.95]">
              The Diagnosis That Sparked a Revolution
            </h2>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              At 15 years old, Larry was diagnosed with rheumatoid arthritis and Raynaud's
              phenomenon. Doctors said he'd be on medications for life — that he'd never lift,
              never train, never play sports again. But he refused to accept that. Maybe it was
              rebellion. Maybe it was movies like Rocky and Bloodsport. But something in him
              wasn't willing to give up.
            </p>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              That same day, he went into his garage, picked up a rusty barbell his dad had left
              behind, and started moving. No plan. No clue. Just determination. Over time, the
              flare-ups subsided. His strength returned. The nickname "Blueberry Larry" — earned
              because his skin turned blue in the cold — started to fade.
            </p>
            <p className="text-white/90 font-medium leading-relaxed text-lg flex-shrink-1">
              Fitness gave him more than strength. It gave him control over his life.
            </p>
          </div>

          <div className="space-y-6">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
              Early Career
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-[0.95]">
              A Job Before Adulthood — and a Dream in the Making
            </h2>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              At 16, Larry was determined to become a personal trainer — even though you had to
              be 18. So while most kids used fake IDs to buy alcohol, he used his to get hired at
              24 Hour Fitness. Back then, he was still in high school, riding the city bus from
              the house he shared with roommates to class, then off to work.
            </p>
            <p className="text-white/70 leading-relaxed text-lg flex-shrink-1">
              Eventually, he dropped out to pursue fitness full-time, throwing himself into every
              role the gym industry had to offer — from training to sales to operations. Even
              through hard years that followed, fitness remained his anchor. It kept him
              grounded, focused, and hopeful.
            </p>
          </div>
        </div>
      </section>

      <StorySection
        image={brandAsset('IMG_66F0773A9B5D-1.jpg')}
        imageAlt="Larry Nolan during the Hardcore Fitness era"
        imagePosition="right"
        eyebrow="Hardcore Fitness"
        title="Boot Camp Beginnings to Building an Empire"
        paragraphs={[
          "In 2007, Larry met his wife, Nadia, while working as a trainer. She believed in him, saw his passion, and gave him the push he needed to go all in. With no credit, no loans, and no blueprint, he launched a bootcamp in a local park with just two clients — his wife and his mom.",
          "He wanted to stand out, so he started building his own equipment — braising custom squat racks with a friend of his dad's, stacking them like shopping carts in a U-Haul. He trained clients with 100 lb dumbbells, Chuck Norris Total Gyms, and anything he could use to offer what no one else did.",
          "That bootcamp became Hardcore Fitness: 5x Inc. 5000 company, #3 Fastest-Growing Private Company in Los Angeles, and an Entrepreneur Magazine Top New Franchise.",
        ]}
      />

      <StorySection
        image={brandAsset('family-photo.jpg')}
        imageAlt="Larry Nolan with his family, who run Bulletproof Fitness Equipment together"
        imagePosition="left"
        eyebrow="Family Business"
        title="A Family That Built Bulletproof"
        paragraphs={[
          "As Hardcore Fitness grew, his sister Nicole started helping out around the gyms — just odds and ends at first. It quickly became clear: she had a gift. Over time she became his right hand, and eventually the most valuable person in the company — so when it came time to start Bulletproof, Nicole was going to be his partner.",
          "And then there's his mom — one of the first clients he ever had, and now a full-time part of Bulletproof. Her choice of purpose: working in the warehouse, packing orders by hand and writing handwritten thank-you notes to every customer.",
          "So while people often think Bulletproof is a large company, the truth is: it's just us — me, my sister, and my mom.",
        ]}
      />

      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/10">
        <p className="text-white/90 font-medium leading-relaxed text-xl max-w-2xl">
          "We're small. We're tight. We're relentless."
        </p>
      </section>
    </div>
  )
}
