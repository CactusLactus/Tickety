const { Event } = require("../../../structures/");
const { ChannelType, PermissionFlagsBits } = require("discord.js");
const { DefaultEmbed, SuccessEmbed, ErrorEmbed } = require("../../../embeds");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "interactionCreate",
      enabled: true,
    });
  }
  async run(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.channel.type === ChannelType.DM) return;
    await interaction.deferReply({
      ephemeral: true,
    });
    if (interaction.customId !== "panel") return;

    const category = interaction.values[0];
    const ticket = this.client.plugins.tickets.getData(interaction.user);

    if (ticket)
      return interaction.editReply({
        embeds: [
          new ErrorEmbed({
            description: `You already have opened ticket! <#${ticket.channel}>`,
          }),
        ],
      });

    const channel = await interaction.guild.channels.create({
      name: `${this.client.config.tickets.channel_format}-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: this.client.config.tickets.category_id,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ],
    });

    let open_message = this.client.config.tickets.open_message.replace(
      /{USER}/g,
      interaction.user
    );

    let mentions = `<@!${interaction.user.id}>`;

    for (var role of this.client.config.tickets.staff_roles_ids) {
      mentions += ` <@&${role}>`;
    }

    channel.send({
      content: mentions,
      embeds: [
        new DefaultEmbed({
          title: `Support for category **${category.toUpperCase()}**`,
          description: open_message,
        }),
      ],
    });

    this.client.plugins.tickets.addTicket(interaction.user, channel.id);

    interaction.editReply({
      embeds: [
        new SuccessEmbed({
          description: `Successfully opened a ticket ${channel} for you.`,
        }),
      ],
    });

    setTimeout(async () => {
      let messages = await channel.messages.fetch({ limit: 1 });
      let lastMessage = messages.first();
      if (lastMessage.author.bot) {
        await channel.delete();
        await this.client.plugins.tickets.deleteTicket({ id: ticketCreator });
        return;
      }
    }, 180000);
  }
};
