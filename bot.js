const { Telegraf } = require("telegraf");
require("dotenv").config();
const api = require("covid19-api");
const Markup = require("telegraf/markup");
const COUNTRIES_LIST = require("./const");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.replyWithHTML(
    `
Привет ${ctx.message.from.first_name} ${ctx.message.from.last_name}!
Узнай статистику по COVID-19.
Введи название стран на английском языке и получи статистику.
Посмотреть весь список сран можно командой <b>/help</b>  
  `,
    Markup.keyboard([
      ["US", "Russia"],
      ["Ukraine", "Kazakhstan"],
    ])
      .resize()
      .extra()
  )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on("text", async (ctx) => {
  // const country = ctx.message.text || "russia";
  // console.log(country);
  try {
    const [[data]] = await api.getReportsByCountries(ctx.message.text);
    await ctx.replyWithHTML(`
    <b>${data.country.toUpperCase()}</b> 
________________________________________________
  <i>Кол-во заболевших: <b>${data.cases}</b></i>
  <i>Кол-во смертей: <b>${data.deaths}</b></i>
  <i>Кол-во выздоровевших: <b>${data.recovered}</b></i>
    `);
  } catch (e) {
    await ctx.reply("Ошибка: Вы указали неверную страну!!! Посмотрите /help.");
  }
});

bot.hears("hi", (ctx) => ctx.reply("Hey there"));

bot.launch();
