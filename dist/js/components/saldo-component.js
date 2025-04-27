let saldo = 3000;
const elementoSaldo = document.querySelector(".saldo-valor .valor");
const elementoDataAcesso = document.querySelector(".block-saldo time");
if (elementoSaldo) {
    elementoSaldo.textContent = formatarMoeda(saldo);
}
if (elementoDataAcesso !== null) {
    const dataAtualAcesso = new Date();
    elementoDataAcesso.textContent = formatarData(dataAtualAcesso, FormatoData.DIA_SEMANA_DIA_MES_ANO);
}
