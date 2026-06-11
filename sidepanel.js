'use strict';

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

const CATEGORY_PREFIXES = ['explicit','implicit','desecrated','enchant','fractured','crafted','rune'];
const CATEGORY_LABELS = {
  explicit: '비고정', implicit: '고정', desecrated: '훼손',
  enchant: '인챈트', fractured: '분열됨', crafted: '제작', rune: '룬'
};

const KR_TRADE_BASE = 'https://poe.game.daum.net/trade2/search/poe2';
const KR_API_SEARCH = (l) => `https://poe.game.daum.net/api/trade2/search/poe2/${l}`;
const DEFAULT_LEAGUE = 'Runes of Aldur';
const KNOWN_LEAGUES = ['Runes of Aldur', 'HC Runes of Aldur', 'Standard', 'Hardcore'];
const LEAGUE_ALIASES = { 'Rune of Aldur': 'Runes of Aldur', 'Hardcore Rune of Aldur': 'HC Runes of Aldur' };

let filtersByLeague = {};
let settings = { league: DEFAULT_LEAGUE, resultCount: 10 };
let editingId = null;

const getCurrentFilters = () => filtersByLeague[settings.league] || [];
const setCurrentFilters = (arr) => { filtersByLeague[settings.league] = arr; };

function buildQuerySignature(filter) {
  return JSON.stringify({
    category: filter.category || '',
    rarity: filter.rarity || '',
    ilvlMin: Number(filter.ilvlMin) || 0,
    areaLvlMin: Number(filter.areaLvlMin) || 0,
    equipment: (filter.equipment || [])
      .filter(x => x.active !== false && x.id)
      .map(x => `${x.id}:${Number(x.min) || 0}`)
      .sort(),
    stats: (filter.stats || [])
      .filter(x => x.active !== false && x.id)
      .map(x => `${x.id}:${Number(x.min) || 0}`)
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

function normalizeSavedFilter(filter) {
  if (!filter || typeof filter !== 'object') return filter;
  filter.reqLvlMin = 0;
  filter.priceMax = 0;
  if (filter.savedPrice === undefined) filter.savedPrice = null;
  if (!filter.typeLine) filter.typeLine = '';
  if (filter.typeLineActive == null) filter.typeLineActive = true;
  filter.equipment = Array.isArray(filter.equipment) ? filter.equipment : [];
  filter.stats = Array.isArray(filter.stats) ? filter.stats : [];
  filter.equipment.forEach(e => {
    if (!e) return;
    if (e.active == null) e.active = true;
    if (e.value != null && isFinite(Number(e.value))) e.min = roundFilterNumber(e.value);
  });
  filter.stats.forEach(s => {
    if (!s) return;
    if (s.active == null) s.active = true;
    if (s.value != null && isFinite(Number(s.value))) {
      // Preserve the sign for negative stats (감소 stats stored as negative values).
      const sign = Number(s.value) < 0 ? -1 : 1;
      s.min = sign * roundFilterNumber(s.value);
    }
    // Migrate: if id is unknown but fallbackId is valid, promote fallbackId → id
    if (s.id && s.id.includes('unknown') && s.fallbackId && !s.fallbackId.includes('unknown')) {
      s.id = s.fallbackId;
    }
  });
  updateFilterSourceHash(filter);
  return filter;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  render();
  bindTabs();
  bindHeader();
  bindModal();
  bindSettings();
  bindImportExport();
  chrome.storage.onChanged.addListener((changes) => {
    let needsRender = false;
    if (changes.filtersByLeague) {
      filtersByLeague = changes.filtersByLeague.newValue || {};
      needsRender = true;
    }
    if (changes.settings) {
      settings = { ...settings, ...(changes.settings.newValue || {}) };
      document.getElementById('leagueBadge').textContent = settings.league;
      document.getElementById('sLeague').value = settings.league;
      needsRender = true;
    }
    if (needsRender) render();
  });

  // Top-tab buttons (replaced inline onclick to comply with MV3 CSP)
  document.getElementById('top-tab-trade').addEventListener('click', () => switchTopTab('trade'));
  document.getElementById('top-tab-economy').addEventListener('click', () => switchTopTab('economy'));
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
});

async function loadData() {
  const r = await chrome.storage.local.get(['filters', 'filtersByLeague', 'settings']);
  if (r.settings) settings = { ...settings, ...r.settings };
  filtersByLeague = r.filtersByLeague || {};
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
  }
  Object.keys(filtersByLeague).forEach(league => {
    filtersByLeague[league] = (filtersByLeague[league] || []).map(normalizeSavedFilter);
  });
  await chrome.storage.local.set({ filtersByLeague, settings });
  document.getElementById('sLeague').value = settings.league;
  document.getElementById('sCount').value = settings.resultCount;
  document.getElementById('leagueBadge').textContent = settings.league;
}

const persist = () => chrome.storage.local.set({ filtersByLeague, settings });

function render() {
  const list = document.getElementById('filterList');
  // Preserve which cards are currently open before re-render
  const openIds = new Set(
    Array.from(list.querySelectorAll('.filter-card.open')).map(el => el.id.replace('card-', ''))
  );
  const current = getCurrentFilters();
  if (!current.length) {
    list.innerHTML = `
      <div class="empty">
        <div class="empty-icon">⭐</div>
        <p><strong>${esc(settings.league)}</strong> 리그에 저장된 필터가 없습니다.</p>
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

  const rarityClass = {rare:'badge-rare',unique:'badge-unique',magic:'badge-magic'}[f.rarity] || '';
  const rarityColor = {rare:'#f0c830',unique:'#af6025',magic:'#8888ff',normal:'#c8c8c8'}[f.rarity] || '#c8b98a';
  const catLabel = f.category ? f.category.split('.').pop() : '';

  const summary = [];
  if (f.ilvlMin)  summary.push(`iLvl ${f.ilvlMin}+`);
  const activeEquipment = (f.equipment||[]).filter(e => e.active !== false);
  if (activeEquipment.length) summary.push(`장비 ${activeEquipment.length}개`);
  const activeStats = (f.stats||[]).filter(s => s.active !== false);
  if (activeStats.length) summary.push(`스탯 ${activeStats.length}개`);

  const baseChips = [
    f.ilvlMin    ? `<span class="info-chip ilvl">📦 iLvl ${f.ilvlMin}+</span>` : '',
    f.areaLvlMin ? `<span class="info-chip area">🗺 지역Lv ${f.areaLvlMin}+</span>` : '',
    f.note       ? `<span class="info-chip">📝 ${esc(f.note)}</span>` : '',
  ].join('');

  const equipmentRows = (f.equipment||[]).map((s, i) => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}">
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        <span class="equip-min-value" data-filter-id="${f.id}" data-equip-idx="${i}" title="마우스 휠로 조정">${s.min}+</span>
        <span class="stat-max-val">~∞</span>
      </span>
    </div>`;
  }).join('');

  const statRows = (f.stats||[]).map((s, i) => {
    const active = s.active !== false;
    const origText = s.value != null ? `<span class="stat-orig">${s.value}</span>` : '';
    const rawId = s.id || s.fallbackId || '';
    const prefixMatch = rawId.match(/^([^.]+)\./);
    const prefix = prefixMatch ? prefixMatch[1] : null;
    const knownPrefix = prefix && CATEGORY_LABELS[prefix] ? prefix : null;
    const badgeHtml = knownPrefix
      ? `<button class="cat-badge cat-badge-${knownPrefix}" data-stat-idx="${i}">${CATEGORY_LABELS[knownPrefix]}</button>`
      : (prefix ? `<button class="cat-badge cat-badge-explicit" data-stat-idx="${i}" style="opacity:0.5">${prefix}</button>` : '');
    return `<div class="stat-row-item" style="${active?'':'opacity:.4'}" data-stat-idx="${i}">
      ${badgeHtml}
      <span class="stat-label-t">${esc(s.label)}</span>
      <span class="stat-vals">
        ${origText}
        <span class="stat-min-value" data-filter-id="${f.id}" data-stat-idx="${i}" title="마우스 휠로 조정">${s.min}+</span>
        <span class="stat-max-val">~∞</span>
      </span>
      <button class="stat-delete-btn" data-filter-id="${f.id}" data-stat-idx="${i}" title="이 스탯 삭제">×</button>
    </div>`;
  }).join('');

  wrap.innerHTML = `
    <div class="filter-card-head" data-id="${f.id}">
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
      <button class="btn-open-q"     data-id="${f.id}">🌐 KR거래소</button>
    </div>

    <div class="card-detail">
      ${baseChips ? `<div class="base-info">${baseChips}</div>` : ''}
      ${equipmentRows ? `<div class="stat-table">
        <div class="stat-table-title">장비 조건 (원본값 → 필터 최솟값)</div>
        ${equipmentRows}
      </div>` : ''}
      ${statRows ? `<div class="stat-table">
        <div class="stat-table-title">스탯 조건 (원본값 → 필터 최솟값)</div>
        ${statRows}
      </div>` : ''}
      <div id="result-${f.id}"></div>
    </div>
  `;

  wrap.querySelector('.filter-card-head').addEventListener('click', e => {
    if (e.target.closest('.cat-badge, .stat-delete-btn, .stat-min-value, .equip-min-value, .filter-name-edit, .type-line-badge, .btn-delete-small, button')) return;
    wrap.classList.toggle('open');
  });

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
  wrap.querySelector('.btn-open-q').addEventListener('click', e => { e.stopPropagation(); openKR(f.id); });
  wrap.querySelector('.btn-delete-small').addEventListener('click', e => { e.stopPropagation(); delFilter(f.id); });

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
      // Re-render only this card in-place
      const newCard = makeCard(target);
      wrap.replaceWith(newCard);
      // Keep card open if it was open
      if (wrap.classList.contains('open')) newCard.classList.add('open');
    });
  });

  // Feature: mouse wheel on stat-min-value spans to adjust min value
  wrap.querySelectorAll('.stat-min-value').forEach(span => {
    span.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      const filterId = span.dataset.filterId;
      const statIdx  = parseInt(span.dataset.statIdx, 10);
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.stats || !target.stats[statIdx]) return;
      const delta = e.deltaY < 0 ? 1 : -1;
      target.stats[statIdx].min = (Number(target.stats[statIdx].min) || 0) + delta;
      updateFilterSourceHash(target);
      persist();
      // Update display text in-place without full re-render
      span.textContent = target.stats[statIdx].min + '+';
    }, { passive: false });
  });

  // Feature: mouse wheel on equip-min-value spans to adjust equipment min value
  wrap.querySelectorAll('.equip-min-value').forEach(span => {
    span.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const filterId = span.dataset.filterId;
      const equipIdx = parseInt(span.dataset.equipIdx, 10);
      const arr = getCurrentFilters();
      const target = arr.find(x => String(x.id) === String(filterId));
      if (!target || !target.equipment || !target.equipment[equipIdx]) return;
      const delta = e.deltaY < 0 ? 1 : -1;
      target.equipment[equipIdx].min = Math.max(0, (Number(target.equipment[equipIdx].min) || 0) + delta);
      updateFilterSourceHash(target);
      persist();
      // Update display text in-place without full re-render
      span.textContent = target.equipment[equipIdx].min + '+';
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

  try {
    const query = buildQuery(f);
    chrome.runtime.sendMessage({
      type: 'APPEND_DEBUG_LOG',
      entry: {
        kind: 'search',
        league: settings.league,
        filterId: f.id,
        filterName: f.name,
        query
      }
    }).catch(() => {});
    const res = await fetch(KR_API_SEARCH(encodeURIComponent(settings.league)), {
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
    const url = `${KR_TRADE_BASE}/${encodeURIComponent(settings.league)}/${sData.id}`;
    if (openInNew) {
      chrome.tabs.create({ url });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs && tabs[0]) chrome.tabs.update(tabs[0].id, { url });
        else chrome.tabs.create({ url });
      });
    }
    const total = (sData.total || 0).toLocaleString();
    const openLabel = openInNew ? '새 탭에' : '현재 탭에서';
    rd.innerHTML = `<div class="result-area"><div style="text-align:center;padding:10px;color:#80d040;font-size:11px">✅ 거래소 검색 결과를 ${openLabel} 열었습니다 (총 ${total}개)<br/><a href="${url}" target="_blank" style="color:#5080a0;font-size:10px">다시 열기 →</a></div></div>`;
  } catch(err) {
    rd.innerHTML = `<div class="result-area"><div class="result-error">⚠️ ${esc(err.message)}</div></div>`;
  } finally {
    if (btnNew) { btnNew.classList.remove('loading'); btnNew.disabled = false; btnNew.innerHTML = '🔍 새창'; }
    if (btnCur) { btnCur.classList.remove('loading'); btnCur.disabled = false; btnCur.innerHTML = '🔗 현재창'; }
  }
}

