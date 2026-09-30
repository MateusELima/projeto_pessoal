/* =========================================
   CARREGAR DADOS
========================================= */

let treinos =
    JSON.parse(
        localStorage.getItem("treinos")
    ) || [];


let exerciciosSemana =
    JSON.parse(
        localStorage.getItem("exerciciosSemana")
    ) || {};


let nomesTreinos =
    JSON.parse(
        localStorage.getItem("nomesTreinos")
    ) || {};



/* =========================================
   DIAS DA SEMANA
========================================= */

const nomesDias = {

    segunda: "Segunda-feira",

    terca: "Terça-feira",

    quarta: "Quarta-feira",

    quinta: "Quinta-feira",

    sexta: "Sexta-feira",

    sabado: "Sábado",

    domingo: "Domingo"

};



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
   MOSTRAR CADASTRO
========================================= */

function mostrarCadastroExercicio() {

    const cadastro =
        document.getElementById(
            "cadastroExercicio"
        );


    if (cadastro.style.display === "block") {

        cadastro.style.display = "none";

    }

    else {

        cadastro.style.display = "block";


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
            .getElementById("novoExercicio")
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
            "Esse exercício já está cadastrado nesse dia."
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
        "Exercício cadastrado com sucesso!"
    );

}



/* =========================================
   SALVAR EXERCÍCIOS
========================================= */

function salvarExercicios() {

    localStorage.setItem(

        "exerciciosSemana",

        JSON.stringify(
            exerciciosSemana
        )

    );

}



/* =========================================
   EXERCÍCIOS DO DIA
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


        select.appendChild(option);

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


                select.appendChild(option);

            }

        );

    }


    document.getElementById(
        "nomeTreino"
    ).value =
        nomesTreinos[dia] || "";

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
            .getElementById("nomeTreino")
            .value
            .trim();


    nomesTreinos[dia] = nome;


    localStorage.setItem(

        "nomesTreinos",

        JSON.stringify(
            nomesTreinos
        )

    );


    atualizarFichaSemanal();


    alert(
        "Nome do treino salvo!"
    );

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
            "Cadastre um exercício para esse dia primeiro."
        );

        return;

    }


    const inputsRepeticoes =
        document.querySelectorAll(
            ".repeticaoSerie"
        );


    const inputsPesos =
        document.querySelectorAll(
            ".pesoSerie"
        );


    let repeticoes = [];

    let pesos = [];

    let volume = 0;

    let valido = true;


    for (
        let i = 0;
        i < quantidadeSeries;
        i++
    ) {

        const repeticao =
            parseInt(
                inputsRepeticoes[i].value
            );


        const peso =
            parseFloat(
                inputsPesos[i].value
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

            valido = false;

            break;

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


    if (!valido) {

        alert(
            "Informe as repetições e o peso de todas as séries."
        );

        return;

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

        JSON.stringify(
            treinos
        )

    );


    mostrarSugestao(
        treino
    );


    atualizarTabela();


    limparFormulario();

}



/* =========================================
   SUGESTÃO DE PROGRESSÃO
========================================= */

function mostrarSugestao(treino) {

    const resultado =
        document.getElementById(
            "resultado"
        );


    const menorRepeticao =
        Math.min(
            ...treino.repeticoes
        );


    let seriesHTML = "";


    for (
        let i = 0;
        i < treino.series;
        i++
    ) {

        seriesHTML += `

            <p>

                Série ${i + 1}:

                <strong>
                    ${treino.repeticoes[i]}
                    reps
                </strong>

                ×

                <strong>
                    ${treino.pesos[i]}
                    kg
                </strong>

            </p>

        `;

    }


    let mensagem = "";


    if (
        menorRepeticao >= 12
    ) {

        mensagem =
            "Você atingiu pelo menos 12 repetições em todas as séries. Pode considerar aumentar a carga no próximo treino.";

    }

    else if (
        menorRepeticao >= 8
    ) {

        mensagem =
            "Mantenha as cargas e tente aumentar as repetições antes de subir o peso.";

    }

    else {

        mensagem =
            "Uma das séries ficou abaixo de 8 repetições. Considere manter ou reduzir a carga dessa série.";

    }


    resultado.style.display =
        "block";


    resultado.innerHTML = `

        <h3>
            ${treino.exercicio}
        </h3>


        <p>

            <strong>

                ${nomesDias[treino.dia]}

            </strong>

        </p>


        <br>


        ${seriesHTML}


        <br>


        <p>

            ${mensagem}

        </p>


        <br>


        <p>

            Volume total:

            <strong>

                ${treino.volume.toFixed(0)}
                kg

            </strong>

        </p>

    `;

}



