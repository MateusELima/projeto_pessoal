/* =========================================
   DADOS
========================================= */

let treinos =
    JSON.parse(localStorage.getItem("treinos")) || [];


let exerciciosSemana =
    JSON.parse(localStorage.getItem("exerciciosSemana")) || {};


let nomesTreinos =
    JSON.parse(localStorage.getItem("nomesTreinos")) || {};


const nomesDias = {

    segunda: "Segunda-feira",
    terca: "Terça-feira",
    quarta: "Quarta-feira",
    quinta: "Quinta-feira",
    sexta: "Sexta-feira",
    sabado: "Sábado",
    domingo: "Domingo"

};


let diaEdicao = null;

let indiceEdicao = null;


/* =========================================
   PREPARAR DIAS
========================================= */

function prepararDias() {

    Object.keys(nomesDias).forEach(

        function(dia) {

            if (!exerciciosSemana[dia]) {

                exerciciosSemana[dia] = [];

            }

        }

    );

}


prepararDias();


/* =========================================
   SALVAR EXERCÍCIOS
========================================= */

function salvarExercicios() {

    localStorage.setItem(
        "exerciciosSemana",
        JSON.stringify(exerciciosSemana)
    );

}


/* =========================================
   MOSTRAR CADASTRO
========================================= */

function mostrarCadastroExercicio() {

    const caixa =
        document.getElementById(
            "cadastroExercicio"
        );


    if (caixa.style.display === "block") {

        caixa.style.display = "none";

    }

    else {

        caixa.style.display = "block";


        const diaAtual =
            document.getElementById(
                "diaTreino"
            ).value;


        document.getElementById(
            "diaNovoExercicio"
        ).value = diaAtual;


        document.getElementById(
            "novoExercicio"
        ).focus();

    }

}


/* =========================================
   CADASTRAR EXERCÍCIO
========================================= */

function cadastrarExercicio() {

    const nome =
        document
            .getElementById(
                "novoExercicio"
            )
            .value
            .trim();


    const dia =
        document.getElementById(
            "diaNovoExercicio"
        ).value;


    if (nome === "") {

        alert(
            "Digite o nome do exercício."
        );

        return;

    }


    const existe =
        exerciciosSemana[dia].some(

            function(exercicio) {

                return (
                    exercicio.toLowerCase()
                    ===
                    nome.toLowerCase()
                );

            }

        );


    if (existe) {

        alert(
            "Esse exercício já existe nesse dia."
        );

        return;

    }


    exerciciosSemana[dia].push(nome);


    salvarExercicios();


    document.getElementById(
        "novoExercicio"
    ).value = "";


    document.getElementById(
        "cadastroExercicio"
    ).style.display = "none";


    document.getElementById(
        "diaTreino"
    ).value = dia;


    carregarExerciciosDoDia();

    atualizarFichaSemanal();


    alert(
        "Exercício cadastrado!"
    );

}


/* =========================================
   CARREGAR EXERCÍCIOS DO DIA
========================================= */

function carregarExerciciosDoDia() {

    const dia =
        document.getElementById(
            "diaTreino"
        ).value;


    const select =
        document.getElementById(
            "exercicio"
        );


    select.innerHTML = "";


    const exercicios =
        exerciciosSemana[dia];


    if (exercicios.length === 0) {

        const option =
            document.createElement(
                "option"
            );


        option.value = "";

        option.textContent =
            "Nenhum exercício cadastrado";


        select.appendChild(
            option
        );

    }

    else {

        exercicios.forEach(

            function(nome) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value = nome;

                option.textContent = nome;


                select.appendChild(
                    option
                );

            }

        );

    }


    document.getElementById(
        "nomeTreino"
    ).value =
        nomesTreinos[dia] || "";


    mostrarUltimoTreino();

}


/* =========================================
   ÚLTIMO TREINO
========================================= */

