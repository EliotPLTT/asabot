const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { apiCall } = require('../../utils.js');
const { apiEndPoint } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('follow')
		.setDescription('Follow an organization')
        .addStringOption(option =>
            option.setName('orgsid')
                .setDescription('SID of an organization')
                .setRequired(true)),
	async execute(interaction) {
        const orgSID = interaction.options.getString('orgsid');
        const urlReq = apiEndPoint + "/db/ADMIN/followOrg/" + orgSID;
        const jsonResponse = await apiCall(urlReq);

        let response = "Unable to follow " + orgSID + ", please contact bot administrator";
        if (jsonResponse.Status === "OK") {
            response = "Successfully followed " + orgSID;
        }

        await interaction.reply({ content: response, flags: MessageFlags.Ephemeral });
	}
};
