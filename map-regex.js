(function initMapRegex(globalScope) {
  'use strict';

  const MAX_STASH_REGEX_LENGTH = 250;

  const POE1_GROUPS = [
    {
      id: 'prefix',
      title: '공격 위험',
      items: [
        { label: '몬스터가 물리 피해를 반사', pattern: '물.*반', danger: true },
        { label: '몬스터가 원소 피해를 반사', pattern: '원.*반', danger: true },
        { label: '몬스터 피해 증가', pattern: '터.피.*증', danger: true },
        { label: '몬스터 생명력 증폭', pattern: '력.*증폭', danger: true },
        { label: '몬스터가 추가 물리 피해를 화염/냉기/번개 속성으로 가함', pattern: '염.속|기.속|개.속', danger: true },
        { label: '몬스터 공격/시전/이동 속도 증가', pattern: '동.속.*증', danger: true },
        { label: '몬스터가 투사체 추가 발사', pattern: '투.추', danger: true },
        { label: '몬스터 치명타 확률/피해 증가', pattern: '배율', danger: true },
        { label: '몬스터가 원소 상태 이상 유발', pattern: '상.유', danger: true },
        { label: '몬스터가 충전 강탈', pattern: '강탈', danger: true },
        { label: '플레이어가 생명력, 마나 또는 에너지 보호막 재생 불가', pattern: '재생', danger: true },
        { label: '생명력 및 에너지 보호막 회복 속도 감폭', pattern: '및.*감', danger: true },
        { label: '플레이어의 모든 저항 최대치 감소', pattern: '항.최', danger: true },
        { label: '플레이어의 플라스크 충전량 감소', pattern: '전량', danger: true },
        { label: '몬스터는 흡수 대상이 되지 않음', pattern: '흡수', danger: true }
      ]
    },
    {
      id: 'suffix',
      title: '방어/제약',
      items: [
        { label: '플레이어가 취약성 저주에 걸림', pattern: '취약', danger: true },
        { label: '플레이어가 시간의 사슬 저주에 걸림', pattern: '사슬', danger: true },
        { label: '플레이어가 원소 약화 저주에 걸림', pattern: '소.약', danger: true },
        { label: '플레이어가 쇠약화 저주에 걸림', pattern: '쇠약', danger: true },
        { label: '몬스터가 사술 방지 보유', pattern: '사술', danger: true },
        { label: '몬스터에게 걸리는 저주 효과 감폭', pattern: '주.*폭', danger: true },
        { label: '몬스터의 원소 저항 증가', pattern: '카.*항', danger: true },
        { label: '몬스터의 카오스 저항 증가', pattern: '카.*항', danger: true },
        { label: '몬스터의 주문 피해 억제 확률 증가', pattern: '제.확', danger: true },
        { label: '몬스터가 중독, 꿰뚫기, 출혈 회피', pattern: '출혈', danger: true },
        { label: '플레이어의 방어도 감폭 및 막기 확률 감소', pattern: '어도', danger: true },
        { label: '플레이어가 노출 유발 불가', pattern: '노출', danger: true },
        { label: '플레이어가 이동 전용 스킬 사용 불가', pattern: '이동.전용', danger: true },
        { label: '가까이 있을 때만 몬스터가 피해를 받음', pattern: '가까이', danger: true },
        { label: '몬스터 도발 면역 및 동작 속도 최소치 고정', pattern: '도발', danger: true }
      ]
    }
  ];

  const POE1_NUMERIC_STATS = {
    quantity: { label: '아이템 수량', prefix: '량.*', compact: true },
    rarity: { label: '아이템 희귀도', prefix: '희귀도.*', compact: true },
    packSize: { label: '몬스터 무리 규모', prefix: '모.*', compact: true }
  };

  function rangeDigit(from, to = 9) {
    if (from > to) return '';
    return from === to ? String(from) : `[${from}-${to}]`;
  }

  function buildCompactPercentAtLeastRegex(value) {
    const min = Math.max(0, Math.floor(Number(value)));
    if (!Number.isFinite(min) || min <= 0) return '';

    const digits = String(min).split('').map(Number);
    const alternatives = [];
    let pivot = digits.length - 1;
    while (pivot > 0 && digits[pivot] === 0) pivot -= 1;

    const inclusivePrefix = digits.slice(0, pivot).join('');
    alternatives.push(`${inclusivePrefix}${rangeDigit(digits[pivot])}${'.'.repeat(digits.length - pivot - 1)}`);
    for (let index = pivot - 1; index >= 0; index -= 1) {
      const nextDigit = digits[index] + 1;
      if (nextDigit > 9) continue;
      const prefix = digits.slice(0, index).join('');
      alternatives.push(`${prefix}${rangeDigit(nextDigit)}${'.'.repeat(digits.length - index - 1)}`);
    }
    alternatives.push(`[1-9]${'.'.repeat(digits.length)}`);

    const compact = alternatives.filter(Boolean).join('|');
    return `${alternatives.length > 1 ? `(${compact})` : compact}%`;
  }

  function getLengthState(regex) {
    const length = String(regex || '').length;
    return { length, max: MAX_STASH_REGEX_LENGTH, overLimit: length > MAX_STASH_REGEX_LENGTH };
  }

  const api = {
    MAX_STASH_REGEX_LENGTH,
    POE1_GROUPS,
    POE1_NUMERIC_STATS,
    buildCompactPercentAtLeastRegex,
    getLengthState
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  globalScope.POE2TQMapRegex = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
