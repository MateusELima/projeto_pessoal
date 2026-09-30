/* ============================
   DADOS
============================ */

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


/* Exercício sendo editado */

let diaEdicao = null;
let indiceEdicao = null;


/* ============================
   PREPARAR DIAS
============================ */

function prepararDias() {

    Object.keys(nomesDias).forEach(function(dia) {

        if (!exerciciosSemana[dia]) {

            exerciciosSemana[dia] = [];

        }

    });

}

prepararDias();


/* ============================
   SALVAR DADOS
============================ */

function salvarExercicios() {

    localStorage.setItem(
        "exerciciosSemana",
        JSON.stringify(exerciciosSemana)
    );

}


/* ============================
   NOVO EXERCÍCIO
============================ */

function mostrarCadastroExercicio() {

    const caixa =
        document.getElementById("cadastroExercicio");

    if (caixa.style.display === "block") {

        caixa.style.display = "none";

    } else {

        caixa.style.display = "block";

        const diaAtual =
            document.getElementById("diaTreino").value;

        document.getElementById("diaNovoExercicio").value =
            diaAtual;

        document.getElementById("novoExercicio").focus();

    }

}


/* ============================
   CADASTRAR
============================ */

function cadastrarExercicio() {

    const nome =
        document
            .getElementById("novoExercicio")
            .value
            .trim();

    const dia =
        document.getElementById("diaNovoExercicio").value;


    if (nome === "") {

        alert("Digite o nome do exercício.");

        return;

    }


    const existe =
        exerciciosSemana[dia].some(function(exercicio) {

            return (
                exercicio.toLowerCase()
                ===
                nome.toLowerCase()
            );

        });


    if (existe) {

        alert(
            "Esse exercício já existe nesse dia."
        );

        return;

    }


    exerciciosSemana[dia].push(nome);

    salvarExercicios();


    document.getElementById("novoExercicio").value = "";

    document.getElementById("cadastroExercicio").style.display =
        "none";


    document.getElementById("diaTreino").value =
        dia;


    carregarExerciciosDoDia();

    atualizarFichaSemanal();


    alert("Exercício cadastrado!");

}


/* ============================
   CARREGAR EXERCÍCIOS DO DIA
============================ */

function carregarExerciciosDoDia() {

    const dia =
        document.getElementById("diaTreino").value;

    const select =
        document.getElementById("exercicio");


    select.innerHTML = "";


    const exercicios =
        exerciciosSemana[dia];


    if (exercicios.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Nenhum exercício cadastrado";

        select.appendChild(option);

    } else {

        exercicios.forEach(function(nome) {

            const option =
                document.createElement("option");

            option.value = nome;

            option.textContent = nome;

            select.appendChild(option);

        });

    }


    document.getElementById("nomeTreino").value =
        nomesTreinos[dia] || "";

}


/* ============================
   NOME DO TREINO
============================ */

function salvarNomeTreino() {

    const dia =
        document.getElementById("diaTreino").value;

    const nome =
        document
            .getElementById("nomeTreino")
            .value
            .trim();


    nomesTreinos[dia] = nome;


    localStorage.setItem(
        "nomesTreinos",
        JSON.stringify(nomesTreinos)
    );


    atualizarFichaSemanal();

    alert("Nome do treino salvo!");

}


/* ============================
   EDITAR EXERCÍCIO
============================ */

