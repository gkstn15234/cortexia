/**
 * Action Guard — 행동 횟수 제한 시스템
 * =====================================
 * Claude의 tool 실행 횟수를 세고, 제한 초과 시 차단합니다.
 * Claude 바깥에서 실행되므로 Claude가 수정할 수 없습니다.
 *
 * 설정:
 *   DAILY_LIMIT  — 하루 최대 행동 횟수
 *   카운트 파일  — .claude/hooks/.action_count (자동 생성)
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════
//  설정 (한수님이 직접 수정하는 영역)
// ═══════════════════════════════════════
const DAILY_LIMIT = 50;  // 하루 최대 행동 횟수

// ═══════════════════════════════════════
//  카운트 파일 경로
// ═══════════════════════════════════════
const countFile = path.join(__dirname, '.action_count');

function getToday() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function readCount() {
  try {
    const data = JSON.parse(fs.readFileSync(countFile, 'utf8'));
    if (data.date === getToday()) {
      return data;
    }
    // 날짜가 바뀌면 리셋
    return { date: getToday(), count: 0, log: [] };
  } catch {
    return { date: getToday(), count: 0, log: [] };
  }
}

function writeCount(data) {
  fs.writeFileSync(countFile, JSON.stringify(data, null, 2), 'utf8');
}

// ═══════════════════════════════════════
//  실행
// ═══════════════════════════════════════
const data = readCount();

if (data.count >= DAILY_LIMIT) {
  const msg = `[Action Guard] 행동 횟수 초과: ${data.count}/${DAILY_LIMIT}회 (일일 한도 도달)`;
  console.error(msg);
  process.exit(1); // hook 실패 → Claude 행동 차단
}

// 카운트 증가
data.count++;
data.log.push({
  time: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
  action: data.count,
});

// 최근 100개 로그만 유지
if (data.log.length > 100) {
  data.log = data.log.slice(-100);
}

writeCount(data);

// 남은 횟수 알림
const remaining = DAILY_LIMIT - data.count;
if (remaining <= 5) {
  console.error(`[Action Guard] 주의: 남은 행동 횟수 ${remaining}/${DAILY_LIMIT}회`);
}

// 정상 통과
process.exit(0);
