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

const KR_TRADE_BASE = 'https://poe.kakaogames.com/trade2/search/poe2';
const KR_API_BASE = 'https://poe.kakaogames.com/api/trade2';
const KR_API_SEARCH = (l) => `${KR_API_BASE}/search/poe2/${l}`;
const DEFAULT_LEAGUE = 'Runes of Aldur';
const DEFAULT_BUILD_NAME = '기본 빌드';
const KNOWN_LEAGUES = ['Runes of Aldur', 'HC Runes of Aldur', 'Standard', 'Hardcore'];
const LEAGUE_ALIASES = { 'Rune of Aldur': 'Runes of Aldur', 'Hardcore Rune of Aldur': 'HC Runes of Aldur' };
const ADMIN_ACCESS_KEY = 'adminAccess';
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
let settings = { league: DEFAULT_LEAGUE, resultCount: 10, allowGlobalSidebar: false };
let adminAccess = { enabled: false, keyId: '' };
let editingId = null;

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
  const category = String(f?.category || '').toLowerCase();
  const s = getFilterSearchText(f);
  if (/(tablet|slate|waystone|map|ritual|abyss|expedition|sanctum|breach|delirium|서판|지도|의식|심연|탐험|사원|균열|환영)/i.test(s)) {
    return 'slate';
  }
  if (
    /^(weapon|armour|accessory)\./.test(category)
    || /^(jewel|flask)$/.test(category)
    || /(helmet|gloves|boots|belt|ring|amulet|quiver|shield|focus|buckler|wand|sceptre|spear|flail|claw|dagger|sword|axe|mace|staff|crossbow|활|반지|목걸이|장갑|투구|장화|갑옷|방패|주얼|플라스크)/i.test(s)
  ) {
    return 'equipment';
  }
  return '';
}

