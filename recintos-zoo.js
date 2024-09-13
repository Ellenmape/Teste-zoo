class Recinto {
    constructor(numero, bioma, tamanho) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanho = tamanho;
        this.animais = {};
    }

    adicionarAnimal(animal, quantidade) {
        if (!this.animais[animal]) {
            this.animais[animal] = 0;
        }
        this.animais[animal] += quantidade;
    }

    removerAnimal(animal, quantidade) {
        if (this.animais[animal]) {
            this.animais[animal] -= quantidade;
            if (this.animais[animal] <= 0) {
                delete this.animais[animal];
            }
        }
    }

    calcularEspacoLivre(animaisInfo) {
        let espaçoOcupado = 0;
        for (let [animal, qtd] of Object.entries(this.animais)) {
            espaçoOcupado += qtd * animaisInfo[animal].tamanho;
        }
        return this.tamanho - espaçoOcupado;
    }

    verificarBioma(biomaAnimal) {
        return Array.isArray(this.bioma) ? this.bioma.includes(biomaAnimal) : this.bioma === biomaAnimal;
    }

    podeAlocar(animal, quantidade, animaisInfo) {
        let espaçoNecessario = quantidade * animaisInfo[animal].tamanho;
        return this.verificarBioma(animaisInfo[animal].bioma) && this.calcularEspacoLivre(animaisInfo) >= espaçoNecessario;
    }
}

class RecintosZoo {
    constructor() {
        this.recintos = [
            new Recinto(1, 'savana', 10),
            new Recinto(2, 'floresta', 5),
            new Recinto(3, ['savana', 'rio'], 7),
            new Recinto(4, 'rio', 8),
            new Recinto(5, 'savana', 9)
        ];

        this.animaisInfo = {
            LEAO: { tamanho: 3, bioma: 'savana', grupo: 'Carnivoro' },
            LEOPARDO: { tamanho: 2, bioma: 'savana', grupo: 'Carnivoro' },
            CROCODILO: { tamanho: 3, bioma: 'rio', grupo: 'Carnivoro' },
            MACACO: { tamanho: 1, bioma: ['savana', 'floresta'], grupo: 'Herbivoro' },
            GAZELA: { tamanho: 2, bioma: 'savana', grupo: 'Herbivoro' },
            HIPOPOTAMO: { tamanho: 4, bioma: ['savana', 'rio'], grupo: 'Herbivoro' }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisInfo[animal]) {
            return { erro: "Animal inválido" };
        }
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        let recintosViaveis = [];
        let grupoAnimal = this.animaisInfo[animal].grupo;
        let animaisParaAlocar = quantidade;

        // Primeiro, alocamos os animais de acordo com as regras
        this.recintos.forEach(recinto => {
            if (recinto.podeAlocar(animal, animaisParaAlocar, this.animaisInfo)) {
                // Adiciona o animal ao recinto
                recinto.adicionarAnimal(animal, animaisParaAlocar);
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.calcularEspacoLivre(this.animaisInfo)} total: ${recinto.tamanho})`);
                animaisParaAlocar = 0; // Todos os animais foram alocados
            }
        });

        // Verifica se restaram animais para alocar
        if (animaisParaAlocar > 0) {
            if (animal === 'MACACO' && animaisParaAlocar === 1) {
                // Aloca o macaco que ficou sozinho
                this.recintos.forEach(recinto => {
                    if (recinto.podeAlocar(animal, 1, this.animaisInfo)) {
                        recinto.adicionarAnimal(animal, 1);
                        recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.calcularEspacoLivre(this.animaisInfo)} total: ${recinto.tamanho})`);
                    }
                });
            }
        }

        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}


module.exports = { RecintosZoo };