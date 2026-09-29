const P={
heroes:"Daredevil,Wolverine,Wanda,Vision,Rocket,Yelena,Bucky,Mantis,Nebula,Gambit,Storm,Rogue,Cyclops,Hawkeye,Falcon,Groot,Drax,Gamora,Thor,Hulk,Deadpool,Blade,Shuri,Kamala,Spider-Man,Iron Man,Black Widow,Winter Soldier,Scarlet Witch,Doctor Strange,Captain Marvel,Captain America,Black Panther,Star-Lord,Moon Knight,She-Hulk,Silver Surfer,Punisher,Nightcrawler,Colossus,Jubilee,Beast,Iceman,Angel,Psylocke,Cable,Domino,Wasp,Ant-Man,War Machine,Wong,Valkyrie,Korg,Okoye,Nakia,Shang-Chi,America Chavez,Jessica Jones,Luke Cage,Iron Fist,Elektra,Ghost Rider,Nova,Quicksilver,Professor X,Jean Grey,Kitty Pryde,Nick Fury,Maria Hill,Agent Coulson,Peggy Carter,Miles Morales,Squirrel Girl,Black Bolt,Mister Fantastic,Invisible Woman,Human Torch,The Thing,Adam Warlock,Ka-Zar,Namor".split(","),
villains:"Loki,Magneto,Thanos,Mystique,Sabretooth,Doom,Doctor Doom,Ultron,Kang,Hela,Kingpin,Galactus,Venom,Carnage,Mysterio,Red Skull,Green Goblin,Baron Zemo,Killmonger,Dormammu,Apocalypse,Bullseye,Electro,Sandman,Ronan,Vulture,Rhino,Doctor Octopus,Lizard,Kraven,Taskmaster,Abomination,Leader,Mandarin,Whiplash,Obadiah Stane,Ego,Surtur,Malekith,Mister Sinister,Juggernaut,Sentinel,Emma Frost,Shadow King,Arnim Zola,Crossbones,Ghost,Yellowjacket,Hydra Supreme,Kang the Conqueror,He Who Remains,Mephisto,Knull,Gorr,Namora,Arishem,Proctor,Deviants,Zabu".split(","),
teams:"Avengers,X-Men,Guardians,Fantastic Four,Defenders,Inhumans,Eternals,Illuminati,Thunderbolts,Nova Corps,Ravagers,Dora Milaje,Masters of Evil,Brotherhood of Mutants,Hellfire Club,Sinister Six,Young Avengers,Champions,Howling Commandos,Ten Rings,Midnight Sons,Secret Warriors,Heroes for Hire,New Mutants,Uncanny X-Men,Excalibur,X-Force,Great Lakes Avengers,Kree Empire,Skrull Empire,Chitauri,Sakaaran Guard,Hydra,SHIELD,TVA,AIM,Damage Control,Time Keepers,Mighty Avengers,Illuminati Council,Frightful Four,Savage Land Mutates".split(","),
places:"Wakanda,Latveria,Asgard,Knowhere,Sokovia,Genosha,Madripoor,Titan,Sakaar,Xandar,Vormir,Hala,Ego's Planet,Nidavellir,Svartalfheim,Jotunheim,Muspelheim,Niflheim,Alfheim,Midgard,Kamar-Taj,Sanctum Sanctorum,Baxter Building,Stark Tower,Avengers Tower,Xavier's School,Hell's Kitchen,Savage Land,Atlantis,Talokan,Attilan,Monster Island,Counter-Earth,Battleworld,The Raft,The Void,Quantum Realm,Dark Dimension,Mirror Dimension,Sacred Timeline,Multiverse,Krakoa,Weirdworld,Negative Zone,Sanctuary II,Shadowland,New Asgard,Sokovia Accords,Grand Central,Citadel,Triskelion,Helicarrier,Sentinel Island".split(","),
objects:"Vibranium,Adamantium,Mjolnir,Stormbreaker,Tesseract,Cerebro,Bifrost,Infinity Stones,Infinity Gauntlet,Mind Stone,Time Stone,Soul Stone,Reality Stone,Power Stone,Space Stone,Eye of Agamotto,Cloak of Levitation,Darkhold,Necronomicon,Arc Reactor,Pym Particles,Web-Shooters,Nano Suit,Iron Legion,Cosmic Cube,Vita-Rays,Super Soldier Serum,Gamma Radiation,Terrigen Mist,Uru,Nullifier,Quantum Tunnel,Zero Point Energy,Ultimate Nullifier,Ebony Blade,Wand of Watoomb,Sling Ring,Captain America's Shield,Widow's Bite,Gungnir,Cosmic Cube,Time Variance Authority,Mobius Clock,Orb,Aether,Космос,Loom of Fate,Sword of Kang,Pym Disc,Ghost Rider Chain,Ronin Mask,Web of Life".split(",").filter(x=>x!=="Космос")};