function mostrarUltimoTreino() {

    const exercicio =
        document.getElementById(
            "exercicio"
        ).value;


    const container =
        document.getElementById(
            "conteudoUltimoTreino"
        );


    if (!exercicio) {

        container.innerHTML = `

            <p class="semHistorico">
                Nenhum exercício selecionado.
            </p>

        `;

        return;

    }


    /*
       Como os novos treinos são adicionados
       no início do array com unshift(),
       o primeiro encontrado é o mais recente.
    */

    const ultimoTreino =
        treinos.find(

            function(treino) {

                return (
                    treino.exercicio === exercicio
                );

            }

        );


    if (!ultimoTreino) {

        container.innerHTML = `

            <p class="semHistorico">

                Nenhum treino registrado
                para este exercício.

            </p>

        `;

        return;

    }


    let seriesHTML = "";


    if (
        Array.isArray(
            ultimoTreino.repeticoes
        )
    ) {

        ultimoTreino.repeticoes.forEach(

            function(
                repeticao,
                indice
            ) {

                let peso = "-";


                if (
                    Array.isArray(
                        ultimoTreino.pesos
                    )
                ) {

                    peso =
                        ultimoTreino.pesos[indice];

                }


                seriesHTML += `

                    <div class="ultimoTreinoSerie">

                        <span>
                            Série ${indice + 1}
                        </span>

                        <strong>

                            ${repeticao} reps

                            ${peso !== undefined && peso !== "-"
                                ? `× ${peso} kg`
                                : ""
                            }

                        </strong>

                    </div>

                `;

            }

        );

    }


    let horario = "";


    if (ultimoTreino.horario) {

        horario =
            ` às ${ultimoTreino.horario}`;

    }


    let volumeHTML = "";


    if (
        ultimoTreino.volume !== undefined
        &&
        !isNaN(
            Number(
                ultimoTreino.volume
            )
        )
    ) {

        volumeHTML = `

            <div class="ultimoTreinoVolume">

                Volume:

                <strong>

                    ${Number(
                        ultimoTreino.volume
                    ).toFixed(0)} kg

                </strong>

            </div>

        `;

    }


    container.innerHTML = `

        <div class="ultimoTreinoData">

            ${ultimoTreino.data}${horario}

        </div>


        ${seriesHTML}


        ${volumeHTML}

    `;

}


/* =========================================
   SALVAR NOME DO TREINO
========================================= */

function salvarNomeTreino() {

    const dia =
        document.getElementById(
            "diaTreino"
        ).value;


    const nome =
        document
            .getElementById(
                "nomeTreino"
            )
            .value
            .trim();


    nomesTreinos[dia] = nome;


    localStorage.setItem(
        "nomesTreinos",
        JSON.stringify(nomesTreinos)
    );


    atualizarFichaSemanal();


    alert(
        "Nome do treino salvo!"
    );

}


/* =========================================
   EDITAR EXERCÍCIO
========================================= */

function editarExercicio(
    dia,
    indice
) {

    diaEdicao = dia;

    indiceEdicao = indice;


    const nome =
        exerciciosSemana[dia][indice];


    document.getElementById(
        "editarNomeExercicio"
    ).value = nome;


    document.getElementById(
        "editarDiaExercicio"
    ).value = dia;


    document.getElementById(
        "modalEdicao"
    ).style.display = "flex";

}


/* =========================================
   FECHAR EDIÇÃO
========================================= */

function fecharEdicao() {

    document.getElementById(
        "modalEdicao"
    ).style.display = "none";


    diaEdicao = null;

    indiceEdicao = null;

}


/* =========================================
   SALVAR EDIÇÃO
========================================= */

