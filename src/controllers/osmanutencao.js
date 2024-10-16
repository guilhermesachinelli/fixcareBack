const e = require('express');
const pool = require('../config/dbConfig');
const moment = require('moment-timezone');

function formatarDataParaBrasileiro(dataISO, fusoHorario = 'America/Sao_Paulo') {
    // Verificar se dataISO é um objeto Date
    if (dataISO instanceof Date) {
        dataISO = dataISO.toISOString();
    }
    
    // Converter a data para o fuso horário especificado
    const dataNoFusoHorario = moment.tz(dataISO, fusoHorario);
    
    // Formatar a data no padrão brasileiro
    const dia = dataNoFusoHorario.format('DD');
    const mes = dataNoFusoHorario.format('MM');
    const ano = dataNoFusoHorario.format('YYYY');
    
    return `${dia}/${mes}/${ano}`;
}