const $=id=>document.getElementById(id);
const text=$("text"),caret=$("caret"),inp=$("inp"),app=$("app");
const eq=(a,b)=>a!==undefined&&b!==undefined&&a.toLowerCase()===b.toLowerCase();
let dur=30,cat="all",chars=[],src="",prev=0,started=false,ended=false,t0=0,tm,good=0,total=0;
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};

function build(){
  const pool=cat==="all"?Object.values(P).flat():P[cat];
  let t=[];while(t.length<220)t=t.concat(shuf(pool));t=t.slice(0,220);
  src=t.join(" ");
  [...text.children].forEach(n=>{if(n!==caret)n.remove()});
  text.insertAdjacentHTML("beforeend",t.map(w=>`<span class="w">${[...w].map(c=>`<i>${c}</i>`).join("")}</span>`).join("<i class='s'> </i>"));
  chars=[...text.querySelectorAll("i")];
}

function reset(){
  clearInterval(tm);started=ended=false;prev=0;good=total=0;inp.value="";
  app.classList.remove("run","done");
  $("time").textContent=dur;$("wpm").textContent=0;$("acc").textContent=100;
  $("fill").style.transition="none";$("fill").style.transform="scaleX(1)";
  text.style.opacity=0;build();text.style.transform="";
  requestAnimationFrame(()=>{text.style.opacity=1;place()});
  inp.focus();
}

function place(){
  const n=inp.value.length,c=chars[Math.min(n,chars.length-1)];
  const lh=parseFloat(getComputedStyle(text).lineHeight);
  const x=n>=chars.length?c.offsetLeft+c.offsetWidth:c.offsetLeft;
  caret.style.height=c.offsetHeight+"px";
  caret.style.transform=`translate(${x-1}px,${c.offsetTop}px)`;
  const line=Math.round(c.offsetTop/lh);
  text.style.transform=`translateY(${-Math.max(0,line-1)*lh}px)`;
}

function stats(){
  const m=Math.max((Date.now()-t0)/60000,1/600);
  return{wpm:Math.round(good/5/m),acc:total?Math.round(good/total*100):100};
}

function start(){
  started=true;t0=Date.now();app.classList.add("run");
  const f=$("fill");f.style.transition=`transform ${dur}s linear`;f.style.transform="scaleX(0)";
  tm=setInterval(()=>{
    const left=Math.max(0,Math.ceil(dur-(Date.now()-t0)/1000));
    $("time").textContent=left;const s=stats();$("wpm").textContent=s.wpm;$("acc").textContent=s.acc;
    if(left<=0)finish();
  },100);
}

function finish(){
  if(ended)return;ended=true;clearInterval(tm);
  const s=stats(),v=inp.value;let ok=0;for(let i=0;i<v.length;i++)if(eq(v[i],src[i]))ok++;
  $("rw").textContent=s.wpm;$("ra").textContent=s.acc+"%";$("rc").textContent=ok;$("re").textContent=v.length-ok;
  app.classList.remove("run");app.classList.add("done");
}

inp.addEventListener("input",()=>{
  if(ended)return;
  let v=inp.value;if(v.length>src.length){v=inp.value=v.slice(0,src.length)}
  if(!started&&v.length)start();
  if(v.length>prev){total+=v.length-prev;for(let i=prev;i<v.length;i++)if(eq(v[i],src[i]))good++}
  const a=Math.min(prev,v.length),b=Math.max(prev,v.length);
  for(let i=a;i<b;i++)chars[i].className="";
  for(let i=a;i<v.length;i++)chars[i].className=eq(v[i],src[i])?"ok":"bad";
  prev=v.length;place();
  if(v.length>=src.length)finish();
});

document.addEventListener("keydown",e=>{
  if(e.key==="Tab"||e.key==="Escape"){e.preventDefault();reset();return}
  if(!ended&&!e.metaKey&&!e.ctrlKey)inp.focus();
});
$("shuf").addEventListener("click",reset);
$("view").addEventListener("click",()=>inp.focus());
function pick(box,attr,fn){$(box).addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
 [...$(box).children].forEach(x=>x.classList.toggle("on",x===b));fn(b.dataset[attr]);reset()})}
pick("modes","t",v=>dur=+v);pick("cats","c",v=>cat=v);
window.addEventListener("resize",place);
document.fonts&&document.fonts.ready.then(place);
reset();