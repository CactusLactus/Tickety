const { Event } = require("../../../structures");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "ready",
      enabled: true,
    });
  }
  async run() {
    const guild = this.client.guilds.cache.get(this.client.config.server_id);
    guild.commands.set(
      Array.from(this.client.commands.values()).map((r) => r.data.toJSON())
    );
    await this.client.user.setPresence(this.client.config.presence);

    console.log(`[!] ${this.client.user.username} has been logged in!`);
  }
};
