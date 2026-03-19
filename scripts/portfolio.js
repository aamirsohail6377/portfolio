document.addEventListener('DOMContentLoaded', () => {

    // AOS
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 600, once: true, easing: 'ease-out-cubic', offset: 0 });
    }

    // Touch detection
    const isTouch = window.matchMedia('(hover: none)').matches;

    // Custom cursor
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursor-ring');
    if (!isTouch && cursor && ring) {
      document.body.style.cursor = 'none';
      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my;
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      ring.style.left   = rx + 'px'; ring.style.top  = ry + 'px';
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
      (function animCursor() {
        cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
        rx += (mx - rx) * .12; ry += (my - ry) * .12;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
        requestAnimationFrame(animCursor);
      })();
    } else {
      if (cursor) cursor.style.display = 'none';
      if (ring)   ring.style.display   = 'none';
    }

    // Hamburger
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      document.querySelectorAll('.menu-link').forEach(l => {
        l.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          hamburger.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Theme toggle
    const themeBtn    = document.getElementById('theme-toggle');
    const toggleIcon  = document.getElementById('toggle-icon');
    const toggleLabel = document.getElementById('toggle-label');
    function applyLight() {
      document.body.classList.add('light');
      if (toggleIcon)  toggleIcon.textContent  = '☀️';
      if (toggleLabel) toggleLabel.textContent = 'Light';
      try { localStorage.setItem('theme','light'); } catch(e) {}
    }
    function applyDark() {
      document.body.classList.remove('light');
      if (toggleIcon)  toggleIcon.textContent  = '🌙';
      if (toggleLabel) toggleLabel.textContent = 'Dark';
      try { localStorage.setItem('theme','dark'); } catch(e) {}
    }
    try { if (localStorage.getItem('theme') === 'light') applyLight(); } catch(e) {}
    if (themeBtn) themeBtn.addEventListener('click', () => {
      document.body.classList.contains('light') ? applyDark() : applyLight();
    });

    // Skill bars
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + '%';
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.skill-bar-fill').forEach(b => barObs.observe(b));

    // Nav shrink on scroll
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      if (!nav) return;
      const w  = window.innerWidth;
      const hp = w <= 400 ? '.85rem' : w <= 600 ? '1rem' : w <= 860 ? '1.5rem' : w <= 1024 ? '2rem' : '3rem';
      const vp = window.scrollY > 50 ? '.65rem' : w <= 600 ? '.85rem' : '1.1rem';
      nav.style.padding = `${vp} ${hp}`;
    }, { passive: true });

    // GSAP animations
    window.addEventListener('load', () => {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
      gsap.registerPlugin(ScrollTrigger);
      gsap.to('.hero-name', { y: -60, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.blob-1',    { y: -100, x: 50, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.utils.toArray('.stat-card').forEach((c, i) => {
        gsap.fromTo(c, { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, delay: i * .08, ease: 'back.out(1.7)', scrollTrigger: { trigger: c, start: 'top 105%' } });
      });
      gsap.utils.toArray('.project-card').forEach((c, i) => {
        gsap.fromTo(c, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .55, delay: i * .06, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 108%' } });
      });
      gsap.utils.toArray('.timeline-item').forEach(item => {
        gsap.fromTo(item, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 108%' } });
      });
      gsap.utils.toArray('.cert-card').forEach((c, i) => {
        gsap.fromTo(c, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .45, delay: i * .06, ease: 'power2.out', scrollTrigger: { trigger: c, start: 'top 108%' } });
      });
    });

    // Safety fallback
    setTimeout(() => {
      document.querySelectorAll('.project-card, .timeline-item, .stat-card, .cert-card').forEach(el => {
        el.style.opacity    = '1';
        el.style.transform  = 'none';
      });
    }, 3000);

    // ─── RICH TEXT EDITOR ───
    const rteBody     = document.getElementById('rte-body');
    const charCount   = document.getElementById('cf-chars');
    const attachList  = document.getElementById('rte-attachments');
    const fileInput   = document.getElementById('rte-file-input');
    const imgInput    = document.getElementById('rte-img-input');
    const attachedFiles = [];

    if (rteBody && charCount) {
      rteBody.addEventListener('input', () => {
        charCount.textContent = rteBody.innerText.length;
      });
    }

    document.querySelectorAll('.rte-btn[data-cmd]').forEach(btn => {
      btn.addEventListener('mousedown', e => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        const val = btn.dataset.val || null;
        document.execCommand(cmd, false, val);
        rteBody.focus();
        updateActiveStates();
      });
    });

    function updateActiveStates() {
      ['bold','italic','underline','strikeThrough','insertUnorderedList','insertOrderedList'].forEach(cmd => {
        const btn = document.querySelector(`.rte-btn[data-cmd="${cmd}"]`);
        if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
      });
    }
    document.addEventListener('selectionchange', updateActiveStates);

    window.toggleFontMenu = function(e) {
      e.preventDefault();
      const menu    = document.getElementById('font-menu');
      const btn     = document.getElementById('rte-font-btn');
      const btnRect  = btn.getBoundingClientRect();
      const wrapRect = document.getElementById('rte-wrap').getBoundingClientRect();
      menu.style.top  = (btnRect.bottom - wrapRect.top + 4) + 'px';
      menu.style.left = (btnRect.left - wrapRect.left) + 'px';
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };
    window.applyFontSize = function(size) {
      document.getElementById('font-menu').style.display = 'none';
      rteBody.focus();
      document.execCommand('fontSize', false, size);
    };
    document.addEventListener('click', e => {
      const menu = document.getElementById('font-menu');
      if (menu && !e.target.closest('#rte-font-btn') && !e.target.closest('#font-menu')) {
        menu.style.display = 'none';
      }
    });

    const EMOJIS = [
      // Faces & emotions
      {e:'😀',k:'grin happy'},{e:'😁',k:'grin beam'},{e:'😂',k:'laugh cry joy'},{e:'🤣',k:'rofl laugh'},
      {e:'😊',k:'smile happy blush'},{e:'😇',k:'angel innocent'},{e:'🙂',k:'slight smile'},
      {e:'😉',k:'wink'},{e:'😍',k:'love heart eyes'},{e:'🥰',k:'love adore smiling hearts'},
      {e:'😘',k:'kiss love'},{e:'😋',k:'yum tasty'},{e:'😎',k:'cool sunglasses'},
      {e:'🤩',k:'star struck excited'},{e:'🥳',k:'party celebrate'},
      {e:'😏',k:'smirk'},{e:'😒',k:'unamused'},{e:'😞',k:'disappointed sad'},
      {e:'😔',k:'pensive sad'},{e:'😟',k:'worried'},{e:'😕',k:'confused'},
      {e:'🙁',k:'frown sad'},{e:'😣',k:'persevere'},{e:'😖',k:'confounded'},
      {e:'😫',k:'tired weary'},{e:'😩',k:'weary tired'},{e:'🥺',k:'pleading puppy eyes'},
      {e:'😢',k:'cry sad tear'},{e:'😭',k:'sob crying loud'},
      {e:'😤',k:'triumph steam nose'},{e:'😠',k:'angry mad'},
      {e:'😡',k:'pouting rage angry'},{e:'🤬',k:'swearing angry'},
      {e:'🤯',k:'exploding head mind blown'},{e:'😳',k:'flushed embarrassed'},
      {e:'🥵',k:'hot face'},{e:'🥶',k:'cold face'},{e:'😱',k:'scream fear shocked'},
      {e:'😨',k:'fearful scared'},{e:'😰',k:'anxious sweat'},{e:'😥',k:'sad disappointed'},
      {e:'🤔',k:'thinking hmm'},{e:'🤭',k:'hand over mouth giggle'},
      {e:'🤫',k:'shushing quiet'},{e:'🤥',k:'lying pinocchio'},
      {e:'😶',k:'no mouth silent'},{e:'😐',k:'neutral'},{e:'😑',k:'expressionless'},
      {e:'😬',k:'grimace awkward'},{e:'🙄',k:'rolling eyes'},{e:'😯',k:'hushed surprised'},
      {e:'😦',k:'frowning open'},{e:'😧',k:'anguished'},{e:'😮',k:'open mouth surprised'},
      {e:'😲',k:'astonished shocked'},{e:'🥱',k:'yawn tired bored'},
      {e:'😴',k:'sleep tired zzz'},{e:'🤤',k:'drooling'},{e:'😪',k:'sleepy'},
      {e:'😵',k:'dizzy'},{e:'🤐',k:'zipper mouth silent'},
      {e:'🥴',k:'woozy drunk'},{e:'🤢',k:'nauseated sick'},{e:'🤮',k:'vomiting sick'},
      {e:'🤧',k:'sneezing sick'},{e:'😷',k:'mask sick covid'},
      {e:'🤒',k:'thermometer sick'},{e:'🤕',k:'head bandage hurt'},
      {e:'🤑',k:'money mouth rich'},{e:'🤠',k:'cowboy hat'},
      {e:'😈',k:'devil smiling'},{e:'👿',k:'devil angry'},
      {e:'👹',k:'ogre monster'},{e:'👺',k:'goblin'},{e:'💀',k:'skull death'},
      {e:'☠️',k:'skull crossbones'},{e:'👻',k:'ghost'},
      {e:'👽',k:'alien'},{e:'🤖',k:'robot'},
      {e:'😺',k:'cat smile'},{e:'😸',k:'cat grin'},{e:'😹',k:'cat joy'},
      // Hands & people
      {e:'👋',k:'wave hello hi bye'},{e:'🤚',k:'raised back hand'},
      {e:'🖐️',k:'hand fingers splayed'},{e:'✋',k:'raised hand stop'},
      {e:'🖖',k:'vulcan salute spock'},{e:'👌',k:'ok perfect'},
      {e:'🤌',k:'pinched fingers chef kiss'},{e:'✌️',k:'victory peace'},
      {e:'🤞',k:'crossed fingers luck'},{e:'🤟',k:'love you hand'},
      {e:'🤘',k:'sign of horns rock'},{e:'🤙',k:'call me hang loose'},
      {e:'👈',k:'pointing left'},{e:'👉',k:'pointing right'},
      {e:'👆',k:'pointing up'},{e:'👇',k:'pointing down'},
      {e:'☝️',k:'index pointing up'},{e:'👍',k:'thumbs up good ok yes'},
      {e:'👎',k:'thumbs down bad no'},{e:'✊',k:'raised fist'},
      {e:'👊',k:'punch fist'},{e:'🤛',k:'left fist bump'},
      {e:'🤜',k:'right fist bump'},{e:'👏',k:'clap applause'},
      {e:'🙌',k:'hands celebrate raised'},{e:'👐',k:'open hands'},
      {e:'🤲',k:'palms up'},{e:'🤝',k:'handshake deal'},
      {e:'🙏',k:'pray thanks please folded hands'},
      {e:'✍️',k:'writing hand'},{e:'💅',k:'nail polish'},
      {e:'🤳',k:'selfie'},{e:'💪',k:'muscle strong flex bicep'},
      {e:'🦵',k:'leg'},{e:'🦶',k:'foot'},{e:'👂',k:'ear'},
      {e:'🧠',k:'brain mind smart'},{e:'👀',k:'eyes looking'},
      {e:'👁️',k:'eye'},{e:'👅',k:'tongue'},{e:'👄',k:'lips mouth'},
      // Hearts & symbols
      {e:'❤️',k:'heart love red'},{e:'🧡',k:'orange heart'},
      {e:'💛',k:'yellow heart'},{e:'💚',k:'green heart'},
      {e:'💙',k:'blue heart'},{e:'💜',k:'purple heart'},
      {e:'🖤',k:'black heart'},{e:'🤍',k:'white heart'},
      {e:'🤎',k:'brown heart'},{e:'💔',k:'broken heart'},
      {e:'❣️',k:'heart exclamation'},{e:'💕',k:'two hearts'},
      {e:'💞',k:'revolving hearts'},{e:'💓',k:'beating heart'},
      {e:'💗',k:'growing heart'},{e:'💖',k:'sparkling heart'},
      {e:'💘',k:'heart arrow cupid'},{e:'💝',k:'heart ribbon'},
      {e:'💟',k:'heart decoration'},{e:'☮️',k:'peace'},
      {e:'✝️',k:'cross'},{e:'⭐',k:'star'},
      {e:'🌟',k:'glowing star'},{e:'✨',k:'sparkles shine'},
      {e:'💫',k:'dizzy star'},{e:'🔥',k:'fire hot flame'},
      {e:'💥',k:'explosion boom'},{e:'💢',k:'anger symbol'},
      {e:'💦',k:'water drops sweat'},{e:'💨',k:'wind dash'},
      {e:'🌈',k:'rainbow color'},{e:'☀️',k:'sun sunny'},
      {e:'🌤️',k:'partly cloudy'},{e:'⛅',k:'cloudy'},
      {e:'🌧️',k:'rain cloud'},{e:'⛈️',k:'storm thunder'},
      {e:'🌩️',k:'lightning'},{e:'❄️',k:'snowflake cold'},
      {e:'🌙',k:'moon night'},{e:'🌚',k:'new moon face'},
      {e:'🌞',k:'sun face'},{e:'🌝',k:'full moon face'},
      // Activities & objects
      {e:'🎉',k:'party tada celebrate'},{e:'🎊',k:'confetti celebrate'},
      {e:'🎈',k:'balloon party'},{e:'🎁',k:'gift present'},
      {e:'🏆',k:'trophy winner award'},{e:'🥇',k:'gold medal first'},
      {e:'🎯',k:'target goal bullseye'},{e:'🎮',k:'game controller video'},
      {e:'🎲',k:'dice game luck'},{e:'🎸',k:'guitar music'},
      {e:'🎵',k:'music note'},{e:'🎶',k:'music notes'},
      {e:'🎤',k:'microphone sing'},{e:'🎧',k:'headphones music'},
      {e:'📸',k:'camera photo'},{e:'📷',k:'camera'},
      {e:'🎬',k:'clapper film movie'},{e:'📺',k:'tv television'},
      {e:'📻',k:'radio'},{e:'🔊',k:'speaker sound loud'},
      {e:'🔔',k:'bell notification'},{e:'🔕',k:'no bell mute'},
      // Tech & work
      {e:'💡',k:'idea bulb light'},{e:'🔦',k:'flashlight torch'},
      {e:'💻',k:'laptop computer'},{e:'🖥️',k:'desktop monitor'},
      {e:'🖨️',k:'printer'},{e:'⌨️',k:'keyboard'},
      {e:'🖱️',k:'mouse computer'},{e:'💾',k:'floppy disk save'},
      {e:'💿',k:'cd disc'},{e:'📀',k:'dvd disc'},
      {e:'📱',k:'phone mobile smartphone'},
      {e:'☎️',k:'telephone phone'},{e:'📞',k:'phone receiver'},
      {e:'📟',k:'pager'},{e:'📠',k:'fax'},
      {e:'🔋',k:'battery charge'},{e:'🔌',k:'plug electric'},
      {e:'💡',k:'lightbulb idea'},{e:'🔧',k:'wrench tool fix'},
      {e:'🔨',k:'hammer build'},{e:'⚙️',k:'gear settings'},
      {e:'🗜️',k:'clamp compress'},{e:'🔑',k:'key unlock'},
      {e:'🗝️',k:'old key'},{e:'🔒',k:'lock secure closed'},
      {e:'🔓',k:'unlock open'},{e:'🔐',k:'locked key'},
      {e:'📧',k:'email mail envelope'},{e:'📨',k:'incoming email'},
      {e:'📩',k:'outgoing email'},{e:'📤',k:'outbox send'},
      {e:'📥',k:'inbox receive'},{e:'📦',k:'box package'},
      {e:'📫',k:'mailbox closed'},{e:'📬',k:'mailbox open'},
      {e:'📝',k:'note write memo pencil'},{e:'✏️',k:'pencil write edit'},
      {e:'🖊️',k:'pen write'},{e:'🖋️',k:'fountain pen'},
      {e:'📖',k:'open book read'},{e:'📚',k:'books study'},
      {e:'📋',k:'clipboard'},{e:'📌',k:'pushpin location'},
      {e:'📍',k:'round pushpin'},{e:'📎',k:'paperclip attach'},
      {e:'🖇️',k:'linked paperclips'},{e:'📏',k:'ruler straight'},
      {e:'📐',k:'triangular ruler'},{e:'✂️',k:'scissors cut'},
      {e:'🗂️',k:'folder files'},{e:'📁',k:'folder'},
      {e:'📂',k:'open folder'},{e:'🗃️',k:'card file box'},
      {e:'📊',k:'chart bar graph data'},{e:'📈',k:'chart trending up growth'},
      {e:'📉',k:'chart trending down'},{e:'🗒️',k:'notepad spiral'},
      {e:'📅',k:'calendar date'},{e:'📆',k:'calendar tear'},
      {e:'🗓️',k:'spiral calendar'},{e:'⏰',k:'alarm clock time'},
      {e:'⌚',k:'watch time'},{e:'⏱️',k:'stopwatch timer'},
      {e:'⌛',k:'hourglass time'},{e:'💼',k:'briefcase work business'},
      {e:'🚀',k:'rocket launch space fast'},
      // Food & drink
      {e:'☕',k:'coffee tea hot drink'},{e:'🍵',k:'tea hot'},
      {e:'🧋',k:'bubble tea boba'},{e:'🥤',k:'cup drink'},
      {e:'🍺',k:'beer drink'},{e:'🍻',k:'cheers beers'},
      {e:'🥂',k:'champagne toast celebrate'},{e:'🍷',k:'wine'},
      {e:'🍕',k:'pizza food'},{e:'🍔',k:'burger food'},
      {e:'🍟',k:'fries food'},{e:'🌮',k:'taco mexican'},
      {e:'🍜',k:'noodles ramen'},{e:'🍣',k:'sushi japanese'},
      {e:'🍩',k:'donut dessert'},{e:'🎂',k:'cake birthday'},
      {e:'🍰',k:'cake slice'},{e:'🍫',k:'chocolate'},
      {e:'🍬',k:'candy'},{e:'🍭',k:'lollipop'},
      // Nature & animals
      {e:'🐶',k:'dog puppy'},{e:'🐱',k:'cat kitten'},
      {e:'🐭',k:'mouse'},{e:'🐹',k:'hamster'},
      {e:'🐰',k:'rabbit bunny'},{e:'🦊',k:'fox'},
      {e:'🐻',k:'bear'},{e:'🐼',k:'panda'},
      {e:'🐨',k:'koala'},{e:'🐯',k:'tiger'},
      {e:'🦁',k:'lion'},{e:'🐮',k:'cow'},
      {e:'🐷',k:'pig'},{e:'🐸',k:'frog'},
      {e:'🐵',k:'monkey'},{e:'🙈',k:'see no evil monkey'},
      {e:'🙉',k:'hear no evil monkey'},{e:'🙊',k:'speak no evil monkey'},
      {e:'🐔',k:'chicken'},{e:'🐧',k:'penguin'},
      {e:'🐦',k:'bird'},{e:'🦄',k:'unicorn'},
      {e:'🐝',k:'bee honey'},{e:'🦋',k:'butterfly'},
      {e:'🌸',k:'cherry blossom flower'},{e:'🌺',k:'hibiscus flower'},
      {e:'🌻',k:'sunflower'},{e:'🌹',k:'rose flower love'},
      {e:'🍀',k:'four leaf clover luck'},{e:'🌿',k:'herb leaf green'},
      {e:'🌱',k:'seedling grow plant'},{e:'🌳',k:'tree deciduous'},
      {e:'🌲',k:'evergreen tree'},{e:'🌴',k:'palm tree tropical'},
      {e:'🌊',k:'wave water ocean'},{e:'🏔️',k:'mountain snow'},
      {e:'🏝️',k:'island tropical'},{e:'🌍',k:'earth globe world'},
      // Travel & places
      {e:'🏠',k:'house home'},{e:'🏢',k:'office building'},
      {e:'🏦',k:'bank'},{e:'🏥',k:'hospital'},{e:'🏫',k:'school'},
      {e:'🚗',k:'car red automobile'},{e:'🚕',k:'taxi cab'},
      {e:'🚙',k:'suv car'},{e:'🚌',k:'bus'},
      {e:'✈️',k:'airplane flight travel'},{e:'🚂',k:'train locomotive'},
      {e:'🚀',k:'rocket'},{e:'🛸',k:'ufo flying saucer'},
      {e:'⛵',k:'sailboat'},{e:'🚢',k:'ship cruise'},
      {e:'🗺️',k:'map world travel'},{e:'🧭',k:'compass navigation'},
      // Misc symbols
      {e:'✅',k:'check mark done yes green'},{e:'❌',k:'cross no wrong red'},
      {e:'❓',k:'question mark'},{e:'❗',k:'exclamation mark'},
      {e:'💯',k:'hundred percent perfect'},
      {e:'🔴',k:'red circle'},{e:'🟠',k:'orange circle'},
      {e:'🟡',k:'yellow circle'},{e:'🟢',k:'green circle'},
      {e:'🔵',k:'blue circle'},{e:'🟣',k:'purple circle'},
      {e:'⚫',k:'black circle'},{e:'⚪',k:'white circle'},
      {e:'🔶',k:'orange diamond'},{e:'🔷',k:'blue diamond'},
      {e:'▶️',k:'play button'},{e:'⏸️',k:'pause button'},
      {e:'⏹️',k:'stop button'},{e:'⏭️',k:'next fast forward'},
      {e:'🔁',k:'repeat loop'},{e:'🔀',k:'shuffle random'},
      {e:'➕',k:'plus add'},{e:'➖',k:'minus subtract'},
      {e:'✖️',k:'multiply times'},{e:'➗',k:'divide'},
      {e:'♾️',k:'infinity'},{e:'💲',k:'dollar sign money'},
      {e:'©️',k:'copyright'},{e:'®️',k:'registered'},
      {e:'™️',k:'trademark'},{e:'🆕',k:'new'},
      {e:'🆓',k:'free'},{e:'🔞',k:'no under eighteen adult'},
    ];

    const emojiPicker = document.getElementById('emoji-picker');
    const emojiGrid   = document.getElementById('emoji-grid');
    const emojiSearch = document.getElementById('emoji-search');
    const emojiEmpty  = document.getElementById('emoji-empty');

    function renderEmojis(list) {
      emojiGrid.innerHTML = '';
      emojiEmpty.style.display = list.length === 0 ? 'block' : 'none';
      list.forEach(({e}) => {
        const b = document.createElement('button');
        b.textContent = e; b.type = 'button';
        b.addEventListener('mousedown', ev => {
          ev.preventDefault();
          document.execCommand('insertText', false, e);
          emojiPicker.style.display = 'none';
          rteBody.focus();
        });
        emojiGrid.appendChild(b);
      });
    }
    renderEmojis(EMOJIS);

    if (emojiSearch) {
      emojiSearch.addEventListener('input', () => {
        const q = emojiSearch.value.toLowerCase().trim();
        renderEmojis(q ? EMOJIS.filter(({k}) => k.includes(q)) : EMOJIS);
      });
      emojiSearch.addEventListener('mousedown', e => e.stopPropagation());
    }

    const emojiBtnEl = document.getElementById('rte-emoji-btn');
    if (emojiBtnEl && emojiPicker) {
      emojiBtnEl.addEventListener('click', e => {
        e.stopPropagation();
        const show = emojiPicker.style.display === 'none' || !emojiPicker.style.display;
        if (show) {
          const btnRect  = emojiBtnEl.getBoundingClientRect();
          const wrapRect = document.getElementById('rte-wrap').getBoundingClientRect();
          emojiPicker.style.top  = (btnRect.bottom - wrapRect.top + 4) + 'px';
          emojiPicker.style.left = Math.min(btnRect.left - wrapRect.left, wrapRect.width - 248) + 'px';
          emojiSearch.value = ''; renderEmojis(EMOJIS);
        }
        emojiPicker.style.display = show ? 'flex' : 'none';
        if (show) setTimeout(() => emojiSearch.focus(), 50);
      });
      document.addEventListener('click', e => {
        if (!e.target.closest('#rte-emoji-btn') && !e.target.closest('#emoji-picker'))
          emojiPicker.style.display = 'none';
      });
    }

    if (fileInput) {
      document.getElementById('rte-attach-btn').addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', () => {
        Array.from(fileInput.files).forEach(f => { attachedFiles.push(f); addAttachPill(f); });
        fileInput.value = '';
      });
    }

    function addAttachPill(file) {
      const pill = document.createElement('div');
      pill.className = 'rte-attach-pill';
      const label = document.createElement('span');
      label.textContent = file.name.length > 20 ? file.name.slice(0,18)+'…' : file.name;
      const x = document.createElement('button');
      x.textContent = '✕'; x.type = 'button';
      x.addEventListener('click', () => {
        const idx = attachedFiles.indexOf(file);
        if (idx > -1) attachedFiles.splice(idx, 1);
        pill.remove();
      });
      pill.appendChild(label); pill.appendChild(x);
      attachList.appendChild(pill);
    }

    const imgBtnEl = document.getElementById('rte-img-btn');
    if (imgBtnEl && imgInput) {
      imgBtnEl.addEventListener('click', () => imgInput.click());
      imgInput.addEventListener('change', () => {
        const file = imgInput.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          rteBody.focus();
          document.execCommand('insertHTML', false, `<img src="${e.target.result}" alt="${file.name}" style="max-width:100%;border-radius:6px;margin:.4rem 0;">`);
        };
        reader.readAsDataURL(file);
        imgInput.value = '';
      });
    }

    let savedRange = null;
    const linkBtnEl = document.getElementById('rte-link-btn');
    const linkModal = document.getElementById('rte-link-modal');
    if (linkBtnEl && linkModal) {
      linkBtnEl.addEventListener('click', () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) savedRange = sel.getRangeAt(0).cloneRange();
        document.getElementById('rte-link-text').value = sel ? sel.toString() : '';
        document.getElementById('rte-link-url').value  = '';
        linkModal.style.display = 'flex';
        document.getElementById('rte-link-url').focus();
      });
    }
    window.closeLinkModal = function() { if (linkModal) linkModal.style.display = 'none'; };
    window.insertLink = function() {
      const url  = document.getElementById('rte-link-url').value.trim();
      const text = document.getElementById('rte-link-text').value.trim();
      if (!url) { closeLinkModal(); return; }
      const fullUrl = url.startsWith('http') ? url : 'https://' + url;
      rteBody.focus();
      if (savedRange) { const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(savedRange); }
      if (text) {
        document.execCommand('insertHTML', false, `<a href="${fullUrl}" target="_blank" rel="noopener">${text}</a>`);
      } else {
        document.execCommand('createLink', false, fullUrl);
        rteBody.querySelectorAll('a:not([target])').forEach(l => { l.target='_blank'; l.rel='noopener'; });
      }
      closeLinkModal();
    };
    if (linkModal) {
      linkModal.addEventListener('click', e => { if (e.target === linkModal) closeLinkModal(); });
      document.getElementById('rte-link-url').addEventListener('keydown', e => { if (e.key === 'Enter') insertLink(); });
    }

    const clearBtn = document.getElementById('rte-clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => { document.execCommand('removeFormat'); rteBody.focus(); });

    const trashBtn = document.getElementById('rte-trash-btn');
    if (trashBtn) {
      trashBtn.addEventListener('click', () => {
        if (confirm('Clear the message?')) {
          rteBody.innerHTML = '';
          attachedFiles.length = 0; attachList.innerHTML = '';
          if (charCount) charCount.textContent = '0';
          rteBody.focus();
        }
      });
    }

    // ─── CONTACT FORM SUBMIT ───
    const nameInput  = document.getElementById('cf-name');
    const emailInput = document.getElementById('cf-email');
    const submitBtn  = document.getElementById('cf-submit');
    const msgBox     = document.getElementById('cf-message');

    function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function showMessage(type, text) {
      msgBox.className = 'cf-message ' + type;
      msgBox.textContent = text;
      msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function setLoading(loading) { submitBtn.disabled = loading; submitBtn.classList.toggle('loading', loading); }

    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const name    = nameInput.value.trim();
        const email   = emailInput.value.trim();
        const comment = rteBody ? rteBody.innerText.trim() : '';
        const htmlMsg = rteBody ? rteBody.innerHTML : '';

        // ── Validate first, before anything else ──
        msgBox.className = 'cf-message';
        if (!name)                           { showMessage('error', '⚠ Please enter your name.');                           nameInput.focus();  return; }
        if (!email || !validateEmail(email)) { showMessage('error', '⚠ Please enter a valid email address.');              emailInput.focus(); return; }
        if (!comment || comment.length < 10) { showMessage('error', '⚠ Please write a message (at least 10 characters).'); rteBody && rteBody.focus(); return; }

        setLoading(true);

        try {
          // EmailJS is already initialised in <head> with your public key
          const response = await emailjs.send('service_kvxw5u6', 'template_orkltui', {
            name:         name,
            email:        email,
            message:      comment
          });

          console.log('EmailJS SUCCESS', response.status, response.text);
          showMessage('success', '✦ Message sent! I\'ll get back to you within 24 hours.');

          // Clear the form
          nameInput.value  = '';
          emailInput.value = '';
          if (rteBody) rteBody.innerHTML = '';
          attachedFiles.length = 0; attachList.innerHTML = '';
          if (charCount) charCount.textContent = '0';

        } catch (err) {
          console.error('EmailJS FAILED', err);
          showMessage('error', '⚠ Sending failed. Please email me directly at eraamirsohail@proton.me');
        } finally {
          setLoading(false);
        }
      });
    }

  }); // end DOMContentLoaded