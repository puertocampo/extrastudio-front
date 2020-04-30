export enum GenreId {
  family = "family",
  date = "date",
  child = "child",
  alone = "alone",
  free = "free",
  business = "business",
  learning = "learning",
  grownup = "grownup",
  encounter = "encounter",
  instagenic = "instagenic",
  women = "women",
  music = "music"
}

export enum ProfessionId {
  default = "",
  a = "a",
  b = "b",
  c = "c"
}

export enum PrefectureLabel {
  hokkaido = "北海道",
  aomori = "青森県",
  iwate = "岩手県",
  miyagi = "宮城県",
  akita = "秋田県",
  yamagata = "山形県",
  fukushima = "福島県",
  ibaraki = "茨城県",
  tochigi = "栃木県",
  gunma = "群馬県",
  saitama = "埼玉県",
  chiba = "千葉県",
  tokyo = "東京都",
  kanagawa = "神奈川県",
  niigata = "新潟県",
  toyama = "富山県",
  ishikawa = "石川県",
  fukui = "福井県",
  yamanashi = "山梨県",
  nagano = "長野県",
  gifu = "岐阜県",
  shizuoka = "静岡県",
  aichi = "愛知県",
  mie = "三重県",
  shiga = "滋賀県",
  kyoto = "京都府",
  osaka = "大阪府",
  hyogo = "兵庫県",
  nara = "奈良県",
  wakayama = "和歌山県",
  tottori = "鳥取県",
  shimane = "島根県",
  okayama = "岡山県",
  hiroshima = "広島県",
  yamaguchi = "山口県",
  tokushima = "徳島県",
  kagawa = "香川県",
  ehime = "愛媛県",
  kouchi = "高知県",
  fukuoka = "福岡県",
  saga = "佐賀県",
  nagasaki = "長崎県",
  kumamoto = "熊本県",
  oita = "大分県",
  miyazaki = "宮崎県",
  kagoshima = "鹿児島県",
  okinawa = "沖縄県"
}

export enum PrefectureId {
  hokkaido = "hokkaido",
  aomori = "aomori",
  iwate = "iwate",
  miyagi = "miyagi",
  akita = "akita",
  yamagata = "yamagata",
  fukushima = "fukushima",
  ibaraki = "ibaraki",
  tochigi = "tochigi",
  gunma = "gunma",
  saitama = "saitama",
  chiba = "chiba",
  tokyo = "tokyo",
  kanagawa = "kanagawa",
  niigata = "niigata",
  toyama = "toyama",
  ishikawa = "ishikawa",
  fukui = "fukui",
  yamanashi = "yamanashi",
  nagano = "nagano",
  gifu = "gifu",
  shizuoka = "shizuoka",
  aichi = "aichi",
  mie = "mie",
  shiga = "shiga",
  kyoto = "kyoto",
  osaka = "osaka",
  hyogo = "hyogo",
  nara = "nara",
  wakayama = "wakayama",
  tottori = "tottori",
  shimane = "shimane",
  okayama = "okayama",
  hiroshima = "hiroshima",
  yamaguchi = "yamaguchi",
  tokushima = "tokushima",
  kagawa = "kagawa",
  ehime = "ehime",
  kouchi = "kouchi",
  fukuoka = "fukuoka",
  saga = "saga",
  nagasaki = "nagasaki",
  kumamoto = "kumamoto",
  oita = "oita",
  miyazaki = "miyazaki",
  kagoshima = "kagoshima",
  okinawa = "okinawa"
}

