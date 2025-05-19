import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
export const transacoes: Transacao[] = JSON.parse(localStorage.getItem("transacoes"), (key: string, value: string) => {
    if (key == "data") {
        return new Date(value);
    }

    return value;
}) || [];


function debitar(valor: number): void {
    if (valor <= 0) {
        throw new Error("O valor a ser debitado deve ser maior que zero!");
    }
    if (valor > saldo) {
        throw new Error("Saldo Insuficiente!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}

function depositar(valor: number): void {
    if (valor <= 0) {
        throw new Error("O valor a ser depositado deve ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}

const Conta = {
    getSaldo() {
        return saldo;
    }, 

    getDataDeAcesso(): Date {
        return new Date;
    },

    getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(transacoes); //Cria uma copia de transacoes e retorna a lista pra ser usada por fora
        const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime()); // Compara as datas das transferencias e ordena pela mais recente
        let labelAtualGrupoTransacao: string = "";

        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", {month: "long", year: "numeric"});
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }

        return gruposTransacoes;
    },

    registrarTransacao(novaTransacao: Transacao): void {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
                depositar(novaTransacao.valor);
            } else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
                debitar(novaTransacao.valor);
                novaTransacao.valor *= -1;
            } else {
                throw new Error("Tipo de transação é inválido!");
            }

            transacoes.push(novaTransacao);
            console.log(this.getGruposTransacoes());
            localStorage.setItem("transacoes",  JSON.stringify(transacoes));
    },

    resumoTransacoes(): void {
        const listaTotalTransacoes: ResumoTransacoes[] = [];
        const listaDeTransacoes: Transacao[] = structuredClone(transacoes);

        const grupoDeposito: Transacao[] = [];
        const grupoTransferencia: Transacao[] = [];
        const grupoBoleto: Transacao[] = [];

        for (let transacao of listaDeTransacoes) {
            if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
                grupoDeposito.push(transacao);
            }
            if (transacao.tipoTransacao === TipoTransacao.TRANSFERENCIA) {
                grupoTransferencia.push(transacao);
            }
            if (transacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
                grupoBoleto.push(transacao);
            }
        }

        let valorTotalBoleto = 0;
        let valorTotalDeposito = 0;
        let valorTotalTransferencia = 0;

        for (let boleto of grupoBoleto) {
            valorTotalBoleto += boleto.valor;
        }
        for (let deposito of grupoDeposito) {
            valorTotalDeposito += deposito.valor;
        }
        for (let transferencia of grupoTransferencia) {
            valorTotalTransferencia += transferencia.valor;
        }

        listaTotalTransacoes.push({
            totalDepositos: valorTotalDeposito,
            totalPagamentosBoletos: valorTotalBoleto,
            totalTransferencias: valorTotalTransferencia
        });

        console.log("Objeto esperado:",listaTotalTransacoes);

    }
}

export default Conta;