function salvarEdicaoExercicio() {

    if (
        diaEdicao === null
        ||
        indiceEdicao === null
    ) {

        return;

    }


    const novoNome =
        document
            .getElementById(
                "editarNomeExercicio"
            )
            .value
            .trim();


    const novoDia =
        document.getElementById(
            "editarDiaExercicio"
        ).value;


    if (novoNome === "") {

        alert(
            "Digite o nome do exercício."
        );

        return;

    }


    const duplicado =
        exerciciosSemana[novoDia].some(

            function(
                exercicio,
                indice
            ) {

                if (
                    novoDia === diaEdicao
                    &&
                    indice === indiceEdicao
                ) {

                    return false;

                }


                return (
                    exercicio.toLowerCase()
                    ===
                    novoNome.toLowerCase()
                );

            }

        );


    if (duplicado) {

        alert(
            "Já existe um exercício com esse nome nesse dia."
        );

        return;

    }


    exerciciosSemana[diaEdicao]
        .splice(
            indiceEdicao,
            1
        );


    exerciciosSemana[novoDia]
        .push(
            novoNome
        );


    salvarExercicios();


    fecharEdicao();

    carregarExerciciosDoDia();

    atualizarFichaSemanal();


    alert(
        "Exercício alterado com sucesso!"
    );

}


/* =========================================
   EXCLUIR EXERCÍCIO
========================================= */

function excluirExercicio(
    dia,
    indice
) {

    const nome =
        exerciciosSemana[dia][indice];


    const confirmar =
        confirm(
            `Deseja excluir "${nome}" da sua ficha?`
        );


    if (!confirmar) {

        return;

    }


    exerciciosSemana[dia]
        .splice(
            indice,
            1
        );


    salvarExercicios();

    carregarExerciciosDoDia();

    atualizarFichaSemanal();

}


/* =========================================
   GERAR SÉRIES
========================================= */

function gerarSeries() {

    const quantidade =
        parseInt(
            document.getElementById(
                "series"
            ).value
        );


    const container =
        document.getElementById(
            "camposSeries"
        );


    container.innerHTML = "";


    for (
        let i = 1;
        i <= quantidade;
        i++
    ) {

        const linha =
            document.createElement(
                "div"
            );


        linha.className =
            "linhaSerie";


        linha.innerHTML = `

            <div class="numeroSerie">

                Série ${i}

            </div>


            <div class="campoSerie">

                <label>
                    Repetições
                </label>

                <input
                    type="number"
                    min="1"
                    placeholder="12"
                    class="repeticaoSerie"
                >

            </div>


            <div class="campoSerie">

                <label>
                    Peso (kg)
                </label>

                <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="30"
                    class="pesoSerie"
                >

            </div>

        `;


        container.appendChild(
            linha
        );

    }

}


/* =========================================
   REGISTRAR TREINO
========================================= */

function registrarTreino() {

    const dia =
        document.getElementById(
            "diaTreino"
        ).value;


    const exercicio =
        document.getElementById(
            "exercicio"
        ).value;


    const quantidadeSeries =
        parseInt(
            document.getElementById(
                "series"
            ).value
        );


    if (exercicio === "") {

        alert(
            "Cadastre um exercício primeiro."
        );

        return;

    }


    const camposRepeticoes =
        document.querySelectorAll(
            ".repeticaoSerie"
        );


    const camposPesos =
        document.querySelectorAll(
            ".pesoSerie"
        );


    let repeticoes = [];

    let pesos = [];

    let volume = 0;


    for (
        let i = 0;
        i < quantidadeSeries;
        i++
    ) {

        const repeticao =
            parseInt(
                camposRepeticoes[i].value
            );


        const peso =
            parseFloat(
                camposPesos[i].value
            );


        if (
            isNaN(repeticao)
            ||
            repeticao <= 0
            ||
            isNaN(peso)
            ||
            peso < 0
        ) {

            alert(
                "Preencha peso e repetições de todas as séries."
            );

            return;

        }


        repeticoes.push(
            repeticao
        );


        pesos.push(
            peso
        );


        volume +=
            repeticao * peso;

    }


    const agora =
        new Date();


    const treino = {

        data:
            agora.toLocaleDateString(
                "pt-BR"
            ),

        horario:
            agora.toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        dia: dia,

        exercicio: exercicio,

        series: quantidadeSeries,

        repeticoes: repeticoes,

        pesos: pesos,

        volume: volume

    };


    treinos.unshift(
        treino
    );


    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );


    mostrarResultado(
        treino
    );


    atualizarTabela();


    mostrarUltimoTreino();


    limparSeries();

}


