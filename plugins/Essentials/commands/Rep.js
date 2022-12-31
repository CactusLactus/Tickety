const { Command } = require("../../../structures");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { DefaultEmbed, SuccessEmbed } = require("../../../embeds");
const ms = require("ms");

module.exports = class extends Command {
  constructor(client) {
    super(client, {
      name: "rep",
      enabled: true,
      data: new SlashCommandBuilder()
        .setName("rep")
        .setDescription("Reputation | Cooldown 24h")
        .addSubcommand((sub) =>
          sub
            .setName("view")
            .setDescription("view")
            .addUserOption((usr) =>
              usr.setName("user").setDescription("User").setRequired(false)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("give")
            .setDescription("Give rep")
            .addUserOption((usr) =>
              usr.setName("user").setDescription("User").setRequired(true)
            )
        ),
    });
  }
  async execute(interaction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "view": {
        const user =
          interaction.options.getUser("user", false) || interaction.user;

        const reps = this.client.plugins.essentials.getReps(user);

        let description =
          user.id === interaction.user.id
            ? `🏆 You have __${reps}__ reps!`
            : `🏆 User ${user} has __${reps}__ reps!`;

        const embed = new DefaultEmbed({ description });

        await interaction.editReply({ embeds: [embed] });

        break;
      }
      case "give": {
        const user = interaction.options.getUser("user", true);

        const cooldown = this.client.plugins.essentials.getCooldown(user);

        if (cooldown > Date.now()) {
          return await interaction.editReply({
            embeds: [
              new ErrroEmbed({
                description: `You need to wait ${ms(Date.now() - cooldown, {
                  long: true,
                })}`,
              }),
            ],
          });
        }

        this.client.plugins.essentials.addRep(user);

        let description = `Successfully sent reputation to ${user}`;

        const embed = new SuccessEmbed({
          description,
          footer: {
            text: "You can give only 1 reputation every 24h",
          },
        });

        await interaction.editReply({ embeds: [embed] });

        break;
      }
    }
  }
};
