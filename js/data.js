/* ============================================================
 * Fit拍 · 数据层 —— 器械库、动作库、训练计划模板
 * ============================================================ */

/* ---------- 器械库（供拍照识别匹配 & 手动选择） ---------- */
const EQUIPMENT = [
  { id: 'barbell',      name: '杠铃',     aliases: ['barbell', '杠铃', '杠铃杆', '自由杠铃'], bodyParts: ['胸','背','腿','肩','二头','三头'] },
  { id: 'dumbbell',     name: '哑铃',     aliases: ['dumbbell', '哑铃', '壶铃可替代'], bodyParts: ['胸','背','腿','肩','二头','三头'] },
  { id: 'kettlebell',   name: '壶铃',     aliases: ['kettlebell', '壶铃'], bodyParts: ['腿','肩','背','核心'] },
  { id: 'bench',        name: '卧推凳',   aliases: ['bench', '卧推凳', '平板凳', '训练凳'], bodyParts: ['胸','肩','三头','核心'] },
  { id: 'rack',         name: '深蹲架',   aliases: ['rack', '深蹲架', '龙门架', '力量架', 'squat rack'], bodyParts: ['腿','背','胸','肩'] },
  { id: 'smith',        name: '史密斯机', aliases: ['smith machine', '史密斯机', '史密斯'], bodyParts: ['腿','胸','肩','背'] },
  { id: 'cable',        name: '龙门架/绳索', aliases: ['cable', 'cable crossover', '龙门架', '绳索', '拉力器', '大飞鸟'], bodyParts: ['胸','背','肩','二头','三头'] },
  { id: 'lat-pulldown', name: '高位下拉机', aliases: ['lat pulldown', '高位下拉', '下拉机'], bodyParts: ['背'] },
  { id: 'seated-row',   name: '坐姿划船机', aliases: ['seated row', '坐姿划船', '划船机(力量)'], bodyParts: ['背'] },
  { id: 'pec-deck',     name: '蝴蝶机/夹胸机', aliases: ['pec deck', '蝴蝶机', '夹胸机', '飞鸟机'], bodyParts: ['胸'] },
  { id: 'leg-press',    name: '腿举机',   aliases: ['leg press', '腿举机', '倒蹬机'], bodyParts: ['腿'] },
  { id: 'leg-extension',name: '腿屈伸机', aliases: ['leg extension', '腿屈伸', '股四头肌机'], bodyParts: ['腿'] },
  { id: 'leg-curl',     name: '腿弯举机', aliases: ['leg curl', '腿弯举', '腘绳肌机'], bodyParts: ['腿'] },
  { id: 'pullup-bar',   name: '引体向上杠', aliases: ['pull up bar', '单杠', '引体向上', '横杆'], bodyParts: ['背','二头'] },
  { id: 'dip-bars',     name: '双杠',     aliases: ['dip bar', '双杠', '臂屈伸架'], bodyParts: ['胸','三头'] },
  { id: 'treadmill',    name: '跑步机',   aliases: ['treadmill', '跑步机'], bodyParts: ['有氧'] },
  { id: 'rower',        name: '划船机',   aliases: ['rowing machine', '划船机(有氧)', '划船器'], bodyParts: ['有氧','背'] },
  { id: 'elliptical',   name: '椭圆机',   aliases: ['elliptical', '椭圆机'], bodyParts: ['有氧'] },
  { id: 'bike',         name: '动感单车', aliases: ['spin bike', '动感单车', '健身单车', '自行车机'], bodyParts: ['有氧','腿'] },
  { id: 'mat',          name: '瑜伽垫',   aliases: ['yoga mat', '瑜伽垫', '垫子'], bodyParts: ['核心','全身'] },
  { id: 'band',         name: '弹力带',   aliases: ['resistance band', '弹力带', '拉力带'], bodyParts: ['全身','肩','腿'] },
  { id: 'medicine-ball',name: '药球',     aliases: ['medicine ball', '药球'], bodyParts: ['核心','全身'] },
  { id: 'trx',          name: '悬挂带TRX', aliases: ['trx', '悬挂带', '悬挂训练'], bodyParts: ['全身','核心','背'] }
];

/* ---------- 动作库 ----------
 * pattern 用于匹配简笔画示范：
 * push-h / push-up / pull-v / pull-h / squat / hinge / lunge
 * press / raise / curl / pushdown / dip / core / plank / cardio
 */
