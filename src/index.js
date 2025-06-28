const players = require('./players');


function getRandomPlayers(list) {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return [structuredClone(shuffled[0]), structuredClone(shuffled[1])];
}

const clone = obj => JSON.parse(JSON.stringify(obj));
const [player1, player2] = getRandomPlayers(players.map(clone));


const rollDice = async () => {
    return Math.floor(Math.random() * 6) + 1;
};

const getRandomBlock = async () => {
    let random = Math.random();
    let result = null;

    switch (true) {
        case random < 0.33:
            result = "RETA";
            break;
        case random < 0.66:
            result = "CURVA";
            break;
        default:
            result = "CONFRONTO";
    }
    return result;
};

const logRollResult = async (charName, block, diceResult, attribute) => {
    console.log(`🎲 ${charName} rolou em ${block}: ${diceResult} + ${attribute} = ${diceResult + attribute}`);
};

const playRaceEngine = async (char1, char2) => {
    for (let i = 1; i <= 5; i++) {
        console.log(`\n🏁 Rodada ${i}`);
        let block = await getRandomBlock();
        console.log(`📍 Bloco sorteado: ${block}`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            console.log(`➡️ Bloco de VELOCIDADE!`);
            totalTestSkill1 = diceResult1 + char1.vel;
            totalTestSkill2 = diceResult2 + char2.vel;

            await logRollResult(char1.name, "velocidade", diceResult1, char1.vel);
            await logRollResult(char2.name, "velocidade", diceResult2, char2.vel);

            if (totalTestSkill1 > totalTestSkill2) {
                char1.pts += 1;
                console.log(`🚀 ${char1.name} foi mais rápido e ganhou 1 ponto!`);
            } else if (totalTestSkill1 === totalTestSkill2) {
                console.log(`🤝 Empate de velocidade! Nenhum ponto foi marcado.`);
            } else {
                char2.pts += 1;
                console.log(`🚀 ${char2.name} foi mais rápido e ganhou 1 ponto!`);
            }
        }

        if (block === "CURVA") {
            console.log(`↩️ Bloco de MANOBRABILIDADE!`);
            totalTestSkill1 = diceResult1 + char1.man;
            totalTestSkill2 = diceResult2 + char2.man;

            await logRollResult(char1.name, "manobrabilidade", diceResult1, char1.man);
            await logRollResult(char2.name, "manobrabilidade", diceResult2, char2.man);

            if (totalTestSkill1 > totalTestSkill2) {
                char1.pts += 1;
                console.log(`🌀 ${char1.name} fez a melhor curva e ganhou 1 ponto!`);
            } else if (totalTestSkill1 === totalTestSkill2) {
                console.log(`🤝 Empate na curva! Nenhum ponto foi marcado.`);
            } else {
                char2.pts += 1;
                console.log(`🌀 ${char2.name} fez a melhor curva e ganhou 1 ponto!`);
            }
        }

        if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + char1.pwr;
            let powerResult2 = diceResult2 + char2.pwr;

            console.log(`⚔️ ${char1.name} confrontou ${char2.name}:`);
            await logRollResult(char1.name, "poder", diceResult1, char1.pwr);
            await logRollResult(char2.name, "poder", diceResult2, char2.pwr);

            if (powerResult1 > powerResult2) {
                console.log(`🏆 ${char1.name} venceu o confronto!`);
                if (char2.pts > 0) {
                    char2.pts -= 1;
                    console.log(`❌ ${char2.name} perdeu 1 ponto`);
                } else {
                    console.log(`⚠️ ${char2.name} não tinha pontos para perder`);
                }
            } else if (powerResult1 === powerResult2) {
                console.log(`🤝 Empate no confronto! Nenhum jogador perdeu ponto`);
            } else {
                console.log(`🏆 ${char2.name} venceu o confronto!`);
                if (char1.pts > 0) {
                    char1.pts -= 1;
                    console.log(`❌ ${char1.name} perdeu 1 ponto`);
                } else {
                    console.log(`⚠️ ${char1.name} não tinha pontos para perder`);
                }
            }
        }
    }

    console.log(`\n🏁 Corrida encerrada!`);
    console.log(`📊 Placar Final:`);
    console.log(`🔴 ${char1.name}: ${char1.pts} pontos`);
    console.log(`🟢 ${char2.name}: ${char2.pts} pontos`);

    if (player1.pts > player2.pts) {
        console.log(`🏆 ${char1.name} vendeu a corrida`);
    } else if (player1.pts == player2.pts){
        console.log(`🏆 a corrida terminou em um empate`)
    } else {
        console.log(`🏆 ${char2.name} vendeu a corrida`);
    }
};

(async () => {
    console.log(`🚦 Corrida entre ${player1.name} e ${player2.name} começando...\n`);
    await playRaceEngine(player1, player2);
})();
