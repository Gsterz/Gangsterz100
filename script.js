document.addEventListener('DOMContentLoaded', function () {
  // (1) 자동 콜론 입력
  function autoColonFormat(input) {
    input.addEventListener('input', function () {
      let raw = input.value.replace(/[^0-9]/g, '').slice(0, 6);
      if (raw.length >= 5) input.value = raw.replace(/(\d{2})(\d{2})(\d{0,2})/, '$1:$2:$3');
      else if (raw.length >= 3) input.value = raw.replace(/(\d{2})(\d{0,2})/, '$1:$2');
      else input.value = raw;
    });
  }

  ['myMarchTime', 'attackTime', 'utcTime', 'rallyRemainTime', 'enemyMarchTime',
   'enemyMarch1', 'enemyMarch2', 'enemyMarch3', 'enemyMarch4']
    .forEach(id => autoColonFormat(document.getElementById(id)));

  // (2) useEnemyTimeCheckbox 제어
  const useEnemyCheckbox = document.getElementById('useEnemyTimeCheckbox');
  const enemyFields = ['utcTime', 'rallyRemainTime', 'enemyMarchTime'];

  function toggleEnemyFields(enabled) {
    enemyFields.forEach(id => {
      const el = document.getElementById(id);
      el.disabled = !enabled;
      el.classList.toggle('bg-gray-200', !enabled);
    });
  }

  useEnemyCheckbox.addEventListener('change', () => toggleEnemyFields(useEnemyCheckbox.checked));
  toggleEnemyFields(useEnemyCheckbox.checked); // 초기 상태 반영

  // (3) useMyMarchCheckbox 제어
  const useMyMarchCheckbox = document.getElementById('useMyMarchCheckbox');
  const enemyIds = ['enemyId1', 'enemyId2', 'enemyId3', 'enemyId4'];
  const enemyMarches = ['enemyMarch1', 'enemyMarch2', 'enemyMarch3', 'enemyMarch4'];
  const enemySelects = ['enemySelect1', 'enemySelect2', 'enemySelect3', 'enemySelect4'];

  function toggleMyMarchFields(enabled) {
    [...enemyIds, ...enemyMarches].forEach(id => {
      const el = document.getElementById(id);
      el.disabled = !enabled;
      el.classList.toggle('bg-gray-200', !enabled);
    });
    enemySelects.forEach(id => {
      const el = document.getElementById(id);
      el.checked = false;
      el.disabled = !enabled;
    });
  }

  useMyMarchCheckbox.addEventListener('change', () => toggleMyMarchFields(useMyMarchCheckbox.checked));
  toggleMyMarchFields(useMyMarchCheckbox.checked); // 초기 상태 반영
});

// ✅ 사용할 체크박스 ID 목록
const checkboxes = [
  { select: "enemySelect1", march: "enemyMarch1" },
  { select: "enemySelect2", march: "enemyMarch2" },
  { select: "enemySelect3", march: "enemyMarch3" },
  { select: "enemySelect4", march: "enemyMarch4" },
];

// ✅ 공통 이벤트 함수 등록
checkboxes.forEach((item, idx) => {
  const checkbox = document.getElementById(item.select);
  const marchInput = document.getElementById(item.march);
  const targetField = document.getElementById("enemyMarchTime");

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      // ✅ 입력값 유효성 검사
      const timeValue = marchInput.value.trim();
      if (!/^\d{2}:\d{2}:\d{2}$/.test(timeValue)) {
        alert("상대 행군시간 입력 필요");
        checkbox.checked = false;
        return;
      }

      // ✅ 나머지 체크박스 해제
      checkboxes.forEach((other, otherIdx) => {
        if (otherIdx !== idx) {
          document.getElementById(other.select).checked = false;
        }
      });

      // ✅ enemyMarchTime에 값 복사
      targetField.value = timeValue;
    }
  });
});

function parseTimeToMs(timeStr) {
  const [hh = 0, mm = 0, ss = 0] = timeStr.split(":").map(Number);
  return (hh * 3600 + mm * 60 + ss) * 1000;
}

function msToSeconds(ms) {
  return Math.round(ms / 1000);
}

const useUtcCheckbox = document.getElementById('useUtcCheckbox');
const rallyRemainTime = document.getElementById('rallyRemainTime');
const utcTimeInput = document.getElementById('utcTime');