function buildQuery(f) {
  const q = { query:{ status:{ option:'securable' }, filters:{}, stats:[{type:'and',filters:[]}] }, sort:{price:'asc'} };
  const tf = {};
  if (f.rarity)   tf.rarity   = { option: f.rarity };
  if (f.category) tf.category = { option: f.category };
  if (f.typeLine && f.typeLineActive !== false) tf.type = { option: f.typeLine };
  if (Object.keys(tf).length) q.query.filters.type_filters = { filters: tf };

  const mf = {};
  if (f.ilvlMin)    mf.ilvl       = { min: Number(f.ilvlMin) };
  if (f.areaLvlMin) mf.area_level = { min: Number(f.areaLvlMin) };
  if (Object.keys(mf).length) q.query.filters.misc_filters = { filters: mf };

  q.query.filters.trade_filters = { filters: { sale_type: { option: 'priced' } } };

  const equipmentFilters = {};
  (f.equipment || []).forEach(e => {
    if (e.active === false || !e.id) return;
    const min = Number(e.min);
    if (!isFinite(min) || min <= 0) return;
    equipmentFilters[e.id] = { min };
  });
  if (Object.keys(equipmentFilters).length) q.query.filters.equipment_filters = { filters: equipmentFilters };

  const statFilters = [];
  (f.stats || []).forEach(s => {
    if (s.active === false) return;
    const effectiveId = (s.id && !s.id.includes('unknown'))
      ? s.id
      : (s.fallbackId && !s.fallbackId.includes('unknown') ? s.fallbackId : null);
    if (!effectiveId) return;
    // Negative stats (감소/reduction mods) are stored with negative min values.
    // The trade API requires these to be queried with `max` (not `min`) so that
    // items with a roll of -35 or better (more negative = more reduction) are found.
    const minVal = Number(s.min);
    const statValue = minVal < 0 ? { max: minVal } : { min: minVal };
    statFilters.push({ id: effectiveId, value: statValue, disabled: false });
  });
  if (statFilters.length) {
    q.query.stats[0].filters = statFilters;
  }
  return q;
}

