'use strict';

const EXPEDITION_DATA = [
  { category: '추천', rumor: '얼음장 처럼 추운 곳', region: '차디찬 절벽', effect: '다양한 제단 효과로 보상 강화, 다만 면역 제단 주의, 부활 무한' },
  { category: '추천', rumor: '음산하고 끔찍한 곳', region: '불모의 신호섬', effect: '금고 다수 존재, 부활 무한' },
  { category: '추천', rumor: '따뜻하지만 위험하다', region: '우거진 섬', effect: '경험치 증가 유적, 추가 몬스터 소환 가능, 부활 무한' },
  { category: '보통', rumor: '아황산염!', region: '그을린 염초', effect: '희귀도 증가' },
  { category: '보통', rumor: '끝없는 계곡', region: '바위투성이 반도', effect: '희귀 아이템 증가 보스방, 달주 유배자 2명' },
  { category: '보통', rumor: '자유롭게 활보하는 야생', region: '풍이 든긴 프레리', effect: '아즈메리로 강화' },
  { category: '보통', rumor: '흡수할 것이 없다', region: '고인 분지', effect: '넓은 폭발' },
  { category: '비추', rumor: '무언가 수상하다', region: '표백된 모래톱', effect: '진주 목걸이 획득 가능' },
  { category: '비추', rumor: '적어도 축축하지는 않다', region: '전장이 된 고랑', effect: '몬스터 효율 증가 가능, 몬스터가 자주 끼임' },
  { category: '특수', rumor: '알려지지 않은 유적', region: '파헤쳐진 폐허', effect: '제단 3개 활성화 후 바닥의 제단 누르면 주변 지역 개방 됨' },
  { category: '고유(중요)', rumor: '떨어진 별', region: '무너진 하늘의 황야', effect: '8룬 이하 아이템 선택 가능 (나오면 무조건 하세요)' },
  { category: '고유', rumor: '반사하는 물', region: '분열된 호수', effect: '특수 베이스 장신구 획득' },
  { category: '고유', rumor: '선량한 자', region: '한순간의 신', effect: '고유 아이템 선택(배건저)' },
  { category: '고유', rumor: '가히 낙원이라고 불리는 곳', region: '매몰치 않은 낙원', effect: '경험치 3배, 아이템 없음' },
  { category: '고유', rumor: '??(소문 모음)', region: '애조마이 거서', effect: '여러 고유 몸 처치, 준 보상' },
  { category: '보스(추천)', rumor: '별 흡수자', region: '외딴 사원', effect: '우트레드\n- 우트레드의 별자리\n- 우트레드의 의례\n- 고갈된 마나 룬' },
  { category: '보스(추천)', rumor: '몰락의 기원', region: '후미진 섬', effect: '올로스\n- 우트레드의 징조\n- 영웅적인 비극\n- 올로스의 결의\n- 올로스의 태양 문양' },
  { category: '보스(추천)', rumor: '순환의 끝', region: '뻗어 가는 마을', effect: '매드배드\n- 보라나의 공성' },
  { category: '보스(비추)', rumor: '최후의 보루', region: '음울한 낭떠러지', effect: '보라나' },
];

// poe2_item_translations_ko_updated.json 내용을 카테고리 구분 없이 단일 맵으로 병합
const ITEM_NAMES_KO = {
  "Ancient Infuser": "고대 주입기",
  "Arcanist's Etcher": "신비학자의 식각기",
  "Architect's Orb": "건축가의 오브",
  "Armourer's Scrap": "방어구 장인의 고철",
  "Artificer's Orb": "숙련공의 오브",
  "Artificer's Shard": "숙련공의 파편",
  "Blacksmith's Whetstone": "대장장이의 숫돌",
  "Chance Shard": "기회의 파편",
  "Chaos Orb": "카오스 오브",
  "Core Destabiliser": "핵 불안정화기",
  "Cryptic Key": "난해한 열쇠",
  "Crystallised Corruption": "결정화된 타락",
  "Divine Orb": "신성한 오브",
  "Exalted Orb": "엑잘티드 오브",
  "Fracturing Orb": "분열의 오브",
  "Gemcutter's Prism": "세공사의 프리즘",
  "Glassblower's Bauble": "유리직공의 방울",
  "Greater Chaos Orb": "상위 카오스 오브",
  "Greater Exalted Orb": "상위 엑잘티드 오브",
  "Greater Jeweller's Orb": "상위 쥬얼러 오브",
  "Greater Orb of Augmentation": "상위 확장의 오브",
  "Greater Orb of Transmutation": "상위 진화의 오브",
  "Greater Regal Orb": "상위 제왕의 오브",
  "Hinekora's Lock": "히네코라의 머리카락",
  "Lesser Jeweller's Orb": "하위 쥬얼러 오브",
  "Mirror of Kalandra": "칼란드라의 거울",
  "Orb of Alchemy": "연금술의 오브",
  "Orb of Annulment": "소멸의 오브",
  "Orb of Augmentation": "확장의 오브",
  "Orb of Chance": "기회의 오브",
  "Orb of Extraction": "추출의 오브",
  "Orb of Transmutation": "진화의 오브",
  "Perfect Chaos Orb": "완벽한 카오스 오브",
  "Perfect Exalted Orb": "완벽한 엑잘티드 오브",
  "Perfect Jeweller's Orb": "완벽한 쥬얼러 오브",
  "Perfect Orb of Augmentation": "완벽한 확장의 오브",
  "Perfect Orb of Transmutation": "완벽한 진화의 오브",
  "Perfect Regal Orb": "완벽한 제왕의 오브",
  "Regal Orb": "제왕의 오브",
  "Regal Shard": "제왕의 파편",
  "Scroll of Wisdom": "감정 주문서",
  "Transmutation Shard": "진화의 파편",
  "Vaal Arcanist's Infuser": "바알 신비학자의 주입기",
  "Vaal Armourer's Infuser": "바알 방어구 장인의 주입기",
  "Vaal Blacksmith's Infuser": "바알 대장장이의 주입기",
  "Vaal Catalysing Infuser": "바알 촉진시키는 주입기",
  "Vaal Cultivation Orb": "바알 함양 오브",
  "Vaal Orb": "바알 오브",
  "Vaal Siphoner": "바알 착취기",
  "Essence of Abrasion": "마모의 에센스",
  "Essence of Alacrity": "기민성의 에센스",
  "Essence of Battle": "전투의 에센스",
  "Essence of Command": "지휘의 에센스",
  "Essence of Delirium": "섬망의 에센스",
  "Essence of Electricity": "전기의 에센스",
  "Essence of Enhancement": "강화의 에센스",
  "Essence of Flames": "화염의 에센스",
  "Essence of Grounding": "접지의 에센스",
  "Essence of Haste": "가속의 에센스",
  "Essence of Horror": "경악의 에센스",
  "Essence of Hysteria": "발작의 에센스",
  "Essence of Ice": "얼음의 에센스",
  "Essence of Insanity": "광기의 에센스",
  "Essence of Insulation": "절연의 에센스",
  "Essence of Opulence": "풍요의 에센스",
  "Essence of Ruin": "폐허의 에센스",
  "Essence of Seeking": "추구의 에센스",
  "Essence of Sorcery": "마술의 에센스",
  "Essence of Thawing": "해동의 에센스",
  "Essence of the Abyss": "심연의 에센스",
  "Essence of the Body": "육신의 에센스",
  "Essence of the Breach": "균열의 에센스",
  "Essence of the Infinite": "무한의 에센스",
  "Essence of the Mind": "정신의 에센스",
  "Greater Essence of Abrasion": "상위 마모의 에센스",
  "Greater Essence of Alacrity": "상위 기민성의 에센스",
  "Greater Essence of Battle": "상위 전투의 에센스",
  "Greater Essence of Command": "상위 지휘의 에센스",
  "Greater Essence of Electricity": "상위 전기의 에센스",
  "Greater Essence of Enhancement": "상위 강화의 에센스",
  "Greater Essence of Flames": "상위 화염의 에센스",
  "Greater Essence of Grounding": "상위 접지의 에센스",
  "Greater Essence of Haste": "상위 가속의 에센스",
  "Greater Essence of Ice": "상위 얼음의 에센스",
  "Greater Essence of Insulation": "상위 절연의 에센스",
  "Greater Essence of Opulence": "상위 풍요의 에센스",
  "Greater Essence of Ruin": "상위 폐허의 에센스",
  "Greater Essence of Seeking": "상위 추구의 에센스",
  "Greater Essence of Sorcery": "상위 마술의 에센스",
  "Greater Essence of Thawing": "상위 해동의 에센스",
  "Greater Essence of the Body": "상위 육신의 에센스",
  "Greater Essence of the Infinite": "상위 무한의 에센스",
  "Greater Essence of the Mind": "상위 정신의 에센스",
  "Lesser Essence of Abrasion": "하위 마모의 에센스",
  "Lesser Essence of Alacrity": "하위 기민성의 에센스",
  "Lesser Essence of Battle": "하위 전투의 에센스",
  "Lesser Essence of Command": "하위 지휘의 에센스",
  "Lesser Essence of Electricity": "하위 전기의 에센스",
  "Lesser Essence of Enhancement": "하위 강화의 에센스",
  "Lesser Essence of Flames": "하위 화염의 에센스",
  "Lesser Essence of Grounding": "하위 접지의 에센스",
  "Lesser Essence of Haste": "하위 가속의 에센스",
  "Lesser Essence of Ice": "하위 얼음의 에센스",
  "Lesser Essence of Insulation": "하위 절연의 에센스",
  "Lesser Essence of Opulence": "하위 풍요의 에센스",
  "Lesser Essence of Ruin": "하위 폐허의 에센스",
  "Lesser Essence of Seeking": "하위 추구의 에센스",
  "Lesser Essence of Sorcery": "하위 마술의 에센스",
  "Lesser Essence of Thawing": "하위 해동의 에센스",
  "Lesser Essence of the Body": "하위 육신의 에센스",
  "Lesser Essence of the Infinite": "하위 무한의 에센스",
  "Lesser Essence of the Mind": "하위 정신의 에센스",
  "Perfect Essence of Abrasion": "완벽한 마모의 에센스",
  "Perfect Essence of Alacrity": "완벽한 기민성의 에센스",
  "Perfect Essence of Battle": "완벽한 전투의 에센스",
  "Perfect Essence of Command": "완벽한 지휘의 에센스",
  "Perfect Essence of Electricity": "완벽한 전기의 에센스",
  "Perfect Essence of Enhancement": "완벽한 강화의 에센스",
  "Perfect Essence of Flames": "완벽한 화염의 에센스",
  "Perfect Essence of Grounding": "완벽한 접지의 에센스",
  "Perfect Essence of Haste": "완벽한 가속의 에센스",
  "Perfect Essence of Ice": "완벽한 얼음의 에센스",
  "Perfect Essence of Insulation": "완벽한 절연의 에센스",
  "Perfect Essence of Opulence": "완벽한 풍요의 에센스",
  "Perfect Essence of Ruin": "완벽한 폐허의 에센스",
  "Perfect Essence of Seeking": "완벽한 추구의 에센스",
  "Perfect Essence of Sorcery": "완벽한 마술의 에센스",
  "Perfect Essence of Thawing": "완벽한 해동의 에센스",
  "Perfect Essence of the Body": "완벽한 육신의 에센스",
  "Perfect Essence of the Infinite": "완벽한 무한의 에센스",
  "Perfect Essence of the Mind": "완벽한 정신의 에센스",
  "Call of the Shadows": "그림자의 부름",
  "Head of the King": "왕의 머리",
  "Omen of Abyssal Echoes": "심연의 메아리의 징조",
  "Omen of Amelioration": "개량의 징조",
  "Omen of Answered Prayers": "응답받은 기도의 징조",
  "Omen of Bartering": "물물교환의 징조",
  "Omen of Catalysing Exaltation": "촉진하는 찬미의 징조",
  "Omen of Chance": "기회의 징조",
  "Omen of Chaotic Effectiveness": "혼란스러운 효율의 징조",
  "Omen of Chaotic Monsters": "혼란스러운 괴물의 징조",
  "Omen of Chaotic Quantity": "혼란스러운 수량의 징조",
  "Omen of Chaotic Rarity": "혼란스러운 희귀도의 징조",
  "Omen of Dextral Annulment": "우측 소멸의 징조",
  "Omen of Dextral Crystallisation": "우측 결정화의 징조",
  "Omen of Dextral Erasure": "우측 말소의 징조",
  "Omen of Dextral Exaltation": "우측 찬미의 징조",
  "Omen of Dextral Necromancy": "우측 강령술의 징조",
  "Omen of Gambling": "도박의 징조",
  "Omen of Greater Exaltation": "상위 찬미의 징조",
  "Omen of Light": "빛의 징조",
  "Omen of Putrefaction": "부패의 징조",
  "Omen of Refreshment": "원기 회복의 징조",
  "Omen of Reinforcements": "보강의 징조",
  "Omen of Resurgence": "재기의 징조",
  "Omen of Sanctification": "축성의 징조",
  "Omen of Secret Compartments": "비밀 공간의 징조",
  "Omen of Sinistral Annulment": "좌측 소멸의 징조",
  "Omen of Sinistral Crystallisation": "좌측 결정화의 징조",
  "Omen of Sinistral Erasure": "좌측 말소의 징조",
  "Omen of Sinistral Exaltation": "좌측 찬미의 징조",
  "Omen of Sinistral Necromancy": "좌측 강령술의 징조",
  "Omen of the Ancients": "고대인의 징조",
  "Omen of the Blackblooded": "검은 피의 징조",
  "Omen of the Blessed": "축복받은 자의 징조",
  "Omen of the Hunt": "사냥의 징조",
  "Omen of the Liege": "군왕의 징조",
  "Omen of the Sovereign": "군주의 징조",
  "Omen of Whittling": "절사의 징조",
  "Raven-Touched Shard": "큰까마귀의 손길에 닿은 파편",
  "Ancient Concentrated Liquid Fear": "고대 농축된 액체 두려움",
  "Ancient Concentrated Liquid Isolation": "고대 농축된 액체 고립",
  "Ancient Concentrated Liquid Suffering": "고대 농축된 액체 고통",
  "Ancient Diluted Liquid Greed": "고대 희석된 액체 탐욕",
  "Ancient Diluted Liquid Guilt": "고대 희석된 액체 죄책감",
  "Ancient Diluted Liquid Ire": "고대 희석된 액체 진노",
  "Ancient Liquid Despair": "고대 액체 절망",
  "Ancient Liquid Disgust": "고대 액체 혐오",
  "Ancient Liquid Envy": "고대 액체 선망",
  "Ancient Liquid Paranoia": "고대 액체 집착",
  "Ancient Potent Liquid Contempt": "고대 위력적인 액체 경멸",
  "Ancient Potent Liquid Ferocity": "고대 위력적인 액체 흉포함",
  "Ancient Potent Liquid Melancholy": "고대 위력적인 액체 우울",
  "Concentrated Liquid Fear": "농축된 액체 두려움",
  "Concentrated Liquid Isolation": "농축된 액체 고립",
  "Concentrated Liquid Suffering": "농축된 액체 고통",
  "Diluted Liquid Greed": "희석된 액체 탐욕",
  "Diluted Liquid Guilt": "희석된 액체 죄책감",
  "Diluted Liquid Ire": "희석된 액체 진노",
  "Liquid Despair": "액체 절망",
  "Liquid Disgust": "액체 혐오",
  "Liquid Envy": "액체 선망",
  "Liquid Paranoia": "액체 집착",
  "Potent Liquid Contempt": "위력적인 액체 경멸",
  "Potent Liquid Ferocity": "위력적인 액체 흉포함",
  "Potent Liquid Melancholy": "위력적인 액체 우울",
  "Altered Collarbone": "뒤바뀐 빗장뼈",
  "Amanamu's Gaze": "아마나무의 응시",
  "Ancient Collarbone": "고대 빗장뼈",
  "Ancient Jawbone": "고대 턱뼈",
  "Ancient Rib": "고대 갈비뼈",
  "Gnawed Collarbone": "갉힌 빗장뼈",
  "Gnawed Jawbone": "갉힌 턱뼈",
  "Gnawed Rib": "갉힌 갈비뼈",
  "Kurgal's Gaze": "쿠르갈의 응시",
  "Preserved Collarbone": "보존된 빗장뼈",
  "Preserved Cranium": "보존된 두개골",
  "Preserved Jawbone": "보존된 턱뼈",
  "Preserved Rib": "보존된 갈비뼈",
  "Tecrod's Gaze": "테크로드의 응시",
  "Ulaman's Gaze": "울라만의 응시",
  "Ahn's Citadel": "안의 성채",
  "Ailith's Chimes": "아일리트의 종",
  "Amanamu's Tithe": "아마나무의 십일조",
  "Arakaali's Lust": "아라칼리의 욕망",
  "Arbiter's Ignition": "중재자의 점화",
  "Arbiter's Reach": "중재자의 역량",
  "Arjun's Medal": "아르준의 메달",
  "Atalui's Bloodletting": "아탈루이의 사혈",
  "Atziri's Allure": "앗지리의 매혹",
  "Atziri's Communion": "앗지리의 성찬식",
  "Atziri's Impatience": "앗지리의 조바심",
  "Bhatair's Vengeance": "바타이르의 복수",
  "Breachlord's Amalgam": "균열 군주의 융합체",
  "Breachlord's Rift": "균열 군주의 틈새",
  "Brutus' Brain": "브루투스의 두뇌",
  "Catha's Brilliance": "캐사의 광채",
  "Cirel's Cultivation": "키렐의 함양",
  "Daresso's Passion": "다레소의 열정",
  "Dialla's Desire": "디알라의 갈망",
  "Doedre's Undoing": "도이드리의 파멸",
  "Dominus' Grasp": "도미누스의 장악",
  "Einhar's Beastrite": "아인하르의 야수의식",
  "Esh's Prowess": "에쉬의 기량",
  "Esh's Radiance": "에쉬의 광휘",
  "Garukhan's Resolve": "가루칸의 투지",
  "Guatelitzi's Ablation": "과텔리치의 삭마",
  "Hayoxi's Fulmination": "하욕시의 뇌전",
  "Her Declaration": "그녀의 선언",
  "Ixchel's Torment": "익스첼의 고통",
  "Kalisa's Crescendo": "칼리사의 크레센도",
  "Kaom's Madness": "카옴의 광기",
  "Khatal's Rejuvenation": "카탈의 회춘",
  "Kulemak's Dominion": "쿨레막의 지배",
  "Kurgal's Leash": "쿠르갈의 가죽끈",
  "Medved's Felling": "메드베드의 살상",
  "Morgana's Tempest": "모르가나의 폭풍",
  "Mórrigan's Insight": "모리건의 통찰",
  "Oisín's Oath": "오이신의 서약",
  "Olroth's Conviction": "올로스의 신념",
  "Olroth's Hubris": "올로스의 오만",
  "Paquate's Pact": "파콰테의 맹약",
  "Prototype Seventeen": "프로토타입 17호",
  "Rakiata's Flow": "라키아타의 흐름",
  "Ratha's Assault": "라타의 공격",
  "Rigwald's Ferocity": "리그월드의 흉포함",
  "Romira's Requital": "로미라의 보답",
  "Seraph's Heart": "고위 천사의 심장",
  "Sione's Temper": "시온의 성미",
  "Styrn's Ferocity": "스티른의 흉포함",
  "Styrn's Mountain": "스티른의 산",
  "Tacati's Ire": "타카티의 진노",
  "Tangmazu's Thurible": "탕마주의 향로",
  "Tasalio's Rhythm": "타살리오의 리듬",
  "Tawhoa's Tending": "타호아의 보살핌",
  "Tecrod's Revenge": "테크로드의 복수",
  "Trickster's Shard": "협잡꾼의 파편",
  "Tul's Avalanche": "툴의 산사태",
  "Tul's Stillness": "툴의 고요",
  "Uhtred's Augury": "우트레드의 점술",
  "Uhtred's Constellation": "우트레드의 별자리",
  "Uhtred's Exodus": "우트레드의 탈출",
  "Uhtred's Omen": "우트레드의 징조",
  "Uhtred's Rite": "우트레드의 의례",
  "Uul-Netol's Embrace": "울네톨의 포옹",
  "Uruk's Smelting": "우루크의 제련",
  "Varashta's Blessing": "바라시타의 축복",
  "Vilenta's Propulsion": "바일렌타의 추진",
  "Vorana's Siege": "보라나의 공성",
  "Vruun's Aftermath": "브룬의 여파",
  "Vruun's Inevitability": "브룬의 필연",
  "Xibaqua's Rending": "지바콰의 분리",
  "Xoph's Pyre": "조프의 장작",
  "Zarokh's Refrain": "자로크의 절제",
  "Zarokh's Revolt": "자로크의 봉기",
  "Zerphi's Infamy": "제르피의 악명",
  "Aldur's Saga": "알두르의 영웅담",
  "Blazing Flux": "맹렬한 유동체",
  "Chilling Flux": "오싹한 유동체",
  "Crackling Flux": "치직대는 유동체",
  "Expedition Logbook": "탐험 일지",
  "Medved's Saga": "메드베드의 영웅담",
  "Olroth's Saga": "올로스의 영웅담",
  "Perfect Flux": "우자지 오브",
  "Thaumaturgic Flux (Level 8)": "마석학 유동체 (8레벨)",
  "Thaumaturgic Flux (Level 9)": "마석학 유동체 (9레벨)",
  "Thaumaturgic Flux (Level 10)": "마석학 유동체 (10레벨)",
  "Thaumaturgic Flux (Level 11)": "마석학 유동체 (11레벨)",
  "Thaumaturgic Flux (Level 12)": "마석학 유동체 (12레벨)",
  "Thaumaturgic Flux (Level 13)": "마석학 유동체 (13레벨)",
  "Thaumaturgic Flux (Level 14)": "마석학 유동체 (14레벨)",
  "Thaumaturgic Flux (Level 15)": "마석학 유동체 (15레벨)",
  "Thaumaturgic Flux (Level 16)": "마석학 유동체 (16레벨)",
  "Thaumaturgic Flux (Level 17)": "마석학 유동체 (17레벨)",
  "Thaumaturgic Flux (Level 18)": "마석학 유동체 (18레벨)",
  "Thaumaturgic Flux (Level 19)": "마석학 유동체 (19레벨)",
  "Thaumaturgic Flux (Level 20)": "마석학 유동체 (20레벨)",
  "Uhtred's Saga": "우트레드의 영웅담",
  "Void Flux": "공허 유동체",
  "Vorana's Saga": "보라나의 영웅담",
  "Adaptive Catalyst": "적응형 기폭제",
  "Breach Splinter": "균열 파편",
  "Breachstone": "균열석",
  "Carapace Catalyst": "갑각 기폭제",
  "Chayula's Catalyst": "차율라의 기폭제",
  "Esh's Catalyst": "에쉬의 기폭제",
  "Flesh Catalyst": "육체 기폭제",
  "Neural Catalyst": "신경 기폭제",
  "Reaver Catalyst": "강탈자 기폭제",
  "Refined Adaptive Catalyst": "제련된 적응형 기폭제",
  "Refined Carapace Catalyst": "제련된 갑각 기폭제",
  "Refined Chayula's Catalyst": "제련된 차율라의 기폭제",
  "Refined Esh's Catalyst": "제련된 에쉬의 기폭제",
  "Refined Flesh Catalyst": "제련된 육체 기폭제",
  "Refined Neural Catalyst": "제련된 신경 기폭제",
  "Refined Reaver Catalyst": "제련된 강탈자 기폭제",
  "Refined Sibilant Catalyst": "제련된 쇳소리 기폭제",
  "Refined Skittering Catalyst": "제련된 달리는 기폭제",
  "Refined Tul's Catalyst": "제련된 툴의 기폭제",
  "Refined Uul-Netol's Catalyst": "제련된 울네톨의 기폭제",
  "Refined Xoph's Catalyst": "제련된 조프의 기폭제",
  "Sibilant Catalyst": "쇳소리 기폭제",
  "Skittering Catalyst": "달리는 기폭제",
  "Tul's Catalyst": "툴의 기폭제",
  "Uul-Netol's Catalyst": "울네톨의 기폭제",
  "Xoph's Catalyst": "조프의 기폭제",
  "Adaptive Alloy": "적응형 합금",
  "Celestial Alloy": "천공의 합금",
  "Cyclonic Alloy": "회오리바람 합금",
  "Exceptional Verisium": "특출난 베리시움",
  "Expansive Alloy": "팽창하는 합금",
  "Medved's Crest of the Circle": "메드베드의 원 문양",
  "Mystic Alloy": "신비한 합금",
  "Olroth's Crest of the Sun": "올로스의 태양 문양",
  "Prismatic Alloy": "분광 합금",
  "Protective Alloy": "보호의 합금",
  "Revered Starlit Ore": "존경받는 별빛 광석",
  "Runic Alloy": "룬 합금",
  "Sovereign Alloy": "군왕의 합금",
  "The Runebinder's Alloy": "룬 결속사의 합금",
  "The Runefather's Alloy": "룬 아버지의 합금",
  "Transcendent Alloy": "초월의 합금",
  "Uhtred's Crest of the Chalice": "우트레드의 성배 문양",
  "Venerable Starlit Ore": "덕망 있는 별빛 광석",
  "Veridical Starlit Ore": "진실한 별빛 광석",
  "Verisium": "베리시움",
  "Vorana's Crest of the Scythe": "보라나의 낫 문양",
  "Warding Starlit Ore": "수호하는 별빛 광석",
  "Adept Rune": "숙달 룬",
  "Aldur's Legacy": "알두르의 유산",
  "Ancient Rune of Animosity": "적대감의 고대 룬",
  "Ancient Rune of Control": "통제의 고대 룬",
  "Ancient Rune of Decay": "부패의 고대 룬",
  "Ancient Rune of Detonation": "기폭의 고대 룬",
  "Ancient Rune of Discovery": "발견의 고대 룬",
  "Ancient Rune of Dueling": "결투의 고대 룬",
  "Ancient Rune of Prowess": "기량의 고대 룬",
  "Ancient Rune of Retaliation": "보복의 고대 룬",
  "Ancient Rune of Shattering": "산산조각의 고대 룬",
  "Ancient Rune of Splinters": "파편의 고대 룬",
  "Ancient Rune of the Horde": "떼의 고대 룬",
  "Ancient Rune of the Titan": "거신의 고대 룬",
  "Ancient Rune of Witchcraft": "마술의 고대 룬",
  "Astrid's Creativity": "아스트리드의 창의성",
  "Betrayal of Aldur": "알두르의 배신",
  "Body Rune": "육신 룬",
  "Breath of Aldur": "알두르의 숨결",
  "Cadigan's Epiphany": "캐디건의 통찰",
  "Charging Rune": "충전 룬",
  "Countess Seske's Rune of Archery": "세스케 백작 부인의 궁술의 룬",
  "Courtesan Mannan's Rune of Cruelty": "매춘부 마난의 잔혹의 룬",
  "Craiceann's Rune of Recovery": "크라칸의 회복의 룬",
  "Craiceann's Rune of Warding": "크라칸의 수호의 룬",
  "Desert Rune": "사막 룬",
  "Farrul's Rune of Grace": "페룰의 은총의 룬",
  "Farrul's Rune of the Chase": "페룰의 추격의 룬",
  "Farrul's Rune of the Hunt": "페룰의 사냥의 룬",
  "Fenumus' Rune of Agony": "페누무스의 괴로움의 룬",
  "Fenumus' Rune of Draining": "페누무스의 고갈의 룬",
  "Fenumus' Rune of Spinning": "페누무스의 회전의 룬",
  "Glacial Rune": "빙하 룬",
  "Greater Adept Rune": "상위 숙달 룬",
  "Greater Body Rune": "상위 육신 룬",
  "Greater Charging Rune": "상위 충전 룬",
  "Greater Desert Rune": "상위 사막 룬",
  "Greater Glacial Rune": "상위 빙하 룬",
  "Greater Inspiration Rune": "상위 영감 룬",
  "Greater Iron Rune": "상위 철 룬",
  "Greater Mind Rune": "상위 정신 룬",
  "Greater Rebirth Rune": "상위 부활 룬",
  "Greater Resolve Rune": "상위 투지 룬",
  "Greater Robust Rune": "상위 왕성 룬",
  "Greater Rune of Alacrity": "기민성의 상위 룬",
  "Greater Rune of Leadership": "통솔의 상위 룬",
  "Greater Rune of Nobility": "고결성의 상위 룬",
  "Greater Rune of Tithing": "십일조의 상위 룬",
  "Greater Stone Rune": "상위 돌 룬",
  "Greater Storm Rune": "상위 폭풍 룬",
  "Greater Vision Rune": "상위 환영 룬",
  "Greater Ward Rune": "상위 수호 룬",
  "Hedgewitch Assandra's Rune of Wisdom": "산울마녀 아산드라의 지혜의 룬",
  "Inspiration Rune": "영감 룬",
  "Ire of Aldur": "알두르의 노여움",
  "Iron Rune": "철 룬",
  "Katla's Gloom": "카틀라의 순흑",
  "Kolr's Hunt": "콜르의 사냥",
  "Lady Hestra's Rune of Winter": "헤스트라 부인의 겨울의 룬",
  "Lesser Adept Rune": "하위 숙달 룬",
  "Lesser Body Rune": "하위 육신 룬",
  "Lesser Desert Rune": "하위 사막 룬",
  "Lesser Glacial Rune": "하위 빙하 룬",
  "Lesser Inspiration Rune": "하위 영감 룬",
  "Lesser Iron Rune": "하위 철 룬",
  "Lesser Mind Rune": "하위 정신 룬",
  "Lesser Rebirth Rune": "하위 부활 룬",
  "Lesser Resolve Rune": "하위 투지 룬",
  "Lesser Robust Rune": "하위 왕성 룬",
  "Lesser Stone Rune": "하위 돌 룬",
  "Lesser Storm Rune": "하위 폭풍 룬",
  "Lesser Vision Rune": "하위 환영 룬",
  "Lesser Ward Rune": "하위 수호 룬",
  "Masterwork Rune": "일품 룬",
  "Medved's Tending": "메드베드의 보살핌",
  "Mind Rune": "정신 룬",
  "Passion of Aldur": "알두르의 열정",
  "Perfect Adept Rune": "완벽한 숙달 룬",
  "Perfect Body Rune": "완벽한 육신 룬",
  "Perfect Charging Rune": "완벽한 충전 룬",
  "Perfect Desert Rune": "완벽한 사막 룬",
  "Perfect Glacial Rune": "완벽한 빙하 룬",
  "Perfect Inspiration Rune": "완벽한 영감 룬",
  "Perfect Iron Rune": "완벽한 철 룬",
  "Perfect Mind Rune": "완벽한 정신 룬",
  "Perfect Rebirth Rune": "완벽한 부활 룬",
  "Perfect Resolve Rune": "완벽한 투지 룬",
  "Perfect Robust Rune": "완벽한 왕성한 룬",
  "Perfect Stone Rune": "완벽한 돌 룬",
  "Perfect Storm Rune": "완벽한 폭풍 룬",
  "Perfect Vision Rune": "완벽한 환영 룬",
  "Perfect Ward Rune": "완벽한 수호 룬",
  "Rebirth Rune": "부활 룬",
  "Resolve Rune": "투지 룬",
  "Robust Rune": "왕성한 룬",
  "Rune of Accumulation": "축적의 룬",
  "Rune of Acrobatics": "곡예의 룬",
  "Rune of Confrontation": "대적의 룬",
  "Rune of Consistency": "일관성의 룬",
  "Rune of Culmination": "고조의 룬",
  "Rune of Foundations": "기초의 룬",
  "Rune of Reach": "범위의 룬",
  "Rune of Renown": "명성의 룬",
  "Rune of the Blossom": "만개의 룬",
  "Rune of the Hunt": "사냥의 룬",
  "Rune of the Prism": "분광기의 룬",
  "Rune of Vital Flame": "활력 불길의 룬",
  "Rune of Vitality": "활력의 룬",
  "Saqawal's Rune of Erosion": "사카왈의 침식의 룬",
  "Saqawal's Rune of Memory": "사카왈의 기억의 룬",
  "Saqawal's Rune of the Sky": "사카왈의 하늘의 룬",
  "Serle's Triumph": "세를의 승리",
  "Stone Rune": "돌 룬",
  "Storm Rune": "폭풍 룬",
  "Thane Girt's Rune of Wildness": "테인 거트의 야생의 룬",
  "Thane Grannell's Rune of Mastery": "테인 그라넬의 숙련의 룬",
  "Thane Leld's Rune of Spring": "테인 렐드의 봄의 룬",
  "Thane Myrk's Rune of Summer": "테인 머크의 여름의 룬",
  "The Greatwolf's Rune of Claws": "위대한 늑대의 발톱의 룬",
  "The Greatwolf's Rune of Willpower": "위대한 늑대의 의지의 룬",
  "Thrud's Might": "스루드의 완력",
  "Uhtred's Sidereus": "우트레드의 성좌",
  "Vision Rune": "환영 룬",
  "Vorana's Carnage": "보라나의 학살",
  "Ward Rune": "수호 룬",
  "Warding Rune of Annihilation": "전멸의 수호하는 룬",
  "Warding Rune of Armature": "골조의 수호하는 룬",
  "Warding Rune of Bodyguards": "호위병의 수호하는 룬",
  "Warding Rune of Courage": "용기의 수호하는 룬",
  "Warding Rune of Desperation": "필사의 수호하는 룬",
  "Warding Rune of Disintegration": "분해의 수호하는 룬",
  "Warding Rune of Equinox": "지점의 수호하는 룬",
  "Warding Rune of Glancing": "튕김의 수호하는 룬",
  "Warding Rune of Heart": "심장의 수호하는 룬",
  "Warding Rune of Hollowing": "공동화의 수호하는 룬",
  "Warding Rune of Obsession": "집착의 수호하는 룬",
  "Warding Rune of Protection": "보호의 수호하는 룬",
  "Warding Rune of Reinforcement": "보강의 수호하는 룬",
  "Warding Rune of Salvaging": "분해의 수호하는 룬",
  "Warding Rune of Stability": "안정성의 수호하는 룬",
  "Warding Rune of Symbiosis": "공생의 수호하는 룬"
};

const CATEGORY_PREFIXES = ['explicit','implicit','desecrated','enchant','skill','fractured','crafted','rune'];
const CATEGORY_LABELS = {
  explicit: '비고정', implicit: '고정', desecrated: '훼손',
  enchant: '인챈트', skill: '스킬', fractured: '분열됨', crafted: '제작', rune: '룬'
};

const TRADE_REALM_POE1 = 'poe1';
const TRADE_REALM_POE2 = 'poe2';
const DEFAULT_TRADE_REALM = TRADE_REALM_POE2;
const TRADE_REALM_LABELS = {
  [TRADE_REALM_POE1]: 'POE1',
  [TRADE_REALM_POE2]: 'POE2'
};

let poe1ItemNamesKo = null;
let poe1ItemNamesKoPromise = null;
let poe1StatTextsKo = null;
let poe1StatTextsKoPromise = null;
let poe1StatTextsByNormalized = null;
let poe1ItemEffectsKo = null;
let poe1ItemEffectsKoPromise = null;
let poe1DivinationCards = null;
let poe1DivinationCardsPromise = null;

function loadPoe1ItemNamesKo() {
  if (poe1ItemNamesKo) return Promise.resolve(poe1ItemNamesKo);
  if (!poe1ItemNamesKoPromise) {
    poe1ItemNamesKoPromise = fetch(chrome.runtime.getURL('data/poe1-item-names-ko.json'))
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        poe1ItemNamesKo = data && typeof data === 'object' ? data : {};
        return poe1ItemNamesKo;
      })
      .catch(error => {
        console.warn('PoE1 아이템 번역 파일 로드 실패:', error);
        poe1ItemNamesKo = {};
        return poe1ItemNamesKo;
      });
  }
  return poe1ItemNamesKoPromise;
}

function loadPoe1StatTextsKo() {
  if (poe1StatTextsKo) return Promise.resolve(poe1StatTextsKo);
  if (!poe1StatTextsKoPromise) {
    poe1StatTextsKoPromise = fetch(chrome.runtime.getURL('data/poe1-stat-text-ko.json'))
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        poe1StatTextsKo = data && typeof data === 'object' ? data : {};
        poe1StatTextsByNormalized = null;
        return poe1StatTextsKo;
      })
      .catch(error => {
        console.warn('PoE1 옵션 번역 파일 로드 실패:', error);
        poe1StatTextsKo = {};
        return poe1StatTextsKo;
      });
  }
  return poe1StatTextsKoPromise;
}

function loadPoe1ItemEffectsKo() {
  if (poe1ItemEffectsKo) return Promise.resolve(poe1ItemEffectsKo);
  if (!poe1ItemEffectsKoPromise) {
    poe1ItemEffectsKoPromise = fetch(chrome.runtime.getURL('data/poe1-item-effects-ko.json'))
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        poe1ItemEffectsKo = data && typeof data === 'object' ? data : {};
        return poe1ItemEffectsKo;
      })
      .catch(error => {
        console.warn('PoE1 아이템 효과 파일 로드 실패:', error);
        poe1ItemEffectsKo = {};
        return poe1ItemEffectsKo;
      });
  }
  return poe1ItemEffectsKoPromise;
}

function loadPoe1DivinationCards() {
  if (poe1DivinationCards) return Promise.resolve(poe1DivinationCards);
  if (!poe1DivinationCardsPromise) {
    poe1DivinationCardsPromise = fetch(chrome.runtime.getURL('data/poe1-divination-cards.json'))
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        poe1DivinationCards = data && typeof data === 'object' ? data : {};
        return poe1DivinationCards;
      })
      .catch(error => {
        console.warn('PoE1 점술 카드 정보 파일 로드 실패:', error);
        poe1DivinationCards = {};
        return poe1DivinationCards;
      });
  }
  return poe1DivinationCardsPromise;
}
const TRADE_ENDPOINTS = {
  [TRADE_REALM_POE1]: {
    tradeBase: 'https://poe.game.daum.net/trade/search',
    apiBase: 'https://poe.game.daum.net/api/trade',
    defaultLeague: 'Standard'
  },
  [TRADE_REALM_POE2]: {
    tradeBase: 'https://poe.kakaogames.com/trade2/search/poe2',
    apiBase: 'https://poe.kakaogames.com/api/trade2',
    defaultLeague: 'Runes of Aldur'
  }
};
const DEFAULT_LEAGUE = 'Runes of Aldur';
const DEFAULT_BUILD_NAME = '기본 빌드';
const LEAGUE_ALIASES = { 'Rune of Aldur': 'Runes of Aldur', 'Hardcore Rune of Aldur': 'HC Runes of Aldur' };
const ADMIN_ACCESS_KEY = 'adminAccess';
const APP_STATE_REVISION_KEY = 'appStateRevision';
const ADMIN_KEY_HASHES = {
  work: {
    label: '회사 PC',
    hash: '39e9769ad4adfa48b46a313d1c1739c13c17e773adda72b5f648de68fee95e69'
  },
  home: {
    label: '집 PC',
    hash: '7ef8d527dd31729fcd8b6da6dd90e4703a41d5659f6746cef445fd3cceb290e4'
  }
};

let filtersByLeague = {};
let buildsByLeague = {};
let buildUiByLeague = {};
let appStateRevision = 0;
let appStatePersistQueue = Promise.resolve();
let settings = { league: DEFAULT_LEAGUE, tradeRealm: DEFAULT_TRADE_REALM, resultCount: 10, allowGlobalSidebar: false };
let adminAccess = { enabled: false, keyId: '' };
let editingId = null;
const leaguesByRealm = {
  [TRADE_REALM_POE1]: POE2TQLeagueData.getFallbackLeagues(TRADE_REALM_POE1),
  [TRADE_REALM_POE2]: POE2TQLeagueData.getFallbackLeagues(TRADE_REALM_POE2)
};
const cachedTradeItemTypeMaps = new Map();
const cachedTradeItemTypeMapPromises = new Map();

function normalizeTradeRealm(realm) {
  return realm === TRADE_REALM_POE1 ? TRADE_REALM_POE1 : TRADE_REALM_POE2;
}

function getTradeEndpoint(realm = settings.tradeRealm) {
  return TRADE_ENDPOINTS[normalizeTradeRealm(realm)] || TRADE_ENDPOINTS[DEFAULT_TRADE_REALM];
}

function getTradeLeagues(realm = settings.tradeRealm) {
  const normalizedRealm = normalizeTradeRealm(realm);
  return leaguesByRealm[normalizedRealm] || POE2TQLeagueData.getFallbackLeagues(normalizedRealm);
}

function getPreferredTradeLeague(realm = settings.tradeRealm) {
  const leagues = getTradeLeagues(realm);
  return leagues.find(league => !/^(?:standard|hardcore|ruthless|hardcore ruthless)$/i.test(league))
    || leagues.find(league => league === 'Standard')
    || leagues[0]
    || getTradeEndpoint(realm).defaultLeague;
}

function renderLeagueOptions(realm = settings.tradeRealm) {
  const select = document.getElementById('sLeague');
  if (!select) return;
  const leagues = getTradeLeagues(realm).slice();
  const currentLeague = String(settings.league || '').trim();
  if (currentLeague && !leagues.includes(currentLeague)) leagues.unshift(currentLeague);
  select.replaceChildren(...leagues.map(league => {
    const option = document.createElement('option');
    option.value = league;
    option.textContent = league;
    return option;
  }));
  select.value = currentLeague || leagues[0] || '';
  syncCustomSelectControl(select);
}

function syncCustomSelectControl(select) {
  const wrapper = select?.closest('[data-custom-select]');
  const trigger = wrapper?.querySelector('[data-custom-select-trigger]');
  const valueLabel = wrapper?.querySelector('[data-custom-select-value]');
  const menu = wrapper?.querySelector('[data-custom-select-menu]');
  if (!wrapper || !menu) return;
  wrapper.classList.toggle('is-disabled', Boolean(select.disabled));
  if (trigger) trigger.disabled = Boolean(select.disabled);
  const selectedOption = select.options[select.selectedIndex];
  if (valueLabel) valueLabel.textContent = selectedOption?.textContent || select.value || '';
  menu.replaceChildren(...Array.from(select.options).map(sourceOption => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `league-select-option${sourceOption.value === select.value ? ' is-selected' : ''}`;
    option.dataset.value = sourceOption.value;
    option.setAttribute('role', 'option');
    option.setAttribute('aria-selected', String(sourceOption.value === select.value));
    option.textContent = sourceOption.textContent;
    return option;
  }));
}

function setCustomSelectOpen(wrapper, open) {
  const trigger = wrapper?.querySelector('[data-custom-select-trigger]');
  const menu = wrapper?.querySelector('[data-custom-select-menu]');
  if (!trigger || !menu) return;
  const shouldOpen = Boolean(open);
  wrapper.classList.toggle('is-open', shouldOpen);
  const filterCard = wrapper.closest('.filter-card');
  if (filterCard) filterCard.classList.toggle('has-open-select', shouldOpen);
  menu.hidden = !shouldOpen;
  trigger.setAttribute('aria-expanded', String(shouldOpen));
  menu.classList.remove('drop-up');
  if (!shouldOpen) return;
  const triggerRect = trigger.getBoundingClientRect();
  const availableBelow = window.innerHeight - triggerRect.bottom - 8;
  const availableAbove = triggerRect.top - 8;
  if (availableBelow < Math.min(menu.scrollHeight, 210) && availableAbove > availableBelow) {
    menu.classList.add('drop-up');
  }
}

function closeCustomSelectMenus(except = null) {
  document.querySelectorAll('[data-custom-select]').forEach(wrapper => {
    if (wrapper !== except) setCustomSelectOpen(wrapper, false);
  });
}

function bindCustomSelectControls(root = document) {
  root.querySelectorAll('[data-custom-select]').forEach(wrapper => {
    const select = wrapper.querySelector('select');
    const trigger = wrapper.querySelector('[data-custom-select-trigger]');
    const menu = wrapper.querySelector('[data-custom-select-menu]');
    if (!select || !trigger || !menu || wrapper.dataset.customSelectBound) return;
    wrapper.dataset.customSelectBound = '1';
    syncCustomSelectControl(select);
    trigger.addEventListener('click', () => {
      const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
      closeCustomSelectMenus(wrapper);
      setCustomSelectOpen(wrapper, shouldOpen);
    });
    menu.addEventListener('click', event => {
      const option = event.target.closest('.league-select-option');
      if (!option) return;
      select.value = option.dataset.value || '';
      setCustomSelectOpen(wrapper, false);
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  if (document.documentElement.dataset.customSelectGlobalBound) return;
  document.documentElement.dataset.customSelectGlobalBound = '1';
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('[data-custom-select]')) closeCustomSelectMenus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeCustomSelectMenus();
  });
}

function loadTradeLeagues(realm = settings.tradeRealm, forceRefresh = false) {
  const requestedRealm = normalizeTradeRealm(realm);
  return new Promise(resolve => {
    chrome.runtime.sendMessage({
      type: 'FETCH_TRADE_LEAGUES',
      realm: requestedRealm,
      forceRefresh
    }, response => {
      if (chrome.runtime.lastError || !response?.ok || !Array.isArray(response.leagues)) {
        resolve(false);
        return;
      }
      leaguesByRealm[requestedRealm] = response.leagues.slice();
      if (normalizeTradeRealm(settings.tradeRealm) === requestedRealm) renderLeagueOptions(requestedRealm);
      resolve(true);
    });
  });
}

function getFilterTradeRealm(filter) {
  return normalizeTradeRealm(filter?.tradeRealm || settings.tradeRealm || DEFAULT_TRADE_REALM);
}

function buildTradeApiSearchUrl(realm, league) {
  const endpoint = getTradeEndpoint(realm);
  const encodedLeague = encodeURIComponent(league || endpoint.defaultLeague);
  return normalizeTradeRealm(realm) === TRADE_REALM_POE1
    ? `${endpoint.apiBase}/search/${encodedLeague}`
    : `${endpoint.apiBase}/search/poe2/${encodedLeague}`;
}

function buildTradeQueryHydrateUrl(realm, league, queryId) {
  return `${buildTradeApiSearchUrl(realm, league)}/${encodeURIComponent(queryId || '')}`;
}

function buildTradeFetchUrl(realm, itemIds, queryId) {
  const endpoint = getTradeEndpoint(realm);
  const encodedIds = (Array.isArray(itemIds) ? itemIds : [itemIds]).map(encodeURIComponent).join(',');
  const baseUrl = `${endpoint.apiBase}/fetch/${encodedIds}?query=${encodeURIComponent(queryId || '')}`;
  return normalizeTradeRealm(realm) === TRADE_REALM_POE2 ? `${baseUrl}&realm=poe2` : baseUrl;
}

function buildTradeSearchPageUrl(realm, league, queryId = '') {
  const endpoint = getTradeEndpoint(realm);
  const parts = [endpoint.tradeBase, encodeURIComponent(league || endpoint.defaultLeague)];
  if (queryId) parts.push(encodeURIComponent(queryId));
  return parts.join('/');
}

function fetchTradeJson(realm, url, options = {}) {
  if (normalizeTradeRealm(realm) !== TRADE_REALM_POE1 || window.parent === window) {
    return fetch(url, options).then(async response => {
      const payload = await response.json().catch(() => ({}));
      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText || '',
        retryAfter: response.headers.get('retry-after') || '',
        payload
      };
    });
  }

  return new Promise((resolve, reject) => {
    const requestId = `poe2tq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    const timer = setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('한국 거래소 요청 시간이 초과되었습니다'));
    }, 30000);
    function onMessage(event) {
      const data = event.data || {};
      if (data.type !== 'POE2TQ_TRADE_FETCH_RESULT' || data.requestId !== requestId) return;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      if (!data.ok) {
        reject(new Error(data.error || '한국 거래소 요청 실패'));
        return;
      }
      resolve({
        ok: !!data.responseOk,
        status: data.status || 0,
        statusText: data.statusText || '',
        retryAfter: data.retryAfter || '',
        payload: data.payload || {}
      });
    }
    window.addEventListener('message', onMessage);
    window.parent.postMessage({
      type: 'POE2TQ_TRADE_FETCH',
      requestId,
      url,
      options: {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || null
      }
    }, '*');
  });
}

function normalizeTradeItemTypeKey(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\[[^\]|]+\|([^\]]+)\]/g, '$1')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getTradeItemTypeKeyVariants(value) {
  const key = normalizeTradeItemTypeKey(value);
  if (!key) return [];
  const variants = new Set([key]);
  const parts = key.split(' ');
  const last = parts[parts.length - 1] || '';
  const replaceLast = replacement => {
    if (!replacement || replacement === last) return;
    variants.add(parts.slice(0, -1).concat(replacement).join(' '));
  };
  if (last.endsWith('ies') && last.length > 3) replaceLast(`${last.slice(0, -3)}y`);
  if (last.endsWith('ves') && last.length > 3) replaceLast(`${last.slice(0, -3)}f`);
  if (last.endsWith('es') && last.length > 2) replaceLast(last.slice(0, -2));
  if (last.endsWith('s') && last.length > 1) replaceLast(last.slice(0, -1));
  if (!last.endsWith('s')) {
    replaceLast(`${last}s`);
    if (/(?:s|x|z|ch|sh)$/.test(last)) replaceLast(`${last}es`);
    if (/[aeiou]y$/.test(last) === false && last.endsWith('y') && last.length > 1) {
      replaceLast(`${last.slice(0, -1)}ies`);
    }
  }
  return [...variants];
}

async function ensureTradeItemTypeMap(realm = settings.tradeRealm) {
  const normalizedRealm = normalizeTradeRealm(realm);
  if (cachedTradeItemTypeMaps.has(normalizedRealm)) return cachedTradeItemTypeMaps.get(normalizedRealm);
  if (cachedTradeItemTypeMapPromises.has(normalizedRealm)) return cachedTradeItemTypeMapPromises.get(normalizedRealm);

  const pending = (async () => {
    const map = new Map();
    const addItemsPayload = payload => {
      (payload?.result || []).forEach(group => {
        (group?.entries || []).forEach(entry => {
          const canonical = tradeValueToText(entry?.type || entry?.name);
          if (!canonical) return;
          [entry?.type, entry?.name, canonical].forEach(value => {
            getTradeItemTypeKeyVariants(tradeValueToText(value)).forEach(key => {
              if (key && !map.has(key)) map.set(key, canonical);
            });
          });
        });
      });
    };

    const endpoint = getTradeEndpoint(normalizedRealm);
    const res = await fetchTradeJson(normalizedRealm, `${endpoint.apiBase}/data/items`, { credentials: 'include' });
    if (res.ok) addItemsPayload(res.payload);

    if (normalizedRealm === TRADE_REALM_POE1) {
      const officialRes = await fetch('https://www.pathofexile.com/api/trade/data/items', { credentials: 'omit' })
        .then(async response => ({ ok: response.ok, status: response.status, payload: await response.json().catch(() => ({})) }))
        .catch(error => ({ ok: false, status: 0, payload: {}, error }));
      if (officialRes.ok) addItemsPayload(officialRes.payload);
    }

    if (!map.size) throw new Error(`아이템 베이스 목록 조회 실패 (HTTP ${res.status || 0})`);

    /*
      Some PoE1 item fetch payloads use historical singular base names while
      trade/data/items exposes the searchable plural name. Keep explicit
      aliases only when the canonical target is known to the trade API.
    */
    const explicitPoe1Aliases = {
      'arcane vestments': 'Arcane Vestment'
    };
    if (normalizedRealm === TRADE_REALM_POE1) {
      Object.entries(explicitPoe1Aliases).forEach(([alias, canonical]) => {
        getTradeItemTypeKeyVariants(alias).forEach(key => map.set(key, canonical));
        getTradeItemTypeKeyVariants(canonical).forEach(key => map.set(key, canonical));
      });
    }

    cachedTradeItemTypeMaps.set(normalizedRealm, map);
    return map;
  })();

  cachedTradeItemTypeMapPromises.set(normalizedRealm, pending);
  try {
    return await pending;
  } finally {
    cachedTradeItemTypeMapPromises.delete(normalizedRealm);
  }
}

function getQueryTypeFilter(queryPayload) {
  return queryPayload?.query?.filters?.type_filters?.filters?.type || null;
}

function getQueryBaseTypeText(queryPayload) {
  const typeFilter = getQueryTypeFilter(queryPayload);
  return tradeValueToText(typeFilter?.option ?? typeFilter?.input ?? queryPayload?.query?.type ?? '');
}

async function canonicalizeQueryBaseTypeOrThrow(queryPayload, realm) {
  if (normalizeTradeRealm(realm) !== TRADE_REALM_POE1) return queryPayload;
  const currentType = getQueryBaseTypeText(queryPayload);
  if (!currentType) return queryPayload;

  const itemTypes = await ensureTradeItemTypeMap(realm);
  const canonical = getTradeItemTypeKeyVariants(currentType).map(key => itemTypes.get(key)).find(Boolean);
  if (!canonical) {
    throw new Error(`PoE1 거래소 베이스 타입 목록에서 찾을 수 없습니다: "${currentType}"`);
  }

  const typeFilter = getQueryTypeFilter(queryPayload);
  if (typeFilter) {
    if (normalizeTradeRealm(realm) === TRADE_REALM_POE1) {
      delete queryPayload.query.filters.type_filters.filters.type;
      pruneEmptyTradeFilterGroups(queryPayload.query.filters);
      queryPayload.query.type = canonical;
    } else if (Object.prototype.hasOwnProperty.call(typeFilter, 'input')) typeFilter.input = canonical;
    else typeFilter.option = canonical;
  }
  if (queryPayload?.query && queryPayload.query.type) queryPayload.query.type = canonical;
  return queryPayload;
}

async function canonicalizeSavedFilterBaseType(filter, realm) {
  if (normalizeTradeRealm(realm) !== TRADE_REALM_POE1 || !filter || filter.typeLineActive === false) return false;
  const currentType = filter.canonicalTypeLine || filter.typeLine || '';
  if (!currentType) return false;
  const itemTypes = await ensureTradeItemTypeMap(realm);
  const canonical = getTradeItemTypeKeyVariants(currentType).map(key => itemTypes.get(key)).find(Boolean);
  if (!canonical) {
    throw new Error(`PoE1 거래소 베이스 타입 목록에서 찾을 수 없습니다: "${currentType}"`);
  }
  const changed = filter.canonicalTypeLine !== canonical;
  filter.canonicalTypeLine = canonical;
  return changed;
}

function getItemTypeMapDebugInfo(realm, value) {
  const map = cachedTradeItemTypeMaps.get(normalizeTradeRealm(realm));
  const key = normalizeTradeItemTypeKey(value);
  if (!map || !key) return { loaded: !!map, size: map?.size || 0, variants: getTradeItemTypeKeyVariants(value), matches: [] };
  const tokens = key.split(' ').filter(Boolean);
  const matches = [];
  for (const [candidateKey, canonical] of map.entries()) {
    const score = tokens.reduce((sum, token) => sum + (candidateKey.includes(token) ? 1 : 0), 0);
    if (score > 0) matches.push({ key: candidateKey, canonical, score });
  }
  matches.sort((a, b) => b.score - a.score || a.key.length - b.key.length || a.key.localeCompare(b.key));
  return {
    loaded: true,
    size: map.size,
    variants: getTradeItemTypeKeyVariants(value),
    matches: matches.slice(0, 20)
  };
}

function syncTradeSettingsUi() {
  settings.tradeRealm = normalizeTradeRealm(settings.tradeRealm);
  const realmSelect = document.getElementById('sTradeRealm');
  if (realmSelect) {
    realmSelect.value = settings.tradeRealm;
    syncCustomSelectControl(realmSelect);
  }
  renderLeagueOptions(settings.tradeRealm);
  const leagueInput = document.getElementById('sLeague');
  if (leagueInput) leagueInput.value = settings.league;
  const countSelect = document.getElementById('sCount');
  if (countSelect) {
    countSelect.value = String(settings.resultCount || 10);
    syncCustomSelectControl(countSelect);
  }
  const leagueBadge = document.getElementById('leagueBadge');
  if (leagueBadge) {
    leagueBadge.textContent = settings.league;
    leagueBadge.title = `${TRADE_REALM_LABELS[settings.tradeRealm]} 리그 전환`;
  }
  const directTradeLink = document.getElementById('directTradeLink');
  if (directTradeLink) directTradeLink.href = buildTradeSearchPageUrl(settings.tradeRealm, settings.league);
}

// UI 줌(zoom) — 브라우저(Whale/Chrome)별 배율 차이를 사용자가 직접 보정
const DEFAULT_UI_ZOOM = 1.25;
const MIN_UI_ZOOM = 0.8;
const MAX_UI_ZOOM = 1.6;
const clampZoom = (z) => {
  const n = parseFloat(z);
  if (!isFinite(n)) return DEFAULT_UI_ZOOM;
  return Math.min(MAX_UI_ZOOM, Math.max(MIN_UI_ZOOM, n));
};

function syncSidepanelViewportVars(z) {
  const zoom = clampZoom(z != null ? z : document.body?.style?.zoom);
  const viewportWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
  const viewportHeight = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
  const root = document.documentElement;
  root.style.setProperty('--ui-zoom', String(zoom));
  root.style.setProperty('--panel-layout-width', `${Math.max(1, Math.floor(viewportWidth / zoom))}px`);
  root.style.setProperty('--panel-layout-height', `${Math.max(320, Math.floor(viewportHeight / zoom))}px`);
}

const applyZoom = (z) => {
  const zoom = clampZoom(z);
  document.body.style.zoom = String(zoom);
  syncSidepanelViewportVars(zoom);
};
const syncZoomControls = (z) => {
  const val = clampZoom(z);
  const slider = document.getElementById('uiZoomSlider');
  const label = document.getElementById('uiZoomValue');
  if (slider) slider.value = String(val);
  if (label) label.textContent = `${Math.round(val * 100)}%`;
};

// 패널 너비 — content.js initSidebar 의 sidebarUI.width 와 동기화
const SIDEBAR_UI_KEY = 'sidebarUI';
const DEFAULT_PANEL_WIDTH = 460;
const MIN_PANEL_WIDTH = 300;
const MAX_PANEL_WIDTH = 760;
const clampPanelWidth = (w) => {
  const n = parseInt(w, 10);
  if (!isFinite(n)) return DEFAULT_PANEL_WIDTH;
  return Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, n));
};
const syncPanelWidthControls = (w) => {
  const val = clampPanelWidth(w);
  const slider = document.getElementById('panelWidthSlider');
  const label = document.getElementById('panelWidthValue');
  if (slider) slider.value = String(val);
  if (label) label.textContent = `${val}px`;
};

const SIDEBAR_WHEEL_MESSAGE = 'POE2TQ_SIDEBAR_WHEEL';
let sidepanelWheelProxyBound = false;

function normalizeWheelDelta(delta, deltaMode) {
  const n = Number(delta);
  if (!isFinite(n)) return 0;
  if (deltaMode === 1) return n * 16;
  if (deltaMode === 2) return n * Math.max(window.innerHeight || 0, 1);
  return n;
}

function isVisibleElement(el) {
  return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
}

function isScrollableY(el) {
  if (!(el instanceof Element) || !isVisibleElement(el)) return false;
  const style = window.getComputedStyle(el);
  if (!/(auto|scroll|overlay)/.test(style.overflowY)) return false;
  return el.scrollHeight > el.clientHeight + 1;
}

function canScrollY(el, deltaY) {
  if (!isScrollableY(el) || !deltaY) return false;
  const max = el.scrollHeight - el.clientHeight;
  if (max <= 1) return false;
  return deltaY < 0 ? el.scrollTop > 0 : el.scrollTop < max - 1;
}

function findFallbackWheelTarget(deltaY) {
  const selectors = [
    '.overlay.show .modal',
    '.import-modal-overlay.active .import-modal-box',
    '.top-panel.active .utility-sub-panel.active',
    '.top-panel.active .ninja-currency-list',
    '.top-panel.active .build-detail',
    '.top-panel.active .scroll-area',
    '.scroll-area'
  ];
  const candidates = selectors
    .map(selector => document.querySelector(selector))
    .filter(el => isScrollableY(el));
  return candidates.find(el => canScrollY(el, deltaY)) || candidates[0] || null;
}

function findWheelTarget(start, deltaY) {
  let el = start instanceof Element ? start : null;
  while (el && el !== document.documentElement) {
    if (canScrollY(el, deltaY)) return el;
    el = el.parentElement;
  }
  return findFallbackWheelTarget(deltaY);
}

function scrollWheelTarget(target, deltaY) {
  if (!target || !deltaY) return;
  const max = Math.max(0, target.scrollHeight - target.clientHeight);
  target.scrollTop = Math.max(0, Math.min(max, target.scrollTop + deltaY));
}

function bindSidepanelWheelProxy() {
  if (sidepanelWheelProxyBound) return;
  sidepanelWheelProxyBound = true;

  document.addEventListener('wheel', e => {
    if (e.ctrlKey || e.defaultPrevented) return;
    const deltaY = normalizeWheelDelta(e.deltaY, e.deltaMode);
    if (!deltaY) return;
    e.preventDefault();
    e.stopPropagation();
    scrollWheelTarget(findWheelTarget(e.target, deltaY), deltaY);
  }, { passive: false });

  window.addEventListener('message', event => {
    const data = event.data;
    if (data?.type === 'POE2TQ_NINJA_TOOLTIP_HOVER' && event.source === window.parent) {
      if (data.hovering) cancelNinjaTooltipHide();
      else scheduleNinjaTooltipHide();
      return;
    }
    if (!data || data.type !== SIDEBAR_WHEEL_MESSAGE) return;
    const deltaY = normalizeWheelDelta(data.deltaY, data.deltaMode);
    if (!deltaY) return;
    scrollWheelTarget(findWheelTarget(document.activeElement || document.body, deltaY), deltaY);
  });
}
let buildSectionCollapsed = true;
let jewelSubFilter = 'all';

const JEWEL_SUB_TYPES = [
  { key: 'all', label: '전체' },
  { key: 'timeless', label: '의식' },
  { key: 'abyss', label: '심연' },
  { key: 'tainted', label: '방사능' },
  { key: 'warden', label: '감독관' },
  { key: 'expedition', label: '탐험' },
  { key: 'sanctum', label: '사원' },
  { key: 'fractured', label: '균열' },
  { key: 'phantom', label: '환영' },
];

function getFilterSearchText(f) {
  const stats = (f?.stats || []).map(stat => [
    stat?.label,
    stat?.id,
    stat?.fallbackId
  ].filter(Boolean).join(' ')).join(' ');
  const equipment = (f?.equipment || []).map(entry => [
    entry?.label,
    entry?.id
  ].filter(Boolean).join(' ')).join(' ');
  return [
    f?.category,
    f?.typeLine,
    f?.name,
    f?.itemName,
    f?.note,
    stats,
    equipment
  ].filter(Boolean).join(' ').toLowerCase();
}

function getJewelSubType(f) {
  const s = getFilterSearchText(f);
  if (s.includes('timeless') || s.includes('ritual') || s.includes('의식')) return 'timeless';
  if (s.includes('abyss') || s.includes('심연')) return 'abyss';
  if (s.includes('tainted') || s.includes('방사능')) return 'tainted';
  if (s.includes('warden') || s.includes('감독관')) return 'warden';
  if (s.includes('expedition') || s.includes('탐험')) return 'expedition';
  if (s.includes('sanctum') || s.includes('사원')) return 'sanctum';
  if (s.includes('fractured') || s.includes('breach') || s.includes('균열')) return 'fractured';
  if (s.includes('phantom') || s.includes('delirium') || s.includes('환영')) return 'phantom';
  return 'base';
}

function getPreferredMandatoryTabKey(f) {
  return POE2TQTradeCompat.getPreferredBuildTabKey(f, f?.tradeRealm || settings.tradeRealm);
}

function getRealmLeagueStorageKey(realm = settings.tradeRealm, league = settings.league) {
  return POE2TQTradeCompat.makeRealmLeagueKey(normalizeTradeRealm(realm), league);
}

function resolveRealmLeagueStorageKey(leagueOrKey = settings.league, realm = settings.tradeRealm) {
  return POE2TQTradeCompat.parseRealmLeagueKey(leagueOrKey)
    ? String(leagueOrKey)
    : getRealmLeagueStorageKey(realm, leagueOrKey);
}

const getCurrentFilters = () => filtersByLeague[getRealmLeagueStorageKey()] || [];
const setCurrentFilters = (arr) => { filtersByLeague[getRealmLeagueStorageKey()] = arr; };
const getCurrentBuilds = () => buildsByLeague[getRealmLeagueStorageKey()] || [];
const setCurrentBuilds = (arr) => { buildsByLeague[getRealmLeagueStorageKey()] = arr; };
const getCurrentBuildUi = () => {
  const storageKey = getRealmLeagueStorageKey();
  if (!buildUiByLeague[storageKey]) buildUiByLeague[storageKey] = {};
  return buildUiByLeague[storageKey];
};

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function makeBuildTab(name, type, key) {
  return {
    id: makeId(type || 'tab'),
    key: key || '',
    name,
    type: type || 'custom',
    filterIds: []
  };
}

function getMandatoryBuildTabSpecs(realm = settings.tradeRealm) {
  return normalizeTradeRealm(realm) === TRADE_REALM_POE1
    ? [
        { key: 'equipment', name: '장비', type: 'equipment' },
        { key: 'map', name: '지도', type: 'map' },
        { key: 'contract', name: '계약', type: 'contract' }
      ]
    : [
        { key: 'equipment', name: '장비', type: 'equipment' },
        { key: 'slate', name: '서판', type: 'slate' }
      ];
}

function isMandatoryBuildTab(tab, realm = settings.tradeRealm) {
  return getMandatoryBuildTabSpecs(realm).some(spec => tab?.key === spec.key || tab?.type === spec.type);
}

function makeBuild(name, realm = settings.tradeRealm) {
  const tabs = getMandatoryBuildTabSpecs(realm).map(spec => makeBuildTab(spec.name, spec.type, spec.key));
  return {
    id: makeId('build'),
    name: name || `새 빌드 ${getCurrentBuilds().length + 1}`,
    tabs,
    activeTabId: tabs[0].id,
    savedAt: new Date().toISOString()
  };
}

function normalizeBuildTab(tab, idx) {
  if (!tab || typeof tab !== 'object') return null;
  const knownKeys = new Set(['equipment', 'slate', 'map', 'contract']);
  const type = tab.type || (knownKeys.has(tab.key) ? tab.key : 'custom');
  const key = tab.key || (knownKeys.has(type) ? type : '');
  const defaultNames = { equipment: '장비', slate: '서판', map: '지도', contract: '계약' };
  return {
    id: tab.id || makeId(type || `tab${idx}`),
    key,
    type,
    name: String(tab.name || defaultNames[key] || `탭 ${idx + 1}`),
    filterIds: Array.from(new Set(Array.isArray(tab.filterIds) ? tab.filterIds.map(String) : []))
  };
}

function normalizeBuild(build, idx, realm = settings.tradeRealm) {
  if (!build || typeof build !== 'object') return null;
  let tabs = Array.isArray(build.tabs) ? build.tabs.map(normalizeBuildTab).filter(Boolean) : [];

  const ensureMandatory = (key, name, type) => {
    let found = tabs.find(tab => tab.key === key || tab.type === type);
    if (!found) {
      found = makeBuildTab(name, type, key);
      tabs.push(found);
    } else {
      found.key = key;
      found.type = type;
      if (!found.name) found.name = name;
    }
    return found;
  };

  const specs = getMandatoryBuildTabSpecs(realm);
  const retiredTabs = normalizeTradeRealm(realm) === TRADE_REALM_POE1
    ? tabs.filter(tab => tab.key === 'slate' || tab.type === 'slate')
    : [];
  const mandatoryTabs = specs.map(spec => ensureMandatory(spec.key, spec.name, spec.type));
  if (retiredTabs.length) {
    const equipmentTab = mandatoryTabs.find(tab => tab.key === 'equipment');
    equipmentTab.filterIds = Array.from(new Set([
      ...(equipmentTab.filterIds || []),
      ...retiredTabs.flatMap(tab => tab.filterIds || [])
    ].map(String)));
  }
  const mandatoryIds = new Set(mandatoryTabs.map(tab => tab.id));
  const retiredIds = new Set(retiredTabs.map(tab => tab.id));
  const customTabs = tabs.filter(tab => !mandatoryIds.has(tab.id) && !retiredIds.has(tab.id));
  tabs = mandatoryTabs.concat(customTabs);

  const activeTabId = tabs.some(tab => tab.id === build.activeTabId) ? build.activeTabId : tabs[0].id;

  return {
    id: build.id || makeId(`build${idx}`),
    name: String(build.name || `빌드 ${idx + 1}`),
    tabs,
    activeTabId,
    savedAt: build.savedAt || new Date().toISOString()
  };
}

function ensureBuildDataForLeague(league) {
  const storageKey = resolveRealmLeagueStorageKey(league);
  const realm = POE2TQTradeCompat.parseRealmLeagueKey(storageKey)?.realm || settings.tradeRealm;
  const filters = filtersByLeague[storageKey] || [];
  const ui = buildUiByLeague[storageKey] || (buildUiByLeague[storageKey] = {});
  let builds = (buildsByLeague[storageKey] || []).map((build, idx) => normalizeBuild(build, idx, realm)).filter(Boolean);
  let changed = false;

  if (!builds.length) {
    const baseBuild = makeBuild(DEFAULT_BUILD_NAME, realm);
    builds = [baseBuild];
    changed = true;
  }

  const firstBuild = builds[0];
  const firstTab = firstBuild.tabs[0];
  const seenIds = new Set();
  [...builds].reverse().forEach(build => {
    build.tabs.forEach(tab => {
      const before = (tab.filterIds || []).length;
      tab.filterIds = (tab.filterIds || []).filter(id => {
        const key = String(id);
        if (seenIds.has(key)) return false;
        seenIds.add(key);
        return true;
      });
      if (tab.filterIds.length !== before) changed = true;
    });
  });
  const assigned = new Set();
  builds.forEach(build => {
    if (!build.tabs.some(tab => tab.id === build.activeTabId)) {
      build.activeTabId = build.tabs[0]?.id || '';
      changed = true;
    }
    build.tabs.forEach(tab => {
      tab.filterIds = Array.from(new Set((tab.filterIds || []).map(String)));
      tab.filterIds.forEach(id => assigned.add(String(id)));
    });
  });

  filters.forEach(filter => {
    const filterId = String(filter.id);
    if (!assigned.has(filterId)) {
      firstTab.filterIds.push(filterId);
      assigned.add(filterId);
      changed = true;
    }
  });

  const filterById = new Map(filters.map(filter => [String(filter.id), filter]));
  builds.forEach(build => {
    const mandatoryKeys = new Set(getMandatoryBuildTabSpecs(realm).map(spec => spec.key));
    const mandatoryTabs = new Map(build.tabs.filter(tab => mandatoryKeys.has(tab.key)).map(tab => [tab.key, tab]));
    mandatoryTabs.forEach((tab, tabKey) => {
      [...(tab.filterIds || [])].forEach(filterId => {
        const filter = filterById.get(String(filterId));
        const preferredKey = getPreferredMandatoryTabKey(filter);
        if (!preferredKey || preferredKey === tabKey) return;
        const targetTab = mandatoryTabs.get(preferredKey);
        if (!targetTab) return;
        tab.filterIds = tab.filterIds.filter(id => String(id) !== String(filterId));
        if (!targetTab.filterIds.some(id => String(id) === String(filterId))) {
          targetTab.filterIds.push(String(filterId));
        }
        changed = true;
      });
    });
  });

  if (!ui.selectedBuildId || !builds.some(build => build.id === ui.selectedBuildId)) {
    ui.selectedBuildId = builds[0].id;
    changed = true;
  }

  const selectedBuild = builds.find(build => build.id === ui.selectedBuildId) || builds[0];
  if (selectedBuild && !selectedBuild.tabs.some(tab => tab.id === selectedBuild.activeTabId)) {
    selectedBuild.activeTabId = selectedBuild.tabs[0]?.id || '';
    changed = true;
  }

  buildsByLeague[storageKey] = builds;
  buildUiByLeague[storageKey] = ui;
  return changed;
}

function buildQuerySignature(filter) {
  return JSON.stringify({
    tradeRealm: normalizeTradeRealm(filter.tradeRealm),
    category: filter.category || '',
    rarity: filter.rarity || '',
    itemName: filter.rarity === 'unique' ? (filter.itemName || '') : '',
    typeLine: filter.typeLineActive === false ? '' : (filter.canonicalTypeLine || filter.typeLine || ''),
    tradeStatusOption: filter.tradeStatusOption || '',
    tradeSaleTypeActive: filter.tradeSaleTypeActive === false ? false : true,
    tradeSaleTypeOption: filter.tradeSaleTypeOption || '',
    tradeQueryTemplateHash: filter.tradeQueryTemplate ? simpleHash(JSON.stringify(filter.tradeQueryTemplate)) : '',
    ilvlMin: Number(filter.ilvlMin) || 0,
    ilvlMax: Number(filter.ilvlMax) || 0,
    areaLvlMin: Number(filter.areaLvlMin) || 0,
    equipment: (filter.equipment || [])
      .filter(x => x.active !== false && x.id)
      .map(x => `${x.id}:${numberOrNull(x.min) ?? ''}:${numberOrNull(x.max) ?? ''}`)
      .sort(),
    queryFilters: (filter.queryFilters || [])
      .filter(x => x.active !== false && x.id && x.group)
      .map(x => `${x.group}:${x.id}:${x.textKey || ''}:${x.textValue || ''}:${numberOrNull(x.min) ?? ''}:${numberOrNull(x.max) ?? ''}:${x.noValue === true ? 'flag' : ''}`)
      .sort(),
    stats: (filter.stats || [])
      .filter(x => x.active !== false && x.id)
      .map(x => {
        const min = numberOrNull(x.min);
        const max = numberOrNull(x.max);
        return x.noValue || (min == null && max == null) ? `${x.id}:flag` : `${x.id}:${min ?? ''}:${max ?? ''}`;
      })
      .sort()
  });
}

function updateFilterSourceHash(filter) {
  filter.sourceHash = simpleHash(buildQuerySignature(filter));
}

function roundFilterNumber(value) {
  const num = Number(value);
  if (!isFinite(num)) return 0;
  return Math.abs(num) % 1 === 0 ? Math.abs(num) : Number(Math.abs(num).toFixed(2));
}

function numberOrNull(value) {
  if (value == null || value === '') return null;
  const num = Number(value);
  return isFinite(num) ? num : null;
}

function cloneJsonSafe(value) {
  try {
    return value == null ? null : JSON.parse(JSON.stringify(value));
  } catch {
    return null;
  }
}

function appendSidepanelDebugLog(entry) {
  chrome.runtime.sendMessage({ type: 'APPEND_DEBUG_LOG', entry }).catch(() => {});
}

function serializeDebugError(error) {
  if (!error) return { message: '' };
  if (typeof error === 'string') return { message: error };
  return {
    name: error.name || '',
    message: error.message || String(error),
    stack: error.stack || ''
  };
}

function getSidepanelDebugContext() {
  let version = '';
  try {
    version = chrome.runtime.getManifest().version || '';
  } catch (_) {}
  return {
    extensionVersion: version,
    url: location.href,
    readyState: document.readyState,
    userAgent: navigator.userAgent
  };
}

function formatDebugLogEntry(entry, idx) {
  return [
    `===== LOG ${idx + 1} =====`,
    `loggedAt: ${entry.loggedAt || ''}`,
    `kind: ${entry.kind || ''}`,
    JSON.stringify(entry, null, 2),
    ''
  ].join('\n');
}

function makeSearchDiagnosticText(error, filter, query, context) {
  const diagnostic = {
    generatedAt: new Date().toISOString(),
    message: error?.message || '',
    status: error?.status || 0,
    realm: context?.realm || '',
    league: context?.league || '',
    querySource: context?.querySource || '',
    submittedBaseType: getQueryBaseTypeText(query),
    filterBaseType: filter?.typeLine || '',
    canonicalTypeLine: filter?.canonicalTypeLine || '',
    itemName: filter?.itemName || '',
    category: filter?.category || '',
    rarity: filter?.rarity || '',
    responsePayload: error?.payload || null,
    itemTypeMap: getItemTypeMapDebugInfo(context?.realm, getQueryBaseTypeText(query) || filter?.typeLine || ''),
    querySummary: query?.query ? summarizeTradeQueryForDebug(query.query) : null,
    query,
    filterSummary: summarizeFilterForDebug(filter)
  };
  return JSON.stringify(diagnostic, null, 2);
}

function renderSearchError(rd, error, filter, query, context) {
  const diagnosticText = makeSearchDiagnosticText(error, filter, query, context);
  rd.innerHTML = `
    <div class="result-area">
      <div class="result-error">⚠️ ${esc(error?.message || '검색 실패')}</div>
      <button class="btn-full btn-muted btn-copy-search-debug" type="button">진단 정보 복사</button>
      <pre class="debug-preview" style="display:block;max-height:160px;margin-top:6px">${esc(diagnosticText)}</pre>
    </div>
  `;
  rd.querySelector('.btn-copy-search-debug')?.addEventListener('click', async event => {
    await copyTextToClipboard(diagnosticText);
    event.currentTarget.textContent = '복사됨';
    setTimeout(() => { event.currentTarget.textContent = '진단 정보 복사'; }, 1000);
  });
}

function isUnknownItemBaseTypeError(error) {
  const message = String(error?.message || error?.payload?.error?.message || '').toLowerCase();
  return message.includes('unknown item base type');
}

function isBaseTypeRejectedTradeError(error) {
  const message = String(error?.message || error?.payload?.error?.message || '').toLowerCase();
  return isUnknownItemBaseTypeError(error)
    || (Number(error?.status) === 400 && message === 'invalid query');
}

function shouldRunExactBasePostFilterFallback(error, realm, queryPayload) {
  return normalizeTradeRealm(realm) === TRADE_REALM_POE1
    && isBaseTypeRejectedTradeError(error)
    && !!getQueryBaseTypeText(queryPayload);
}

function buildBaseTypePostFilterQuery(queryPayload) {
  const fallbackQuery = cloneJsonSafe(queryPayload);
  const requestedBaseType = getQueryBaseTypeText(queryPayload);
  if (!fallbackQuery?.query) return { query: fallbackQuery, requestedBaseType };

  delete fallbackQuery.query.type;
  const typeFilters = fallbackQuery.query.filters?.type_filters?.filters;
  if (typeFilters?.type) delete typeFilters.type;
  pruneEmptyTradeFilterGroups(fallbackQuery.query.filters);
  return { query: fallbackQuery, requestedBaseType };
}

function getTradeResultBaseTypeText(result) {
  const item = result?.item || {};
  return tradeValueToText(item.baseType || item.typeLine || item.name || '');
}

function isExactBaseTypeResult(result, requestedBaseType) {
  const requestedKey = normalizeTradeItemTypeKey(requestedBaseType);
  if (!requestedKey) return false;
  const candidates = [
    result?.item?.baseType,
    result?.item?.typeLine
  ];
  return candidates.some(value => normalizeTradeItemTypeKey(tradeValueToText(value)) === requestedKey);
}

function getTradeResultName(result) {
  const item = result?.item || {};
  const name = tradeValueToText(item.name || '');
  const typeLine = tradeValueToText(item.typeLine || item.baseType || '');
  if (name && typeLine && name !== typeLine) return `${name} ${typeLine}`;
  return name || typeLine || 'Unknown item';
}

function getListingPriceText(listing) {
  const price = listing?.price;
  if (!price) return '가격 없음';
  const amount = price.amount != null ? price.amount : '';
  const currency = currencyLabel(price.currency || '');
  return `${amount} ${currency}`.trim();
}

function getListingSellerText(listing) {
  return listing?.account?.name || listing?.account?.lastCharacterName || '';
}

function makeExactBasePostFilterDiagnosticText(context) {
  return JSON.stringify({
    generatedAt: new Date().toISOString(),
    message: 'PoE1 API rejected an exact base type, so results were post-filtered by fetched item base type.',
    realm: context.realm,
    league: context.league,
    requestedBaseType: context.requestedBaseType,
    rejectedStatus: context.originalError?.status || 0,
    rejectedPayload: context.originalError?.payload || null,
    broadQueryId: context.searchData?.id || '',
    broadTotal: context.searchData?.total || 0,
    inspectedIds: context.inspectedIds || 0,
    fetchedResults: context.fetchedResults || 0,
    exactResults: context.exactResults || 0,
    fallbackQuerySummary: context.fallbackQuery?.query ? summarizeTradeQueryForDebug(context.fallbackQuery.query) : null,
    fallbackQuery: context.fallbackQuery,
    originalQuery: context.originalQuery
  }, null, 2);
}

function renderExactBasePostFilterResults(rd, context) {
  const diagnosticText = makeExactBasePostFilterDiagnosticText(context);
  const results = Array.isArray(context.results) ? context.results : [];
  const visibleCount = Math.max(1, Number(settings.resultCount) || 10);
  const visibleResults = results.slice(0, visibleCount);
  const broadUrl = buildTradeSearchPageUrl(context.realm, context.league, context.searchData?.id || '');
  const rows = visibleResults.map((result, idx) => {
    const seller = getListingSellerText(result.listing);
    const whisper = result.listing?.whisper || '';
    const baseType = getTradeResultBaseTypeText(result);
    const whisperButton = whisper
      ? `<button class="result-trade-link btn-copy-whisper" type="button" data-idx="${idx}">귓속말 복사</button>`
      : '';
    return `
      <div class="result-item">
        <div class="result-item-left">
          <div class="result-item-name">${esc(getTradeResultName(result))}</div>
          <div class="result-age">${esc(baseType)}${seller ? ` · ${esc(seller)}` : ''}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
          <div class="result-price">${esc(getListingPriceText(result.listing))}</div>
          ${whisperButton}
        </div>
      </div>
    `;
  }).join('');
  const emptyHtml = results.length
    ? ''
    : `<div class="result-empty">넓은 검색 ${Number(context.inspectedIds || 0).toLocaleString()}개 확인 결과, "${esc(context.requestedBaseType)}" 베이스가 없습니다.</div>`;
  rd.innerHTML = `
    <div class="result-area">
      <div class="result-header-row">
        <div class="result-count">정확 베이스 ${results.length.toLocaleString()}개 / 확인 ${Number(context.inspectedIds || 0).toLocaleString()}개</div>
        <a class="result-trade-link" href="${esc(broadUrl)}" target="_blank">넓은 검색 열기</a>
      </div>
      ${rows}
      ${emptyHtml}
      <button class="btn-full btn-muted btn-copy-search-debug" type="button">진단 정보 복사</button>
      <pre class="debug-preview" style="display:block;max-height:120px;margin-top:6px">${esc(diagnosticText)}</pre>
    </div>
  `;
  rd.querySelector('.btn-copy-search-debug')?.addEventListener('click', async event => {
    await copyTextToClipboard(diagnosticText);
    event.currentTarget.textContent = '복사됨';
    setTimeout(() => { event.currentTarget.textContent = '진단 정보 복사'; }, 1000);
  });
  rd.querySelectorAll('.btn-copy-whisper').forEach(button => {
    button.addEventListener('click', async event => {
      const idx = Number(event.currentTarget.dataset.idx);
      const whisper = visibleResults[idx]?.listing?.whisper || '';
      if (!whisper) return;
      await copyTextToClipboard(whisper);
      event.currentTarget.textContent = '복사됨';
      setTimeout(() => { event.currentTarget.textContent = '귓속말 복사'; }, 1000);
    });
  });
}

async function runExactBasePostFilterSearch({ realm, league, filter, query, originalError, querySource, rd }) {
  const { query: fallbackQuery, requestedBaseType } = buildBaseTypePostFilterQuery(query);
  if (!fallbackQuery || !requestedBaseType) throw originalError;

  appendSidepanelDebugLog({
    kind: 'poe1-exact-base-post-filter-start',
    realm,
    league,
    filterId: filter.id,
    filterName: filter.name,
    requestedBaseType,
    rejectedStatus: originalError.status || 0,
    rejectedPayload: originalError.payload || null,
    fallbackQuerySummary: summarizeTradeQueryForDebug(fallbackQuery.query),
    fallbackQuery
  });

  const searchData = await postTradeSearch(realm, league, fallbackQuery);
  if (!searchData.id) throw new Error('검색 ID를 받지 못했습니다');

  const allIds = Array.isArray(searchData.result) ? searchData.result : [];
  const inspectLimit = Math.min(allIds.length, Math.max(60, Number(settings.resultCount || 10) * 10, 120));
  const idsToInspect = allIds.slice(0, inspectLimit);
  const fetchedResults = [];
  for (let offset = 0; offset < idsToInspect.length; offset += 20) {
    const chunk = idsToInspect.slice(offset, offset + 20);
    const fetchRes = await fetchTradeJson(realm, buildTradeFetchUrl(realm, chunk, searchData.id), { credentials: 'include' });
    if (!fetchRes.ok) {
      const error = new Error(fetchRes.payload?.error?.message || `HTTP ${fetchRes.status}`);
      error.status = fetchRes.status;
      error.payload = fetchRes.payload;
      throw error;
    }
    fetchedResults.push(...(fetchRes.payload?.result || []));
  }

  const exactResults = fetchedResults.filter(result => isExactBaseTypeResult(result, requestedBaseType));
  if (exactResults.length) {
    const context = buildSearchEvaluationContext(filter, exactResults, exactResults.map(result => result?.id).filter(Boolean));
    await persistSearchEvaluationContext(searchData.id, context);
  }

  const renderContext = {
    realm,
    league,
    filter,
    requestedBaseType,
    originalError,
    originalQuery: query,
    fallbackQuery,
    searchData,
    inspectedIds: idsToInspect.length,
    fetchedResults: fetchedResults.length,
    exactResults: exactResults.length,
    results: exactResults
  };
  appendSidepanelDebugLog({
    kind: 'poe1-exact-base-post-filter-result',
    realm,
    league,
    filterId: filter.id,
    filterName: filter.name,
    querySource,
    requestedBaseType,
    broadQueryId: searchData.id,
    broadTotal: searchData.total || 0,
    inspectedIds: idsToInspect.length,
    fetchedResults: fetchedResults.length,
    exactResults: exactResults.length,
    sampleBaseTypes: fetchedResults.slice(0, 20).map(getTradeResultBaseTypeText)
  });
  renderExactBasePostFilterResults(rd, renderContext);
}

const QUERY_FILTER_EXCLUDE_KEYS = {
  type_filters: new Set(['category', 'rarity', 'type']),
  trade_filters: new Set(['sale_type']),
  misc_filters: new Set(['ilvl', 'area_level', 'req_level'])
};
const EQUIPMENT_QUERY_FILTER_GROUPS = new Set(['equipment_filters', 'weapon_filters', 'armour_filters', 'socket_filters']);

function shouldSkipSavedTradeQueryFilter(groupName, id) {
  if (!groupName || !id) return true;
  if (EQUIPMENT_QUERY_FILTER_GROUPS.has(groupName)) return true;
  const excludeSet = QUERY_FILTER_EXCLUDE_KEYS[groupName];
  return !!(excludeSet && excludeSet.has(id));
}

function formatTradeQueryFilterGroupLabel(groupName) {
  const labels = {
    type_filters: '유형',
    trade_filters: '거래',
    misc_filters: '기타',
    map_filters: '경로석'
  };
  return labels[groupName] || String(groupName || '').replace(/_filters$/, '').replace(/_/g, ' ');
}

function formatTradeQueryFilterId(id) {
  return String(id || '')
    .replace(/^map_/, '')
    .replace(/^waystone_/, '')
    .replace(/_/g, ' ')
    .replace(/\biiq\b/gi, 'item quantity')
    .replace(/\biir\b/gi, 'item rarity')
    .replace(/\bpacksize\b/gi, 'pack size')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSavedTradeQueryFilterLabel(groupName, id, queryFilter) {
  const explicitLabel = stripTradeTags(queryFilter?.label || queryFilter?.name || queryFilter?.text || '');
  if (explicitLabel) return explicitLabel;
  return formatTradeQueryFilterId(id) || `${groupName}.${id}`;
}

function collectSavedTradeQueryFilters(queryFilters) {
  const savedFilters = [];
  Object.entries(queryFilters || {}).forEach(([groupName, group]) => {
    const filters = group?.filters;
    if (!filters || typeof filters !== 'object') return;
    Object.keys(filters).forEach(id => {
      const queryFilter = filters[id];
      if (!queryFilter || queryFilter.disabled === true || shouldSkipSavedTradeQueryFilter(groupName, id)) return;
      const valueSource = queryFilter?.value && typeof queryFilter.value === 'object' ? queryFilter.value : queryFilter;
      const min = numberOrNull(valueSource?.min);
      const max = numberOrNull(valueSource?.max);
      const textKey = queryFilter?.input != null ? 'input' : (queryFilter?.option != null ? 'option' : '');
      const textValue = textKey ? String(queryFilter[textKey] || '') : '';
      savedFilters.push({
        group: groupName,
        id,
        label: buildSavedTradeQueryFilterLabel(groupName, id, queryFilter),
        value: min != null ? min : null,
        min,
        max,
        textKey,
        textValue,
        noValue: min == null && max == null && !textValue,
        active: true
      });
    });
  });
  return savedFilters;
}

async function getDebugLogText(extraText = '') {
  const res = await chrome.runtime.sendMessage({ type: 'GET_DEBUG_LOGS' }).catch(() => null);
  const logs = Array.isArray(res?.logs) ? res.logs : [];
  const sections = logs.map(formatDebugLogEntry);
  const context = getSidepanelDebugContext();
  const header = [
    '===== ENV =====',
    `exportedAt: ${new Date().toISOString()}`,
    `extensionVersion: ${context.extensionVersion}`,
    `url: ${context.url}`,
    `readyState: ${context.readyState}`,
    `userAgent: ${context.userAgent}`
  ].join('\n');
  const body = sections.length ? sections.join('\n') : 'No debug logs.';
  return [extraText, header, body].filter(Boolean).join('\n\n');
}

async function getErrorLogText(extraText = '') {
  const res = await chrome.runtime.sendMessage({ type: 'GET_ERROR_LOGS' }).catch(() => null);
  const logs = Array.isArray(res?.logs) ? res.logs : [];
  const sections = logs.map(formatDebugLogEntry);
  const context = getSidepanelDebugContext();
  const header = [
    '===== ENV =====',
    `exportedAt: ${new Date().toISOString()}`,
    `extensionVersion: ${context.extensionVersion}`,
    `url: ${context.url}`,
    `readyState: ${context.readyState}`,
    `userAgent: ${context.userAgent}`
  ].join('\n');
  const body = sections.length ? sections.join('\n') : 'No error logs.';
  return [extraText, header, body].filter(Boolean).join('\n\n');
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
  }
  fallbackCopyText(text);
  return Promise.resolve();
}

function getInitErrorText(error) {
  const serialized = serializeDebugError(error);
  const context = getSidepanelDebugContext();
  return [
    'PoE2 Trade Quick 사이드패널 초기화 오류',
    `version: ${context.extensionVersion}`,
    `url: ${context.url}`,
    `readyState: ${context.readyState}`,
    `message: ${serialized.message || ''}`,
    serialized.stack ? `stack:\n${serialized.stack}` : ''
  ].filter(Boolean).join('\n');
}

async function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: filename
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

async function showErrorPreview() {
  const box = document.getElementById('debugLogPreview');
  if (!box) return;
  const res = await chrome.runtime.sendMessage({ type: 'GET_ERROR_LOGS' }).catch(() => null);
  const logs = Array.isArray(res?.logs) ? res.logs : [];
  if (!logs.length) {
    box.hidden = false;
    box.textContent = '저장된 에러 로그가 없습니다.';
    return;
  }
  const recentLogs = logs.slice(-8);
  const firstNumber = logs.length - recentLogs.length + 1;
  const recent = recentLogs.map((entry, idx) => {
    const errorMessage = entry.error?.message ? `\nerror: ${entry.error.message}` : '';
    const phase = entry.phase ? `\nphase: ${entry.phase}` : '';
    return [
      `#${firstNumber + idx} ${entry.loggedAt || ''}`,
      `kind: ${entry.kind || ''}${phase}${errorMessage}`
    ].join('\n');
  });
  box.hidden = false;
  box.textContent = recent.join('\n\n');
}

function handleSidepanelInitError(error) {
  const serialized = serializeDebugError(error);
  const errorText = getInitErrorText(error);
  appendSidepanelDebugLog({
    kind: 'sidepanel-init-error',
    error: serialized,
    context: getSidepanelDebugContext()
  });

  document.body.innerHTML = `
    <div class="fatal-error-page">
      <div class="fatal-error-box">
        <div class="fatal-error-title">PoE2 Trade Quick 초기화 오류</div>
        <div class="fatal-error-desc">사이드바를 불러오는 중 오류가 발생했습니다. 아래 로그를 복사해서 전달해 주세요.</div>
        <pre class="fatal-error-text">${esc(errorText)}</pre>
        <div class="fatal-error-actions">
          <button type="button" id="fatalCopy">전체 로그 복사</button>
          <button type="button" id="fatalDownload">TXT 저장</button>
          <button type="button" id="fatalReload">다시 시도</button>
        </div>
      </div>
    </div>`;

  document.getElementById('fatalCopy')?.addEventListener('click', async e => {
    const text = await getErrorLogText(errorText);
    await copyTextToClipboard(text);
    e.currentTarget.textContent = '복사됨';
  });
  document.getElementById('fatalDownload')?.addEventListener('click', async () => {
    const text = await getErrorLogText(errorText);
    await downloadTextFile(`poe2-error-log-${Date.now()}.txt`, text);
  });
  document.getElementById('fatalReload')?.addEventListener('click', () => location.reload());
}

window.addEventListener('error', event => {
  appendSidepanelDebugLog({
    kind: 'sidepanel-runtime-error',
    error: serializeDebugError(event.error || event.message),
    context: getSidepanelDebugContext()
  });
});

window.addEventListener('unhandledrejection', event => {
  appendSidepanelDebugLog({
    kind: 'sidepanel-unhandled-rejection',
    error: serializeDebugError(event.reason),
    context: getSidepanelDebugContext()
  });
});

function summarizeTradeQueryForDebug(query) {
  const filters = query?.filters || {};
  const summarizeFilterObject = obj => {
    if (!obj || typeof obj !== 'object') return {};
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, cloneJsonSafe(value)]));
  };
  return {
    status: query?.status?.option || '',
    filterGroups: Object.keys(filters),
    typeFilters: summarizeFilterObject(filters.type_filters?.filters),
    tradeFilters: summarizeFilterObject(filters.trade_filters?.filters),
    miscFilters: summarizeFilterObject(filters.misc_filters?.filters),
    equipmentFilters: summarizeFilterObject(filters.equipment_filters?.filters),
    weaponFilters: summarizeFilterObject(filters.weapon_filters?.filters),
    armourFilters: summarizeFilterObject(filters.armour_filters?.filters),
    socketFilters: summarizeFilterObject(filters.socket_filters?.filters),
    stats: (query?.stats || []).map(group => ({
      type: group?.type || '',
      disabled: group?.disabled === true,
      filters: (group?.filters || []).map(stat => ({
        id: stat?.id || '',
        disabled: stat?.disabled === true,
        value: cloneJsonSafe(stat?.value)
      }))
    }))
  };
}

function summarizeFilterForDebug(filter) {
  return {
    id: filter?.id || '',
    name: filter?.name || '',
    league: filter?.league || '',
    tradeRealm: normalizeTradeRealm(filter?.tradeRealm),
    category: filter?.category || '',
    rarity: filter?.rarity || '',
    typeLine: filter?.typeLine || '',
    canonicalTypeLine: filter?.canonicalTypeLine || '',
    typeLineActive: filter?.typeLineActive !== false,
    tradeQueryId: filter?.tradeQueryId || '',
    hasTradeQueryTemplate: !!filter?.tradeQueryTemplate,
    tradeStatusOption: filter?.tradeStatusOption || '',
    tradeSaleTypeActive: filter?.tradeSaleTypeActive,
    tradeSaleTypeOption: filter?.tradeSaleTypeOption || '',
    equipment: (filter?.equipment || []).map(e => ({
      id: e?.id || '',
      label: e?.label || '',
      min: e?.min ?? null,
      max: e?.max ?? null,
      active: e?.active !== false
    })),
    queryFilters: (filter?.queryFilters || []).map(q => ({
      group: q?.group || '',
      id: q?.id || '',
      label: q?.label || '',
      textKey: q?.textKey || '',
      textValue: q?.textValue || '',
      min: q?.min ?? null,
      max: q?.max ?? null,
      noValue: q?.noValue === true,
      active: q?.active !== false
    })),
    stats: (filter?.stats || []).map(s => ({
      id: s?.id || '',
      fallbackId: s?.fallbackId || '',
      label: s?.label || '',
      min: s?.min ?? null,
      max: s?.max ?? null,
      noValue: s?.noValue === true,
      active: s?.active !== false
    }))
  };
}

function normalizeSavedFilter(filter) {
  if (!filter || typeof filter !== 'object') return filter;
  filter.reqLvlMin = 0;
  filter.priceMax = 0;
  if (filter.savedPrice === undefined) filter.savedPrice = null;
  filter.tradeRealm = normalizeTradeRealm(filter.tradeRealm);
  if (filter.tradeRealm === TRADE_REALM_POE1) {
    filter.tradeStatusOption = 'securable';
    filter.tradeSaleTypeActive = true;
    filter.tradeSaleTypeOption = filter.tradeSaleTypeOption || 'priced';
  }
  filter.category = POE2TQTradeCompat.normalizeCategoryForRealm(filter.category || '', filter.tradeRealm);
  if (!filter.typeLine) filter.typeLine = '';
  if (!filter.canonicalTypeLine) filter.canonicalTypeLine = '';
  if (filter.typeLineActive == null) filter.typeLineActive = true;
  if (/거래소 검색조건에서 저장/.test(filter.note || '')) {
    if (!filter.tradeStatusOption) filter.tradeStatusOption = 'any';
    if (!Object.prototype.hasOwnProperty.call(filter, 'tradeSaleTypeActive')) {
      filter.tradeSaleTypeActive = false;
    }
    if (filter.tradeSaleTypeOption == null) filter.tradeSaleTypeOption = '';
  }
  filter.equipment = Array.isArray(filter.equipment) ? filter.equipment : [];
  filter.queryFilters = Array.isArray(filter.queryFilters) ? filter.queryFilters : [];
  filter.stats = Array.isArray(filter.stats) ? filter.stats : [];
  if (!filter.queryFilters.length && filter.tradeQueryTemplate?.filters) {
    filter.queryFilters = collectSavedTradeQueryFilters(filter.tradeQueryTemplate.filters);
  }
  filter.equipment.forEach(e => {
    if (!e) return;
    if (e.active == null) e.active = true;
    if (e.max === undefined) e.max = null;
    if (numberOrNull(e.min) == null && numberOrNull(e.max) == null && e.value != null && isFinite(Number(e.value))) {
      e.min = roundFilterNumber(e.value);
    }
  });
  filter.queryFilters.forEach(q => {
    if (!q) return;
    if (q.active == null) q.active = true;
    if (q.max === undefined) q.max = null;
    if (q.textKey == null) q.textKey = '';
    if (q.textValue == null) q.textValue = '';
    if (!q.textValue && q.option) {
      q.textKey = q.textKey || 'option';
      q.textValue = String(q.option);
    }
    delete q.option;
    const hasRange = numberOrNull(q.min) != null || numberOrNull(q.max) != null;
    if (q.noValue == null) q.noValue = !hasRange && !q.textValue;
    if (q.noValue && !q.textValue) {
      q.min = null;
      q.max = null;
    }
    if (!q.label) q.label = formatTradeQueryFilterId(q.id);
  });
  filter.stats.forEach(s => {
    if (!s) return;
    if (s.active == null) s.active = true;
    if (s.max === undefined) s.max = null;
    const hasRange = numberOrNull(s.min) != null || numberOrNull(s.max) != null;
    if (s.noValue !== true && !hasRange && s.value != null && isFinite(Number(s.value))) {
      // Preserve the sign for negative stats (감소 stats stored as negative values).
      const sign = Number(s.value) < 0 ? -1 : 1;
      s.min = sign * roundFilterNumber(s.value);
    }
    const hasRangeAfterValueFallback = numberOrNull(s.min) != null || numberOrNull(s.max) != null;
    if (s.noValue == null) s.noValue = !hasRangeAfterValueFallback;
    if (s.noValue) {
      s.min = null;
      s.max = null;
    }
    // Migrate: if id is unknown but fallbackId is valid, promote fallbackId → id
    if (s.id && s.id.includes('unknown') && s.fallbackId && !s.fallbackId.includes('unknown')) {
      s.id = s.fallbackId;
    }
  });
  updateFilterSourceHash(filter);
  return filter;
}

function normalizeAdminAccess(value) {
  const keyId = String(value?.keyId || '');
  return {
    enabled: value?.enabled === true && Object.prototype.hasOwnProperty.call(ADMIN_KEY_HASHES, keyId),
    keyId,
    unlockedAt: value?.unlockedAt || ''
  };
}

function getAdminDeviceLabel(keyId = adminAccess.keyId) {
  return ADMIN_KEY_HASHES[keyId]?.label || '알 수 없음';
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(String(text || ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

async function findAdminKeyMatch(input) {
  const hash = await sha256Hex(String(input || '').trim());
  return Object.entries(ADMIN_KEY_HASHES).find(([, item]) => item.hash === hash)?.[0] || '';
}

function isAdminEnabled() {
  return adminAccess.enabled === true && !!ADMIN_KEY_HASHES[adminAccess.keyId];
}

function updateAdminAccessUi() {
  const enabled = isAdminEnabled();
  const tab = document.getElementById('top-tab-admin');
  const panel = document.getElementById('top-panel-admin');
  const status = document.getElementById('adminAccessStatus');
  const badge = document.getElementById('adminDeviceBadge');
  const panelStatus = document.getElementById('adminPanelStatus');
  const lockButton = document.getElementById('btnLockAdmin');

  if (tab) tab.hidden = !enabled;
  if (!enabled && panel?.classList.contains('active')) switchTopTab('trade');
  if (status) {
    status.textContent = enabled
      ? `관리자 탭 활성화됨: ${getAdminDeviceLabel()}`
      : '관리자 탭이 비활성화되어 있습니다.';
  }
  if (badge) badge.textContent = enabled ? getAdminDeviceLabel() : '';
  if (panelStatus) {
    panelStatus.textContent = enabled
      ? `${getAdminDeviceLabel()} 키로 활성화된 관리자 영역입니다.`
      : '관리자 키가 등록된 PC에서만 표시됩니다.';
  }
  if (lockButton) lockButton.disabled = !enabled;
}

async function unlockAdminAccess() {
  const input = document.getElementById('adminKeyInput');
  const key = input?.value || '';
  const matchedKeyId = await findAdminKeyMatch(key);
  if (!matchedKeyId) {
    alert('관리자 키가 올바르지 않습니다.');
    input?.focus();
    return;
  }

  adminAccess = {
    enabled: true,
    keyId: matchedKeyId,
    unlockedAt: new Date().toISOString()
  };
  await chrome.storage.local.set({ [ADMIN_ACCESS_KEY]: adminAccess });
  if (input) input.value = '';
  updateAdminAccessUi();
  switchTopTab('admin');
}

async function lockAdminAccess() {
  adminAccess = { enabled: false, keyId: '' };
  await chrome.storage.local.remove(ADMIN_ACCESS_KEY);
  updateAdminAccessUi();
}

function bindAdminAccessControls() {
  const input = document.getElementById('adminKeyInput');
  document.getElementById('btnUnlockAdmin')?.addEventListener('click', () => {
    unlockAdminAccess().catch(err => {
      appendSidepanelDebugLog({ kind: 'admin-unlock-error', error: serializeDebugError(err) });
      alert('관리자 활성화 중 오류가 발생했습니다.');
    });
  });
  document.getElementById('btnLockAdmin')?.addEventListener('click', () => {
    lockAdminAccess().catch(err => {
      appendSidepanelDebugLog({ kind: 'admin-lock-error', error: serializeDebugError(err) });
      alert('관리자 해제 중 오류가 발생했습니다.');
    });
  });
  input?.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      unlockAdminAccess().catch(err => {
        appendSidepanelDebugLog({ kind: 'admin-unlock-error', error: serializeDebugError(err) });
        alert('관리자 활성화 중 오류가 발생했습니다.');
      });
    }
  });
  updateAdminAccessUi();
}

document.addEventListener('DOMContentLoaded', () => {
  initSidepanelApp().catch(handleSidepanelInitError);
});

async function initSidepanelApp() {
  // UI 줌 먼저 적용 (초기 렌더 깜빡임 최소화)
  const zoomStore = await chrome.storage.local.get(['uiZoom', SIDEBAR_UI_KEY]);
  const initialZoom = clampZoom(zoomStore.uiZoom != null ? zoomStore.uiZoom : DEFAULT_UI_ZOOM);
  applyZoom(initialZoom);
  syncZoomControls(initialZoom);

  // 패널 너비 슬라이더 초기 동기화 (sidebarUI.width, 없으면 기본 460)
  const initialWidth = clampPanelWidth(zoomStore[SIDEBAR_UI_KEY]?.width ?? DEFAULT_PANEL_WIDTH);
  syncPanelWidthControls(initialWidth);
  window.addEventListener('resize', () => syncSidepanelViewportVars());

  await loadData();
  renderLeagueOptions();
  render();
  bindTabs();
  bindHeader();
  bindModal();
  bindSettings();
  Promise.all([
    loadTradeLeagues(TRADE_REALM_POE1),
    loadTradeLeagues(TRADE_REALM_POE2)
  ]).catch(() => {});
  bindAdminAccessControls();
  bindImportExport();
  bindSidepanelWheelProxy();
  chrome.storage.onChanged.addListener((changes) => {
    let needsRender = false;
    if (changes.filtersByLeague) {
      filtersByLeague = changes.filtersByLeague.newValue || {};
      needsRender = true;
    }
    if (changes.buildsByLeague) {
      buildsByLeague = changes.buildsByLeague.newValue || {};
      needsRender = true;
    }
    if (changes.buildUiByLeague) {
      buildUiByLeague = changes.buildUiByLeague.newValue || {};
      needsRender = true;
    }
    if (changes.settings) {
      const previousLeague = settings.league;
      settings = { ...settings, ...(changes.settings.newValue || {}) };
      settings.tradeRealm = normalizeTradeRealm(settings.tradeRealm);
      syncTradeSettingsUi();
      if (settings.league !== previousLeague) syncPoe1CharacterEquipmentLeagueContext();
      switchUtilityTab(currentUtilityTabByRealm[settings.tradeRealm]);
      const countSelect = document.getElementById('sCount');
      countSelect.value = settings.resultCount;
      syncCustomSelectControl(countSelect);
      const allowGlobalSidebar = document.getElementById('sAllowGlobalSidebar');
      if (allowGlobalSidebar) allowGlobalSidebar.checked = !!settings.allowGlobalSidebar;
      needsRender = true;
    }
    if (changes[APP_STATE_REVISION_KEY]) {
      appStateRevision = Math.max(appStateRevision, Number(changes[APP_STATE_REVISION_KEY].newValue || 0));
    }
    if (changes[ADMIN_ACCESS_KEY]) {
      adminAccess = normalizeAdminAccess(changes[ADMIN_ACCESS_KEY].newValue);
      updateAdminAccessUi();
    }
    if (changes.uiZoom) {
      const z = clampZoom(changes.uiZoom.newValue != null ? changes.uiZoom.newValue : DEFAULT_UI_ZOOM);
      applyZoom(z);
      syncZoomControls(z);
    }
    // 외부(드래그 리사이즈)에서 패널 너비가 바뀌면 슬라이더/표시 동기화
    if (changes[SIDEBAR_UI_KEY]) {
      const nextWidth = changes[SIDEBAR_UI_KEY].newValue?.width;
      if (nextWidth != null) syncPanelWidthControls(nextWidth);
    }
    if (needsRender) render();
  });

  // Top-tab buttons (replaced inline onclick to comply with MV3 CSP)
  document.getElementById('top-tab-trade').addEventListener('click', () => switchTopTab('trade'));
  document.getElementById('top-tab-economy').addEventListener('click', () => switchTopTab('economy'));
  document.getElementById('top-tab-utility').addEventListener('click', () => switchTopTab('utility'));
  document.getElementById('top-tab-admin').addEventListener('click', () => switchTopTab('admin'));
  document.getElementById('expedition-search').addEventListener('input', e => renderExpedition(e.target.value));
  document.querySelectorAll('[data-utility-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchUtilityTab(btn.dataset.utilityTab));
  });
  switchUtilityTab(currentUtilityTabByRealm[normalizeTradeRealm(settings.tradeRealm)]);
  bindPoe1StashWealth();
  bindPoe1CharacterEquipment();
  bindRegexGenerator();
  document.getElementById('ninja-rate-badge').addEventListener('click', () => switchTopTab('economy'));
  document.getElementById('ninja-refresh-btn').addEventListener('click', () => loadNinjaRates());

  // 카테고리 탭 초기 렌더
  renderNinjaCategoryTabs();

  // Economy 탭 검색창 이벤트
  const ninjaSearchEl = document.getElementById('ninja-search');
  if (ninjaSearchEl) {
    ninjaSearchEl.addEventListener('input', scheduleNinjaSearch);
  }

  // 환율 배지 초기 로드 (백그라운드)
  setTimeout(() => loadNinjaRates(), 1000);
}

function mergeStoredRecords(existing, incoming) {
  const result = Array.isArray(existing) ? existing.slice() : [];
  const ids = new Set(result.map(entry => String(entry?.id || '')));
  (incoming || []).forEach(entry => {
    const id = String(entry?.id || '');
    if (id && ids.has(id)) return;
    result.push(entry);
    if (id) ids.add(id);
  });
  return result;
}

function mergeStoredBuilds(existing, incoming) {
  const result = cloneJsonSafe(existing) || [];
  const byId = new Map(result.map(build => [String(build?.id || ''), build]));
  (cloneJsonSafe(incoming) || []).forEach(incomingBuild => {
    const id = String(incomingBuild?.id || '');
    const current = id ? byId.get(id) : null;
    if (!current) {
      result.push(incomingBuild);
      if (id) byId.set(id, incomingBuild);
      return;
    }
    const tabsById = new Map((current.tabs || []).map(tab => [String(tab?.id || ''), tab]));
    (incomingBuild.tabs || []).forEach(incomingTab => {
      const tabId = String(incomingTab?.id || '');
      const currentTab = tabId ? tabsById.get(tabId) : null;
      if (!currentTab) {
        current.tabs = current.tabs || [];
        current.tabs.push(incomingTab);
        if (tabId) tabsById.set(tabId, incomingTab);
        return;
      }
      currentTab.filterIds = Array.from(new Set([
        ...(currentTab.filterIds || []).map(String),
        ...(incomingTab.filterIds || []).map(String)
      ]));
    });
  });
  return result;
}

function cloneBuildsForFilterIds(builds, filterIds) {
  const allowedIds = new Set((filterIds || []).map(String));
  return (cloneJsonSafe(builds) || []).map(build => {
    (build?.tabs || []).forEach(tab => {
      tab.filterIds = (tab.filterIds || []).filter(id => allowedIds.has(String(id)));
    });
    return build;
  });
}

function migrateRealmScopedStorageMaps() {
  let changed = false;
  const keys = Array.from(new Set([
    ...Object.keys(filtersByLeague || {}),
    ...Object.keys(buildsByLeague || {}),
    ...Object.keys(buildUiByLeague || {})
  ]));

  keys.forEach(sourceKey => {
    const parsed = POE2TQTradeCompat.parseRealmLeagueKey(sourceKey);
    if (parsed) {
      const league = LEAGUE_ALIASES[parsed.league] || parsed.league;
      const targetKey = getRealmLeagueStorageKey(parsed.realm, league);
      if (targetKey === sourceKey) return;
      filtersByLeague[targetKey] = mergeStoredRecords(filtersByLeague[targetKey], filtersByLeague[sourceKey] || []);
      buildsByLeague[targetKey] = mergeStoredBuilds(buildsByLeague[targetKey], buildsByLeague[sourceKey] || []);
      buildUiByLeague[targetKey] = { ...(buildUiByLeague[sourceKey] || {}), ...(buildUiByLeague[targetKey] || {}) };
      delete filtersByLeague[sourceKey];
      delete buildsByLeague[sourceKey];
      delete buildUiByLeague[sourceKey];
      changed = true;
      return;
    }

    const league = LEAGUE_ALIASES[sourceKey] || sourceKey;
    const sourceFilters = Array.isArray(filtersByLeague[sourceKey]) ? filtersByLeague[sourceKey] : [];
    const filtersByRealm = new Map();
    sourceFilters.forEach(filter => {
      const realm = normalizeTradeRealm(filter?.tradeRealm);
      if (!filtersByRealm.has(realm)) filtersByRealm.set(realm, []);
      filtersByRealm.get(realm).push(filter);
    });
    if (!filtersByRealm.size) filtersByRealm.set(TRADE_REALM_POE2, []);

    filtersByRealm.forEach((realmFilters, realm) => {
      const targetKey = getRealmLeagueStorageKey(realm, league);
      filtersByLeague[targetKey] = mergeStoredRecords(filtersByLeague[targetKey], realmFilters);
      const clonedBuilds = cloneBuildsForFilterIds(buildsByLeague[sourceKey] || [], realmFilters.map(filter => filter.id));
      buildsByLeague[targetKey] = mergeStoredBuilds(buildsByLeague[targetKey], clonedBuilds);
      buildUiByLeague[targetKey] = { ...(buildUiByLeague[sourceKey] || {}), ...(buildUiByLeague[targetKey] || {}) };
    });

    delete filtersByLeague[sourceKey];
    delete buildsByLeague[sourceKey];
    delete buildUiByLeague[sourceKey];
    changed = true;
  });
  return changed;
}

async function loadData() {
  const r = await chrome.storage.local.get([
    'filters', 'filtersByLeague', 'buildsByLeague', 'buildUiByLeague', 'settings', ADMIN_ACCESS_KEY, APP_STATE_REVISION_KEY
  ]);
  appStateRevision = Number(r[APP_STATE_REVISION_KEY] || 0);
  if (r.settings) settings = { ...settings, ...r.settings };
  settings.tradeRealm = normalizeTradeRealm(settings.tradeRealm);
  if (!settings.league) settings.league = getTradeEndpoint(settings.tradeRealm).defaultLeague;
  adminAccess = normalizeAdminAccess(r[ADMIN_ACCESS_KEY]);
  filtersByLeague = r.filtersByLeague || {};
  buildsByLeague = r.buildsByLeague || {};
  buildUiByLeague = r.buildUiByLeague || {};
  if (Array.isArray(r.filters) && r.filters.length && !r.filtersByLeague) {
    filtersByLeague[settings.league] = r.filters;
  }
  if (LEAGUE_ALIASES[settings.league]) {
    settings.league = LEAGUE_ALIASES[settings.league];
  }
  migrateRealmScopedStorageMaps();
  Object.keys(filtersByLeague).forEach(storageKey => {
    filtersByLeague[storageKey] = (filtersByLeague[storageKey] || []).map(normalizeSavedFilter);
  });
  Object.keys(buildsByLeague).forEach(storageKey => {
    buildsByLeague[storageKey] = (buildsByLeague[storageKey] || []).map(normalizeBuild).filter(Boolean);
  });
  const storageKeys = Array.from(new Set([
    ...Object.keys(filtersByLeague),
    ...Object.keys(buildsByLeague),
    getRealmLeagueStorageKey()
  ]));
  storageKeys.forEach(storageKey => {
    ensureBuildDataForLeague(storageKey);
    pruneDeletedFilterRefs(storageKey);
  });
  await persist();
  if (Array.isArray(r.filters)) await chrome.storage.local.remove('filters');
  document.getElementById('sCount').value = settings.resultCount;
  const allowGlobalSidebar = document.getElementById('sAllowGlobalSidebar');
  if (allowGlobalSidebar) allowGlobalSidebar.checked = !!settings.allowGlobalSidebar;
  syncTradeSettingsUi();
}

function persist() {
  const snapshot = cloneJsonSafe({ filtersByLeague, buildsByLeague, buildUiByLeague, settings }) || {
    filtersByLeague: {}, buildsByLeague: {}, buildUiByLeague: {}, settings: {}
  };
  const operation = appStatePersistQueue.then(async () => {
    const response = await chrome.runtime.sendMessage({
      type: 'PERSIST_APP_STATE',
      ...snapshot,
      baseRevision: appStateRevision
    });
    if (!response?.ok) throw new Error(response?.error || 'app-state-persist-failed');
    appStateRevision = Math.max(appStateRevision, Number(response.revision || 0));
    return response;
  });
  appStatePersistQueue = operation.catch(error => {
    appendSidepanelDebugLog({ kind: 'app-state-persist-failed', error: serializeDebugError(error) });
    return { ok: false, error: serializeDebugError(error).message };
  });
  return appStatePersistQueue;
}
let draggingFilterId = null;
let filterOrderBeforeDrag = '';
let filterDragAutoScrollFrame = 0;
let filterDragAutoScrollTarget = null;
let filterDragAutoScrollSpeed = 0;

function render() {
  const list = document.getElementById('filterList');
  // Preserve which cards are currently open before re-render
  const openIds = new Set(
    Array.from(list.querySelectorAll('.filter-card.open')).map(el => el.id.replace('card-', ''))
  );
  renderBuilds();

  // Jewel sub-tabs visibility — wire BEFORE any early return so buttons
  // keep their event listeners even when the filtered list is empty.
  const jewelSubTabsEl = document.getElementById('jewelSubTabs');
  if (jewelSubTabsEl) {
    const _selectedBuild = getSelectedBuild();
    const _activeTab = _selectedBuild ? getActiveBuildTab(_selectedBuild) : null;
    const isSlate = _activeTab && _activeTab.key === 'slate';
    jewelSubTabsEl.style.display = isSlate ? 'flex' : 'none';
    if (isSlate) {
      jewelSubTabsEl.innerHTML = JEWEL_SUB_TYPES.map(t =>
        `<button class="jewel-sub-btn${jewelSubFilter === t.key ? ' active' : ''}" data-jewel-sub="${t.key}">${t.label}</button>`
      ).join('');
      jewelSubTabsEl.querySelectorAll('.jewel-sub-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          jewelSubFilter = btn.dataset.jewelSub;
          render();
        });
      });
    }
  }

  const current = getVisibleFilters();
  if (!current.length) {
    const selectedBuild = getSelectedBuild();
    const activeTab = getActiveBuildTab(selectedBuild);
    const emptyText = selectedBuild && activeTab
      ? `"${esc(selectedBuild.name)} > ${esc(activeTab.name)}" 탭에 담긴 필터가 없습니다.`
      : `"${esc(settings.league)}" 리그에 저장된 필터가 없습니다.`;
    list.innerHTML = `
      <div class="empty">
        <div class="empty-icon">⭐</div>
        <p>${emptyText}</p>
        <div class="guide-step">1. 아래 버튼으로 거래소 열기</div>
        <div class="guide-step">2. 원하는 아이템 검색</div>
        <div class="guide-step">3. 아이템 옆 ⭐ 즐겨찾기 클릭</div>
      </div>`;
    return;
  }
  list.innerHTML = '';
  current.slice().reverse().forEach(f => {
    const card = makeCard(f);
    if (openIds.has(String(f.id))) card.classList.add('open');
    list.appendChild(card);
  });
  bindFilterDragSorting(list);
}

function getFilterCardVisualIds(list) {
  if (!list) return [];
  return Array.from(list.querySelectorAll('.filter-card[data-filter-id]'))
    .map(card => String(card.dataset.filterId || ''))
    .filter(Boolean);
}

function reorderFiltersByVisualIds(visualIds) {
  const current = getCurrentFilters();
  if (!current.length || visualIds.length < 2) return false;
  const currentById = new Map(current.map(filter => [String(filter.id), filter]));
  const uniqueVisualIds = [];
  const seen = new Set();
  visualIds.forEach(id => {
    const key = String(id);
    if (!key || seen.has(key) || !currentById.has(key)) return;
    seen.add(key);
    uniqueVisualIds.push(key);
  });
  if (uniqueVisualIds.length < 2) return false;

  // 화면은 저장 배열을 reverse()해서 보여주므로, 화면 위->아래 순서를 저장 배열 아래->위 순서로 변환한다.
  const desiredStoredIds = uniqueVisualIds.slice().reverse();
  const visibleSet = new Set(desiredStoredIds);
  let nextVisibleIndex = 0;
  let changed = false;
  const nextFilters = current.map(filter => {
    const key = String(filter.id);
    if (!visibleSet.has(key)) return filter;
    const next = currentById.get(desiredStoredIds[nextVisibleIndex++]) || filter;
    if (String(next.id) !== key) changed = true;
    return next;
  });
  if (!changed) return false;
  setCurrentFilters(nextFilters);
  return true;
}

function clearFilterDragState(list) {
  stopFilterDragAutoScroll();
  list?.classList.remove('drag-sorting');
  list?.querySelectorAll('.filter-card.dragging').forEach(card => {
    card.classList.remove('dragging');
    card.draggable = false;
    delete card.dataset.dragReady;
  });
  draggingFilterId = null;
  filterOrderBeforeDrag = '';
}

function commitFilterDragOrder(list) {
  if (!draggingFilterId) return;
  const nextOrder = getFilterCardVisualIds(list);
  const changed = nextOrder.join('|') !== filterOrderBeforeDrag && reorderFiltersByVisualIds(nextOrder);
  clearFilterDragState(list);
  if (!changed) return;
  persist();
  render();
}

function getFilterDragScrollTarget(list) {
  const scrollArea = list?.closest('.scroll-area');
  if (scrollArea && isScrollableY(scrollArea)) return scrollArea;
  return findFallbackWheelTarget(1);
}

function stopFilterDragAutoScroll() {
  if (filterDragAutoScrollFrame) cancelAnimationFrame(filterDragAutoScrollFrame);
  filterDragAutoScrollFrame = 0;
  filterDragAutoScrollTarget = null;
  filterDragAutoScrollSpeed = 0;
}

function stepFilterDragAutoScroll() {
  if (!draggingFilterId || !filterDragAutoScrollTarget || !filterDragAutoScrollSpeed) {
    stopFilterDragAutoScroll();
    return;
  }
  scrollWheelTarget(filterDragAutoScrollTarget, filterDragAutoScrollSpeed);
  filterDragAutoScrollFrame = requestAnimationFrame(stepFilterDragAutoScroll);
}

function updateFilterDragAutoScroll(list, clientY) {
  const target = getFilterDragScrollTarget(list);
  if (!target) {
    stopFilterDragAutoScroll();
    return;
  }

  const rect = target.getBoundingClientRect();
  const edge = Math.min(64, Math.max(34, rect.height * 0.18));
  const maxScroll = Math.max(0, target.scrollHeight - target.clientHeight);
  let speed = 0;

  if (clientY < rect.top + edge) {
    const ratio = Math.min(1, Math.max(0, (rect.top + edge - clientY) / edge));
    speed = -Math.round(4 + ratio * 22);
  } else if (clientY > rect.bottom - edge) {
    const ratio = Math.min(1, Math.max(0, (clientY - (rect.bottom - edge)) / edge));
    speed = Math.round(4 + ratio * 22);
  }

  if ((speed < 0 && target.scrollTop <= 0) || (speed > 0 && target.scrollTop >= maxScroll - 1)) {
    speed = 0;
  }

  if (!speed) {
    stopFilterDragAutoScroll();
    return;
  }

  filterDragAutoScrollTarget = target;
  filterDragAutoScrollSpeed = speed;
  if (!filterDragAutoScrollFrame) {
    filterDragAutoScrollFrame = requestAnimationFrame(stepFilterDragAutoScroll);
  }
}

function bindFilterDragSorting(list) {
  if (!list || list.dataset.dragSortBound === '1') return;
  list.dataset.dragSortBound = '1';
  const dragSurface = list.closest('.scroll-area') || list;

  dragSurface.addEventListener('dragover', e => {
    if (!draggingFilterId) return;
    const draggingCard = list.querySelector('.filter-card.dragging');
    if (!draggingCard) return;
    e.preventDefault();
    updateFilterDragAutoScroll(list, e.clientY);
    const target = e.target.closest('.filter-card[data-filter-id]');
    if (!target || target === draggingCard || !list.contains(target)) return;
    const rect = target.getBoundingClientRect();
    const insertAfter = e.clientY > rect.top + rect.height / 2;
    if (insertAfter) target.after(draggingCard);
    else target.before(draggingCard);
  });

  dragSurface.addEventListener('drop', e => {
    if (!draggingFilterId) return;
    e.preventDefault();
    e.stopPropagation();
    commitFilterDragOrder(list);
  });
}

function getSelectedBuild() {
  ensureBuildDataForLeague(settings.league);
  const ui = getCurrentBuildUi();
  const builds = getCurrentBuilds();
  let selected = builds.find(build => build.id === ui.selectedBuildId) || builds[0] || null;
  if (!selected) return null;
  if (ui.selectedBuildId !== selected.id) ui.selectedBuildId = selected.id;
  if (!selected.tabs.some(tab => tab.id === selected.activeTabId)) {
    selected.activeTabId = selected.tabs[0]?.id || '';
  }
  return selected;
}

function getActiveBuildTab(build) {
  if (!build) return null;
  return build.tabs.find(tab => tab.id === build.activeTabId) || build.tabs[0] || null;
}

function getFilterById(filterId) {
  return getCurrentFilters().find(filter => String(filter.id) === String(filterId)) || null;
}

function getVisibleFilters() {
  const selectedBuild = getSelectedBuild();
  const activeTab = getActiveBuildTab(selectedBuild);
  const current = getCurrentFilters();
  if (!selectedBuild || !activeTab) return [];
  const allowedIds = new Set((activeTab.filterIds || []).map(String));
  let visible = current.filter(filter => allowedIds.has(String(filter.id)));
  if (activeTab.key === 'slate' && jewelSubFilter !== 'all') {
    visible = visible.filter(f => getJewelSubType(f) === jewelSubFilter);
  }
  return visible;
}

function pruneDeletedFilterRefs(league = settings.league) {
  const storageKey = resolveRealmLeagueStorageKey(league);
  const validIds = new Set((filtersByLeague[storageKey] || []).map(filter => String(filter.id)));
  let changed = false;
  (buildsByLeague[storageKey] || []).forEach(build => {
    build.tabs.forEach(tab => {
      const nextIds = (tab.filterIds || []).filter(id => validIds.has(String(id)));
      if (nextIds.length !== (tab.filterIds || []).length) {
        tab.filterIds = nextIds;
        changed = true;
      }
    });
  });
  return changed;
}

function priceToDivine(savedPrice) {
  if (!savedPrice) return null;
  const amount = Number(savedPrice.amount);
  if (!isFinite(amount) || amount <= 0) return null;
  const currency = String(savedPrice.currency || '').toLowerCase();
  if (currency === 'divine') return amount;
  const rate = Number(currentTradeRates[currency]);
  if (isFinite(rate) && rate > 0) return amount / rate;
  return null;
}

function getFilterValueMeta(filter) {
  if (!filter) return null;
  let score = 0;
  let statCount = 0;
  let equipmentCount = 0;

  (filter.equipment || []).forEach(entry => {
    if (entry.active === false || !entry.id) return;
    const value = Math.abs(Number(entry.min != null ? entry.min : entry.value));
    if (!isFinite(value) || value <= 0) return;
    equipmentCount += 1;
    score += value * 0.45 + 2;
  });

  (filter.stats || []).forEach(entry => {
    if (entry.active === false) return;
    const effectiveId = (entry.id && !entry.id.includes('unknown'))
      ? entry.id
      : (entry.fallbackId && !entry.fallbackId.includes('unknown') ? entry.fallbackId : '');
    if (!effectiveId) return;
    const value = Math.abs(Number(entry.min != null ? entry.min : entry.value));
    if (!isFinite(value) || value <= 0) return;
    const prefix = effectiveId.split('.')[0];
    const weight = {
      explicit: 1,
      implicit: 0.92,
      fractured: 0.9,
      crafted: 0.82,
      enchant: 0.8,
      skill: 0.78,
      rune: 0.72,
      desecrated: 0.7
    }[prefix] || 0.88;
    statCount += 1;
    score += value * weight + 3;
  });

  score += statCount * 4 + equipmentCount * 2;
  const roundedScore = Number(score.toFixed(1));
  const priceDiv = priceToDivine(filter.savedPrice);
  if (!priceDiv) return { score: roundedScore, priceDiv: null, ratio: null, tier: '', label: '' };

  const ratio = Number((roundedScore / priceDiv).toFixed(1));
  let tier = '';
  let label = '';
  if (ratio >= 120) {
    tier = 'S';
    label = `저평가 후보 ${ratio}/div`;
  } else if (ratio >= 80) {
    tier = 'A';
    label = `가성비 좋음 ${ratio}/div`;
  } else if (ratio >= 45) {
    tier = 'B';
    label = `준수 ${ratio}/div`;
  }

  return { score: roundedScore, priceDiv, ratio, tier, label };
}

function summarizeFilter(filter) {
  if (!filter) return '';
  const parts = [];
  if (filter.category) parts.push(filter.category);
  if (filter.typeLine) parts.push(filter.typeLine);
  const activeStatCount = (filter.stats || []).filter(stat => stat.active !== false).length;
  const activeEquipCount = (filter.equipment || []).filter(entry => entry.active !== false).length;
  if (activeEquipCount) parts.push(`장비 ${activeEquipCount}`);
  if (activeStatCount) parts.push(`옵션 ${activeStatCount}`);
  return parts.join(' · ');
}

function renderBuilds() {
  const container = document.getElementById('buildQuickManager');
  if (!container) return;
  ensureBuildDataForLeague(settings.league);
  const builds = getCurrentBuilds();
  const selected = getSelectedBuild();
  const buildPills = builds.map(build => {
    const active = selected && build.id === selected.id ? 'active' : '';
    const canDelete = builds.length > 1;
    return `<div class="build-pill ${active}" data-build-id="${build.id}">
      <button class="build-pill-main" data-build-select="${build.id}">${esc(build.name)}</button>
      <button class="build-pill-icon" data-build-rename="${build.id}" title="빌드 이름 변경">✎</button>
      ${canDelete ? `<button class="build-pill-icon danger" data-build-delete="${build.id}" title="빌드 삭제">×</button>` : ''}
    </div>`;
  }).join('');
  const activeTab = getActiveBuildTab(selected);
  const tabButtons = selected
    ? selected.tabs.map(tab => {
        const isLocked = isMandatoryBuildTab(tab);
        return `<div class="build-tab-btn ${tab.id === activeTab?.id ? 'active' : ''} ${isLocked ? 'locked' : ''}" data-tab-id="${tab.id}">
          <button class="build-tab-main" data-tab-select="${tab.id}">${esc(tab.name)}</button>
          <button class="build-tab-icon" data-tab-rename="${tab.id}" title="탭 이름 변경">✎</button>
          ${isLocked ? '' : `<button class="build-tab-icon danger" data-tab-delete="${tab.id}" title="탭 삭제">×</button>`}
        </div>`;
      }).join('')
    : '';

  const collapsedClass = buildSectionCollapsed ? 'collapsed' : '';
  const currentTabName = activeTab ? esc(activeTab.name) : '탭없음';
  const currentBuildName = selected ? esc(selected.name) : '빌드없음';
  const metaText = selected
    ? `${esc(settings.league)} · ${esc(selected.name)} · ${(activeTab?.filterIds || []).length}개`
    : `${esc(settings.league)} · 빌드를 생성하세요`;

  container.innerHTML = `
    <div class="build-section ${collapsedClass}">
      <div class="build-toggle-bar" id="buildToggleBar">
        <span class="build-toggle-label">
          <span class="build-current-name">${currentBuildName}</span>
          <span class="build-sep">·</span>
          <span class="build-current-tab">${currentTabName}</span>
        </span>
        <span class="build-toggle-chevron">${buildSectionCollapsed ? '▾' : '▴'}</span>
      </div>
      <div class="build-section-body">
        <div class="builds-toolbar">
          <div class="build-preset-list" id="buildPresetList">
            ${buildPills}
          </div>
          <button class="btn-icon-sm" id="btnBuildCreateInline" title="빌드 추가">+</button>
        </div>
        <div class="build-meta-line">${metaText}</div>
        ${selected ? `
          <div class="build-tab-bar">
            ${tabButtons}
            <button class="btn-icon-sm" id="btnBuildAddTab" title="탭 추가">+</button>
          </div>
        ` : ''}
      </div>
    </div>`;

  container.querySelectorAll('[data-build-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      getCurrentBuildUi().selectedBuildId = btn.dataset.buildSelect;
      persist();
      render();
    });
  });
  container.querySelectorAll('[data-build-rename]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      renameBuildPreset(btn.dataset.buildRename);
    });
  });
  container.querySelectorAll('[data-build-delete]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteBuildPreset(btn.dataset.buildDelete);
    });
  });
  document.getElementById('btnBuildCreateInline').addEventListener('click', createBuildPreset);

  const toggleBar = document.getElementById('buildToggleBar');
  if (toggleBar) {
    toggleBar.addEventListener('click', () => {
      buildSectionCollapsed = !buildSectionCollapsed;
      renderBuilds();
    });
  }

  if (!selected) return;

  container.querySelectorAll('[data-tab-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tabSelect;
      const currentBuild = getCurrentBuilds().find(b => b.id === selected.id);
      if (!currentBuild) return;
      currentBuild.activeTabId = tabId;
      jewelSubFilter = 'all';
      persist();
      render();
    });
  });
  container.querySelectorAll('[data-tab-rename]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      renameBuildTab(selected.id, btn.dataset.tabRename);
    });
  });
  container.querySelectorAll('[data-tab-delete]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteBuildTab(selected.id, btn.dataset.tabDelete);
    });
  });
  document.getElementById('btnBuildAddTab').addEventListener('click', () => addBuildTab(selected.id));
}

function createBuildPreset() {
  const name = prompt('새 빌드 이름을 입력하세요.', `새 빌드 ${getCurrentBuilds().length + 1}`);
  if (name == null) return;
  const build = makeBuild((name || '').trim() || undefined);
  const builds = getCurrentBuilds().slice();
  builds.push(build);
  setCurrentBuilds(builds);
  getCurrentBuildUi().selectedBuildId = build.id;
  persist();
  render();
}

function renameBuildPreset(buildId) {
  const build = getCurrentBuilds().find(entry => entry.id === buildId);
  if (!build) return;
  const name = prompt('빌드 이름을 입력하세요.', build.name);
  if (name == null) return;
  const nextName = name.trim();
  if (!nextName) return;
  build.name = nextName;
  persist();
  render();
}

function deleteBuildPreset(buildId) {
  const builds = getCurrentBuilds();
  if (builds.length <= 1) {
    alert('최소 1개의 빌드는 남아 있어야 합니다.');
    return;
  }
  const target = builds.find(build => build.id === buildId);
  if (!target) return;
  if (!confirm(`"${target.name}" 빌드를 삭제할까요?`)) return;
  const remaining = builds.filter(build => build.id !== buildId);
  const fallbackTab = remaining[0]?.tabs?.[0];
  if (fallbackTab) {
    const movedIds = target.tabs.flatMap(tab => tab.filterIds || []).map(String);
    fallbackTab.filterIds = Array.from(new Set([...(fallbackTab.filterIds || []).map(String), ...movedIds]));
  }
  setCurrentBuilds(remaining);
  ensureBuildDataForLeague(settings.league);
  getCurrentBuildUi().selectedBuildId = getCurrentBuilds()[0]?.id || '';
  persist();
  render();
}

function addBuildTab(buildId) {
  const builds = getCurrentBuilds();
  const build = builds.find(entry => entry.id === buildId);
  if (!build) return;
  const name = prompt('새 탭 이름을 입력하세요.', `탭 ${build.tabs.length + 1}`);
  if (name == null) return;
  const nextTab = makeBuildTab((name || '').trim() || `탭 ${build.tabs.length + 1}`, 'custom');
  build.tabs.push(nextTab);
  build.activeTabId = nextTab.id;
  persist();
  render();
}

function renameBuildTab(buildId, tabId) {
  const build = getCurrentBuilds().find(entry => entry.id === buildId);
  const tab = getActiveBuildTab(build);
  if (!build || !tab) return;
  const targetTab = tabId ? build?.tabs.find(entry => entry.id === tabId) : tab;
  if (!build || !targetTab) return;
  const name = prompt('탭 이름을 입력하세요.', targetTab.name);
  if (name == null) return;
  const nextName = name.trim();
  if (!nextName) return;
  targetTab.name = nextName;
  persist();
  render();
}

function deleteBuildTab(buildId, tabId) {
  const build = getCurrentBuilds().find(entry => entry.id === buildId);
  const tab = tabId ? build?.tabs.find(entry => entry.id === tabId) : getActiveBuildTab(build);
  if (!build || !tab) return;
  if (isMandatoryBuildTab(tab)) return;
  if (!confirm(`"${tab.name}" 탭을 삭제할까요?`)) return;
  const fallbackTab = build.tabs.find(entry => entry.id !== tab.id) || build.tabs[0];
  if (fallbackTab) {
    fallbackTab.filterIds = Array.from(new Set([...(fallbackTab.filterIds || []).map(String), ...(tab.filterIds || []).map(String)]));
  }
  build.tabs = build.tabs.filter(entry => entry.id !== tab.id);
  build.activeTabId = build.tabs[0]?.id || '';
  persist();
  render();
}

function addFilterToBuildTab(buildId, filterId) {
  const build = getCurrentBuilds().find(entry => entry.id === buildId);
  const tab = getActiveBuildTab(build);
  if (!build || !tab || !filterId) return;
  const refId = String(filterId);
  if (!tab.filterIds.includes(refId)) tab.filterIds.push(refId);
  persist();
  render();
}

function moveFilterToBuildTab(buildId, filterId, targetTabId) {
  const build = getCurrentBuilds().find(entry => entry.id === buildId);
  if (!build || !filterId || !targetTabId) return;
  const fromTab = build.tabs.find(tab => (tab.filterIds || []).includes(String(filterId)));
  const toTab   = build.tabs.find(tab => tab.id === targetTabId);
  if (!toTab) return;
  if (fromTab) fromTab.filterIds = (fromTab.filterIds || []).filter(id => String(id) !== String(filterId));
  if (!toTab.filterIds.includes(String(filterId))) toTab.filterIds.push(String(filterId));
  build.activeTabId = targetTabId;
  persist();
  render();
}

function moveFilterToBuild(filterId, targetBuildId, targetTabId) {
  const allBuilds = getCurrentBuilds();
  allBuilds.forEach(build => {
    build.tabs.forEach(tab => {
      tab.filterIds = (tab.filterIds || []).filter(id => String(id) !== String(filterId));
    });
  });
  const targetBuild = allBuilds.find(b => b.id === targetBuildId);
  if (!targetBuild) return;
  const targetTab = targetBuild.tabs.find(t => t.id === targetTabId);
  if (!targetTab) return;
  if (!targetTab.filterIds.includes(String(filterId))) targetTab.filterIds.push(String(filterId));
  getCurrentBuildUi().selectedBuildId = targetBuildId;
  targetBuild.activeTabId = targetTabId;
  persist();
  render();
}

function removeFilterFromBuildTab(buildId, filterId) {
  const build = getCurrentBuilds().find(entry => entry.id === buildId);
  const tab = getActiveBuildTab(build);
  if (!build || !tab) return;
  tab.filterIds = (tab.filterIds || []).filter(id => String(id) !== String(filterId));
  persist();
  render();
}

const SEARCH_EVAL_KEY = 'searchEvaluationContexts';
const TRADE_RATE_KEY = 'tradeCurrencyRates';

function tradeEntryValueToText(value, depth) {
  if (Array.isArray(value)) return tradeValueToText(value[0], depth + 1);
  if (value && typeof value === 'object') {
    for (const key of ['text', 'string', 'value', 'name', 'line', 'mod', 'descrText', 'description', 'displayText']) {
      if (value[key] != null && value[key] !== value) return tradeValueToText(value[key], depth + 1);
    }
    if (value.min != null || value.max != null) {
      const min = value.min != null ? tradeValueToText(value.min, depth + 1) : '';
      const max = value.max != null ? tradeValueToText(value.max, depth + 1) : '';
      return min && max && min !== max ? `${min}~${max}` : (max || min);
    }
  }
  return tradeValueToText(value, depth + 1);
}

function tradeObjectValuesToText(value, depth) {
  const source = Array.isArray(value?.values) ? value.values
    : Array.isArray(value?.magnitudes) ? value.magnitudes
      : [];
  return source.map(entry => tradeEntryValueToText(entry, depth + 1)).filter(Boolean);
}

function renderTradeObjectText(value, depth) {
  for (const key of ['text', 'string', 'name', 'label', 'line', 'mod', 'descrText', 'description', 'displayText']) {
    if (value[key] == null || value[key] === value) continue;
    const template = tradeValueToText(value[key], depth + 1);
    if (!template) continue;

    const values = tradeObjectValuesToText(value, depth + 1);
    if (values.length === 0) return template;

    const rendered = template.replace(/\{(\d+)\}/g, (_, idx) => values[Number(idx)] || '');
    if (value.displayMode === 1) return `${values.join(' ')} ${rendered}`.trim();
    if (value.displayMode === 3 || rendered !== template) return rendered.trim();

    const missingValues = values.filter(v => v && !rendered.includes(v));
    return missingValues.length ? `${rendered} ${missingValues.join(' ')}`.trim() : rendered.trim();
  }
  return '';
}

function tradeValueToText(value, depth = 0) {
  if (value == null || depth > 8) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    const looksLikeValueTuple = value.length > 0 && value.length <= 3 &&
      (value.length === 1 || typeof value[1] === 'number' || typeof value[1] === 'string' || value[1] == null);
    if (looksLikeValueTuple) return tradeEntryValueToText(value, depth + 1);
    return value.map(entry => tradeValueToText(entry, depth + 1)).filter(Boolean).join(' ');
  }
  if (typeof value === 'object') {
    const rendered = renderTradeObjectText(value, depth + 1);
    if (rendered) return rendered;
    if (Object.prototype.hasOwnProperty.call(value, '0')) return tradeValueToText(value[0], depth + 1);
    if (value.min != null || value.max != null) {
      const min = value.min != null ? tradeValueToText(value.min, depth + 1) : '';
      const max = value.max != null ? tradeValueToText(value.max, depth + 1) : '';
      return min && max && min !== max ? `${min}~${max}` : (max || min);
    }
    for (const key of ['value', 'typeLine', 'baseType']) {
      if (value[key] != null && value[key] !== value) return tradeValueToText(value[key], depth + 1);
    }
  }
  return '';
}

function stripTradeTags(text) {
  return tradeValueToText(text)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:div|p|li|span)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTradeFirstNumber(text) {
  const match = stripTradeTags(text).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

function roundTradeValue(value) {
  if (!isFinite(value)) return NaN;
  return Math.abs(value) % 1 === 0 ? Math.abs(value) : Number(Math.abs(value).toFixed(2));
}

function parseTradePropertyValue(name, rawValue) {
  const text = stripTradeTags(rawValue).replace(/,/g, '');
  const range = text.match(/(-?\d+(?:\.\d+)?)\s*[-~]\s*(-?\d+(?:\.\d+)?)/);
  if (range) {
    const a = Number(range[1]);
    const b = Number(range[2]);
    if (!isNaN(a) && !isNaN(b)) {
      if (/damage/i.test(name) || /피해/.test(name)) return roundTradeValue((Math.abs(a) + Math.abs(b)) / 2);
      return roundTradeValue(Math.max(Math.abs(a), Math.abs(b)));
    }
  }
  return roundTradeValue(parseTradeFirstNumber(text));
}

function renderTradePropertyText(prop) {
  const name = stripTradeTags(prop?.name || '');
  const values = Array.isArray(prop?.values) ? prop.values.map(v => stripTradeTags(Array.isArray(v) ? v[0] : v)).filter(Boolean) : [];
  const templated = name.replace(/\{(\d+)\}/g, (_, idx) => values[Number(idx)] || '');
  if (values.length === 0) return templated.trim();
  if (prop?.displayMode === 1) return `${values.join(' ')} ${templated}`.trim();
  if (prop?.displayMode === 3) return templated.trim();
  return `${templated} ${values.join(' ')}`.trim();
}

function extractTradeEquipmentValues(text, id) {
  const s = stripTradeTags(text).replace(/,/g, ' ');
  if (id === 'damage') {
    const m = s.match(/(-?\d+(?:\.\d+)?)\s*[-~]\s*(-?\d+(?:\.\d+)?)/);
    return m ? [roundTradeValue((Math.abs(Number(m[1])) + Math.abs(Number(m[2]))) / 2)] : [];
  }
  const patterns = {
    aps: '(?:attacks per second|초당 공격(?: 횟수)?)',
    crit: '(?:critical hit chance|치명타 확률)',
    dps: '(?:^|\\b)dps(?:$|\\b)|초당 피해',
    pdps: '(?:physical dps|물리 dps)',
    edps: '(?:elemental dps|원소 dps)',
    reload_time: '(?:reload time|재장전 시간)',
    ar: '(?:armou?r|방어도)',
    ev: '(?:evasion(?: rating)?|회피(?:도| 등급)?)',
    es: '(?:energy shield|에너지 (?:실드|보호막))',
    block: '(?:block(?: chance)?|막기 확률)',
    spirit: '(?:spirit|정신력)'
  };
  const basePattern = patterns[id];
  if (!basePattern) return [];
  const values = [];
  const after = new RegExp(`${basePattern}[^\\d-]*(-?\\d+(?:\\.\\d+)?)`, 'ig');
  const before = new RegExp(`(-?\\d+(?:\\.\\d+)?)[^\\d]*(?:${basePattern})`, 'ig');
  let match;
  while ((match = after.exec(s))) values.push(roundTradeValue(Number(match[1])));
  while ((match = before.exec(s))) values.push(roundTradeValue(Number(match[1])));
  return values.filter(v => isFinite(v) && v > 0);
}

function extractTradeStatValue(text) {
  const s = stripTradeTags(text).replace(/,/g, '');
  const range = s.match(/(-?\d+(?:\.\d+)?)\s*(?:to|-|~)\s*(-?\d+(?:\.\d+)?)/i);
  if (range) return roundTradeValue((Math.abs(Number(range[1])) + Math.abs(Number(range[2]))) / 2);
  const single = s.match(/-?\d+(?:\.\d+)?/);
  return single ? roundTradeValue(Number(single[0])) : NaN;
}

function buildItemEquipmentValueMap(item) {
  const map = new Map();
  const properties = [];
  ['properties', 'additionalProperties', 'notableProperties'].forEach(key => {
    if (Array.isArray(item?.[key])) properties.push(...item[key]);
  });

  properties.forEach(prop => {
    const name = stripTradeTags(prop?.name || '');
    const lineText = renderTradePropertyText(prop);
    const rawValue = Array.isArray(prop?.values)
      ? prop.values.map(v => stripTradeTags(Array.isArray(v) ? v[0] : v)).filter(Boolean).join(' ')
      : lineText;

    const _equipRules = (typeof EQUIPMENT_PROPERTY_RULES !== 'undefined') ? EQUIPMENT_PROPERTY_RULES : [];
    for (const rule of _equipRules) {
      if (!rule.patterns.some(pattern => pattern.test(name) || pattern.test(lineText))) continue;
      const values = extractTradeEquipmentValues(lineText, rule.id);
      if (values.length) {
        values.forEach(value => map.set(rule.id, Math.max(map.get(rule.id) || 0, value)));
      } else {
        const numeric = parseTradePropertyValue(name || lineText, rawValue);
        if (isFinite(numeric) && numeric > 0) map.set(rule.id, Math.max(map.get(rule.id) || 0, numeric));
      }
    }
  });

  const runeSocketCount = Array.isArray(item?.sockets) ? item.sockets.filter(socket => socket?.type === 'rune').length : 0;
  if (runeSocketCount > 0) map.set('rune_sockets', runeSocketCount);
  return map;
}

function statIdSuffix(id) {
  return String(id || '').replace(/^[^.]+\./, '');
}

function buildItemStatValueMap(item) {
  const map = new Map();
  const ext = item?.extended || {};
  const hashes = ext.hashes || {};
  const categorySpecs = [
    { key: 'explicit', prop: 'explicitMods' },
    { key: 'implicit', prop: 'implicitMods' },
    { key: 'crafted', prop: 'craftedMods' },
    { key: 'enchant', prop: 'enchantMods' },
    { key: 'skill', prop: 'skillMods' },
    { key: 'rune', prop: 'runeMods' },
    { key: 'fractured', prop: 'fracturedMods' },
    { key: 'desecrated', prop: 'desecratedMods' },
    { key: 'utility', prop: 'utilityMods' }
  ];

  categorySpecs.forEach(spec => {
    const catHashes = hashes[spec.key] || [];
    const renderedTexts = item?.[spec.prop] || [];
    renderedTexts.forEach((renderedLine, idx) => {
      const fallbackId = Array.isArray(catHashes[idx]) ? catHashes[idx][0] : '';
      const parsedValue = extractTradeStatValue(renderedLine);
      if (!fallbackId || !isFinite(parsedValue) || parsedValue <= 0) return;
      const keys = [fallbackId, statIdSuffix(fallbackId)];
      keys.forEach(key => {
        if (!key) return;
        map.set(key, Math.max(map.get(key) || 0, parsedValue));
      });
    });
  });

  return map;
}

function getListingPriceInDivine(listingPrice) {
  if (!listingPrice) return null;
  const amount = Number(listingPrice.amount);
  if (!isFinite(amount) || amount <= 0) return null;
  const currency = String(listingPrice.currency || '').toLowerCase();
  if (currency === 'divine') return amount;
  const rate = Number(currentTradeRates[currency]);
  if (isFinite(rate) && rate > 0) return amount / rate;
  return null;
}

function getFilterStatActualValue(statMap, stat) {
  const ids = [stat.id, stat.fallbackId, statIdSuffix(stat.id), statIdSuffix(stat.fallbackId)];
  for (const id of ids) {
    if (!id) continue;
    const value = statMap.get(id);
    if (isFinite(value) && value > 0) return value;
  }
  return 0;
}

function buildSearchEvaluationContext(filter, results, topIds = []) {
  const activeEquipment = (filter.equipment || []).filter(entry => entry.active !== false && entry.id);
  const activeStats = (filter.stats || []).filter(entry => {
    if (entry.active === false) return false;
    if (entry.noValue) return false;
    const effectiveId = (entry.id && !entry.id.includes('unknown'))
      ? entry.id
      : (entry.fallbackId && !entry.fallbackId.includes('unknown') ? entry.fallbackId : '');
    return !!effectiveId;
  });

  const evaluations = {};
  const valueIndices = [];

  let skipped = 0;
  results.forEach((result, n) => {
    const item = result?.item;
    const listing = result?.listing;
    const aliasIds = Array.from(new Set([
      topIds[n],
      result?.id,
      item?.id,
      listing?.id,
      listing?.item?.id
    ].filter(Boolean).map(String)));
    if (!item || !listing || !aliasIds.length) { skipped++; return; }

    const equipmentMap = buildItemEquipmentValueMap(item);
    const statMap = buildItemStatValueMap(item);
    const parts = [];

    activeEquipment.forEach(entry => {
      const actual = Number(equipmentMap.get(entry.id) || 0);
      const target = Math.max(1, Math.abs(Number(entry.min != null ? entry.min : entry.value) || 0));
      if (!target) return;
      parts.push((actual / target) * 100);
    });

    activeStats.forEach(entry => {
      const actual = Number(getFilterStatActualValue(statMap, entry) || 0);
      const target = Math.max(1, Math.abs(Number(entry.min != null ? entry.min : entry.value) || 0));
      if (!target) return;
      parts.push((actual / target) * 100);
    });

    const statScore = parts.length
      ? Number((parts.reduce((sum, value) => sum + value, 0) / parts.length).toFixed(1))
      : 0;
    const priceDiv = getListingPriceInDivine(listing.price);
    const valueIndex = priceDiv ? Number((statScore / priceDiv).toFixed(2)) : null;
    if (valueIndex != null) valueIndices.push(valueIndex);

    const payload = {
      itemId: aliasIds[0],
      name: item.name || item.typeLine || '',
      statScore,
      priceDiv,
      priceText: listing.price ? `${listing.price.amount} ${listing.price.currency}` : '',
      valueIndex,
      tier: priceDiv ? '평균' : '평가 보류',
      ratioToMedian: null
    };
    aliasIds.forEach(id => {
      evaluations[id] = payload;
    });
  });
  if (skipped > 0) console.log('[POE2TQ] skipped', skipped, 'results (missing item/listing)');

  const sorted = valueIndices.slice().sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : null;

  Object.values(evaluations).forEach(entry => {
    if (!median || entry.valueIndex == null) {
      entry.tier = '평가 보류';
      return;
    }
    entry.ratioToMedian = Number((entry.valueIndex / median).toFixed(2));
    if (entry.ratioToMedian >= 1.18) entry.tier = '저평가';
    else if (entry.ratioToMedian <= 0.85) entry.tier = '고평가';
    else entry.tier = '평균';
  });

  return {
    createdAt: new Date().toISOString(),
    tradeRealm: getFilterTradeRealm(filter),
    league: settings.league,
    filterId: filter.id,
    filterName: filter.name,
    medianValueIndex: median,
    evaluations
  };
}

async function persistSearchEvaluationContext(queryId, context) {
  if (!queryId || !context) return;
  const existing = await chrome.storage.local.get([SEARCH_EVAL_KEY]);
  const contexts = existing[SEARCH_EVAL_KEY] || {};
  contexts[queryId] = context;
  const keys = Object.keys(contexts).sort((a, b) => {
    const aTime = new Date(contexts[a]?.createdAt || 0).getTime();
    const bTime = new Date(contexts[b]?.createdAt || 0).getTime();
    return bTime - aTime;
  });
  keys.slice(20).forEach(key => delete contexts[key]);
  await chrome.storage.local.set({ [SEARCH_EVAL_KEY]: contexts });
}

function currencyLabel(currency) {
  const map = {
    'divine': 'div',
    'exalted': 'ex',
    'chaos': 'chaos',
    'annulment': 'ann',
    'blessed': 'bles',
    'transmutation': 'trans',
    'augmentation': 'aug',
    'alteration': 'alt',
    'regal': 'reg',
    'vaal': 'vaal',
    'jewellers': 'jew',
    'fusing': 'fuse',
    'chromatic': 'chrom',
    'chance': 'chance',
    'scouring': 'scour',
    'alchemy': 'alch',
    'orb-of-conflict': 'conflict',
    'greater-jewellers': 'g.jew',
    'perfect-jewellers': 'p.jew',
    'artificers': 'art',
    'glassblowers': 'glass',
    'mirror': 'mirror',
    'fracturing': 'frac',
    'enkindling': 'enk',
    'instilling': 'inst',
  };
  return map[currency] || currency;
}

function makeCard(f) {
  const wrap = document.createElement('div');
  wrap.className = 'filter-card';
  wrap.id = `card-${f.id}`;
  wrap.dataset.filterId = String(f.id);
  wrap.draggable = false;
  const selectedBuild = getSelectedBuild();
  const activeBuildTab = getActiveBuildTab(selectedBuild);
  const allBuildsForMove = getCurrentBuilds();
  const currentBuildId = allBuildsForMove.find(b => b.tabs.some(t => (t.filterIds || []).includes(String(f.id))))?.id || selectedBuild?.id || '';
  const currentTabId = (() => {
    const ownerBuild = allBuildsForMove.find(b => b.id === currentBuildId);
    return ownerBuild?.tabs.find(t => (t.filterIds || []).includes(String(f.id)))?.id || activeBuildTab?.id || '';
  })();
  const moveOptions = allBuildsForMove.map(build => {
    return build.tabs.map(tab => {
      const isCurrent = build.id === currentBuildId && tab.id === currentTabId;
      return `<option value="${build.id}:${tab.id}" ${isCurrent ? 'selected' : ''}>${esc(build.name)} · ${esc(tab.name)}</option>`;
    }).join('');
  }).join('');

  const rarityClass = {rare:'badge-rare',unique:'badge-unique',magic:'badge-magic'}[f.rarity] || '';
  const rarityColor = {rare:'#f0c830',unique:'#af6025',magic:'#8888ff',normal:'#c8c8c8'}[f.rarity] || '#c8b98a';
  const catLabel = f.category ? f.category.split('.').pop() : '';

  const summary = [TRADE_REALM_LABELS[getFilterTradeRealm(f)]];
  const ilvlMinNum = Number(f.ilvlMin);
  const ilvlMaxNum = Number(f.ilvlMax);
  const hasIlvlMin = isFinite(ilvlMinNum) && ilvlMinNum > 0;
  const hasIlvlMax = isFinite(ilvlMaxNum) && ilvlMaxNum > 0;
  const ilvlLabel = hasIlvlMin && hasIlvlMax
    ? `iLvl ${f.ilvlMin}~${f.ilvlMax}`
    : (hasIlvlMin ? `iLvl ${f.ilvlMin}+` : (hasIlvlMax ? `iLvl ~${f.ilvlMax}` : ''));
  if (ilvlLabel) summary.push(ilvlLabel);
  const activeEquipment = (f.equipment||[]).filter(e => e.active !== false);
  if (activeEquipment.length) summary.push(`장비 ${activeEquipment.length}개`);
  const activeQueryFilters = (f.queryFilters||[]).filter(q => q.active !== false);
  if (activeQueryFilters.length) summary.push(`거래 ${activeQueryFilters.length}개`);
  const activeStats = (f.stats||[]).filter(s => s.active !== false);
  if (activeStats.length) summary.push(`스탯 ${activeStats.length}개`);

  const baseChips = [
    ilvlLabel    ? `<span class="info-chip ilvl">📦 ${ilvlLabel}</span>` : '',
    f.areaLvlMin ? `<span class="info-chip area">🗺 지역Lv ${f.areaLvlMin}+</span>` : '',
    f.note       ? `<span class="info-chip">📝 ${esc(f.note)}</span>` : '',
  ].join('');

  const makeInlineRange = (type, i, minVal, maxVal, item) => {
    if (minVal == null && maxVal == null) return '';
    const idxAttr = type === 'equip' ? 'data-equip-idx' : 'data-stat-idx';
    const minClass = type === 'equip' ? 'equip-min-value' : 'stat-min-value';
    const maxClass = type === 'equip' ? 'equip-max-value' : 'stat-max-value';
    const minText = minVal != null ? esc(item.min) : '';
    const maxText = maxVal != null ? esc(item.max) : '';
    const minEmpty = minVal == null ? ' range-empty' : '';
    const maxEmpty = maxVal == null ? ' range-empty' : '';
    return `<span class="${minClass}${minEmpty}" data-filter-id="${esc(f.id)}" ${idxAttr}="${i}" data-range-bound="min" title="마우스 휠로 min 조정">${minText}</span>
        <span class="stat-range-sep">~</span>
        <span class="${maxClass}${maxEmpty}" data-filter-id="${esc(f.id)}" ${idxAttr}="${i}" data-range-bound="max" title="마우스 휠로 max 조정">${maxText}</span>`;
  };

  const equipmentRows = (f.equipment||[]).map((s, i) => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    const minVal = numberOrNull(s.min);
    const maxVal = numberOrNull(s.max);
    const rangeHtml = makeInlineRange('equip', i, minVal, maxVal, s);
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}">
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        ${rangeHtml}
      </span>
    </div>`;
  }).join('');

  const statRows = (f.stats||[]).map((s, i) => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    const minVal = numberOrNull(s.min);
    const maxVal = numberOrNull(s.max);
    const rangeHtml = s.noValue ? '' : makeInlineRange('stat', i, minVal, maxVal, s);
    const rawId = s.id || s.fallbackId || '';
    const prefixMatch = rawId.match(/^([^.]+)\./);
    const prefix = prefixMatch ? prefixMatch[1] : null;
    const knownPrefix = prefix && CATEGORY_LABELS[prefix] ? prefix : null;
    const badgeHtml = knownPrefix
      ? `<button class="cat-badge cat-badge-${knownPrefix}" data-stat-idx="${i}">${CATEGORY_LABELS[knownPrefix]}</button>`
      : (prefix ? `<button class="cat-badge cat-badge-explicit" data-stat-idx="${i}" style="opacity:0.5">${prefix}</button>` : '');
    return `<div class="stat-row-item stat-row-with-delete" style="${active?'':'opacity:.4'}" data-stat-idx="${i}">
      ${badgeHtml}
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        ${rangeHtml}
      </span>
      <button class="stat-delete-btn" data-filter-id="${f.id}" data-stat-idx="${i}" title="이 스탯 삭제">×</button>
    </div>`;
  }).join('');

  const queryFilterRows = (f.queryFilters||[]).map((q, i) => {
    const active = q.active !== false;
    const textHtml = q.textValue ? `<span class="stat-orig">${esc(q.textValue)}</span>` : '';
    const minVal = numberOrNull(q.min);
    const maxVal = numberOrNull(q.max);
    const rangeHtml = q.noValue ? '' : `<span class="query-min-value${minVal == null ? ' range-empty' : ''}" data-filter-id="${esc(f.id)}" data-query-idx="${i}" data-range-bound="min" title="마우스 휠로 min 조정">${minVal != null ? esc(q.min) : ''}</span>
        <span class="stat-range-sep">~</span>
        <span class="query-max-value${maxVal == null ? ' range-empty' : ''}" data-filter-id="${esc(f.id)}" data-query-idx="${i}" data-range-bound="max" title="마우스 휠로 max 조정">${maxVal != null ? esc(q.max) : ''}</span>`;
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}">
      <span class="badge badge-cat">${esc(formatTradeQueryFilterGroupLabel(q.group))}</span>
      <span class="stat-label-t">${esc(q.label)}</span>
      <span class="stat-vals">
        ${textHtml}
        ${rangeHtml}
      </span>
    </div>`;
  }).join('');

  wrap.innerHTML = `
    <div class="filter-card-head" data-id="${f.id}">
      <button class="filter-drag-handle" type="button" title="드래그해서 순서 변경" aria-label="필터 순서 변경">⋮⋮</button>
      <span class="card-arrow">▶</span>
      <div class="card-title">
        <div class="card-name" style="color:${rarityColor}"><span class="filter-name-edit" contenteditable="false" title="클릭해서 이름 편집">${esc(f.name)}</span></div>
        <div class="card-sub">${summary.join(' · ') || '저장된 아이템'}</div>
      </div>
      <div class="card-badges">
        ${catLabel ? `<span class="badge badge-cat">${catLabel}</span>` : ''}
        ${f.rarity ? `<span class="badge ${rarityClass}">${f.rarity}</span>` : ''}
        ${f.typeLine ? `<span class="badge type-line-badge ${f.typeLineActive !== false ? 'active' : 'inactive'}" title="클릭해서 기반 유형 필터 토글">${esc(f.typeLine)}</span>` : ''}
        ${f.savedPrice ? `<span class="saved-price-badge">${f.savedPrice.amount} ${currencyLabel(f.savedPrice.currency)}</span>` : ''}
        <button class="btn-delete-small" data-id="${f.id}" title="필터 삭제">×</button>
      </div>
    </div>

    <div class="card-quick">
      <button class="btn-search-q"   data-id="${f.id}">🔍 새창</button>
      <button class="btn-search-cur" data-id="${f.id}">🔗 현재창</button>
      ${allBuildsForMove.length > 0 ? `
        <div class="league-combobox build-move-control" data-custom-select>
          <select class="league-native-select" data-move-filter="${f.id}" aria-hidden="true" tabindex="-1" title="빌드/탭으로 이동">${moveOptions}</select>
          <button type="button" class="league-select-btn" data-custom-select-trigger aria-haspopup="listbox" aria-expanded="false" title="빌드/탭으로 이동">
            <span class="league-select-value" data-custom-select-value></span><span class="league-select-arrow" aria-hidden="true">▼</span>
          </button>
          <div class="league-select-menu" data-custom-select-menu role="listbox" hidden></div>
        </div>` : ''}
    </div>

    <div class="card-detail">
      ${baseChips ? `<div class="base-info">${baseChips}</div>` : ''}
      ${equipmentRows ? `<div class="stat-table">
        <div class="stat-table-title">장비 조건 (원본값 → min / max)</div>
        ${equipmentRows}
      </div>` : ''}
      ${queryFilterRows ? `<div class="stat-table">
        <div class="stat-table-title">거래소 조건</div>
        ${queryFilterRows}
      </div>` : ''}
      ${statRows ? `<div class="stat-table">
        <div class="stat-table-title">스탯 조건 (원본값 → min / max)</div>
        ${statRows}
      </div>` : ''}
      <div id="result-${f.id}"></div>
    </div>
  `;

  wrap.querySelector('.filter-card-head').addEventListener('click', e => {
    if (e.target.closest('.filter-drag-handle, .cat-badge, .stat-delete-btn, .stat-min-value, .stat-max-value, .equip-min-value, .equip-max-value, .query-min-value, .query-max-value, .filter-name-edit, .type-line-badge, .btn-delete-small, button')) return;
    wrap.classList.toggle('open');
  });

  const dragHandle = wrap.querySelector('.filter-drag-handle');
  if (dragHandle) {
    dragHandle.addEventListener('mousedown', e => {
      e.stopPropagation();
      wrap.dataset.dragReady = '1';
      wrap.draggable = true;
    });
    dragHandle.addEventListener('mouseup', () => {
      if (!draggingFilterId) {
        wrap.draggable = false;
        delete wrap.dataset.dragReady;
      }
    });
  }

  wrap.addEventListener('dragstart', e => {
    if (wrap.dataset.dragReady !== '1') {
      e.preventDefault();
      return;
    }
    draggingFilterId = String(f.id);
    const list = document.getElementById('filterList');
    filterOrderBeforeDrag = getFilterCardVisualIds(list).join('|');
    wrap.classList.add('dragging');
    list?.classList.add('drag-sorting');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggingFilterId);
  });

  wrap.addEventListener('dragend', () => {
    const list = document.getElementById('filterList');
    commitFilterDragOrder(list);
  });

  const replaceCardKeepingOpen = target => {
    const wasOpen = wrap.classList.contains('open');
    const newCard = makeCard(target);
    wrap.replaceWith(newCard);
    if (wasOpen) newCard.classList.add('open');
  };

  // Inline name editing
  const nameEl = wrap.querySelector('.filter-name-edit');
  let _prevName = f.name;

  nameEl.addEventListener('click', e => {
    e.stopPropagation();
    if (nameEl.contentEditable === 'true') return;
    _prevName = nameEl.textContent;
    nameEl.contentEditable = 'true';
    nameEl.focus();
    const range = document.createRange();
    range.selectNodeContents(nameEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });

  const saveName = () => {
    nameEl.contentEditable = 'false';
    const newName = nameEl.textContent.trim();
    if (!newName) {
      nameEl.textContent = _prevName;
      return;
    }
    if (newName === _prevName) return;
    f.name = newName;
    _prevName = newName;
    persist();
  };

  nameEl.addEventListener('blur', saveName);

  nameEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nameEl.blur();
    }
    if (e.key === 'Escape') {
      nameEl.textContent = _prevName;
      nameEl.contentEditable = 'false';
    }
  });
  wrap.querySelector('.btn-search-q').addEventListener('click', e => { e.stopPropagation(); if(!wrap.classList.contains('open')) wrap.classList.add('open'); doSearch(f.id, true); });
  wrap.querySelector('.btn-search-cur').addEventListener('click', e => { e.stopPropagation(); if(!wrap.classList.contains('open')) wrap.classList.add('open'); doSearch(f.id, false); });
  wrap.querySelector('.btn-delete-small').addEventListener('click', e => { e.stopPropagation(); delFilter(f.id); });
  const moveSelect = wrap.querySelector('[data-move-filter]');
  if (moveSelect) {
    const moveControl = moveSelect.closest('[data-custom-select]');
    moveControl?.addEventListener('click', e => e.stopPropagation());
    moveSelect.addEventListener('change', e => {
      e.stopPropagation();
      const [targetBuildId, targetTabId] = moveSelect.value.split(':');
      if (!targetBuildId || !targetTabId) return;
      const curBuild = getSelectedBuild();
      if (targetBuildId === curBuild?.id) {
        moveFilterToBuildTab(targetBuildId, f.id, targetTabId);
      } else {
        moveFilterToBuild(f.id, targetBuildId, targetTabId);
      }
    });
    bindCustomSelectControls(wrap);
  }

  // typeLine badge toggle
  const typeLineBadgeEl = wrap.querySelector('.type-line-badge');
  if (typeLineBadgeEl) {
    typeLineBadgeEl.addEventListener('click', e => {
      e.stopPropagation();
      f.typeLineActive = f.typeLineActive === false;
      typeLineBadgeEl.classList.toggle('active', f.typeLineActive !== false);
      typeLineBadgeEl.classList.toggle('inactive', f.typeLineActive === false);
      persist();
    });
  }

  // Feature 2: stat row inline delete buttons
  wrap.querySelectorAll('.stat-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const filterId = btn.dataset.filterId;
      const statIdx  = parseInt(btn.dataset.statIdx, 10);
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.stats) return;
      target.stats.splice(statIdx, 1);
      updateFilterSourceHash(target);
      persist();
      replaceCardKeepingOpen(target);
    });
  });

  const adjustInlineRange = (item, field, delta, allowNegative) => {
    const cur = numberOrNull(item[field]);
    const min = numberOrNull(item.min);
    const max = numberOrNull(item.max);
    let base = cur;
    if (base == null) {
      base = field === 'max' && min != null ? min : (field === 'min' && max != null ? max : 0);
    }
    let next = Number(base) + delta;
    if (!allowNegative) next = Math.max(0, next);
    if (field === 'min' && max != null) next = Math.min(next, max);
    if (field === 'max' && min != null) next = Math.max(next, min);
    item[field] = Number.isInteger(next) ? next : Number(next.toFixed(2));
  };

  // Feature: mouse wheel on inline min/max spans to adjust range values
  wrap.querySelectorAll('.stat-min-value, .stat-max-value').forEach(span => {
    span.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const filterId = span.dataset.filterId;
      const statIdx  = parseInt(span.dataset.statIdx, 10);
      const field = span.dataset.rangeBound === 'max' ? 'max' : 'min';
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.stats || !target.stats[statIdx]) return;
      const delta = e.deltaY < 0 ? 1 : -1;
      const stat = target.stats[statIdx];
      if (stat.noValue && numberOrNull(stat.min) == null && numberOrNull(stat.max) == null) return;
      adjustInlineRange(stat, field, delta, true);
      stat.noValue = numberOrNull(stat.min) == null && numberOrNull(stat.max) == null;
      updateFilterSourceHash(target);
      persist();
      replaceCardKeepingOpen(target);
    }, { passive: false });
  });

  // Feature: mouse wheel on inline equipment min/max spans to adjust range values
  wrap.querySelectorAll('.equip-min-value, .equip-max-value').forEach(span => {
    span.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const filterId = span.dataset.filterId;
      const equipIdx = parseInt(span.dataset.equipIdx, 10);
      const field = span.dataset.rangeBound === 'max' ? 'max' : 'min';
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.equipment || !target.equipment[equipIdx]) return;
      const delta = e.deltaY < 0 ? 1 : -1;
      adjustInlineRange(target.equipment[equipIdx], field, delta, false);
      updateFilterSourceHash(target);
      persist();
      replaceCardKeepingOpen(target);
    }, { passive: false });
  });

  wrap.querySelectorAll('.query-min-value, .query-max-value').forEach(span => {
    span.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const filterId = span.dataset.filterId;
      const queryIdx = parseInt(span.dataset.queryIdx, 10);
      const field = span.dataset.rangeBound === 'max' ? 'max' : 'min';
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.queryFilters || !target.queryFilters[queryIdx]) return;
      const delta = e.deltaY < 0 ? 1 : -1;
      const queryFilter = target.queryFilters[queryIdx];
      if (queryFilter.noValue && numberOrNull(queryFilter.min) == null && numberOrNull(queryFilter.max) == null) return;
      adjustInlineRange(queryFilter, field, delta, false);
      queryFilter.noValue = numberOrNull(queryFilter.min) == null && numberOrNull(queryFilter.max) == null && !queryFilter.textValue;
      updateFilterSourceHash(target);
      persist();
      replaceCardKeepingOpen(target);
    }, { passive: false });
  });

  // Feature: category badge cycle on filter cards
  wrap.querySelectorAll('.cat-badge').forEach(badge => {
    badge.addEventListener('click', e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const statIdx = parseInt(badge.dataset.statIdx, 10);
      const stat = f.stats[statIdx];
      if (!stat || !stat.id) return;
      const match = stat.id.match(/^([^.]+)\.(.+)$/);
      if (!match) return;
      const [, curPrefix, rest] = match;
      const curIdx = CATEGORY_PREFIXES.indexOf(curPrefix);
      // If unknown prefix, start from explicit (index 0), else advance by 1
      const nextPrefix = CATEGORY_PREFIXES[(curIdx + 1) % CATEGORY_PREFIXES.length];
      stat.id = `${nextPrefix}.${rest}`;
      // Update badge in-place
      badge.textContent = CATEGORY_LABELS[nextPrefix] || nextPrefix;
      badge.className = `cat-badge cat-badge-${nextPrefix}`;
      badge.style.opacity = '';
      updateFilterSourceHash(f);
      persist();
    });
  });

  return wrap;
}

async function doSearch(id, openInNew = true) {
  const f = getCurrentFilters().find(x => String(x.id) === String(id));
  if (!f) return;
  const rd  = document.getElementById(`result-${id}`);
  const btnNew = document.querySelector(`.btn-search-q[data-id="${id}"]`);
  const btnCur = document.querySelector(`.btn-search-cur[data-id="${id}"]`);
  rd.innerHTML = `<div class="result-area"><div style="text-align:center;padding:10px;color:#6a5a3a"><span class="spin"></span> 검색 ID 발급 중...</div></div>`;
  if (btnNew) { btnNew.classList.add('loading'); btnNew.disabled = true; btnNew.innerHTML = '<span class="spin"></span> 검색 중'; }
  if (btnCur) { btnCur.classList.add('loading'); btnCur.disabled = true; btnCur.innerHTML = '<span class="spin"></span>'; }

  let searchLeague = f.league || settings.league;
  let searchRealm = getFilterTradeRealm(f);
  let query = null;
  let querySource = '';
  try {
    const hydrated = await hydrateTradeQueryTemplate(f);
    searchLeague = f.league || settings.league;
    searchRealm = getFilterTradeRealm(f);
    let localizedFilterChanged = false;
    if (searchRealm === TRADE_REALM_POE1 && (f.itemName || f.typeLine || f.canonicalTypeLine)) {
      await loadPoe1ItemNamesKo();
      const localizedItemName = f.rarity === 'unique' ? poe1ItemNamesKo?.[f.itemName] : '';
      if (localizedItemName && localizedItemName !== f.itemName) {
        f.itemName = localizedItemName;
        localizedFilterChanged = true;
      }
      const currentBaseType = f.canonicalTypeLine || f.typeLine || '';
      const localizedBaseType = poe1ItemNamesKo?.[currentBaseType] || poe1ItemNamesKo?.[f.typeLine];
      if (localizedBaseType && (f.typeLine !== localizedBaseType || f.canonicalTypeLine !== localizedBaseType)) {
        f.typeLine = localizedBaseType;
        f.canonicalTypeLine = localizedBaseType;
        localizedFilterChanged = true;
      }
    }
    const baseTypeChanged = await canonicalizeSavedFilterBaseType(f, searchRealm);
    query = buildQuery(f, searchRealm);
    await canonicalizeQueryBaseTypeOrThrow(query, searchRealm);
    if (baseTypeChanged || localizedFilterChanged) {
      updateFilterSourceHash(f);
      persist();
    }
    querySource = f.tradeQueryTemplate ? 'trade-query-template' : 'assembled-filter';
    appendSidepanelDebugLog({
      kind: 'search-diagnostic',
      realm: searchRealm,
      league: searchLeague,
      filterId: f.id,
      filterName: f.name,
      hydratedTradeQueryTemplate: hydrated,
      querySource,
      filterSummary: summarizeFilterForDebug(f),
      querySummary: summarizeTradeQueryForDebug(query.query),
      query
    });
    let sData;
    try {
      sData = await postTradeSearch(searchRealm, searchLeague, query);
    } catch (searchErr) {
      if (shouldRunExactBasePostFilterFallback(searchErr, searchRealm, query)) {
        await runExactBasePostFilterSearch({
          realm: searchRealm,
          league: searchLeague,
          filter: f,
          query,
          originalError: searchErr,
          querySource,
          rd
        });
        return;
      }
      throw searchErr;
    }
    if (!sData.id) throw new Error('검색 ID를 받지 못했습니다');
    appendSidepanelDebugLog({
      kind: 'search-result',
      realm: searchRealm,
      league: searchLeague,
      filterId: f.id,
      filterName: f.name,
      querySource,
      queryId: sData.id,
      total: sData.total || 0,
      resultCount: Array.isArray(sData.result) ? sData.result.length : 0,
      querySummary: summarizeTradeQueryForDebug(query.query)
    });
    const topIds = Array.isArray(sData.result) ? sData.result.slice(0, 20) : [];
    if (topIds.length) {
      try {
        const fetchRes = await fetchTradeJson(searchRealm, buildTradeFetchUrl(searchRealm, topIds, sData.id), { credentials: 'include' });
        if (fetchRes.ok) {
          const fetchData = fetchRes.payload;
          console.log('[POE2TQ] fetch result count:', (fetchData.result || []).length, 'sample[0]:', JSON.stringify(fetchData.result?.[0]).slice(0, 200));
          const context = buildSearchEvaluationContext(f, fetchData.result || [], topIds);
          await persistSearchEvaluationContext(sData.id, context);
          console.log('[POE2TQ] saved eval context:', sData.id, Object.keys(context.evaluations || {}).length, 'evals');
        }
      } catch (evalErr) {
        console.error('[POE2TQ] eval error:', evalErr);
        appendSidepanelDebugLog({
          kind: 'search-eval-error',
          league: searchLeague,
          filterId: f.id,
          filterName: f.name,
          queryId: sData.id,
          message: evalErr.message
        });
      }
    }
    const url = buildTradeSearchPageUrl(searchRealm, searchLeague, sData.id);
    if (openInNew) {
      console.log('[POE2TQ] tabs.create url:', url);
      chrome.tabs.create({ url });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs && tabs[0]) {
          console.log('[POE2TQ] tabs.update tab:', tabs?.[0]?.id, tabs?.[0]?.url, '→', url);
          chrome.tabs.update(tabs[0].id, { url });
        } else {
          console.log('[POE2TQ] tabs.create url:', url);
          chrome.tabs.create({ url });
        }
      });
    }
    const total = (sData.total || 0).toLocaleString();
    const openLabel = openInNew ? '새 탭에' : '현재 탭에서';
    rd.innerHTML = `<div class="result-area"><div style="text-align:center;padding:10px;color:#80d040;font-size:11px">✅ 거래소 검색 결과를 ${openLabel} 열었습니다 (총 ${total}개)<br/><a href="${url}" target="_blank" style="color:#5080a0;font-size:10px">다시 열기 →</a></div></div>`;
  } catch(err) {
    const errorQuery = err.query || query;
    appendSidepanelDebugLog({
      kind: 'search-error',
      realm: searchRealm,
      league: searchLeague,
      filterId: f.id,
      filterName: f.name,
      querySource,
      message: err.message,
      status: err.status || 0,
      responsePayload: err.payload || null,
      submittedBaseType: errorQuery ? getQueryBaseTypeText(errorQuery) : '',
      filterSummary: summarizeFilterForDebug(f),
      querySummary: errorQuery?.query ? summarizeTradeQueryForDebug(errorQuery.query) : null,
      query: errorQuery
    });
    renderSearchError(rd, err, f, errorQuery, { realm: searchRealm, league: searchLeague, querySource });
  } finally {
    if (btnNew) { btnNew.classList.remove('loading'); btnNew.disabled = false; btnNew.innerHTML = '🔍 새창'; }
    if (btnCur) { btnCur.classList.remove('loading'); btnCur.disabled = false; btnCur.innerHTML = '🔗 현재창'; }
  }
}

async function postTradeSearch(realm, league, queryPayload) {
  const res = await fetchTradeJson(realm, buildTradeApiSearchUrl(realm, league), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(queryPayload)
  });
  if (!res.ok) {
    const e = res.payload || {};
    const error = new Error(e?.error?.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.payload = e;
    error.query = queryPayload;
    error.submittedBaseType = getQueryBaseTypeText(queryPayload);
    throw error;
  }
  return res.payload;
}

function buildQuery(f, realm = getFilterTradeRealm(f)) {
  const templateQuery = buildQueryFromTradeTemplate(f, realm);
  if (templateQuery) return templateQuery;

  const normalizedRealm = normalizeTradeRealm(realm);
  const defaultStatusOption = 'securable';
  const statusOption = normalizedRealm === TRADE_REALM_POE1
    ? defaultStatusOption
    : (f.tradeStatusOption || defaultStatusOption);
  const q = { query:{ status:{ option: statusOption }, filters:{}, stats:[{type:'and',filters:[]}] }, sort:{price:'asc'} };
  if (f.rarity === 'unique' && shouldUseTextTradeValue(realm, f.itemName) && f.itemName !== f.typeLine) {
    q.query.name = f.itemName;
  }
  const tf = {};
  if (f.rarity)   tf.rarity   = { option: f.rarity };
  if (f.category) tf.category = { option: f.category };
  const searchTypeLine = f.canonicalTypeLine || f.typeLine || '';
  if (normalizedRealm === TRADE_REALM_POE1 && searchTypeLine && f.typeLineActive !== false && shouldUseTextTradeValue(realm, searchTypeLine)) {
    q.query.type = searchTypeLine;
  }
  if (searchTypeLine && f.typeLineActive !== false && shouldUseTextTradeValue(realm, searchTypeLine)) {
    if (normalizedRealm !== TRADE_REALM_POE1) tf.type = { option: searchTypeLine };
  }
  if (Object.keys(tf).length) q.query.filters.type_filters = { filters: tf };

  const mf = {};
  const ilvlMin = Number(f.ilvlMin);
  const ilvlMax = Number(f.ilvlMax);
  const ilvlValue = {};
  if (isFinite(ilvlMin) && ilvlMin > 0) ilvlValue.min = ilvlMin;
  if (isFinite(ilvlMax) && ilvlMax > 0) ilvlValue.max = ilvlMax;
  if (Object.keys(ilvlValue).length) mf.ilvl = ilvlValue;
  if (f.areaLvlMin) mf.area_level = { min: Number(f.areaLvlMin) };
  if (Object.keys(mf).length) q.query.filters.misc_filters = { filters: mf };

  const hasSavedSaleTypeFlag = Object.prototype.hasOwnProperty.call(f, 'tradeSaleTypeActive');
  if (!hasSavedSaleTypeFlag || f.tradeSaleTypeActive !== false) {
    q.query.filters.trade_filters = {
      filters: { sale_type: { option: f.tradeSaleTypeOption || 'priced' } }
    };
  }

  applyAssembledQueryFilters(q.query.filters, f.queryFilters);

  Object.assign(q.query.filters, POE2TQTradeCompat.buildEquipmentFilterGroups(realm, f.equipment));

  const statFilters = [];
  (f.stats || []).forEach(s => {
    if (s.active === false) return;
    const effectiveId = (s.id && !s.id.includes('unknown'))
      ? s.id
      : (s.fallbackId && !s.fallbackId.includes('unknown') ? s.fallbackId : null);
    if (!effectiveId) return;
    if (s.noValue) {
      statFilters.push({ id: effectiveId, disabled: false });
      return;
    }
    // Negative stats (감소/reduction mods) are stored with negative min values.
    // The trade API requires these to be queried with `max` (not `min`) so that
    // items with a roll of -35 or better (more negative = more reduction) are found.
    const minVal = numberOrNull(s.min);
    const maxVal = numberOrNull(s.max);
    const statValue = {};
    if (minVal != null) {
      if (minVal < 0 && maxVal == null) statValue.max = minVal;
      else statValue.min = minVal;
    }
    if (maxVal != null) statValue.max = maxVal;
    if (!Object.keys(statValue).length) {
      statFilters.push({ id: effectiveId, disabled: false });
      return;
    }
    statFilters.push({ id: effectiveId, value: statValue, disabled: false });
  });
  if (statFilters.length) {
    q.query.stats[0].filters = statFilters;
  }
  return q;
}

function shouldUseTextTradeValue(realm, value) {
  const text = String(value || '').trim();
  if (!text) return false;
  return normalizeTradeRealm(realm) !== TRADE_REALM_POE1
    || getTradeEndpoint(realm).apiBase.includes('poe.game.daum.net')
    || /^[\x00-\x7F]+$/.test(text);
}

function pruneEmptyTradeFilterGroups(filters) {
  Object.keys(filters || {}).forEach(groupName => {
    const group = filters[groupName];
    if (group?.filters && !Object.keys(group.filters).length) delete filters[groupName];
  });
}

function sanitizeTradeQueryTextValuesForRealm(query, realm) {
  if (normalizeTradeRealm(realm) !== TRADE_REALM_POE1 || !query || typeof query !== 'object') return query;
  query.status = { option: 'securable' };
  if (!shouldUseTextTradeValue(realm, query.name)) delete query.name;
  if (!shouldUseTextTradeValue(realm, query.type)) delete query.type;

  const typeFilters = query.filters?.type_filters?.filters;
  if (typeFilters?.type) {
    const typeValue = typeFilters.type.option ?? typeFilters.type.input ?? '';
    if (!shouldUseTextTradeValue(realm, typeValue)) delete typeFilters.type;
  }
  pruneEmptyTradeFilterGroups(query.filters);
  return query;
}

function buildQueryFromTradeTemplate(f, realm = getFilterTradeRealm(f)) {
  const query = cloneJsonSafe(f.tradeQueryTemplate);
  if (!query || typeof query !== 'object') return null;
  sanitizeTradeQueryTextValuesForRealm(query, realm);
  applyFilterStatsToTradeQuery(query, f);
  applyFilterEquipmentToTradeQuery(query, f);
  applyFilterQueryFiltersToTradeQuery(query, f);
  return { query, sort: { price: 'asc' } };
}

function applyAssembledQueryFilters(targetFilters, queryFilters) {
  (queryFilters || []).forEach(entry => {
    if (!entry || entry.active === false || !entry.group || !entry.id) return;
    if (!targetFilters[entry.group]) targetFilters[entry.group] = { filters: {} };
    if (!targetFilters[entry.group].filters) targetFilters[entry.group].filters = {};
    const target = {};
    const minVal = numberOrNull(entry.min);
    const maxVal = numberOrNull(entry.max);
    if (entry.textKey && entry.textValue) target[entry.textKey] = entry.textValue;
    if (minVal != null || maxVal != null) {
      target.value = {};
      if (minVal != null) target.value.min = minVal;
      if (maxVal != null) target.value.max = maxVal;
    }
    if (Object.keys(target).length === 0 && entry.noValue) {
      targetFilters[entry.group].filters[entry.id] = {};
      return;
    }
    if (Object.keys(target).length) {
      targetFilters[entry.group].filters[entry.id] = target;
    }
  });
}

function applyFilterStatsToTradeQuery(query, filter) {
  const statById = new Map();
  (filter.stats || []).forEach(stat => {
    [stat.id, stat.fallbackId].forEach(id => {
      if (id && !String(id).includes('unknown')) statById.set(id, stat);
    });
  });

  (query.stats || []).forEach(group => {
    (group.filters || []).forEach(queryFilter => {
      const stat = statById.get(queryFilter?.id || '');
      if (!stat) return;
      queryFilter.disabled = stat.active === false;
      const minVal = numberOrNull(stat.min);
      const maxVal = numberOrNull(stat.max);
      if (stat.noValue || (minVal == null && maxVal == null)) {
        delete queryFilter.value;
        return;
      }
      const value = {};
      if (minVal != null) {
        if (minVal < 0 && maxVal == null) value.max = minVal;
        else value.min = minVal;
      }
      if (maxVal != null) value.max = maxVal;
      if (Object.keys(value).length) queryFilter.value = value;
    });
  });
}

function applyFilterEquipmentToTradeQuery(query, filter) {
  POE2TQTradeCompat.applyEquipmentToTemplateFilters(query.filters || {}, filter.equipment || []);
}

function setTradeQueryFilterRangeValue(target, minVal, maxVal) {
  const hasNestedValue = target?.value && typeof target.value === 'object';
  if (hasNestedValue) {
    const value = {};
    if (minVal != null) value.min = minVal;
    if (maxVal != null) value.max = maxVal;
    if (Object.keys(value).length) target.value = value;
    else delete target.value;
    return;
  }
  if (minVal != null) target.min = minVal;
  else delete target.min;
  if (maxVal != null) target.max = maxVal;
  else delete target.max;
}

function applyFilterQueryFiltersToTradeQuery(query, filter) {
  const queryFilterByKey = new Map();
  (filter.queryFilters || []).forEach(entry => {
    if (!entry?.group || !entry?.id) return;
    queryFilterByKey.set(`${entry.group}:${entry.id}`, entry);
  });

  Object.entries(query.filters || {}).forEach(([groupName, group]) => {
    const filters = group?.filters;
    if (!filters || typeof filters !== 'object') return;
    Object.keys(filters).forEach(id => {
      const entry = queryFilterByKey.get(`${groupName}:${id}`);
      if (!entry) return;
      const target = filters[id];
      if (!target || typeof target !== 'object') return;
      target.disabled = entry.active === false;
      if (entry.textKey && entry.textValue) target[entry.textKey] = entry.textValue;
      const minVal = numberOrNull(entry.min);
      const maxVal = numberOrNull(entry.max);
      if (minVal == null && maxVal == null) {
        setTradeQueryFilterRangeValue(target, null, null);
        return;
      }
      setTradeQueryFilterRangeValue(target, minVal, maxVal);
    });
  });
}

function parseSavedTradeQueryInfo(filter) {
  const note = String(filter?.note || '');
  const m = note.match(/거래소 검색조건에서 저장\s*\((.*),\s*([^)]+)\)/);
  return {
    realm: getFilterTradeRealm(filter),
    league: filter?.league || (m ? m[1].trim() : settings.league),
    queryId: filter?.tradeQueryId || (m ? m[2].trim() : '')
  };
}

async function hydrateTradeQueryTemplate(filter) {
  if (filter?.tradeQueryTemplate && typeof filter.tradeQueryTemplate === 'object') return false;
  const info = parseSavedTradeQueryInfo(filter);
  if (!info.queryId || !info.league) {
    if (/거래소 검색조건에서 저장/.test(filter?.note || '')) {
      appendSidepanelDebugLog({
        kind: 'trade-query-hydrate-skip',
        reason: 'missing-query-id-or-league',
        filterSummary: summarizeFilterForDebug(filter),
        parsedInfo: info
      });
    }
    return false;
  }

  const url = buildTradeQueryHydrateUrl(info.realm, info.league, info.queryId);
  let payload = null;
  try {
    const res = await fetchTradeJson(info.realm, url, { credentials: 'include' });
    if (!res.ok) {
      appendSidepanelDebugLog({
        kind: 'trade-query-hydrate-failed',
        reason: 'http-error',
        status: res.status,
        url,
        filterSummary: summarizeFilterForDebug(filter),
        parsedInfo: info
      });
      return false;
    }
    payload = res.payload;
  } catch (err) {
    appendSidepanelDebugLog({
      kind: 'trade-query-hydrate-failed',
      reason: 'fetch-error',
      message: err.message,
      url,
      filterSummary: summarizeFilterForDebug(filter),
      parsedInfo: info
    });
    return false;
  }

  const query = payload?.query;
  if (!query || typeof query !== 'object') {
    appendSidepanelDebugLog({
      kind: 'trade-query-hydrate-failed',
      reason: 'missing-query',
      url,
      payloadKeys: payload && typeof payload === 'object' ? Object.keys(payload) : [],
      filterSummary: summarizeFilterForDebug(filter),
      parsedInfo: info
    });
    return false;
  }

  const queryFilters = query.filters || {};
  filter.tradeQueryId = info.queryId;
  filter.league = info.league;
  filter.tradeRealm = info.realm;
  filter.tradeQueryTemplate = cloneJsonSafe(query);
  filter.tradeStatusOption = query.status?.option || filter.tradeStatusOption || '';
  filter.tradeSaleTypeActive = !!queryFilters.trade_filters?.filters?.sale_type;
  filter.tradeSaleTypeOption = queryFilters.trade_filters?.filters?.sale_type?.option || '';
  if (!Array.isArray(filter.queryFilters) || !filter.queryFilters.length) {
    filter.queryFilters = collectSavedTradeQueryFilters(queryFilters);
  }
  updateFilterSourceHash(filter);
  await persist();
  appendSidepanelDebugLog({
    kind: 'trade-query-hydrate-success',
    url,
    filterId: filter.id,
    filterName: filter.name,
    parsedInfo: info,
    querySummary: summarizeTradeQueryForDebug(query)
  });
  return true;
}

function delFilter(id) {
  if (!confirm('이 필터를 삭제할까요?')) return;
  setCurrentFilters(getCurrentFilters().filter(x => String(x.id) !== String(id)));
  pruneDeletedFilterRefs();
  persist(); render();
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

function bindHeader() {
  document.getElementById('btnGoTrade').addEventListener('click', () => {
    chrome.tabs.create({ url: buildTradeSearchPageUrl(settings.tradeRealm, settings.league) });
  });
  document.getElementById('leagueBadge').addEventListener('click', () => {
    const cur = settings.league;
    const realm = normalizeTradeRealm(settings.tradeRealm);
    const realmLeagues = getTradeLeagues(realm);
    const idx = realmLeagues.indexOf(cur);
    const next = realmLeagues[(idx + 1) % realmLeagues.length];
    settings.league = next;
    ensureBuildDataForLeague(next);
    syncTradeSettingsUi();
    syncPoe1CharacterEquipmentLeagueContext();
    persist();
    render();
  });
}

function bindModal() {
  document.getElementById('btnCancel').addEventListener('click', closeModal);
  document.getElementById('btnSave').addEventListener('click', saveModal);
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target===document.getElementById('overlay')) closeModal();
  });

  // Feature 3: mouse wheel on focused number inputs inside the modal
  document.querySelector('.modal').addEventListener('wheel', e => {
    const inp = e.target;
    if (inp.tagName !== 'INPUT' || inp.type !== 'number') return;
    if (document.activeElement !== inp) return;
    e.preventDefault();
    // deltaY > 0 = scroll down = decrease value; < 0 = scroll up = increase value
    const delta = e.deltaY > 0 ? -1 : 1;
    const current = parseFloat(inp.value) || 0;
    inp.value = current + delta;
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }, { passive: false });
}

function openModal(id) {
  editingId = id;
  const f = getCurrentFilters().find(x => String(x.id) === String(id));
  if (!f) return;
  document.getElementById('eName').value  = f.name;
  document.getElementById('eNote').value  = f.note||'';

  const el = document.getElementById('equipEditList');
  el.innerHTML = '';
  (f.equipment||[]).forEach((s, i) => {
    const active = s.active !== false;
    const row = document.createElement('div');
    row.className = 'stat-edit-row';
    row.innerHTML = `
      <button class="stat-toggle ${active?'':'off'}" data-idx="${i}" title="활성/비활성">${active?'✅':'⬜'}</button>
      <span class="stat-edit-label" title="${esc(s.label)}">${esc(s.label)}</span>
      <input type="number" class="stat-edit-min" data-idx="${i}" value="${s.min ?? ''}" min="0" step="0.1" placeholder="min" title="최솟값"/>
      <input type="number" class="stat-edit-max" data-idx="${i}" value="${s.max ?? ''}" min="0" step="0.1" placeholder="max" title="최댓값"/>
    `;
    row.querySelector('.stat-toggle').addEventListener('click', function() {
      const isOn = !this.classList.contains('off');
      this.classList.toggle('off', isOn);
      this.textContent = isOn ? '⬜' : '✅';
      this.closest('.stat-edit-row').style.opacity = isOn ? '.4' : '1';
    });
    el.appendChild(row);
  });

  const sl = document.getElementById('statEditList');
  sl.innerHTML = '';
  (f.stats||[]).forEach((s, i) => {
    const active = s.active !== false;
    const row = document.createElement('div');
    row.className = 'stat-edit-row';

    // Category badge: show for all known prefixes, cycle on click
    const rawId = s.id || s.fallbackId || '';
    const prefixM = rawId.match(/^([^.]+)\./);
    const curPfx = prefixM ? prefixM[1] : 'explicit';
    const knownPfx = CATEGORY_LABELS[curPfx] ? curPfx : null;
    const badgeHtml = rawId
      ? `<button class="cat-badge cat-badge-${knownPfx || 'explicit'}"
           data-idx="${i}"
           data-prefix="${curPfx}"
           title="클릭하여 카테고리 전환"
           style="${knownPfx ? '' : 'opacity:0.5'}">${CATEGORY_LABELS[curPfx] || curPfx}</button>`
      : '';

    row.innerHTML = `
      <button class="stat-toggle ${active?'':'off'}" data-idx="${i}" title="활성/비활성">${active?'✅':'⬜'}</button>
      <span class="stat-edit-label" title="${esc(s.label)}">${esc(s.label)}</span>
      ${badgeHtml}
      <input type="number" class="stat-edit-min" data-idx="${i}" value="${s.noValue ? '' : (s.min ?? '')}" step="1" placeholder="min" title="최솟값 (감소 스탯은 음수)"/>
      <input type="number" class="stat-edit-max" data-idx="${i}" value="${s.noValue ? '' : (s.max ?? '')}" step="1" placeholder="max" title="최댓값"/>
    `;
    row.querySelector('.stat-toggle').addEventListener('click', function() {
      const isOn = !this.classList.contains('off');
      this.classList.toggle('off', isOn);
      this.textContent = isOn ? '⬜' : '✅';
      this.closest('.stat-edit-row').style.opacity = isOn ? '.4' : '1';
    });

    // Category badge cycle in modal
    const badge = row.querySelector('.cat-badge');
    if (badge) {
      badge.addEventListener('click', function() {
        const currentPrefix = this.dataset.prefix;
        const curIdx = CATEGORY_PREFIXES.indexOf(currentPrefix);
        const nextPrefix = CATEGORY_PREFIXES[(curIdx + 1) % CATEGORY_PREFIXES.length];
        this.dataset.prefix = nextPrefix;
        this.className = `cat-badge cat-badge-${nextPrefix}`;
        this.style.opacity = '';
        this.textContent = CATEGORY_LABELS[nextPrefix] || nextPrefix;
      });
    }

    sl.appendChild(row);
  });

  document.getElementById('overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('overlay').classList.remove('show');
  editingId = null;
}

function saveModal() {
  const arr = getCurrentFilters();
  const f = arr.find(x => String(x.id) === String(editingId));
  if (!f) return;
  f.name     = document.getElementById('eName').value.trim() || f.name;
  f.priceMax = 0;
  f.reqLvlMin = 0;
  f.note     = document.getElementById('eNote').value.trim();

  document.querySelectorAll('#equipEditList .stat-edit-row').forEach((row, i) => {
    if (!f.equipment || !f.equipment[i]) return;
    const toggle = row.querySelector('.stat-toggle');
    f.equipment[i].active = !toggle.classList.contains('off');
    f.equipment[i].min = numberOrNull(row.querySelector('.stat-edit-min').value);
    f.equipment[i].max = numberOrNull(row.querySelector('.stat-edit-max').value);
  });

  document.querySelectorAll('#statEditList .stat-edit-row').forEach((row, i) => {
    if (!f.stats[i]) return;
    const toggle = row.querySelector('.stat-toggle');
    f.stats[i].active = !toggle.classList.contains('off');
    const minVal = numberOrNull(row.querySelector('.stat-edit-min').value);
    const maxVal = numberOrNull(row.querySelector('.stat-edit-max').value);
    f.stats[i].min = minVal;
    f.stats[i].max = maxVal;
    f.stats[i].noValue = minVal == null && maxVal == null;

    // Apply category badge prefix to the stat id
    const badge = row.querySelector('.cat-badge');
    if (badge && f.stats[i].id) {
      const newPrefix = badge.dataset.prefix;
      const withoutPrefix = f.stats[i].id.replace(/^[^.]+\./, '');
      f.stats[i].id = `${newPrefix}.${withoutPrefix}`;
    }
  });

  updateFilterSourceHash(f);
  persist(); render(); closeModal();
}

function bindSettings() {
  const realmSelect = document.getElementById('sTradeRealm');
  const leagueInput = document.getElementById('sLeague');
  if (realmSelect) {
    realmSelect.value = normalizeTradeRealm(settings.tradeRealm);
    realmSelect.addEventListener('change', e => {
      const previousRealm = normalizeTradeRealm(settings.tradeRealm);
      const nextRealm = normalizeTradeRealm(e.target.value);
      const previousDefaultLeague = getTradeEndpoint(previousRealm).defaultLeague;
      settings.tradeRealm = nextRealm;
      if (!settings.league || settings.league === previousDefaultLeague || !getTradeLeagues(nextRealm).includes(settings.league)) {
        settings.league = getPreferredTradeLeague(nextRealm);
      }
      ensureBuildDataForLeague(settings.league);
      renderLeagueOptions(nextRealm);
      syncTradeSettingsUi();
      syncPoe1CharacterEquipmentLeagueContext();
      persist();
      render();
      switchUtilityTab(currentUtilityTabByRealm[nextRealm]);
      renderNinjaCategoryTabs();
      loadNinjaRates();
      loadTradeLeagues(nextRealm);
    });
  }
  const onLeagueChange = (val) => {
    const v = (val || '').trim();
    if (!v) return;
    settings.league = v;
    ensureBuildDataForLeague(v);
    syncTradeSettingsUi();
    syncPoe1CharacterEquipmentLeagueContext();
    persist();
    render();
    loadNinjaRates();
  };
  leagueInput.addEventListener('change', e => onLeagueChange(e.target.value));
  bindCustomSelectControls();
  const refreshLeaguesButton = document.getElementById('btnRefreshLeagues');
  refreshLeaguesButton?.addEventListener('click', async () => {
    const refreshRealm = normalizeTradeRealm(settings.tradeRealm);
    refreshLeaguesButton.disabled = true;
    refreshLeaguesButton.classList.remove('is-error');
    refreshLeaguesButton.classList.add('is-loading');
    refreshLeaguesButton.title = '리그 목록 갱신 중...';
    const refreshed = await loadTradeLeagues(refreshRealm, true);
    refreshLeaguesButton.disabled = false;
    refreshLeaguesButton.classList.remove('is-loading');
    refreshLeaguesButton.classList.toggle('is-error', !refreshed);
    refreshLeaguesButton.title = refreshed
      ? `리그 목록 갱신 완료 (${getTradeLeagues(refreshRealm).length}개)`
      : '리그 목록 갱신 실패. 다시 시도하세요.';
  });
  document.getElementById('sCount').addEventListener('change', e => {
    settings.resultCount = parseInt(e.target.value);
    syncCustomSelectControl(e.target);
    persist();
  });
  const allowGlobalSidebar = document.getElementById('sAllowGlobalSidebar');
  if (allowGlobalSidebar) {
    allowGlobalSidebar.checked = !!settings.allowGlobalSidebar;
    allowGlobalSidebar.addEventListener('change', e => {
      settings.allowGlobalSidebar = !!e.target.checked;
      persist();
    });
  }

  // 패널 너비 슬라이더 — sidebarUI.width 만 갱신 (open/side 등 기존 값 보존)
  const widthSlider = document.getElementById('panelWidthSlider');
  if (widthSlider) {
    // 드래그 중: px 표시 실시간 갱신
    widthSlider.addEventListener('input', e => {
      syncPanelWidthControls(e.target.value);
    });
    // 드래그 종료: width 만 머지 저장
    widthSlider.addEventListener('change', async e => {
      const w = clampPanelWidth(e.target.value);
      const cur = await chrome.storage.local.get(SIDEBAR_UI_KEY);
      const prev = (cur && cur[SIDEBAR_UI_KEY]) || {};
      chrome.storage.local.set({ [SIDEBAR_UI_KEY]: { ...prev, width: w } });
    });
  }

  // UI 줌(zoom) 조절
  const zoomSlider = document.getElementById('uiZoomSlider');
  const zoomReset = document.getElementById('btnZoomReset');
  if (zoomSlider) {
    // 슬라이더 드래그 중: 즉시 미리보기 (저장은 하지 않음)
    zoomSlider.addEventListener('input', e => {
      const z = clampZoom(e.target.value);
      applyZoom(z);
      syncZoomControls(z);
    });
    // 드래그 종료: 저장
    zoomSlider.addEventListener('change', e => {
      const z = clampZoom(e.target.value);
      chrome.storage.local.set({ uiZoom: z });
    });
  }
  if (zoomReset) {
    zoomReset.addEventListener('click', () => {
      applyZoom(DEFAULT_UI_ZOOM);
      syncZoomControls(DEFAULT_UI_ZOOM);
      chrome.storage.local.set({ uiZoom: DEFAULT_UI_ZOOM });
    });
  }
}

function bindImportExport() {
  let pendingImportData = null;

  document.getElementById('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({filtersByLeague,buildsByLeague,buildUiByLeague,settings},null,2)],{type:'application/json'});
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`poe2-filters-${Date.now()}.json`});
    a.click(); URL.revokeObjectURL(a.href);
  });

  document.getElementById('btnImportTrigger').addEventListener('click',()=>document.getElementById('fileImport').click());
  document.getElementById('btnViewDebug').addEventListener('click', showErrorPreview);
  document.getElementById('btnCopyDebug').addEventListener('click', e => copyErrorLogs(e.currentTarget));
  document.getElementById('btnExportDebug').addEventListener('click', exportErrorLogs);
  document.getElementById('btnClearDebug').addEventListener('click', async () => {
    if (!confirm('에러 로그를 모두 비울까요?')) return;
    await chrome.runtime.sendMessage({ type: 'CLEAR_ERROR_LOGS' }).catch(() => null);
    const preview = document.getElementById('debugLogPreview');
    if (preview) {
      preview.hidden = false;
      preview.textContent = '에러 로그를 비웠습니다.';
    }
    alert('✅ 에러 로그를 비웠습니다.');
  });

  document.getElementById('fileImport').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.filtersByLeague && !Array.isArray(d.filters)) {
          alert('❌ 파일 형식 오류'); return;
        }
        pendingImportData = d;
        const filterCount = Object.values(d.filtersByLeague || {}).reduce((s, a) => s + a.length, 0) || (d.filters?.length || 0);
        const buildCount = Object.values(d.buildsByLeague || {}).reduce((s, a) => s + a.length, 0);
        document.getElementById('importFileInfo').textContent = `필터 ${filterCount}개, 빌드 ${buildCount}개`;
        document.getElementById('importModal').classList.add('active');
      } catch { alert('❌ 파일 형식 오류'); }
    };
    r.readAsText(file); e.target.value = '';
  });

  function applyImport(mode) {
    if (!pendingImportData) return;
    const d = pendingImportData;
    pendingImportData = null;
    document.getElementById('importModal').classList.remove('active');

    if (mode === 'replace') {
      const importedSettings = d.settings ? { ...settings, ...d.settings } : { ...settings };
      importedSettings.tradeRealm = normalizeTradeRealm(importedSettings.tradeRealm);
      const importedLeague = d.settings?.league || importedSettings.league || settings.league;
      if (d.filtersByLeague) {
        filtersByLeague = d.filtersByLeague;
      } else if (Array.isArray(d.filters)) {
        filtersByLeague = { [importedLeague]: d.filters };
      } else {
        filtersByLeague = {};
      }
      buildsByLeague = d.buildsByLeague || {};
      buildUiByLeague = d.buildUiByLeague || {};
      settings = importedSettings;
    } else {
      const importedLeague = d.settings?.league || settings.league;
      const srcFilters = d.filtersByLeague || (Array.isArray(d.filters) ? { [importedLeague]: d.filters } : {});
      for (const league of Object.keys(srcFilters)) {
        const existing = filtersByLeague[league] || [];
        const existingIds = new Set(existing.map(f => f.id));
        const newOnes = (srcFilters[league] || []).filter(f => !existingIds.has(f.id));
        filtersByLeague[league] = [...existing, ...newOnes];
      }
      for (const league of Object.keys(d.buildsByLeague || {})) {
        buildsByLeague[league] = mergeStoredBuilds(buildsByLeague[league], d.buildsByLeague[league] || []);
      }
    }

    migrateRealmScopedStorageMaps();
    Object.keys(filtersByLeague).forEach(storageKey => {
      filtersByLeague[storageKey] = (filtersByLeague[storageKey] || []).map(normalizeSavedFilter);
    });
    Object.keys(buildsByLeague).forEach(storageKey => {
      buildsByLeague[storageKey] = (buildsByLeague[storageKey] || []).map(normalizeBuild).filter(Boolean);
    });
    const storageKeys = Array.from(new Set([
      ...Object.keys(filtersByLeague),
      ...Object.keys(buildsByLeague),
      getRealmLeagueStorageKey()
    ]));
    storageKeys.forEach(storageKey => {
      ensureBuildDataForLeague(storageKey);
      pruneDeletedFilterRefs(storageKey);
    });
    persist(); render();
    document.getElementById('sLeague').value = settings.league;
    syncTradeSettingsUi();
    alert('✅ 가져오기 완료!');
  }

  document.getElementById('btnImportMerge').addEventListener('click', () => applyImport('merge'));
  document.getElementById('btnImportReplace').addEventListener('click', () => applyImport('replace'));
  document.getElementById('btnImportCancel').addEventListener('click', () => {
    pendingImportData = null;
    document.getElementById('importModal').classList.remove('active');
  });

  document.getElementById('btnClear').addEventListener('click', () => {
    if (confirm(`"${settings.league}" 리그의 모든 필터를 삭제할까요?`)) {
      setCurrentFilters([]);
      pruneDeletedFilterRefs(settings.league);
      persist(); render();
    }
  });
}

async function exportErrorLogs() {
  const text = await getErrorLogText();
  await downloadTextFile(`poe2-error-log-${Date.now()}.txt`, text);
}

async function copyErrorLogs(button) {
  const text = await getErrorLogText();
  await copyTextToClipboard(text);
  const preview = document.getElementById('debugLogPreview');
  if (preview) {
    preview.hidden = false;
    preview.textContent = '에러 로그를 클립보드에 복사했습니다.\n댓글이나 메시지에 그대로 붙여넣으면 됩니다.';
  }
  if (button) {
    const prev = button.textContent;
    button.textContent = '복사됨';
    setTimeout(() => { button.textContent = prev; }, 1000);
  }
}

const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

// ── Economy tab ──────────────────────────────────────────────

function applyNinjaSearch() {
  const query = (document.getElementById('ninja-search')?.value || '').trim().toLowerCase();
  renderNinjaFilteredRows(query);
}

function scheduleNinjaSearch() {
  if (ninjaSearchTimer) clearTimeout(ninjaSearchTimer);
  ninjaSearchTimer = setTimeout(() => {
    ninjaSearchTimer = null;
    applyNinjaSearch();
  }, 90);
}

const NINJA_CATEGORIES = [
  { label: '커런시', type: 'Currency' },
  { label: '에센스', type: 'Essences' },
  { label: '징조', type: 'Ritual' },
  { label: '환영 액체', type: 'Delirium' },
  { label: '심연', type: 'Abyss' },
  { label: '혈통', type: 'LineageSupportGems' },
  { label: '탐험', type: 'Expedition' },
  { label: '균열', type: 'Breach' },
  { label: '베리시움', type: 'Verisium' },
  { label: '룬', type: 'Runes' },
];

const NINJA_CATEGORIES_BY_REALM = {
  [TRADE_REALM_POE1]: [
    { label: '커런시', type: 'Currency', endpoint: 'exchange' },
    { label: '조각', type: 'Fragment', endpoint: 'exchange' },
    { label: '에센스', type: 'Essence', endpoint: 'exchange' },
    { label: '스캐럽', type: 'Scarab', endpoint: 'exchange' },
    { label: '카드', type: 'DivinationCard', endpoint: 'exchange' },
    { label: '성유/오일', type: 'Oil', endpoint: 'exchange' },
    { label: '화석', type: 'Fossil', endpoint: 'exchange' },
    { label: '문신', type: 'Tattoo', endpoint: 'exchange' },
    { label: '올플레임', type: 'AllflameEmber', endpoint: 'exchange' },
    { label: '고유 무기', type: 'UniqueWeapon', endpoint: 'stash-item' },
    { label: '고유 방어구', type: 'UniqueArmour', endpoint: 'stash-item' },
    { label: '고유 장신구', type: 'UniqueAccessory', endpoint: 'stash-item' },
    { label: '고유 주얼', type: 'UniqueJewel', endpoint: 'stash-item' },
    { label: 'Forbidden 주얼', type: 'ForbiddenJewel', endpoint: 'stash-item' },
    { label: '고유 플라스크', type: 'UniqueFlask', endpoint: 'stash-item' },
    { label: '스킬 젬', type: 'SkillGem', endpoint: 'stash-item' },
    { label: '지도', type: 'Map', endpoint: 'stash-item' },
    { label: '고유 지도', type: 'UniqueMap', endpoint: 'stash-item' },
    { label: '야수', type: 'Beast', endpoint: 'stash-item' }
  ],
  [TRADE_REALM_POE2]: NINJA_CATEGORIES
};

let currentNinjaCategory = 'Currency';
let currentExRate = null;  // 1div = N ex (Currency 탭 로드 시 갱신)
let currentTradeRates = {};
let ninjaRenderedItems = [];
let ninjaSearchTimer = null;
const NINJA_VISIBLE_ROW_LIMIT = 120;
const currentUtilityTabByRealm = {
  [TRADE_REALM_POE1]: 'wealth',
  [TRADE_REALM_POE2]: 'expedition'
};
let currentUtilityTab = currentUtilityTabByRealm[TRADE_REALM_POE2];
let passiveTreeData = null;   // passive-tree-ko-filled.json nodes
let passiveLiquids = {};      // { "Contempt": "경멸", ... }
let passiveLang = 'ko';       // 'ko' | 'en'
let passiveMode = 'search';   // 'search' | 'compare'
const passiveModeByRealm = { [TRADE_REALM_POE1]: 'compare', [TRADE_REALM_POE2]: 'search' };
let passiveFullTreeData = null; // tree.json nodes (모든 노드 영문 이름+스탯)
let passiveLoadedRealm = '';
let regexOptionFilter = 'all';
const regexUserPresetsByRealm = { [TRADE_REALM_POE1]: [], [TRADE_REALM_POE2]: [] };
const regexOptionSelectionsByRealm = { [TRADE_REALM_POE1]: new Map(), [TRADE_REALM_POE2]: new Map() };
const regexNumberStateByRealm = { [TRADE_REALM_POE1]: {}, [TRADE_REALM_POE2]: {} };
const REGEX_PRESET_STORAGE_KEYS = { [TRADE_REALM_POE1]: 'poe1MapRegexPresets', [TRADE_REALM_POE2]: 'waystoneRegexPresets' };
const POE1_STASH_ACCOUNT_KEY = 'poe1StashAccountName';
const POE1_CHARACTER_VIEW_KEY = 'poe1CharacterEquipmentViewV1';
const POE1_POB_CHARACTER_VIEW_KEY = 'poe1PobCharacterViewV1';
const POE1_CHARACTER_SOURCE_KEY = 'poe1CharacterSourceV1';
const POE1_POB_PARSER_VERSION = 2;
const POE1_STASH_HISTORY_KEY = 'poe1StashWealthHistoryV1';
const POE1_STASH_SESSION_KEY = 'poe1StashWealthSessionsV1';
const POE1_STASH_GRAPH_RECORD_THRESHOLD = { unit: 'chaos', value: 1 };
let poe1LoadedStashContext = null;
let poe1StashWealthView = { rows: [], chaosRate: 1 };
let poe1Characters = [];
let poe1CharacterEquipmentItems = [];
let poe1CharacterViewStore = {};
let poe1CurrentEquipmentCharacter = null;
let poe1CharacterSource = 'account';
let poe1PobCharacterView = null;
let poe1PobSelectedFile = null;
let poe1TradeItemIconMapPromise = null;
let poe1StashHistoryStore = null;
let poe1StashSessionStore = null;
let poe1StashRefreshComparison = null;
let poe1StashLatestScanSnapshot = null;
let poe1StashHistoryRange = '24h';
let poe1StashChartVisiblePoints = [];
let poe1StashSessionBusy = false;
let poe1StashAutoScanTimer = null;
let poe1StashScanPromise = null;
let poe1StashScanQueued = false;
let poe1ProfileAccountPromise = null;
let poe1ManualAccountOverride = false;
const POE1_STASH_TAB_FALLBACK_IMAGES = [
  [/currency|화폐/i, '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lNb2RWYWx1ZXMiLCJzY2FsZSI6MX1d/ec48896769/CurrencyModValues.png'],
  [/scarab|갑충/i, '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRGl2aW5hdGlvbiIsInNjYWxlIjoxfV0/73ab11f6bd/GreaterScarabDivination.png'],
  [/fragment|조각/i, '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9EZWxpcml1bVNwbGludGVyIiwic2NhbGUiOjF9XQ/b36d2fcff6/DeliriumSplinter.png'],
  [/essence|에센스/i, '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRXNzZW5jZS9GZWFyNyIsInNjYWxlIjoxfV0/0b0dcd4320/Fear7.png'],
  [/divination|card|점술/i, '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvRGl2aW5hdGlvbi9JbnZlbnRvcnlJY29uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/f34bf8cbb5/InventoryIcon.png'],
  [/delirium|환영/i, '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRGVsaXJpdW0vRGVsaXJpdW1PcmJNYXBzIiwic2NhbGUiOjF9XQ/0e2be34e49/DeliriumOrbMaps.png'],
  [/gem|젬/i, '/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9WYWFsR2Vtcy9WYWFsSW1tb3J0YWxDYWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b1987a0e6d/VaalImmortalCall.png'],
  [/delve|fossil|화석|공명/i, '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvRGVsdmUvUmVzb25hdGluZ0Zvc3NpbCIsInNjYWxlIjoxfV0/9db0326ecc/ResonatingFossil.png'],
  [/blight|oil|성유|오일/i, '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvT2lscy9BenVyZU9pbCIsInNjYWxlIjoxfV0/a68235e8e8/AzureOil.png'],
  [/map|지도/i, '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9BdGxhczJNYXBzL05ldy9IeWRyYSIsInciOjEsImgiOjEsInNjYWxlIjoxLCJtbiI6MTMsIm10IjowfV0/ea0ea38051/Hydra.png'],
  [/unique|고유/i, '/gen/image/WzI4LDE0LHsiZiI6IjJESXRlbXMvTWFwcy9IYXJiaW5nZXJVYmVyIiwidyI6MSwiaCI6MSwic2NhbGUiOjEsIm1uIjoxMiwibXQiOjB9XQ/62fde2df56/HarbingerUber.png']
];

const WAYSTONE_REGEX_GROUPS = [
  {
    id: 'prefix',
    title: '접두어',
    items: [
      { label: '지역에 언데드 무리 (6-13)개 추가 등장', pattern: '언데드.*무리' },
      { label: '지역에 야수 무리 (6-13)개 추가 등장', pattern: '야수.*무리' },
      { label: '지역에 에조미어 몬스터 무리 (6-13)개 추가 등장', pattern: '에조미어.*무리' },
      { label: '지역에 파리둔 몬스터 무리 (6-13)개 추가 등장', pattern: '파리둔.*무리' },
      { label: '지역에 바알 몬스터 무리 (6-13)개 추가 등장', pattern: '바알.*무리' },
      { label: '지역에 철 수호병 무리 (6-13)개 추가 등장', pattern: '철.*수호병.*무리' },
      { label: '지역에 역병 걸린 몬스터 무리 (6-13)개 추가 등장', pattern: '역병.*무리' },
      { label: '지역에 초월한 몬스터 무리 (6-13)개 추가 등장', pattern: '초월.*무리' },
      { label: '지역에 가시나무 몬스터 무리 (6-13)개 추가 등장', pattern: '가시나무.*무리' },
      { label: '몬스터가 피해의 (15-30)%를 추가 화염 피해로 줌', pattern: '추가.*화염', danger: true },
      { label: '몬스터가 피해의 (15-30)%를 추가 냉기 피해로 줌', pattern: '추가.*냉기', danger: true },
      { label: '몬스터가 피해의 (15-30)%를 추가 번개 피해로 줌', pattern: '추가.*번개', danger: true },
      { label: '몬스터 피해 (15-30)% 증가', pattern: '몬스터.*피해.*증가', danger: true },
      { label: '몬스터의 생명력 (20-49)% 증폭', pattern: '생명력.*증폭', danger: true },
      { label: '몬스터가 장갑을 두른 몬스터', pattern: '장갑.*두른', danger: true },
      { label: '몬스터가 회피하는 몬스터', pattern: '회피.*몬스터', danger: true },
      { label: '몬스터가 최대 생명력의 20%를 추가 에너지 보호막 최대치로 획득', pattern: '에너지.*보호막', danger: true },
      { label: '몬스터의 정확도 (15-45)% 증가', pattern: '정확도.*증가', danger: true },
      { label: '몬스터가 피해의 (15-30)%를 추가 카오스 피해로 줌', pattern: '추가.*카오스', danger: true },
      { label: '지역이 쇠약화 저주에 걸림', pattern: '쇠약화', danger: true },
      { label: '지역이 시간의 사슬 저주에 걸림', pattern: '시간.*사슬', danger: true },
      { label: '지역이 원소 약화 저주에 걸림', pattern: '원소.*약화', danger: true },
      { label: '지역에 점화 지대 존재', pattern: '점화.*지대', danger: true },
      { label: '지역에 얼음 지대 존재', pattern: '얼음.*지대', danger: true },
      { label: '지역에 감전 지대 존재', pattern: '감전.*지대', danger: true },
      { label: '몬스터에게 적용되는 저주 효과 (20-50)% 감폭', pattern: '저주.*효과.*감폭', danger: true },
      { label: '몬스터가 명중 시 (10-25)%의 확률로 권능, 격분, 인내 충전 강탈', pattern: '충전.*강탈|권능.*격분.*인내', danger: true },
      { label: '심연 몬스터가 주는 경험치 (50-100)% 증가', pattern: '심연.*경험치' },
      { label: '심연에 추가 구덩이 (2-3)개 존재', pattern: '심연.*추가.*구덩이.*[23]' },
      { label: '지역 내 심연에서 생성되는 몬스터 (50-100)% 증가', pattern: '심연.*생성.*몬스터.*증가' },
      { label: '심연에 추가 구덩이 (14-18)개 존재 지역이 심연으로 뒤덮임', pattern: '심연.*추가.*구덩이.*1[4-8]|심연.*뒤덮임' },
      { label: '심연이 심연 보스로 이어짐', pattern: '심연.*보스' },
      { label: '지역 내 부화기 여왕 1마리 추가 등장', pattern: '부화기.*여왕' },
      { label: '심연 구덩이/균열에서 마법 등급 이상 몬스터 생성', pattern: '심연.*마법.*등급|심연.*균열.*마법' },
      { label: '심연이 심연 지하로 이어짐', pattern: '심연.*지하' },
      { label: '닫은 구덩이 수에 따라 심연 몬스터 난이도와 보상 증가', pattern: '닫은.*구덩이|난이도.*보상' },
      { label: '지역 내 심연 구덩이에서 항상 보상 제공', pattern: '항상.*보상' },
      { label: '지역 내 자연 생성 희귀 몬스터에게 추가 심연 속성 1개 부여', pattern: '희귀.*몬스터.*심연.*속성' }
    ]
  },
  {
    id: 'suffix',
    title: '접미어',
    items: [
      { label: '희귀 몬스터가 속성 부여 1개 추가 보유', pattern: '희귀.*몬스터.*속성.*추가|속성.*부여.*추가', danger: true },
      { label: '몬스터의 이동/공격/시전 속도 (10-25)% 증가', pattern: '이동.*속도|공격.*속도|시전.*속도', danger: true },
      { label: '몬스터의 치명타 명중 확률 증가 및 치명타 피해 보너스', pattern: '치명타.*명중|치명타.*피해', danger: true },
      { label: '몬스터의 원소 저항 +(20-40)%', pattern: '원소.*저항', danger: true },
      { label: '몬스터가 명중 시 중독 유발', pattern: '중독', danger: true },
      { label: '몬스터가 명중 시 출혈 유발', pattern: '출혈', danger: true },
      { label: '몬스터의 상태 이상/기절 한계치 증가', pattern: '상태.*이상.*한계치|기절.*한계치', danger: true },
      { label: '몬스터가 준 물리 피해와 동일한 방어구 파괴', pattern: '방어구.*파괴', danger: true },
      { label: '몬스터의 기절 축적 증가', pattern: '기절.*축적', danger: true },
      { label: '몬스터의 동결/인화성/감전 축적 증가', pattern: '동결.*축적|인화성|감전.*확률', danger: true },
      { label: '몬스터가 투사체 (2-3)개 추가 발사', pattern: '투사체.*추가', danger: true },
      { label: '몬스터의 효과 범위 50% 증가', pattern: '효과.*범위', danger: true },
      { label: '몬스터 피해가 원소 저항 관통', pattern: '저항.*관통', danger: true },
      { label: '플레이어 저항 최대치 (-12--4)%', pattern: '플레이어.*저항.*최대치|저항.*최대치', danger: true },
      { label: '플레이어의 플라스크 충전량 감소', pattern: '플라스크.*충전', danger: true },
      { label: '플레이어의 생명력 및 에너지 보호막 회복 속도 감폭', pattern: '회복.*속도.*감폭', danger: true },
      { label: '플레이어의 재사용 대기시간 회복 속도 감폭', pattern: '재사용.*대기시간.*회복', danger: true },
      { label: '몬스터가 치명타 명중으로 받는 추가 피해 감소', pattern: '치명타.*추가.*피해.*감소', danger: true },
      { label: '희귀 몬스터가 처치한 몬스터의 영혼 포식/강탈', pattern: '영혼.*포식|포식한.*영혼', danger: true },
      { label: '플레이어와 소환수가 10초마다 3초 동안 피해를 주지 않음', pattern: '피해를.*주지.*않음', danger: true },
      { label: '스킬 사용 횟수당 플레이어 이동 및 스킬 속도 감폭', pattern: '스킬.*사용.*횟수|이동.*스킬.*속도.*감폭', danger: true },
      { label: '몬스터가 명중 시 탐욕스러운 덩굴 유발', pattern: '탐욕스러운.*덩굴', danger: true },
      { label: '희귀/고유 몬스터 처치 후 죽음의 징표 획득', pattern: '죽음의.*징표', danger: true },
      { label: '지역에 마나 착취 지대 존재', pattern: '마나.*착취.*지대', danger: true },
      { label: '자연 생성 몬스터 무리가 영혼의 결합 소속', pattern: '영혼의.*결합', danger: true },
      { label: '자연 생성 희귀 몬스터가 지도 보스의 영혼의 결합 소속', pattern: '지도.*보스.*영혼의.*결합', danger: true }
    ]
  }
];

const WAYSTONE_REGEX_NUMERIC_STATS = {
  rarity:            { label: '아이템 희귀도',     prefix: '아이템\\s*희귀도[^%\\n]*' },
  packSize:          { label: '무리 규모',          prefix: '무리\\s*규모[^%\\n]*' },
  waystoneChance:    { label: '경로석 출현 확률',   prefix: '경로석\\s*출현\\s*확률[^%\\n]*' },
  monsterEfficiency: { label: '몬스터 효율',        prefix: '몬스터\\s*효율[^%\\n]*' },
  monsterRarity:     { label: '몬스터 희귀도',      prefix: '몬스터\\s*희귀도[^%\\n]*' }
};

const WAYSTONE_REGEX_ITEMS = new Map();
WAYSTONE_REGEX_GROUPS.forEach(group => {
  group.items.forEach((item, index) => {
    WAYSTONE_REGEX_ITEMS.set(`${group.id}:${index}`, { ...item, groupId: group.id, groupTitle: group.title });
  });
});

const POE1_MAP_REGEX_GROUPS = globalThis.POE2TQMapRegex?.POE1_GROUPS || [];
const POE1_MAP_REGEX_NUMERIC_STATS = globalThis.POE2TQMapRegex?.POE1_NUMERIC_STATS || {};

function buildRegexItems(groups) {
  const items = new Map();
  groups.forEach(group => group.items.forEach((item, index) => {
    items.set(`${group.id}:${index}`, { ...item, groupId: group.id, groupTitle: group.title });
  }));
  return items;
}

const REGEX_CONFIG_BY_REALM = {
  [TRADE_REALM_POE1]: {
    items: buildRegexItems(POE1_MAP_REGEX_GROUPS),
    numericStats: POE1_MAP_REGEX_NUMERIC_STATS,
    searchPlaceholder: '예: 반사, 재생 불가, 최대 저항',
    groupLabels: { prefix: '공격 위험', suffix: '방어/제약' }
  },
  [TRADE_REALM_POE2]: {
    items: WAYSTONE_REGEX_ITEMS,
    numericStats: WAYSTONE_REGEX_NUMERIC_STATS,
    searchPlaceholder: '예: 플라스크, 최대 저항, 언데드 무리',
    groupLabels: { prefix: '접두어', suffix: '접미어' }
  }
};

function getCurrentRegexConfig() {
  return REGEX_CONFIG_BY_REALM[normalizeTradeRealm(settings.tradeRealm)];
}

function getCurrentRegexSelections() {
  return regexOptionSelectionsByRealm[normalizeTradeRealm(settings.tradeRealm)];
}

function getCurrentRegexPresets() {
  return regexUserPresetsByRealm[normalizeTradeRealm(settings.tradeRealm)];
}

function renderNinjaCategoryTabs() {
  const container = document.getElementById('ninja-category-tabs');
  if (!container) return;
  container.innerHTML = '';
  const categories = getNinjaCategoriesForRealm(settings.tradeRealm);
  if (!categories.some(category => category.type === currentNinjaCategory)) currentNinjaCategory = 'Currency';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'ninja-cat-btn' + (cat.type === currentNinjaCategory ? ' active' : '');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      if (ninjaSearchTimer) {
        clearTimeout(ninjaSearchTimer);
        ninjaSearchTimer = null;
      }
      ninjaRenderedItems = [];
      currentNinjaCategory = cat.type;
      const searchEl = document.getElementById('ninja-search');
      if (searchEl) searchEl.value = '';
      renderNinjaCategoryTabs();
      refreshNinja();
    });
    container.appendChild(btn);
  });
}

function getNinjaCategoriesForRealm(realm = settings.tradeRealm) {
  return NINJA_CATEGORIES_BY_REALM[normalizeTradeRealm(realm)] || NINJA_CATEGORIES_BY_REALM[TRADE_REALM_POE2];
}

function getCurrentNinjaCategoryConfig(realm = settings.tradeRealm) {
  const categories = getNinjaCategoriesForRealm(realm);
  return categories.find(category => category.type === currentNinjaCategory) || categories[0] || { type: 'Currency', endpoint: 'exchange' };
}

function normalizeRegexSearchText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[(){}\[\]%,.+\-–~:/|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getRegexSearchTokens(text) {
  return normalizeRegexSearchText(text).split(' ').filter(Boolean);
}

function getRegexOptionSearchText(item) {
  return normalizeRegexSearchText([
    item.label,
    item.pattern,
    item.groupTitle,
    item.danger ? '위험 danger' : ''
  ].filter(Boolean).join(' '));
}

function getRegexOptionState(id) {
  return getCurrentRegexSelections().get(id) || 'none';
}

function getAllRegexOptions() {
  return Array.from(getCurrentRegexConfig().items.entries()).map(([id, item]) => ({ id, ...item }));
}

function getFilteredRegexOptions() {
  const query = document.getElementById('regex-option-search')?.value || '';
  const tokens = getRegexSearchTokens(query);
  const options = getAllRegexOptions().filter(item => {
    const state = getRegexOptionState(item.id);
    if (regexOptionFilter !== 'all' && regexOptionFilter !== 'selected' && item.groupId !== regexOptionFilter) return false;
    if (regexOptionFilter === 'selected' && state === 'none') return false;
    if (!tokens.length) return true;
    const haystack = getRegexOptionSearchText(item);
    return tokens.every(token => haystack.includes(token));
  });
  return options;
}

function renderRegexOptions() {
  const container = document.getElementById('regex-option-list');
  if (!container) return;
  document.querySelectorAll('[data-regex-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.regexFilter === regexOptionFilter);
  });

  const options = getFilteredRegexOptions();
  const countEl = document.getElementById('regex-option-count');
  if (countEl) countEl.textContent = `${options.length}개`;

  if (!options.length) {
    container.innerHTML = '<div class="regex-result-empty">검색 결과가 없습니다.</div>';
  } else {
    container.innerHTML = options.map(item => renderRegexOptionRow(item)).join('');
  }

  renderSelectedRegexOptions();
  bindRegexOptionResultEvents();
}

function renderRegexOptionRow(item) {
  const state = getRegexOptionState(item.id);
  return `<div class="regex-result-row" data-regex-row="${esc(item.id)}">
    <div class="regex-result-main">
      <div class="regex-option-title">
        <span class="regex-tag">${esc(item.groupTitle)}</span>
        <span class="regex-option-label" title="${esc(item.label)}">${esc(item.label)}</span>
      </div>
      <div class="regex-option-pattern">${esc(item.pattern)}</div>
    </div>
    <div class="regex-option-actions">
      <button type="button" class="regex-option-action include${state === 'include' ? ' active' : ''}" data-regex-set="${esc(item.id)}" data-state="include">포함</button>
      <button type="button" class="regex-option-action exclude${state === 'exclude' ? ' active' : ''}" data-regex-set="${esc(item.id)}" data-state="exclude">제외</button>
    </div>
  </div>`;
}

function renderSelectedRegexOptions() {
  const container = document.getElementById('regex-selected-list');
  if (!container) return;
  const selected = getAllRegexOptions().filter(item => getRegexOptionState(item.id) !== 'none');
  const countEl = document.getElementById('regex-selected-option-count');
  if (countEl) countEl.textContent = `${selected.length}개`;
  if (!selected.length) {
    container.innerHTML = '<div class="regex-result-empty">선택된 옵션이 없습니다.</div>';
    return;
  }
  container.innerHTML = selected.map(item => {
    const state = getRegexOptionState(item.id);
    return `<div class="regex-selected-row">
      <span class="regex-state-badge ${state}">${state === 'include' ? '포함' : '제외'}</span>
      <div class="regex-selected-main">
        <div class="regex-option-title">
          <span class="regex-tag">${esc(item.groupTitle)}</span>
          <span class="regex-option-label" title="${esc(item.label)}">${esc(item.label)}</span>
        </div>
        <div class="regex-option-pattern">${esc(state === 'exclude' ? negateRegexPiece(item.pattern) : item.pattern)}</div>
      </div>
      <button type="button" class="regex-remove-btn" data-regex-remove="${esc(item.id)}">x</button>
    </div>`;
  }).join('');
}

function bindRegexOptionResultEvents() {
  document.querySelectorAll('[data-regex-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = getRegexOptionState(btn.dataset.regexSet);
      setRegexOptionState(btn.dataset.regexSet, current === btn.dataset.state ? 'none' : btn.dataset.state);
    });
  });
  document.querySelectorAll('[data-regex-remove]').forEach(btn => {
    btn.addEventListener('click', () => setRegexOptionState(btn.dataset.regexRemove, 'none'));
  });
}

function escapeRegexLiteral(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wrapRegexPiece(pattern) {
  const text = String(pattern || '').trim();
  if (!text) return '';
  return /[|()]/.test(text) ? `(${text})` : text;
}

function splitTopLevelRegexAlternatives(pattern) {
  const text = String(pattern || '').trim();
  if (!text) return [];
  const parts = [];
  let current = '';
  let parenDepth = 0;
  let bracketDepth = 0;
  let escaped = false;
  for (const ch of text) {
    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      current += ch;
      escaped = true;
      continue;
    }
    if (ch === '[') bracketDepth += 1;
    else if (ch === ']' && bracketDepth > 0) bracketDepth -= 1;
    else if (ch === '(' && bracketDepth === 0) parenDepth += 1;
    else if (ch === ')' && bracketDepth === 0 && parenDepth > 0) parenDepth -= 1;
    if (ch === '|' && parenDepth === 0 && bracketDepth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function uniqueRegexPieces(pieces) {
  const out = [];
  const seen = new Set();
  pieces.forEach(piece => {
    const text = String(piece || '').trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    out.push(text);
  });
  return out;
}

function stripRegexNegation(pattern) {
  const text = String(pattern || '').trim();
  return text.startsWith('!') ? text.slice(1).trim() : text;
}

function splitRegexPieceAlternatives(pattern) {
  const text = stripRegexNegation(pattern);
  if (!text) return [];
  return splitTopLevelRegexAlternatives(text);
}

function getRegexFactorPrefix(pattern) {
  const text = String(pattern || '').trim();
  const idx = text.lastIndexOf('.*');
  if (idx < 0) return '';
  return text.slice(0, idx + 2);
}

function compactRegexAlternatives(alternatives) {
  const ordered = uniqueRegexPieces(alternatives.map(stripRegexNegation));
  const groups = new Map();
  const passthrough = [];

  ordered.forEach(piece => {
    const prefix = getRegexFactorPrefix(piece);
    const rest = prefix ? piece.slice(prefix.length) : '';
    if (!prefix || !rest || rest.includes('|')) {
      passthrough.push(piece);
      return;
    }
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix).push(rest);
  });

  const compressed = [];
  ordered.forEach(piece => {
    const prefix = getRegexFactorPrefix(piece);
    const rest = prefix ? piece.slice(prefix.length) : '';
    const group = groups.get(prefix);
    if (!prefix || !rest || !group) {
      if (passthrough.includes(piece)) compressed.push(piece);
      return;
    }
    if (group._used) return;
    group._used = true;
    compressed.push(group.length > 1 ? `${prefix}(${uniqueRegexPieces(group).join('|')})` : piece);
  });

  return uniqueRegexPieces(compressed);
}

function compactRegexPiece(pattern) {
  return compactRegexAlternatives(splitRegexPieceAlternatives(pattern)).join('|');
}

function normalizePositiveRegexPiece(pattern) {
  const text = compactRegexPiece(pattern);
  if (!text) return '';
  const alternatives = splitTopLevelRegexAlternatives(text);
  if (alternatives.length > 1 && !/^\(.+\)$/.test(text)) return `(${text})`;
  return text;
}

function formatRegexAndPiece(pattern) {
  const text = compactRegexPiece(pattern);
  if (!text) return '';
  return text.replace(/"/g, '');
}

function negateRegexPiece(pattern) {
  return buildNegatedRegexTerm([pattern]);
}

function getNegatedRegexPieces(pattern) {
  const term = buildNegatedRegexTerm([pattern]);
  return term ? [term] : [];
}

function buildPercentAtLeastRegex(value, options = {}) {
  const min = Math.max(0, Math.floor(Number(value)));
  if (!isFinite(min) || min <= 0) return '';
  if (min < 10) {
    const parts = [`[${min}-9]`, '[1-9]\\d+'];
    return `(${parts.join('|')})%`;
  }
  if (min < 100) {
    const tens = Math.floor(min / 10);
    const ones = min % 10;
    const parts = [];
    if (ones === 0) {
      parts.push(`${tens}\\d`);
      if (tens < 9) parts.push(`[${tens + 1}-9]\\d`);
    }
    else {
      parts.push(`${tens}[${ones}-9]`);
      if (tens < 9) parts.push(`[${tens + 1}-9]\\d`);
    }
    parts.push('[1-9]\\d{2,}');
    return parts.length === 1 ? `${parts[0]}%` : `(${parts.join('|')})%`;
  }
  if (min < 1000) {
    const hundreds = Math.floor(min / 100);
    const rest = min % 100;
    const tens = Math.floor(rest / 10);
    const ones = rest % 10;
    const parts = [];
    if (rest === 0) {
      parts.push(`${hundreds}\\d{2}`);
    } else if (tens === 0) {
      parts.push(`${hundreds}0[${ones}-9]`);
      parts.push(`${hundreds}[1-9]\\d`);
    } else if (ones === 0) {
      parts.push(`${hundreds}[${tens}-9]\\d`);
    } else {
      parts.push(`${hundreds}${tens}[${ones}-9]`);
      if (tens < 9) parts.push(`${hundreds}[${tens + 1}-9]\\d`);
    }
    if (hundreds < 9) parts.push(`[${hundreds + 1}-9]\\d{2}`);
    parts.push('[1-9]\\d{3,}');
    return `(${parts.join('|')})%`;
  }
  const digits = String(min).length;
  return `[1-9]\\d{${Math.max(1, digits - 1)},}%`;
}

function buildNumericStatRegex(stat, minValue) {
  const numberPattern = stat?.compact
    ? globalThis.POE2TQMapRegex?.buildCompactPercentAtLeastRegex(minValue)
    : buildPercentAtLeastRegex(minValue, stat);
  if (!stat?.prefix || !numberPattern) return '';
  return `${stat.prefix}${numberPattern}`;
}

function getSelectedRegexOptionGroups() {
  const include = [];
  const exclude = [];
  getCurrentRegexConfig().items.forEach((item, id) => {
    if (!item?.pattern) return;
    const state = getRegexOptionState(id);
    if (state === 'include') include.push(item.pattern);
    if (state === 'exclude') exclude.push(item.pattern);
  });
  const clean = pieces => Array.from(new Set(pieces.map(piece => String(piece || '').trim()).filter(Boolean)));
  return { include: clean(include), exclude: clean(exclude) };
}

function getSelectedRegexOptionPieces() {
  const groups = getSelectedRegexOptionGroups();
  const excludeTerm = combineNegatedRegexOrPieces(groups.exclude);
  return [
    ...groups.include.map(normalizePositiveRegexPiece),
    excludeTerm
  ].filter(Boolean);
}

function getSelectedRegexNumericPieces() {
  const selected = [];
  document.querySelectorAll('[data-regex-min]').forEach(input => {
    const stat = getCurrentRegexConfig().numericStats[input.dataset.regexMin];
    const pattern = buildNumericStatRegex(stat, input.value);
    if (pattern) selected.push(pattern);
  });
  return Array.from(new Set(selected.map(piece => String(piece || '').trim()).filter(Boolean)));
}

function getSelectedRegexPieces() {
  return Array.from(new Set([
    ...getSelectedRegexOptionPieces(),
    ...getSelectedRegexNumericPieces()
  ].map(piece => String(piece || '').trim()).filter(Boolean)));
}

function combineRegexOrPieces(pieces) {
  const clean = compactRegexAlternatives(
    pieces.flatMap(piece => splitRegexPieceAlternatives(piece))
  );
  if (!clean.length) return '';
  if (clean.length === 1) return clean[0];
  return clean.join('|');
}

function combineNegatedRegexOrPieces(pieces) {
  return buildNegatedRegexTerm(pieces);
}

function buildNegatedRegexTerm(pieces) {
  const alternatives = uniqueRegexPieces(
    pieces.flatMap(piece => splitRegexPieceAlternatives(piece))
  );
  if (!alternatives.length) return '';
  return `!${compactRegexAlternatives(alternatives).join('|')}`;
}

function formatRegexAndTerms(pieces) {
  const clean = pieces.map(piece => String(piece || '').trim()).filter(Boolean);
  if (!clean.length) return '';
  return clean.join(' ');
}

function buildWaystoneRegex() {
  const numericPieces = getSelectedRegexNumericPieces();
  const optionGroups = getSelectedRegexOptionGroups();
  const mode = document.querySelector('input[name="regex-mode"]:checked')?.value || 'or';
  const includePieces = optionGroups.include;
  const requiredPieces = [];
  const excludeTerm = combineNegatedRegexOrPieces(optionGroups.exclude);

  requiredPieces.push(...numericPieces);
  if (mode === 'or') {
    const includeOr = combineRegexOrPieces(includePieces);
    if (includeOr) requiredPieces.push(includeOr);
    if (excludeTerm) requiredPieces.push(excludeTerm);
  } else {
    requiredPieces.push(...includePieces.map(formatRegexAndPiece).filter(Boolean));
    if (excludeTerm) requiredPieces.push(excludeTerm);
  }

  return formatRegexAndTerms(requiredPieces);
}

function updateRegexGenerator() {
  const output = document.getElementById('regex-output');
  const lengthEl = document.getElementById('regex-length');
  const countEl = document.getElementById('regex-selected-count');
  if (!output) return;
  const regex = buildWaystoneRegex();
  output.value = regex;
  const lengthState = globalThis.POE2TQMapRegex?.getLengthState(regex)
    || { length: regex.length, max: 250, overLimit: regex.length > 250 };
  output.classList.toggle('over-limit', lengthState.overLimit);
  if (lengthEl) {
    lengthEl.textContent = `${lengthState.length} / ${lengthState.max}자`;
    lengthEl.classList.toggle('over-limit', lengthState.overLimit);
    lengthEl.title = lengthState.overLimit ? 'PoE 창고 검색 제한을 초과했습니다.' : '';
  }
  if (countEl) countEl.textContent = `${getSelectedRegexPieces().length}개 선택`;
}

function resetRegexGenerator() {
  getCurrentRegexSelections().clear();
  regexNumberStateByRealm[normalizeTradeRealm(settings.tradeRealm)] = {};
  const mode = document.querySelector('input[name="regex-mode"][value="or"]');
  if (mode) mode.checked = true;
  document.querySelectorAll('[data-regex-min]').forEach(input => { input.value = ''; });
  const search = document.getElementById('regex-option-search');
  if (search) search.value = '';
  regexOptionFilter = 'all';
  renderRegexOptions();
  updateRegexGenerator();
}

function getRegexNumberState() {
  const numbers = {};
  document.querySelectorAll('[data-regex-min]').forEach(input => {
    numbers[input.dataset.regexMin] = input.value || '';
  });
  regexNumberStateByRealm[normalizeTradeRealm(settings.tradeRealm)] = numbers;
  return numbers;
}

function getRegexSelectionState() {
  return Array.from(getCurrentRegexSelections().entries())
    .filter(([, state]) => state === 'include' || state === 'exclude')
    .map(([id, state]) => ({ id, state }));
}

function getRegexGeneratorState() {
  return {
    mode: document.querySelector('input[name="regex-mode"]:checked')?.value || 'or',
    numbers: getRegexNumberState(),
    selections: getRegexSelectionState()
  };
}

function applyRegexGeneratorState(state) {
  const selections = getCurrentRegexSelections();
  selections.clear();
  const mode = document.querySelector(`input[name="regex-mode"][value="${state?.mode === 'and' ? 'and' : 'or'}"]`);
  if (mode) mode.checked = true;
  document.querySelectorAll('[data-regex-min]').forEach(input => {
    input.value = state?.numbers?.[input.dataset.regexMin] || '';
  });
  regexNumberStateByRealm[normalizeTradeRealm(settings.tradeRealm)] = { ...(state?.numbers || {}) };
  (state?.selections || []).forEach(entry => {
    if (getCurrentRegexConfig().items.has(entry.id) && (entry.state === 'include' || entry.state === 'exclude')) {
      selections.set(entry.id, entry.state);
    }
  });
  renderRegexOptions();
  updateRegexGenerator();
}

function makeRegexPresetId() {
  return `regex_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

async function loadRegexUserPresets() {
  const realm = normalizeTradeRealm(settings.tradeRealm);
  const key = REGEX_PRESET_STORAGE_KEYS[realm];
  const result = await chrome.storage.local.get(key).catch(() => ({}));
  regexUserPresetsByRealm[realm] = Array.isArray(result[key]) ? result[key] : [];
  renderRegexUserPresets();
}

async function persistRegexUserPresets() {
  const realm = normalizeTradeRealm(settings.tradeRealm);
  await chrome.storage.local.set({ [REGEX_PRESET_STORAGE_KEYS[realm]]: getCurrentRegexPresets() });
}

function renderRegexUserPresets() {
  const presets = getCurrentRegexPresets();
  const list = document.getElementById('regex-user-preset-list');
  const count = document.getElementById('regex-preset-count');
  if (count) count.textContent = `${presets.length}개`;
  if (!list) return;
  if (!presets.length) {
    list.innerHTML = '<div class="regex-result-empty">저장된 프리셋이 없습니다.</div>';
    return;
  }
  list.innerHTML = presets.map(preset => `<div class="regex-preset-item">
    <button type="button" class="regex-preset-load" data-regex-load-preset="${esc(preset.id)}" title="${esc(preset.name)}">${esc(preset.name)}</button>
    <button type="button" class="regex-preset-delete" data-regex-delete-preset="${esc(preset.id)}">삭제</button>
  </div>`).join('');
  list.querySelectorAll('[data-regex-load-preset]').forEach(btn => {
    btn.addEventListener('click', () => loadRegexPreset(btn.dataset.regexLoadPreset));
  });
  list.querySelectorAll('[data-regex-delete-preset]').forEach(btn => {
    btn.addEventListener('click', () => deleteRegexPreset(btn.dataset.regexDeletePreset));
  });
}

async function saveCurrentRegexPreset() {
  const input = document.getElementById('regex-preset-name');
  const name = (input?.value || '').trim();
  if (!name) {
    alert('프리셋 이름을 입력해 주세요.');
    input?.focus();
    return;
  }
  const state = getRegexGeneratorState();
  const regex = buildWaystoneRegex();
  const presets = getCurrentRegexPresets();
  const existing = presets.find(preset => preset.name === name);
  if (existing) {
    existing.state = state;
    existing.regex = regex;
    existing.updatedAt = new Date().toISOString();
  } else {
    presets.push({
      id: makeRegexPresetId(),
      name,
      state,
      regex,
      savedAt: new Date().toISOString()
    });
  }
  await persistRegexUserPresets();
  if (input) input.value = '';
  renderRegexUserPresets();
}

function loadRegexPreset(id) {
  const preset = getCurrentRegexPresets().find(item => item.id === id);
  if (!preset) return;
  applyRegexGeneratorState(preset.state || {});
}

async function deleteRegexPreset(id) {
  const presets = getCurrentRegexPresets();
  const preset = presets.find(item => item.id === id);
  if (!preset) return;
  if (!confirm(`"${preset.name}" 프리셋을 삭제할까요?`)) return;
  regexUserPresetsByRealm[normalizeTradeRealm(settings.tradeRealm)] = presets.filter(item => item.id !== id);
  await persistRegexUserPresets();
  renderRegexUserPresets();
}

function setRegexOptionState(id, state, rerender = true) {
  const selections = getCurrentRegexSelections();
  const next = state === 'include' || state === 'exclude' ? state : 'none';
  if (next === 'none') selections.delete(id);
  else selections.set(id, next);
  if (rerender) {
    renderRegexOptions();
    updateRegexGenerator();
  }
}

function copyRegexOutput() {
  const output = document.getElementById('regex-output');
  const text = output?.value || '';
  if (!text) return;
  const markCopied = () => {
    const btn = document.getElementById('regex-copy');
    if (!btn) return;
    const prev = btn.textContent;
    btn.textContent = '복사됨';
    setTimeout(() => { btn.textContent = prev; }, 900);
  };
  const fallbackCopy = () => {
    output.focus();
    output.select();
    document.execCommand('copy');
    markCopied();
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(markCopied).catch(fallbackCopy);
    return;
  }
  fallbackCopy();
}

function renderRegexRealmUi() {
  const realm = normalizeTradeRealm(settings.tradeRealm);
  const config = getCurrentRegexConfig();
  const values = regexNumberStateByRealm[realm];
  const numberGrid = document.getElementById('regex-number-grid');
  if (numberGrid) {
    numberGrid.innerHTML = Object.entries(config.numericStats).map(([id, stat]) => `<label class="regex-number-row">
      <span>${esc(stat.label)}</span>
      <input type="text" class="regex-number-input" data-regex-min="${esc(id)}" inputmode="numeric" pattern="[0-9]*" placeholder="예: ${id === 'packSize' ? '30' : '100'}" value="${esc(values[id] || '')}">
    </label>`).join('');
    numberGrid.querySelectorAll('[data-regex-min]').forEach(input => {
      input.addEventListener('input', () => {
        regexNumberStateByRealm[realm][input.dataset.regexMin] = input.value;
        updateRegexGenerator();
      });
    });
  }
  const search = document.getElementById('regex-option-search');
  if (search) search.placeholder = config.searchPlaceholder;
  document.querySelector('[data-regex-filter="prefix"]')?.replaceChildren(document.createTextNode(config.groupLabels.prefix));
  document.querySelector('[data-regex-filter="suffix"]')?.replaceChildren(document.createTextNode(config.groupLabels.suffix));
  regexOptionFilter = 'all';
  renderRegexOptions();
  updateRegexGenerator();
}

function bindRegexGenerator() {
  renderRegexRealmUi();
  document.getElementById('regex-option-search')?.addEventListener('input', () => {
    renderRegexOptions();
    updateRegexGenerator();
  });
  document.querySelectorAll('[data-regex-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      regexOptionFilter = btn.dataset.regexFilter || 'all';
      renderRegexOptions();
    });
  });
  document.querySelectorAll('input[name="regex-mode"]').forEach(input => {
    input.addEventListener('change', updateRegexGenerator);
  });
  document.getElementById('regex-save-preset')?.addEventListener('click', saveCurrentRegexPreset);
  document.getElementById('regex-preset-name')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveCurrentRegexPreset();
  });
  document.getElementById('regex-reset')?.addEventListener('click', resetRegexGenerator);
  document.getElementById('regex-copy')?.addEventListener('click', copyRegexOutput);
  loadRegexUserPresets();
  updateRegexGenerator();
}

function switchUtilityTab(tabName = 'expedition') {
  const realm = normalizeTradeRealm(settings.tradeRealm);
  const validTabs = realm === TRADE_REALM_POE1
    ? ['wealth', 'equipment', 'passive', 'regex']
    : ['expedition', 'passive', 'regex'];
  const remembered = currentUtilityTabByRealm[realm];
  const next = validTabs.includes(tabName)
    ? tabName
    : (validTabs.includes(remembered) ? remembered : validTabs[0]);
  currentUtilityTab = next;
  currentUtilityTabByRealm[realm] = next;
  document.querySelectorAll('[data-utility-tab]').forEach(btn => {
    btn.hidden = btn.dataset.utilityRealm !== realm;
    btn.classList.toggle('active', btn.dataset.utilityRealm === realm && btn.dataset.utilityTab === next);
  });
  document.querySelectorAll('.utility-sub-panel').forEach(panel => {
    panel.hidden = panel.dataset.utilityRealm !== realm && panel.dataset.utilityRealm !== 'all';
    panel.classList.toggle('active', panel.id === `utility-panel-${next}`);
  });
  if (next === 'expedition') {
    renderExpedition(document.getElementById('expedition-search')?.value || '');
  } else if (next === 'passive') {
    setPassiveMode(passiveModeByRealm[realm]);
    loadAndRenderPassive(document.getElementById('passive-search')?.value || '');
  } else if (next === 'regex') {
    renderRegexRealmUi();
    loadRegexUserPresets();
  } else if (next === 'equipment' && poe1CharacterSource === 'pob' && poe1PobCharacterView) {
    renderPoe1CharacterEquipment(
      poe1PobCharacterView.items,
      poe1PobCharacterView.character,
      poe1PobCharacterView.stats
    );
  }
}

function setPoe1StashWealthMessage(message, isError = false) {
  const element = document.getElementById('stash-wealth-message');
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? '#d47468' : '#9d947d';
}

function setPoe1AccountSessionState(message, isError = false) {
  const element = document.getElementById('stash-account-session-state');
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? '#d47468' : '';
}

function fetchPoe1LoggedInAccountName() {
  if (poe1ProfileAccountPromise) return poe1ProfileAccountPromise;
  poe1ProfileAccountPromise = fetchTradeJson(
    TRADE_REALM_POE1,
    'https://poe.kakaogames.com/api/profile',
    { credentials: 'include' }
  ).then(result => {
    if (!result.ok) throw new Error(`프로필 API 요청 실패 (HTTP ${result.status || 0})`);
    const accountName = POE2TQTradeCompat.getProfileAccountName(result.payload);
    if (!accountName) throw new Error('로그인 프로필에서 계정명을 찾지 못했습니다.');
    return accountName;
  }).catch(error => {
    poe1ProfileAccountPromise = null;
    throw error;
  });
  return poe1ProfileAccountPromise;
}

async function resolvePoe1AccountName(input) {
  if (poe1ManualAccountOverride) {
    const manualAccountName = String(input?.value || '').trim();
    setPoe1AccountSessionState(manualAccountName || '수동 계정', !manualAccountName);
    return manualAccountName;
  }
  setPoe1AccountSessionState('계정 확인 중');
  try {
    const accountName = await fetchPoe1LoggedInAccountName();
    if (input) {
      input.value = accountName;
      input.readOnly = true;
      input.title = '현재 카카오/다음 거래소 로그인 계정';
    }
    for (const accountInput of [
      document.getElementById('stash-account-name'),
      document.getElementById('character-account-name')
    ]) {
      if (!accountInput) continue;
      accountInput.value = accountName;
      accountInput.readOnly = true;
      accountInput.title = '현재 카카오/다음 거래소 로그인 계정';
    }
    await chrome.storage.local.set({ [POE1_STASH_ACCOUNT_KEY]: accountName }).catch(() => {});
    setPoe1AccountSessionState(accountName);
    return accountName;
  } catch (error) {
    for (const accountInput of [
      document.getElementById('stash-account-name'),
      document.getElementById('character-account-name')
    ]) {
      if (!accountInput) continue;
      accountInput.readOnly = false;
      accountInput.title = '';
    }
    if (input?.closest('details')) input.closest('details').open = true;
    setPoe1AccountSessionState('수동 계정', true);
    appendSidepanelDebugLog({ kind: 'poe1-profile-account-detect-failed', error: serializeDebugError(error) });
    return String(input?.value || '').trim();
  }
}

function buildPoe1StashUrl(accountName, league, tabIndex, includeTabs) {
  const params = new URLSearchParams({
    accountName,
    league,
    tabs: includeTabs ? '1' : '0',
    tabIndex: String(tabIndex)
  });
  return `https://poe.kakaogames.com/character-window/get-stash-items?${params}`;
}

async function fetchPoe1StashTab(accountName, league, tabIndex, includeTabs = false) {
  const result = await fetchTradeJson(
    TRADE_REALM_POE1,
    buildPoe1StashUrl(accountName, league, tabIndex, includeTabs),
    { credentials: 'include' }
  );
  if (!result.ok) {
    const apiMessage = String(result.payload?.error?.message || result.payload?.error || result.payload?.message || '').trim();
    let message;
    if (result.status === 403) {
      message = '창고 접근이 거부되었습니다(HTTP 403). 카카오/다음 PoE 거래소 로그인 상태를 확인해 주세요.';
    } else if (result.status === 429) {
      message = '창고 요청이 너무 많아 일시 제한되었습니다(HTTP 429). 잠시 기다린 뒤 자동으로 재시도합니다.';
    } else if (result.status === 0) {
      message = '창고 요청 전달에 실패했습니다(HTTP 0). 거래소 페이지를 새로고침해 주세요.';
    } else {
      message = `창고 API 요청 실패 (HTTP ${result.status || 0}${result.statusText ? ` ${result.statusText}` : ''})`;
    }
    if (apiMessage) message += ` · ${apiMessage}`;
    const error = new Error(message);
    error.status = result.status;
    const retryAfterSeconds = Number.parseFloat(result.retryAfter);
    error.retryAfterMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
      ? Math.min(60_000, retryAfterSeconds * 1000)
      : 0;
    error.payload = result.payload;
    throw error;
  }
  if (result.payload?.error) {
    const apiMessage = result.payload.error.message || result.payload.error;
    throw new Error(`창고 API 오류: ${apiMessage}`);
  }
  return result.payload || {};
}

function waitForStashRetry(delayMs) {
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

async function fetchPoe1StashTabWithRetry(accountName, league, tabIndex, includeTabs = false, maxAttempts = 3) {
  let lastError;
  const attempts = Math.max(1, Math.min(5, Number(maxAttempts) || 3));
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fetchPoe1StashTab(accountName, league, tabIndex, includeTabs);
    } catch (error) {
      lastError = error;
      const retryable = error?.status === 429
        || error?.status === 502
        || error?.status === 503
        || error?.status === 504
        || error?.status === 0
        || /시간이 초과|HTTP 429|요청 실패|failed to fetch|network/i.test(String(error?.message || ''));
      if (!retryable) break;
      if (attempt < attempts - 1) {
        const fallbackDelay = 1000 * (2 ** attempt);
        await waitForStashRetry(Math.max(fallbackDelay, Number(error?.retryAfterMs) || 0));
      }
    }
  }
  throw lastError;
}

function isPoe1CurrencyWealthTab(tab) {
  if (!tab || tab.hidden || tab.metadata?.folder) return false;
  const type = String(tab.type || tab.stashType || '');
  const name = String(tab.n || tab.name || '');
  if (/(remove.only|제거만 가능)/i.test(name)) return false;
  return /(currency|fragment|scarab|essence|divination|delve|blight|delirium|ultimatum|metamorph|map)/i.test(type);
}

function isPoe1CoreFarmingStashTab(tab) {
  return Boolean(POE2TQStashHistory?.isCoreFarmingStashTab(tab));
}

function isPoe1SpecializedWealthStashTab(tab) {
  return Boolean(POE2TQStashHistory?.isSpecializedWealthStashTab(tab));
}

function isPoe1SelectableStashTab(tab) {
  if (!tab || tab.hidden || tab.metadata?.folder) return false;
  const type = String(tab.type || tab.stashType || '');
  const name = String(tab.n || tab.name || '');
  return !/(folder)/i.test(type) && !/(remove.only|제거만 가능)/i.test(name);
}

function getPoe1StashTabTypeLabel(tab) {
  const type = String(tab?.type || tab?.stashType || '');
  const value = `${type} ${tab?.n || tab?.name || ''}`;
  if (/currency/i.test(value)) return '화폐';
  if (/fragmentstash/i.test(type)) return '조각 창고';
  const name = String(tab?.n || tab?.name || '');
  if (/scarab|갑충/i.test(name)) return '갑충석';
  if (/fragment|조각/i.test(name)) return '조각';
  if (/scarab|갑충/i.test(value)) return '갑충석';
  if (/fragment|조각/i.test(value)) return '조각';
  if (/essence|에센스/i.test(value)) return '에센스';
  if (/divination|card|점술/i.test(value)) return '점술 카드';
  if (/delirium|환영/i.test(value)) return '환영';
  if (/map|지도/i.test(value)) return '지도';
  if (/delve|화석|공명/i.test(value)) return '화석/공명기';
  if (/blight|성유|오일/i.test(value)) return '성유/오일';
  if (/ultimatum|결전/i.test(value)) return '결전';
  if (/unique|고유/i.test(value)) return '고유 아이템';
  return '일반 창고';
}

function getPoe1StashTabColor(tab) {
  const value = tab?.colour ?? tab?.color ?? tab?.metadata?.colour ?? tab?.metadata?.color;
  if (value && typeof value === 'object') {
    const red = Number(value.r ?? value.red ?? value[0]);
    const green = Number(value.g ?? value.green ?? value[1]);
    const blue = Number(value.b ?? value.blue ?? value[2]);
    if ([red, green, blue].every(channel => Number.isFinite(channel) && channel >= 0 && channel <= 255)) {
      const toHex = channel => Math.round(channel).toString(16).padStart(2, '0');
      return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
    }
    return '';
  }
  const match = String(value || '').trim().match(/^#?([0-9a-f]{6})$/i);
  return match ? `#${match[1]}` : '';
}

function getPoe1StashTabImage(tab) {
  const apiImage = String(
    tab?.src
    || tab?.image
    || tab?.icon
    || tab?.metadata?.image
    || tab?.metadata?.icon
    || ''
  ).trim();
  if (apiImage) return apiImage;
  const identity = `${tab?.type || tab?.stashType || ''} ${tab?.n || tab?.name || ''}`;
  return POE1_STASH_TAB_FALLBACK_IMAGES.find(([pattern]) => pattern.test(identity))?.[1] || '';
}

function getSelectedPoe1StashSelections() {
  return [...document.querySelectorAll('#stash-tab-list input[data-stash-tab-index]:checked')]
    .map(input => ({
      index: Number(input.dataset.stashTabIndex),
      filter: input.dataset.stashFilter || 'all'
    }))
    .filter(selection => Number.isInteger(selection.index));
}

function getPoe1CoreFarmingStashSelections() {
  return [...document.querySelectorAll('#stash-tab-list input[data-farming-core="true"]')]
    .map(input => ({
      index: Number(input.dataset.stashTabIndex),
      filter: input.dataset.stashFilter || 'all'
    }))
    .filter(selection => Number.isInteger(selection.index));
}

function applyPoe1StashSelections(selections) {
  const selectedKeys = new Set((selections || []).map(
    selection => `${Number(selection.index)}:${String(selection.filter || 'all')}`
  ));
  document.querySelectorAll('#stash-tab-list input[data-stash-tab-index]').forEach(input => {
    input.checked = selectedKeys.has(`${Number(input.dataset.stashTabIndex)}:${input.dataset.stashFilter || 'all'}`);
  });
  syncPoe1StashSelectionUi();
}

function syncPoe1StashSelectionUi() {
  const selectedCount = getSelectedPoe1StashSelections().length;
  const title = document.getElementById('stash-tab-picker-title');
  const button = document.getElementById('stash-wealth-scan');
  if (title) title.textContent = `창고 탭 선택 · ${selectedCount}개`;
  if (button) button.disabled = selectedCount === 0;
}

function setPoe1StashTabSelection(mode) {
  document.querySelectorAll('#stash-tab-list input[data-stash-tab-index]').forEach(input => {
    input.checked = mode === 'all' || (mode === 'recommended' && input.dataset.recommended === 'true');
  });
  syncPoe1StashSelectionUi();
  schedulePoe1StashAutoScan();
}

function schedulePoe1StashAutoScan(delayMs = 450, forceRefresh = false) {
  if (poe1StashAutoScanTimer) {
    clearTimeout(poe1StashAutoScanTimer);
    poe1StashAutoScanTimer = null;
  }
  const selections = getSelectedPoe1StashSelections();
  if (!poe1LoadedStashContext) return;
  if (!selections.length) {
    poe1StashWealthView = { rows: [], chaosRate: 1 };
    const summary = document.getElementById('stash-wealth-summary');
    if (summary) {
      summary.hidden = true;
      summary.innerHTML = '';
    }
    document.getElementById('stash-result-tools')?.setAttribute('hidden', '');
    const list = document.getElementById('stash-wealth-list');
    if (list) list.innerHTML = '';
    setPoe1StashWealthMessage('계산할 특수 창고를 하나 이상 선택해 주세요.');
    return;
  }
  setPoe1StashWealthMessage('선택한 창고의 시세를 곧바로 계산합니다...');
  poe1StashAutoScanTimer = setTimeout(() => {
    poe1StashAutoScanTimer = null;
    scanPoe1StashWealth({ forceRefresh }).catch(error => {
      setPoe1StashWealthMessage(error?.message || '창고를 불러오지 못했습니다.', true);
    });
  }, Math.max(0, Number(delayMs) || 0));
}

function ensurePoe1CoreFarmingStashSelections() {
  document.querySelectorAll('#stash-tab-list input[data-farming-core="true"]').forEach(input => {
    input.checked = true;
  });
  syncPoe1StashSelectionUi();
}

function selectOnlyPoe1CoreFarmingStashSelections() {
  applyPoe1StashSelections(getPoe1CoreFarmingStashSelections());
}

async function clearIncompatiblePoe1ActiveStashSession() {
  await ensurePoe1StashHistoryLoaded();
  const current = getCurrentPoe1StashHistoryContext();
  const session = poe1StashSessionStore[current.key];
  if (!session?.active) return;
  const coreScope = POE2TQStashHistory.getSelectionKey(getPoe1CoreFarmingStashSelections());
  if (String(session.baseline?.scopeKey || '') === coreScope) return;
  poe1StashSessionStore[current.key] = {
    active: false,
    lastCompleted: session.lastCompleted || null
  };
  await chrome.storage.local.set({ [POE1_STASH_SESSION_KEY]: poe1StashSessionStore });
}

function renderPoe1StashTabPicker(tabs) {
  const picker = document.getElementById('stash-tab-picker');
  const list = document.getElementById('stash-tab-list');
  if (!picker || !list) return;
  const selectable = tabs
    .map((tab, position) => ({
      tab,
      index: Number.isInteger(Number(tab?.i)) ? Number(tab.i) : position
    }))
    .filter(entry => isPoe1SelectableStashTab(entry.tab) && isPoe1SpecializedWealthStashTab(entry.tab));
  const cards = selectable.flatMap(entry => {
    const type = String(entry.tab?.type || entry.tab?.stashType || '');
    if (!/fragmentstash/i.test(type)) return [{ ...entry, filter: 'all' }];
    return [
      { ...entry, filter: 'scarab', displayName: '갑충석', typeLabel: '갑충석 보관 페이지' },
      { ...entry, filter: 'fragment', displayName: '조각', typeLabel: '조각 보관 페이지' }
    ];
  });
  list.innerHTML = cards.map(entry => {
    const originalName = String(entry.tab?.n || entry.tab?.name || `탭 ${entry.index + 1}`);
    const name = entry.displayName ? `${originalName} · ${entry.displayName}` : originalName;
    const recommended = isPoe1CoreFarmingStashTab(entry.tab);
    const tabColor = getPoe1StashTabColor(entry.tab);
    const tabImage = entry.filter === 'all'
      ? getPoe1StashTabImage(entry.tab)
      : getPoe1StashTabImage({ ...entry.tab, type: '', stashType: '', n: entry.displayName, name: entry.displayName });
    return `<label class="stash-tab-option${tabColor ? ' has-custom-color' : ''}"${tabColor ? ` style="--stash-tab-color:${tabColor}"` : ''}>
      <input type="checkbox" data-stash-tab-index="${entry.index}" data-stash-filter="${entry.filter}" data-recommended="${recommended}" data-farming-core="${recommended}"${recommended ? ' checked' : ''}>
      ${tabImage ? `<img class="stash-tab-option-icon" src="${esc(resolveNinjaImageUrl(tabImage))}" alt="">` : ''}
      <span class="stash-tab-option-text">${esc(name)}<span class="stash-tab-option-type">${esc(entry.typeLabel || getPoe1StashTabTypeLabel(entry.tab))} · ${esc(entry.tab?.type || entry.tab?.stashType || `탭 ${entry.index + 1}`)}</span></span>
    </label>`;
  }).join('');
  picker.hidden = false;
  list.querySelectorAll('input[data-stash-tab-index]').forEach(input => {
    input.addEventListener('change', () => {
      syncPoe1StashSelectionUi();
      schedulePoe1StashAutoScan();
    });
  });
  list.querySelectorAll('.stash-tab-option-icon').forEach(image => {
    image.addEventListener('error', () => { image.style.display = 'none'; }, { once: true });
  });
  syncPoe1StashSelectionUi();
  return cards.length;
}

async function loadPoe1StashTabs() {
  const accountInput = document.getElementById('stash-account-name');
  const loadButton = document.getElementById('stash-load-tabs');
  if (loadButton) loadButton.disabled = true;
  const accountName = await resolvePoe1AccountName(accountInput);
  if (!accountName) {
    setPoe1StashWealthMessage('로그인 계정을 자동 확인하지 못했습니다. 계정명을 입력해 주세요.', true);
    accountInput?.focus();
    if (loadButton) loadButton.disabled = false;
    return;
  }
  const league = settings.league || 'Standard';
  setPoe1StashWealthMessage(`${league} 창고 탭 목록을 불러오는 중...`);
  try {
    if (poe1StashAutoScanTimer) {
      clearTimeout(poe1StashAutoScanTimer);
      poe1StashAutoScanTimer = null;
    }
    if (poe1StashScanPromise) {
      setPoe1StashWealthMessage('진행 중인 창고 계산을 마친 뒤 탭 목록을 갱신합니다...');
      await poe1StashScanPromise.catch(() => false);
      if (poe1StashAutoScanTimer) {
        clearTimeout(poe1StashAutoScanTimer);
        poe1StashAutoScanTimer = null;
      }
      poe1StashScanQueued = false;
      await waitForStashRetry(300);
    }
    setPoe1StashWealthMessage(`${league} 창고 탭 목록을 불러오는 중...`);
    const first = await fetchPoe1StashTabWithRetry(accountName, league, 0, true, 4);
    const tabs = Array.isArray(first.tabs) ? first.tabs : [];
    if (!tabs.length) throw new Error('선택한 리그에서 창고 탭을 찾지 못했습니다.');
    poe1LoadedStashContext = {
      accountName,
      league,
      tabs,
      firstItems: Array.isArray(first.items) ? first.items : [],
      itemsByTab: new Map([[0, Array.isArray(first.items) ? first.items : []]])
    };
    await chrome.storage.local.set({ [POE1_STASH_ACCOUNT_KEY]: accountName }).catch(() => {});
    const visibleTabCount = renderPoe1StashTabPicker(tabs);
    await clearIncompatiblePoe1ActiveStashSession();
    await renderPoe1StashHistory();
    setPoe1StashWealthMessage(`시세 계산이 가능한 특수 창고 ${Number(visibleTabCount).toLocaleString('ko-KR')}개를 찾았습니다.`);
    schedulePoe1StashAutoScan(0);
  } catch (error) {
    poe1LoadedStashContext = null;
    setPoe1StashWealthMessage(error?.message || '창고 탭 목록을 불러오지 못했습니다.', true);
  } finally {
    if (loadButton) loadButton.disabled = false;
  }
}

function fetchNinjaOverviewForWealth(league, category) {
  const endpoint = category.endpoint || 'exchange';
  const cacheKey = `${TRADE_REALM_POE1}::${league}::${endpoint}::${category.type}`;
  const cached = ninjaCacheMap[cacheKey];
  if (cached && Date.now() - cached.fetchedAt < 5 * 60 * 1000) return Promise.resolve(cached.data);
  return new Promise(resolve => {
    chrome.runtime.sendMessage({
      type: 'FETCH_NINJA',
      realm: TRADE_REALM_POE1,
      league,
      itemType: category.type,
      endpoint
    }, response => {
      if (chrome.runtime.lastError || !response?.ok || !response.data) {
        resolve(null);
        return;
      }
      ninjaCacheMap[cacheKey] = { data: response.data, fetchedAt: Date.now() };
      resolve(response.data);
    });
  });
}

function normalizeStashWealthName(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/^\{+|\}+$/g, '')
    .trim()
    .toLowerCase();
}

function addStashWealthPriceAliases(priceMap, rawName, koreanName, value, imagePath, category) {
  if (!(value > 0)) return;
  [rawName, koreanName].forEach(name => {
    const key = normalizeStashWealthName(name);
    if (key) priceMap.set(key, { rawName, koreanName: koreanName || rawName, value, imagePath, category });
  });
}

function getPoe1GemVariantKey(name, level, quality, corrupted) {
  const normalizedName = normalizeStashWealthName(name);
  const normalizedLevel = Number(level);
  const normalizedQuality = Number(quality);
  if (!normalizedName || !Number.isFinite(normalizedLevel) || !Number.isFinite(normalizedQuality)) return '';
  return `gem:${normalizedName}|l:${normalizedLevel}|q:${normalizedQuality}|c:${corrupted ? 1 : 0}`;
}

function getPoe1GemIconVariantKey(icon, level, quality, corrupted) {
  const iconIdentity = POE2TQTradeCompat.getItemIconIdentity(icon);
  const normalizedLevel = Number(level);
  const normalizedQuality = Number(quality);
  if (!iconIdentity || !Number.isFinite(normalizedLevel) || !Number.isFinite(normalizedQuality)) return '';
  return `gem-icon:${iconIdentity}|l:${normalizedLevel}|q:${normalizedQuality}|c:${corrupted ? 1 : 0}`;
}

function getPoe1ItemPropertyNumber(item, namePattern) {
  const properties = [...(item?.properties || []), ...(item?.additionalProperties || [])];
  for (const property of properties) {
    const propertyName = String(property?.name || '').replace(/<[^>]*>/g, '').trim();
    if (!namePattern.test(propertyName)) continue;
    const rawValue = property?.values?.[0]?.[0] ?? property?.value ?? propertyName;
    const match = String(rawValue).replace(/<[^>]*>/g, '').match(/-?\d+(?:\.\d+)?/);
    if (match) return Number(match[0]);
  }
  return null;
}

function isPoe1StashGemItem(item) {
  return Number(item?.frameType) === 4
    || Number(item?.itemClass) === 4
    || /gem|젬/i.test(`${item?.itemClass || ''} ${item?.icon || ''}`);
}

function getPoe1StashGemVariantKey(item) {
  if (!isPoe1StashGemItem(item)) return '';
  const name = getPoe1StashItemName(item);
  const level = getPoe1ItemPropertyNumber(item, /(?:^|\s)(?:level|레벨)(?:\s*:|$)/i);
  const quality = getPoe1ItemPropertyNumber(item, /(?:quality|퀄리티)/i) ?? 0;
  return getPoe1GemVariantKey(name, level, quality, Boolean(item?.corrupted));
}

function getPoe1StashGemIconVariantKey(item) {
  if (!isPoe1StashGemItem(item)) return '';
  const hasDirectLevel = item?.gemLevel != null && item.gemLevel !== '' && Number.isFinite(Number(item.gemLevel));
  const level = hasDirectLevel
    ? Number(item.gemLevel)
    : getPoe1ItemPropertyNumber(item, /(?:^|\s)(?:level|레벨)(?:\s*:|$)/i);
  const propertyQuality = getPoe1ItemPropertyNumber(item, /(?:quality|퀄리티)/i);
  const hasDirectQuality = item?.gemQuality != null && item.gemQuality !== '' && Number.isFinite(Number(item.gemQuality));
  const quality = hasDirectQuality ? Number(item.gemQuality) : (propertyQuality ?? 0);
  return getPoe1GemIconVariantKey(item?.icon, level, quality, Boolean(item?.corrupted));
}

function addPoe1GemPriceCandidate(priceMap, key, price) {
  if (!key) return;
  const candidates = priceMap.get(key) || [];
  candidates.push(price);
  priceMap.set(key, candidates);
}

function getPoe1GemNameIndexKey(name) {
  const normalizedName = normalizeStashWealthName(name);
  return normalizedName ? `gem-name-index:${normalizedName}` : '';
}

function getPoe1GemIconIndexKey(icon) {
  const iconIdentity = POE2TQTradeCompat.getItemIconIdentity(icon);
  return iconIdentity ? `gem-icon-index:${iconIdentity}` : '';
}

function addStashWealthGemPrice(priceMap, line, info, value, imagePath, category) {
  if (!(value > 0)) return;
  const rawName = getNinjaRawName(line, info);
  const level = Number(line?.gemLevel ?? info?.gemLevel);
  const quality = Number(line?.gemQuality ?? info?.gemQuality ?? 0);
  const corrupted = Boolean(line?.corrupted ?? info?.corrupted);
  const key = getPoe1GemVariantKey(rawName, level, quality, corrupted);
  if (!key) return;
  const koreanName = poe1ItemNamesKo?.[rawName] || rawName;
  const variantLabel = `${level}레벨 · 퀄리티 ${quality}%${corrupted ? ' · 타락' : ''}`;
  const price = {
    rawName: key,
    koreanName: `${koreanName} · ${variantLabel}`,
    stashNameSuffix: koreanName === rawName ? ` · ${variantLabel}` : '',
    level,
    quality,
    corrupted,
    value,
    imagePath,
    category
  };
  [rawName, koreanName].forEach(name => {
    const variantKey = getPoe1GemVariantKey(name, level, quality, corrupted);
    if (variantKey) priceMap.set(variantKey, price);
    addPoe1GemPriceCandidate(priceMap, getPoe1GemNameIndexKey(name), price);
  });
  const iconVariantKey = getPoe1GemIconVariantKey(imagePath, level, quality, corrupted);
  if (iconVariantKey) priceMap.set(iconVariantKey, price);
  addPoe1GemPriceCandidate(priceMap, getPoe1GemIconIndexKey(imagePath), price);
}

function resolvePoe1StashGemPrice(item, priceMap) {
  if (!isPoe1StashGemItem(item)) return null;
  const nameKey = getPoe1StashGemVariantKey(item);
  const iconKey = getPoe1StashGemIconVariantKey(item);
  const exact = priceMap.get(nameKey) || priceMap.get(iconKey);
  if (exact) return exact;

  const hasDirectLevel = item?.gemLevel != null && item.gemLevel !== '' && Number.isFinite(Number(item.gemLevel));
  const level = hasDirectLevel
    ? Number(item.gemLevel)
    : getPoe1ItemPropertyNumber(item, /(?:^|\s)(?:level|레벨)(?:\s*:|$)/i);
  const propertyQuality = getPoe1ItemPropertyNumber(item, /(?:quality|퀄리티)/i);
  const hasDirectQuality = item?.gemQuality != null && item.gemQuality !== '' && Number.isFinite(Number(item.gemQuality));
  const quality = hasDirectQuality ? Number(item.gemQuality) : (propertyQuality ?? 0);
  const target = { level, quality, corrupted: Boolean(item?.corrupted) };
  const candidates = [
    ...(priceMap.get(getPoe1GemNameIndexKey(getPoe1StashItemName(item))) || []),
    ...(priceMap.get(getPoe1GemIconIndexKey(item?.icon)) || [])
  ];
  return POE2TQTradeCompat.selectClosestGemVariant(candidates, target);
}

async function buildPoe1StashWealthPriceMap(league) {
  await loadPoe1ItemNamesKo();
  const categories = getNinjaCategoriesForRealm(TRADE_REALM_POE1)
    .filter(category => (category.endpoint || 'exchange') === 'exchange'
      || category.type === 'Map'
      || category.type === 'UniqueMap'
      || category.type === 'SkillGem');
  const responses = await Promise.all(categories.map(category => fetchNinjaOverviewForWealth(league, category)));
  const priceMap = new Map();
  responses.forEach((data, responseIndex) => {
    if (!data) return;
    const items = data.items || data.core?.items || [];
    const itemMap = new Map(items.map(item => [item.id, item]));
    (data.lines || []).forEach(line => {
      const info = itemMap.get(line.id) || {};
      const rawName = getNinjaRawName(line, info);
      const value = POE2TQTradeCompat.getLineValueInDivine(TRADE_REALM_POE1, line, data);
      if (categories[responseIndex]?.type === 'SkillGem') {
        addStashWealthGemPrice(
          priceMap,
          line,
          info,
          value,
          getNinjaLineImage(line, info),
          categories[responseIndex]?.label || ''
        );
        return;
      }
      addStashWealthPriceAliases(
        priceMap,
        rawName,
        poe1ItemNamesKo?.[rawName],
        value,
        getNinjaLineImage(line, info),
        categories[responseIndex]?.label || ''
      );
    });
    const rates = POE2TQTradeCompat.buildRatesPerDivine(TRADE_REALM_POE1, data);
    if (Object.keys(rates).length > Object.keys(currentTradeRates).length) currentTradeRates = rates;
  });
  return priceMap;
}

function isPoe1StashScarab(item, priceMap) {
  const itemName = getPoe1StashItemName(item);
  const price = priceMap.get(normalizeStashWealthName(itemName));
  return /scarab|스캐럽|갑충/i.test(`${price?.category || ''} ${itemName} ${item?.icon || ''}`);
}

function filterPoe1FragmentStashItems(items, filters, priceMap) {
  if (!filters?.size || filters.has('all') || (filters.has('scarab') && filters.has('fragment'))) return items;
  if (filters.has('scarab')) return items.filter(item => isPoe1StashScarab(item, priceMap));
  if (filters.has('fragment')) return items.filter(item => !isPoe1StashScarab(item, priceMap));
  return [];
}

function getPoe1StashItemName(item) {
  return String(item?.typeLine || item?.baseType || item?.name || '').replace(/<[^>]*>/g, '').trim();
}

function getPoe1StashItemQuantity(item) {
  const quantity = Number(item?.stackSize ?? item?.stackSizeText ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function getPoe1StashInventoryKey(item) {
  if (isPoe1StashGemItem(item)) {
    return getPoe1StashGemVariantKey(item)
      || getPoe1StashGemIconVariantKey(item)
      || `gem:${normalizeStashWealthName(getPoe1StashItemName(item))}`;
  }
  const identity = normalizeStashWealthName(getPoe1StashItemName(item))
    || POE2TQTradeCompat.getItemIconIdentity(item?.icon)
    || String(item?.id || '');
  return `item:${identity}`;
}

function formatStashWealthValue(divineValue, chaosRate) {
  if (!(divineValue > 0)) return '0c';
  if (divineValue >= 1) return `${divineValue.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} div`;
  const chaos = divineValue * chaosRate;
  return `${chaos.toLocaleString('ko-KR', { maximumFractionDigits: chaos >= 10 ? 0 : 1 })} c`;
}

function formatSignedStashWealthValue(value, chaosRate) {
  const number = Number(value) || 0;
  if (Math.abs(number) < 0.00001) return '0 c';
  return `${number > 0 ? '+' : '-'}${formatStashWealthValue(Math.abs(number), chaosRate)}`;
}

function formatCompactSignedStashWealthValue(value, chaosRate) {
  const number = Number(value) || 0;
  const sign = number > 0 ? '+' : (number < 0 ? '-' : '');
  const absolute = Math.abs(number);
  if (absolute >= 1) {
    return `${sign}${absolute.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} D`;
  }
  const chaos = absolute * chaosRate;
  if (chaos > 0 && chaos < 0.001) return `${sign}<0.001 C`;
  const maximumFractionDigits = chaos >= 10 ? 0 : (chaos >= 1 ? 1 : (chaos >= 0.1 ? 2 : 3));
  return `${sign}${chaos.toLocaleString('ko-KR', { maximumFractionDigits })} C`;
}

function setStashMetricValue(id, value, chaosRate) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = value == null ? '-' : formatSignedStashWealthValue(value, chaosRate);
  element.classList.toggle('positive', Number(value) > 0);
  element.classList.toggle('negative', Number(value) < 0);
}

async function ensurePoe1StashHistoryLoaded() {
  if (poe1StashHistoryStore && poe1StashSessionStore) return;
  const stored = await chrome.storage.local.get([POE1_STASH_HISTORY_KEY, POE1_STASH_SESSION_KEY]);
  poe1StashHistoryStore = stored?.[POE1_STASH_HISTORY_KEY] && typeof stored[POE1_STASH_HISTORY_KEY] === 'object'
    ? stored[POE1_STASH_HISTORY_KEY]
    : {};
  poe1StashSessionStore = stored?.[POE1_STASH_SESSION_KEY] && typeof stored[POE1_STASH_SESSION_KEY] === 'object'
    ? stored[POE1_STASH_SESSION_KEY]
    : {};
}

function getCurrentPoe1StashHistoryContext() {
  const accountName = String(document.getElementById('stash-account-name')?.value || '').trim();
  const league = settings.league || 'Standard';
  return {
    accountName,
    league,
    key: POE2TQStashHistory.getContextKey(accountName, league)
  };
}

function getPoe1StashHistoryRangeCutoff(session) {
  const now = Date.now();
  if (poe1StashHistoryRange === 'session') {
    return Number(session?.active ? session?.baseline?.timestamp : session?.lastCompleted?.baseline?.timestamp) || now;
  }
  if (poe1StashHistoryRange === '7d') return now - 7 * 24 * 60 * 60 * 1000;
  if (poe1StashHistoryRange === '30d') return now - 30 * 24 * 60 * 60 * 1000;
  return now - 24 * 60 * 60 * 1000;
}

function getPoe1StashHistorySeries(history, session) {
  const cutoff = getPoe1StashHistoryRangeCutoff(session);
  const completedEnd = !session?.active && session?.lastCompleted?.end
    ? Number(session.lastCompleted.end.timestamp)
    : Number.POSITIVE_INFINITY;
  const snapshots = history.filter(snapshot => Number(snapshot?.timestamp) >= cutoff
    && (poe1StashHistoryRange !== 'session' || Number(snapshot?.timestamp) <= completedEnd));
  const baseline = session?.active ? session.baseline : session?.lastCompleted?.baseline;
  if (poe1StashHistoryRange === 'session' && baseline && !snapshots.some(item => item.id === baseline.id)) {
    snapshots.unshift(baseline);
  }
  const end = !session?.active ? session?.lastCompleted?.end : null;
  if (poe1StashHistoryRange === 'session' && end && !snapshots.some(item => item.id === end.id)) {
    snapshots.push(end);
  }
  return POE2TQStashHistory.buildSeries(snapshots);
}

function drawPoe1StashHistoryChart(series) {
  const canvas = document.getElementById('stash-history-canvas');
  const empty = document.getElementById('stash-history-empty');
  if (!canvas) return;
  hidePoe1StashChartHover();
  const bounds = canvas.getBoundingClientRect();
  if (!(bounds.width > 0) || !(bounds.height > 0)) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(bounds.width * ratio);
  canvas.height = Math.round(bounds.height * ratio);
  const context = canvas.getContext('2d');
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, bounds.width, bounds.height);
  poe1StashChartVisiblePoints = [];
  if (!series.length) {
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  const padding = { left: 38, right: 8, top: 10, bottom: 22 };
  const width = Math.max(1, bounds.width - padding.left - padding.right);
  const height = Math.max(1, bounds.height - padding.top - padding.bottom);
  const values = series.map(point => Number(point.snapshot.totalDivine) || 0);
  let minimum = Math.min(...values);
  let maximum = Math.max(...values);
  const spread = Math.max(maximum - minimum, maximum * 0.04, 0.1);
  minimum = Math.max(0, minimum - spread * 0.18);
  maximum += spread * 0.18;
  const firstTime = Number(series[0].snapshot.timestamp);
  const lastTime = Number(series[series.length - 1].snapshot.timestamp);
  const timeSpread = Math.max(1, lastTime - firstTime);
  const xFor = timestamp => padding.left + ((timestamp - firstTime) / timeSpread) * width;
  const yFor = value => padding.top + (1 - (value - minimum) / Math.max(0.00001, maximum - minimum)) * height;

  context.font = '8px Segoe UI, Malgun Gothic, sans-serif';
  context.textAlign = 'right';
  context.textBaseline = 'middle';
  for (let line = 0; line <= 3; line++) {
    const y = padding.top + (height * line) / 3;
    const value = maximum - ((maximum - minimum) * line) / 3;
    context.strokeStyle = '#34362f';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(bounds.width - padding.right, y);
    context.stroke();
    context.fillStyle = '#686a63';
    context.fillText(value >= 10 ? value.toFixed(0) : value.toFixed(1), padding.left - 5, y);
  }

  const lineSeries = POE2TQStashHistory.downsampleChartSeries(
    series,
    Math.max(8, Math.floor(width / 14))
  );
  const linePoints = lineSeries.map((point, index) => {
    const previousVisiblePoint = index > 0 ? lineSeries[index - 1] : null;
    const plottedValue = Number(point.snapshot.totalDivine) || 0;
    const previousPlottedValue = previousVisiblePoint
      ? Number(previousVisiblePoint.snapshot.totalDivine) || 0
      : null;
    return {
      ...point,
      x: xFor(Number(point.snapshot.timestamp)),
      y: yFor(plottedValue),
      plottedValue,
      previousVisibleSnapshot: previousVisiblePoint?.snapshot || null,
      visibleTotalDelta: previousVisiblePoint
        ? plottedValue - previousPlottedValue
        : null
    };
  });
  const drawLine = (color, lineWidth) => {
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    linePoints.forEach((point, index) => {
      if (index) context.lineTo(point.x, point.y); else context.moveTo(point.x, point.y);
    });
    context.stroke();
  };
  drawLine('#312a18', 3.4);
  drawLine('#d9b84f', 1.45);

  poe1StashChartVisiblePoints = linePoints;
  linePoints.forEach(point => {
    context.fillStyle = '#171813';
    context.strokeStyle = '#d9b84f';
    context.lineWidth = 1.35;
    context.beginPath();
    context.arc(point.x, point.y, 2.35, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  });

  context.fillStyle = '#686a63';
  context.textBaseline = 'bottom';
  context.textAlign = 'left';
  context.fillText(new Date(firstTime).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }), padding.left, bounds.height - 2);
  context.textAlign = 'right';
  context.fillText(new Date(lastTime).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }), bounds.width - padding.right, bounds.height - 2);
}

function getPoe1StashMetricPair(history) {
  return history.length >= 2 ? history.slice(-2) : [];
}

async function renderPoe1StashHistory() {
  await ensurePoe1StashHistoryLoaded();
  const current = getCurrentPoe1StashHistoryContext();
  const allHistory = current.accountName && Array.isArray(poe1StashHistoryStore[current.key])
    ? poe1StashHistoryStore[current.key]
    : [];
  const session = poe1StashSessionStore[current.key] || null;
  const coreScope = POE2TQStashHistory.getSelectionKey(getPoe1CoreFarmingStashSelections());
  const history = POE2TQStashHistory.filterSnapshotsByValueChange(
    allHistory.filter(snapshot => String(snapshot?.scopeKey || '') === coreScope
      && Number(snapshot?.schemaVersion) === POE2TQStashHistory.SNAPSHOT_SCHEMA_VERSION),
    POE1_STASH_GRAPH_RECORD_THRESHOLD
  );
  const latest = history[history.length - 1];
  const sessionComparable = !session?.active
    || !latest
    || String(session?.baseline?.scopeKey || '') === String(latest.scopeKey || '');
  const comparableSession = sessionComparable ? session : null;
  const chaosRate = Number(latest?.chaosRate) || 1;
  const toggle = document.getElementById('stash-session-toggle');
  const status = document.getElementById('stash-session-status');
  if (toggle) {
    toggle.disabled = !latest || poe1StashSessionBusy;
    toggle.classList.toggle('active', Boolean(session?.active));
    toggle.textContent = poe1StashSessionBusy ? '재산 확인 중...' : (session?.active ? '세션 종료' : '파밍 시작');
  }
  if (status) {
    status.classList.toggle('active', Boolean(session?.active));
    if (poe1StashSessionBusy) {
      status.textContent = '파밍 세션 기준 재산과 현재 시세를 확인하고 있습니다.';
    } else if (session?.active) {
      status.textContent = sessionComparable
        ? `파밍 기록 중 · ${new Date(session.baseline.timestamp).toLocaleString('ko-KR')} 시작 · 새로고침할 때 반영`
        : '선택한 창고 범위가 세션 시작과 다릅니다. 같은 항목을 선택해 다시 새로고침해 주세요.';
    } else if (session?.lastCompleted) {
      status.textContent = `최근 세션 · ${new Date(session.lastCompleted.baseline.timestamp).toLocaleString('ko-KR')} ~ ${new Date(session.lastCompleted.end.timestamp).toLocaleString('ko-KR')}`;
    } else if (latest) {
      status.textContent = `최근 기록 · ${new Date(latest.timestamp).toLocaleString('ko-KR')}`;
    } else {
      status.textContent = '첫 재산 계산 후 파밍 세션을 시작할 수 있습니다.';
    }
  }

  const sessionEndpoint = session?.active ? latest : session?.lastCompleted?.end;
  const sessionBaseline = session?.active ? session?.baseline : session?.lastCompleted?.baseline;
  const pair = poe1StashHistoryRange === 'session' && sessionBaseline && sessionEndpoint
    ? [sessionBaseline, sessionEndpoint]
    : getPoe1StashMetricPair(history);
  const delta = pair.length === 2 ? POE2TQStashHistory.calculateDelta(pair[0], pair[1]) : null;
  setStashMetricValue('stash-history-quantity', delta?.totalDelta, chaosRate);
  const currentValue = document.getElementById('stash-history-market');
  if (currentValue) {
    currentValue.textContent = latest ? formatStashWealthValue(latest.totalDivine, chaosRate) : '-';
    currentValue.classList.remove('positive', 'negative');
  }
  const elapsedHours = Number(delta?.elapsedMs) / 3600000;
  setStashMetricValue('stash-history-hourly', elapsedHours > 0.01 ? delta.totalDelta / elapsedHours : null, chaosRate);
  const count = document.getElementById('stash-history-count');
  if (count) count.textContent = `기록 ${history.length.toLocaleString('ko-KR')}개`;
  document.querySelectorAll('#stash-history-range button[data-range]').forEach(button => {
    button.classList.toggle('active', button.dataset.range === poe1StashHistoryRange);
  });
  drawPoe1StashHistoryChart(getPoe1StashHistorySeries(history, comparableSession));
}

async function recordPoe1StashSnapshot(options) {
  await ensurePoe1StashHistoryLoaded();
  const key = POE2TQStashHistory.getContextKey(options.accountName, options.league);
  const session = poe1StashSessionStore[key];
  const scopeKey = POE2TQStashHistory.getSelectionKey(options.selected);
  const previousRecorded = POE2TQStashHistory.findLatestSnapshotForScope(
    (poe1StashHistoryStore[key] || []).filter(
      item => Number(item?.schemaVersion) === POE2TQStashHistory.SNAPSHOT_SCHEMA_VERSION
    ),
    scopeKey
  );
  const previousRefresh = poe1StashRefreshComparison?.key === key
    && poe1StashRefreshComparison?.scopeKey === scopeKey
    && Number(poe1StashRefreshComparison?.current?.schemaVersion) === POE2TQStashHistory.SNAPSHOT_SCHEMA_VERSION
    ? poe1StashRefreshComparison.current
    : previousRecorded;
  const snapshot = POE2TQStashHistory.createSnapshot({
    ...options,
    fallbackItems: previousRefresh?.items || previousRecorded?.items || null
  });
  poe1StashRefreshComparison = {
    key,
    scopeKey: snapshot.scopeKey,
    previous: previousRefresh,
    current: snapshot
  };
  poe1StashLatestScanSnapshot = { key, snapshot };
  if (POE2TQStashHistory.shouldRecordValueSnapshot(
    previousRecorded,
    snapshot,
    POE1_STASH_GRAPH_RECORD_THRESHOLD
  )) {
    poe1StashHistoryStore[key] = POE2TQStashHistory.upsertSnapshot(
      poe1StashHistoryStore[key] || [],
      snapshot,
      Number(previousRecorded?.timestamp) || (session?.active ? session.baselineSourceTimestamp : 0)
    );
    await chrome.storage.local.set({ [POE1_STASH_HISTORY_KEY]: poe1StashHistoryStore });
  }
  await renderPoe1StashHistory();
  return snapshot;
}

async function togglePoe1StashSession() {
  await ensurePoe1StashHistoryLoaded();
  let current = getCurrentPoe1StashHistoryContext();
  let history = poe1StashHistoryStore[current.key] || [];
  let latest = history[history.length - 1];
  if (!latest) return;
  const existing = poe1StashSessionStore[current.key];
  if (existing?.active) {
    const baselineSelections = existing.baseline?.selected;
    if (Array.isArray(baselineSelections) && baselineSelections.length) {
      applyPoe1StashSelections(baselineSelections);
    } else {
      selectOnlyPoe1CoreFarmingStashSelections();
    }
    poe1StashSessionBusy = true;
    await renderPoe1StashHistory();
    const refreshed = await scanPoe1StashWealth({ forceRefresh: true });
    if (!refreshed) {
      poe1StashSessionBusy = false;
      await renderPoe1StashHistory();
      return;
    }
    current = getCurrentPoe1StashHistoryContext();
    history = poe1StashHistoryStore[current.key] || [];
    latest = poe1StashLatestScanSnapshot?.key === current.key
      ? poe1StashLatestScanSnapshot.snapshot
      : history[history.length - 1];
    if (String(existing.baseline?.scopeKey || '') !== String(latest.scopeKey || '')) {
      poe1StashSessionBusy = false;
      setPoe1StashWealthMessage('세션 시작 때와 같은 창고 항목을 선택해 재산을 새로고침한 뒤 종료해 주세요.', true);
      await renderPoe1StashHistory();
      return;
    }
    const end = Number(latest.timestamp) > Number(existing.baseline.timestamp)
      ? latest
      : { ...latest, id: `session-end-${Date.now()}`, timestamp: Date.now() };
    poe1StashSessionStore[current.key] = {
      active: false,
      lastCompleted: { baseline: existing.baseline, end }
    };
  } else {
    selectOnlyPoe1CoreFarmingStashSelections();
    poe1StashSessionBusy = true;
    await renderPoe1StashHistory();
    const refreshed = await scanPoe1StashWealth({ forceRefresh: true });
    if (!refreshed) {
      poe1StashSessionBusy = false;
      await renderPoe1StashHistory();
      return;
    }
    current = getCurrentPoe1StashHistoryContext();
    history = poe1StashHistoryStore[current.key] || [];
    latest = poe1StashLatestScanSnapshot?.key === current.key
      ? poe1StashLatestScanSnapshot.snapshot
      : history[history.length - 1];
    if (!latest) {
      poe1StashSessionBusy = false;
      await renderPoe1StashHistory();
      return;
    }
    poe1StashSessionStore[current.key] = {
      active: true,
      baselineSourceTimestamp: latest.timestamp,
      baseline: { ...latest, id: `session-${Date.now()}`, timestamp: Date.now() },
      lastCompleted: existing?.lastCompleted || null
    };
    poe1StashHistoryRange = 'session';
  }
  await chrome.storage.local.set({ [POE1_STASH_SESSION_KEY]: poe1StashSessionStore });
  poe1StashSessionBusy = false;
  await renderPoe1StashHistory();
  if (!poe1StashSessionStore[current.key]?.active) {
    const sort = document.getElementById('stash-result-sort');
    if (sort) sort.value = 'session';
    renderPoe1StashWealthRows();
  }
}

function renderPoe1StashWealthRows() {
  const list = document.getElementById('stash-wealth-list');
  if (!list) return;
  const query = String(document.getElementById('stash-result-search')?.value || '').trim().toLowerCase();
  const sort = document.getElementById('stash-result-sort')?.value || 'value';
  const current = getCurrentPoe1StashHistoryContext();
  const session = poe1StashSessionStore?.[current.key];
  const completed = !session?.active ? session?.lastCompleted : null;
  const useSessionComparison = sort === 'session' && completed?.baseline && completed?.end;
  const refreshComparison = poe1StashRefreshComparison?.key === current.key
    ? poe1StashRefreshComparison
    : null;
  const comparison = useSessionComparison ? completed : refreshComparison;
  const itemDeltas = POE2TQStashHistory.buildItemDeltas(
    comparison?.previous || comparison?.baseline,
    comparison?.current || comparison?.end
  );
  const currentKeys = new Set(poe1StashWealthView.rows.map(
    row => normalizeStashWealthName(row.inventoryKey || row.rawName || row.name)
  ));
  const removedRows = Object.values(itemDeltas)
    .filter(delta => delta.currentQuantity === 0 && !currentKeys.has(delta.key))
    .map(delta => ({
      rawName: delta.key,
      name: delta.name,
      category: delta.category,
      imagePath: '',
      unitValue: delta.unitValue,
      quantity: 0,
      value: 0,
      comparisonRemoved: true
    }));
  const rows = [...poe1StashWealthView.rows, ...removedRows]
    .map(row => ({
      ...row,
      comparisonDelta: itemDeltas[normalizeStashWealthName(row.inventoryKey || row.rawName || row.name)] || null
    }))
    .filter(row => !query || `${row.name} ${row.category}`.toLowerCase().includes(query))
    .slice()
    .sort((a, b) => {
      if (sort === 'refresh' || sort === 'session') {
        return Math.abs(Number(b.comparisonDelta?.valueDelta) || 0) - Math.abs(Number(a.comparisonDelta?.valueDelta) || 0)
          || Math.abs(Number(b.comparisonDelta?.quantityDelta) || 0) - Math.abs(Number(a.comparisonDelta?.quantityDelta) || 0)
          || b.value - a.value;
      }
      if (sort === 'unit') return b.unitValue - a.unitValue || b.value - a.value;
      if (sort === 'quantity') return b.quantity - a.quantity || b.value - a.value;
      if (sort === 'name') return a.name.localeCompare(b.name, 'ko');
      return b.value - a.value;
    });
  list.innerHTML = rows.length
    ? rows.slice(0, 100).map(row => `
        <div class="stash-wealth-row${row.comparisonRemoved ? ' session-removed' : ''}">
          <span class="stash-wealth-row-item">
            ${row.imagePath ? `<img class="stash-wealth-row-icon" src="${esc(resolveNinjaImageUrl(row.imagePath))}" alt="">` : ''}
            <span class="stash-wealth-row-copy">
              <span class="stash-wealth-row-name">${esc(row.name)}</span>
              <span class="stash-wealth-row-meta">${esc(row.category || '기타')} · 개당 ${esc(formatStashWealthValue(row.unitValue, poe1StashWealthView.chaosRate))}</span>
            </span>
          </span>
          <span class="stash-wealth-row-numbers">
            <span class="stash-wealth-row-value">${formatStashWealthValue(row.value, poe1StashWealthView.chaosRate)}</span>
            <span class="stash-wealth-row-count">${row.quantity.toLocaleString('ko-KR')}개</span>
            ${row.comparisonDelta ? `<span class="stash-wealth-row-change ${row.comparisonDelta.quantityDelta > 0 ? 'positive' : 'negative'}"><span>${row.comparisonDelta.quantityDelta > 0 ? '+' : ''}${row.comparisonDelta.quantityDelta.toLocaleString('ko-KR')}개</span><span>${esc(formatSignedStashWealthValue(row.comparisonDelta.valueDelta, poe1StashWealthView.chaosRate))}</span></span>` : ''}
          </span>
        </div>
      `).join('')
    : '<div class="stash-wealth-message">표시할 아이템이 없습니다.</div>';
  list.querySelectorAll('.stash-wealth-row-icon').forEach(image => {
    image.addEventListener('error', () => { image.style.display = 'none'; }, { once: true });
  });
}

function renderPoe1StashWealth(items, priceMap, tabCount, failedTabCount = 0) {
  const aggregate = new Map();
  const snapshotAggregate = new Map();
  let unpricedQuantity = 0;
  const unmatchedGems = [];
  items.forEach(item => {
    const itemName = getPoe1StashItemName(item);
    const quantity = getPoe1StashItemQuantity(item);
    const inventoryKey = getPoe1StashInventoryKey(item);
    const gemPrice = resolvePoe1StashGemPrice(item, priceMap);
    const price = gemPrice
      || priceMap.get(normalizeStashWealthName(itemName));
    const snapshotRow = snapshotAggregate.get(inventoryKey) || {
      inventoryKey,
      rawName: itemName,
      name: price?.koreanName || itemName,
      category: price?.category || '',
      unitValue: Number(price?.value) || 0,
      quantity: 0
    };
    snapshotRow.quantity += quantity;
    if (!(snapshotRow.unitValue > 0) && Number(price?.value) > 0) snapshotRow.unitValue = Number(price.value);
    if (!snapshotRow.category && price?.category) snapshotRow.category = price.category;
    snapshotAggregate.set(inventoryKey, snapshotRow);
    if (!price) {
      unpricedQuantity += quantity;
      if (isPoe1StashGemItem(item) && unmatchedGems.length < 10) {
        const level = getPoe1ItemPropertyNumber(item, /(?:^|\s)(?:level|레벨)(?:\s*:|$)/i) ?? item?.gemLevel;
        const quality = getPoe1ItemPropertyNumber(item, /(?:quality|퀄리티)/i) ?? item?.gemQuality ?? 0;
        unmatchedGems.push({
          name: itemName,
          level: level ?? '?',
          quality,
          corrupted: Boolean(item?.corrupted),
          icon: POE2TQTradeCompat.getItemIconIdentity(item?.icon)
        });
      }
      return;
    }
    const key = inventoryKey;
    const current = aggregate.get(key) || {
      inventoryKey,
      rawName: price.rawName || itemName,
      name: price.stashNameSuffix ? `${itemName}${price.stashNameSuffix}` : (price.koreanName || itemName),
      imagePath: price.imagePath || item?.icon || '',
      category: price.category || '',
      unitValue: price.value,
      quantity: 0,
      value: 0
    };
    current.quantity += quantity;
    current.value += price.value * quantity;
    aggregate.set(key, current);
  });

  const rows = [...aggregate.values()].sort((a, b) => b.value - a.value);
  const totalDivine = rows.reduce((sum, row) => sum + row.value, 0);
  const chaosRate = Number(currentTradeRates.chaos) > 0 ? Number(currentTradeRates.chaos) : 1;
  const summary = document.getElementById('stash-wealth-summary');
  const list = document.getElementById('stash-wealth-list');
  if (summary) {
    summary.hidden = false;
    summary.innerHTML = `
      <div><strong>${formatStashWealthValue(totalDivine, chaosRate)}</strong><span>추정 총액</span></div>
      <div><strong>${tabCount.toLocaleString('ko-KR')}</strong><span>확인한 탭</span></div>
      <div><strong>${rows.length.toLocaleString('ko-KR')}</strong><span>가격 매칭</span></div>
    `;
  }
  poe1StashWealthView = { rows, chaosRate };
  const scanButton = document.getElementById('stash-wealth-scan');
  if (scanButton) scanButton.textContent = '재산 새로고침';
  const tools = document.getElementById('stash-result-tools');
  if (tools) tools.hidden = false;
  renderPoe1StashWealthRows();
  setPoe1StashWealthMessage(
    `창고 아이템 ${items.length.toLocaleString('ko-KR')}개를 확인했습니다.${failedTabCount ? ` 실패한 탭 ${failedTabCount.toLocaleString('ko-KR')}개는 건너뛰었습니다.` : ''}${unpricedQuantity ? ` 시세 미매칭 수량 ${unpricedQuantity.toLocaleString('ko-KR')}개는 합계에서 제외했습니다.` : ''}${unmatchedGems.length ? ` 미매칭 젬: ${unmatchedGems.slice(0, 3).map(gem => `${gem.name}(Lv.${gem.level}/Q${gem.quality}${gem.corrupted ? '/타락' : ''})`).join(', ')}` : ''}`,
    failedTabCount > 0
  );
  if (unmatchedGems.length) {
    appendSidepanelDebugLog({ kind: 'stash-wealth-unmatched-gems', league: settings.league, gems: unmatchedGems });
  }
  return { rows, snapshotRows: [...snapshotAggregate.values()], chaosRate, totalDivine };
}

async function performPoe1StashWealthScan(options = {}) {
  const accountInput = document.getElementById('stash-account-name');
  const scanButton = document.getElementById('stash-wealth-scan');
  const accountName = String(accountInput?.value || '').trim();
  if (!accountName) {
    setPoe1StashWealthMessage('계정명을 입력해 주세요.', true);
    accountInput?.focus();
    return false;
  }
  if (normalizeTradeRealm(settings.tradeRealm) !== TRADE_REALM_POE1) return false;

  const league = settings.league || 'Standard';
  if (!poe1LoadedStashContext
    || poe1LoadedStashContext.accountName !== accountName
    || poe1LoadedStashContext.league !== league) {
    setPoe1StashWealthMessage('계정명 또는 리그가 변경되었습니다. 탭 목록을 다시 불러와 주세요.', true);
    return false;
  }
  const selections = getSelectedPoe1StashSelections();
  const selectedIndexes = [...new Set(selections.map(selection => selection.index))];
  const selectionScope = POE2TQStashHistory.getSelectionKey(selections);
  const forceRefresh = Boolean(options.forceRefresh);
  if (!selections.length) {
    setPoe1StashWealthMessage('계산할 창고 탭을 하나 이상 선택해 주세요.', true);
    return false;
  }
  if (scanButton) scanButton.disabled = true;
  document.getElementById('stash-wealth-summary')?.setAttribute('hidden', '');
  document.getElementById('stash-result-tools')?.setAttribute('hidden', '');
  poe1StashWealthView = { rows: [], chaosRate: 1 };
  const list = document.getElementById('stash-wealth-list');
  if (list) list.innerHTML = '';
  setPoe1StashWealthMessage(`선택한 항목 ${selections.length}개를 읽는 중...`);

  try {
    const itemsByTab = poe1LoadedStashContext.itemsByTab instanceof Map
      ? poe1LoadedStashContext.itemsByTab
      : new Map([[0, poe1LoadedStashContext.firstItems || []]]);
    poe1LoadedStashContext.itemsByTab = itemsByTab;
    const fetchIndexes = POE2TQStashHistory.getStashTabFetchPlan(
      selectedIndexes,
      [...itemsByTab.keys()],
      forceRefresh
    );
    const filtersByTab = new Map();
    selections.forEach(selection => {
      const filters = filtersByTab.get(selection.index) || new Set();
      filters.add(selection.filter);
      filtersByTab.set(selection.index, filters);
    });
    const failedTabIndexes = new Set();
    let fetchedTabs = 0;
    const priceMapPromise = buildPoe1StashWealthPriceMap(league);
    if (!fetchIndexes.length) setPoe1StashWealthMessage('체크 변경을 기존 창고 데이터에 반영하는 중...');
    let nextFetchPosition = 0;
    async function fetchNextStashTab() {
      while (nextFetchPosition < fetchIndexes.length) {
        const tabIndex = fetchIndexes[nextFetchPosition++];
        try {
          const payload = await fetchPoe1StashTab(accountName, league, tabIndex, false);
          itemsByTab.set(tabIndex, Array.isArray(payload.items) ? payload.items : []);
        } catch (_) {
          failedTabIndexes.add(tabIndex);
        } finally {
          fetchedTabs++;
          setPoe1StashWealthMessage(`새로 필요한 창고 읽는 중... ${fetchedTabs}/${fetchIndexes.length}`);
        }
      }
    }
    await Promise.all(Array.from(
      { length: Math.min(4, fetchIndexes.length) },
      () => fetchNextStashTab()
    ));
    let retryPosition = 0;
    const retryTotal = failedTabIndexes.size;
    for (const tabIndex of [...failedTabIndexes]) {
      retryPosition++;
      setPoe1StashWealthMessage(`응답하지 않은 창고 순차 재시도 중... ${retryPosition}/${retryTotal}`);
      try {
        const payload = await fetchPoe1StashTabWithRetry(accountName, league, tabIndex, false);
        itemsByTab.set(tabIndex, Array.isArray(payload.items) ? payload.items : []);
        failedTabIndexes.delete(tabIndex);
      } catch (_) {
        itemsByTab.delete(tabIndex);
      }
    }
    const failedTabs = failedTabIndexes.size;
    const priceMap = await priceMapPromise;
    if (POE2TQStashHistory.getSelectionKey(getSelectedPoe1StashSelections()) !== selectionScope) return false;
    setPoe1StashWealthMessage('현재 Economy 시세와 매칭하는 중...');
    const items = [];
    selectedIndexes.forEach(tabIndex => {
      const tabItems = itemsByTab.get(tabIndex);
      if (!Array.isArray(tabItems)) return;
      items.push(...filterPoe1FragmentStashItems(tabItems, filtersByTab.get(tabIndex), priceMap));
    });
    const confirmedSelectionCount = selections.filter(selection => !failedTabIndexes.has(selection.index)).length;
    const result = renderPoe1StashWealth(items, priceMap, confirmedSelectionCount, failedTabs);
    if (failedTabs > 0) {
      setPoe1StashWealthMessage(`일부 창고 조회에 실패해 재산 변동 기록은 저장하지 않았습니다. 실패한 탭 ${failedTabs.toLocaleString('ko-KR')}개를 다시 시도해 주세요.`, true);
      return false;
    }
    await recordPoe1StashSnapshot({
      accountName,
      league,
      rows: result.snapshotRows,
      chaosRate: result.chaosRate,
      selected: selections,
      failedTabs
    });
    renderPoe1StashWealthRows();
    return true;
  } catch (error) {
    setPoe1StashWealthMessage(error?.message || '창고를 불러오지 못했습니다.', true);
    return false;
  } finally {
    if (scanButton) scanButton.disabled = false;
  }
}

async function scanPoe1StashWealth(options = {}) {
  const forceRefresh = Boolean(options.forceRefresh);
  if (forceRefresh && poe1StashAutoScanTimer) {
    clearTimeout(poe1StashAutoScanTimer);
    poe1StashAutoScanTimer = null;
  }
  if (poe1StashScanPromise) {
    poe1StashScanQueued = true;
    const result = await poe1StashScanPromise;
    return forceRefresh ? scanPoe1StashWealth({ forceRefresh: true }) : result;
  }
  const task = performPoe1StashWealthScan({ forceRefresh });
  poe1StashScanPromise = task;
  try {
    return await task;
  } finally {
    if (poe1StashScanPromise === task) poe1StashScanPromise = null;
    if (poe1StashScanQueued) {
      poe1StashScanQueued = false;
      schedulePoe1StashAutoScan(0);
    }
  }
}

function hidePoe1StashChartHover() {
  const tooltip = document.getElementById('stash-history-tooltip');
  if (tooltip) tooltip.hidden = true;
}

function bindPoe1ManualAccountControls() {
  document.querySelectorAll('[data-manual-account-enable]').forEach(button => {
    if (button.dataset.bound) return;
    button.dataset.bound = '1';
    button.addEventListener('click', () => {
      poe1ManualAccountOverride = true;
      const target = document.getElementById(button.dataset.accountTarget || '');
      for (const input of [
        document.getElementById('stash-account-name'),
        document.getElementById('character-account-name')
      ]) {
        if (!input) continue;
        input.readOnly = false;
        input.title = '';
      }
      setPoe1AccountSessionState('수동 계정');
      target?.focus();
      target?.select();
    });
  });
}

function handlePoe1StashChartPointer(event) {
  const canvas = document.getElementById('stash-history-canvas');
  const tooltip = document.getElementById('stash-history-tooltip');
  const chart = document.getElementById('stash-history-chart');
  if (!canvas || !tooltip || !chart || !poe1StashChartVisiblePoints.length) return;
  const canvasBounds = canvas.getBoundingClientRect();
  const chartBounds = chart.getBoundingClientRect();
  const x = event.clientX - canvasBounds.left;
  const y = event.clientY - canvasBounds.top;
  let nearest = null;
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;
  for (const point of poe1StashChartVisiblePoints) {
    const distanceSquared = (point.x - x) ** 2 + (point.y - y) ** 2;
    if (distanceSquared < nearestDistanceSquared) {
      nearest = point;
      nearestDistanceSquared = distanceSquared;
    }
  }
  if (!nearest || nearestDistanceSquared > 81) {
    hidePoe1StashChartHover();
    return;
  }
  const previousSnapshot = nearest.previousVisibleSnapshot;
  const chaosRate = Number(nearest.snapshot.chaosRate) || 1;
  const totalDelta = nearest.visibleTotalDelta;
  const deltaClass = totalDelta > 0 ? 'positive' : (totalDelta < 0 ? 'negative' : 'neutral');
  const formatPointTime = snapshot => new Date(snapshot.timestamp).toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const periodText = previousSnapshot
    ? `${formatPointTime(previousSnapshot)} → ${formatPointTime(nearest.snapshot)}`
    : `첫 점 · ${formatPointTime(nearest.snapshot)}`;
  const deltaText = previousSnapshot
    ? `직전 점 대비 <b class="${deltaClass}">${esc(formatCompactSignedStashWealthValue(totalDelta, chaosRate))}</b>`
    : '<b class="neutral">비교할 이전 점 없음</b>';
  tooltip.innerHTML = `
    <strong>${esc(formatStashWealthValue(nearest.plottedValue, chaosRate))}</strong>
    <span class="stash-history-tooltip-period">${esc(periodText)}</span>
    <span>${deltaText}</span>
  `;
  tooltip.hidden = false;
  const chartX = nearest.x + canvasBounds.left - chartBounds.left;
  const chartY = nearest.y + canvasBounds.top - chartBounds.top;
  const preferredLeft = chartX + 9;
  const preferredTop = chartY - 12;
  const maxLeft = Math.max(4, chart.clientWidth - tooltip.offsetWidth - 4);
  const maxTop = Math.max(4, chart.clientHeight - tooltip.offsetHeight - 4);
  tooltip.style.left = `${Math.max(4, Math.min(preferredLeft, maxLeft))}px`;
  tooltip.style.top = `${Math.max(4, Math.min(preferredTop, maxTop))}px`;
}

function bindPoe1StashWealth() {
  const input = document.getElementById('stash-account-name');
  const button = document.getElementById('stash-wealth-scan');
  const loadButton = document.getElementById('stash-load-tabs');
  if (!input || !button || !loadButton || button.dataset.bound) return;
  button.dataset.bound = '1';
  bindPoe1ManualAccountControls();
  loadButton.addEventListener('click', loadPoe1StashTabs);
  button.addEventListener('click', () => scanPoe1StashWealth({ forceRefresh: true }));
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') loadPoe1StashTabs();
  });
  document.getElementById('stash-tabs-recommended')?.addEventListener('click', () => setPoe1StashTabSelection('recommended'));
  document.getElementById('stash-tabs-all')?.addEventListener('click', () => setPoe1StashTabSelection('all'));
  document.getElementById('stash-tabs-none')?.addEventListener('click', () => setPoe1StashTabSelection('none'));
  document.getElementById('stash-result-search')?.addEventListener('input', renderPoe1StashWealthRows);
  document.getElementById('stash-result-sort')?.addEventListener('change', renderPoe1StashWealthRows);
  document.getElementById('stash-session-toggle')?.addEventListener('click', () => {
    togglePoe1StashSession().catch(async error => {
      poe1StashSessionBusy = false;
      await renderPoe1StashHistory().catch(() => {});
      setPoe1StashWealthMessage(error?.message || '파밍 세션을 저장하지 못했습니다.', true);
    });
  });
  document.querySelectorAll('#stash-history-range button[data-range]').forEach(rangeButton => {
    rangeButton.addEventListener('click', () => {
      poe1StashHistoryRange = rangeButton.dataset.range || '24h';
      renderPoe1StashHistory().catch(() => {});
    });
  });
  const historyCanvas = document.getElementById('stash-history-canvas');
  historyCanvas?.addEventListener('mousemove', handlePoe1StashChartPointer);
  historyCanvas?.addEventListener('mouseleave', hidePoe1StashChartHover);
  if (historyCanvas && typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(() => renderPoe1StashHistory().catch(() => {}));
    observer.observe(historyCanvas);
  }
  input.addEventListener('change', () => renderPoe1StashHistory().catch(() => {}));
  chrome.storage.local.get(POE1_STASH_ACCOUNT_KEY).then(result => {
    if (result?.[POE1_STASH_ACCOUNT_KEY]) input.value = result[POE1_STASH_ACCOUNT_KEY];
    return resolvePoe1AccountName(input);
  }).then(() => {
    return renderPoe1StashHistory();
  }).catch(() => {});
}

function setPoe1CharacterEquipmentMessage(message, isError = false) {
  const element = document.getElementById('character-equipment-message');
  if (!element) return;
  element.textContent = message;
  element.style.color = isError ? '#d47468' : '#908a7b';
}

function buildPoe1CharacterUrl(path, params) {
  return `https://poe.kakaogames.com/character-window/${path}?${new URLSearchParams(params)}`;
}

function getPoe1CharacterAccountKey(accountName, league = settings.league) {
  const normalizedAccount = String(accountName || '').trim().toLowerCase();
  const normalizedLeague = String(league || '').trim().toLowerCase();
  return normalizedAccount && normalizedLeague ? `${normalizedAccount}::${normalizedLeague}` : '';
}

async function savePoe1CharacterEquipmentView(accountName, character, items) {
  const key = getPoe1CharacterAccountKey(accountName, character?.league);
  if (!key || !character) return;
  poe1CharacterViewStore[key] = {
    character,
    items: Array.isArray(items) ? items : [],
    fetchedAt: Date.now()
  };
  await chrome.storage.local.set({ [POE1_CHARACTER_VIEW_KEY]: poe1CharacterViewStore });
}

function restorePoe1CharacterEquipmentView(accountName) {
  const cached = poe1CharacterViewStore[getPoe1CharacterAccountKey(accountName)];
  if (!cached?.character || !Array.isArray(cached.items)) return false;
  const character = cached.character;
  if (String(character.league || '') !== String(settings.league || 'Standard')) return false;
  if (!poe1Characters.some(entry => entry.name === character.name)) poe1Characters = [character];
  const select = document.getElementById('character-select');
  if (select) {
    select.innerHTML = `<option value="${esc(character.name)}">${esc(character.name)} · Lv.${Number(character.level) || 0} ${esc(character.class || '')} · ${esc(character.league || '')}</option>`;
    select.value = character.name;
    select.disabled = false;
    syncCustomSelectControl(select);
  }
  renderPoe1CharacterEquipment(cached.items, character);
  const fetchedAt = Number(cached.fetchedAt);
  setPoe1CharacterEquipmentMessage(Number.isFinite(fetchedAt)
    ? `마지막 장비 조회 · ${new Date(fetchedAt).toLocaleString('ko-KR')}`
    : '마지막으로 조회한 장비를 복원했습니다.');
  return true;
}

function syncPoe1CharacterEquipmentLeagueContext() {
  if (poe1CharacterSource === 'pob') {
    if (!poe1PobCharacterView?.character) return;
    const character = {
      ...poe1PobCharacterView.character,
      league: settings.league || 'Standard'
    };
    poe1PobCharacterView = { ...poe1PobCharacterView, character };
    poe1Characters = [character];
    renderPoe1CharacterEquipment(poe1PobCharacterView.items, character, poe1PobCharacterView.stats);
    chrome.storage.local.set({ [POE1_POB_CHARACTER_VIEW_KEY]: poe1PobCharacterView }).catch(() => {});
    return;
  }
  const select = document.getElementById('character-select');
  const accountName = document.getElementById('character-account-name')?.value || '';
  poe1Characters = [];
  if (restorePoe1CharacterEquipmentView(accountName)) return;
  clearPoe1CharacterEquipmentBoard();
  if (select) {
    select.innerHTML = `<option value="">${esc(settings.league || 'Standard')} 리그 캐릭터를 조회해 주세요</option>`;
    select.disabled = true;
    syncCustomSelectControl(select);
  }
  setPoe1CharacterEquipmentMessage(`${settings.league || 'Standard'} 리그의 캐릭터만 조회합니다.`);
}

function parsePoe1PobXml(xmlText, fileName = 'PoB') {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(String(xmlText || ''), 'application/xml');
  if (documentNode.querySelector('parsererror')) throw new Error('PoB XML 형식이 올바르지 않습니다.');
  const root = documentNode.documentElement;
  if (!/^PathOfBuilding(?:2)?$/i.test(String(root?.localName || root?.tagName || ''))) {
    throw new Error('Path of Building XML 파일이 아닙니다.');
  }

  const build = root.querySelector('Build');
  const itemsRoot = root.querySelector('Items');
  if (!itemsRoot) throw new Error('PoB XML에서 장비 데이터를 찾지 못했습니다.');
  const itemDefinitions = new Map();
  Array.from(itemsRoot.querySelectorAll('Item')).forEach(element => {
    const id = String(element.getAttribute('id') || '').trim();
    if (id) itemDefinitions.set(id, element.textContent || '');
  });

  const itemSets = Array.from(itemsRoot.querySelectorAll('ItemSet'));
  const activeItemSetId = String(itemsRoot.getAttribute('activeItemSet') || itemsRoot.getAttribute('activeItemSetId') || '').trim();
  const activeItemSet = itemSets.find(set => String(set.getAttribute('id') || '') === activeItemSetId) || itemSets[0] || null;
  const slotRoot = activeItemSet || itemsRoot;
  const slots = Array.from(slotRoot.querySelectorAll('Slot'));
  const equipment = [];
  slots.forEach(slotElement => {
    const slotName = slotElement.getAttribute('name') || slotElement.getAttribute('slot') || '';
    if (!window.POE2TQPobCharacter?.mapSlotName(slotName)) return;
    const itemId = String(slotElement.getAttribute('itemId') || slotElement.getAttribute('itemID') || '').trim();
    const rawItem = itemDefinitions.get(itemId);
    if (!rawItem) return;
    const item = window.POE2TQPobCharacter.parseItemText(rawItem, slotName);
    if (item) equipment.push(item);
  });

  if (!equipment.length) throw new Error('PoB의 활성 장비 세트에서 착용 아이템을 찾지 못했습니다.');
  const stats = {};
  Array.from(build?.querySelectorAll('PlayerStat') || []).forEach(element => {
    const key = String(element.getAttribute('stat') || '').trim();
    const value = element.getAttribute('value');
    if (key && value != null && value !== '') stats[key] = value;
  });
  const baseName = String(fileName || 'PoB').replace(/\.xml$/i, '').trim() || 'PoB';
  const className = build?.getAttribute('ascendClassName') || build?.getAttribute('className') || 'PoB 캐릭터';
  const character = {
    name: build?.getAttribute('characterName') || baseName,
    class: className,
    league: settings.league || 'Standard',
    level: Number(build?.getAttribute('level')) || 0,
    source: 'pob',
    itemSetTitle: activeItemSet?.getAttribute('title') || activeItemSet?.getAttribute('name') || ''
  };
  return { character, items: equipment, stats };
}

async function enrichPoe1PobItemIcons(items) {
  if (!Array.isArray(items) || !items.length) return items;
  const unresolved = items.filter(item => !item.icon);
  if (!unresolved.length) return items;
  const ninjaIconResponse = await new Promise(resolve => {
    chrome.runtime.sendMessage({
      type: 'FETCH_POE1_ITEM_ICONS',
      league: settings.league || 'Standard',
      items: unresolved.map(item => ({
        name: item.name || '',
        baseType: item.baseType || item.typeLine || '',
        frameType: Number(item.frameType) || 0
      }))
    }, response => {
      if (chrome.runtime.lastError) resolve(null);
      else resolve(response || null);
    });
  }).catch(() => null);
  if (ninjaIconResponse?.ok && Array.isArray(ninjaIconResponse.icons)) {
    unresolved.forEach((item, index) => {
      const icon = resolveNinjaImageUrl(ninjaIconResponse.icons[index] || '');
      if (icon) item.icon = icon;
    });
  }

  const stillUnresolved = items.filter(item => !item.icon);
  if (!stillUnresolved.length) return items;
  if (!poe1TradeItemIconMapPromise) {
    poe1TradeItemIconMapPromise = (async () => {
      const map = new Map();
      const endpoint = getTradeEndpoint(TRADE_REALM_POE1);
      const result = await fetchTradeJson(TRADE_REALM_POE1, `${endpoint.apiBase}/data/items`, { credentials: 'include' });
      if (!result.ok) return map;
      (result.payload?.result || []).forEach(group => {
        (group?.entries || []).forEach(entry => {
          const icon = resolveNinjaImageUrl(entry?.image || entry?.icon || '');
          if (!icon) return;
          [entry?.name, entry?.type].forEach(value => {
            const key = normalizeTradeItemTypeKey(tradeValueToText(value));
            if (key && !map.has(key)) map.set(key, icon);
          });
        });
      });
      return map;
    })().catch(() => new Map());
  }
  const iconMap = await poe1TradeItemIconMapPromise;
  stillUnresolved.forEach(item => {
    const nameKey = normalizeTradeItemTypeKey(item.name);
    const baseKey = normalizeTradeItemTypeKey(item.baseType || item.typeLine);
    item.icon = iconMap.get(nameKey) || iconMap.get(baseKey) || '';
  });
  return items;
}

function renderPoe1CharacterStats(stats) {
  const grid = document.getElementById('character-stat-grid');
  if (!grid) return;
  const rows = window.POE2TQPobCharacter?.buildStatRows(stats) || [];
  grid.hidden = !rows.length;
  grid.innerHTML = rows.map(row => `<div class="character-stat-row" data-stat="${esc(row.key)}"><span class="character-stat-label">${esc(row.label)}</span><strong class="character-stat-value">${esc(row.value)}</strong></div>`).join('');
}

async function loadPoe1PobCharacter() {
  const fileInput = document.getElementById('character-pob-file');
  const loadButton = document.getElementById('character-pob-load');
  const file = poe1PobSelectedFile || fileInput?.files?.[0];
  if (!file) {
    setPoe1CharacterEquipmentMessage('PoB XML 파일을 선택해 주세요.', true);
    return;
  }
  if (loadButton) loadButton.disabled = true;
  setPoe1CharacterEquipmentMessage(`${file.name} 파일을 읽는 중...`);
  try {
    const parsed = parsePoe1PobXml(await file.text(), file.name);
    await enrichPoe1PobItemIcons(parsed.items);
    poe1PobCharacterView = {
      ...parsed,
      fileName: file.name,
      savedAt: Date.now(),
      parserVersion: POE1_POB_PARSER_VERSION
    };
    poe1Characters = [parsed.character];
    poe1CurrentEquipmentCharacter = parsed.character;
    const select = document.getElementById('character-select');
    if (select) {
      select.innerHTML = `<option value="${esc(parsed.character.name)}">${esc(parsed.character.name)}</option>`;
      select.value = parsed.character.name;
      select.disabled = false;
      syncCustomSelectControl(select);
    }
    renderPoe1CharacterEquipment(parsed.items, parsed.character, parsed.stats);
    await chrome.storage.local.set({
      [POE1_POB_CHARACTER_VIEW_KEY]: poe1PobCharacterView,
      [POE1_CHARACTER_SOURCE_KEY]: 'pob'
    }).catch(() => {});
    const statCount = window.POE2TQPobCharacter?.buildStatRows(parsed.stats).length || 0;
    setPoe1CharacterEquipmentMessage(`PoB 장비 ${parsed.items.length.toLocaleString('ko-KR')}개와 캐릭터 속성 ${statCount.toLocaleString('ko-KR')}개를 불러왔습니다.`);
  } catch (error) {
    poe1PobCharacterView = null;
    clearPoe1CharacterEquipmentBoard();
    setPoe1CharacterEquipmentMessage(error?.message || 'PoB XML을 불러오지 못했습니다.', true);
  } finally {
    if (loadButton) loadButton.disabled = !poe1PobSelectedFile && !fileInput?.files?.length;
  }
}

function selectPoe1PobFile(file) {
  const loadButton = document.getElementById('character-pob-load');
  const fileName = document.getElementById('character-pob-file-name');
  const isXml = file && /\.xml$/i.test(String(file.name || ''));
  poe1PobSelectedFile = isXml ? file : null;
  if (fileName) fileName.textContent = isXml ? file.name : '클릭하거나 PoB XML 드래그';
  if (loadButton) loadButton.disabled = !isXml;
  if (!file) {
    setPoe1CharacterEquipmentMessage('PoB XML 파일을 선택해 주세요.');
  } else if (!isXml) {
    setPoe1CharacterEquipmentMessage('XML 파일만 불러올 수 있습니다.', true);
  } else {
    setPoe1CharacterEquipmentMessage(`${file.name} 파일을 선택했습니다.`);
  }
}

function switchPoe1CharacterSource(source) {
  poe1CharacterSource = source === 'pob' ? 'pob' : 'account';
  chrome.storage.local.set({ [POE1_CHARACTER_SOURCE_KEY]: poe1CharacterSource }).catch(() => {});
  document.querySelectorAll('[data-character-source]').forEach(button => {
    const active = button.dataset.characterSource === poe1CharacterSource;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  const accountPanel = document.getElementById('character-source-account');
  const pobPanel = document.getElementById('character-source-pob');
  if (accountPanel) accountPanel.hidden = poe1CharacterSource !== 'account';
  if (pobPanel) pobPanel.hidden = poe1CharacterSource !== 'pob';
  const badge = document.getElementById('character-source-badge');
  if (badge) badge.textContent = poe1CharacterSource === 'pob' ? 'PoB XML' : '카카오 API';
  const foot = document.getElementById('character-equipment-foot');
  if (foot) foot.textContent = poe1CharacterSource === 'pob'
    ? 'PoB에 저장된 활성 장비 세트와 계산 속성을 표시합니다. 아이템에 마우스를 올리면 상세 옵션을 확인할 수 있습니다.'
    : '장비 정보는 캐릭터 API 응답 기준이며, 아이템에 마우스를 올리면 상세 옵션을 확인할 수 있습니다.';
  if (poe1CharacterSource === 'pob') {
    if (poe1PobCharacterView) {
      renderPoe1CharacterEquipment(poe1PobCharacterView.items, poe1PobCharacterView.character, poe1PobCharacterView.stats);
      const fileName = document.getElementById('character-pob-file-name');
      if (fileName && poe1PobCharacterView.fileName) fileName.textContent = `${poe1PobCharacterView.fileName} · 복원됨`;
      setPoe1CharacterEquipmentMessage(`저장된 PoB 장비 ${poe1PobCharacterView.items.length.toLocaleString('ko-KR')}개를 복원했습니다.`);
    }
    else {
      clearPoe1CharacterEquipmentBoard();
      setPoe1CharacterEquipmentMessage('PoB에서 내보낸 XML 파일을 선택해 주세요.');
    }
    return;
  }
  const accountName = document.getElementById('character-account-name')?.value || '';
  if (!restorePoe1CharacterEquipmentView(accountName)) {
    clearPoe1CharacterEquipmentBoard();
    setPoe1CharacterEquipmentMessage('계정의 PoE1 캐릭터와 착용 장비를 불러옵니다.');
  }
}

async function fetchPoe1CharacterJson(path, params) {
  const result = await fetchTradeJson(
    TRADE_REALM_POE1,
    buildPoe1CharacterUrl(path, params),
    { credentials: 'include' }
  );
  if (!result.ok) {
    const error = new Error(result.status === 403
      ? '캐릭터 접근이 거부되었습니다. 카카오 PoE 거래소에 로그인한 탭에서 다시 시도해 주세요.'
      : `캐릭터 API 요청 실패 (HTTP ${result.status || 0})`);
    error.status = result.status;
    throw error;
  }
  if (result.payload?.error) {
    const message = result.payload.error.message || result.payload.error;
    throw new Error(`캐릭터 API 오류: ${message}`);
  }
  return result.payload;
}

function getPoe1CharacterItemName(item) {
  const source = stripTradeTags(item?.name || item?.typeLine || item?.baseType || '알 수 없는 아이템');
  return poe1ItemNamesKo?.[source] || source;
}

function getPoe1CharacterItemBase(item) {
  const base = stripTradeTags(item?.typeLine || item?.baseType || '');
  const name = stripTradeTags(item?.name || '');
  return base && base !== name ? (poe1ItemNamesKo?.[base] || base) : '';
}

const POE1_CHARACTER_PROPERTY_LABELS_KO = {
  Quality: '퀄리티', Armour: '방어도', Evasion: '회피', 'Evasion Rating': '회피',
  'Energy Shield': '에너지 보호막', Ward: '수호', Block: '막기 확률',
  'Chance to Block': '막기 확률', 'Physical Damage': '물리 피해',
  'Elemental Damage': '원소 피해', 'Chaos Damage': '카오스 피해',
  'Critical Strike Chance': '치명타 확률', 'Attacks per Second': '초당 공격 횟수',
  Level: '레벨', Str: '힘', Strength: '힘', Dex: '민첩', Dexterity: '민첩',
  Int: '지능', Intelligence: '지능'
};

function translatePoe1FlaskPropertyText(value) {
  const source = String(value || '').trim();
  let match = source.match(/^Lasts?\s+(.+?)\s+Seconds?$/i);
  if (match) return `${match[1]}초 지속`;
  match = source.match(/^Consumes?\s+(.+?)\s+of\s+(.+?)\s+Charges?\s+on use$/i);
  if (match) return `사용 시 충전 ${match[1]} 소모 (최대 ${match[2]})`;
  match = source.match(/^Currently has\s+(.+?)\s+Charges?$/i);
  if (match) return `현재 충전 ${match[1]}`;
  match = source.match(/^Recovers?\s+(.+?)\s+Life\s+over\s+(.+?)\s+Seconds?$/i);
  if (match) return `${match[2]}초 동안 생명력 ${match[1]} 회복`;
  match = source.match(/^Recovers?\s+(.+?)\s+Mana\s+over\s+(.+?)\s+Seconds?$/i);
  if (match) return `${match[2]}초 동안 마나 ${match[1]} 회복`;
  match = source.match(/^Duration:?\s*(.+?)\s+Seconds?$/i);
  if (match) return `지속시간: ${match[1]}초`;
  match = source.match(/^Charges:?\s*(.+?)\s+per use$/i);
  if (match) return `사용당 충전 소모: ${match[1]}`;
  match = source.match(/^Life Recovery:?\s*(.+)$/i);
  if (match) return `생명력 회복: ${match[1]}`;
  match = source.match(/^Mana Recovery:?\s*(.+)$/i);
  if (match) return `마나 회복: ${match[1]}`;
  return source;
}

function translatePoe1CharacterText(value) {
  const source = String(value || '').trim();
  const translated = translatePoe1NinjaStatText(source);
  return translated !== source ? translated : translatePoe1FlaskPropertyText(source);
}

function localizePoe1CharacterItem(item) {
  if (!item || !poe1ItemNamesKo || !poe1StatTextsKo) return item;
  const localized = window.POE2TQPobCharacter?.localizeTradeItem(
    item,
    poe1ItemNamesKo,
    translatePoe1CharacterText
  ) || item;
  const rawName = stripTradeTags(item.name || item.typeLine || item.baseType || '');
  const effect = poe1ItemEffectsKo?.[rawName];
  if (effect) localized.descrText = effect;
  else if (localized.descrText) localized.descrText = translatePoe1NinjaStatText(stripTradeTags(localized.descrText));
  return localized;
}

function renderPoe1CharacterProperty(property) {
  if (!property) return '';
  const rendered = renderTradePropertyText(property);
  const source = stripTradeTags(rendered || property.name || '');
  const translated = translatePoe1CharacterText(source);
  if (translated !== source) return translated;
  const name = stripTradeTags(property.name || '').replace(/:$/, '').trim();
  const label = POE1_CHARACTER_PROPERTY_LABELS_KO[name];
  if (!label || !name) return source;
  return source.replace(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:?`, 'i'), `${label}:`);
}

function buildPoe1CharacterSocketsHtml(item) {
  const sockets = Array.isArray(item?.sockets) ? item.sockets : [];
  if (!sockets.length) return '';
  return `<div class="character-item-sockets">${sockets.map((socket, index) => {
    const next = sockets[index + 1];
    const linked = next && Number(next.group) === Number(socket.group);
    const color = getPoe1CharacterSocketColor(socket);
    return `<span class="character-item-socket${linked ? ' linked' : ''}" style="--socket-color:${color}" title="${esc(socket.sColour || socket.attr || '')}"></span>`;
  }).join('')}</div>`;
}

function getPoe1CharacterSocketColor(socket) {
  const colors = { R: '#b54a43', G: '#4d9c57', B: '#4f72bd', W: '#d9d5ca', A: '#b77bd0', DV: '#8b5a3c' };
  const explicit = String(socket?.sColour || '').toUpperCase();
  const key = explicit || ({ S: 'R', D: 'G', I: 'B', G: 'W', A: 'A', DV: 'DV' })[String(socket?.attr || '').toUpperCase()] || '';
  return colors[key] || '#777';
}

function getPoe1CharacterSlotSocketPoints(item, socketCount) {
  const columns = Math.max(1, Number(item?.w) || 1);
  if (columns === 1) {
    const top = socketCount === 1 ? 50 : 18;
    const step = socketCount > 1 ? 64 / (socketCount - 1) : 0;
    return Array.from({ length: socketCount }, (_, index) => ({ x: 50, y: top + (step * index) }));
  }

  const rowCount = Math.ceil(socketCount / 2);
  const rowY = rowCount === 1 ? [50] : rowCount === 2 ? [28, 72] : [18, 50, 82];
  return Array.from({ length: socketCount }, (_, index) => {
    const row = Math.floor(index / 2);
    const isReversedRow = row % 2 === 1;
    const isSecondInRow = index % 2 === 1;
    return {
      x: (isSecondInRow !== isReversedRow) ? 72 : 28,
      y: rowY[row]
    };
  });
}

function buildPoe1CharacterSlotSocketsHtml(item, summary, slot) {
  const sockets = Array.isArray(item?.sockets) ? item.sockets : [];
  if (!sockets.length) return '';
  const points = getPoe1CharacterSlotSocketPoints(item, sockets.length);
  const itemWidth = Math.max(1, Number(item?.w) || 1);
  const itemHeight = Math.max(1, Number(item?.h) || 1);
  const renderedWidth = Math.max(0, Number(slot?.clientWidth) - 12);
  const renderedHeight = Math.max(0, Number(slot?.clientHeight) - 14);
  const viewHeight = renderedWidth > 0 && renderedHeight > 0
    ? Math.round(100 * renderedHeight / renderedWidth)
    : Math.max(100, Math.round(100 * itemHeight / itemWidth));
  const toSvgPoint = point => ({ x: point.x, y: point.y * viewHeight / 100 });
  const links = sockets.slice(0, -1).map((socket, index) => {
    const next = sockets[index + 1];
    const group = socket?.group != null ? String(socket.group) : `socket-${index}`;
    const nextGroup = next?.group != null ? String(next.group) : `socket-${index + 1}`;
    if (!next || group !== nextGroup) return '';
    const from = toSvgPoint(points[index]);
    const to = toSvgPoint(points[index + 1]);
    return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#17130b" stroke-width="11" stroke-linecap="round"/><line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#b49a45" stroke-width="6" stroke-linecap="round"/><line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#f0d978" stroke-width="2" stroke-linecap="round"/>`;
  }).join('');
  const socketRings = sockets.map((socket, index) => {
    const point = toSvgPoint(points[index]);
    const color = getPoe1CharacterSocketColor(socket);
    return `<circle cx="${point.x}" cy="${point.y}" r="11" fill="none" stroke="#17140b" stroke-width="7"/><circle cx="${point.x}" cy="${point.y}" r="9" fill="none" stroke="#c8ad50" stroke-width="4"/><circle cx="${point.x}" cy="${point.y}" r="6.5" fill="none" stroke="${color}" stroke-width="4"/><circle cx="${point.x}" cy="${point.y}" r="4" fill="none" stroke="#eadb91" stroke-width="1" stroke-opacity=".65"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${viewHeight}" preserveAspectRatio="xMidYMid meet">${links}${socketRings}</svg>`;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  return `<img class="character-slot-socket-image" src="${dataUrl}" alt="" aria-hidden="true" draggable="false" title="${esc(`${summary.sockets}홈 · 최대 ${summary.links}연결 · ${summary.text}`)}">`;
}

function updatePoe1CharacterSlotSocketImage(slot, item, summary) {
  if (!slot || !item || !summary?.sockets) return;
  const width = Math.max(0, slot.clientWidth);
  const height = Math.max(0, slot.clientHeight);
  if (!width || !height) return;
  const sizeKey = `${width}x${height}`;
  if (slot.__poe2tqSocketSizeKey === sizeKey && slot.querySelector('.character-slot-socket-image')) return;
  const markup = buildPoe1CharacterSlotSocketsHtml(item, summary, slot);
  const current = slot.querySelector('.character-slot-socket-image');
  if (current) current.outerHTML = markup;
  else slot.insertAdjacentHTML('beforeend', markup);
  slot.__poe2tqSocketSizeKey = sizeKey;
}

function buildPoe1CharacterModSection(title, mods, className = '') {
  const lines = (Array.isArray(mods) ? mods : []).map(stripTradeTags).filter(Boolean);
  if (!lines.length) return '';
  return `<div class="ninja-tooltip-section ${className}">
    <div class="ninja-tooltip-section-title">${esc(title)}</div>
    ${lines.map(line => `<div class="ninja-tooltip-mod">${esc(line)}</div>`).join('')}
  </div>`;
}

function buildPoe1CharacterItemTooltipHtml(sourceItem) {
  const item = localizePoe1CharacterItem(sourceItem);
  const name = getPoe1CharacterItemName(item);
  const base = getPoe1CharacterItemBase(item);
  const frameType = Number(item?.frameType);
  const titleClass = frameType === 1
    ? ' magic'
    : frameType === 2
      ? ' rare'
      : frameType === 3 || frameType === 9 || frameType === 10
        ? ' unique'
        : frameType === 5
          ? ' currency'
          : '';
  const properties = (item?.properties || []).map(renderPoe1CharacterProperty).filter(Boolean);
  const requirements = (item?.requirements || []).map(renderPoe1CharacterProperty).filter(Boolean);
  const flags = [
    item?.corrupted ? '타락' : '',
    item?.duplicated ? '복제' : '',
    item?.fractured ? '분열됨' : '',
    item?.identified === false ? '미확인' : ''
  ].filter(Boolean);
  const icon = String(item?.icon || '');
  const socketSummary = POE2TQTradeCompat.getSocketSummary(item, TRADE_REALM_POE1);
  return `
    <div class="ninja-tooltip-head">
      ${icon ? `<img class="ninja-tooltip-icon" src="${esc(icon)}" alt="">` : ''}
      <div class="ninja-tooltip-title-wrap">
        <div class="ninja-tooltip-title${titleClass}">${esc(name)}</div>
        ${base ? `<div class="ninja-tooltip-meta">${esc(base)}</div>` : ''}
        ${buildPoe1CharacterSocketsHtml(item)}
      </div>
    </div>
    <div class="ninja-tooltip-body">
      ${properties.length ? `<div class="ninja-tooltip-section"><div class="ninja-tooltip-section-title">아이템 정보</div>${properties.map(line => `<div class="ninja-tooltip-mod">${esc(line)}</div>`).join('')}</div>` : ''}
      ${requirements.length ? `<div class="ninja-tooltip-section"><div class="ninja-tooltip-section-title">요구사항</div>${requirements.map(line => `<div class="ninja-tooltip-mod">${esc(line)}</div>`).join('')}</div>` : ''}
      ${socketSummary.sockets ? `<div class="ninja-tooltip-section"><div class="ninja-tooltip-section-title">홈 정보</div><div class="ninja-tooltip-mod">${socketSummary.sockets}홈 · 최대 ${socketSummary.links}연결</div><div class="ninja-tooltip-meta">${esc(socketSummary.text)}</div></div>` : ''}
      ${buildPoe1CharacterModSection('인챈트 속성', item?.enchantMods, 'mutated')}
      ${buildPoe1CharacterModSection('고정 속성', item?.implicitMods, 'implicit')}
      ${buildPoe1CharacterModSection('분열 속성', item?.fracturedMods, 'mutated')}
      ${buildPoe1CharacterModSection('명시 속성', item?.explicitMods)}
      ${buildPoe1CharacterModSection('제작 속성', item?.craftedMods, 'implicit')}
      ${buildPoe1CharacterModSection('스킬 속성', item?.skillMods)}
      ${buildPoe1CharacterModSection('룬 속성', item?.runeMods, 'implicit')}
      ${buildPoe1CharacterModSection('변형 속성', item?.mutatedMods, 'mutated')}
      ${buildPoe1CharacterModSection('추가 속성', item?.utilityMods)}
      ${item?.descrText ? `<div class="ninja-tooltip-section effect"><div class="ninja-tooltip-effect">${esc(stripTradeTags(item.descrText))}</div></div>` : ''}
      ${flags.length ? `<div class="character-item-flags">${flags.map(flag => `<span>${esc(flag)}</span>`).join('')}</div>` : ''}
    </div>
  `;
}

function showPoe1CharacterItemTooltip(slot, item) {
  cancelNinjaTooltipHide();
  const html = buildPoe1CharacterItemTooltipHtml(item);
  if (window.parent && window.parent !== window) {
    const rect = slot.getBoundingClientRect();
    window.parent.postMessage({
      type: 'POE2TQ_NINJA_TOOLTIP',
      action: 'show',
      html,
      anchorRatio: Math.max(0, Math.min(1, rect.top / Math.max(window.innerHeight, 1)))
    }, '*');
    return;
  }
  const tooltip = document.getElementById('ninja-item-tooltip');
  if (!tooltip) return;
  if (!tooltip.dataset.hoverBound) {
    tooltip.addEventListener('mouseenter', cancelNinjaTooltipHide);
    tooltip.addEventListener('mouseleave', hideNinjaTooltip);
    tooltip.dataset.hoverBound = 'true';
  }
  tooltip.innerHTML = html;
  tooltip.hidden = false;
  positionNinjaTooltip(tooltip, slot);
}

function requestPoe1CharacterFavoriteFilter(item, character) {
  if (!window.parent || window.parent === window) {
    return Promise.reject(new Error('거래소 페이지 안에서만 즐겨찾기를 등록할 수 있습니다.'));
  }
  return new Promise((resolve, reject) => {
    const requestId = `poe2tq_character_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    const timer = setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('즐겨찾기 옵션 선택 시간이 초과되었습니다.'));
    }, 5 * 60 * 1000);
    function onMessage(event) {
      const data = event.data || {};
      if (event.source !== window.parent || data.type !== 'POE2TQ_CHARACTER_FILTER_RESULT' || data.requestId !== requestId) return;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      if (!data.ok) {
        const error = new Error(data.error || '즐겨찾기 등록 실패');
        error.cancelled = Boolean(data.cancelled);
        reject(error);
        return;
      }
      resolve(data);
    }
    window.addEventListener('message', onMessage);
    window.parent.postMessage({
      type: 'POE2TQ_BUILD_CHARACTER_FILTER',
      requestId,
      item,
      characterName: character?.name || '',
      league: character?.league || settings.league || 'Standard',
      realm: TRADE_REALM_POE1
    }, '*');
  });
}

async function preparePoe1CharacterFavoriteItem(item, character) {
  if (character?.source !== 'pob') return item;
  await Promise.all([loadPoe1ItemNamesKo(), loadPoe1StatTextsKo()]);
  return window.POE2TQPobCharacter?.localizeTradeItem(
    item,
    poe1ItemNamesKo,
    translatePoe1NinjaStatText
  ) || item;
}

async function savePoe1CharacterItemFavorite(item, button) {
  if (!item || !button || button.disabled) return;
  const selectedName = document.getElementById('character-select')?.value || '';
  const character = poe1CurrentEquipmentCharacter
    || poe1Characters.find(entry => entry.name === selectedName)
    || null;
  button.disabled = true;
  button.textContent = '…';
  setPoe1CharacterEquipmentMessage(`${getPoe1CharacterItemName(item)} 즐겨찾기 옵션을 준비하는 중...`);
  try {
    const favoriteItem = await preparePoe1CharacterFavoriteItem(item, character);
    const result = await requestPoe1CharacterFavoriteFilter(favoriteItem, character);
    button.textContent = '★';
    button.title = result.duplicate ? '이미 등록된 즐겨찾기' : '즐겨찾기 등록 완료';
    setPoe1CharacterEquipmentMessage(result.duplicate
      ? `이미 등록된 즐겨찾기입니다: ${result.name || getPoe1CharacterItemName(item)}`
      : `즐겨찾기에 등록했습니다: ${result.name || getPoe1CharacterItemName(item)}`);
  } catch (error) {
    button.textContent = '☆';
    button.disabled = false;
    if (!error?.cancelled) setPoe1CharacterEquipmentMessage(error?.message || '즐겨찾기를 등록하지 못했습니다.', true);
  }
}

function clearPoe1CharacterEquipmentBoard() {
  document.querySelectorAll('#character-equipment-board .character-slot').forEach(slot => {
    slot.__poe2tqSocketResizeObserver?.disconnect();
    slot.__poe2tqSocketResizeObserver = null;
    slot.__poe2tqSocketSizeKey = '';
    slot.classList.remove('has-item');
    slot.removeAttribute('tabindex');
    slot.removeAttribute('aria-label');
    slot.innerHTML = '';
    slot.__poe2tqCharacterItem = null;
    slot.onmouseenter = null;
    slot.onmouseleave = null;
    slot.onfocus = null;
    slot.onblur = null;
    slot.onkeydown = null;
  });
  const profile = document.getElementById('character-equipment-profile');
  if (profile) {
    profile.hidden = true;
    profile.innerHTML = '';
  }
  const statGrid = document.getElementById('character-stat-grid');
  if (statGrid) {
    statGrid.hidden = true;
    statGrid.innerHTML = '';
  }
  poe1CurrentEquipmentCharacter = null;
  poe1CharacterEquipmentItems = [];
  hideNinjaTooltip();
}

function isPoe1VisibleEquippedItem(item) {
  return /^(weapon|offhand|helm|bodyarmour|gloves|boots|amulet|ring2?|belt|flask)$/i.test(String(item?.inventoryId || ''));
}

function setPoe1CharacterSlotItem(slot, item) {
  if (!slot || !item) return;
  const itemName = getPoe1CharacterItemName(item);
  slot.classList.add('has-item');
  slot.tabIndex = 0;
  slot.setAttribute('aria-label', itemName);
  const socketSummary = POE2TQTradeCompat.getSocketSummary(item, TRADE_REALM_POE1);
  slot.innerHTML = `${item.icon ? `<img src="${esc(item.icon)}" alt="${esc(itemName)}">` : `<span>${esc(itemName)}</span>`}<button class="character-slot-favorite" type="button" title="거래소 즐겨찾기에 등록" aria-label="${esc(itemName)} 즐겨찾기 등록">☆</button>`;
  updatePoe1CharacterSlotSocketImage(slot, item, socketSummary);
  if (socketSummary.sockets && typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(() => updatePoe1CharacterSlotSocketImage(slot, item, socketSummary));
    observer.observe(slot);
    slot.__poe2tqSocketResizeObserver = observer;
  }
  slot.__poe2tqCharacterItem = item;
  const show = () => showPoe1CharacterItemTooltip(slot, item);
  slot.onmouseenter = show;
  slot.onmouseleave = scheduleNinjaTooltipHide;
  slot.onfocus = show;
  slot.onblur = scheduleNinjaTooltipHide;
  slot.onkeydown = event => {
    if (event.key === 'Escape') {
      hideNinjaTooltip();
      slot.blur();
    }
  };
  slot.querySelector('img')?.addEventListener('error', event => { event.currentTarget.style.display = 'none'; }, { once: true });
  slot.querySelector('.character-slot-favorite')?.addEventListener('click', event => {
    event.stopPropagation();
    event.preventDefault();
    savePoe1CharacterItemFavorite(item, event.currentTarget);
  });
}

function renderPoe1CharacterEquipment(items, character, stats = null) {
  clearPoe1CharacterEquipmentBoard();
  poe1CurrentEquipmentCharacter = character || null;
  poe1CharacterEquipmentItems = Array.isArray(items) ? items : [];
  const flasks = poe1CharacterEquipmentItems
    .filter(item => /^flask$/i.test(String(item?.inventoryId || '')))
    .sort((a, b) => Number(a.x || 0) - Number(b.x || 0));
  const bySlot = new Map();
  poe1CharacterEquipmentItems.forEach(item => {
    const inventoryId = String(item?.inventoryId || '');
    if (inventoryId && !/^flask$/i.test(inventoryId) && !bySlot.has(inventoryId.toLowerCase())) {
      bySlot.set(inventoryId.toLowerCase(), item);
    }
  });
  document.querySelectorAll('#character-equipment-board [data-character-slot]').forEach(slot => {
    setPoe1CharacterSlotItem(slot, bySlot.get(String(slot.dataset.characterSlot).toLowerCase()));
  });
  document.querySelectorAll('#character-equipment-board [data-flask-index]').forEach(slot => {
    setPoe1CharacterSlotItem(slot, flasks[Number(slot.dataset.flaskIndex)]);
  });

  const profile = document.getElementById('character-equipment-profile');
  if (profile) {
    const equippedCount = poe1CharacterEquipmentItems.filter(isPoe1VisibleEquippedItem).length;
    profile.hidden = false;
    const sourceDetail = character?.source === 'pob' && character?.itemSetTitle ? ` · ${character.itemSetTitle}` : '';
    profile.innerHTML = `<div><strong>${esc(character?.name || '')}</strong><span>${esc(character?.class || '')} · ${esc(character?.league || '')}${esc(sourceDetail)}</span></div><div class="character-equipment-level">레벨 ${Number(character?.level) || 0}<br>${equippedCount.toLocaleString('ko-KR')}개 장착</div>`;
  }
  renderPoe1CharacterStats(stats);
}

async function loadPoe1CharacterEquipment(characterName) {
  const accountName = String(document.getElementById('character-account-name')?.value || '').trim();
  const character = poe1Characters.find(entry => entry.name === characterName);
  if (!accountName || !characterName || !character) return;
  const requestedLeague = String(settings.league || 'Standard');
  if (String(character.league || '') !== requestedLeague) {
    setPoe1CharacterEquipmentMessage(`${requestedLeague} 리그 캐릭터만 장비를 불러올 수 있습니다.`, true);
    return;
  }
  const select = document.getElementById('character-select');
  if (select) {
    select.disabled = true;
    syncCustomSelectControl(select);
  }
  setPoe1CharacterEquipmentMessage(`${characterName} 장비를 불러오는 중...`);
  try {
    const payload = await fetchPoe1CharacterJson('get-items', { accountName, character: characterName });
    if (requestedLeague !== String(settings.league || 'Standard')) {
      throw new Error('조회 중 설정 리그가 변경되었습니다. 캐릭터를 다시 조회해 주세요.');
    }
    const responseItems = Array.isArray(payload?.character?.equipment)
      ? payload.character.equipment
      : (Array.isArray(payload?.items) ? payload.items : (Array.isArray(payload) ? payload : []));
    const items = responseItems.filter(isPoe1VisibleEquippedItem);
    const resolvedCharacter = payload?.character ? { ...character, ...payload.character } : character;
    if (String(resolvedCharacter.league || '') !== requestedLeague) {
      throw new Error(`${requestedLeague} 리그가 아닌 캐릭터 장비 응답은 표시하지 않았습니다.`);
    }
    renderPoe1CharacterEquipment(items, resolvedCharacter);
    await savePoe1CharacterEquipmentView(accountName, resolvedCharacter, items).catch(() => {});
    setPoe1CharacterEquipmentMessage(`착용 아이템 ${items.length.toLocaleString('ko-KR')}개를 불러왔습니다.`);
  } catch (error) {
    clearPoe1CharacterEquipmentBoard();
    setPoe1CharacterEquipmentMessage(error?.message || '캐릭터 장비를 불러오지 못했습니다.', true);
  } finally {
    if (select) {
      select.disabled = false;
      syncCustomSelectControl(select);
    }
  }
}

async function loadPoe1Characters() {
  const accountInput = document.getElementById('character-account-name');
  const accountName = await resolvePoe1AccountName(accountInput);
  if (!accountName) {
    setPoe1CharacterEquipmentMessage('로그인 계정을 자동 확인하지 못했습니다. 계정명을 직접 입력해 주세요.', true);
    accountInput?.focus();
    return;
  }
  const button = document.getElementById('character-load-list');
  const select = document.getElementById('character-select');
  const requestedLeague = String(settings.league || 'Standard');
  const previous = select?.value || '';
  if (button) button.disabled = true;
  if (select) {
    select.disabled = true;
    syncCustomSelectControl(select);
  }
  setPoe1CharacterEquipmentMessage('캐릭터 목록을 불러오는 중...');
  try {
    const payload = await fetchPoe1CharacterJson('get-characters', { accountName });
    if (requestedLeague !== String(settings.league || 'Standard')) {
      throw new Error('조회 중 설정 리그가 변경되었습니다. 캐릭터를 다시 조회해 주세요.');
    }
    const characters = Array.isArray(payload) ? payload : (Array.isArray(payload?.characters) ? payload.characters : []);
    poe1Characters = POE2TQLeagueData.filterCharactersByLeague(characters, requestedLeague)
      .sort((a, b) => Number(b.current || 0) - Number(a.current || 0) || Number(b.level || 0) - Number(a.level || 0));
    if (!poe1Characters.length) throw new Error(`이 계정에서 ${requestedLeague} 리그 캐릭터를 찾지 못했습니다.`);
    const selectedName = poe1Characters.some(character => character.name === previous)
      ? previous
      : poe1Characters[0].name;
    if (select) {
      select.innerHTML = poe1Characters.map(character => `<option value="${esc(character.name)}"${character.name === selectedName ? ' selected' : ''}>${esc(character.name)} · Lv.${Number(character.level) || 0} ${esc(character.class || '')} · ${esc(character.league || '')}</option>`).join('');
      select.disabled = false;
      syncCustomSelectControl(select);
    }
    await chrome.storage.local.set({ [POE1_STASH_ACCOUNT_KEY]: accountName }).catch(() => {});
    const stashInput = document.getElementById('stash-account-name');
    if (stashInput && !stashInput.value) stashInput.value = accountName;
    await loadPoe1CharacterEquipment(selectedName);
  } catch (error) {
    poe1Characters = [];
    clearPoe1CharacterEquipmentBoard();
    if (select) {
      select.innerHTML = '<option value="">캐릭터를 불러오지 못했습니다</option>';
      select.disabled = true;
      syncCustomSelectControl(select);
    }
    setPoe1CharacterEquipmentMessage(error?.message || '캐릭터 목록을 불러오지 못했습니다.', true);
  } finally {
    if (button) button.disabled = false;
  }
}

function bindPoe1CharacterEquipment() {
  const accountInput = document.getElementById('character-account-name');
  const button = document.getElementById('character-load-list');
  const select = document.getElementById('character-select');
  if (!accountInput || !button || !select || button.dataset.bound) return;
  button.dataset.bound = '1';
  Promise.all([
    loadPoe1ItemNamesKo(),
    loadPoe1StatTextsKo(),
    loadPoe1ItemEffectsKo()
  ]).then(() => {
    if (!poe1CharacterEquipmentItems.length || !poe1CurrentEquipmentCharacter) return;
    renderPoe1CharacterEquipment(
      poe1CharacterEquipmentItems,
      poe1CurrentEquipmentCharacter,
      poe1CharacterSource === 'pob' ? poe1PobCharacterView?.stats : null
    );
  }).catch(() => {});
  button.addEventListener('click', loadPoe1Characters);
  document.querySelectorAll('[data-character-source]').forEach(sourceButton => {
    sourceButton.addEventListener('click', () => switchPoe1CharacterSource(sourceButton.dataset.characterSource));
  });
  const pobFileInput = document.getElementById('character-pob-file');
  const pobLoadButton = document.getElementById('character-pob-load');
  const pobDropzone = document.getElementById('character-pob-dropzone');
  pobFileInput?.addEventListener('change', () => {
    selectPoe1PobFile(pobFileInput.files?.[0] || null);
  });
  if (pobDropzone) {
    let dragDepth = 0;
    pobDropzone.addEventListener('dragenter', event => {
      event.preventDefault();
      dragDepth += 1;
      pobDropzone.classList.add('drag-over');
    });
    pobDropzone.addEventListener('dragover', event => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    pobDropzone.addEventListener('dragleave', event => {
      event.preventDefault();
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) pobDropzone.classList.remove('drag-over');
    });
    pobDropzone.addEventListener('drop', event => {
      event.preventDefault();
      dragDepth = 0;
      pobDropzone.classList.remove('drag-over');
      const files = Array.from(event.dataTransfer?.files || []);
      selectPoe1PobFile(files[0] || null);
    });
  }
  pobLoadButton?.addEventListener('click', loadPoe1PobCharacter);
  accountInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') loadPoe1Characters();
  });
  select.addEventListener('change', () => loadPoe1CharacterEquipment(select.value));
  accountInput.addEventListener('change', () => {
    if (!restorePoe1CharacterEquipmentView(accountInput.value)) {
      poe1Characters = [];
      clearPoe1CharacterEquipmentBoard();
      select.innerHTML = '<option value="">캐릭터를 먼저 조회해 주세요</option>';
      select.disabled = true;
      syncCustomSelectControl(select);
      setPoe1CharacterEquipmentMessage('이 계정의 캐릭터를 조회해 주세요.');
    }
  });
  chrome.storage.local.get([
    POE1_STASH_ACCOUNT_KEY,
    POE1_CHARACTER_VIEW_KEY,
    POE1_POB_CHARACTER_VIEW_KEY,
    POE1_CHARACTER_SOURCE_KEY
  ]).then(result => {
    poe1CharacterViewStore = result?.[POE1_CHARACTER_VIEW_KEY] && typeof result[POE1_CHARACTER_VIEW_KEY] === 'object'
      ? result[POE1_CHARACTER_VIEW_KEY]
      : {};
    const storedPobView = result?.[POE1_POB_CHARACTER_VIEW_KEY];
    if (storedPobView?.parserVersion === POE1_POB_PARSER_VERSION
      && storedPobView?.character
      && Array.isArray(storedPobView.items)
      && storedPobView.stats
      && typeof storedPobView.stats === 'object') {
      poe1PobCharacterView = storedPobView;
      enrichPoe1PobItemIcons(poe1PobCharacterView.items).then(async () => {
        await chrome.storage.local.set({ [POE1_POB_CHARACTER_VIEW_KEY]: poe1PobCharacterView }).catch(() => {});
        if (poe1CharacterSource === 'pob') {
          renderPoe1CharacterEquipment(
            poe1PobCharacterView.items,
            poe1PobCharacterView.character,
            poe1PobCharacterView.stats
          );
        }
      }).catch(() => {});
    } else if (storedPobView) {
      chrome.storage.local.remove(POE1_POB_CHARACTER_VIEW_KEY).catch(() => {});
    }
    const accountName = result?.[POE1_STASH_ACCOUNT_KEY];
    if (accountName) {
      accountInput.value = accountName;
      restorePoe1CharacterEquipmentView(accountName);
    }
    if (result?.[POE1_CHARACTER_SOURCE_KEY] === 'pob') {
      if (poe1PobCharacterView) {
        poe1Characters = [poe1PobCharacterView.character];
        select.innerHTML = `<option value="${esc(poe1PobCharacterView.character.name)}">${esc(poe1PobCharacterView.character.name)}</option>`;
        select.value = poe1PobCharacterView.character.name;
        select.disabled = false;
        syncCustomSelectControl(select);
        switchPoe1CharacterSource('pob');
      } else {
        switchPoe1CharacterSource('pob');
        setPoe1CharacterEquipmentMessage('홈 색상과 변형 옵션 파서가 개선되었습니다. PoB XML을 한 번 다시 불러와 주세요.');
      }
    }
  }).catch(() => {});
}

async function loadAndRenderPassive(query) {
  const realm = normalizeTradeRealm(settings.tradeRealm);
  if (passiveLoadedRealm !== realm) {
    passiveLoadedRealm = realm;
    passiveTreeData = null;
    passiveFullTreeData = null;
    passiveLiquids = {};
  }
  bindPassiveControls();
  if (!passiveTreeData) {
    const countEl = document.getElementById('passive-count');
    if (countEl) countEl.textContent = '로딩 중...';
    try {
      const filename = realm === TRADE_REALM_POE1
        ? 'data/poe1-passive-tree-3.28.json'
        : 'data/passive-tree-ko-csv-matched.json';
      const url = chrome.runtime.getURL(filename);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (normalizeTradeRealm(settings.tradeRealm) !== realm) return;
      passiveTreeData = json.nodes || {};
      passiveLiquids = json.liquids || {};
      if (realm === TRADE_REALM_POE1) passiveFullTreeData = passiveTreeData;
    } catch (e) {
      const countEl = document.getElementById('passive-count');
      if (countEl) countEl.textContent = '데이터 로드 실패';
      return;
    }
  }
  if (passiveMode === 'search') renderPassive(query);
}

function getPassiveNodeName(node, language = passiveLang) {
  if (!node) return '';
  return language === 'ko'
    ? (node.koName || node.enName || node.name || '')
    : (node.enName || node.name || node.koName || '');
}

function getPassiveNodeStats(node, language = passiveLang) {
  if (!node) return [];
  return language === 'ko'
    ? (node.koStats || node.enStats || node.stats || [])
    : (node.enStats || node.stats || node.koStats || []);
}

function getPassiveMasteryEffectStats(node, effectId, language = passiveLang) {
  const effect = (node?.masteryEffects || []).find(item => String(item.effect) === String(effectId));
  if (!effect) return [];
  return language === 'ko'
    ? (effect.koStats || effect.stats || [])
    : (effect.stats || effect.koStats || []);
}

function renderPassiveMasteryChoices(node) {
  const effects = node?.masteryEffects || [];
  if (!effects.length) return '';
  return `<div style="margin-top:6px;border-top:1px solid #302a1c;padding-top:5px;">
    <div style="color:#a98bd0;font-size:10px;font-weight:600;margin-bottom:4px;">숙련 선택지 ${effects.length}개</div>
    <div style="display:flex;flex-direction:column;gap:4px;">${effects.map(effect => {
      const stats = getPassiveMasteryEffectStats(node, effect.effect);
      const text = stats.length ? stats.join(' / ') : `효과 ID ${effect.effect}`;
      return `<div style="color:#b9aacb;font-size:10.5px;line-height:1.45;padding-left:7px;border-left:2px solid #55406f;">${esc(text)}</div>`;
    }).join('')}</div>
  </div>`;
}

function bindPassiveControls() {
  bindCustomSelectControls(document.getElementById('passive-mode-compare') || document);
  const searchEl = document.getElementById('passive-search');
  if (searchEl && !searchEl.dataset.bound) {
    searchEl.dataset.bound = '1';
    searchEl.addEventListener('input', e => renderPassive(e.target.value));
  }
  const toggleBtn = document.getElementById('passive-lang-toggle');
  if (toggleBtn && !toggleBtn.dataset.bound) {
    toggleBtn.dataset.bound = '1';
    toggleBtn.addEventListener('click', () => {
      passiveLang = passiveLang === 'ko' ? 'en' : 'ko';
      toggleBtn.textContent = passiveLang === 'ko' ? '한/영' : '영/한';
      renderPassive(document.getElementById('passive-search')?.value || '');
    });
  }
  document.querySelectorAll('.passive-mode-btn').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => setPassiveMode(btn.dataset.passiveMode));
  });
  ['passive-xml-1', 'passive-xml-2'].forEach(id => {
    const fileEl = document.getElementById(id);
    const nameEl = document.getElementById(id + '-name');
    if (fileEl && !fileEl.dataset.bound) {
      fileEl.dataset.bound = '1';
      fileEl.addEventListener('change', () => {
        const file = fileEl.files[0];
        if (file && !/\.xml$/i.test(String(file.name || ''))) {
          fileEl.value = '';
          if (nameEl) nameEl.textContent = 'XML 파일만 사용할 수 있습니다';
          showPassiveXmlError('PoB 비교에는 XML 파일만 사용할 수 있습니다.');
          populatePassiveSpecSelect(id).catch(() => {});
          return;
        }
        if (nameEl) nameEl.textContent = file?.name || '클릭하거나 XML 드래그';
        refreshPassiveSpecSelect(id);
      });
    }
  });
  document.querySelectorAll('[data-passive-xml-dropzone]').forEach(dropzone => {
    if (dropzone.dataset.dropBound) return;
    dropzone.dataset.dropBound = '1';
    const inputId = dropzone.dataset.passiveXmlDropzone;
    let dragDepth = 0;
    dropzone.addEventListener('dragenter', event => {
      event.preventDefault();
      dragDepth += 1;
      dropzone.classList.add('drag-over');
    });
    dropzone.addEventListener('dragover', event => {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    });
    dropzone.addEventListener('dragleave', event => {
      event.preventDefault();
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) dropzone.classList.remove('drag-over');
    });
    dropzone.addEventListener('drop', event => {
      event.preventDefault();
      dragDepth = 0;
      dropzone.classList.remove('drag-over');
      const file = Array.from(event.dataTransfer?.files || [])
        .find(candidate => /\.xml$/i.test(String(candidate?.name || '')));
      if (!file) {
        showPassiveXmlError('드롭한 파일에서 PoB XML을 찾지 못했습니다.');
        return;
      }
      const fileEl = document.getElementById(inputId);
      if (!fileEl) return;
      const transfer = new DataTransfer();
      transfer.items.add(file);
      fileEl.files = transfer.files;
      fileEl.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  const compareBtn = document.getElementById('passive-compare-btn');
  if (compareBtn && !compareBtn.dataset.bound) {
    compareBtn.dataset.bound = '1';
    compareBtn.addEventListener('click', runPassiveCompare);
  }
}

function renderPassive(query) {
  const listEl = document.getElementById('passive-list');
  const countEl = document.getElementById('passive-count');
  if (!listEl || !passiveTreeData) return;

  const q = (query || '').trim().toLowerCase();
  const nodes = Object.values(passiveTreeData);

  const filtered = q
    ? nodes.filter(n => {
        const name = getPassiveNodeName(n);
        const altName = passiveLang === 'ko' ? (n.enName || n.name || '') : (n.koName || '');
        const stats = getPassiveNodeStats(n).join(' ');
        const masteryStats = (n.masteryEffects || []).flatMap(effect => [
          ...(effect.koStats || []),
          ...(effect.stats || [])
        ]).join(' ');
        const recipe = (n.recipe || []).join(' ').toLowerCase();
        return name.toLowerCase().includes(q)
          || altName.toLowerCase().includes(q)
          || stats.toLowerCase().includes(q)
          || masteryStats.toLowerCase().includes(q)
          || recipe.includes(q);
      })
    : nodes;

  if (countEl) countEl.textContent = `${filtered.length}개 / 전체 ${nodes.length}개`;

  if (filtered.length === 0) {
    listEl.innerHTML = '<div style="color:#666;text-align:center;padding:16px;font-size:12px;">검색 결과 없음</div>';
    return;
  }

  listEl.innerHTML = filtered.map(n => {
    const name = getPassiveNodeName(n);
    const altName = passiveLang === 'ko' ? (n.enName || (n.koName ? n.name : '') || '') : (n.koName || '');
    const stats = getPassiveNodeStats(n);
    const recipe = n.recipe || [];
    const recipeHtml = recipe.length
      ? `<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:3px;">${
          recipe.map(r => {
            const koName = passiveLiquids[r] || r;
            return `<span style="background:#1e1a0e;border:1px solid #5a3e10;border-radius:3px;padding:1px 5px;font-size:10px;color:#c8a84a;" title="${esc(r)}">${esc(koName)}</span>`;
          }).join('')
        }</div>`
      : '';
    const statsHtml = stats.length
      ? `<ul style="margin:4px 0 0 14px;padding:0;list-style:disc;">${
          stats.map(s => `<li style="color:#b0c0b0;font-size:11px;line-height:1.5;">${esc(s)}</li>`).join('')
        }</ul>`
      : '';
    const masteryHtml = renderPassiveMasteryChoices(n);
    return `<div style="background:#181410;border:1px solid #2e2810;border-radius:5px;padding:7px 9px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;">
        <span style="color:#e8c84a;font-weight:600;font-size:12px;">${esc(name)}</span>
        ${altName ? `<span style="color:#666;font-size:10px;flex-shrink:0;">${esc(altName)}</span>` : ''}
      </div>
      ${statsHtml}${masteryHtml}${recipeHtml}
    </div>`;
  }).join('');
}

function parsePobSpecs(xmlText) {
  const documentNode = new DOMParser().parseFromString(xmlText, 'application/xml');
  if (documentNode.querySelector('parsererror')) throw new Error('PoB XML 형식이 올바르지 않습니다.');
  const tree = documentNode.querySelector('Tree');
  const specs = tree
    ? Array.from(tree.children).filter(node => node.localName === 'Spec')
    : Array.from(documentNode.querySelectorAll('Spec'));
  if (!specs.length) throw new Error('PoB XML에서 패시브 트리 세트를 찾지 못했습니다.');
  const activeSpec = tree?.getAttribute('activeSpec') || '1';
  const activeIndex = POE2TQPobCompare.resolveSpecIndex(specs.length, activeSpec);
  return {
    activeIndex,
    specs: specs.map((spec, index) => ({
      title: String(spec.getAttribute('title') || '').trim() || `패시브 세트 ${index + 1}`,
      treeVersion: spec.getAttribute('treeVersion') || '',
      classId: spec.getAttribute('classId') || '',
      ascendClassId: spec.getAttribute('ascendClassId') || '',
      nodes: POE2TQPobCompare.parseNodeIds(spec.getAttribute('nodes')),
      masteries: POE2TQPobCompare.parseMasteryEffects(spec.getAttribute('masteryEffects'))
    }))
  };
}

function parsePobSelectedSpec(xmlText, selectedIndex) {
  const parsed = parsePobSpecs(xmlText);
  const index = POE2TQPobCompare.resolveSpecIndex(
    parsed.specs.length,
    parsed.activeIndex + 1,
    selectedIndex
  );
  const spec = parsed.specs[index];
  return {
    ...spec,
    specCount: parsed.specs.length,
    selectedIndex: index,
    fileActiveIndex: parsed.activeIndex
  };
}

async function populatePassiveSpecSelect(fileInputId) {
  const fileInput = document.getElementById(fileInputId);
  const suffix = fileInputId.endsWith('-2') ? '2' : '1';
  const select = document.getElementById(`passive-spec-${suffix}`);
  const wrap = document.getElementById(`passive-spec-${suffix}-wrap`);
  const file = fileInput?.files?.[0];
  if (!select || !wrap) return;
  select.replaceChildren();
  select.disabled = true;
  syncCustomSelectControl(select);
  wrap.hidden = true;
  if (!file) return;
  const parsed = parsePobSpecs(await file.text());
  if (fileInput.files?.[0] !== file) return;
  parsed.specs.forEach((spec, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${index + 1}. ${spec.title}${index === parsed.activeIndex ? ' (활성)' : ''}`;
    select.appendChild(option);
  });
  select.value = String(parsed.activeIndex);
  select.disabled = parsed.specs.length < 2;
  syncCustomSelectControl(select);
  wrap.hidden = false;
}

async function runPassiveCompare() {
  const file1 = document.getElementById('passive-xml-1')?.files[0];
  const file2 = document.getElementById('passive-xml-2')?.files[0];
  const resultEl = document.getElementById('passive-compare-result');
  if (!resultEl) return;
  if (!file1 || !file2) {
    resultEl.innerHTML = '<div style="color:#888;text-align:center;padding:12px;font-size:12px;">XML 파일 2개를 모두 선택해주세요.</div>';
    return;
  }
  resultEl.innerHTML = '<div style="color:#888;text-align:center;padding:12px;font-size:12px;">비교 중...</div>';
  try {
    const realm = normalizeTradeRealm(settings.tradeRealm);
    await loadAndRenderPassive(document.getElementById('passive-search')?.value || '');
    if (!passiveFullTreeData) {
      const url = chrome.runtime.getURL('data/tree.json');
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Tree data HTTP ${res.status}`);
      const json = await res.json();
      passiveFullTreeData = json.nodes || {};
    }
    const [text1, text2] = await Promise.all([file1.text(), file2.text()]);
    const first = parsePobSelectedSpec(text1, document.getElementById('passive-spec-1')?.value);
    const second = parsePobSelectedSpec(text2, document.getElementById('passive-spec-2')?.value);
    const comparison = POE2TQPobCompare.compareSpecs(first, second);

    const renderNodeCard = id => {
      const notable = passiveTreeData?.[id];
      const node = notable || passiveFullTreeData?.[id];
      if (!node) {
        const cluster = Number(id) >= 65536 ? '클러스터 주얼 노드' : '알 수 없는 노드';
        return `<div style="background:#181410;border:1px solid #2e2810;border-radius:5px;padding:5px 9px;"><span style="color:#777;font-size:11px;">${cluster} (ID: ${esc(id)})</span></div>`;
      }
      const name = getPassiveNodeName(node) || `노드 ${id}`;
      const stats = getPassiveNodeStats(node);
      const recipe = node.recipe || [];
      const flags = [];
      if (node.isKeystone) flags.push('Keystone');
      else if (node.isNotable || (realm === TRADE_REALM_POE2 && notable)) flags.push('Notable');
      if (node.isMastery) flags.push('Mastery');
      if (node.ascendancyName) flags.push(node.ascendancyName);
      const badgeHtml = flags.map(flag => `<span style="font-size:9px;color:#c8a84a;border:1px solid #5a3e10;border-radius:2px;padding:0 3px;margin-left:4px;vertical-align:middle;">${esc(flag)}</span>`).join('');
      const statsHtml = stats.length
        ? `<ul style="margin:3px 0 0 14px;padding:0;list-style:disc;">${stats.map(stat => `<li style="color:#b0c0b0;font-size:11px;line-height:1.4;">${esc(stat)}</li>`).join('')}</ul>` : '';
      const recipeHtml = recipe.length
        ? `<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:3px;">${recipe.map(item => `<span style="background:#1e1a0e;border:1px solid #5a3e10;border-radius:3px;padding:1px 5px;font-size:10px;color:#c8a84a;">${esc(passiveLiquids[item] || item)}</span>`).join('')}</div>` : '';
      return `<div style="background:#181410;border:1px solid #2e2810;border-radius:5px;padding:6px 9px;">
        <div style="color:#e8c84a;font-weight:600;font-size:12px;">${esc(name)}${badgeHtml}</div>
        ${statsHtml}${recipeHtml}
      </div>`;
    };
    const renderSection = (ids, filename, color) => `<div style="margin-bottom:10px;">
      <div style="font-size:11px;color:${color};margin-bottom:5px;font-weight:600;">${esc(filename)}에만 있는 노드 (${ids.length}개)</div>
      ${ids.length ? `<div style="display:flex;flex-direction:column;gap:4px;">${ids.map(renderNodeCard).join('')}</div>` : '<div style="color:#555;font-size:11px;">없음</div>'}
    </div>`;
    const masteryHtml = comparison.masteryChanges.length ? `<div style="margin-bottom:10px;">
      <div style="font-size:11px;color:#bb8ee6;margin-bottom:5px;font-weight:600;">숙련 효과 변경 (${comparison.masteryChanges.length}개)</div>
      <div style="display:flex;flex-direction:column;gap:5px;">${comparison.masteryChanges.map(change => {
        const node = passiveFullTreeData?.[change.nodeId] || passiveTreeData?.[change.nodeId];
        const firstStats = change.firstEffect ? getPassiveMasteryEffectStats(node, change.firstEffect) : [];
        const secondStats = change.secondEffect ? getPassiveMasteryEffectStats(node, change.secondEffect) : [];
        const firstText = firstStats.length ? firstStats.join(' / ') : (change.firstEffect ? `효과 ID ${change.firstEffect}` : '선택 안 함');
        const secondText = secondStats.length ? secondStats.join(' / ') : (change.secondEffect ? `효과 ID ${change.secondEffect}` : '선택 안 함');
        return `<div style="background:#181410;border:1px solid #2e2810;border-radius:5px;padding:7px 9px;font-size:11px;">
          <div style="color:#e8c84a;font-weight:600;margin-bottom:5px;">${esc(getPassiveNodeName(node) || `노드 ${change.nodeId}`)}</div>
          <div style="display:grid;grid-template-columns:48px minmax(0,1fr);gap:3px 6px;line-height:1.45;">
            <span style="color:#b89b45;overflow:hidden;text-overflow:ellipsis;">${esc(file1.name)}</span><span style="color:#bbb;">${esc(firstText)}</span>
            <span style="color:#6ab0ff;overflow:hidden;text-overflow:ellipsis;">${esc(file2.name)}</span><span style="color:#bbb;">${esc(secondText)}</span>
          </div>
        </div>`;
      }).join('')}</div>
    </div>` : '';
    const versionWarning = first.treeVersion && second.treeVersion && first.treeVersion !== second.treeVersion
      ? `<div style="margin-bottom:8px;padding:6px 8px;border:1px solid #734a2a;background:#24180f;color:#d89a61;font-size:11px;">트리 버전이 다릅니다: ${esc(first.treeVersion)} / ${esc(second.treeVersion)}. 같은 노드 ID라도 의미가 달라졌을 수 있습니다.</div>`
      : '';
    const specMeta = `<div style="margin-bottom:8px;color:#777;font-size:10px;line-height:1.5;">비교 세트: ${esc(first.title)} (${first.selectedIndex + 1}/${first.specCount}) / ${esc(second.title)} (${second.selectedIndex + 1}/${second.specCount})${realm === TRADE_REALM_POE1 ? ' · PoE1 3.28 노드 기준' : ' · PoE2 노드 기준'}</div>`;
    resultEl.innerHTML = `<div style="padding:0 0 8px;">${versionWarning}${specMeta}
      ${renderSection(comparison.onlyFirst, file1.name, '#e8c84a')}
      ${renderSection(comparison.onlySecond, file2.name, '#6ab0ff')}
      ${masteryHtml}
    </div>`;
  } catch (error) {
    console.error('PoB compare failed', error);
    resultEl.innerHTML = `<div style="color:#c06060;text-align:center;padding:12px;font-size:12px;">파일 분석 실패: ${esc(error.message || 'XML 형식을 확인해주세요.')}</div>`;
  }
}

function showPassiveXmlError(message) {
  const resultEl = document.getElementById('passive-compare-result');
  if (!resultEl) return;
  resultEl.innerHTML = `<div style="color:#c06060;text-align:center;padding:12px;font-size:12px;">${esc(message)}</div>`;
}

function refreshPassiveSpecSelect(inputId) {
  populatePassiveSpecSelect(inputId).catch(error => {
    showPassiveXmlError(error.message || 'XML 형식을 확인해 주세요.');
  });
}

function setPassiveMode(mode) {
  const realm = normalizeTradeRealm(settings.tradeRealm);
  passiveMode = mode === 'compare' ? 'compare' : 'search';
  passiveModeByRealm[realm] = passiveMode;
  document.querySelectorAll('.passive-mode-btn').forEach(button => {
    const active = button.dataset.passiveMode === passiveMode;
    button.classList.toggle('active', active);
    button.style.borderBottomColor = active ? '#c8a84a' : 'transparent';
    button.style.color = active ? '#c8a84a' : '#888';
  });
  const searchPanel = document.getElementById('passive-mode-search');
  const comparePanel = document.getElementById('passive-mode-compare');
  if (searchPanel) searchPanel.style.display = passiveMode === 'search' ? '' : 'none';
  if (comparePanel) comparePanel.style.display = passiveMode === 'compare' ? '' : 'none';
  if (passiveMode === 'search' && passiveTreeData) {
    renderPassive(document.getElementById('passive-search')?.value || '');
  }
}

function renderExpedition(query) {
  const tbody = document.getElementById('expedition-tbody');
  if (!tbody) return;
  const q = (query || '').trim().toLowerCase();
  const CATEGORY_COLORS = {
    '추천': '#4caf7d',
    '보통': '#aaa',
    '비추': '#e57373',
    '특수': '#ba68c8',
    '고유(중요)': '#ffd700',
    '고유': '#f0a040',
    '보스(추천)': '#64b5f6',
    '보스(비추)': '#e57373',
  };
  const rows = q
    ? EXPEDITION_DATA.filter(d =>
        d.rumor.toLowerCase().includes(q) || d.region.toLowerCase().includes(q)
      )
    : EXPEDITION_DATA;
  tbody.innerHTML = rows.map(d => {
    const color = CATEGORY_COLORS[d.category] || '#aaa';
    const effectHtml = esc(d.effect || '').replace(/\n/g, '<br>');
    return `<tr class="expedition-row" style="border-bottom:1px solid #2a2a2a;">
      <td style="padding:5px 6px;border:1px solid #2a2a2a;color:${color};font-weight:bold;white-space:nowrap;text-align:center;vertical-align:middle;">${d.category}</td>
      <td style="padding:5px 6px;border:1px solid #2a2a2a;color:#ddd;vertical-align:middle;line-height:1.45;">${d.rumor}</td>
      <td style="padding:5px 6px;border:1px solid #2a2a2a;vertical-align:top;line-height:1.45;">
        <div style="color:#d6b56b;font-weight:600;margin-bottom:3px;word-break:keep-all;">${d.region}</div>
        <div style="color:#bbb;font-size:10.5px;white-space:normal;word-break:keep-all;overflow-wrap:anywhere;">${effectHtml}</div>
      </td>
    </tr>`;
  }).join('');
  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="padding:12px;text-align:center;color:#666;">검색 결과 없음</td></tr>';
  }
}

function switchTopTab(tabName) {
  if (tabName === 'admin' && !isAdminEnabled()) {
    tabName = 'trade';
  }
  document.querySelectorAll('.top-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.top-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`top-panel-${tabName}`).classList.add('active');
  document.getElementById(`top-tab-${tabName}`).classList.add('active');
  if (tabName === 'economy') { renderNinjaCategoryTabs(); loadNinjaRates(); }
  if (tabName === 'utility') { switchUtilityTab(currentUtilityTab); }
}

const ninjaCacheMap = {};   // key: `${league}::${itemType}` → { data, fetchedAt }

function refreshNinja() {
  // Force-reload current category (bypass cache)
  const category = getCurrentNinjaCategoryConfig(settings.tradeRealm);
  const cacheKey = `${normalizeTradeRealm(settings.tradeRealm)}::${settings.league || 'Standard'}::${category.endpoint || 'exchange'}::${category.type}`;
  delete ninjaCacheMap[cacheKey];
  loadNinjaRates();
}

async function loadNinjaRates() {
  const realm = normalizeTradeRealm(settings.tradeRealm);
  if (realm === TRADE_REALM_POE1) {
    await Promise.all([
      loadPoe1ItemNamesKo(),
      loadPoe1StatTextsKo(),
      loadPoe1ItemEffectsKo(),
      loadPoe1DivinationCards()
    ]);
  }
  const league = settings.league || 'Standard';
  const category = getCurrentNinjaCategoryConfig(realm);
  const itemType = category.type;
  const endpoint = category.endpoint || 'exchange';
  currentNinjaCategory = itemType;
  const cacheKey = `${realm}::${league}::${endpoint}::${itemType}`;
  const now = Date.now();

  const cached = ninjaCacheMap[cacheKey];
  if (cached && now - cached.fetchedAt < 5 * 60 * 1000) {
    syncNinjaRatesFromData(cached.data, realm);
    renderNinjaRates(cached.data, realm);
    if (itemType === 'Currency') updateRateBadge(cached.data, realm, league);
    return;
  }

  document.getElementById('ninja-currency-list').innerHTML = '<div class="ninja-loading">로딩 중...</div>';

  chrome.runtime.sendMessage({ type: 'FETCH_NINJA', realm, league, itemType, endpoint }, res => {
    if (
      realm !== normalizeTradeRealm(settings.tradeRealm)
      || league !== (settings.league || 'Standard')
      || itemType !== currentNinjaCategory
    ) return;
    if (!res || !res.ok || !res.data) {
      const reason = res?.error ? ` (${esc(res.error)})` : '';
      document.getElementById('ninja-currency-list').innerHTML = `<div class="ninja-loading">데이터 로드 실패: ${esc(itemType)}${reason}</div>`;
      return;
    }
    ninjaCacheMap[cacheKey] = { data: res.data, fetchedAt: Date.now() };
    syncNinjaRatesFromData(res.data, realm);
    renderNinjaRates(res.data, realm);
    if (itemType === 'Currency') updateRateBadge(res.data, realm, league);
  });
}

function loadNinjaImage(img, ninjaPath) {
  img.src = resolveNinjaImageUrl(ninjaPath);
  img.onerror = () => { img.style.display = 'none'; };
}

function resolveNinjaImageUrl(ninjaPath) {
  const path = String(ninjaPath || '');
  return /^https?:\/\//i.test(path) ? path : path ? 'https://web.poecdn.com' + path : '';
}

function getNinjaRawName(line, info) {
  return info?.name || line?.name || line?.currencyTypeName || line?.baseType || line?.detailsId || line?.id || '';
}

function getNinjaLineName(line, info, realm = settings.tradeRealm) {
  const rawName = getNinjaRawName(line, info);
  if (normalizeTradeRealm(realm) === TRADE_REALM_POE1 && poe1ItemNamesKo?.[rawName]) return poe1ItemNamesKo[rawName];
  return ITEM_NAMES_KO[rawName] || rawName;
}

function getNinjaEffectText(line, info, realm = settings.tradeRealm) {
  if (normalizeTradeRealm(realm) !== TRADE_REALM_POE1) return '';
  return poe1ItemEffectsKo?.[getNinjaRawName(line, info)] || '';
}

function getNinjaDivinationCardDetails(line, info, realm = settings.tradeRealm) {
  if (normalizeTradeRealm(realm) !== TRADE_REALM_POE1) return null;
  const itemClass = Number(line?.itemClass ?? info?.itemClass);
  const isCard = currentNinjaCategory === 'DivinationCard'
    || itemClass === 6
    || !!(line?.artFilename || info?.artFilename);
  if (!isCard) return null;

  const stored = poe1DivinationCards?.[getNinjaRawName(line, info)] || {};
  const stackSize = Number(line?.stackSize ?? info?.stackSize ?? stored.stackSize);
  const effectText = getNinjaEffectText(line, info, realm).trim();
  const rewardMatch = effectText.match(/^\{(.+)\}$/s);
  return {
    stackSize: Number.isFinite(stackSize) && stackSize > 0 ? stackSize : null,
    reward: rewardMatch?.[1]?.trim() || ''
  };
}

function getNinjaLineImage(line, info) {
  return line?.icon || info?.image || info?.icon || '';
}

const NINJA_STAT_NUMBER_PATTERN = /\(?-?\d+(?:\.\d+)?(?:\s*(?:-|–|—)\s*-?\d+(?:\.\d+)?)?\)?/g;
const NINJA_VARIANT_NAMES_KO = {
  'Culling Strike': '마무리 타격',
  'Soul Eater': '영혼 포식',
  'Minimap Icons': '미니맵 아이콘'
};

function normalizeNinjaStatText(text) {
  return String(text || '').replace(NINJA_STAT_NUMBER_PATTERN, '#');
}

function getPoe1StatTextsByNormalized() {
  if (poe1StatTextsByNormalized) return poe1StatTextsByNormalized;
  poe1StatTextsByNormalized = new Map();
  Object.entries(poe1StatTextsKo || {}).forEach(([english, korean]) => {
    const normalized = normalizeNinjaStatText(english);
    if (!poe1StatTextsByNormalized.has(normalized)) poe1StatTextsByNormalized.set(normalized, korean);
  });
  return poe1StatTextsByNormalized;
}

function translatePoe1NinjaStatText(text) {
  const source = String(text || '').trim();
  if (!source || !poe1StatTextsKo) return source;
  const values = source.match(NINJA_STAT_NUMBER_PATTERN) || [];
  const translated = poe1StatTextsKo[source] || getPoe1StatTextsByNormalized().get(normalizeNinjaStatText(source));
  if (!translated) return source;
  let valueIndex = 0;
  return translated.replace(/#/g, () => values[valueIndex++] ?? '#');
}

function translateNinjaText(text, realm = settings.tradeRealm) {
  const source = String(text || '').trim();
  if (normalizeTradeRealm(realm) !== TRADE_REALM_POE1) return source;
  return poe1ItemNamesKo?.[source] || NINJA_VARIANT_NAMES_KO[source] || translatePoe1NinjaStatText(source);
}

function translateNinjaVariant(variant, realm = settings.tradeRealm) {
  return String(variant || '')
    .split(',')
    .map(part => {
      const value = part.trim();
      const flaskMatch = value.match(/^(\d+) Flasks?$/i);
      if (flaskMatch) return `플라스크 ${flaskMatch[1]}개`;
      const passiveMatch = value.match(/^(\d+) passives?$/i);
      if (passiveMatch) return `패시브 ${passiveMatch[1]}개`;
      return translateNinjaText(value, realm);
    })
    .filter(Boolean)
    .join(' · ');
}

function getNinjaModifierText(modifier, realm) {
  const text = typeof modifier === 'string' ? modifier : modifier?.text;
  return translateNinjaText(text, realm);
}

function renderNinjaModifierSection(title, modifiers, className, realm) {
  const texts = (Array.isArray(modifiers) ? modifiers : [])
    .map(modifier => getNinjaModifierText(modifier, realm))
    .filter(Boolean);
  if (!texts.length) return '';
  return `
    <div class="ninja-tooltip-section ${className}">
      <div class="ninja-tooltip-section-title">${esc(title)}</div>
      ${texts.map(text => `<div class="ninja-tooltip-mod">${esc(text)}</div>`).join('')}
    </div>
  `;
}

function renderNinjaEffectLines(effectText) {
  return String(effectText || '')
    .split(/\r?\n/)
    .filter(Boolean)
    .map(text => {
      const separator = text.indexOf(':');
      if (separator <= 0) return `<div class="ninja-tooltip-effect">${esc(text)}</div>`;
      const label = text.slice(0, separator);
      const description = text.slice(separator + 1).trim();
      return `<div class="ninja-tooltip-effect"><span class="ninja-tooltip-effect-label">${esc(label)}</span><span>${esc(description)}</span></div>`;
    })
    .join('');
}

function hasNinjaTooltipDetails(line, info, realm = settings.tradeRealm) {
  const modifierFields = ['implicitModifiers', 'explicitModifiers', 'mutatedModifiers'];
  if (modifierFields.some(field => (line?.[field] || info?.[field] || []).length > 0)) return true;
  if (line?.metadata?.passiveName || info?.metadata?.passiveName) return true;
  const cardDetails = getNinjaDivinationCardDetails(line, info, realm);
  if (cardDetails?.stackSize || cardDetails?.reward) return true;
  if (getNinjaEffectText(line, info, realm)) return true;
  const itemType = String(line?.itemType || info?.itemType || '').toLowerCase();
  const isEquipmentOrJewel = /(weapon|armour|armor|shield|quiver|helmet|glove|boot|belt|ring|amulet|jewel|flask)/.test(itemType);
  return isEquipmentOrJewel && !!(line?.variant || info?.variant);
}

function buildNinjaTooltipHtml(line, info, realm, priceText, imagePath) {
  const name = getNinjaLineName(line, info, realm);
  const baseType = translateNinjaText(line?.baseType || info?.baseType || '', realm);
  const variant = translateNinjaVariant(line?.variant || info?.variant || '', realm);
  const levelRequired = Number(line?.levelRequired ?? info?.levelRequired);
  const listingCount = Number(line?.listingCount ?? info?.listingCount);
  const sampleCount = Number(line?.count ?? info?.count);
  const implicitModifiers = line?.implicitModifiers || info?.implicitModifiers || [];
  const explicitModifiers = line?.explicitModifiers || info?.explicitModifiers || [];
  const mutatedModifiers = line?.mutatedModifiers || info?.mutatedModifiers || [];
  const metadata = line?.metadata || info?.metadata || {};
  const passiveName = translateNinjaText(metadata.passiveName || '', realm);
  const passiveContext = [metadata.baseClass, metadata.ascendancy].filter(Boolean).join(' · ');
  const cardDetails = getNinjaDivinationCardDetails(line, info, realm);
  const rawEffectText = getNinjaEffectText(line, info, realm);
  const effectText = cardDetails?.reward ? '' : rawEffectText;
  const hasModifiers = implicitModifiers.length || explicitModifiers.length || mutatedModifiers.length;
  const hasDetails = hasModifiers || passiveName || variant || effectText || cardDetails?.stackSize || cardDetails?.reward;
  const meta = [];
  if (baseType && baseType !== name) meta.push(baseType);
  if (Number.isFinite(levelRequired) && levelRequired > 0) meta.push(`요구 레벨 ${levelRequired}`);

  return `
    <div class="ninja-tooltip-head">
      ${imagePath ? `<img class="ninja-tooltip-icon" src="${esc(resolveNinjaImageUrl(imagePath))}" alt="">` : ''}
      <div class="ninja-tooltip-title-wrap">
        <div class="ninja-tooltip-title${hasModifiers ? ' unique' : ''}">${esc(name)}</div>
        ${meta.length ? `<div class="ninja-tooltip-meta">${esc(meta.join(' · '))}</div>` : ''}
        ${variant ? `<div class="ninja-tooltip-variant">${esc(variant)}</div>` : ''}
      </div>
      <div class="ninja-tooltip-price">${esc(priceText)}</div>
    </div>
    <div class="ninja-tooltip-body">
      ${renderNinjaModifierSection('고정 속성', implicitModifiers, 'implicit', realm)}
      ${renderNinjaModifierSection('아이템 속성', explicitModifiers, 'explicit', realm)}
      ${renderNinjaModifierSection('삿된 혈통 속성', mutatedModifiers, 'mutated', realm)}
      ${cardDetails?.stackSize || cardDetails?.reward ? `
        <div class="ninja-tooltip-section effect">
          <div class="ninja-tooltip-section-title">점술 카드 교환</div>
          ${cardDetails.stackSize ? `<div class="ninja-tooltip-effect"><span class="ninja-tooltip-effect-label">완성 스택</span><span>${cardDetails.stackSize.toLocaleString('ko-KR')}장</span></div>` : ''}
          ${cardDetails.reward ? `<div class="ninja-tooltip-effect"><span class="ninja-tooltip-effect-label">교환 보상</span><span>${esc(cardDetails.reward)}</span></div>` : ''}
        </div>
      ` : ''}
      ${effectText ? `
        <div class="ninja-tooltip-section effect">
          <div class="ninja-tooltip-section-title">사용 효과</div>
          ${renderNinjaEffectLines(effectText)}
        </div>
      ` : ''}
      ${passiveName ? `
        <div class="ninja-tooltip-section passive">
          <div class="ninja-tooltip-section-title">할당 패시브${passiveContext ? ` · ${esc(passiveContext)}` : ''}</div>
          <div class="ninja-tooltip-mod">${esc(passiveName)}</div>
        </div>
      ` : ''}
      ${!hasDetails ? '<div class="ninja-tooltip-empty">상세 옵션 없음</div>' : ''}
      <div class="ninja-tooltip-market">
        ${Number.isFinite(listingCount) && listingCount > 0 ? `<span>매물 ${listingCount.toLocaleString('ko-KR')}개</span>` : ''}
        ${Number.isFinite(sampleCount) && sampleCount > 0 ? `<span>표본 ${sampleCount.toLocaleString('ko-KR')}개</span>` : ''}
      </div>
    </div>
  `;
}

function hideNinjaTooltip() {
  cancelNinjaTooltipHide();
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'POE2TQ_NINJA_TOOLTIP', action: 'hide' }, '*');
  }
  const tooltip = document.getElementById('ninja-item-tooltip');
  if (tooltip) tooltip.hidden = true;
}

let ninjaTooltipHideTimer = null;
let ninjaTooltipPointer = null;
let ninjaTooltipScrollFrame = 0;

function cancelNinjaTooltipHide() {
  if (!ninjaTooltipHideTimer) return;
  clearTimeout(ninjaTooltipHideTimer);
  ninjaTooltipHideTimer = null;
}

function scheduleNinjaTooltipHide() {
  cancelNinjaTooltipHide();
  ninjaTooltipHideTimer = setTimeout(() => {
    ninjaTooltipHideTimer = null;
    hideNinjaTooltip();
  }, 500);
}

function refreshNinjaTooltipUnderPointer(container) {
  ninjaTooltipScrollFrame = 0;
  if (!ninjaTooltipPointer) {
    hideNinjaTooltip();
    return;
  }
  const target = document.elementFromPoint(ninjaTooltipPointer.x, ninjaTooltipPointer.y);
  const row = target?.closest?.('.ninja-row.has-tooltip');
  if (!row || !container.contains(row) || typeof row.__poe2tqShowNinjaTooltip !== 'function') {
    hideNinjaTooltip();
    return;
  }
  row.__poe2tqShowNinjaTooltip();
}

function scheduleNinjaTooltipRefresh(container) {
  if (ninjaTooltipScrollFrame) cancelAnimationFrame(ninjaTooltipScrollFrame);
  ninjaTooltipScrollFrame = requestAnimationFrame(() => refreshNinjaTooltipUnderPointer(container));
}

function positionNinjaTooltip(tooltip, row) {
  const rowRect = row.getBoundingClientRect();
  const margin = 8;
  const gap = 6;
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const width = Math.min(500, Math.max(280, viewportWidth - margin * 2));
  tooltip.style.width = `${width}px`;
  tooltip.style.left = `${Math.max(margin, Math.min(rowRect.left, viewportWidth - width - margin))}px`;
  const height = tooltip.offsetHeight;
  const below = rowRect.bottom + gap;
  const above = rowRect.top - height - gap;
  const top = below + height <= viewportHeight - margin ? below : Math.max(margin, above);
  tooltip.style.top = `${top}px`;
}

function showNinjaTooltip(row, line, info, realm, priceText, imagePath) {
  if (!hasNinjaTooltipDetails(line, info, realm)) return;
  cancelNinjaTooltipHide();
  const html = buildNinjaTooltipHtml(line, info, realm, priceText, imagePath);
  if (window.parent && window.parent !== window) {
    const rowRect = row.getBoundingClientRect();
    window.parent.postMessage({
      type: 'POE2TQ_NINJA_TOOLTIP',
      action: 'show',
      html,
      anchorRatio: Math.max(0, Math.min(1, rowRect.top / Math.max(window.innerHeight, 1)))
    }, '*');
    return;
  }
  const tooltip = document.getElementById('ninja-item-tooltip');
  if (!tooltip) return;
  if (!tooltip.dataset.hoverBound) {
    tooltip.addEventListener('mouseenter', cancelNinjaTooltipHide);
    tooltip.addEventListener('mouseleave', hideNinjaTooltip);
    tooltip.dataset.hoverBound = 'true';
  }
  tooltip.innerHTML = html;
  tooltip.hidden = false;
  positionNinjaTooltip(tooltip, row);
}

function formatNinjaPriceInDivine(value, realm = settings.tradeRealm) {
  if (!(value > 0)) return '';
  if (value >= 1) return `${value.toFixed(value >= 10 ? 0 : 1)}div`;
  const normalizedRealm = normalizeTradeRealm(realm);
  const chaosRate = Number(currentTradeRates.chaos);
  if (normalizedRealm === TRADE_REALM_POE1 && isFinite(chaosRate) && chaosRate > 0) {
    const chaosValue = value * chaosRate;
    return `${chaosValue >= 10 ? Math.round(chaosValue) : chaosValue.toFixed(1)}c`;
  }
  if (currentExRate) {
    const exVal = value * currentExRate;
    return `${exVal >= 10 ? Math.round(exVal) : exVal.toFixed(1)}ex`;
  }
  return `1div=${Math.round(1 / value)}개`;
}

function syncNinjaRatesFromData(data, realm = settings.tradeRealm) {
  const rates = POE2TQTradeCompat.buildRatesPerDivine(normalizeTradeRealm(realm), data);
  if (!rates || Object.keys(rates).length <= 1) return;
  currentTradeRates = rates;
  const exRate = Number(rates.exalted);
  if (isFinite(exRate) && exRate > 0) currentExRate = exRate;
}

function renderNinjaFilteredRows(query = '') {
  const container = document.getElementById('ninja-currency-list');
  if (!container) return;
  hideNinjaTooltip();
  const matches = query
    ? ninjaRenderedItems.filter(item => item.searchText.includes(query))
    : ninjaRenderedItems;
  const visible = matches.slice(0, NINJA_VISIBLE_ROW_LIMIT);
  const fragment = document.createDocumentFragment();
  visible.forEach(item => {
    const row = document.createElement('div');
    row.className = `ninja-row${item.hasTooltip ? ' has-tooltip' : ''}`;
    if (item.hasTooltip) row.tabIndex = 0;
    row.innerHTML = `
      <img class="ninja-icon" alt="" style="display:none">
      <span class="ninja-label-wrap">
        <span class="ninja-name">${esc(item.name)}</span>
        ${item.variant ? `<span class="ninja-row-variant">${esc(item.variant)}</span>` : ''}
      </span>
      <span class="ninja-div">${item.priceText}</span>
    `;
    const img = row.querySelector('img');
    if (item.imagePath) {
      img.style.display = '';
      loadNinjaImage(img, item.imagePath);
    }
    if (item.hasTooltip) {
      row.__poe2tqShowNinjaTooltip = () => showNinjaTooltip(
        row,
        item.line,
        item.info,
        item.realm,
        item.priceText,
        item.imagePath
      );
      row.addEventListener('mouseenter', row.__poe2tqShowNinjaTooltip);
      row.addEventListener('mouseleave', scheduleNinjaTooltipHide);
      row.addEventListener('focus', row.__poe2tqShowNinjaTooltip);
      row.addEventListener('blur', scheduleNinjaTooltipHide);
      row.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          hideNinjaTooltip();
          row.blur();
        }
      });
    }
    fragment.appendChild(row);
  });
  if (!visible.length) {
    const empty = document.createElement('div');
    empty.className = 'ninja-loading';
    empty.textContent = '검색 결과가 없습니다.';
    fragment.appendChild(empty);
  } else if (matches.length > visible.length) {
    const count = document.createElement('div');
    count.className = 'ninja-result-limit';
    count.textContent = `${matches.length.toLocaleString('ko-KR')}개 중 상위 ${visible.length.toLocaleString('ko-KR')}개 표시`;
    fragment.appendChild(count);
  }
  container.replaceChildren(fragment);
  container.scrollTop = 0;
}

function renderNinjaRates(data, realm = settings.tradeRealm) {
  const container = document.getElementById('ninja-currency-list');
  if (!container) return;
  hideNinjaTooltip();
  container.innerHTML = '';
  if (!container.dataset.tooltipScrollBound) {
    container.addEventListener('pointermove', event => {
      ninjaTooltipPointer = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    container.addEventListener('pointerleave', () => {
      ninjaTooltipPointer = null;
    }, { passive: true });
    container.addEventListener('scroll', () => scheduleNinjaTooltipRefresh(container), { passive: true });
    container.dataset.tooltipScrollBound = 'true';
  }

  const updated = document.getElementById('ninja-last-updated');
  if (updated) updated.textContent = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'}) + ' 기준';

  // withItems=true 파라미터로 최상위 items 배열에 모든 카테고리 아이템 이미지 포함됨.
  // 없는 경우 core.items(Currency 전용)로 폴백.
  const items = data.items || data.core?.items || [];
  const lines = data.lines || [];

  if (lines.length === 0) {
    ninjaRenderedItems = [];
    container.innerHTML = '<div style="padding:12px;color:#806040;text-align:center;">데이터 없음</div>';
    return;
  }

  // id → {name, image} 맵 빌드
  const itemMap = {};
  items.forEach(item => { itemMap[item.id] = item; });

  const sorted = [...lines].sort((a, b) => {
    const aValue = POE2TQTradeCompat.getLineValueInDivine(realm, a, data) || 0;
    const bValue = POE2TQTradeCompat.getLineValueInDivine(realm, b, data) || 0;
    return bValue - aValue;
  });

  ninjaRenderedItems = sorted.map(line => {
    const info = itemMap[line.id] || {};
    const name = getNinjaLineName(line, info, realm);
    const rawName = getNinjaRawName(line, info);
    const imagePath = getNinjaLineImage(line, info);
    const value = POE2TQTradeCompat.getLineValueInDivine(realm, line, data);
    if (!value && value !== 0) return null;

    const priceText = formatNinjaPriceInDivine(value, realm);
    if (!priceText) return null;
    const variant = translateNinjaVariant(line?.variant || info?.variant || '', realm);
    const hasTooltip = hasNinjaTooltipDetails(line, info, realm);
    return {
      line,
      info,
      realm,
      name,
      variant,
      imagePath,
      priceText,
      hasTooltip,
      searchText: `${name} ${rawName} ${variant}`.toLowerCase()
    };
  }).filter(Boolean);

  applyNinjaSearch();
}

function updateRateBadge(data, realm = settings.tradeRealm, league = settings.league || 'Standard') {
  const badge = document.getElementById('ninja-rate-badge');
  if (!badge) return;
  const normalizedRealm = normalizeTradeRealm(realm);
  const rates = POE2TQTradeCompat.buildRatesPerDivine(normalizedRealm, data);
  const exRate = Number(rates.exalted);
  const chaosRate = Number(rates.chaos);
  currentTradeRates = rates;
  currentExRate = isFinite(exRate) && exRate > 0 ? exRate : null;
  chrome.storage.local.get([TRADE_RATE_KEY]).then(existing => {
    const previous = existing?.[TRADE_RATE_KEY];
    const byRealm = previous && (previous[TRADE_REALM_POE1] || previous[TRADE_REALM_POE2]) ? previous : {};
    return chrome.storage.local.set({
      [TRADE_RATE_KEY]: {
        ...byRealm,
        [normalizedRealm]: {
          rates,
          updatedAt: new Date().toISOString(),
          league,
          tradeRealm: normalizedRealm
        }
      }
    });
  }).catch(() => {});
  if (currentExRate) {
    badge.textContent = `1div = ${currentExRate.toFixed(currentExRate >= 100 ? 0 : 1)}ex`;
    badge.style.display = '';
    render();
  } else if (isFinite(chaosRate) && chaosRate > 0) {
    badge.textContent = `1div = ${chaosRate.toFixed(chaosRate >= 100 ? 0 : 1)}c`;
    badge.style.display = '';
    render();
  } else {
    badge.style.display = 'none';
  }
}
