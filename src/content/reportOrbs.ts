import { OrbData } from '../types';

const APOD_VIDEO_SRC = new URL('../../apod-vid.mp4', import.meta.url).href;
const MAGNETIC_VIDEO_SRC = new URL('../../2015-magnetic.mp4', import.meta.url).href;

export const REPORT_ORBS: OrbData[] = [
  {
    id: 1,
    orbLabel: 'Introduction',
    modalTitle: 'Introduction',
    x: 12,
    y: 18,
    size: 62,
    figure: {
      label: 'Figure 1',
      placeholder: 'Insert APOD image here',
      videoSrc: APOD_VIDEO_SRC,
      caption:
        'Representative frame from NASA’s APOD video Coronal Rain on the Sun (27 May 2018). The still from the time-lapse ultraviolet footage shows cooled plasma cascading back toward the Sun along magnetic field lines following the July 2012 eruption. Each second of footage represents approximately six minutes of real time. Source: NASA/SDO/SVS/GSFC (NASA 2018).',
    },
    paragraphs: [
      `Midway through July 2012, an intense solar burst unfolded, observed closely by NASA's Solar Dynamics Observatory (NASA 2018). Instead of ordinary rain, what falls there is made of blazing plasma threads, each exceeding any heat known on our planet. These ribbons flow gently downward, guided by unseen magnetic lines across the star’s surface (NASA 2018). The images come from ultraviolet data, invisible to humans yet perfect for exposing the corona’s fierce warmth. When time speeds up,six minutes squeezed into one second, the motion resembles cascading water. Calm. Quietly hypnotic. Not Earth-like mist or thunderstorm deluge, but something fiercer, stranger, oddly peaceful. Even though every droplet contains a stream of ionized gas heated to 50,000 Kelvin, it still falls back gently. That's what scientists call coronal rain. Yet inside this graceful fall lies a puzzle that remains unsolved, deep in our understanding of how the Sun works.`,
    ],
  },
  {
    id: 2,
    orbLabel: 'The Corona and Its Deepest Mystery',
    modalTitle: 'The Corona and Its Deepest Mystery',
    x: 31,
    y: 10,
    size: 80,
    paragraphs: [
      `What makes plasma fall back toward the Sun begins with where it came from, the star’s outer atmosphere. A gaseous sphere structured in layers, the Sun lacks solidity throughout. Sitting at roughly 5,500 °C, its glowing surface, named the photosphere, carries heat intense enough to turn known substances into vapour (NASA 2024a). Just above this level stretches the narrow chromosphere, followed outward by the corona, the farthest part of the solar atmosphere. Temperature logic fails sharply in this region. The corona usually hits temperatures ranging from one to three million degrees Celsius, whereas active zones during solar flares may surpass ten million (Reale 2014). Despite being farther out, the upper layer burns far hotter than the sun's visible face below it.`,
      `This mystery, known as the coronal heating problem, has challenged scientists since the mid-20th century (Klimchuk 2006). Filmed using extreme ultraviolet light, the APOD video captures what regular vision cannot: searing heat hidden from visible wavelengths, showing how varied parts of the electromagnetic spectrum expose distinct layers of nature's behavior.`,
      `Out of years of study, two main ideas now stand out. Carrying energy from below, magnetic waves may transfer it upward into the outer atmosphere, that is wave heating. Instead, nanoflare theory suggests numerous miniature reconnections release frequent energy pulses across the solar crown (Klimchuk 2006). One might be more active than the other; yet a mix of both cannot be ruled out. Exactly which role each plays still lacks clear evidence.`,
      `Not merely odd, coronal rain serves as a key tool for exploring this puzzle (Antolin 2020). Because it reveals cooling and falling plasma, researchers track hidden energy feeding the Sun’s hot outer layer. Then, in mid-2012, nature offered a striking example. That moment stood out.`,
    ],
  },
  {
    id: 3,
    orbLabel: 'Reading the July 2012 Event',
    modalTitle: 'Reading the July 2012 Event',
    x: 73,
    y: 19,
    size: 48,
    figure: {
      label: 'Figure 2',
      placeholder: 'Insert additional SDO magnetic-loop image here',
      videoSrc: MAGNETIC_VIDEO_SRC,
      caption:
        "Magnetic loops in the solar corona captured by NASA’s Solar Dynamics Observatory. The bright arcing structures trace the magnetic field lines that guide charged plasma through the corona, helping explain why coronal rain falls in curved streams rather than straight downward paths. Source: NASA/SDO (2015).",
      insertAfterParagraph: 3,
    },
    paragraphs: [
      `What falls must have come from somewhere. That starting point is the Sun’s outer edge, an odd region known as its atmosphere. This star isn’t made of rock or metal; it’s a sphere built entirely from heated gas stacked in layers. The part people see when they look at the Sun, the photosphere, reaches temperatures near 5,500 °C, more than enough to turn solids into vapor instantly (NASA 2024a). Just above this bright shell spreads a fainter zone named the chromosphere, which then gives way to a wider area called the corona. Yet here, expectations fail completely. The corona usually hits temperatures ranging from one to three million degrees Celsius, whereas active zones during solar flares may surpass ten million (Reale 2014). Despite being farther out, the upper layer burns far hotter than the sun's visible face below it.`,
      `This mystery, known as the coronal heating problem, has challenged scientists since the mid-20th century (Klimchuk 2006). Filmed using extreme ultraviolet light, the APOD video captures what regular visible wavelengths cannot: searing heat within the Sun's atmosphere. Such imagery shows how shifting across the electromagnetic spectrum exposes hidden layers of nature, each frequency revealing something new.`,
      `For years, scientists have explored two main ideas. From deep under the surface, magnetic waves might travel upward, delivering heat to high-altitude gas. Instead of steady flows, miniature explosions could be responsible: endless little breakages in magnetic fields pumping brief surges across the outer atmosphere (Klimchuk 2006). One may lead; perhaps they share the role, it is still unclear. What actually drives the intense warmth up there stays unresolved.`,
      `Back in July 2012, something unusual caught researchers’ attention, plasma cooling and descending in striking clarity. Rather than just odd behavior, coronal rain has turned out to be a valuable clue in understanding a long-standing puzzle (Antolin 2020). Because it reveals hidden energy movements feeding the Sun’s outer atmosphere, observing its timing and structure offers rare insight. When droplets form and drop back down, they map processes normally impossible to see.`,
      `But the coronal rain was not the only thing the July 2012 eruption produced. It also fired something directly toward Earth.`,
    ],
  },
  {
    id: 4,
    orbLabel: 'Space Weather and Earth',
    modalTitle: 'Space Weather and Earth',
    x: 90,
    y: 43,
    size: 72,
    paragraphs: [
      `A sudden burst of solar activity tied to coronal rain might reach Earth with real consequences. Though originating far away, a coronal mass ejection carries charged material that disturbs our planet’s magnetic shield when it arrives. Such disturbances sometimes generate unwanted electrical flows within extended systems, power lines, oil routes, and risk harming orbiting equipment through particle bombardment. These effects interfere with navigation networks, weaken signal quality, and impair communication links (NASA 2024b). One historic case, the 1859 Carrington Event, ignited fires in multiple telegraph stations (Odenwald 2009). If something equally intense occurred now, widespread breakdowns would follow, affecting services once considered reliable.`,
      `Though steady at times, solar behavior shifts unpredictably. About every eleven years, the Sun moves from calm periods, marked by rare sunspots, to intense phases where eruptions grow common (NASA 2024a). By October 2024, signs confirmed a peak in activity, marking the height of Solar Cycle 25, reported jointly by NASA and NOAA (NASA 2024b). Earlier models suggested mild intensity, similar to the last cycle. Yet observations through mid-2024 showed stronger storms and greater spot counts than expected (NASA 2024b).`,
      `From their own homes, Australians witnessed what unfolded. During May 2024, an energetic patch on the Sun, AR13664, released multiple X-class flares along with coronal mass ejections, which slammed into Earth’s magnetic field, triggering the most intense geomagnetic disturbance since the early 2000s (NASA 2024b). Lights usually seen near the poles suddenly shimmered above regions like Queensland; images of magenta-tinged horizons and glowing greens spread rapidly online, captured even in Tasmania (Bureau of Meteorology 2024). Across several evenings, the mechanisms behind those celestial ribbons shown in astronomy archives, explosions, massive plasma bursts, guided by invisible fields, linked a remote star directly to ordinary landscapes below. That cascade on the solar surface and the glow dancing over Australia share the very same origin. One reveals what the other hides, both trace back to identical magnetic forces at work. To see how coronal rain moves is to glimpse the rhythm behind massive solar phenomena.`,
    ],
  },
  {
    id: 5,
    orbLabel: 'What Coronal Rain Is Teaching Scientists Today',
    modalTitle: 'What Coronal Rain Is Teaching Scientists Today',
    x: 78,
    y: 70,
    size: 56,
    paragraphs: [
      `Though the 2024 solar storms showed our vulnerability to space weather, a probe sent years earlier exposes deeper gaps in solar knowledge. Launched in 2020, the Solar Orbiter mission, jointly run by ESA and NASA, holds instruments designed for intimate views of the Sun (European Space Agency 2022). Closest approach came in spring 2022, around March and April, when it neared just a third of Earth’s orbital radius. At that point, its camera detecting extreme ultraviolet light focused on a turbulent zone near the solar surface.`,
      `Surprisingly detailed views reshaped understanding of coronal rain. Thanks to the High Resolution Imager aboard Solar Orbiter, features as small as 240 kilometres appeared clearly in extreme ultraviolet light, marking a new milestone for observations at such wavelengths (Antolin et al. 2023). For the first time, narrow threads of plasma, mere hundreds of kilometres across, came into view. Within the descending clumps, intricate patterns unfolded sharply.`,
      `Most crucially, the measurements uncovered an unfamiliar pattern. Right below the descending plasma threads, Solar Orbiter recorded fleeting bursts of ultraviolet light. Scientists suggest these result from small-scale heating, triggered when the falling material squeezes the gas in its path (Antolin et al. 2023). This behaves somewhat like meteoroids warming the air just ahead during rapid descent into Earth’s sky. Until now, scientists had never seen these heat patterns linked to rain. Falling material appears not just as an outcome of solar atmospheric warming, but possibly part of its source, releasing stored energy downward during descent.`,
      `Now under closer scrutiny, the strange ultraviolet cascade seen in the 2018 APOD video appears sharper than at any time earlier. Though still unexplained, each near approach by Solar Orbiter tightens the range of possible causes.`,
    ],
  },
  {
    id: 6,
    orbLabel: 'Conclusion',
    modalTitle: 'Conclusion',
    x: 38,
    y: 73,
    size: 52,
    paragraphs: [
      `Now that you understand the context, view the clip again. A flow once mistaken for quiet water reveals itself as superheated plasma, fifty thousand degrees intense, guided by unseen magnetic paths within air far hotter than the layer below. Eruptions creating such graceful curves may also unleash violent bursts, hurling vast clouds across 150 million kilometres of space. When they reach us, northern lights sometimes glow above places like Sydney. Occasionally, these events interfere with orbiting instruments and electrical networks vital to daily life. Even now, by 2026, scientists remain puzzled about what makes the solar corona so intensely hot, or how such a delicate glow of light helps sustain those extreme temperatures. Though the Sun has shone steadily for 4.6 billion years (NASA 2024a), systematic space-based observation began only decades ago. Despite modern tools, fresh discoveries continue to emerge without warning.`,
    ],
  },
  {
    id: 7,
    orbLabel: 'References & AI Acknowledgement',
    modalTitle: 'References & AI Acknowledgement',
    x: 14,
    y: 64,
    size: 46,
    paragraphs: [
      'AI acknowledgement: I used ChatGPT to assist with brainstorming structure, refining phrasing, and receiving feedback on clarity and presentation. All scientific content, factual claims, source selection, and final written interpretation were reviewed and verified by me against the cited sources.',
    ],
    references: [
      'Antolin, P., 2020. Thermal instability and non-equilibrium in solar coronal loops: from coronal rain to long-period intensity pulsations. Plasma Physics and Controlled Fusion, 62(1), 014016.',
      'Antolin, P., Martínez-Sykora, J., Sainz Dalda, A., Auchère, F., Berghmans, D., Mandal, S., Barczynski, K., Chitta, L.P., Peter, H., Teriaca, L., Schühle, U. and Harra, L., 2023. Extreme-ultraviolet fine structure and variability associated with coronal rain revealed by Solar Orbiter/EUI HRIEUV and SPICE. Astronomy & Astrophysics, 676, A112. Available at: https://www.aanda.org/articles/aa/full_html/2023/08/aa46016-23/ (Accessed 16 April 2026).',
      'European Space Agency, 2022. Solar Orbiter\'s first close encounter with the Sun. ESA, 25 March. Available at: https://www.esa.int/Science_Exploration/Space_Science/Solar_Orbiter (Accessed 16 April 2026).',
      'Klimchuk, J.A., 2006. On solving the coronal heating problem. Solar Physics, 234(1), pp.41–77.',
      'NASA, 2018. Coronal Rain on the Sun. Astronomy Picture of the Day, 27 May. Available at: https://apod.nasa.gov/apod/ap180527.html (Accessed 16 April 2026).',
      'NASA, 2024a. The Sun. NASA Science. Available at: https://science.nasa.gov/sun/ (Accessed 16 April 2026).',
      'NASA, 2024b. NASA, NOAA: Sun Reaches Maximum Phase in 11-Year Solar Cycle. NASA Science, 15 October. Available at: https://science.nasa.gov/science-research/heliophysics/nasa-noaa-sun-reaches-maximum-phase-in-11-year-solar-cycle/ (Accessed 16 April 2026).',
      'NASA/SDO, 2015. Solar Dynamics Observatory imagery archive. NASA Goddard Space Flight Center. Available at: https://sdo.gsfc.nasa.gov/gallery/main (Accessed 16 April 2026).',
      'Reale, F., 2014. Coronal loops: observations and modeling of confined plasma. Living Reviews in Solar Physics, 11(1), 4.',
      'OpenAI. 2026, ChatGPT [ChatGPT 5.4], Retrieved 17 April 2026, from https://chatgpt.com/',
      'Odenwald, S., 2009. The Day the Sun Brought Darkness. NASA, 13 March. Available at: https://www.nasa.gov/science-research/heliophysics/the-day-the-sun-brought-darkness/ (Accessed 18 April 2026)',
      'Bureau of Meteorology, 2024. Severe geomagnetic storm – May 2024. Space Weather Services, Australian Government. Available at: https://www.sws.bom.gov.au/ (Accessed 18 April 2026).',
    ],
  },
];
