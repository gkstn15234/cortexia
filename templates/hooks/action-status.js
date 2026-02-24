/**
 * Action Status — 현재 행동 횟수 확인용
 * =====================================
 * 터미널에서 실행: node .claude/hooks/action-status.js
 * 오늘 몇 번 행동했는지, 남은 횟수, 로그를 보여줍니다.
 */

const fs = require('fs');
const path = require('path');

const countFile = path.join(__dirname, '.action_count');
const DAILY_LIMIT = 50;

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

try {
  const data = JSON.parse(fs.readFileSync(countFile, 'utf8'));

  if (data.date !== getToday()) {
    console.log('오늘 행동 기록 없음 (리셋됨)');
    console.log(`일일 한도: ${DAILY_LIMIT}회`);
    process.exit(0);
  }

  console.log(`\n  === Action Guard 상태 ===`);
  console.log(`  날짜: ${data.date}`);
  console.log(`  사용: ${data.count}/${DAILY_LIMIT}회`);
  console.log(`  남음: ${DAILY_LIMIT - data.count}회`);
  console.log();

  if (data.log && data.log.length > 0) {
    console.log(`  최근 행동 로그:`);
    const recent = data.log.slice(-10);
    for (const entry of recent) {
      console.log(`    #${entry.action} — ${entry.time}`);
    }
  }
  console.log();
} catch {
  console.log('아직 행동 기록 없음');
  console.log(`일일 한도: ${DAILY_LIMIT}회`);
}
