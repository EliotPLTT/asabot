const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const { apiCall, formatDate } = require('../../utils.js');
const { apiEndPoint } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('statdb')
		.setDescription('Give statistics about the DB'),
	async execute(interaction) {
        const urlReq = apiEndPoint+"/db/STAT/statDB";
        const jsonResponse = await apiCall(urlReq);
        const embedToSend = embedFromJson(jsonResponse)
        
		await interaction.reply({ embeds: [embedToSend]});
	},
};


function embedFromJson (data){
    const embed = new EmbedBuilder()
  .setTitle('📈 Statistiques de la base de données')
  .setColor(0x5865F2) // Bleu Discord
  .addFields(
    { name: '👥 Nombre de citoyens', value: `${data.nbCitizen}`, inline: true },
    { name: '🏢 Nombre d\'organisations', value: `${data.nbOrg}`, inline: true },
    { name: '🔗 Nombre d\'affiliations', value: `${data.nbAffiliation}`, inline: true },
    { name: '📅 Première affiliation enregistrée', value: `${data.firstAff}`, inline: true },
    { name: '📅 Dernière affiliation enregistrée', value: `${data.lastAff}`, inline: true }
  )
  .setTimestamp();
    return embed
};