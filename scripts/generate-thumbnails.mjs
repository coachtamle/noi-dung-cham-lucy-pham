import fs from "fs";
import path from "path";

const OUT = "./public/images";

const BG = "#FAFAFA";
const FG = "#111111";

function svg(content) {
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 586" fill="none">
  <rect width="880" height="586" fill="${BG}"/>
  ${content}
</svg>`;
}

const thumbnails = {
	"thumb-ban-dang-phan-ung-voi-hien-tai-hay-voi-dieu-cu": svg(`
  <!-- Past echoing into present reaction -->
  <circle cx="300" cy="293" r="160" stroke="${FG}" stroke-width="3" fill="${FG}" fill-opacity="0.07"/>
  <circle cx="580" cy="293" r="160" stroke="${FG}" stroke-width="3" fill="${FG}" fill-opacity="0.13"/>
  <!-- Overlap zone darker -->
  <path d="M440 293 A160 160 0 0 1 580 133 A160 160 0 0 1 580 453 A160 160 0 0 1 440 293 Z" fill="${FG}" fill-opacity="0.1"/>
  <!-- Arrow from past to present -->
  <path d="M390 270 L470 270" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
  <path d="M462 262 L473 270 L462 278" stroke="${FG}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Dots: past wound -->
  <circle cx="300" cy="293" r="14" fill="${FG}"/>
  <!-- Dot: reaction -->
  <circle cx="580" cy="293" r="18" fill="${FG}"/>
  <!-- Label lines -->
  <line x1="100" y1="500" x2="780" y2="500" stroke="${FG}" stroke-width="1" stroke-dasharray="4,4" opacity="0.3"/>
  <line x1="100" y1="520" x2="620" y2="520" stroke="${FG}" stroke-width="1" stroke-dasharray="4,4" opacity="0.2"/>
`),

	"thumb-ban-dang-ra-quyet-dinh-bang-tam-nhin-hay-noi-so": svg(`
  <!-- Stem path -->
  <path d="M440 500 L440 340" stroke="${FG}" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Vision path: clear solid line going upper-left -->
  <path d="M440 340 L220 140" stroke="${FG}" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="220" cy="140" r="22" fill="${FG}"/>
  <!-- Fear path: shaky dashed going upper-right -->
  <path d="M440 340 L660 140" stroke="${FG}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="12,8"/>
  <circle cx="660" cy="140" r="16" fill="none" stroke="${FG}" stroke-width="2.5"/>
  <!-- Fork node -->
  <circle cx="440" cy="340" r="12" fill="none" stroke="${FG}" stroke-width="3"/>
  <!-- Person at base -->
  <circle cx="440" cy="530" r="16" fill="${FG}"/>
  <path d="M440 546 L440 565" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
  <path d="M424 554 L456 554" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
  <path d="M440 565 L430 580" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
  <path d="M440 565 L450 580" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
`),

	"thumb-cach-ban-lanh-dao-se-thay-doi-khi-ap-luc-tang": svg(`
  <!-- Pressure weight pressing down -->
  <rect x="220" y="80" width="440" height="80" rx="8" fill="${FG}" fill-opacity="0.9"/>
  <!-- Arrow pressing down from weight -->
  <path d="M440 160 L440 240" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
  <path d="M426 230 L440 246 L454 230" stroke="${FG}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Person bending under weight -->
  <circle cx="440" cy="310" r="28" fill="none" stroke="${FG}" stroke-width="3"/>
  <!-- Bent body -->
  <path d="M440 338 Q430 380 400 420" stroke="${FG}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <!-- Arms bracing -->
  <path d="M415 370 L370 350" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
  <path d="M408 390 L370 410" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
  <!-- Ground crack lines -->
  <path d="M340 480 L440 460 L560 480" stroke="${FG}" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M380 500 L440 480 L500 500" stroke="${FG}" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5"/>
`),

	"thumb-dieu-ban-noi-minh-uu-tien-thuong-khong-phai-dieu-ban-that-su-song": svg(`
  <!-- Two columns: said vs lived -->
  <!-- Left column (words/stated) -->
  <rect x="160" y="120" width="200" height="340" rx="4" stroke="${FG}" stroke-width="2" fill="${FG}" fill-opacity="0.05"/>
  <!-- Right column (actions/real - taller) -->
  <rect x="520" y="80" width="200" height="380" rx="4" fill="${FG}" fill-opacity="0.85"/>
  <!-- Heart icon in left -->
  <path d="M244 250 Q244 220 260 220 Q276 220 276 240 Q276 220 292 220 Q308 220 308 250 Q308 290 276 310 Q244 290 244 250 Z" stroke="${FG}" stroke-width="2.5" fill="none"/>
  <!-- Clock/money stack in right: dollar-like circles -->
  <circle cx="620" cy="220" r="30" stroke="white" stroke-width="2.5" fill="none"/>
  <line x1="620" y1="200" x2="620" y2="222" stroke="white" stroke-width="2"/>
  <line x1="620" y1="222" x2="635" y2="222" stroke="white" stroke-width="2"/>
  <circle cx="620" cy="320" r="30" stroke="white" stroke-width="2.5" fill="none" opacity="0.7"/>
  <circle cx="620" cy="400" r="20" stroke="white" stroke-width="2" fill="none" opacity="0.4"/>
  <!-- VS label area -->
  <line x1="440" y1="120" x2="440" y2="460" stroke="${FG}" stroke-width="1.5" stroke-dasharray="6,5" opacity="0.35"/>
`),

	"thumb-dieu-nguy-hiem-nhat-khong-phai-la-ban-sai": svg(`
  <!-- Person walking forward, shadow behind shows different shape -->
  <!-- Person (simple figure, upright, walking forward) -->
  <circle cx="520" cy="200" r="36" fill="${FG}"/>
  <path d="M520 236 L520 340" stroke="${FG}" stroke-width="10" stroke-linecap="round"/>
  <path d="M480 290 L560 290" stroke="${FG}" stroke-width="8" stroke-linecap="round"/>
  <path d="M520 340 L490 420" stroke="${FG}" stroke-width="8" stroke-linecap="round"/>
  <path d="M520 340 L550 420" stroke="${FG}" stroke-width="8" stroke-linecap="round"/>
  <!-- Shadow to the left: distorted shape (blind spot) -->
  <ellipse cx="340" cy="490" rx="140" ry="24" fill="${FG}" fill-opacity="0.2"/>
  <!-- Shadow figure - different/distorted -->
  <path d="M520 440 L340 490" stroke="${FG}" stroke-width="1.5" stroke-dasharray="8,6" opacity="0.4"/>
  <path d="M220 400 Q270 420 320 460 Q360 490 380 480 Q360 440 300 400 Q260 380 220 400 Z" fill="${FG}" fill-opacity="0.25"/>
  <!-- Red slash over person's back (blind spot) -->
  <circle cx="380" cy="300" r="50" stroke="${FG}" stroke-width="3" fill="none" stroke-dasharray="8,5"/>
  <line x1="345" y1="265" x2="415" y2="335" stroke="${FG}" stroke-width="3" opacity="0.6"/>
`),

	"thumb-moi-thu-ban-dat-duoc-deu-duoc-doi-bang-mot-thu-khac": svg(`
  <!-- Balance scale, significantly tilted -->
  <!-- Center pole -->
  <line x1="440" y1="120" x2="440" y2="480" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
  <!-- Base -->
  <rect x="340" y="460" width="200" height="20" rx="4" fill="${FG}"/>
  <!-- Beam, tilted left-heavy -->
  <path d="M180 270 L700 200" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
  <!-- Left pan: heavy/low with stacked circles -->
  <path d="M180 270 Q140 310 180 330 Q220 350 260 330 Q300 310 260 270" stroke="${FG}" stroke-width="2.5" fill="${FG}" fill-opacity="0.1"/>
  <line x1="180" y1="270" x2="260" y2="270" stroke="${FG}" stroke-width="2"/>
  <circle cx="220" cy="300" r="18" fill="${FG}" fill-opacity="0.7"/>
  <circle cx="220" cy="276" r="14" fill="${FG}" fill-opacity="0.5"/>
  <!-- Right pan: light/high -->
  <path d="M700 200 Q660 220 700 240 Q740 260 780 240 Q820 220 780 200" stroke="${FG}" stroke-width="2.5" fill="${FG}" fill-opacity="0.06"/>
  <line x1="700" y1="200" x2="780" y2="200" stroke="${FG}" stroke-width="2"/>
  <circle cx="740" cy="220" r="10" fill="${FG}" fill-opacity="0.3"/>
  <!-- Top fulcrum -->
  <circle cx="440" cy="120" r="10" fill="${FG}"/>
`),

	"thumb-nen-kinh-te-cua-nhung-su-danh-doi-doc-hai": svg(`
  <!-- Trophy on pedestal of stick figures -->
  <!-- Trophy cup -->
  <path d="M320 80 Q280 120 300 200 Q320 260 440 280 Q560 260 580 200 Q600 120 560 80 Z" stroke="${FG}" stroke-width="3" fill="${FG}" fill-opacity="0.08"/>
  <path d="M300 200 Q260 200 250 160 Q240 130 270 120" stroke="${FG}" stroke-width="2.5" fill="none"/>
  <path d="M580 200 Q620 200 630 160 Q640 130 610 120" stroke="${FG}" stroke-width="2.5" fill="none"/>
  <!-- Trophy stem -->
  <rect x="400" y="280" width="80" height="60" fill="${FG}" fill-opacity="0.7"/>
  <rect x="350" y="340" width="180" height="20" rx="2" fill="${FG}" fill-opacity="0.85"/>
  <!-- Pedestal of exhausted figures (small stick people bent/broken) -->
  <path d="M220 430 Q250 400 270 420 Q290 440 310 420 Q280 460 260 480 Q240 500 220 480 Z" fill="${FG}" fill-opacity="0.25" stroke="${FG}" stroke-width="1.5"/>
  <path d="M370 410 Q400 385 420 405 Q440 425 460 405 Q435 445 415 465 Q395 485 370 465 Z" fill="${FG}" fill-opacity="0.25" stroke="${FG}" stroke-width="1.5"/>
  <path d="M520 430 Q550 400 570 420 Q590 440 610 420 Q580 460 560 480 Q540 500 520 480 Z" fill="${FG}" fill-opacity="0.25" stroke="${FG}" stroke-width="1.5"/>
  <path d="M180" y1="360" x2="700" y2="360" stroke="${FG}" stroke-width="2" opacity="0.3"/>
  <line x1="180" y1="360" x2="700" y2="360" stroke="${FG}" stroke-width="2" opacity="0.3"/>
`),

	"thumb-nghich-ly-cua-tu-do-tai-chinh": svg(`
  <!-- Chain link that looks like a freedom circle -->
  <!-- Outer ring (freedom) -->
  <circle cx="440" cy="280" r="180" stroke="${FG}" stroke-width="5" fill="none"/>
  <!-- But it's a chain: interlocking links -->
  <ellipse cx="440" cy="140" rx="55" ry="35" stroke="${FG}" stroke-width="3.5" fill="${BG}"/>
  <ellipse cx="440" cy="140" rx="35" ry="18" stroke="${FG}" stroke-width="2" fill="${FG}" fill-opacity="0.1"/>
  <ellipse cx="440" cy="420" rx="55" ry="35" stroke="${FG}" stroke-width="3.5" fill="${BG}"/>
  <ellipse cx="440" cy="420" rx="35" ry="18" stroke="${FG}" stroke-width="2" fill="${FG}" fill-opacity="0.1"/>
  <!-- Person inside circle reaching upward -->
  <circle cx="440" cy="300" r="20" fill="${FG}"/>
  <path d="M440 320 L440 360" stroke="${FG}" stroke-width="5" stroke-linecap="round"/>
  <!-- Arms reaching up toward "freedom" ring - but the ring is the chain -->
  <path d="M420 340 L390 295" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
  <path d="M460 340 L490 295" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
  <path d="M440 360 L420 390" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
  <path d="M440 360 L460 390" stroke="${FG}" stroke-width="4" stroke-linecap="round"/>
`),

	"thumb-tai-sao-minh-lai-chon-cong-viec-nay-moi-quan-he-nay-loi-song-nay": svg(`
  <!-- Fork road: person choosing AWAY not TOWARD -->
  <!-- Person moving to the right -->
  <circle cx="280" cy="310" r="22" fill="${FG}"/>
  <path d="M280 332 L280 368" stroke="${FG}" stroke-width="6" stroke-linecap="round"/>
  <path d="M258 350 L302 350" stroke="${FG}" stroke-width="5" stroke-linecap="round"/>
  <path d="M280 368 L262 395" stroke="${FG}" stroke-width="5" stroke-linecap="round"/>
  <path d="M280 368 L298 395" stroke="${FG}" stroke-width="5" stroke-linecap="round"/>
  <!-- What they're running FROM (on the left) - jagged burst of fear -->
  <path d="M80 310 L120 280 L110 310 L160 290 L140 320 L180 310 L155 340 L180 360 L140 350 L150 380 L110 360 L120 390 L80 360 Z" fill="${FG}" fill-opacity="0.12" stroke="${FG}" stroke-width="1.5"/>
  <!-- Arrow of movement (escape direction) -->
  <path d="M320 340 L520 340" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
  <path d="M510 328 L524 340 L510 352" stroke="${FG}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Destination (right side) - empty question mark area -->
  <circle cx="660" cy="340" r="80" stroke="${FG}" stroke-width="2" stroke-dasharray="10,7" fill="none"/>
  <!-- Question mark inside -->
  <path d="M640 305 Q640 285 660 285 Q680 285 680 305 Q680 325 660 335 L660 355" stroke="${FG}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="660" cy="375" r="5" fill="${FG}"/>
`),

	"thumb-tien-khong-chi-anh-huong-den-cuoc-song": svg(`
  <!-- Coin with ripple effect shaping person -->
  <!-- Central coin -->
  <circle cx="440" cy="260" r="90" stroke="${FG}" stroke-width="4" fill="${FG}" fill-opacity="0.08"/>
  <circle cx="440" cy="260" r="64" stroke="${FG}" stroke-width="2" stroke-dasharray="6,4" fill="none"/>
  <!-- Dollar-like mark in coin -->
  <line x1="440" y1="222" x2="440" y2="298" stroke="${FG}" stroke-width="3" stroke-linecap="round"/>
  <path d="M418 238 Q440 228 462 238 Q484 248 462 258 Q440 268 418 278 Q396 288 418 298 Q440 308 462 298" stroke="${FG}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Ripple circles expanding outward -->
  <circle cx="440" cy="260" r="130" stroke="${FG}" stroke-width="1.5" fill="none" opacity="0.4"/>
  <circle cx="440" cy="260" r="180" stroke="${FG}" stroke-width="1" fill="none" opacity="0.25"/>
  <circle cx="440" cy="260" r="240" stroke="${FG}" stroke-width="0.75" fill="none" opacity="0.15"/>
  <!-- Person silhouette on right being shaped by ripples -->
  <circle cx="720" cy="200" r="22" fill="${FG}" fill-opacity="0.5"/>
  <path d="M720 222 L720 290" stroke="${FG}" stroke-width="8" stroke-linecap="round" opacity="0.5"/>
  <path d="M698 258 L742 258" stroke="${FG}" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
  <path d="M720 290 L700 330" stroke="${FG}" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
  <path d="M720 290 L740 330" stroke="${FG}" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
`),

	"thumb-toi-tuong-toi-quan-ly-team": svg(`
  <!-- Puppet controller controlling team, but also being controlled by invisible fear -->
  <!-- Invisible control from above (dotted strings going UP) -->
  <path d="M440 60 L440 120" stroke="${FG}" stroke-width="2" stroke-dasharray="8,6" opacity="0.4"/>
  <path d="M380 80 L380 130" stroke="${FG}" stroke-width="2" stroke-dasharray="8,6" opacity="0.3"/>
  <path d="M500 80 L500 130" stroke="${FG}" stroke-width="2" stroke-dasharray="8,6" opacity="0.3"/>
  <!-- Abstract "fear" cloud at top -->
  <path d="M310 60 Q340 30 380 45 Q400 20 440 30 Q480 15 510 40 Q550 30 570 60 Q580 80 560 90 Q540 100 310 95 Q290 85 310 60 Z" fill="${FG}" fill-opacity="0.15" stroke="${FG}" stroke-width="1.5"/>
  <!-- Puppet controller (manager figure) -->
  <circle cx="440" cy="200" r="26" fill="${FG}"/>
  <path d="M440 226 L440 280" stroke="${FG}" stroke-width="7" stroke-linecap="round"/>
  <path d="M410 250 L470 250" stroke="${FG}" stroke-width="6" stroke-linecap="round"/>
  <!-- Strings going DOWN to team -->
  <path d="M400 280 L280 360" stroke="${FG}" stroke-width="2"/>
  <path d="M440 280 L440 360" stroke="${FG}" stroke-width="2"/>
  <path d="M480 280 L600 360" stroke="${FG}" stroke-width="2"/>
  <!-- Team members (smaller figures) -->
  <circle cx="280" cy="375" r="14" fill="${FG}" fill-opacity="0.6"/>
  <path d="M280 389 L280 420" stroke="${FG}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <circle cx="440" cy="375" r="14" fill="${FG}" fill-opacity="0.6"/>
  <path d="M440 389 L440 420" stroke="${FG}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <circle cx="600" cy="375" r="14" fill="${FG}" fill-opacity="0.6"/>
  <path d="M600 389 L600 420" stroke="${FG}" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
`),

	"thumb-tri-thong-minh-cang-cao-diem-mu-cang-kien-co": svg(`
  <!-- High peak with bright light at top but shadow/blind spot directly below -->
  <!-- Mountain/peak shape -->
  <path d="M140 500 L440 100 L740 500 Z" stroke="${FG}" stroke-width="3" fill="${FG}" fill-opacity="0.06"/>
  <!-- Bright light at peak -->
  <circle cx="440" cy="100" r="36" fill="${FG}" fill-opacity="0.85"/>
  <!-- Light rays from peak -->
  <line x1="440" y1="60" x2="440" y2="30" stroke="${FG}" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="468" y1="72" x2="490" y2="50" stroke="${FG}" stroke-width="2" stroke-linecap="round"/>
  <line x1="412" y1="72" x2="390" y2="50" stroke="${FG}" stroke-width="2" stroke-linecap="round"/>
  <line x1="480" y1="95" x2="510" y2="85" stroke="${FG}" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="400" y1="95" x2="370" y2="85" stroke="${FG}" stroke-width="1.5" stroke-linecap="round"/>
  <!-- DIRECTLY below the light: a dark shadow blind spot zone -->
  <path d="M400 140 L480 140 L520 260 L360 260 Z" fill="${FG}" fill-opacity="0.35"/>
  <!-- Blind spot label: question marks inside dark zone -->
  <circle cx="440" cy="195" r="8" fill="${BG}" fill-opacity="0.7"/>
  <circle cx="440" cy="230" r="5" fill="${BG}" fill-opacity="0.5"/>
  <!-- Side slopes bright (clear visibility away from peak) -->
  <path d="M200 450 L340 260" stroke="${FG}" stroke-width="1.5" stroke-dasharray="6,5" opacity="0.3"/>
  <path d="M680 450 L540 260" stroke="${FG}" stroke-width="1.5" stroke-dasharray="6,5" opacity="0.3"/>
`),
};

fs.mkdirSync(OUT, { recursive: true });
let count = 0;
for (const [name, content] of Object.entries(thumbnails)) {
	fs.writeFileSync(path.join(OUT, `${name}.svg`), content, "utf8");
	count++;
}
console.log(`Generated ${count} thumbnails in ${OUT}`);