/* =========================================
   ATUALIZAR HISTÓRICO
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


            let detalhesSeries = "";


            if (
                Array.isArray(
                    treino.repeticoes
                )
                &&
                Array.isArray(
                    treino.pesos
                )
            ) {

                for (
                    let i = 0;
                    i < treino.repeticoes.length;
                    i++
                ) {

                    detalhesSeries +=

                        `${treino.repeticoes[i]} reps × ${treino.pesos[i]} kg`;


                    if (
                        i <
                        treino.repeticoes.length - 1
                    ) {

                        detalhesSeries +=
                            "<br>";

                    }

                }

            }

            else {

                /*
                REGISTROS ANTIGOS
                */

                detalhesSeries =
                    Array.isArray(
                        treino.repeticoes
                    )

                    ?

                    treino.repeticoes.join(
                        " / "
                    )

                    :

                    treino.repeticoes;

            }


            const nomeDia =
                nomesDias[treino.dia]
                ||
                "-";


            linha.innerHTML = `

                <td>

                    ${treino.data}

                </td>


                <td>

                    ${nomeDia}

                </td>


                <td>

                    ${treino.exercicio}

                </td>


                <td>

                    ${treino.series}

                </td>


                <td>

                    ${detalhesSeries}

                </td>


                <td>

                    ${Number(
                        treino.volume
                    ).toFixed(0)}
                    kg

                </td>

            `;


            lista.appendChild(
                linha
            );

        }

    );

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


    Object.keys(
        nomesDias
    ).forEach(

        function(dia) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "diaSemana";


            const exercicios =
                exerciciosSemana[dia];


            let listaExercicios =
                "";


            if (
                exercicios.length === 0
            ) {

                listaExercicios =
                    "<p>Nenhum exercício cadastrado.</p>";

            }

            else {

                listaExercicios =
                    "<ul>";


                exercicios.forEach(

                    function(exercicio) {

                        listaExercicios +=
                            `<li>${exercicio}</li>`;

                    }

                );


                listaExercicios +=
                    "</ul>";

            }


            const nomeTreino =
                nomesTreinos[dia]
                ||
                "Treino não definido";


            div.innerHTML = `

                <h3>

                    ${nomesDias[dia]}

                </h3>


                <p class="nomeTreinoSemana">

                    ${nomeTreino}

                </p>


                ${listaExercicios}

            `;


            ficha.appendChild(
                div
            );

        }

    );

}



/* =========================================
   LIMPAR FORMULÁRIO
========================================= */

function limparFormulario() {

    const repeticoes =
        document.querySelectorAll(
            ".repeticaoSerie"
        );


    const pesos =
        document.querySelectorAll(
            ".pesoSerie"
        );


    repeticoes.forEach(

        function(input) {

            input.value = "";

        }

    );


    pesos.forEach(

        function(input) {

            input.value = "";

        }

    );

}



/* =========================================
   LIMPAR HISTÓRICO
========================================= */

function limparHistorico() {

    const confirmar =
        confirm(
            "Deseja realmente apagar todo o histórico?"
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



/* =========================================
   INICIAR
========================================= */

carregarExerciciosDoDia();


gerarSeries();


atualizarTabela();


atualizarFichaSemanal();
