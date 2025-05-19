import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

export class Conta {
    nome: string;
    saldo: number = JSON.parse(localStorage.getItem('saldo')) || 0;
    transacoes: Transacao[] = JSON.parse(localStorage.getItem('transacoes'), (key: string, value: any) => {
        if (key === "data") {
            return new Date(value);
        }

        return value;
    }) || [];

    constructor(nome: string) {
        this.nome = nome;
    }

    getGruposTransacoes(): GrupoTransacao[] {
        const gruposTransacoes: GrupoTransacao[] = [];
        const listaTransacoes: Transacao[] = structuredClone(this.transacoes); //Cria uma copia de transacoes e retorna a lista pra ser usada por fora
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
    }

    getSaldo() {
        return this.saldo;
    }

    getDataDeAcesso(): Date {
        return new Date();
    }

    debitar(valor: number): void {
        if (valor <= 0) {
            throw new Error("O valor a ser debitado deve ser maior que zero!");
        }
        if (valor > this.saldo) {
            throw new Error("Saldo Insuficiente!");
        }
        this.saldo -= valor;
        localStorage.setItem("saldo", this.saldo.toString());
    }

    depositar(valor: number): void {
        if (valor <= 0) {
            throw new Error("O valor a ser depositado deve ser maior que zero!");
        }
        this.saldo += valor;
        localStorage.setItem("saldo", this.saldo.toString());
    }

    registrarTransacao(novaTransacao: Transacao): void {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
                this.depositar(novaTransacao.valor);
            } else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
                this.debitar(novaTransacao.valor);
                novaTransacao.valor *= -1;
            } else {
                throw new Error("Tipo de transação é inválido!");
            }

            this.transacoes.push(novaTransacao);
            console.log(this.getGruposTransacoes());
            localStorage.setItem("transacoes",  JSON.stringify(this.transacoes));
    }

    resumoTransacoes(): void {
            const listaTotalTransacoes: ResumoTransacoes[] = [];
            const listaDeTransacoes: Transacao[] = structuredClone(this.transacoes);
    
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

const conta = new Conta("Joana da Silva Oliv");

export default conta;