function openKR(id) {
  chrome.tabs.create({ url:`${KR_TRADE_BASE}/${encodeURIComponent(settings.league)}` });
}

function delFilter(id) {
  if (!confirm('이 필터를 삭제할까요?')) return;
  setCurrentFilters(getCurrentFilters().filter(x => String(x.id) !== String(id)));
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
      <input type="number" class="stat-edit-min" data-idx="${i}" value="${s.min}" min="0" step="0.1" title="최솟값"/>
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
      <input type="number" class="stat-edit-min" data-idx="${i}" value="${s.min}" step="1" title="최솟값 (감소 스탯은 음수)"/>
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
    f.equipment[i].min    = parseFloat(row.querySelector('.stat-edit-min').value)||0;
  });

  document.querySelectorAll('#statEditList .stat-edit-row').forEach((row, i) => {
    if (!f.stats[i]) return;
    const toggle = row.querySelector('.stat-toggle');
    f.stats[i].active = !toggle.classList.contains('off');
    f.stats[i].min    = parseFloat(row.querySelector('.stat-edit-min').value)||0;

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
    document.getElementById('leagueBadge').textContent = v;
    leagueInput.value = v;
    persist();
    render();
  };
  leagueInput.addEventListener('change', e => onLeagueChange(e.target.value));
  leagueInput.addEventListener('blur',   e => onLeagueChange(e.target.value));
  document.getElementById('sCount').addEventListener('change', e => { settings.resultCount=parseInt(e.target.value); persist(); });
}

