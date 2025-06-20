
async function avaliar() {
  const sexo = document.getElementById("sexo").value;
  const idadeAnos = parseFloat(document.getElementById("idadeAnos").value);
  const idadeMeses = parseFloat(document.getElementById("idadeMeses").value);
  const idade = (idadeAnos + idadeMeses / 12).toFixed(1);

  const altura = parseFloat(document.getElementById("altura").value);
  const alturaAnt = parseFloat(document.getElementById("alturaAnt").value);
  const intervaloMeses = parseFloat(document.getElementById("intervaloMeses").value);
  const pai = parseFloat(document.getElementById("pai").value);
  const mae = parseFloat(document.getElementById("mae").value);

  const idadeOsseaAnos = parseFloat(document.getElementById("idadeOsseaAnos").value);
  const idadeOsseaMeses = parseFloat(document.getElementById("idadeOsseaMeses").value);
  const idadeOssea = idadeOsseaAnos + idadeOsseaMeses / 12;
  const deltaIO = idadeOssea - idade;

  const alvo = sexo === "M" ? (pai + mae + 13) / 2 : (pai + mae - 13) / 2;
  const velocidade = (altura - alturaAnt) / (intervaloMeses / 12);
  let comentarioIO = "";
  if (deltaIO > 1) comentarioIO = "Idade óssea adiantada";
  else if (deltaIO < -1) comentarioIO = "Idade óssea atrasada";
  else comentarioIO = "Idade óssea normal";

  const response = await fetch('oms_estatura.json');
  const data = await response.json();

  function getPercentil(valor, referencia) {
    let p = "";
    for (let [chave, limite] of Object.entries(referencia)) {
      if (valor <= limite) {
        p = chave;
        break;
      }
    }
    return p || "> P97";
  }

  const idadeRef = data[sexo][idade] ? idade : Object.keys(data[sexo])[0];
  const percentilAtual = getPercentil(altura, data[sexo][idadeRef]);
  const percentilAlvo = getPercentil(alvo, data[sexo]["19.0"]);

  let diagnostico = "";
  let conduta = "";
  let exames = "";

  if (percentilAtual === "P3" && percentilAlvo === "P75" && comentarioIO === "Idade óssea normal") {
    diagnostico = "Baixa estatura desproporcional ao alvo genético";
    conduta = "Investigar causa de baixa estatura.";
    exames = "TSH, T4L, IGF-1, GH, celíaca, renal, hemograma.";
  } else if (percentilAtual === "P3" && comentarioIO === "Idade óssea atrasada") {
    diagnostico = "Atraso constitucional do crescimento";
    conduta = "Acompanhar crescimento com idade óssea.";
    exames = "Rx de mão e punho, monitoramento semestral.";
  } else if (comentarioIO === "Idade óssea adiantada") {
    diagnostico = "Puberdade precoce provável";
    conduta = "Encaminhar para avaliação endocrinológica.";
    exames = "LH, FSH, estradiol/testosterona, USG pélvico/testicular.";
  } else {
    diagnostico = "Compatível com alvo genético";
    conduta = "Acompanhamento clínico de rotina.";
    exames = "Sem necessidade no momento.";
  }

  const resultado = `
    <strong>Estatura alvo parental:</strong> ${alvo.toFixed(1)} cm (${percentilAlvo})<br>
    <strong>Altura atual:</strong> ${altura} cm (${percentilAtual})<br>
    <strong>Velocidade de crescimento:</strong> ${velocidade.toFixed(2)} cm/ano<br>
    <strong>Comentário sobre idade óssea:</strong> ${comentarioIO}<br><br>
    <strong>Diagnóstico provável:</strong> ${diagnostico}<br>
    <strong>Conduta sugerida:</strong> ${conduta}<br>
    <strong>Exames recomendados:</strong> ${exames}
  `;
  document.getElementById("resultado").innerHTML = resultado;
}