const EXERCISES = [
  /* ================= 胸 ================= */
  {
    id: 'barbell-bench-press', name: '杠铃卧推', en: 'Barbell Bench Press',
    bodyPart: '胸', muscle: '胸大肌', equipment: ['barbell','bench','rack'],
    level: '入门', type: '复合', pattern: 'push-h',
    sets: 4, reps: '8-12', rest: '90秒',
    steps: [
      '仰卧于平板凳，双眼位于杠铃正下方，双脚踩实地面，肩胛骨后收下沉。',
      '双手略宽于肩握杠，将杠铃从架上推起至胸部正上方。',
      '缓慢下放杠铃至胸部中下沿轻触，肘部与躯干约呈 45°。',
      '胸部发力将杠铃推回起始位，顶端不锁死肘关节。'
    ],
    cues: ['肩胛骨全程收紧下沉', '杠铃下放点对准胸中部', '手腕保持中立不翻腕'],
    tips: '如果无人保护，优先使用史密斯机或哑铃卧推更安全。'
  },
  {
    id: 'dumbbell-bench-press', name: '哑铃卧推', en: 'Dumbbell Bench Press',
    bodyPart: '胸', muscle: '胸大肌', equipment: ['dumbbell','bench'],
    level: '入门', type: '复合', pattern: 'push-h',
    sets: 4, reps: '10-12', rest: '90秒',
    steps: [
      '仰卧于平板凳，双手各持一哑铃置于大腿，借力将哑铃举至胸部上方。',
      '掌心朝前，哑铃与肩同宽，肩胛骨收紧。',
      '缓慢下放哑铃至胸部两侧，感受胸肌拉伸。',
      '胸肌发力将哑铃推起并略微内收，顶端不完全并拢。'
    ],
    cues: ['下放时肘部不要过度外展', '全程控制速度', '顶端停留半秒充分挤压'],
    tips: '哑铃活动范围更大，比杠铃更充分拉伸胸肌。'
  },
  {
    id: 'incline-dumbbell-press', name: '上斜哑铃卧推', en: 'Incline Dumbbell Press',
    bodyPart: '胸', muscle: '上胸', equipment: ['dumbbell','bench'],
    level: '入门', type: '复合', pattern: 'press',
    sets: 3, reps: '10-12', rest: '90秒',
    steps: [
      '将训练凳调至 30-45° 上斜，仰卧并持哑铃于胸部上方。',
      '掌心朝前，缓慢下放哑铃至上胸两侧。',
      '上胸发力推起哑铃至起始位置。'
    ],
    cues: ['角度不要超过 45°', '下放至锁骨高度附近', '避免耸肩'],
    tips: '重点发展上胸，让胸部更饱满立体。'
  },
  {
    id: 'pec-deck-fly', name: '蝴蝶机夹胸', en: 'Pec Deck Fly',
    bodyPart: '胸', muscle: '胸大肌', equipment: ['pec-deck'],
    level: '入门', type: '孤立', pattern: 'raise',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '坐于蝴蝶机上，背部贴紧靠垫，前臂贴住挡板。',
      '胸肌发力将挡板向中间合拢，至双手靠近。',
      '顶峰收缩 1-2 秒，缓慢还原至胸肌有拉伸感。'
    ],
    cues: ['不要耸肩', '还原时控制不借力', '合拢时呼气'],
    tips: '孤立刺激胸肌中缝，适合放在胸部训练末尾。'
  },
  {
    id: 'cable-fly', name: '龙门架绳索夹胸', en: 'Cable Crossover',
    bodyPart: '胸', muscle: '胸大肌中缝', equipment: ['cable'],
    level: '进阶', type: '孤立', pattern: 'raise',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '将滑轮调至最高，双手握住把手，身体前倾一步成弓步。',
      '肘微屈固定，胸肌发力将双手向下向内划弧合拢。',
      '双手在腹前交汇，顶峰收缩后缓慢还原。'
    ],
    cues: ['肘部角度全程不变', '用胸肌带动而非手臂', '身体保持稳定'],
    tips: '适合雕刻胸部中缝，注意选择合适负重避免借力。'
  },
  {
    id: 'push-up', name: '俯卧撑', en: 'Push-up',
    bodyPart: '胸', muscle: '胸大肌/三头/核心', equipment: ['mat'],
    level: '入门', type: '复合', pattern: 'push-up',
    sets: 3, reps: '力竭', rest: '60秒',
    steps: [
      '双手略宽于肩撑地，身体从头到脚呈一条直线。',
      '屈肘下放身体至胸部接近地面。',
      '胸肌与手臂发力推起身体回到起始位。'
    ],
    cues: ['核心收紧不塌腰', '肘部约 45° 夹角', '全程身体成直线'],
    tips: '可随时随地进行，女生可用跪姿俯卧撑降低难度。'
  },
  {
    id: 'chest-dip', name: '双杠臂屈伸(胸)', en: 'Chest Dip',
    bodyPart: '胸', muscle: '下胸/三头', equipment: ['dip-bars'],
    level: '进阶', type: '复合', pattern: 'dip',
    sets: 3, reps: '8-12', rest: '90秒',
    steps: [
      '双手撑双杠，身体前倾约 30°。',
      '屈肘下放身体，感受下胸拉伸。',
      '胸肌发力推起身体，肘部不完全锁死。'
    ],
    cues: ['身体前倾更刺激胸肌', '不要耸肩', '下放至肩部略低于肘'],
    tips: '自重训练黄金动作，下胸发展效果好。'
  },

  /* ================= 背 ================= */
  {
    id: 'pull-up', name: '引体向上', en: 'Pull-up',
    bodyPart: '背', muscle: '背阔肌/二头', equipment: ['pullup-bar'],
    level: '进阶', type: '复合', pattern: 'pull-v',
    sets: 4, reps: '6-10', rest: '120秒',
    steps: [
      '双手略宽于肩正握单杠，身体自然悬垂。',
      '背部发力将身体拉起至下巴过杠。',
      '控制身体缓慢下放至手臂接近伸直。'
    ],
    cues: ['想象用手肘向下拉', '顶端挤压肩胛', '避免摆动借力'],
    tips: '做不了可用弹力带辅助或高位下拉替代，逐步过渡。'
  },
  {
    id: 'lat-pulldown', name: '高位下拉', en: 'Lat Pulldown',
    bodyPart: '背', muscle: '背阔肌', equipment: ['lat-pulldown'],
    level: '入门', type: '复合', pattern: 'pull-v',
    sets: 4, reps: '10-12', rest: '90秒',
    steps: [
      '坐姿固定双腿，双手宽握横杆。',
      '挺胸，背部发力将横杆拉至锁骨上方。',
      '缓慢还原至手臂伸直，感受背阔肌拉伸。'
    ],
    cues: ['先沉肩再下拉', '避免身体过度后仰', '顶端挤压肩胛'],
    tips: '引体向上的最佳辅助替代动作。'
  },
  {
    id: 'seated-cable-row', name: '坐姿绳索划船', en: 'Seated Cable Row',
    bodyPart: '背', muscle: '背阔肌/中背', equipment: ['seated-row','cable'],
    level: '入门', type: '复合', pattern: 'pull-h',
    sets: 4, reps: '10-12', rest: '90秒',
    steps: [
      '坐于划船机，双脚踩稳踏板，膝盖微屈，双手握把手。',
      '挺直背部，将把手拉向腹部。',
      '顶端挤压肩胛骨，缓慢还原。'
    ],
    cues: ['用背部带动而非手臂', '保持躯干稳定不前后晃', '拉向肚脐方向'],
    tips: '发展背部厚度的重要动作。'
  },
  {
    id: 'barbell-row', name: '杠铃划船', en: 'Barbell Row',
    bodyPart: '背', muscle: '背阔肌/中背', equipment: ['barbell'],
    level: '进阶', type: '复合', pattern: 'pull-h',
    sets: 4, reps: '8-12', rest: '120秒',
    steps: [
      '屈髋俯身，背部平直，双手略宽于肩握杠铃。',
      '将杠铃拉向下腹部，肘部向后上方。',
      '顶端挤压肩胛，缓慢下放。'
    ],
    cues: ['核心收紧保护腰椎', '背部始终平直', '避免用惯性摆动'],
    tips: '俯身角度约 45°，重量不宜过大以免弓背。'
  },
  {
    id: 'one-arm-dumbbell-row', name: '单臂哑铃划船', en: 'One-arm Dumbbell Row',
    bodyPart: '背', muscle: '背阔肌', equipment: ['dumbbell','bench'],
    level: '入门', type: '复合', pattern: 'pull-h',
    sets: 3, reps: '10-12', rest: '90秒',
    steps: [
      '单手单膝支撑于训练凳，另一手持哑铃自然下垂。',
      '背部发力将哑铃拉向髋部。',
      '顶端停顿，缓慢下放。'
    ],
    cues: ['背部保持水平', '肘部贴近身体向后拉', '不转体借力'],
    tips: '单侧训练可改善左右背不均衡。'
  },
  {
    id: 'straight-arm-pulldown', name: '直臂下拉', en: 'Straight-arm Pulldown',
    bodyPart: '背', muscle: '背阔肌', equipment: ['cable'],
    level: '进阶', type: '孤立', pattern: 'pull-h',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '面对龙门架，双手握直杆，手臂伸直。',
      '背部发力将直杆下压至大腿前。',
      '缓慢还原至手臂与地面平行。'
    ],
    cues: ['手臂全程伸直', '用背阔肌下压', '身体略前倾'],
    tips: '孤立背阔肌的收尾动作。'
  },
  {
    id: 'deadlift', name: '杠铃硬拉', en: 'Deadlift',
    bodyPart: '背', muscle: '下背/臀腿/竖脊肌', equipment: ['barbell'],
    level: '进阶', type: '复合', pattern: 'hinge',
    sets: 3, reps: '6-8', rest: '150秒',
    steps: [
      '双脚与肩同宽站立，杠铃贴近小腿。',
      '屈髋屈膝俯身，双手正握杠铃，背部平直。',
      '蹬地伸髋将杠铃拉起至身体直立。',
      '控制下放杠铃回地面。'
    ],
    cues: ['杠铃始终贴近身体', '背部全程平直不弓腰', '发力时先伸髋'],
    tips: '动作复杂，建议先用轻重量或空杆打磨动作。'
  },

  /* ================= 腿 ================= */
  {
    id: 'barbell-squat', name: '杠铃深蹲', en: 'Barbell Back Squat',
    bodyPart: '腿', muscle: '股四头肌/臀大肌', equipment: ['barbell','rack'],
    level: '进阶', type: '复合', pattern: 'squat',
    sets: 4, reps: '8-12', rest: '150秒',
    steps: [
      '将杠铃置于斜方肌上（高杠位），双手握杠稳定。',
      '双脚略宽于肩，脚尖微外展，挺胸抬头。',
      '屈髋屈膝下蹲至大腿与地面平行或更低。',
      '脚跟发力蹬起回到站立。'
    ],
    cues: ['膝盖方向与脚尖一致', '背部保持中立', '核心全程收紧'],
    tips: '力量训练之王，建议新手先徒手或用史密斯机掌握。'
  },
  {
    id: 'leg-press', name: '腿举', en: 'Leg Press',
    bodyPart: '腿', muscle: '股四头肌/臀', equipment: ['leg-press'],
    level: '入门', type: '复合', pattern: 'squat',
    sets: 4, reps: '10-15', rest: '120秒',
    steps: [
      '坐于腿举机，双脚与肩同宽踩于踏板。',
      '解除保险，缓慢下放踏板至膝盖接近胸部。',
      '腿部发力蹬起踏板，膝盖不完全锁死。'
    ],
    cues: ['下放时不要过低使臀部离凳', '膝盖不要内扣', '全程控制'],
    tips: '对腰椎压力小，适合新手练腿。'
  },
  {
    id: 'leg-extension', name: '腿屈伸', en: 'Leg Extension',
    bodyPart: '腿', muscle: '股四头肌', equipment: ['leg-extension'],
    level: '入门', type: '孤立', pattern: 'raise',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '坐于腿屈伸机，脚踝卡于挡板后。',
      '股四头肌发力将小腿伸直抬起。',
      '顶端停顿，缓慢下放。'
    ],
    cues: ['顶端充分收缩', '下放不放松到底', '身体贴紧靠背'],
    tips: '孤立刺激股四头肌，可放在深蹲后加强。'
  },
  {
    id: 'leg-curl', name: '腿弯举', en: 'Lying Leg Curl',
    bodyPart: '腿', muscle: '腘绳肌(大腿后侧)', equipment: ['leg-curl'],
    level: '入门', type: '孤立', pattern: 'raise',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '俯卧于腿弯举机，脚踝卡于挡板下。',
      '大腿后侧发力将小腿向臀部弯曲。',
      '顶端收缩，缓慢还原。'
    ],
    cues: ['臀部不抬起', '顶端充分收缩腘绳肌', '控制还原'],
    tips: '平衡大腿前后侧力量，保护膝盖。'
  },
  {
    id: 'romanian-deadlift', name: '罗马尼亚硬拉', en: 'Romanian Deadlift',
    bodyPart: '腿', muscle: '腘绳肌/臀', equipment: ['barbell','dumbbell'],
    level: '进阶', type: '复合', pattern: 'hinge',
    sets: 3, reps: '10-12', rest: '120秒',
    steps: [
      '双手持杠铃站直，膝盖微屈固定。',
      '以髋为轴向后俯身，臀部后移，杠铃贴腿下放。',
      '感受大腿后侧拉伸后，伸髋站起。'
    ],
    cues: ['膝盖角度基本不变', '背部平直', '杠铃贴腿下放'],
    tips: '专注大腿后侧与臀部，下放至腘绳肌有强烈拉伸感。'
  },
  {
    id: 'lunge', name: '弓步蹲', en: 'Lunge',
    bodyPart: '腿', muscle: '股四头肌/臀', equipment: ['dumbbell','mat'],
    level: '入门', type: '复合', pattern: 'lunge',
    sets: 3, reps: '10-12/侧', rest: '90秒',
    steps: [
      '站直，向前迈出一大步。',
      '下蹲至前腿大腿与地面平行，后膝接近地面。',
      '前腿发力蹬起回到站立，交替进行。'
    ],
    cues: ['前膝不过脚尖', '躯干保持直立', '后膝轻触地面'],
    tips: '可手持哑铃增加强度，改善腿部均衡。'
  },
  {
    id: 'calf-raise', name: '站姿提踵', en: 'Standing Calf Raise',
    bodyPart: '腿', muscle: '小腿', equipment: ['smith','mat'],
    level: '入门', type: '孤立', pattern: 'raise',
    sets: 4, reps: '15-20', rest: '45秒',
    steps: [
      '前脚掌踩于踏板边缘，脚跟悬空。',
      '小腿发力将脚跟尽量抬高。',
      '顶峰停顿，缓慢下放至小腿有拉伸感。'
    ],
    cues: ['顶峰充分收缩', '下放充分拉伸', '幅度完整'],
    tips: '小腿训练常被忽略，建议每次练腿都安排。'
  },

  /* ================= 肩 ================= */
  {
    id: 'overhead-press', name: '杠铃站姿推举', en: 'Overhead Press',
    bodyPart: '肩', muscle: '三角肌前中束', equipment: ['barbell'],
    level: '进阶', type: '复合', pattern: 'press',
    sets: 4, reps: '8-12', rest: '120秒',
    steps: [
      '站姿，杠铃置于锁骨前，双手略宽于肩。',
      '核心收紧，将杠铃垂直推过头顶。',
      '顶端手臂伸直，缓慢下放回锁骨。'
    ],
    cues: ['避免过度后仰腰椎', '核心全程收紧', '杠铃沿直线上升'],
    tips: '练肩核心动作，注意别用腰部代偿。'
  },
  {
    id: 'dumbbell-shoulder-press', name: '坐姿哑铃推举', en: 'Seated Dumbbell Press',
    bodyPart: '肩', muscle: '三角肌', equipment: ['dumbbell','bench'],
    level: '入门', type: '复合', pattern: 'press',
    sets: 4, reps: '10-12', rest: '90秒',
    steps: [
      '坐于有靠背的训练凳，双手持哑铃于肩两侧。',
      '肩部发力将哑铃向上推起至接近伸直。',
      '缓慢下放至耳侧。'
    ],
    cues: ['肘部略前于身体', '下放不要低于肩', '避免耸肩'],
    tips: '比杠铃更灵活，对肩关节更友好。'
  },
  {
    id: 'lateral-raise', name: '哑铃侧平举', en: 'Lateral Raise',
    bodyPart: '肩', muscle: '三角肌中束', equipment: ['dumbbell'],
    level: '入门', type: '孤立', pattern: 'raise',
    sets: 4, reps: '12-15', rest: '60秒',
    steps: [
      '站姿，双手持哑铃垂于体侧。',
      '肘部微屈，肩部发力将哑铃向两侧抬起至与肩同高。',
      '缓慢下放。'
    ],
    cues: ['不要耸肩', '抬至与肩同高即可', '小重量多次数'],
    tips: '打造宽肩的关键动作，重量宜轻。'
  },
  {
    id: 'front-raise', name: '哑铃前平举', en: 'Front Raise',
    bodyPart: '肩', muscle: '三角肌前束', equipment: ['dumbbell'],
    level: '入门', type: '孤立', pattern: 'raise',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '站姿，双手持哑铃垂于体前。',
      '肩部发力将哑铃向前抬起至与肩同高。',
      '缓慢下放。'
    ],
    cues: ['不要用惯性甩', '抬至与肩同高', '身体不后仰'],
    tips: '三角肌前束卧推时已参与较多，可适量安排。'
  },
  {
    id: 'face-pull', name: '面拉', en: 'Face Pull',
    bodyPart: '肩', muscle: '三角肌后束/上背', equipment: ['cable'],
    level: '进阶', type: '孤立', pattern: 'pull-h',
    sets: 3, reps: '15-20', rest: '60秒',
    steps: [
      '将绳索调至面部高度，双手握绳。',
      '将绳索拉向面部，肘部向两侧打开。',
      '顶峰收缩肩胛，缓慢还原。'
    ],
    cues: ['拉向眉毛方向', '肘部抬高于肩', '改善圆肩体态'],
    tips: '对肩部健康和体态极有益，强烈推荐。'
  },
  {
    id: 'rear-delt-fly', name: '俯身飞鸟', en: 'Rear Delt Fly',
    bodyPart: '肩', muscle: '三角肌后束', equipment: ['dumbbell'],
    level: '进阶', type: '孤立', pattern: 'raise',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '屈髋俯身，背部平直，双手持哑铃下垂。',
      '肩部发力将哑铃向两侧抬起至与肩同高。',
      '缓慢下放。'
    ],
    cues: ['肘微屈固定', '用后束发力', '背部保持平直'],
    tips: '发展三角肌后束，让肩膀更立体。'
  },

  /* ================= 二头 ================= */
  {
    id: 'barbell-curl', name: '杠铃弯举', en: 'Barbell Curl',
    bodyPart: '二头', muscle: '肱二头肌', equipment: ['barbell'],
    level: '入门', type: '孤立', pattern: 'curl',
    sets: 3, reps: '10-12', rest: '60秒',
    steps: [
      '站姿，双手与肩同宽反握杠铃。',
      '上臂固定，二头肌发力将杠铃弯举至胸前。',
      '顶端收缩，缓慢下放。'
    ],
    cues: ['肘部贴紧身体不移动', '避免身体后仰借力', '下放要控制'],
    tips: '二头肌训练基础动作。'
  },
  {
    id: 'dumbbell-curl', name: '哑铃弯举', en: 'Dumbbell Curl',
    bodyPart: '二头', muscle: '肱二头肌', equipment: ['dumbbell'],
    level: '入门', type: '孤立', pattern: 'curl',
    sets: 3, reps: '10-12', rest: '60秒',
    steps: [
      '站姿，双手持哑铃垂于体侧，掌心朝前。',
      '上臂固定，二头肌发力弯举哑铃。',
      '顶端可略微外旋，缓慢下放。'
    ],
    cues: ['手腕保持中立', '顶峰收缩', '不摆动借力'],
    tips: '可做交替弯举，专注每侧发力。'
  },
  {
    id: 'hammer-curl', name: '锤式弯举', en: 'Hammer Curl',
    bodyPart: '二头', muscle: '肱肌/前臂', equipment: ['dumbbell'],
    level: '入门', type: '孤立', pattern: 'curl',
    sets: 3, reps: '10-12', rest: '60秒',
    steps: [
      '站姿，双手持哑铃，掌心相对（锤式握法）。',
      '上臂固定，弯举哑铃至胸前。',
      '缓慢下放。'
    ],
    cues: ['掌心始终相对', '不翻腕', '前臂也会发力'],
    tips: '强化肱肌和前臂，让手臂更粗壮。'
  },
  {
    id: 'preacher-curl', name: '牧师凳弯举', en: 'Preacher Curl',
    bodyPart: '二头', muscle: '肱二头肌', equipment: ['barbell','bench'],
    level: '进阶', type: '孤立', pattern: 'curl',
    sets: 3, reps: '10-12', rest: '60秒',
    steps: [
      '坐于牧师凳，上臂贴紧斜板。',
      '二头肌发力弯举杠铃/哑铃。',
      '顶端收缩，缓慢下放至手臂接近伸直。'
    ],
    cues: ['上臂紧贴斜板', '下放充分拉伸', '杜绝借力'],
    tips: '严格孤立二头肌，重量不宜过大。'
  },

  /* ================= 三头 ================= */
  {
    id: 'triceps-pushdown', name: '绳索下压', en: 'Triceps Pushdown',
    bodyPart: '三头', muscle: '肱三头肌', equipment: ['cable'],
    level: '入门', type: '孤立', pattern: 'pushdown',
    sets: 4, reps: '12-15', rest: '60秒',
    steps: [
      '面对龙门架，双手握绳索/直杆，肘部贴紧身体。',
      '三头肌发力将绳索下压至手臂伸直。',
      '顶峰收缩，缓慢还原至前臂与地面平行。'
    ],
    cues: ['肘部固定不移动', '只动前臂', '顶端充分收缩'],
    tips: '三头肌训练最经典动作。'
  },
  {
    id: 'close-grip-bench', name: '窄距卧推', en: 'Close-grip Bench Press',
    bodyPart: '三头', muscle: '肱三头肌', equipment: ['barbell','bench'],
    level: '进阶', type: '复合', pattern: 'push-h',
    sets: 3, reps: '8-12', rest: '90秒',
    steps: [
      '仰卧，双手与肩同宽或略窄握杠。',
      '下放杠铃至胸部，肘部贴近身体。',
      '三头肌发力推起杠铃。'
    ],
    cues: ['肘部贴近身体', '握距不过窄以免伤腕', '控制下放'],
    tips: '三头肌增肌的复合动作。'
  },
  {
    id: 'overhead-triceps-extension', name: '过头臂屈伸', en: 'Overhead Triceps Extension',
    bodyPart: '三头', muscle: '肱三头肌长头', equipment: ['dumbbell','cable'],
    level: '进阶', type: '孤立', pattern: 'press',
    sets: 3, reps: '10-12', rest: '60秒',
    steps: [
      '坐姿或站姿，双手托住哑铃举过头顶。',
      '屈肘将哑铃缓慢下放至颈后。',
      '三头肌发力伸直手臂。'
    ],
    cues: ['肘部尽量朝前', '下放至三头充分拉伸', '核心收紧'],
    tips: '重点刺激三头肌长头。'
  },
  {
    id: 'bench-dip', name: '凳上反屈伸', en: 'Bench Dip',
    bodyPart: '三头', muscle: '肱三头肌', equipment: ['bench'],
    level: '入门', type: '孤立', pattern: 'dip',
    sets: 3, reps: '力竭', rest: '60秒',
    steps: [
      '背对训练凳，双手撑凳沿，双腿前伸。',
      '屈肘下放身体至大臂与地面平行。',
      '三头肌发力撑起身体。'
    ],
    cues: ['身体贴近凳子', '肘部向后', '肩部放松'],
    tips: '可双脚踩地降低难度，或垫高双脚增加难度。'
  },

  /* ================= 核心 ================= */
  {
    id: 'crunch', name: '卷腹', en: 'Crunch',
    bodyPart: '核心', muscle: '腹直肌', equipment: ['mat'],
    level: '入门', type: '孤立', pattern: 'core',
    sets: 3, reps: '15-20', rest: '45秒',
    steps: [
      '仰卧屈膝，双手置于耳侧或胸前。',
      '腹肌发力卷起上背部离地。',
      '顶峰收缩，缓慢还原。'
    ],
    cues: ['腰部贴地', '用腹肌卷起而非颈部', '呼气起身'],
    tips: '比仰卧起坐更安全，对腰椎压力小。'
  },
  {
    id: 'plank', name: '平板支撑', en: 'Plank',
    bodyPart: '核心', muscle: '腹横肌/核心', equipment: ['mat'],
    level: '入门', type: '孤立', pattern: 'plank',
    sets: 3, reps: '30-60秒', rest: '45秒',
    steps: [
      '前臂撑地，身体从头到脚呈一条直线。',
      '核心与臀部收紧，保持静态。'
    ],
    cues: ['不塌腰不撅臀', '收紧腹部', '自然呼吸'],
    tips: '核心稳定性的基础训练。'
  },
  {
    id: 'russian-twist', name: '俄罗斯转体', en: 'Russian Twist',
    bodyPart: '核心', muscle: '腹斜肌', equipment: ['mat','medicine-ball'],
    level: '进阶', type: '孤立', pattern: 'core',
    sets: 3, reps: '20次', rest: '45秒',
    steps: [
      '坐姿屈膝，上身后仰约 45°，双手持重物。',
      '核心发力左右转体，带动双手移动。',
      '全程保持背部挺直。'
    ],
    cues: ['用腹部带动旋转', '双脚可离地增加难度', '控制节奏'],
    tips: '针对腹斜肌，雕刻腰部线条。'
  },
  {
    id: 'hanging-leg-raise', name: '悬垂举腿', en: 'Hanging Leg Raise',
    bodyPart: '核心', muscle: '下腹', equipment: ['pullup-bar'],
    level: '进阶', type: '孤立', pattern: 'core',
    sets: 3, reps: '10-15', rest: '60秒',
    steps: [
      '双手握单杠悬垂，身体稳定。',
      '腹部发力将双腿抬起至与地面平行或更高。',
      '缓慢下放。'
    ],
    cues: ['避免摆动', '用下腹发力', '屈膝可降低难度'],
    tips: '强化下腹，需要一定握力基础。'
  },
  {
    id: 'back-extension', name: '山羊挺身', en: 'Back Extension',
    bodyPart: '核心', muscle: '竖脊肌/下背/臀', equipment: ['mat'],
    level: '入门', type: '孤立', pattern: 'hinge',
    sets: 3, reps: '12-15', rest: '60秒',
    steps: [
      '俯卧于山羊凳或垫上，固定脚踝。',
      '下背与臀部发力抬起上身至身体成直线。',
      '缓慢下放。'
    ],
    cues: ['不要过度后仰', '顶峰收缩臀部', '控制幅度'],
    tips: '强化下背，保护腰椎。'
  },

  /* ================= 有氧 ================= */
  {
    id: 'treadmill-run', name: '跑步机慢跑', en: 'Treadmill Jog',
    bodyPart: '有氧', muscle: '心肺/全身', equipment: ['treadmill'],
    level: '入门', type: '有氧', pattern: 'cardio',
    sets: 1, reps: '20-30分钟', rest: '—',
    steps: [
      '以 5-6 km/h 快走热身 5 分钟。',
      '逐步提速至 8-10 km/h 慢跑 15-20 分钟。',
      '最后 5 分钟减速快走放松。'
    ],
    cues: ['保持能说话的强度', '身体微前倾', '落地轻柔'],
    tips: '减脂期建议每周 2-3 次有氧，可安排在力量训练后。'
  },
  {
    id: 'rowing-machine', name: '划船机', en: 'Rowing Machine',
    bodyPart: '有氧', muscle: '全身/背/腿', equipment: ['rower'],
    level: '入门', type: '有氧', pattern: 'cardio',
    sets: 1, reps: '15-20分钟', rest: '—',
    steps: [
      '坐姿固定双脚，双手握桨。',
      '先蹬腿，再后仰拉桨，最后屈臂。',
      '还原时反向依次进行。'
    ],
    cues: ['发力顺序：腿→躯干→手臂', '背部挺直', '节奏均匀'],
    tips: '全身性有氧，对膝盖友好。'
  },
  {
    id: 'elliptical', name: '椭圆机', en: 'Elliptical',
    bodyPart: '有氧', muscle: '心肺/腿', equipment: ['elliptical'],
    level: '入门', type: '有氧', pattern: 'cardio',
    sets: 1, reps: '20-30分钟', rest: '—',
    steps: [
      '双脚踩上踏板，双手握把。',
      '保持匀速蹬踏，可调节阻力。',
      '保持自然呼吸，核心微收。'
    ],
    cues: ['全脚掌贴踏板', '不踮脚尖', '保持节奏'],
    tips: '对关节冲击小，适合大体重减脂。'
  },
  {
    id: 'spin-bike', name: '动感单车', en: 'Spin Bike',
    bodyPart: '有氧', muscle: '心肺/腿', equipment: ['bike'],
    level: '入门', type: '有氧', pattern: 'cardio',
    sets: 1, reps: '20-30分钟', rest: '—',
    steps: [
      '调节座椅高度至与髋同高。',
      '保持匀速骑行，可间歇加速。',
      '保持背部微前倾，核心收紧。'
    ],
    cues: ['膝盖不过度内扣', '座椅高度合适', '阻力适中'],
    tips: '高效燃脂，注意补充水分。'
  }
];

