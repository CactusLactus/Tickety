const Enmap = require("enmap");

const reps = new Enmap({
  name: "reps",
  autoEnsure: {
    reps: 0,
    nextRep: 0,
  },
});

class EssentialsPlugin {
  constructor(client) {
    this.client = client;
    this.version = "1.0";
    this.author = "drangula#9999";
    this.reps = reps;
  }
  async getInfo() {
    console.log(`[Essentials v${this.version}] Coded by ${this.author}`);
  }

  getReps({ id }) {
    return this.reps.get(id, "reps");
  }
  addRep({ id }) {
    this.reps.math(id, "+", 1, "reps");
  }
  getCooldown({ id }) {
    return this.reps.get(id, "nextRep");
  }
  addCooldown({ id }) {
    this.reps.set(id, Date.now() + 86400000, "nextRep");
  }
}

module.exports = EssentialsPlugin;