/* =========================================
   RESULTADO
========================================= */

function mostrarResultado(
    treino
) {

    const resultado =
        document.getElementById(
            "resultado"
        );


    let detalhes = "";


    for (
        let i = 0;
        i < treino.series;
        i++
    ) {

        detalhes += `

            <p>

                Série ${i + 1}:

                <strong>

                    ${treino.repeticoes[i]} reps

                    ×

                    ${treino.pesos[i]} kg

                </strong>

            </p>

        `;

    }


    const menorRepeticao =
        Math.min(
            ...treino.repeticoes
        );


    let mensagem = "";


    if (
        menorRepeticao >= 12
    ) {

        mensagem =
            "Você atingiu 12 ou mais repetições em todas as séries. Pode considerar uma progressão de carga no próximo treino.";

    }

    else if (
        menorRepeticao >= 8
    ) {

        mensagem =
            "Mantenha a carga e tente aumentar as repetições.";

    }

    else {

        mensagem =
            "Uma das séries ficou abaixo de 8 repetições. Considere manter a carga antes de aumentar.";

    }


    resultado.innerHTML = `

        <h3>
            ${treino.exercicio}
        </h3>


        <p>
            ${nomesDias[treino.dia]}
        </p>


        <br>


        ${detalhes}


        <br>


        <p>
            ${mensagem}
        </p>


        <br>


        <p>

            Volume total:

            <strong>

                ${treino.volume.toFixed(0)} kg

            </strong>

        </p>

    `;


    resultado.style.display =
        "block";

}


/* =========================================
   FICHA SEMANAL
========================================= */

function atualizarFichaSemanal() {

    const ficha =
        document.getElementById(
            "fichaSemanal"
        );


    ficha.innerHTML = "";


    Object.keys(nomesDias)
        .forEach(

            function(dia) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "diaSemana";


                const nomeTreino =
                    nomesTreinos[dia]
                    ||
                    "Treino não definido";


                let exerciciosHTML = "";


                if (
                    exerciciosSemana[dia]
                        .length === 0
                ) {

                    exerciciosHTML = `

                        <p class="semHistorico">

                            Nenhum exercício cadastrado.

                        </p>

                    `;

                }

                else {

                    exerciciosSemana[dia]
                        .forEach(

                            function(
                                exercicio,
                                indice
                            ) {

                                exerciciosHTML += `

                                    <div class="itemExercicio">


                                        <span class="nomeExercicioSemana">

                                            ${exercicio}

                                        </span>


                                        <div class="acoesExercicio">


                                            <button
                                                class="btnEditar"
                                                onclick="editarExercicio('${dia}', ${indice})"
                                            >

                                                ✏️ Editar

                                            </button>


                                            <button
                                                class="btnExcluir"
                                                onclick="excluirExercicio('${dia}', ${indice})"
                                            >

                                                🗑️

                                            </button>


                                        </div>

                                    </div>

                                `;

                            }

                        );

                }


                card.innerHTML = `

                    <h3>
                        ${nomesDias[dia]}
                    </h3>


                    <p class="nomeTreinoSemana">

                        ${nomeTreino}

                    </p>


                    ${exerciciosHTML}

                `;


                ficha.appendChild(
                    card
                );

            }

        );

}


/* =========================================
   HISTÓRICO
========================================= */

