const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const { apiCall, formatDate } = require('../../utils.js');
const { apiEndPoint } = require('../../config.json');
//const { json } = require('express');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('solde')
		.setDescription('Calcule le solde migratoire entre deux organisations')
        .addStringOption(option =>
            option.setName('sid1')
                .setDescription('SID of first org')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sid2')
                .setDescription('SID2 of second org')
                .setRequired(true)),
	async execute(interaction) {
        const SID1 = interaction.options.getString('sid1');
        const SID2 = interaction.options.getString('sid2');
        const urlReq = apiEndPoint+"/db/STAT/solde/"+SID1+"/"+SID2;
        const jsonResponse = await apiCall(urlReq);

        console.log(jsonResponse);
        console.log(jsonResponse.rows);
        if (jsonResponse.rows.length  == 0){
            const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000) // Rouge pour une erreur
            .setTitle('❌ Erreur')
            .setDescription('Aucun transfert enregistré entre les '+SID1+' et les '+SID2)
            .setFooter({ text: 'Veuillez réessayer plus tard.' })
            .setTimestamp();
            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
        }
        else{
            const embedToSend = embedFromJson(jsonResponse)
		    await interaction.reply({ embeds: [embedToSend], flags: MessageFlags.Ephemeral })
        }
	},
};


function embedFromJson (data){
    const embed = new EmbedBuilder()
    .setTitle('📊 Flux migratoires entre organisations')
    .setColor(data.solde >= 0 ? 0x00FF00 : 0xFF0000) // Vert si positif, Rouge si négatif
    .addFields(
        { name: '🔄 Transferts FCU ➔ REDACTED', value: `${data.fromAtoB} joueurs`, inline: true },
        { name: '🔄 Transferts REDACTED ➔ FCU', value: `${data.fromBtoA} joueurs`, inline: true },
        { name: '🧮 Solde Net', value: `${data.solde > 0 ? '+' : ''}${data.solde}`, inline: true }
    )
    .addFields(
        { name: '👥 Joueurs de FCU vers REDACTED', value: data.rows[0].citizens.split(',').map(name => `• ${name}`).join('\n'), inline: false },
        { name: '👥 Joueurs de REDACTED vers FCU', value: data.rows[1].citizens.split(',').map(name => `• ${name}`).join('\n'), inline: false }
    )
    .setTimestamp();
    return embed
};