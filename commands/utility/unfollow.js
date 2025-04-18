const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { apiCall } = require('../../utils.js');
const { apiEndPoint } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unfollow')
		.setDescription('Unfollow an organization')
        .addStringOption(option =>
            option.setName('orgsid')
                .setDescription('SID of an organization')
                .setRequired(true)),
	async execute(interaction) {
        const orgSID = interaction.options.getString('orgsid');
        const urlReq = apiEndPoint + "/db/ADMIN/unfollowOrg/" + orgSID;
        const jsonResponse = await apiCall(urlReq);

        let response = "Unable to unfollow " + orgSID + ", please contact bot administrator";
        if (jsonResponse.Status === "OK") {
            response = "Successfully unfollowed " + orgSID;
        }

        await interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
	}
};