function bindImportExport() {
  document.getElementById('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({filtersByLeague,settings},null,2)],{type:'application/json'});
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`poe2-filters-${Date.now()}.json`});
    a.click(); URL.revokeObjectURL(a.href);
  });
  document.getElementById('btnImportTrigger').addEventListener('click',()=>document.getElementById('fileImport').click());
  document.getElementById('btnExportDebug').addEventListener('click', exportDebugLogs);
  document.getElementById('btnClearDebug').addEventListener('click', async () => {
    if (!confirm('디버그 로그를 모두 비울까요?')) return;
    await chrome.runtime.sendMessage({ type: 'CLEAR_DEBUG_LOGS' }).catch(() => null);
    alert('✅ 디버그 로그를 비웠습니다.');
  });
  document.getElementById('fileImport').addEventListener('change', e => {
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const d = JSON.parse(ev.target.result);
        if (d.filtersByLeague) {
          filtersByLeague = d.filtersByLeague;
        } else if (Array.isArray(d.filters)) {
          filtersByLeague = { ...filtersByLeague, [settings.league]: d.filters };
        } else {
          alert('❌ 파일 형식 오류'); return;
        }
        if (d.settings) settings = { ...settings, ...d.settings };
        persist(); render();
        document.getElementById('sLeague').value = settings.league;
        document.getElementById('leagueBadge').textContent = settings.league;
        alert('✅ 가져오기 완료!');
      } catch { alert('❌ 파일 형식 오류'); }
    };
    r.readAsText(file); e.target.value='';
  });
  document.getElementById('btnClear').addEventListener('click',()=>{
    if(confirm(`"${settings.league}" 리그의 모든 필터를 삭제할까요?`)){
      setCurrentFilters([]);
      persist(); render();
    }
  });
}

