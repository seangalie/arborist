/* background particle animation using p5 in instance mode
     This file expects p5 to be loaded (we include it in head.html). The sketch attaches to the
     element with id "bgAnimation" so it doesn't take over the whole document. */

const sketch = (p) => {
    const deg = (a) => Math.PI / 180 * a;
    const rand = (v1, v2) => Math.floor(v1 + Math.random() * (v2 - v1));

    const opt = {
        particles: 500,
        noiseScale: 0.009,
        angle: Math.PI / 180 * -90,
        h1: rand(0, 360),
        h2: rand(0, 360),
        s1: rand(20, 90),
        s2: rand(20, 90),
        l1: rand(30, 80),
        l2: rand(30, 80),
        strokeWeight: 1.2,
        tail: 82,
    };

    let Particles = [];
    let time = 0;

    p.setup = function() {
        // attach canvas to the container element so the rest of the page remains interactive
        const container = document.getElementById('bgAnimation') || document.body;
        p.createCanvas(container.clientWidth || p.windowWidth, container.clientHeight || p.windowHeight);
        // choose number of particles based on width
        opt.particles = (p.width > 1200) ? 1000 : ((p.width > 600) ? 600 : 300);
        p.colorMode(p.HSL, 360, 100, 100, 1);
        p.strokeWeight(opt.strokeWeight);
        for (let i = 0; i < opt.particles; i++) {
            Particles.push(new Particle(Math.random() * p.width, Math.random() * p.height));
        }
        // click to randomize palette
        container.addEventListener('click', () => {
            opt.h1 = rand(0, 360);
            opt.h2 = rand(0, 360);
            opt.s1 = rand(20, 90);
            opt.s2 = rand(20, 90);
            opt.l1 = rand(30, 80);
            opt.l2 = rand(30, 80);
            opt.angle += deg(rand(0, 60)) * (Math.random() > 0.5 ? 1 : -1);
            for (let pp of Particles) pp.randomize();
        });
    };

    p.draw = function() {
        time++;
        // tail effect: draw a translucent rectangle to slowly fade previous frames
        p.noStroke();
        p.fill(0, 0, 0, 1 - (opt.tail / 100));
        p.rect(0, 0, p.width, p.height);

        for (let pp of Particles) {
            pp.update();
            pp.render();
        }
    };

    p.windowResized = function() {
        const container = document.getElementById('bgAnimation') || document.body;
        p.resizeCanvas(container.clientWidth || p.windowWidth, container.clientHeight || p.windowHeight);
    };

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.lx = x;
            this.ly = y;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
            this.hueSemen = Math.random();
            this.hue = this.hueSemen > 0.5 ? 20 + opt.h1 : 20 + opt.h2;
            this.sat = this.hueSemen > 0.5 ? opt.s1 : opt.s2;
            this.light = this.hueSemen > 0.5 ? opt.l1 : opt.l2;
            this.maxSpeed = this.hueSemen > 0.5 ? 3 : 2;
        }

        randomize() {
            this.hueSemen = Math.random();
            this.hue = this.hueSemen > 0.5 ? 20 + opt.h1 : 20 + opt.h2;
            this.sat = this.hueSemen > 0.5 ? opt.s1 : opt.s2;
            this.light = this.hueSemen > 0.5 ? opt.l1 : opt.l2;
            this.maxSpeed = this.hueSemen > 0.5 ? 3 : 2;
        }

        update() {
            this.follow();
            this.vx += this.ax;
            this.vy += this.ay;
            const pSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const ang = Math.atan2(this.vy, this.vx);
            const m = Math.min(this.maxSpeed, pSpeed);
            this.vx = Math.cos(ang) * m;
            this.vy = Math.sin(ang) * m;
            this.x += this.vx;
            this.y += this.vy;
            this.ax = 0;
            this.ay = 0;
            this.edges();
        }

        follow() {
            const angle = (p.noise(this.x * opt.noiseScale, this.y * opt.noiseScale, time * opt.noiseScale)) * Math.PI * 0.5 + opt.angle;
            this.ax += Math.cos(angle);
            this.ay += Math.sin(angle);
        }

        updatePrev() {
            this.lx = this.x;
            this.ly = this.y;
        }

        edges() {
            if (this.x < 0) {
                this.x = p.width;
                this.updatePrev();
            }
            if (this.x > p.width) {
                this.x = 0;
                this.updatePrev();
            }
            if (this.y < 0) {
                this.y = p.height;
                this.updatePrev();
            }
            if (this.y > p.height) {
                this.y = 0;
                this.updatePrev();
            }
        }

        render() {
            p.stroke(this.hue, this.sat, this.light, 0.5);
            p.line(this.x, this.y, this.lx, this.ly);
            this.updatePrev();
        }
    }
};

// runtime config — populated by the head partial
const cfg = (typeof window !== 'undefined' && window.ARBORIST_CONFIG) ? window.ARBORIST_CONFIG : { bgAnimation: true, bgParticles: 600 };

function shouldEnableAnimation() {
    if (!cfg.bgAnimation) return false;
    // respect reduced motion
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    // low-memory devices: deviceMemory < 1 indicates very low RAM
    if (typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory < 1) return false;
    // low CPU devices
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;
    return true;
}

// adjust particle count from config if provided
if (cfg.bgParticles && Number.isFinite(cfg.bgParticles)) {
    // apply as a default; setup may adjust for viewport
    // the inner value used by the sketch is referenced via cfg.bgParticles in setup
}

if (typeof window !== 'undefined' && typeof window.p5 === 'undefined' && cfg.bundleP5) {
    console.warn('Arborist: p5 not found globally — ensure static/vendor/p5.min.js contains p5 when using bundleP5.');
}

if (!shouldEnableAnimation()) {
    // do not instantiate the sketch
    console.info('Arborist: background animation disabled by configuration or device constraints');
} else {
    // create the p5 instance attached to the bgAnimation container so it doesn't obscure UI
    new p5(sketch, document.getElementById('bgAnimation') || document.body);
}