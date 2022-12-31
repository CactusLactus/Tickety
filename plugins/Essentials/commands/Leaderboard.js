const { Command } = require("../../../structures");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { DefaultEmbed } = require("../../../embeds");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Leaderboard")
        .addStringOption((x) =>
          x
            .setName("type")
            .setDescription("Type")
            .setRequired(true)
            .addChoices(
              { name: "economy", value: "economy" },
              { name: "leveling", value: "leveling" }
            )
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply();

    const choice = interaction.options.getString("type", true);

    if (choice === "economy") {
      let everyone = await this.client.plugins.economy.getAll();
      let arr = [];
      for (let [id, { stats }] of everyone) {
        arr.push({ id, stats });
      }
      let richest = arr.sort(
        (a, b) => b.stats.cash + b.stats.bank - (a.stats.cash + a.stats.bank)
      );
      if (richest.length > 10) richest.length = 10;

      let gambled = arr.sort((a, b) => b.stats.gambled - a.stats.gambled);
      if (gambled.length > 10) gambled.length = 10;

      let i = 1;
      let ii = 1;

      let fields1 = [];
      let fields2 = [];

      const richestEmbed = new DefaultEmbed().setTitle("🏆 Top 10 Richest");
      const gambledEmbed = new DefaultEmbed().setTitle("🎲 Top 10 Gamblers");
      for (let rich of richest) {
        fields1.push({
          name: `💸 #${i} ${
            interaction.guild.members.cache.get(rich.id).user.username
          }`,
          value: `Cash: **$${this.client.plugins.economy.parseAmount(
            rich.stats.cash
          )}** + Bank: **$${this.client.plugins.economy.parseAmount(
            rich.stats.bank
          )}**`,
        });
        i++;
      }
      for (let gambler of gambled) {
        fields2.push({
          name: `💸 #${ii} ${
            interaction.guild.members.cache.get(gambler.id).user.username
          }`,
          value: `Gambled: **$${this.client.plugins.economy.parseAmount(
            gambler.stats.gambled
          )}**`,
        });
        ii++;
      }
      richestEmbed.setFields(fields1);
      gambledEmbed.setFields(fields2);
      interaction.editReply({ embeds: [richestEmbed, gambledEmbed] });
    } else if (choice === "leveling") {
      const everyone = await this.client.plugins.leveling.getAll();

      let arr = [];
      for (let [id, { stats }] of everyone) {
        arr.push({ id, stats });
      }
      let top = arr.sort((a, b) => b.stats.xp - a.stats.xp);
      if (top.length > 10) top.length = 10;

      let i = 1;

      const topXP = new DefaultEmbed().setTitle("🏆 Top 10 Levels");

      let fields = [];
      for (let x of top) {
        const member = interaction.guild.members.cache.get(x.id);
        if (!member) continue;

        fields.push({
          name: `👤 #${i} ${member.user.username}`,
          value: `Level: **${
            x.stats.level
          }** | XP: **${this.client.plugins.economy.parseAmount(
            x.stats.xp
          )}** | Messages: **${x.stats.messages}**`,
        });
        i++;
      }

      topXP.setFields(fields);

      await interaction.editReply({ embeds: [topXP] });
    }
  }
};
