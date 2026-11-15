import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const dir = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(dir, 'index.html'), 'utf8');
const start = html.indexOf('/* NAME_SAFETY_START */');
const end = html.indexOf('/* NAME_SAFETY_END */');
assert.ok(start >= 0 && end > start, 'name safety block missing from index.html');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(
  html.slice(start, end) +
    '\nthis.isSchoolSafeName = isSchoolSafeName;' +
    '\nthis.SCHOOL_SAFE_NAME_MESSAGE = SCHOOL_SAFE_NAME_MESSAGE;' +
    '\nthis.scrubSpiritNickname = scrubSpiritNickname;',
  sandbox
);

const { isSchoolSafeName, SCHOOL_SAFE_NAME_MESSAGE, scrubSpiritNickname } = sandbox;

const allow = [
  '', '   ', '\n\t',
  'Mia', 'Chan Tai Man', 'Aureki', 'Alex',
  'Verdini', 'Ripplin', 'Pyroki', 'Terruno',
  'class', 'classic', 'classroom', 'assistant', 'Cassandra', 'Hassan',
  'hellen', 'Hellen', 'shell', 'shellfish', 'passion', 'passionate', 'glass', 'glasses',
  'pass', 'bass', 'massive', 'compass', 'ambassador', 'assembly', 'assassin', 'successful',
  'Hailey', 'Haiyan', 'Shanghai', 'Chai', 'Hai Ming', 'Chao Hai',
  'Alan', 'Lana', 'Landon', 'Melanie', 'balance', 'plan', 'Lan Mei',
  'Hamza', 'Hamilton', 'Ham', 'Cao', 'Cao Ming', 'Diao', 'Diao Ming', 'Macao', 'dialogue',
  'Dickson', 'Dickens', 'peacock', 'Hancock', 'cocktail',
  'analysis', 'analytical', 'analog', 'canal', 'grape', 'drape', 'therapist',
  'cucumber', 'document', 'circumstance', 'scum',
  'title', 'titan', 'Titus', 'constitution', 'stitch',
  'swank', 'swanky', 'scrap', 'scrape', 'unisex', 'Middlesex', 'Essex', 'spicy',
  'students', 'husband', 'asbestos', 'medium', 'stadium', 'sodium',
  'hello', 'Othello', 'skill', 'Bobby', 'book', 'Thorny', 'Jazz', 'arsenal', 'parse',
  'therapist', 'therapists', 'shift', 'shot', 'shut', 'sheet', 'ashtray',
  'Scunthorpe', 'Phuket', 'Fukuoka', 'snigger', 'niggle', 'Milford', 'Fagin', 'Janus',
  'prickly', 'retardant', 'Vandyke', 'fundamental', 'adamant', 'condemnation',
  'Amsterdam', 'Adam', 'Damon', 'Amanda', 'Danny', 'Ashley', 'Cassidy', 'Jessica',
  'Ho', 'Ho Man', 'Chan Ho Man', 'shoe',
  'class1', 'he11en', 'she11', 'cl4ss', 'Alex7',
  '海欣', '家明', '陳大文', '生日', '日本', '體操', '体操', '操行', '操場', '幹部', '干部', '逼真', '干',
  '笨', '傻瓜', '早操'
];

