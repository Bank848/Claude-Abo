# Genre Conventions

> **Pillar:** 3 — Songwriting Craft · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent

## Core Concept

A genre convention profile collects the recurring, genre-defining choices (tempo, key tendency, instrumentation, vocal style, structural quirks, production era) into one reference so a new song in that genre starts from a known-good baseline instead of generic guessing. This file is intentionally a **living table** — v1 shipped with one genre fully worked; as of 2026-08-07, Pop, Blues/Classic Rock, Ballad/Acoustic, Hip-Hop/Trap, EDM/Electronic, Country, R&B/Soul, Metal/Hard Rock, Luk Thung, and Mor Lam have been researched and filled in too, joined by J-Pop/Anime Ballad on 2026-08-09 (see Gotchas for their verification status). Luk Thung and Mor Lam pair with [thai-language-lyrics.md](../04-suno/thai-language-lyrics.md) to give this KB a complete Thai-language-and-genre songwriting path, not just language mechanics in isolation. Remaining genres stay stubs until filled the first time a song in that genre is made (per the KB's growth model — see the design spec, §6).

## Practical Application — Genre Profiles

### Arena Rock / 80s Stadium (fully worked)

| Aspect | Convention |
|---|---|
| BPM range | ~120-140, sweet spot ~128 (see [rhythm-and-meter.md](../01-theory/rhythm-and-meter.md)) |
| Key tendency | Minor verse → relative major chorus (e.g., Em→G); optional whole-step final-chorus modulation |
| Guitar / lead instrument | Power-chord rhythm, palm-mute verse / open chorus, pentatonic melodic solo |
| Bass | Root-driven with scalar/chromatic approach notes, overdriven tone |
| Drums | Simple backbeat, big open room sound, stomp-clap sections, tom fills into choruses, no ghost notes |
| Vocals | Gritty, chest-dominant mixed voice, gang vocals + backing harmonies on chorus only |
| Structure | Intro → Verse → Pre-chorus → Chorus → Verse → Pre-chorus → Chorus → Solo → Breakdown → Build → Final Chorus(es) → Outro |
| Lyric voice | Plainspoken, declarative, universal "I/we" empowerment language |
| Production era reference | Twisted Sister, Queen (stomp-clap energy), Bon Jovi/Europe (key-change triumph), gated/plate reverb |
| Full worked example | `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` |

### Pop / General Anthem (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | 120-128 mainstream pop sweet spot; dance-pop/electropop pushes 124-135; pop ballads within the genre drop to 65-90 |
| Key tendency | Major throughout, no minor-verse pivot needed — I-V-vi-IV (the "Hopscotch"/"Sensitive Female" schema) as the default harmonic engine (see [progressions-by-genre.md](../01-theory/progressions-by-genre.md)) |
| Guitar / lead instrument | Synths carry the hook (pluck/lead patches); guitar, if present, is clean or lightly processed and rhythmic rather than riff-driven |
| Bass | Synth bass or sub, often doubling the kick pattern; less "played," more programmed and locked to the grid |
| Drums | Programmed or hybrid programmed+live kit, punchy and compressed; four-on-the-floor or straight backbeat depending on sub-style |
| Vocals | Polished, pitch-corrected, frequently layered/stacked in choruses; lead often double-tracked for width |
| Structure | Intro → Verse → Pre-chorus → Chorus (short, punchy, 4-8 bars) → Verse → Pre-chorus → Chorus → Bridge/Breakdown (stripped-back) → Final Chorus (often with an added layer or key element) → Outro |
| Lyric voice | Direct, hook-first, conversational "you/I" address; chorus usually contains the title phrase repeated |
| Production era reference | 2010s mainstream pop (OneRepublic-style widescreen production, Katy Perry/Taylor Swift-era polish); glossy, compressed, radio-ready mix |

### Blues / Classic Rock (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Slow blues ~60-80; standard shuffle ~100-120; uptempo blues-rock ~120-140 |
| Key tendency | I-IV-V functional harmony, almost always major-chord blues form, with the minor pentatonic/blues scale soloed and sung *over* those major chords — the "wrong note that's right" tension that defines the genre's sound |
| Guitar / lead instrument | Blues-driven lead tone (overdriven tube amp, string bends, vibrato); rhythm guitar often plays shuffle-feel triads or dominant 7th voicings |
| Bass | Walking bass line outlining the chord tones and passing tones between changes, driving shuffle feel; Chicago shuffle (kick on 2 & 4) vs. Texas/double shuffle (kick on 1 & 3) as the two common pockets |
| Drums | Swung eighth-note-triplet shuffle groove, brushes or sticks depending on intensity, minimal fills — groove pocket over flash |
| Vocals | Raw, expressive, call-and-response with the lead guitar or backing vocalists; grit and pitch-bending prized over polish |
| Structure | 12-bar blues form repeated per verse (I-I-I-I-IV-IV-I-I-V-IV-I-I/V "turnaround"), often Intro → Verse(12-bar) → Verse(12-bar) → Guitar Solo(12-bar) → Verse(12-bar) → Outro/turnaround |
| Lyric voice | AAB lyric form (line stated, restated, then answered/resolved) within each 12-bar verse; first-person, plainspoken hardship/desire narrative |
| Production era reference | 1960s-70s classic rock and electric blues (Chicago blues lineage through Stones/Zeppelin/ZZ Top-style bands); warm, roomy, minimally processed tracking |

### Ballad / Acoustic (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | 60-90 for most rock/acoustic ballads; slow ballads can sit 50-70 |
| Key tendency | Major, doo-wop-family progressions (I-vi-IV-V, e.g. C-Am-F-G) or the i-VI-VII minor-rock loop for a darker verse before resolving major in the chorus; slower harmonic rhythm (2+ bars per chord) than uptempo genres |
| Guitar / lead instrument | Acoustic guitar or piano as the primary bed, often solo or near-solo in verse 1; sparse arrangement that fills in gradually |
| Bass | Often absent or very light in early verses, entering with the first chorus or build to mark the arrangement "opening up" |
| Drums | Absent or brushed/soft in verses; full kit (or programmed swell) reserved for the final chorus/climax |
| Vocals | Restrained and intimate in verse 1, dynamically opening into a fuller, sometimes belted delivery by the final chorus — the vocal arc IS the arrangement arc |
| Structure | Long-form verses (more lyric content per section than uptempo genres) → Chorus → Verse → Chorus → Bridge (often the emotional turn) → Final Chorus, frequently with a half-step or whole-step key-change modulation (the "truck-driver"/"trucker's gearchange") right before the last chorus for a final lift |
| Lyric voice | Intimate, confessional, often addressed to a specific "you"; narrative or emotionally reflective rather than anthem-declarative |
| Production era reference | Doo-wop-lineage 1950s-60s rock ballads through 1980s-90s power-ballad key-change tradition; modern acoustic-singer-songwriter era for the stripped-down variant |

### Hip-Hop / Trap (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Produced/notated at 130-170, but felt at half-time (~65-85) because the snare/clap typically lands on beat 3 rather than 2-and-4; 140 BPM is the de facto modern trap standard |
| Key tendency | Harmonically minimal — often a single chord, two-chord vamp, or short minor-key loop repeated throughout rather than a full verse/chorus progression; harmony is a backdrop for rhythm, not a moving arc |
| Guitar / lead instrument | 808 sub-bass doubling as the kick (often pitch-slid between notes) is the true "lead instrument" of the genre; melodic hooks more often come from a sampled/synth loop than guitar |
| Bass | The 808 itself — deep, sustained, pitch-bent, functions as both bass and low-end rhythmic anchor |
| Drums | Programmed trap kit: hard-snapping snare/clap on beat 3, rapid stuttering hi-hat rolls using triplet and 32nd/64th-note subdivisions with rate/pitch variation for a "skittering" feel |
| Vocals | Rhythmic, flow-forward delivery locked tightly to the hi-hat subdivisions; heavy use of ad-libs (short interjections stacked behind the lead vocal) and autotune as a stylistic (not just corrective) choice |
| Structure | Hook-first — the chorus/hook often opens the song before verse 1, then repeats: Hook → Verse → Hook → Verse → Hook → Outro; less reliance on a distinct bridge than pop/rock |
| Lyric voice | First-person, direct, cadence-driven; repetition of the hook phrase is a structural device as much as a lyrical one |
| Production era reference | 2010s-2020s Atlanta-lineage trap through mainstream crossover (Migos/Future/Travis Scott-era production); dark, cinematic, bass-forward mix with wide stereo hi-hats |

### EDM / Electronic (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Varies sharply by sub-style — house ~120-130, trance ~130-145, techno ~130-150, dubstep ~138-142 (often felt half-time, similar to trap), drum & bass ~160-180; pick one sub-style/BPM lane per song rather than averaging |
| Key tendency | Minor keys common for driving/dark energy, major for uplifting/euphoric drops; harmony is often a repeated riff or pad progression under the build, secondary to the rhythmic/timbral arc |
| Guitar / lead instrument | Synth lead (pluck, supersaw, or acid-style) carries the melodic hook, especially in the drop; guitars are rare unless in a rock-EDM hybrid |
| Bass | Sidechained to the kick for the signature "pumping" effect — bass (and pads/atmospheres) duck in volume on every kick hit, creating rhythmic breathing room and drive |
| Drums | Fully programmed, four-on-the-floor kick in most sub-styles (house/trance/techno), genre-specific breakbeat patterns in dubstep/DnB; drum arrangement builds in density from intro to drop |
| Vocals | Often minimal, sampled/chopped, or heavily processed; when a full topline vocal is used it's typically vocal-led verse/build sections resolving into an instrumental (or vocal-hook) drop |
| Structure | Build/drop is the genre-defining structural quirk, replacing verse/chorus as the primary architecture: Intro → Build-up (tension via risers, filter sweeps, snare rolls) → Drop (release, full energy) → Breakdown (stripped back) → Build-up → Drop → Outro, often in 8-bar segments |
| Lyric voice | When present: minimal, repetitive, phrase-based (works more as a rhythmic/melodic hook than a narrative lyric) |
| Production era reference | 2010s big-room/progressive-house EDM festival era (Avicii/Tiësto/deadmau5-style widescreen drops) through dubstep's Skrillex-era bass-design lineage |

### Country (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Ballads ~60-80; mid-tempo (the genre's bulk) ~80-120 with a swung/shuffle 8th-note feel (roughly 60-66% swing); uptempo/barn-burner cuts push 120-160+, with bluegrass-adjacent material going higher still |
| Key tendency | Major keys almost exclusively — G, C, D, A are the most common; I-IV-V is the harmonic backbone of traditional country, with I-V-vi-IV (and its vi-IV-I-V rotation) increasingly common in modern country-pop crossover writing (see [progressions-by-genre.md](../01-theory/progressions-by-genre.md)) |
| Guitar / lead instrument | Acoustic strumming (open chord voicings) as the rhythm bed; clean Telecaster twang for lead lines/fills; pedal steel is the genre's signature color instrument, gliding between chord tones; fiddle and banjo carry lead/fill roles in classic and bluegrass-leaning country, largely absent in modern country-pop |
| Bass | Simple, root-and-fifth-driven, supportive rather than melodic; walking bass lines appear in older/bluegrass-adjacent styles |
| Drums | Classic Nashville: brushed or simple, understated backbeat, kept out of the vocal's way; modern country-pop: punchy, compressed pop-rock kit, sometimes with programmed elements borrowed from pop/hip-hop production |
| Vocals | Twangy vowel coloring, close-mic'd intimate delivery; storytelling cadence prioritized over vocal runs — the lyric narrative drives the phrasing, not melisma |
| Structure | Verse → Chorus → Verse → Chorus → Bridge (often a spoken-word or half-time "story turn") → Final Chorus; verses typically carry the narrative's forward motion while the chorus is the fixed emotional/title hook |
| Lyric voice | First-person, plainspoken, concrete/specific imagery (trucks, dirt roads, small towns, family) over abstraction; storytelling with a clear narrative arc is the genre's defining lyric convention |
| Production era reference | Classic Nashville Sound (1950s-60s, Chet Atkins-era — replaced fiddle/steel with string sections and vocal choirs for pop crossover) vs. modern country-pop (2010s-2020s — clean Telecaster + pedal steel over punchy, radio-ready pop-adjacent drum production, sometimes with hip-hop-influenced beats) |

### R&B / Soul (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Slow soul/R&B ballads ~60-80 (per multiple sources, letting extended chords "breathe"); midtempo groove ~80-105; uptempo Motown/soul revue cuts ~110-130 |
| Key tendency | Jazz-derived harmony — ii-V-I turnarounds and extended chords (7ths, 9ths, 11ths, 13ths) are standard rather than ornamental, e.g. Dm9-G13-Cmaj9 instead of a plain Dm-G-C; adds warmth/sophistication over functional simplicity (see [progressions-by-genre.md](../01-theory/progressions-by-genre.md)) |
| Guitar / lead instrument | Electric piano/Rhodes is the primary harmonic lead voice in classic and neo-soul; guitar plays a secondary rhythmic role (funk chicken-scratch/wah comping) rather than carrying the hook |
| Bass | Smooth, syncopated, melodically active bass lines (Motown's walking-bass Funk Brothers style) in classic soul; modern R&B often swaps in a deep 808/sub-bass but keeps the same groove-first, pocket-driven role |
| Drums | Groove-and-pocket focused over flash — strong backbeat, ghost notes, tambourine/handclap layering in classic soul; programmed/drum-machine (808-based) in modern R&B, still prioritizing groove over complexity |
| Vocals | Melismatic runs and riffing, falsetto use, call-and-response with backing vocalists, impassioned/emotive delivery — the lead vocal is the genre's virtuosic focal point |
| Structure | Verse → Pre-chorus → Chorus, frequently extended by a vamp/groove outro with ad-libbed vocal riffing over a repeated one- or two-chord loop — the "ride out" is a structural convention, not filler |
| Lyric voice | Intimate, romantic, emotionally vulnerable, first-person direct address to "you"; confessional and sensual register more than narrative storytelling |
| Production era reference | 1960s-70s Motown (polished, Funk Brothers house band, strings/horns) and Stax (grittier, gospel-rooted, Booker T. and the MGs) soul lineage, through 1990s-2000s neo-soul (D'Angelo, Erykah Badu-style Rhodes-and-groove revival), through modern R&B's DAW-centered, synth/808/vocal-texture-focused production |

### Metal / Hard Rock (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Traditional/NWOBHM-lineage heavy metal ~100-140; thrash metal ~180-220+; doom metal drops as low as ~60-90; extreme subgenres (death/black metal) use blast beats well above 200 BPM felt as rapid 16th-note kick/snare bursts; metalcore breakdowns commonly drop to a half-time ~70-90 feel under a faster verse tempo for weight |
| Key tendency | Power chords (root + perfect fifth dyads, no third) are the harmonic unit, not full triads — they stay clear under heavy distortion; minor tonality dominates, colored by Phrygian and Phrygian-dominant modes, chromatic movement, tritone tension, and (in neoclassical-leaning lead playing) harmonic minor scales/sweep-picked arpeggios |
| Guitar / lead instrument | Heavily distorted, often downtuned (drop D/drop C or lower) rhythm guitar built on palm-muted chugging riffs; lead playing ranges from pentatonic/blues-rock-derived (traditional metal, NWOBHM) to fast alternate-picked/sweep-picked technical runs (thrash, neoclassical, tech-metal) |
| Bass | Typically doubles the guitar riff in unison for weight and low-end density rather than playing an independent melodic line; downtuned to match the guitar |
| Drums | Aggressive and technically demanding — double bass-drum pedal work (two kick hits per beat) is the genre's rhythmic engine, escalating to blast beats in extreme subgenres; complex, driving fills mark section transitions |
| Vocals | Wide range by subgenre: clean, melodic, often high-register singing in traditional/NWOBHM metal; harsh screamed or death-growled vocals in thrash/death/black metal; metalcore's defining vocal quirk is alternating within a single song between harsh verses and soaring clean-sung choruses |
| Structure | Riff-driven rather than strictly chord-driven — the central guitar riff often functions as the song's identity the way a chorus melody does elsewhere; the breakdown (a stripped-down, half-time, low-register riff section) is metalcore's signature structural device, distinct from a traditional bridge |
| Lyric voice | Traditional/NWOBHM: mythological, fantastical, or anti-establishment themes; thrash: aggressive, political, or apocalyptic; metalcore: often personal/emotional/confessional despite the harsh vocal delivery |
| Production era reference | NWOBHM (late 1970s-80s, Iron Maiden/Judas Priest-lineage — deliberately raw, under-produced) through Bay Area thrash (1980s, Metallica/Slayer/Anthrax-style tightened, aggressive production) through modern metalcore/djent (2000s-2020s, heavily produced, tightly quantized, downtuned and highly polished) |

### Luk Thung (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Ballad-style luk thung ~70-90; mid-tempo/dance-oriented cuts ~100-130 |
| Key tendency | Major keys predominant, functional I-IV-V harmony similar to Western pop/country, but melody lines are heavily ornamented with pitch slides and grace notes that don't map cleanly onto Western scale-degree notation |
| Guitar / lead instrument | **Phin** (a Thai/Isan lute-family plucked string instrument) and **khaen** (a bamboo mouth organ, the genre's signature timbre) as lead melodic voices; electric guitar/keyboard common in modern crossover production |
| Bass | Simple, root-driven, supportive — similar functional role to Western pop/country bass |
| Drums | Modern productions use a straightforward pop/country-adjacent kit; older/traditional productions may use hand percussion or a lighter kit presence |
| Vocals | Heavy pitch ornamentation (slides, grace notes, vibrato) as a genre-defining vocal signature, not an occasional flourish — the ornamentation IS the style; storytelling, often rural/working-class themes |
| Structure | Verse-chorus form broadly similar to Western pop structure; instrumental phin/khaen breaks between vocal sections are a genre convention |
| Lyric voice | Rural, working-class, often nostalgic or romantic Isan/northeastern Thai narrative themes; plainspoken and direct, similar in spirit to the storytelling directness of Western country (see the Country row above) |
| Production era reference | Classic 1960s-80s luk thung (raw, band-driven) through modern luk thung-pop crossover (glossier, pop-adjacent production, phin/khaen retained as color instruments over a contemporary beat) |

### Mor Lam (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Traditional mor lam is often felt as a fast, driving, syllable-dense pulse rather than a fixed Western BPM; modern mor lam sing (the dance-pop-crossover variant) sits in a more conventional ~120-140 dance range |
| Key tendency | Modal/pentatonic-leaning melodic language rooted in Isan/Lao musical tradition, distinct from Western major/minor functional harmony; modern crossover productions layer this melodic sensibility over conventional Western pop chord beds |
| Guitar / lead instrument | **Khaen** (bamboo mouth organ) is the central, defining instrument — its continuous drone-and-melody texture is the genre's clearest sonic signature; phin also appears |
| Bass | Traditional mor lam has minimal/no bass in the Western sense; modern mor lam sing productions add a conventional bass part matching the dance-pop beat underneath |
| Drums | Traditional performance is percussion-light, driven by vocal cadence and khaen; modern mor lam sing layers a full programmed dance-pop kit under the traditional vocal/khaen elements |
| Vocals | Extremely fast, syllable-dense, rhythmic near-speech-singing (a rap-adjacent cadence in the traditional style) with tonal tradition-rooted melodic ornamentation; call-and-response between performers is a traditional performance convention |
| Structure | Traditional mor lam is often through-composed/narrative rather than verse-chorus; modern mor lam sing adopts a conventional verse-chorus-hook pop structure while keeping the rapid-fire vocal cadence as its identity |
| Lyric voice | Traditional: extended storytelling, humor, courtship dialogue, often improvised in live performance; modern crossover: shorter, hook-driven, retains the rapid cadence as a stylistic signature within pop song structure |
| Production era reference | Traditional Isan folk performance lineage through the 2000s-2020s "mor lam sing" (electronic dance-pop hybrid) crossover era — the latter is itself already a real-world precedent for a mor-lam-meets-EDM/trap blend, see [genre-blending.md](genre-blending.md) |

### J-Pop / Anime Ballad (fully worked, researched — not yet self-verified)

| Aspect | Convention |
|---|---|
| BPM range | Anime **ending** themes measured at ~96 BPM average vs. ~138 BPM for openings (single web source, treat the exact figures as soft) — ballad-leaning ED/insert songs sit roughly 70–100; uptempo J-pop and anime OP material runs ~130–160 |
| Key tendency | Denser, jazzier harmony than Western pop is the genre's clearest theory-level signature — 7th chords used as the default voicing rather than as decoration. Two named stock progressions: **王道進行 / "Royal Road"** (IVM7–V7–iii7–vi, e.g. FM7–G7–Em7–Am in C — so common it's nicknamed the "anime progression") and **小室進行 / "Komuro"** (VI–IV–V–I, i.e. 6-4-5-1, starting minor and resolving bright). J-pop is also reported to **avoid resting on the tonic**, often cadencing or even ending on IV or vi, which reads as "unresolved / still moving" to a Western-trained ear |
| Guitar / lead instrument | Ballad/ED register: **piano is the default lead voice**, with orchestral strings as the primary swell layer; acoustic guitar common in the lighter/folkier ED style. Uptempo/OP register: bright digital keyboards and driving distorted guitar. Solo violin, glockenspiel/celesta, and light woodwind are common color instruments in the cinematic-ballad variant |
| Bass | Ballad: supportive, often absent or very light in the opening verse, entering with the first chorus to mark the arrangement opening up. Uptempo J-pop idol production: octave-jumping synth bass |
| Drums | Ballad: absent or brushed in early verses, full kit reserved for the late choruses; a large proportion of anime EDs are drum-light throughout. Uptempo J-pop: brisk four-on-the-floor |
| Vocals | Reported J-pop vocal aesthetic is **bright, forward, somewhat nasal, high-tessitura, thin-resonance rather than chest-heavy** — the opposite pole from Western belting-and-grit. Ballad delivery is breathy and intimate in the verses, opening up but usually **without** the American power-ballad melisma/riffing habit; the melody is sung as written. Female lead is the dominant convention for the anime-ballad ED specifically |
| Structure | Uses its own named section vocabulary, not the Western one: **Aメロ (A-melo, verse) → Bメロ (B-melo, pre-chorus — a mandatory-feeling section that does the lift into the hook, more consistently present than in Western pop) → サビ (sabi, chorus/hook)**, then optionally **Cメロ / 大サビ (a late contrasting section and final "big chorus")** and **落ちサビ (ochi-sabi — a stripped-down quiet reprise of the chorus placed right before the final full chorus)**. That ochi-sabi drop-then-explode device is the structural quirk with the least Western equivalent. Last-chorus **whole-step key lift ("truck driver" modulation) is a live, non-ironic convention in J-pop**, not the retro cliché it reads as in Western pop |
| Lyric voice | Reflective, bittersweet, image-led rather than declarative; anime EDs specifically skew to reflection, loss, and quiet hope (the deliberate emotional counterweight to the OP's energy). Seasonal/weather/light imagery is a strong idiom. English words/phrases are commonly dropped in as texture and title-hooks even in otherwise fully Japanese lyrics |
| Production era reference | 1990s Komuro-era J-pop (synth-and-strings, key-change finales) through 2000s–2010s anime-tie-in pop/rock; for the ballad/ED variant specifically, clean and uncompressed-sounding piano-plus-strings production with a wide dynamic range, closer to film scoring than to radio pop mastering |

## Reference Listening

- **Pop / General Anthem**: "Counting Stars" — OneRepublic; "Roar" — Katy Perry; "Shake It Off" — Taylor Swift; "Levitating" — Dua Lipa
- **Blues / Classic Rock**: "Pride and Joy" — Stevie Ray Vaughan; "Sweet Home Chicago" — traditional/Blues Brothers version; "Crossroads" — Cream; "La Grange" — ZZ Top
- **Ballad / Acoustic**: "Stand By Me" — Ben E. King; "Total Eclipse of the Heart" — Bonnie Tyler; "Tears in Heaven" — Eric Clapton; "Fast Car" — Tracy Chapman
- **Hip-Hop / Trap**: "Bad and Boujee" — Migos; "Mask Off" — Future; "Sicko Mode" — Travis Scott; "God's Plan" — Drake
- **EDM / Electronic**: "Levels" — Avicii; "Strobe" — deadmau5; "Bangarang" — Skrillex; "One More Time" — Daft Punk
- **Country**: "Friends in Low Places" — Garth Brooks; "Jolene" — Dolly Parton; "Before He Cheats" — Carrie Underwood; "Cruise" — Florida Georgia Line
- **R&B / Soul**: "I Want You Back" — The Jackson 5; "Try a Little Tenderness" — Otis Redding; "Untitled (How Does It Feel)" — D'Angelo; "Adorn" — Miguel
- **Metal / Hard Rock**: "The Trooper" — Iron Maiden; "Master of Puppets" — Metallica; "Painkiller" — Judas Priest; "Sugar" — Architects
- **Luk Thung**: representative artists — Pumpuang Duangjan, Sunaree Ratchasima (research-sourced, not personally curated track picks)
- **J-Pop / Anime Ballad**: "Orange" — 7!! (*Your Lie in April* ED2, the piano-and-solo-violin cinematic-ballad end of the genre); "Secret Base ~君がくれたもの~" — ZONE; "Sakura" — Ikimonogakari; "Lemon" — Kenshi Yonezu (research-sourced examples of the ballad register, not personally curated)
- **Mor Lam**: representative artists — Jintara Poonlarp (classic), Silapa Ratree/mor lam sing acts for the modern EDM-crossover variant (research-sourced, not personally curated track picks)

## Suno Translation

A genre profile's row values map roughly one-to-one onto Style-field tag categories (see [style-prompt-formula.md](../04-suno/style-prompt-formula.md)'s 5-layer structure) — genre/subgenre, instruments+technique, tempo/key, mood, era reference. Building a new genre profile IS effectively drafting the Style field for that genre.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — the source of the Arena Rock profile above.
- `<YOUR_SONGS_DIR>/SongD_suno_prompt.md (song project folder, separate from this vault; renamed 2026-08-09 from KaenPenPhayan to match the phin-lead instrumentation)` — first Mor Lam profile application: a mor lam sing pop-crossover duet with a deliberate instrumentation deviation from the profile (phin as lead melodic instrument instead of the profile's khaen-as-central-signature, with khaen demoted to color accents — a user-requested choice, not a correction to the profile; both are attested lead instruments in the genre per the table above). Planned only as of 2026-08-09, not yet generated. **Also the first worked example combining this file with the duet-formatting guidance in [duets-and-multiple-vocalists.md](../04-suno/duets-and-multiple-vocalists.md)** — mor lam's traditional call-and-response courtship-dialogue convention (noted in the Lyric voice row above) maps naturally onto a male-female duet structure with per-line speaker labels in the Pre-Chorus/trading-verse sections specifically, since that's where the traditional banter convention is strongest — steady sections (a shared chorus, a solo verse) don't need line-by-line labeling, only the sections where speakers actually alternate line-to-line.

## Gotchas / Open Items

- Pop, Blues/Classic Rock, Ballad/Acoustic, Hip-Hop/Trap, EDM/Electronic, Country, R&B/Soul, Metal/Hard Rock, Luk Thung, and Mor Lam profiles are now filled in (2026-08-07) — but they are **researched and reported from web sources, not yet self-verified** by producing an actual Suno song in each genre (same unverified-claim convention as [limits-and-gotchas.md](../04-suno/limits-and-gotchas.md)). Treat every BPM/structure/instrumentation claim above as a starting hypothesis to test against real Suno output, not a confirmed result. Only the Arena Rock profile has been validated against an actual worked song project. **Update (2026-08-07):** that Arena Rock song was generated and the actual audio measured (BPM/key-arc/loudness-arc analysis + transcription) — see the "🎧 ผลวิเคราะห์เสียงจริง" section appended to `<YOUR_SONGS_DIR>/SongA_suno_prompt.md`. Result was partial, not full, confirmation: lyrics and overall structure matched closely, but measured BPM ran ~6-13% faster than tagged and the claimed sharp verse/chorus loudness contrast didn't show up in the loudness data — worth reading before treating this profile's BPM/dynamics claims as fully proven.
- **J-Pop / Anime Ballad (added 2026-08-09) is researched only, not yet self-verified** — same status as the rest. Two extra caveats specific to this profile: (1) the "~96 BPM average for anime endings vs. ~138 for openings" figure comes from a single, low-authority web source with no stated methodology — useful as a directional hint that EDs are much slower than OPs, not as a number to design to; (2) the Japanese section vocabulary (Aメロ/Bメロ/サビ/大サビ/落ちサビ) is well attested in Japanese songwriting sources, but **whether Suno responds to those terms as section tags at all is completely untested** — write the lyric sheet with normal English `[Verse]`/`[Pre-Chorus]`/`[Chorus]`/`[Bridge]` tags and use the Japanese terms only as design vocabulary. Language-side companion file: [japanese-language-lyrics.md](../04-suno/japanese-language-lyrics.md).
- Luk Thung and Mor Lam carry an extra layer of uncertainty beyond the other researched-only profiles: English-language source material on both genres is thinner than for Western genres, and — per [thai-language-lyrics.md](../04-suno/thai-language-lyrics.md) — whether Suno's model reliably renders Thai-specific instrument timbres (phin, khaen) or vocal ornamentation from a text tag at all is completely untested, not just unverified. Treat these two profiles as the least certain in this table.