/* ---------- 训练计划模板 ---------- */
const GOALS = {
  'build-muscle': { name: '增肌', desc: '以中大重量、多组数为主，追求肌肉围度增长' },
  'lose-fat':    { name: '减脂', desc: '力量训练结合有氧，控制体脂、保留肌肉' },
  'tone':        { name: '塑形', desc: '中等重量多次数，塑造线条、提升体能' },
  'strength':    { name: '力量', desc: '大重量低次数，重点提升力量水平' }
};

const LEVELS = {
  'beginner':     { name: '新手', desc: '刚开始健身，或间断训练不足 6 个月' },
  'intermediate': { name: '进阶', desc: '规律训练 6 个月以上，掌握基础动作' },
  'advanced':     { name: '高手', desc: '系统训练 2 年以上，动作标准、力量较好' }
};

/* 训练分化方案：按每周次数选择 */
const SPLITS = {
  3: [
    { id: 'fullbody', name: '全身训练 ×3', desc: '每周三次全身循环，适合新手快速入门', days: [
      { name: '全身 A', focus: '全身基础', exercises: ['barbell-squat','barbell-bench-press','seated-cable-row','dumbbell-shoulder-press','plank'] },
      { name: '全身 B', focus: '全身基础', exercises: ['leg-press','incline-dumbbell-press','lat-pulldown','lateral-raise','crunch'] },
      { name: '全身 C', focus: '全身基础', exercises: ['deadlift','dumbbell-bench-press','one-arm-dumbbell-row','overhead-press','russian-twist'] }
    ]},
    { id: 'p-p-l', name: '推/拉/腿 ×3', desc: '经典三分化，适合进阶训练者', days: [
      { name: '推日(胸肩三头)', focus: '胸·肩·三头', exercises: ['barbell-bench-press','incline-dumbbell-press','overhead-press','lateral-raise','triceps-pushdown'] },
      { name: '拉日(背二头)', focus: '背·二头', exercises: ['pull-up','seated-cable-row','lat-pulldown','face-pull','barbell-curl'] },
      { name: '腿日(腿臀核心)', focus: '腿·臀·核心', exercises: ['barbell-squat','romanian-deadlift','leg-extension','leg-curl','plank'] }
    ]}
  ],
  4: [
    { id: 'upper-lower', name: '上/下分化 ×4', desc: '上肢下肢交替，兼顾恢复与频率', days: [
      { name: '上肢 A(推)', focus: '胸·肩·三头', exercises: ['barbell-bench-press','incline-dumbbell-press','overhead-press','lateral-raise','triceps-pushdown'] },
      { name: '下肢 A(股四)', focus: '腿·臀', exercises: ['barbell-squat','leg-press','leg-extension','calf-raise','plank'] },
      { name: '上肢 B(拉)', focus: '背·二头', exercises: ['pull-up','barbell-row','seated-cable-row','face-pull','barbell-curl'] },
      { name: '下肢 B(后链)', focus: '腿后侧·臀·核心', exercises: ['deadlift','romanian-deadlift','leg-curl','lunge','russian-twist'] }
    ]},
    { id: 'p-p-l-rest', name: '推/拉/腿+补充 ×4', desc: '三分化加一天弱项/有氧', days: [
      { name: '推日(胸肩三头)', focus: '胸·肩·三头', exercises: ['barbell-bench-press','incline-dumbbell-press','overhead-press','lateral-raise','triceps-pushdown'] },
      { name: '拉日(背二头)', focus: '背·二头', exercises: ['pull-up','seated-cable-row','lat-pulldown','face-pull','barbell-curl'] },
      { name: '腿日(腿臀)', focus: '腿·臀·核心', exercises: ['barbell-squat','romanian-deadlift','leg-extension','leg-curl','plank'] },
      { name: '补充日(弱项/有氧)', focus: '肩·手臂·有氧', exercises: ['dumbbell-shoulder-press','lateral-raise','dumbbell-curl','triceps-pushdown','treadmill-run'] }
    ]}
  ]
};