async function exportDebugLogs() {
  const res = await chrome.runtime.sendMessage({ type: 'GET_DEBUG_LOGS' }).catch(() => null);
  const logs = res?.logs || [];
  const sections = logs.map((entry, idx) => {
    return [
      `===== LOG ${idx + 1} =====`,
      `loggedAt: ${entry.loggedAt || ''}`,
      `kind: ${entry.kind || ''}`,
      JSON.stringify(entry, null, 2),
      ''
    ].join('\n');
  });
  const text = sections.length ? sections.join('\n') : 'No debug logs.';
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `poe2-debug-log-${Date.now()}.txt`
  });
  a.click();
  URL.revokeObjectURL(a.href);
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

function switchTopTab(tabName) {
  document.querySelectorAll('.top-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.top-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`top-panel-${tabName}`).classList.add('active');
  document.getElementById(`top-tab-${tabName}`).classList.add('active');
  if (tabName === 'economy') { renderNinjaCategoryTabs(); loadNinjaRates(); }
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
      <img class="ninja-icon" src="" alt="">
      <span class="ninja-name">${name}</span>
      <span class="ninja-div">${priceText}</span>
    `;
    const img = row.querySelector('img');
    if (imageUrl) {
      img.src = imageUrl;
      img.onerror = () => { img.style.display = 'none'; };
    } else {
      img.style.display = 'none';
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
    badge.textContent = `1div = ${exRate}ex`;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}
