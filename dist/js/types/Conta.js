import { TipoTransacao } from "./TipoTransacao.js";
export class Conta {
    nome;
    saldo = JSON.parse(localStorage.getItem('saldo')) || 0;
    transacoes = JSON.parse(localStorage.getItem('transacoes'), (key, value) => {
        if (key === "data") {
            return new Date(value);
        }
        return value;
    }) || [];
    constructor(nome) {
        this.nome = nome;
    }
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(this.transacoes); //Cria uma copia de transacoes e retorna a lista pra ser usada por fora
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime()); // Compara as datas das transferencias e ordena pela mais recente
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
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
    getDataDeAcesso() {
        return new Date();
    }
    debitar(valor) {
        if (valor <= 0) {
            throw new Error("O valor a ser debitado deve ser maior que zero!");
        }
        if (valor > this.saldo) {
            throw new Error("Saldo Insuficiente!");
        }
        this.saldo -= valor;
        localStorage.setItem("saldo", this.saldo.toString());
    }
    depositar(valor) {
        if (valor <= 0) {
            throw new Error("O valor a ser depositado deve ser maior que zero!");
        }
        this.saldo += valor;
        localStorage.setItem("saldo", this.saldo.toString());
    }
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        }
        else {
            throw new Error("Tipo de transação é inválido!");
        }
        this.transacoes.push(novaTransacao);
        console.log(this.getGruposTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(this.transacoes));
    }
    resumoTransacoes() {
        const listaTotalTransacoes = [];
        const listaDeTransacoes = structuredClone(this.transacoes);
        const grupoDeposito = [];
        const grupoTransferencia = [];
        const grupoBoleto = [];
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
        console.log("Objeto esperado:", listaTotalTransacoes);
    }
}
const conta = new Conta("Joana da Silva Oliv");
export default conta;