const block = [
  'fuck', 'Fuck', 'FUCK', 'fck', 'f*ck', 'f**k', 'f.u.c.k', 'f u c k', 'fuuuuck',
  'f0ck', 'fvck', 'phuck', 'phuk', 'fuk', 'fcuk', 'motherfucker', 'clusterfuck',
  'shit', 's h i t', 's.h.i.t', 'sh1t', '$h1t', '5h1t', 'shyt', 'sh*t', 'bullshit',
  'bitch', 'b1tch', 'b!tch', 'bi7ch',
  'ass', 'a$$', '@ss', 'a55', '4ss', 'a s s', 'assss', 'asshole', 'dumbass', 'jackass', 'bad ass',
  'damn', 'goddamn', 'dammit', 'hell', 'h3ll', 'he11',
  'cunt', 'pussy', 'dick', 'cock', 'nigger', 'nigga', 'faggot', 'slut', 'whore',
  'wank', 'wanker', 'porn', 'horny', 'milf', 'rape', 'rapist', 'sex', 'sexual', 'sexy',
  'anal', 'tits', 'boobs', 'wtf', 'stfu', 'lmfao',
  'diu', 'DIU', 'd1u', 'd i u', 'diu lei', 'diu lei lou mou', 'dllm',
  'hai', 'h@i', 'h a i', 'lan', 'l4n', 'l a n', 'lanjiao', 'lan jiao', 'lan-jiao',
  'hmm', 'sb', 's b', '5b', 'nts', 'tmd', 'TMD', 'nmsl', 'hgc',
  'ham ga caan', 'hamga caan', 'ham gaa caan', 'puk gai', 'pok gai',
  'cao ni ma', 'shabi', 'sha bi', 'on9', 'on99', 'on999',
  '屌', '屌你', '𨳒', '冚家', '冚家鏟', '冚家铲', '撚', '𠺘', '閪', '尻', '肏', '肏你',
  '仆街', '僕街', '操你', '操你妈', '草泥马', '草泥馬', '幹你', '干你娘', '干',
  '傻逼', '傻B', '傻 b', '傻屄', '煞笔', '他妈', '他妈的', '他媽的', '脑残', '腦殘',
  '白痴', '白癡', '装逼', '戇鳩', '死仔', '卧槽', '鸡鸡', '操', '幹', '逼',
  'f\u200Buck', 'ＦＵＣＫ'
];

// "干" alone is a surname and must stay allowed. "干你娘" is blocked above.
block.splice(block.indexOf('干'), 1);

test('school-safe message does not repeat a blocked word', () => {
  assert.equal(SCHOOL_SAFE_NAME_MESSAGE, 'Please choose a school-safe name.');
  assert.equal(SCHOOL_SAFE_NAME_MESSAGE.toLowerCase().includes('fuck'), false);
});

test('ordinary names and blank names are allowed', () => {
  const failed = allow.filter(name => !isSchoolSafeName(name));
  assert.deepEqual(failed, []);
});

test('profanity in characters or romanization is rejected', () => {
  const failed = block.filter(name => isSchoolSafeName(name));
  assert.deepEqual(failed, []);
});

test('a blocked nickname falls back to the species name without keeping the word', () => {
  const st = { spirit: { element: 'gold', species: 'Aureki', nickname: 'f*ck' } };
  assert.equal(scrubSpiritNickname(st), true);
  assert.equal(st.spirit.nickname, null);
  assert.equal(st.spirit.species, 'Aureki');

  const ok = { spirit: { nickname: 'Mia', species: 'Aureki' } };
  assert.equal(scrubSpiritNickname(ok), false);
  assert.equal(ok.spirit.nickname, 'Mia');
  assert.equal(scrubSpiritNickname({}), false);
});

test('the game checks a name before saving a spirit or a new trainer', () => {
  const confirmAt = html.indexOf('function confirmSpirit');
  const saveSpirit = html.indexOf('state.spirit = { element: sp.element', confirmAt);
  const rejectAt = html.indexOf('schoolSafeNameRejection(trimmed)', confirmAt);
  assert.ok(confirmAt > 0 && rejectAt > confirmAt && rejectAt < saveSpirit);

  const createAt = html.indexOf('// create new');
  const writeAt = html.indexOf('writePlayerSave(id, state)', createAt);
  const nameCheck = html.indexOf('schoolSafeNameRejection(displayName)', createAt);
  assert.ok(createAt > 0 && nameCheck > createAt && nameCheck < writeAt);
  assert.ok(html.includes('id="spirit-name-status"'));
});