const getCurrentFilters = () => filtersByLeague[settings.league] || [];
const setCurrentFilters = (arr) => { filtersByLeague[settings.league] = arr; };
const getCurrentBuilds = () => buildsByLeague[settings.league] || [];
const setCurrentBuilds = (arr) => { buildsByLeague[settings.league] = arr; };
const getCurrentBuildUi = () => {
  if (!buildUiByLeague[settings.league]) buildUiByLeague[settings.league] = {};
  return buildUiByLeague[settings.league];
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

function makeBuild(name) {
  const equipTab = makeBuildTab('장비', 'equipment', 'equipment');
  const slateTab = makeBuildTab('서판', 'slate', 'slate');
  return {
    id: makeId('build'),
    name: name || `새 빌드 ${getCurrentBuilds().length + 1}`,
    tabs: [equipTab, slateTab],
    activeTabId: equipTab.id,
    savedAt: new Date().toISOString()
  };
}

function normalizeBuildTab(tab, idx) {
  if (!tab || typeof tab !== 'object') return null;
  const type = tab.type || (tab.key === 'equipment' ? 'equipment' : tab.key === 'slate' ? 'slate' : 'custom');
  const key = tab.key || (type === 'equipment' ? 'equipment' : type === 'slate' ? 'slate' : '');
  return {
    id: tab.id || makeId(type || `tab${idx}`),
    key,
    type,
    name: String(tab.name || (key === 'equipment' ? '장비' : key === 'slate' ? '서판' : `탭 ${idx + 1}`)),
    filterIds: Array.from(new Set(Array.isArray(tab.filterIds) ? tab.filterIds.map(String) : []))
  };
}

function normalizeBuild(build, idx) {
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

  const equipTab = ensureMandatory('equipment', '장비', 'equipment');
  const slateTab = ensureMandatory('slate', '서판', 'slate');
  const customTabs = tabs.filter(tab => tab.id !== equipTab.id && tab.id !== slateTab.id);
  tabs = [equipTab, slateTab].concat(customTabs);

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
  const filters = filtersByLeague[league] || [];
  const ui = buildUiByLeague[league] || (buildUiByLeague[league] = {});
  let builds = (buildsByLeague[league] || []).map((build, idx) => normalizeBuild(build, idx)).filter(Boolean);
  let changed = false;

  if (!builds.length) {
    const baseBuild = makeBuild(DEFAULT_BUILD_NAME);
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
    const mandatoryTabs = new Map(
      build.tabs
        .filter(tab => tab.key === 'equipment' || tab.key === 'slate')
        .map(tab => [tab.key, tab])
    );
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

  buildsByLeague[league] = builds;
  buildUiByLeague[league] = ui;
  return changed;
}

function buildQuerySignature(filter) {
  return JSON.stringify({
    category: filter.category || '',
    rarity: filter.rarity || '',
    typeLine: filter.typeLineActive === false ? '' : (filter.typeLine || ''),
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
    category: filter?.category || '',
    rarity: filter?.rarity || '',
    typeLine: filter?.typeLine || '',
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
  if (!filter.typeLine) filter.typeLine = '';
  if (filter.typeLineActive == null) filter.typeLineActive = true;
  if (/거래소 검색조건에서 저장/.test(filter.note || '')) {
    if (!filter.tradeStatusOption) filter.tradeStatusOption = 'any';
    if (!Object.prototype.hasOwnProperty.call(filter, 'tradeSaleTypeActive')) {
      filter.tradeSaleTypeActive = false;
    }
    if (filter.tradeSaleTypeOption == null) filter.tradeSaleTypeOption = '';
  }
  filter.equipment = Array.isArray(filter.equipment) ? filter.equipment : [];
  filter.stats = Array.isArray(filter.stats) ? filter.stats : [];
  filter.equipment.forEach(e => {
    if (!e) return;
    if (e.active == null) e.active = true;
    if (e.max === undefined) e.max = null;
    if (numberOrNull(e.min) == null && numberOrNull(e.max) == null && e.value != null && isFinite(Number(e.value))) {
      e.min = roundFilterNumber(e.value);
    }
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
  render();
  bindTabs();
  bindHeader();
  bindModal();
  bindSettings();
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
      settings = { ...settings, ...(changes.settings.newValue || {}) };
      document.getElementById('leagueBadge').textContent = settings.league;
      document.getElementById('sLeague').value = settings.league;
      document.getElementById('sCount').value = settings.resultCount;
      const allowGlobalSidebar = document.getElementById('sAllowGlobalSidebar');
      if (allowGlobalSidebar) allowGlobalSidebar.checked = !!settings.allowGlobalSidebar;
      needsRender = true;
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
  bindRegexGenerator();
  document.getElementById('ninja-rate-badge').addEventListener('click', () => switchTopTab('economy'));
  document.getElementById('ninja-refresh-btn').addEventListener('click', () => loadNinjaRates());

  // 카테고리 탭 초기 렌더
  renderNinjaCategoryTabs();

  // Economy 탭 검색창 이벤트
  const ninjaSearchEl = document.getElementById('ninja-search');
  if (ninjaSearchEl) {
    ninjaSearchEl.addEventListener('input', applyNinjaSearch);
  }

  // 환율 배지 초기 로드 (백그라운드)
  setTimeout(() => loadNinjaRates(), 1000);
}

async function loadData() {
  const r = await chrome.storage.local.get(['filters', 'filtersByLeague', 'buildsByLeague', 'buildUiByLeague', 'settings', ADMIN_ACCESS_KEY]);
  if (r.settings) settings = { ...settings, ...r.settings };
  adminAccess = normalizeAdminAccess(r[ADMIN_ACCESS_KEY]);
  filtersByLeague = r.filtersByLeague || {};
  buildsByLeague = r.buildsByLeague || {};
  buildUiByLeague = r.buildUiByLeague || {};
  if (Array.isArray(r.filters) && r.filters.length && !r.filtersByLeague) {
    filtersByLeague[settings.league] = r.filters;
    await chrome.storage.local.set({ filtersByLeague });
    await chrome.storage.local.remove('filters');
  }
  let migrated = false;
  if (LEAGUE_ALIASES[settings.league]) {
    settings.league = LEAGUE_ALIASES[settings.league];
    migrated = true;
  }
  for (const oldName of Object.keys(LEAGUE_ALIASES)) {
    if (filtersByLeague[oldName]) {
      const newName = LEAGUE_ALIASES[oldName];
      const existing = filtersByLeague[newName] || [];
      filtersByLeague[newName] = existing.concat(filtersByLeague[oldName]);
      delete filtersByLeague[oldName];
      migrated = true;
    }
    if (buildsByLeague[oldName]) {
      const newName = LEAGUE_ALIASES[oldName];
      const existingBuilds = buildsByLeague[newName] || [];
      buildsByLeague[newName] = existingBuilds.concat(buildsByLeague[oldName]);
      delete buildsByLeague[oldName];
      migrated = true;
    }
    if (buildUiByLeague[oldName]) {
      const newName = LEAGUE_ALIASES[oldName];
      buildUiByLeague[newName] = { ...(buildUiByLeague[newName] || {}), ...(buildUiByLeague[oldName] || {}) };
      delete buildUiByLeague[oldName];
      migrated = true;
    }
  }
  Object.keys(filtersByLeague).forEach(league => {
    filtersByLeague[league] = (filtersByLeague[league] || []).map(normalizeSavedFilter);
  });
  Object.keys(buildsByLeague).forEach(league => {
    buildsByLeague[league] = (buildsByLeague[league] || []).map(normalizeBuild).filter(Boolean);
  });
  const leagues = Array.from(new Set([...Object.keys(filtersByLeague), ...Object.keys(buildsByLeague), settings.league]));
  leagues.forEach(league => {
    ensureBuildDataForLeague(league);
    pruneDeletedFilterRefs(league);
  });
  await chrome.storage.local.set({ filtersByLeague, buildsByLeague, buildUiByLeague, settings });
  document.getElementById('sLeague').value = settings.league;
  document.getElementById('sCount').value = settings.resultCount;
  const allowGlobalSidebar = document.getElementById('sAllowGlobalSidebar');
  if (allowGlobalSidebar) allowGlobalSidebar.checked = !!settings.allowGlobalSidebar;
  document.getElementById('leagueBadge').textContent = settings.league;
}

const persist = () => chrome.storage.local.set({ filtersByLeague, buildsByLeague, buildUiByLeague, settings });
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
  const validIds = new Set((filtersByLeague[league] || []).map(filter => String(filter.id)));
  let changed = false;
  (buildsByLeague[league] || []).forEach(build => {
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
  if (currency === 'exalted' && currentExRate && isFinite(currentExRate) && currentExRate > 0) {
    return amount / currentExRate;
  }
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
        const isLocked = tab.key === 'equipment' || tab.key === 'slate';
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
  if (tab.key === 'equipment' || tab.key === 'slate') return;
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
  if (currency === 'exalted' && currentExRate && isFinite(currentExRate) && currentExRate > 0) return amount / currentExRate;
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
    const opts = build.tabs.map(tab => {
      const isCurrent = build.id === currentBuildId && tab.id === currentTabId;
      return `<option value="${build.id}:${tab.id}" ${isCurrent ? 'selected' : ''}>${esc(tab.name)}</option>`;
    }).join('');
    return `<optgroup label="${esc(build.name)}">${opts}</optgroup>`;
  }).join('');

  const rarityClass = {rare:'badge-rare',unique:'badge-unique',magic:'badge-magic'}[f.rarity] || '';
  const rarityColor = {rare:'#f0c830',unique:'#af6025',magic:'#8888ff',normal:'#c8c8c8'}[f.rarity] || '#c8b98a';
  const catLabel = f.category ? f.category.split('.').pop() : '';

  const summary = [];
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
      ${allBuildsForMove.length > 0 ? `<select class="build-move-select" data-move-filter="${f.id}" title="빌드/탭으로 이동">${moveOptions}</select>` : ''}
    </div>

    <div class="card-detail">
      ${baseChips ? `<div class="base-info">${baseChips}</div>` : ''}
      ${equipmentRows ? `<div class="stat-table">
        <div class="stat-table-title">장비 조건 (원본값 → min / max)</div>
        ${equipmentRows}
      </div>` : ''}
      ${statRows ? `<div class="stat-table">
        <div class="stat-table-title">스탯 조건 (원본값 → min / max)</div>
        ${statRows}
      </div>` : ''}
      <div id="result-${f.id}"></div>
    </div>
  `;

  wrap.querySelector('.filter-card-head').addEventListener('click', e => {
    if (e.target.closest('.filter-drag-handle, .cat-badge, .stat-delete-btn, .stat-min-value, .stat-max-value, .equip-min-value, .equip-max-value, .filter-name-edit, .type-line-badge, .btn-delete-small, button')) return;
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
    moveSelect.addEventListener('click', e => e.stopPropagation());
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
  let query = null;
  let querySource = '';
  try {
    const hydrated = await hydrateTradeQueryTemplate(f);
    searchLeague = f.league || settings.league;
    query = buildQuery(f);
    querySource = f.tradeQueryTemplate ? 'trade-query-template' : 'assembled-filter';
    appendSidepanelDebugLog({
      kind: 'search-diagnostic',
      league: searchLeague,
      filterId: f.id,
      filterName: f.name,
      hydratedTradeQueryTemplate: hydrated,
      querySource,
      filterSummary: summarizeFilterForDebug(f),
      querySummary: summarizeTradeQueryForDebug(query.query),
      query
    });
    const res = await fetch(KR_API_SEARCH(encodeURIComponent(searchLeague)), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `HTTP ${res.status}`);
    }
    const sData = await res.json();
    if (!sData.id) throw new Error('검색 ID를 받지 못했습니다');
    appendSidepanelDebugLog({
      kind: 'search-result',
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
        const fetchRes = await fetch(`${KR_API_BASE}/fetch/${topIds.map(encodeURIComponent).join(',')}?query=${encodeURIComponent(sData.id)}&realm=poe2`);
        if (fetchRes.ok) {
          const fetchData = await fetchRes.json();
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
    const url = `${KR_TRADE_BASE}/${encodeURIComponent(searchLeague)}/${sData.id}`;
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
    appendSidepanelDebugLog({
      kind: 'search-error',
      league: searchLeague,
      filterId: f.id,
      filterName: f.name,
      querySource,
      message: err.message,
      filterSummary: summarizeFilterForDebug(f),
      querySummary: query?.query ? summarizeTradeQueryForDebug(query.query) : null,
      query
    });
    rd.innerHTML = `<div class="result-area"><div class="result-error">⚠️ ${esc(err.message)}</div></div>`;
  } finally {
    if (btnNew) { btnNew.classList.remove('loading'); btnNew.disabled = false; btnNew.innerHTML = '🔍 새창'; }
    if (btnCur) { btnCur.classList.remove('loading'); btnCur.disabled = false; btnCur.innerHTML = '🔗 현재창'; }
  }
}

function buildQuery(f) {
  const templateQuery = buildQueryFromTradeTemplate(f);
  if (templateQuery) return templateQuery;

  const statusOption = f.tradeStatusOption || 'securable';
  const q = { query:{ status:{ option: statusOption }, filters:{}, stats:[{type:'and',filters:[]}] }, sort:{price:'asc'} };
  const tf = {};
  if (f.rarity)   tf.rarity   = { option: f.rarity };
  if (f.category) tf.category = { option: f.category };
  if (f.typeLine && f.typeLineActive !== false) tf.type = { option: f.typeLine };
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

  const equipmentFilters = {};
  (f.equipment || []).forEach(e => {
    if (e.active === false || !e.id) return;
    const min = numberOrNull(e.min);
    const max = numberOrNull(e.max);
    const value = {};
    if (min != null && min > 0) value.min = min;
    if (max != null && max > 0) value.max = max;
    if (!Object.keys(value).length) return;
    equipmentFilters[e.id] = value;
  });
  if (Object.keys(equipmentFilters).length) q.query.filters.equipment_filters = { filters: equipmentFilters };

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

function buildQueryFromTradeTemplate(f) {
  const query = cloneJsonSafe(f.tradeQueryTemplate);
  if (!query || typeof query !== 'object') return null;
  applyFilterStatsToTradeQuery(query, f);
  applyFilterEquipmentToTradeQuery(query, f);
  return { query, sort: { price: 'asc' } };
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
  const equipmentById = new Map();
  (filter.equipment || []).forEach(entry => {
    if (entry?.id) equipmentById.set(entry.id, entry);
  });

  const equipmentFilters = query.filters?.equipment_filters?.filters || {};
  Object.keys(equipmentFilters).forEach(id => {
    const entry = equipmentById.get(id);
    if (!entry) return;
    const minVal = numberOrNull(entry.min);
    const maxVal = numberOrNull(entry.max);
    const value = {};
    if (minVal != null && minVal > 0) value.min = minVal;
    if (maxVal != null && maxVal > 0) value.max = maxVal;
    if (Object.keys(value).length) {
      equipmentFilters[id] = value;
    }
  });
}

function parseSavedTradeQueryInfo(filter) {
  const note = String(filter?.note || '');
  const m = note.match(/거래소 검색조건에서 저장\s*\((.*),\s*([^)]+)\)/);
  return {
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

  const url = `${KR_API_BASE}/search/poe2/${encodeURIComponent(info.league)}/${encodeURIComponent(info.queryId)}`;
  let payload = null;
  try {
    const res = await fetch(url, { credentials: 'include' });
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
    payload = await res.json();
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
  filter.tradeQueryTemplate = cloneJsonSafe(query);
  filter.tradeStatusOption = query.status?.option || filter.tradeStatusOption || '';
  filter.tradeSaleTypeActive = !!queryFilters.trade_filters?.filters?.sale_type;
  filter.tradeSaleTypeOption = queryFilters.trade_filters?.filters?.sale_type?.option || '';
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
    chrome.tabs.create({ url:`${KR_TRADE_BASE}/${encodeURIComponent(settings.league)}` });
  });
  document.getElementById('leagueBadge').addEventListener('click', () => {
    const cur = settings.league;
    const idx = KNOWN_LEAGUES.indexOf(cur);
    const next = KNOWN_LEAGUES[(idx + 1) % KNOWN_LEAGUES.length];
    settings.league = next;
    ensureBuildDataForLeague(next);
    document.getElementById('leagueBadge').textContent = next;
    document.getElementById('sLeague').value = next;
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
  const leagueInput = document.getElementById('sLeague');
  const onLeagueChange = (val) => {
    const v = (val || '').trim();
    if (!v) return;
    settings.league = v;
    ensureBuildDataForLeague(v);
    document.getElementById('leagueBadge').textContent = v;
    leagueInput.value = v;
    persist();
    render();
  };
  leagueInput.addEventListener('change', e => onLeagueChange(e.target.value));
  leagueInput.addEventListener('blur',   e => onLeagueChange(e.target.value));
  document.getElementById('sCount').addEventListener('change', e => { settings.resultCount=parseInt(e.target.value); persist(); });
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
      if (d.filtersByLeague) {
        filtersByLeague = d.filtersByLeague;
      } else if (Array.isArray(d.filters)) {
        filtersByLeague = { [settings.league]: d.filters };
      }
      if (d.buildsByLeague) buildsByLeague = d.buildsByLeague;
      if (d.buildUiByLeague) buildUiByLeague = d.buildUiByLeague;
      if (d.settings) settings = { ...settings, ...d.settings };
    } else {
      const srcFilters = d.filtersByLeague || (Array.isArray(d.filters) ? { [settings.league]: d.filters } : {});
      for (const league of Object.keys(srcFilters)) {
        const existing = filtersByLeague[league] || [];
        const existingIds = new Set(existing.map(f => f.id));
        const newOnes = (srcFilters[league] || []).filter(f => !existingIds.has(f.id));
        filtersByLeague[league] = [...existing, ...newOnes];
      }
      for (const league of Object.keys(d.buildsByLeague || {})) {
        const existing = buildsByLeague[league] || [];
        const existingIds = new Set(existing.map(b => b.id));
        const newOnes = (d.buildsByLeague[league] || []).filter(b => !existingIds.has(b.id));
        buildsByLeague[league] = [...existing, ...newOnes];
      }
    }

    Object.keys(filtersByLeague).forEach(league => {
      filtersByLeague[league] = (filtersByLeague[league] || []).map(normalizeSavedFilter);
    });
    Object.keys(buildsByLeague).forEach(league => {
      buildsByLeague[league] = (buildsByLeague[league] || []).map(normalizeBuild).filter(Boolean);
    });
    const leagues = Array.from(new Set([...Object.keys(filtersByLeague), ...Object.keys(buildsByLeague), settings.league]));
    leagues.forEach(league => {
      ensureBuildDataForLeague(league);
      pruneDeletedFilterRefs(league);
    });
    persist(); render();
    document.getElementById('sLeague').value = settings.league;
    document.getElementById('leagueBadge').textContent = settings.league;
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
  const rows = document.querySelectorAll('#ninja-currency-list .ninja-row');
  rows.forEach(row => {
    const nameEl = row.querySelector('.ninja-name');
    const text = (nameEl?.textContent || '').toLowerCase();
    row.style.display = (!query || text.includes(query)) ? '' : 'none';
  });
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

let currentNinjaCategory = 'Currency';
let currentExRate = null;  // 1div = N ex (Currency 탭 로드 시 갱신)
let currentUtilityTab = 'expedition';
let passiveTreeData = null;   // passive-tree-ko-filled.json nodes
let passiveLiquids = {};      // { "Contempt": "경멸", ... }
let passiveLang = 'ko';       // 'ko' | 'en'
let passiveMode = 'search';   // 'search' | 'compare'
let passiveFullTreeData = null; // tree.json nodes (모든 노드 영문 이름+스탯)
let regexOptionFilter = 'all';
let regexUserPresets = [];
const regexOptionSelections = new Map();
const REGEX_PRESET_STORAGE_KEY = 'waystoneRegexPresets';

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
  rarity: { label: '아이템 희귀도', prefix: '귀도.*', includeHundreds: true },
  packSize: { label: '무리 규모', prefix: '^무.*', includeHundreds: false },
  monsterEfficiency: { label: '몬스터 효율', prefix: '몬스터.*효율.*', includeHundreds: true },
  monsterRarity: { label: '몬스터 희귀도', prefix: '몬스터.*희귀도.*', includeHundreds: true },
  waystoneChance: { label: '경로석 출현확률', prefix: '경로석.*출현.*확률.*', includeHundreds: true }
};

const WAYSTONE_REGEX_ITEMS = new Map();
WAYSTONE_REGEX_GROUPS.forEach(group => {
  group.items.forEach((item, index) => {
    WAYSTONE_REGEX_ITEMS.set(`${group.id}:${index}`, { ...item, groupId: group.id, groupTitle: group.title });
  });
});

function renderNinjaCategoryTabs() {
  const container = document.getElementById('ninja-category-tabs');
  if (!container) return;
  container.innerHTML = '';
  NINJA_CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'ninja-cat-btn' + (cat.type === currentNinjaCategory ? ' active' : '');
    btn.textContent = cat.label;
    btn.addEventListener('click', () => {
      currentNinjaCategory = cat.type;
      const searchEl = document.getElementById('ninja-search');
      if (searchEl) searchEl.value = '';
      renderNinjaCategoryTabs();
      refreshNinja();
    });
    container.appendChild(btn);
  });
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
  return regexOptionSelections.get(id) || 'none';
}

function getAllRegexOptions() {
  return Array.from(WAYSTONE_REGEX_ITEMS.entries()).map(([id, item]) => ({ id, ...item }));
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
  return `"${text.replace(/"/g, '')}"`;
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
  const includeHundreds = options.includeHundreds !== false;
  if (!isFinite(min) || min <= 0) return '';
  if (min < 10) {
    const parts = [`[${min}-9]`, '[1-9].'];
    if (includeHundreds) parts.push('1..');
    return `(${parts.join('|')})%`;
  }
  if (min < 100) {
    const tens = Math.floor(min / 10);
    const ones = min % 10;
    const parts = [];
    if (ones === 0) parts.push(`[${tens}-9].`);
    else {
      parts.push(`${tens}[${ones}-9]`);
      if (tens < 9) parts.push(`[${tens + 1}-9].`);
    }
    if (includeHundreds) parts.push('1..');
    return parts.length === 1 ? `${parts[0]}%` : `(${parts.join('|')})%`;
  }
  if (!includeHundreds) return '';
  if (min < 1000) {
    const hundreds = Math.floor(min / 100);
    const rest = min % 100;
    const tens = Math.floor(rest / 10);
    const ones = rest % 10;
    const parts = [];
    if (rest === 0) {
      parts.push(`${hundreds}..`);
    } else {
      parts.push(`${hundreds}${tens}[${ones}-9]`);
      if (tens < 9) parts.push(`${hundreds}[${tens + 1}-9].`);
    }
    if (hundreds < 9) parts.push(`[${hundreds + 1}-9]..`);
    return `(${parts.join('|')})%`;
  }
  const digits = String(min).length;
  return `[1-9]${'.'.repeat(Math.max(0, digits - 1))}%`;
}

function buildNumericStatRegex(stat, minValue) {
  const numberPattern = buildPercentAtLeastRegex(minValue, stat);
  if (!stat?.prefix || !numberPattern) return '';
  return `${stat.prefix}${numberPattern}`;
}

function getSelectedRegexOptionGroups() {
  const include = [];
  const exclude = [];
  WAYSTONE_REGEX_ITEMS.forEach((item, id) => {
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
    const stat = WAYSTONE_REGEX_NUMERIC_STATS[input.dataset.regexMin];
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
  if (lengthEl) lengthEl.textContent = `${regex.length}자`;
  if (countEl) countEl.textContent = `${getSelectedRegexPieces().length}개 선택`;
}

function resetRegexGenerator() {
  regexOptionSelections.clear();
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
  return numbers;
}

function getRegexSelectionState() {
  return Array.from(regexOptionSelections.entries())
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
  regexOptionSelections.clear();
  const mode = document.querySelector(`input[name="regex-mode"][value="${state?.mode === 'and' ? 'and' : 'or'}"]`);
  if (mode) mode.checked = true;
  document.querySelectorAll('[data-regex-min]').forEach(input => {
    input.value = state?.numbers?.[input.dataset.regexMin] || '';
  });
  (state?.selections || []).forEach(entry => {
    if (WAYSTONE_REGEX_ITEMS.has(entry.id) && (entry.state === 'include' || entry.state === 'exclude')) {
      regexOptionSelections.set(entry.id, entry.state);
    }
  });
  renderRegexOptions();
  updateRegexGenerator();
}

function makeRegexPresetId() {
  return `regex_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

async function loadRegexUserPresets() {
  const result = await chrome.storage.local.get(REGEX_PRESET_STORAGE_KEY).catch(() => ({}));
  regexUserPresets = Array.isArray(result[REGEX_PRESET_STORAGE_KEY]) ? result[REGEX_PRESET_STORAGE_KEY] : [];
  renderRegexUserPresets();
}

async function persistRegexUserPresets() {
  await chrome.storage.local.set({ [REGEX_PRESET_STORAGE_KEY]: regexUserPresets });
}

function renderRegexUserPresets() {
  const list = document.getElementById('regex-user-preset-list');
  const count = document.getElementById('regex-preset-count');
  if (count) count.textContent = `${regexUserPresets.length}개`;
  if (!list) return;
  if (!regexUserPresets.length) {
    list.innerHTML = '<div class="regex-result-empty">저장된 프리셋이 없습니다.</div>';
    return;
  }
  list.innerHTML = regexUserPresets.map(preset => `<div class="regex-preset-item">
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
  const existing = regexUserPresets.find(preset => preset.name === name);
  if (existing) {
    existing.state = state;
    existing.regex = regex;
    existing.updatedAt = new Date().toISOString();
  } else {
    regexUserPresets.push({
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
  const preset = regexUserPresets.find(item => item.id === id);
  if (!preset) return;
  applyRegexGeneratorState(preset.state || {});
}

async function deleteRegexPreset(id) {
  const preset = regexUserPresets.find(item => item.id === id);
  if (!preset) return;
  if (!confirm(`"${preset.name}" 프리셋을 삭제할까요?`)) return;
  regexUserPresets = regexUserPresets.filter(item => item.id !== id);
  await persistRegexUserPresets();
  renderRegexUserPresets();
}

function setRegexOptionState(id, state, rerender = true) {
  const next = state === 'include' || state === 'exclude' ? state : 'none';
  if (next === 'none') regexOptionSelections.delete(id);
  else regexOptionSelections.set(id, next);
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

function bindRegexGenerator() {
  renderRegexOptions();
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
  document.querySelectorAll('[data-regex-min]').forEach(input => {
    input.addEventListener('input', updateRegexGenerator);
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
  const validTabs = ['expedition', 'passive', 'regex'];
  const next = validTabs.includes(tabName) ? tabName : 'expedition';
  currentUtilityTab = next;
  document.querySelectorAll('[data-utility-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.utilityTab === next);
  });
  document.querySelectorAll('.utility-sub-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `utility-panel-${next}`);
  });
  if (next === 'expedition') {
    renderExpedition(document.getElementById('expedition-search')?.value || '');
  } else if (next === 'passive') {
    loadAndRenderPassive(document.getElementById('passive-search')?.value || '');
  } else {
    updateRegexGenerator();
  }
}

async function loadAndRenderPassive(query) {
  if (!passiveTreeData) {
    const countEl = document.getElementById('passive-count');
    if (countEl) countEl.textContent = '로딩 중...';
    try {
      const url = chrome.runtime.getURL('data/passive-tree-ko-csv-matched.json');
      const res = await fetch(url);
      const json = await res.json();
      passiveTreeData = json.nodes || {};
      passiveLiquids = json.liquids || {};
    } catch (e) {
      const countEl = document.getElementById('passive-count');
      if (countEl) countEl.textContent = '데이터 로드 실패';
      return;
    }
    bindPassiveControls();
  }
  renderPassive(query);
}

function bindPassiveControls() {
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
    btn.addEventListener('click', () => {
      passiveMode = btn.dataset.passiveMode;
      document.querySelectorAll('.passive-mode-btn').forEach(b => {
        const active = b === btn;
        b.style.borderBottomColor = active ? '#c8a84a' : 'transparent';
        b.style.color = active ? '#c8a84a' : '#888';
      });
      document.getElementById('passive-mode-search').style.display = passiveMode === 'search' ? '' : 'none';
      document.getElementById('passive-mode-compare').style.display = passiveMode === 'compare' ? '' : 'none';
    });
  });
  ['passive-xml-1', 'passive-xml-2'].forEach(id => {
    const fileEl = document.getElementById(id);
    const nameEl = document.getElementById(id + '-name');
    if (fileEl && !fileEl.dataset.bound) {
      fileEl.dataset.bound = '1';
      fileEl.addEventListener('change', () => {
        if (nameEl) nameEl.textContent = fileEl.files[0]?.name || '파일 선택...';
      });
    }
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
        const name = passiveLang === 'ko' ? (n.koName || n.enName) : (n.enName || n.koName);
        const altName = passiveLang === 'ko' ? (n.enName || '') : (n.koName || '');
        const stats = passiveLang === 'ko'
          ? (n.koStats || n.enStats || []).join(' ')
          : (n.enStats || n.koStats || []).join(' ');
        const recipe = (n.recipe || []).join(' ').toLowerCase();
        return name.toLowerCase().includes(q)
          || altName.toLowerCase().includes(q)
          || stats.toLowerCase().includes(q)
          || recipe.includes(q);
      })
    : nodes;

  if (countEl) countEl.textContent = `${filtered.length}개 / 전체 ${nodes.length}개`;

  if (filtered.length === 0) {
    listEl.innerHTML = '<div style="color:#666;text-align:center;padding:16px;font-size:12px;">검색 결과 없음</div>';
    return;
  }

  listEl.innerHTML = filtered.map(n => {
    const name = passiveLang === 'ko' ? (n.koName || n.enName || '') : (n.enName || n.koName || '');
    const altName = passiveLang === 'ko' ? (n.enName || '') : (n.koName || '');
    const stats = passiveLang === 'ko'
      ? (n.koStats || n.enStats || [])
      : (n.enStats || n.koStats || []);
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
    return `<div style="background:#181410;border:1px solid #2e2810;border-radius:5px;padding:7px 9px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;">
        <span style="color:#e8c84a;font-weight:600;font-size:12px;">${esc(name)}</span>
        ${altName ? `<span style="color:#666;font-size:10px;flex-shrink:0;">${esc(altName)}</span>` : ''}
      </div>
      ${statsHtml}
      ${recipeHtml}
    </div>`;
  }).join('');
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
    if (!passiveFullTreeData) {
      const url = chrome.runtime.getURL('data/tree.json');
      const res = await fetch(url);
      const json = await res.json();
      passiveFullTreeData = json.nodes || {};
    }
    const [text1, text2] = await Promise.all([file1.text(), file2.text()]);
    const parseNodes = xml => {
      const match = xml.match(/<Spec[^>]*\bnodes="([^"]+)"/);
      return match ? new Set(match[1].split(',').map(s => s.trim()).filter(Boolean)) : new Set();
    };
    const set1 = parseNodes(text1);
    const set2 = parseNodes(text2);
    const only1 = [...set1].filter(id => !set2.has(id));
    const only2 = [...set2].filter(id => !set1.has(id));
    const renderNodeCard = id => {
      const notable = passiveTreeData?.[id];
      const full = passiveFullTreeData?.[id];
      if (!notable && !full) {
        return `<div style="background:#181410;border:1px solid #2e2810;border-radius:5px;padding:5px 9px;"><span style="color:#555;font-size:11px;">알 수 없는 노드 (ID: ${esc(id)})</span></div>`;
      }
      const isKo = passiveLang === 'ko';
      let name, stats, recipe;
      if (notable) {
        name = isKo ? (notable.koName || notable.enName || '') : (notable.enName || notable.koName || '');
        stats = isKo ? (notable.koStats || notable.enStats || []) : (notable.enStats || notable.koStats || []);
        recipe = notable.recipe || [];
      } else {
        name = full.name || '';
        stats = full.stats || [];
        recipe = [];
      }
      const recipeHtml = recipe.length
        ? `<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:3px;">${recipe.map(r => {
            const ko = passiveLiquids[r] || r;
            return `<span style="background:#1e1a0e;border:1px solid #5a3e10;border-radius:3px;padding:1px 5px;font-size:10px;color:#c8a84a;" title="${esc(r)}">${esc(ko)}</span>`;
          }).join('')}</div>` : '';
      const statsHtml = stats.length
        ? `<ul style="margin:3px 0 0 14px;padding:0;list-style:disc;">${stats.map(s => `<li style="color:#b0c0b0;font-size:11px;line-height:1.4;">${esc(s)}</li>`).join('')}</ul>` : '';
      const badgeHtml = notable
        ? `<span style="font-size:9px;color:#c8a84a;border:1px solid #5a3e10;border-radius:2px;padding:0 3px;margin-left:5px;vertical-align:middle;">Notable</span>`
        : '';
      return `<div style="background:#181410;border:1px solid #2e2810;border-radius:5px;padding:6px 9px;">
        <div style="color:#e8c84a;font-weight:600;font-size:12px;">${esc(name)}${badgeHtml}</div>
        ${statsHtml}${recipeHtml}
      </div>`;
    };
    const renderSection = (ids, filename, color) =>
      `<div style="margin-bottom:10px;">
        <div style="font-size:11px;color:${color};margin-bottom:5px;font-weight:600;">📄 ${esc(filename)} 에만 있는 노드 (${ids.length}개)</div>
        ${ids.length ? `<div style="display:flex;flex-direction:column;gap:4px;">${ids.map(renderNodeCard).join('')}</div>` : '<div style="color:#555;font-size:11px;">없음</div>'}
      </div>`;
    resultEl.innerHTML = `<div style="padding:0 0 8px;">
      ${renderSection(only1, file1.name, '#e8c84a')}
      ${renderSection(only2, file2.name, '#6ab0ff')}
    </div>`;
  } catch (e) {
    resultEl.innerHTML = '<div style="color:#c04040;text-align:center;padding:12px;font-size:12px;">파일 분석 실패. XML 형식을 확인해주세요.</div>';
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
  const cacheKey = `${settings.league || 'Standard'}::${currentNinjaCategory}`;
  delete ninjaCacheMap[cacheKey];
  loadNinjaRates();
}

async function loadNinjaRates() {
  const league = settings.league || 'Standard';
  const itemType = currentNinjaCategory;
  const cacheKey = `${league}::${itemType}`;
  const now = Date.now();

  const cached = ninjaCacheMap[cacheKey];
  if (cached && now - cached.fetchedAt < 5 * 60 * 1000) {
    renderNinjaRates(cached.data);
    if (itemType === 'Currency') updateRateBadge(cached.data);
    return;
  }

  document.getElementById('ninja-currency-list').innerHTML = '<div class="ninja-loading">로딩 중...</div>';

  chrome.runtime.sendMessage({ type: 'FETCH_NINJA', league, itemType }, res => {
    if (!res || !res.ok || !res.data) {
      document.getElementById('ninja-currency-list').innerHTML = '<div class="ninja-loading">데이터 로드 실패</div>';
      return;
    }
    ninjaCacheMap[cacheKey] = { data: res.data, fetchedAt: Date.now() };
    renderNinjaRates(res.data);
    if (itemType === 'Currency') updateRateBadge(res.data);
  });
}

function loadNinjaImage(img, ninjaPath) {
  img.src = 'https://web.poecdn.com' + ninjaPath;
  img.onerror = () => { img.style.display = 'none'; };
}

function renderNinjaRates(data) {
  const container = document.getElementById('ninja-currency-list');
  if (!container) return;
  container.innerHTML = '';

  const updated = document.getElementById('ninja-last-updated');
  if (updated) updated.textContent = new Date().toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'}) + ' 기준';

  // withItems=true 파라미터로 최상위 items 배열에 모든 카테고리 아이템 이미지 포함됨.
  // 없는 경우 core.items(Currency 전용)로 폴백.
  const items = data.items || data.core?.items || [];
  const lines = data.lines || [];

  if (lines.length === 0) {
    container.innerHTML = '<div style="padding:12px;color:#806040;text-align:center;">데이터 없음</div>';
    return;
  }

  // id → {name, image} 맵 빌드
  const itemMap = {};
  items.forEach(item => { itemMap[item.id] = item; });

  // primaryValue 내림차순 정렬
  const sorted = [...lines].sort((a, b) => (b.primaryValue || 0) - (a.primaryValue || 0));

  sorted.forEach(line => {
    const info = itemMap[line.id] || {};
    const name = ITEM_NAMES_KO[info.name] || info.name || line.id;
    const imageUrl = info.image ? 'https://web.poecdn.com' + info.image : null;
    const value = line.primaryValue;
    if (!value && value !== 0) return;

    // 표시 형식: 1 이상이면 "N/div", 미만이면 ex 환산 (환율 없으면 "1div=N개" 폴백)
    let priceText;
    if (value >= 1) {
      priceText = value.toFixed(value >= 10 ? 0 : 1) + '/div';
    } else if (value > 0) {
      if (currentExRate) {
        const exVal = value * currentExRate;
        priceText = (exVal >= 10 ? Math.round(exVal) : exVal.toFixed(1)) + 'ex';
      } else {
        priceText = '1div=' + Math.round(1 / value) + '개';
      }
    } else {
      return;
    }

    const row = document.createElement('div');
    row.className = 'ninja-row';
    row.innerHTML = `
      <img class="ninja-icon" alt="" style="display:none">
      <span class="ninja-name">${name}</span>
      <span class="ninja-div">${priceText}</span>
    `;
    const img = row.querySelector('img');
    if (imageUrl) {
      img.style.display = '';
      img.src = imageUrl;
      img.onerror = () => { img.style.display = 'none'; };
    }
    container.appendChild(row);
  });

  // 렌더 완료 후 현재 검색어로 즉시 필터링
  applyNinjaSearch();
}

function updateRateBadge(data) {
  const badge = document.getElementById('ninja-rate-badge');
  if (!badge) return;
  const exRate = data.core?.rates?.exalted;
  if (exRate) {
    currentExRate = exRate;
    chrome.storage.local.set({
      [TRADE_RATE_KEY]: {
        rates: data.core?.rates || {},
        updatedAt: new Date().toISOString(),
        league: settings.league || 'Standard'
      }
    });
    badge.textContent = `1div = ${exRate}ex`;
    badge.style.display = '';
    render();
  } else {
    badge.style.display = 'none';
  }
}