// rallyRemainTime 입력 시 HH:mm:ss 형식인지 확인 후 UTC 시간 자동입력
rallyRemainTime.addEventListener('input', () => {
  const value = rallyRemainTime.value.trim();
  const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/; // HH:mm:ss

  if (useUtcCheckbox.checked && timeFormat.test(value)) {
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    utcTimeInput.value = `${utcHours}:${utcMinutes}:${utcSeconds}`;
  }
});

document.getElementById('resetUtcTime').addEventListener('click', () => {
  utcTimeInput.value = '';
});

document.getElementById('resetRallyRemainTime').addEventListener('click', () => {
  rallyRemainTime.value = '';
});

document.getElementById('resetEnemyMarchTime').addEventListener('click', () => {
  document.getElementById('enemyMarchTime').value = '';
});

document.getElementById('resetMyMarchTime').addEventListener('click', () => {
  const myMarchTime = document.getElementById('myMarchTime');
  myMarchTime.value = '';
  myMarchTime.placeholder = 'HH:mm:ss';
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {
    alert('복사에 실패했습니다.');
  });
}

document.getElementById('copyAttackTime').addEventListener('click', () => {
  const attackTime = document.getElementById('attackTime').value.trim();
  if (attackTime) copyToClipboard(attackTime);
});

document.getElementById('copyDefenseTime1').addEventListener('click', () => {
  const defenseTime1 = document.getElementById('defenseTime1').value.trim();
  if (defenseTime1) copyToClipboard(defenseTime1);
});

document.getElementById('copyDefenseTime2').addEventListener('click', () => {
  const defenseTime2 = document.getElementById('defenseTime2').value.trim();
  if (defenseTime2) copyToClipboard(defenseTime2);
});





  function parseTimeToSeconds(timeStr) {
    const parts = timeStr.trim().split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  function formatSecondsToTime(seconds) {
    if (seconds < 0) seconds = 0;
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  document.getElementById("calculateButton").addEventListener("click", () => {
    const useEnemyTime = document.getElementById("useEnemyTimeCheckbox").checked;
    const useMyMarch = document.getElementById("useMyMarchCheckbox").checked;

    const utcTimeStr = document.getElementById("utcTime").value;
    const rallyRemainStr = document.getElementById("rallyRemainTime").value;
    const enemyMarchStr = document.getElementById("enemyMarchTime").value;
    const myMarchStr = document.getElementById("myMarchTime").value;
    const attackTimeInput = document.getElementById("attackTime");

    let attackSeconds = null;

    // 나의 행군시간 검증
    const myMarchSeconds = parseTimeToSeconds(myMarchStr);
    if ((useMyMarch || (useEnemyTime && useMyMarch)) && myMarchSeconds === null) {
      alert("나의 행군시간 입력필요");
      return;
    }

    // 적 행군시간 사용 시 attackTime 계산
    if (useEnemyTime) {
      const utcSeconds = parseTimeToSeconds(utcTimeStr) ?? 0;
      const rallyRemainSeconds = parseTimeToSeconds(rallyRemainStr) ?? 0;
      const enemyMarchSeconds = parseTimeToSeconds(enemyMarchStr) ?? 0;
      attackSeconds = utcSeconds + rallyRemainSeconds + enemyMarchSeconds;
      attackTimeInput.value = formatSecondsToTime(attackSeconds);
    }

    // 적 행군시간 미사용 시 attackTime 수동 입력 필요
    if (!useEnemyTime) {
      const inputAttack = parseTimeToSeconds(attackTimeInput.value);
      if (inputAttack === null || inputAttack === 0) {
        alert("공격 도착시간 입력필요");
        return;
      }
      attackSeconds = inputAttack;
    }

    // 수비 파견시간 계산
    const defenseTime1 = attackSeconds - myMarchSeconds;
    const defenseTime2 = attackSeconds - myMarchSeconds / 2 - 0.5;

    const defense1El = document.getElementById("defenseTime1");
    const defense2El = document.getElementById("defenseTime2");

    defense1El.value = formatSecondsToTime(defenseTime1);
    defense2El.value = formatSecondsToTime(defenseTime2);

    // 출력 스타일 적용 (파란색, 굵은 글씨)
    defense1El.classList.add("text-blue-600", "font-bold");
    defense2El.classList.add("text-blue-600", "font-bold");
  });
