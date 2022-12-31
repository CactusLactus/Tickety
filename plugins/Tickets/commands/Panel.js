const {
  SlashCommandBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");
const { Command } = require("../../../structures/");
const { PermissionFlagsBits } = require("discord.js");
const { DefaultEmbed, SuccessEmbed } = require("../../../embeds");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "ticket-panel",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("ticket-panel")
        .setDescription("Panel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((c) =>
          c.setName("channel").setDescription("channel").setRequired(true)
        )
        .addStringOption((x) =>
          x.setName("message").setDescription("Message").setRequired(false)
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: true,
    });

    let description = interaction.options.getString("message", false);
    let channel = interaction.options.getChannel("channel", true);

    if (!description)
      description = "📨 Click button below to open your ticket.";

    let options = [];
    let i = 0;
    for (let category of this.client.config.tickets.help_categories) {
      if (i > 7) break;
      options.push({
        label: category,
        description: `Help for ${category}`,
        value: category,
      });
      i++;
    }

    const selectMenu = new SelectMenuBuilder()
      .setCustomId("panel")
      .setPlaceholder("Select help category")
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const panel = new DefaultEmbed({
      title: "Support Ticket",
      description,
    });

    await channel.send({
      embeds: [panel],
      components: [row],
    });

    await interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Successfully created reaction pane in ${channel}.`,
        }),
      ],
    });
  }
};
