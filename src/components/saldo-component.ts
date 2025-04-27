import { formatarData, formatarMoeda } from "../utils/formatters.js";
import { FormatoData } from "../types/FormatoData.js";

let saldo: number = 3000;

const elementoSaldo = document.querySelector(
  ".saldo-valor .valor"
) as HTMLElement;

const elementoDataAcesso = document.querySelector(".block-saldo time") as HTMLElement;


if (elementoDataAcesso !== null) {
    const dataAtualAcesso: Date = new Date();
    elementoDataAcesso.textContent = formatarData(dataAtualAcesso, FormatoData.DIA_SEMANA_DIA_MES_ANO);
}

export function getSaldo(): number {
  return saldo;
}

atualizarSaldo(saldo);
export function atualizarSaldo(novoSaldo: number): void {
  saldo = novoSaldo;
  if (elementoSaldo) {
    elementoSaldo.textContent = formatarMoeda(saldo);
  }
}