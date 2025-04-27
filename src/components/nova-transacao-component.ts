const elementoFormulario = document.querySelector(".block-nova-transacao form") as HTMLFormElement;

elementoFormulario.addEventListener("submit", function(event) {
    event.preventDefault();
    if (!elementoFormulario.checkValidity()) {
        alert("Por favor, preencha todos os campos da transação!");
        return;
    }


    const inputTipoTransacao = elementoFormulario.querySelector("#tipoTransacao") as HTMLSelectElement;
    const inputValorTransacao = elementoFormulario.querySelector("#valor") as HTMLInputElement;
    const inpuDataTransacao = elementoFormulario.querySelector("#data") as HTMLInputElement;

    let tipoTransacao: TipoTransacao = inputTipoTransacao.value as TipoTransacao;
    let valor: number = inputValorTransacao.valueAsNumber;
    let data: Date = new Date(inpuDataTransacao.value);

    if (tipoTransacao == TipoTransacao.DEPOSITO) {
        saldo += valor;
    } else if (tipoTransacao == TipoTransacao.TRANSFERENCIA || TipoTransacao.PAGAMENTO_BOLETO) {
        saldo -= valor;
    } else {
        alert("Tipo de transação é inválido!");
        return;
    }

    elementoSaldo.textContent = formatarMoeda(saldo);

    const novaTransacao: Transacao = {
        tipoTransacao: tipoTransacao,
        valor: valor,
        data: data,
    }

    console.log(novaTransacao);
    elementoFormulario.reset();
});