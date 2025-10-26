/* ExampleSite copy of background script — same behavior as theme script. */
// (The real theme file is used when the theme is referenced directly.)
const cfg_example = (typeof window !== 'undefined' && window.ARBORIST_CONFIG) ? window.ARBORIST_CONFIG : { bgAnimation: true, bgParticles: 600 };
console.info('ExampleSite: using theme background script (cfg)', cfg_example);
/* The theme's main script will be used in practice; this placeholder exists so exampleSite builds if referenced directly. */