function editarExercicio(dia, indice) {

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


/* ============================
   FECHAR EDIÇÃO
============================ */

function fecharEdicao() {

    document.getElementById(
        "modalEdicao"
    ).style.display = "none";


    diaEdicao = null;

    indiceEdicao = null;

}


/* ============================
   SALVAR EDIÇÃO
============================ */

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
            .getElementById("editarNomeExercicio")
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


    const nomeAntigo =
        exerciciosSemana[diaEdicao][indiceEdicao];


    const duplicado =
        exerciciosSemana[novoDia].some(

            function(exercicio, indice) {

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


    /*
       Remove da posição antiga
    */

    exerciciosSemana[diaEdicao].splice(
        indiceEdicao,
        1
    );


    /*
       Adiciona no novo dia
    */

    exerciciosSemana[novoDia].push(
        novoNome
    );


    salvarExercicios();


    /*
       O histórico antigo NÃO é alterado.
       Assim você não perde o registro
       do nome utilizado naquele treino.
    */


    fecharEdicao();

    carregarExerciciosDoDia();

    atualizarFichaSemanal();


    alert(
        "Exercício alterado com sucesso!"
    );

}


/* ============================
   EXCLUIR EXERCÍCIO
============================ */

function excluirExercicio(dia, indice) {

    const nome =
        exerciciosSemana[dia][indice];


    const confirmar =
        confirm(
            `Deseja excluir "${nome}" da sua ficha?`
        );


    if (!confirmar) {

        return;

    }


    exerciciosSemana[dia].splice(
        indice,
        1
    );


    salvarExercicios();

    carregarExerciciosDoDia();

    atualizarFichaSemanal();

}


/* ============================
   GERAR SÉRIES
============================ */

function gerarSeries() {

    const quantidade =
        parseInt(
            document.getElementById("series").value
        );


    const container =
        document.getElementById("camposSeries");


    container.innerHTML = "";


    for (
        let i = 1;
        i <= quantidade;
        i++
    ) {

        const linha =
            document.createElement("div");


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


        container.appendChild(linha);

    }

}


/* ============================
   REGISTRAR TREINO
============================ */

function registrarTreino() {

    const dia =
        document.getElementById("diaTreino").value;


    const exercicio =
        document.getElementById("exercicio").value;


    const quantidadeSeries =
        parseInt(
            document.getElementById("series").value
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


        repeticoes.push(repeticao);

        pesos.push(peso);


        volume +=
            repeticao * peso;

    }


    const agora =
        new Date();


    const treino = {

        data:
            agora.toLocaleDateString("pt-BR"),

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


    treinos.unshift(treino);


    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );


    mostrarResultado(treino);

    atualizarTabela();

    limparSeries();

}


/* ============================
   RESULTADO
============================ */

function mostrarResultado(treino) {

    const resultado =
        document.getElementById("resultado");


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
        Math.min(...treino.repeticoes);


    let mensagem;


    if (menorRepeticao >= 12) {

        mensagem =
            "Bom desempenho. Você atingiu 12 ou mais repetições em todas as séries.";

    }

    else if (menorRepeticao >= 8) {

        mensagem =
            "Mantenha a carga e tente aumentar as repetições.";

    }

    else {

        mensagem =
            "Uma das séries ficou abaixo de 8 repetições.";

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

        <p>${mensagem}</p>

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


/* ============================
   FICHA SEMANAL
============================ */

function atualizarFichaSemanal() {

    const ficha =
        document.getElementById(
            "fichaSemanal"
        );


    ficha.innerHTML = "";


    Object.keys(nomesDias).forEach(

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
                exerciciosSemana[dia].length === 0
            ) {

                exerciciosHTML = `

                    <p>
                        Nenhum exercício cadastrado.
                    </p>

                `;

            }

            else {

                exerciciosSemana[dia].forEach(

                    function(exercicio, indice) {

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

                <div class="cabecalhoDia">

                    <h3>
                        ${nomesDias[dia]}
                    </h3>

                </div>


                <p class="nomeTreinoSemana">

                    ${nomeTreino}

                </p>


                ${exerciciosHTML}

            `;


            ficha.appendChild(card);

        }

    );

}


/* ============================
   HISTÓRICO
============================ */

function atualizarTabela() {

    const lista =
        document.getElementById(
            "listaTreinos"
        );


    lista.innerHTML = "";


    treinos.forEach(function(treino) {

        const linha =
            document.createElement("tr");


        let detalhes = "";


        if (
            Array.isArray(treino.pesos)
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
                Array.isArray(treino.repeticoes)
                    ?
                    treino.repeticoes.join(" / ")
                    :
                    treino.repeticoes;

        }


        linha.innerHTML = `

            <td>
                ${treino.data}
            </td>

            <td>
                ${nomesDias[treino.dia] || "-"}
            </td>

            <td>
                ${treino.exercicio}
            </td>

            <td>
                ${treino.series}
            </td>

            <td>
                ${detalhes}
            </td>

            <td>
                ${Number(treino.volume).toFixed(0)} kg
            </td>

        `;


        lista.appendChild(linha);

    });

}


/* ============================
   LIMPAR CAMPOS
============================ */

function limparSeries() {

    document
        .querySelectorAll(".repeticaoSerie")
        .forEach(function(input) {

            input.value = "";

        });


    document
        .querySelectorAll(".pesoSerie")
        .forEach(function(input) {

            input.value = "";

        });

}


/* ============================
   LIMPAR HISTÓRICO
============================ */

function limparHistorico() {

    const confirmar =
        confirm(
            "Deseja apagar todo o histórico?"
        );


    if (!confirmar) {

        return;

    }


    treinos = [];


    localStorage.removeItem(
        "treinos"
    );


    atualizarTabela();


    document.getElementById(
        "resultado"
    ).style.display = "none";

}


/* ============================
   INICIAR
============================ */

carregarExerciciosDoDia();

gerarSeries();

atualizarFichaSemanal();

atualizarTabela();
