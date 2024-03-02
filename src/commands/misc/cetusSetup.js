const cetusEmbed = require("../../embeds/cetusEmbed");

module.exports = {
  //deleted: true,
  name: "setup-cetus",
  description: "Adds cetus embed to channel!",
  // options: Object[],
  // devOnly: Boolean,
  // testOnly: Boolean,

  callback: async (client, interaction) => {
    interaction.reply({ content: "Creating Cetus Embed...", ephemeral: true });

    const channel = interaction.channel;

    cetusEmbed(channel);
  },
};