function atualizarTabela() {

    const lista =
        document.getElementById(
            "listaTreinos"
        );


    lista.innerHTML = "";


    treinos.forEach(

        function(treino) {

            const linha =
                document.createElement(
                    "tr"
                );


            let detalhes = "";


            if (
                Array.isArray(
                    treino.pesos
                )
                &&
                Array.isArray(
                    treino.repeticoes
                )
            ) {

                for (
                    let i = 0;
                    i < treino.repeticoes.length;
                    i++
                ) {

                    detalhes +=
                        `${treino.repeticoes[i]} reps × ${treino.pesos[i]} kg`;


                    if (
                        i <
                        treino.repeticoes.length - 1
                    ) {

                        detalhes += "<br>";

                    }

                }

            }

            else {

                detalhes =
                    Array.isArray(
                        treino.repeticoes
                    )
                        ?
                        treino.repeticoes.join(
                            " / "
                        )
                        :
                        treino.repeticoes || "-";

            }


            let volume = "-";


            if (
                treino.volume !== undefined
                &&
                !isNaN(
                    Number(
                        treino.volume
                    )
                )
            ) {

                volume =
                    `${Number(
                        treino.volume
                    ).toFixed(0)} kg`;

            }


            linha.innerHTML = `

                <td>
                    ${treino.data || "-"}
                </td>

                <td>
                    ${nomesDias[treino.dia] || "-"}
                </td>

                <td>
                    ${treino.exercicio || "-"}
                </td>

                <td>
                    ${treino.series || "-"}
                </td>

                <td>
                    ${detalhes}
                </td>

                <td>
                    ${volume}
                </td>

            `;


            lista.appendChild(
                linha
            );

        }

    );

}


/* =========================================
   LIMPAR CAMPOS DAS SÉRIES
========================================= */

function limparSeries() {

    document
        .querySelectorAll(
            ".repeticaoSerie"
        )
        .forEach(

            function(input) {

                input.value = "";

            }

        );


    document
        .querySelectorAll(
            ".pesoSerie"
        )
        .forEach(

            function(input) {

                input.value = "";

            }

        );

}


/* =========================================
   BACKUP COMPLETO
========================================= */