/* ---------- 辅助函数 ---------- */
function getExerciseById(id) {
  return EXERCISES.find(e => e.id === id) || null;
}

function getEquipmentById(id) {
  return EQUIPMENT.find(e => e.id === id) || null;
}

function getExercisesByEquipment(equipmentId) {
  return EXERCISES.filter(e => e.equipment.includes(equipmentId));
}

function getExercisesByBodyPart(bodyPart) {
  return EXERCISES.filter(e => e.bodyPart === bodyPart);
}

function getBodyParts() {
  return ['胸','背','腿','肩','二头','三头','核心','有氧'];
}

/* 根据器械名/动作名关键词在库中模糊匹配（AI 识别结果落地用） */
function matchEquipmentByText(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  let best = null, bestScore = 0;
  for (const eq of EQUIPMENT) {
    for (const alias of eq.aliases) {
      const a = alias.toLowerCase();
      let score = 0;
      if (t === a) score = 1000;
      else if (a.length >= 2 && t.includes(a)) score = 200 + a.length;   // 别名是文本的子串
      else if (t.length >= 2 && a.includes(t)) score = 100 + t.length;   // 文本是别名的子串
      if (score > bestScore) { bestScore = score; best = eq; }
    }
  }
  return bestScore >= 102 ? best : null;
}

function matchExerciseByText(text) {
  if (!text) return null;
  const t = text.toLowerCase();
  let best = null, bestScore = 0;
  for (const ex of EXERCISES) {
    const names = [ex.name, ex.en].map(n => n.toLowerCase());
    for (const n of names) {
      let score = 0;
      if (t === n) score = 1000;
      else if (n.length >= 2 && t.includes(n)) score = 200 + n.length;   // 名称是文本的子串
      else if (t.length >= 2 && n.includes(t)) score = 100 + t.length;   // 文本是名称的子串
      if (score > bestScore) { bestScore = score; best = ex; }
    }
  }
  return bestScore >= 102 ? best : null;
}
