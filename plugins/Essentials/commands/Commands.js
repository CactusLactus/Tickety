const { Command } = require("../../../structures");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { DefaultEmbed } = require("../../../embeds");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "commands",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("commands")
        .setDescription("Commands"),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let commands = `\`\`\`\n${this.client.commands
      .map((x) => `/${x.name}`)
      .join(" ")}\n\`\`\``;

    const embed = new DefaultEmbed()
      .setTitle("Commands")
      .setDescription(commands)
      .setThumbnail(this.client.user.displayAvatarURL());
    await interaction.editReply({ embeds: [embed] });
  }
};