function fazerBackup() {

    const backup = {

        versao: 1,

        dataBackup:
            new Date().toLocaleString(
                "pt-BR"
            ),

        treinos:
            treinos,

        exerciciosSemana:
            exerciciosSemana,

        nomesTreinos:
            nomesTreinos

    };


    const conteudo =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [conteudo],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    const agora =
        new Date();


    const dia =
        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        );


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const ano =
        agora.getFullYear();


    link.href = url;


    link.download =
        `backup_treinos_${dia}-${mes}-${ano}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================
   SELECIONAR BACKUP
========================================= */

function selecionarBackup() {

    const input =
        document.getElementById(
            "arquivoBackup"
        );


    input.value = "";

    input.click();

}


/* =========================================
   RESTAURAR BACKUP
========================================= */

function restaurarBackup(
    event
) {

    const arquivo =
        event.target.files[0];


    if (!arquivo) {

        return;

    }


    const leitor =
        new FileReader();


    leitor.onload =
        function(evento) {

            try {

                const backup =
                    JSON.parse(
                        evento.target.result
                    );


                if (
                    !Array.isArray(
                        backup.treinos
                    )
                    ||
                    typeof backup.exerciciosSemana
                    !== "object"
                    ||
                    typeof backup.nomesTreinos
                    !== "object"
                ) {

                    alert(
                        "Esse arquivo não parece ser um backup válido."
                    );

                    return;

                }


                const confirmar =
                    confirm(

                        "Restaurar esse backup?\n\n" +

                        "Os dados atuais serão substituídos pelos dados do arquivo."

                    );


                if (!confirmar) {

                    return;

                }


                treinos =
                    backup.treinos;


                exerciciosSemana =
                    backup.exerciciosSemana;


                nomesTreinos =
                    backup.nomesTreinos;


                prepararDias();


                localStorage.setItem(
                    "treinos",
                    JSON.stringify(
                        treinos
                    )
                );


                localStorage.setItem(
                    "exerciciosSemana",
                    JSON.stringify(
                        exerciciosSemana
                    )
                );


                localStorage.setItem(
                    "nomesTreinos",
                    JSON.stringify(
                        nomesTreinos
                    )
                );


                carregarExerciciosDoDia();

                atualizarFichaSemanal();

                atualizarTabela();

                mostrarUltimoTreino();


                document.getElementById(
                    "resultado"
                ).style.display =
                    "none";


                alert(
                    "Backup restaurado com sucesso!"
                );

            }

            catch (erro) {

                alert(

                    "Não foi possível restaurar o arquivo.\n\n" +

                    "Verifique se selecionou o arquivo JSON correto."

                );

            }

        };


    leitor.readAsText(
        arquivo
    );

}


/* =========================================
   EXPORTAR HISTÓRICO TXT
========================================= */

function exportarHistoricoTXT() {

    if (
        treinos.length === 0
    ) {

        alert(
            "Você ainda não possui treinos no histórico."
        );

        return;

    }


    let texto = "";


    texto +=
        "========================================\n";

    texto +=
        "HISTÓRICO DE TREINOS\n";

    texto +=
        "========================================\n\n";


    treinos.forEach(

        function(
            treino,
            indice
        ) {

            texto +=
                `TREINO ${indice + 1}\n`;


            texto +=
                `Data: ${treino.data || "-"}`;


            if (
                treino.horario
            ) {

                texto +=
                    ` - ${treino.horario}`;

            }


            texto += "\n";


            texto +=
                `Dia: ${nomesDias[treino.dia] || treino.dia || "-"}\n`;


            /*
               O nome atual da ficha é usado
               somente como informação adicional.
            */

            const nomeTreino =
                nomesTreinos[
                    treino.dia
                ];


            if (
                nomeTreino
            ) {

                texto +=
                    `Treino: ${nomeTreino}\n`;

            }


            texto +=
                `Exercício: ${treino.exercicio || "-"}\n\n`;


            if (
                Array.isArray(
                    treino.repeticoes
                )
            ) {

                treino.repeticoes
                    .forEach(

                        function(
                            repeticao,
                            i
                        ) {

                            let peso = "-";


                            if (
                                Array.isArray(
                                    treino.pesos
                                )
                            ) {

                                peso =
                                    treino.pesos[i];

                            }


                            texto +=
                                `Série ${i + 1}: ` +
                                `${repeticao} repetições`;


                            if (
                                peso !== undefined
                                &&
                                peso !== "-"
                            ) {

                                texto +=
                                    ` - ${peso} kg`;

                            }


                            texto += "\n";

                        }

                    );

            }


            texto += "\n";


            if (
                treino.volume !== undefined
                &&
                !isNaN(
                    Number(
                        treino.volume
                    )
                )
            ) {

                texto +=
                    `Volume total: ${Number(
                        treino.volume
                    ).toFixed(0)} kg\n`;

            }


            texto +=
                "----------------------------------------\n\n";

        }

    );


    const blob =
        new Blob(
            [texto],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    const agora =
        new Date();


    const dia =
        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        );


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const ano =
        agora.getFullYear();


    link.href =
        url;


    link.download =
        `historico_treinos_${dia}-${mes}-${ano}.txt`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================
   LIMPAR HISTÓRICO
========================================= */

function limparHistorico() {

    const confirmar =
        confirm(

            "Deseja realmente apagar todo o histórico?\n\n" +

            "Recomendo fazer um backup antes."

        );


    if (!confirmar) {

        return;

    }


    treinos = [];


    localStorage.removeItem(
        "treinos"
    );


    atualizarTabela();

    mostrarUltimoTreino();


    document.getElementById(
        "resultado"
    ).style.display =
        "none";

}


/* =========================================
   INICIAR
========================================= */

carregarExerciciosDoDia();

gerarSeries();

atualizarFichaSemanal();

atualizarTabela();

mostrarUltimoTreino();
