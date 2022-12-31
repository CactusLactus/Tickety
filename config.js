module.exports = {
  color: 0x0096ff, // color for embeds
  server_id: "997277454437728276", // put your server id here
  presence: {
    status: "dnd",
    activities: [
      {
        name: "Custom Status", // text of your bot status
        type: 0, // 0 - 5
      },
    ],
  },
  tickets: {
    help_categories: ["Category 1", "Category 2", "Category 3"], // max 8
    ticket_logs: "1058719184827191406", // channel id
    category_id: "1058713633040896051", // tickets where channels will be sorted
    channel_format: "🎫ticket-", // ticket channel name format
    staff_roles_ids: [], // put staff role IDs like this ['id1', 'id2', 'id3', etc...]
    open_message: `✨ Hello {USER}, welcome to your ticket.
🔎 Our support team will reach to you as soon as possible.`, // welcome to ticket message
  },
};
