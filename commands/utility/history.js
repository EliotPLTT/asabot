const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const { apiCall, formatDate } = require('../../utils.js');
const { apiEndPoint } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Replies with Pong!')
        .addStringOption(option =>
            option.setName('handle')
                .setDescription('Handle of citizen')
                .setRequired(true)),
	async execute(interaction) {
        const handle = interaction.options.getString('handle');
        const urlReq = apiEndPoint+"/db/STAT/historique/"+handle;
        const jsonResponse = await apiCall(urlReq);

        const embedToSend = embedFromJson(jsonResponse)
        
		await interaction.reply({ embeds: [embedToSend], flags: MessageFlags.Ephemeral });
	},
};


function embedFromJson (data){
    const embed = new EmbedBuilder()
    .setTitle(`🧾 Profil Star Citizen : ${data.Handle}`)
    .setColor(0x00AEFF)
    .addFields(
        { name: '🔖 UCR', value: data.UCR, inline: true },
        { name: '🗓️ Enrôlé depuis', value: formatDate(data.Enlisted), inline: true },
        { name: '🧬 Bio', value: `\`\`\`${data.Bio}\`\`\`` }
    );

    // Affiliations actuelles
    if (data.currentAffiliations.length > 0) {
    embed.addFields({
        name: '🟢 Affiliations actuelles',
        value: data.currentAffiliations.map(aff => {
        const isMain = aff.main ? '🟢 Principale' : '⚪ Secondaire';
        return `**${aff.orgSID}**\n> 🎖️ Grade : ${aff.rank}\n> 📅 Depuis : ${formatDate(aff.firstSight)}\n> ${isMain}`;
        }).join('\n\n')
    });
    }

    // Affiliations passées
    if (data.oldAffiliations.length > 0) {
    embed.addFields({
        name: '⚪ Anciennes affiliations',
        value: data.oldAffiliations.map(aff => {
        return `**${aff.orgSID}**\n> 🎖️ Grade : ${aff.rank}\n> 📅 Du ${formatDate(aff.firstSight)} au ${formatDate(aff.LastSight)}\n> 🔙 Statut : Ancien membre`;
        }).join('\n\n')
    });
    } else {
    embed.addFields({
        name: '⚪ Anciennes affiliations',
        value: '_Aucune affiliation antérieure enregistrée._'
    });
    }
    return embed
};