export const prefectureItems = [{
  label: PrefectureLabel.hokkaido,
  value: PrefectureId.hokkaido
},
{
  label: PrefectureLabel.aomori,
  value: PrefectureId.aomori
},
{
  label: PrefectureLabel.iwate,
  value: PrefectureId.iwate
},
{
  label: PrefectureLabel.miyagi,
  value: PrefectureId.miyagi
},
{
  label: PrefectureLabel.akita,
  value: PrefectureId.akita
},
{
  label: PrefectureLabel.yamagata,
  value: PrefectureId.yamagata
},
{
  label: PrefectureLabel.fukushima,
  value: PrefectureId.fukushima
},
{
  label: PrefectureLabel.ibaraki,
  value: PrefectureId.ibaraki
},
{
  label: PrefectureLabel.tochigi,
  value: PrefectureId.tochigi
},
{
  label: PrefectureLabel.gunma,
  value: PrefectureId.gunma
},
{
  label: PrefectureLabel.saitama,
  value: PrefectureId.saitama
},
{
  label: PrefectureLabel.chiba,
  value: PrefectureId.chiba
},
{
  label: PrefectureLabel.tokyo,
  value: PrefectureId.tokyo
},
{
  label: PrefectureLabel.kanagawa,
  value: PrefectureId.kanagawa
},
{
  label: PrefectureLabel.niigata,
  value: PrefectureId.niigata
},
{
  label: PrefectureLabel.toyama,
  value: PrefectureId.toyama
},
{
  label: PrefectureLabel.ishikawa,
  value: PrefectureId.ishikawa
},
{
  label: PrefectureLabel.fukui,
  value: PrefectureId.fukui
},
{
  label: PrefectureLabel.yamanashi,
  value: PrefectureId.yamanashi
},
{
  label: PrefectureLabel.nagano,
  value: PrefectureId.nagano
},
{
  label: PrefectureLabel.gifu,
  value: PrefectureId.gifu
},
{
  label: PrefectureLabel.shizuoka,
  value: PrefectureId.shizuoka
},
{
  label: PrefectureLabel.aichi,
  value: PrefectureId.aichi
},
{
  label: PrefectureLabel.mie,
  value: PrefectureId.mie
},
{
  label: PrefectureLabel.shiga,
  value: PrefectureId.shiga
},
{
  label: PrefectureLabel.kyoto,
  value: PrefectureId.kyoto
},
{
  label: PrefectureLabel.osaka,
  value: PrefectureId.osaka
},
{
  label: PrefectureLabel.hyogo,
  value: PrefectureId.hyogo
},
{
  label: PrefectureLabel.nara,
  value: PrefectureId.nara
},
{
  label: PrefectureLabel.wakayama,
  value: PrefectureId.wakayama
},
{
  label: PrefectureLabel.tottori,
  value: PrefectureId.tottori
},
{
  label: PrefectureLabel.shimane,
  value: PrefectureId.shimane
},
{
  label: PrefectureLabel.okayama,
  value: PrefectureId.okayama
},
{
  label: PrefectureLabel.hiroshima,
  value: PrefectureId.hiroshima
},
{
  label: PrefectureLabel.yamaguchi,
  value: PrefectureId.yamaguchi
},
{
  label: PrefectureLabel.tokushima,
  value: PrefectureId.tokushima
},
{
  label: PrefectureLabel.kagawa,
  value: PrefectureId.kagawa
},
{
  label: PrefectureLabel.ehime,
  value: PrefectureId.ehime
},
{
  label: PrefectureLabel.kouchi,
  value: PrefectureId.kouchi
},
{
  label: PrefectureLabel.fukuoka,
  value: PrefectureId.fukuoka
},
{
  label: PrefectureLabel.saga,
  value: PrefectureId.saga
},
{
  label: PrefectureLabel.nagasaki,
  value: PrefectureId.nagasaki
},
{
  label: PrefectureLabel.kumamoto,
  value: PrefectureId.kumamoto
},
{
  label: PrefectureLabel.oita,
  value: PrefectureId.oita
},
{
  label: PrefectureLabel.miyazaki,
  value: PrefectureId.miyazaki
},
{
  label: PrefectureLabel.kagoshima,
  value: PrefectureId.kagoshima
},
{
  label: PrefectureLabel.okinawa,
  value: PrefectureId.okinawa
}
]