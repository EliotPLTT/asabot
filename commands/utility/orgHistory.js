const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const { apiCall, formatDate } = require('../../utils.js');
const { apiEndPoint } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('orghistory')
		.setDescription('Last arrivals et departures in org')
        .addStringOption(option =>
            option.setName('sid')
                .setDescription('sid of org')
                .setRequired(true)),
	async execute(interaction) {
        const sid = interaction.options.getString('sid');
        const urlReq = apiEndPoint+"/db/STAT/orgHistory/"+sid;
        const jsonResponse = await apiCall(urlReq);

        const embedToSend = embedFromJson(jsonResponse)
        
		await interaction.reply({ embeds: [embedToSend], flags: MessageFlags.Ephemeral });
	},
};


function embedFromJson (data){
    const embed = new EmbedBuilder()
    .setTitle(`📥📤 Flux récents pour l'organisation ${data.SID}`)
    .setColor(0x00AEFF)
    .addFields(
      {
        name: '📥 Dernières entrées',
        value: data.lastEntries.length > 0 
          ? data.lastEntries.map(entry => `• **${entry.citizenHandle}** (depuis ${formatDate(entry.firstSight)})`).join('\n')
          : '_Aucune nouvelle entrée._',
        inline: false
      },
      {
        name: '📤 Derniers départs',
        value: data.lastDepartures.length > 0 
          ? data.lastDepartures.map(dep => `• **${dep.citizenHandle}** (parti le ${formatDate(dep.lastSight)})`).join('\n')
          : '_Aucun départ récent._',
        inline: false
      }
    )
    .setTimestamp();
    return embed
};