require("dotenv").config();
const { EmbedBuilder } = require("discord.js");

const intervalTime = 5;

async function fissureEmbed(channel, masterList) {
  console.log("\n--------------------------");
  console.log("fissureEmbed called");

  const response = await fetch(process.env.API_URL);
  const data = await response.json();
  const fissureData = data.fissures;

  const spFissures = fissureData.filter(
    (e) => e.isHard == true && e.missionType == "Survival"
  );

  spFissures.forEach(
    (e) =>
      (e.expiry = Math.floor(
        new Date(e.expiry.replace("T", " ")).getTime() / 1000
      ))
  );

  spFissures.sort(function (a, b) {
    return a.expiry - b.expiry;
  });

  const tier = spFissures.map((e) => e.tier);
  const missionType = spFissures.map((e) => e.missionType);
  const expiry = spFissures.map((e) => `<t:${e.expiry}:R>`);

  // console.log(`fissure length: ${spFissures.length}`);
  // console.log(`dictionray length: ${Object.keys(masterList).length}`);
  // let firstLoop = false;
  // if (Object.keys(masterList).length < 1) {
  //   firstLoop = true;
  // }

  spFissures.forEach((e) => {
    if (!(e.id in masterList)) {
      masterList[e.id] = {
        tier: e.tier,
        missionType: e.missionType,
        expiry: e.expiry,
        msgSent: false,
      };
    }
  });

  // if (!firstLoop) {
  //   for (const [key, value] of Object.entries(masterList)) {
  //     if (!value.msgSent) value.msgSent = true;
  //   }
  // }

  // for (const [key, value] of Object.entries(masterList)) {
  //   console.log(`looped ${value.msgSent}`);
  // }

  //  console.log(masterList);

  // Delete Embeds
  const messages = await channel.messages.fetch({ limit: 10 });
  const msgEmbeds = messages.filter((e) => e.embeds.length > 0);
  channel.bulkDelete(msgEmbeds);

  // const newFissures = oldFissures.filter(
  //   (a) => !spFissures.some((b) => a.id === b.id)
  // );

  // console.log(`oldFissures: `);
  // oldFissures.forEach((e) => console.log(e.id));
  // console.log("\n---------------------\n");

  // console.log(`spFissures: `);
  // spFissures.forEach((e) => console.log(e.id));
  // console.log("\n---------------------\n");

  // console.log(`newFissures: `);
  // newFissures.forEach((e) => console.log(e.id));
  // console.log("\n---------------------\n");

  // newFissures.forEach((a) => {
  //   channel.send(`<@!${process.env.USER_ID}> ${a.tier} Surv <t:${a.expiry}:R>`);
  //   spFissures.forEach((b) => {
  //     if (a.id === b.id) {
  //       a.msgSent = true;
  //     }
  //   });
  // });

  // Send Pings
  const msgTexts = messages.filter((e) => e.content.length > 0);
  msgTexts.forEach((e) => {
    for (const [key, value] of Object.entries(masterList)) {
      if (
        !(e.content.includes(value.expiry) && e.content.includes(value.tier))
      ) {
        e.delete();
      }
      if (!value.msgSent) {
        channel.send(
          `<@!${process.env.USER_ID}> ${value.tier} Surv <t:${value.expiry}:R>`
        );
        value.msgSent = true;
      }
    }
  });

  // Send Embed
  const embed = new EmbedBuilder().setTitle("Fissures").addFields(
    { name: "Tier", value: tier.join("\n"), inline: true },
    //{ name: "Mission Type", value: missionType.join("\n"), inline: true },
    { name: "Expires", value: expiry.join("\n"), inline: true }
  );

  channel.send({ embeds: [embed] });

  return masterList;
}

module.exports = async (channel) => {
  const masterList = await fissureEmbed(channel, {});

  setInterval(async () => {
    await fissureEmbed(channel, masterList);
    // }, intervalTime * 60000);
  }, 5000);
};
