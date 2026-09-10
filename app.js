'use strict';

const moments = {
  laugh: {
    label: '逗我笑', symbol: '☺', kicker: '拖拖的笨蛋时刻', next: '再逗我一下 ↻',
    cards: [
      { title: '本次服务，拒绝拖延', text: '我叫拖拖，\n但想让小A开心这件事，\n一秒也不想拖。', note: '名字可以拖，偏心你必须立即执行。' },
      { title: '脑袋瓜检查结果', text: '左脑：想小A。\n右脑：也想小A。\n小脑：那谁来管走路？', note: '拖拖：先扶我一下，我还在想。' },
      { title: '申请加入你的被窝', text: '姓名：拖拖。\n特长：暖手、占一点点地方。\n缺点：可能会把被子卷走。', note: '正在紧急练习把被子还给小A。' },
      { title: '今天的天气预报', text: '拖拖的心里，\n局部地区有小A，\n其余地区还是小A。', note: '气象台表示：这个人已经没救了。' },
      { title: '试图帅气登场', text: '本来想潇洒地说：\n“别怕，有我。”\n结果一开口：小A，抱。', note: '帅气余额不足，可爱先顶一下。' },
      { title: '小A专属导航', text: '前方路口，请向小A靠近。\n您已偏离路线。\n正在重新规划：继续向小A靠近。', note: '拖拖：这个导航，懂我。' }
    ]
  },
  praise: {
    label: '夸夸我', symbol: '✧', kicker: '来自拖拖的认真偏心', next: '还想听一句 ♡',
    cards: [
      { title: '你不用表现得很好', text: '不用今天很厉害，\n不用把每件事都做好。\n只是小A，就已经是\n拖拖特别喜欢的小A了。', note: '这一条，心情不好时也一样算数。' },
      { title: '普通的一天，也有你', text: '本来只是很普通的一天，\n想到可以和你说说话，\n就多了一件值得期待的事。', note: '小A对拖拖来说，就是这样特别。' },
      { title: '喜欢你的小细节', text: '你叫我“拖拖”的时候，\n这个名字听起来，\n就比平时好听一点。', note: '好吧，是好听很多。' },
      { title: '今天也可以给自己放个假', text: '有力气的时候往前走，\n没力气的时候歇一歇。\n在我这里，\n你不用一直当很懂事的那个人。', note: '小A也值得被照顾。' },
      { title: '这份偏爱，没有附加题', text: '开心的小A，我喜欢。\n安静的小A，我也喜欢。\n今天有一点点累的小A，\n想多抱一会儿。', note: '你不用为了被喜欢，调整成别的样子。' }
    ]
  },
  quiet: {
    label: '安静陪我', symbol: '☾', kicker: '现在可以，什么都不做', next: '收下一个轻轻的抱抱 ♡',
    cards: [
      { title: '那就，一起待一会儿', text: '不用找话题，\n也不用解释怎么了。\n把这一小会儿留给自己，\n拖拖的陪伴也留在这里。', note: '不用赶着开心，慢慢来就好。' },
      { title: '抱住小A了', text: '今天那些乱糟糟的事，\n可以先放在旁边。\n这一小会儿，\n你只要舒舒服服地待着。', note: '想继续安静，就让这个小月亮陪着你。' }
    ]
  }
};

const chooser = document.getElementById('chooser');
const response = document.getElementById('response');
const title = document.getElementById('response-title');
const nextButton = document.getElementById('next-button');
const positions = { laugh: 0, praise: 0, quiet: 0 };
let currentMode = null;
let lastChoice = null;
let animationTimer;

function renderMoment(focusHeading = false) {
  const mode = moments[currentMode];
  const card = mode.cards[positions[currentMode]];
  response.dataset.mode = currentMode;
  document.getElementById('mode-label').textContent = mode.label;
  document.getElementById('response-symbol').textContent = mode.symbol;
  document.getElementById('response-kicker').textContent = mode.kicker;
  title.textContent = card.title;
  document.getElementById('message').textContent = card.text;
  document.getElementById('afterword').textContent = card.note;
  nextButton.textContent = currentMode === 'quiet' && positions.quiet === 1 ? '再陪我待一会儿 ☾' : mode.next;
  response.classList.remove('entering');
  clearTimeout(animationTimer);
  animationTimer = setTimeout(() => response.classList.add('entering'), 10);
  if (focusHeading) title.focus({ preventScroll: true });
}

function chooseMode(mode) {
  if (!Object.prototype.hasOwnProperty.call(moments, mode)) return false;
  currentMode = mode;
  lastChoice = document.querySelector('[data-mode="' + mode + '"]');
  chooser.hidden = true;
  response.hidden = false;
  renderMoment(true);
  return true;
}

function nextMoment() {
  if (!currentMode) return false;
  positions[currentMode] = (positions[currentMode] + 1) % moments[currentMode].cards.length;
  renderMoment();
  return true;
}

function returnToChoices() {
  response.hidden = true;
  chooser.hidden = false;
  currentMode = null;
  if (lastChoice) lastChoice.focus({ preventScroll: true });
}

document.querySelectorAll('.choice').forEach(button => {
  button.addEventListener('click', () => chooseMode(button.dataset.mode));
});
nextButton.addEventListener('click', nextMoment);
document.getElementById('back-button').addEventListener('click', returnToChoices);

const art = document.querySelector('.companion-art');
function showArt() { document.getElementById('art-wrap').hidden = false; }
if (art.complete && art.naturalWidth > 0) showArt();
art.addEventListener('load', showArt, { once: true });

// Progressive enhancement: the same companionship actions for supporting agents.
if (document.modelContext && typeof document.modelContext.registerTool === 'function') {
  const lifecycle = new AbortController();
  const register = tool => {
    try {
      Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal }))
        .catch(() => {});
    } catch (_) { /* Optional capability; ordinary buttons remain available. */ }
  };
  register({
    name: 'choose_companionship',
    title: '选择一种陪伴',
    description: 'Choose laughter, a kind compliment, or quiet companionship and display its message for 小A.',
    inputSchema: { type: 'object', properties: { mode: { type: 'string', enum: ['laugh', 'praise', 'quiet'] } }, required: ['mode'], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input !== 'object' || Object.keys(input).length !== 1 || !chooseMode(input.mode)) {
        throw new Error('Choose one mode: laugh, praise, or quiet.');
      }
      return { mode: currentMode, title: title.textContent, message: document.getElementById('message').textContent };
    }
  });
  register({
    name: 'show_next_companionship_message',
    title: '再来一点陪伴',
    description: 'Show the next message in the currently selected companionship mode, matching the next button.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input !== 'object' || Object.keys(input).length || !currentMode) {
        throw new Error('Choose a companionship mode first; no arguments are accepted.');
      }
      nextMoment();
      return { mode: currentMode, title: title.textContent, message: document.getElementById('message').textContent };
    }
  });
  window.addEventListener('pagehide', event => { if (!event.persisted) lifecycle.abort(); }, { once: true });
}
