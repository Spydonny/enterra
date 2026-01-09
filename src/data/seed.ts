import type { Company, Post, Conversation } from "../types";

export const companiesSeed: Company[] = [
  { id:"tech", name:"UnicornIT", type:"TOO — магия", leader:"Алмаз🦄", tags:["код","мемы"], ratingUsers:5, ratingEnterra:10, status:"ищу 💥" },
  { id:"eco", name:"$Эко", type:"АО — деньги", leader:"Айгуль💸", tags:["инвест","чай"], ratingUsers:5, ratingEnterra:9, status:"free" },
  { id:"agro", name:"Агророб", type:"TOO — ферма", leader:"Нурлан🚜", tags:["трактор","шутки"], ratingUsers:4, ratingEnterra:8, status:"⚡️" },
];

export const postsSeed: Post[] = [];

export const conversationsSeed: Conversation[] = [
  { id:"c-tech", title:"Алмаз🦄", subtitle:"UnicornIT", unread:1, messages:[
    { fromMe:false, text:"йо, аппы🦄?", time:"14:25" },
    { fromMe:true, text:"ок, держи зелье🧪", time:"14:26" },
  ]},
  { id:"c-eco", title:"Айгуль💸", subtitle:"$Эко", unread:0, messages:[
    { fromMe:false, text:"чекнем бабло😎", time:"вчера" },
  ]},
];
