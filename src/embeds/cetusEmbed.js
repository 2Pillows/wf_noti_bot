require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

const pillows_id = "800391411560087562";
const api_url = "https://api.warframestat.us/pc/";

async function deleteMessages(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  channel.bulkDelete(messages);
}

module.exports = async function cetusEmbed(channel) {
  console.log("\n--------------------------");
  console.log("cetusEmbed called");

  const response = await fetch(api_url);
  const data = await response.json();
  const cetusData = data.cetusCycle;

  // Day, Night
  const cetusState =
    cetusData.state[0].toUpperCase() + cetusData.state.slice(1);

  const expireString = cetusData.expiry.replace("T", " ");
  const expireDate = new Date(expireString);
  const expireUnix = expireDate.getTime() / 1000;
  const expireMS = expireDate.getTime() - Date.now();

  console.log(`expireMS: ${expireMS}`);

  let validData = true;
  if (expireMS < 1000) {
    setTimeout(() => {
      cetusEmbed(channel);
    }, 5000);
    validData = false;
  }

  if (!validData) return;

  console.log("cetusData passed");

  const beforeNight = 25;
  const msToNoti = expireMS - beforeNight * 60000;

  const embed = new EmbedBuilder()
    .setTitle("Cetus")
    .setDescription(`${cetusState} expires <t:${expireUnix}:R>`);

  await deleteMessages(channel);
  channel.send({ embeds: [embed] });

  // Night Notification
  if (msToNoti > 0 && cetusState === "Day") {
    setTimeout(async () => {
      await deleteMessages(channel);

      channel.send(`<@!${pillows_id}> Night <t:${expireUnix}:R>`);

      channel.send({ embeds: [embed] });
    }, msToNoti);
  }

  // Cycle Expired, Restart
  setTimeout(async () => {
    cetusEmbed(channel);
  }, expireMS);
};
