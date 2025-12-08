import type { Company, Post, Conversation } from "../types";

export const companiesSeed: Company[] = [
  { id:"tech", name:"UnicornIT", type:"TOO — магия", leader:"Алмаз🦄", tags:["код","мемы"], ratingUsers:5, ratingEnterra:10, status:"ищу 💥" },
  { id:"eco", name:"$Эко", type:"АО — деньги", leader:"Айгуль💸", tags:["инвест","чай"], ratingUsers:5, ratingEnterra:9, status:"free" },
  { id:"agro", name:"Агророб", type:"TOO — ферма", leader:"Нурлан🚜", tags:["трактор","шутки"], ratingUsers:4, ratingEnterra:8, status:"⚡️" },
];

export const postsSeed: Post[] = [
  {
    id: 1,
    author: "AdmBK3",
    role: "adm",
    time: "только что",
    text: "🎉 грант+носки🧦",
    likes: 69,
    comments: 7,
    image: "https://pixabay.com/photos/colorful-artsy-socks-stocking-898311/" // носки  
  },
  {
    id: 2,
    author: "M+",
    role: "IP",
    time: "сек назад",
    text: "мемы🔥",
    likes: 13,
    comments: 3,
    image: "https://www.pexels.com/search/social%20media%20memes/" // мемы соцмедиа  
  },
  {
    id: 3,
    author: "Granter",
    role: "mod",
    time: "5 мин назад",
    text: "Получил грант! 🏦",
    likes: 42,
    comments: 5,
    image: "https://pixabay.com/photos/funding-community-business-4348833/" // изображение денег / финансирования :contentReference[oaicite:1]{index=1}  
  },
  {
    id: 4,
    author: "SockLover",
    role: "user",
    time: "10 мин назад",
    text: "Люблю свои яркие носки",
    likes: 27,
    comments: 2,
    image: "https://freeimages.com/search/socks" // стоковые фото носков :contentReference[oaicite:2]{index=2}  
  },
  {
    id: 5,
    author: "MemeQueen",
    role: "user",
    time: "20 мин назад",
    text: "Когда мем заходит 🔥😂",
    likes: 50,
    comments: 10,
    image: "https://www.pexels.com/search/funny%20social%20media%20memes/" // смешные мемы :contentReference[oaicite:3]{index=3}  
  },
  {
    id: 6,
    author: "CashFlow",
    role: "user",
    time: "30 мин назад",
    text: "Грант на стартап?",
    likes: 34,
    comments: 4,
    image: "https://www.pexels.com/search/grants%20and%20funding/" // гранты и финансирование :contentReference[oaicite:4]{index=4}  
  },
  {
    id: 7,
    author: "SockArt",
    role: "user",
    time: "40 мин назад",
    text: "Креативный дизайн носков 😍",
    likes: 22,
    comments: 0,
    image: "https://pixabay.com/photos/colorful-artsy-socks-stocking-898311/" // снова арт-носки :contentReference[oaicite:5]{index=5}  
  },
  {
    id: 8,
    author: "MoneyMover",
    role: "user",
    time: "час назад",
    text: "Раздаю деньги 💵",
    likes: 15,
    comments: 3,
    image: "https://www.pexels.com/photo/man-giving-money-to-woman-6207707" // передача денег :contentReference[oaicite:6]{index=6}  
  },
  {
    id: 9,
    author: "GrantSeeker",
    role: "user",
    time: "2 часа назад",
    text: "Надеюсь, получу финансирование",
    likes: 5,
    comments: 1,
    image: "https://www.pexels.com/search/grant%20money/" // фото “грант деньги” :contentReference[oaicite:7]{index=7}  
  },
  {
    id: 10,
    author: "CloseUp",
    role: "user",
    time: "вчера",
    text: "Деньги крупным планом",
    likes: 11,
    comments: 2,
    image: "https://www.pexels.com/photo/close-up-photo-of-money-8643438/" // крупный план денег :contentReference[oaicite:8]{index=8}  
  },
];

export const conversationsSeed: Conversation[] = [
  { id:"c-tech", title:"Алмаз🦄", subtitle:"UnicornIT", unread:9, messages:[
    { fromMe:false, text:"йо, аппы🦄?", time:"14:25" },
    { fromMe:true, text:"ок, держи зелье🧪", time:"14:26" },
  ]},
  { id:"c-eco", title:"Айгуль💸", subtitle:"$Эко", unread:0, messages:[
    { fromMe:false, text:"чекнем бабло😎", time:"вчера" },
  ]},
];
