import { formatarData } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";
import Conta from "../types/Conta-antiga.js";
const elementoDataAcesso = document.querySelector(".block-saldo time");
renderizarDataDeAcesso();
function renderizarDataDeAcesso() {
    if (elementoDataAcesso !== null) {
        elementoDataAcesso.textContent = formatarData(Conta.getDataDeAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO);
    }
}
const DataComponent = {
    atualizar() {
        renderizarDataDeAcesso();
    }
};
export default DataComponent;
