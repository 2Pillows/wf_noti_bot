const fissueEmbed = require("../../embeds/fissureEmbed");

module.exports = {
  //deleted: true,
  name: "setup-fissures",
  description: "Adds fissure embed to channel!",
  // options: Object[],
  // devOnly: Boolean,
  // testOnly: Boolean,

  callback: async (client, interaction) => {
    interaction.reply({
      content: "Creating Fissure Embed...",
      ephemeral: true,
    });

    const channel = interaction.channel;

    fissueEmbed(channel);
  },
};
