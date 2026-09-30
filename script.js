/* =========================================
   DADOS
========================================= */

let treinos =
    JSON.parse(localStorage.getItem("treinos")) || [];


let exerciciosSemana =
    JSON.parse(localStorage.getItem("exerciciosSemana")) || {};


let nomesTreinos =
    JSON.parse(localStorage.getItem("nomesTreinos")) || {};



/* =========================================
   NOMES DOS DIAS
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
   GARANTIR DIAS
========================================= */

function prepararDias() {

    Object.keys(nomesDias).forEach(function(dia) {

        if (!exerciciosSemana[dia]) {

            exerciciosSemana[dia] = [];

        }

    });

}


prepararDias();



/* =========================================
   CADASTRO DE EXERCÍCIO
========================================= */

function mostrarCadastroExercicio() {

    const cadastro =
        document.getElementById("cadastroExercicio");


    if (cadastro.style.display === "block") {

        cadastro.style.display = "none";

    } else {

        cadastro.style.display = "block";


        const diaAtual =
            document.getElementById("diaTreino").value;


        document.getElementById("diaNovoExercicio").value =
            diaAtual;


        document.getElementById("novoExercicio").focus();

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
        document.getElementById("diaNovoExercicio").value;


    if (nome === "") {

        alert("Digite o nome do exercício.");

        return;

    }


    const jaExiste =
        exerciciosSemana[dia].some(function(exercicio) {

            return exercicio.toLowerCase() ===
                   nome.toLowerCase();

        });


    if (jaExiste) {

        alert(
            "Esse exercício já está cadastrado nesse dia."
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


    alert("Exercício cadastrado com sucesso!");

}



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
   CARREGAR EXERCÍCIOS DO DIA
========================================= */

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


    /* MOSTRAR NOME DO TREINO */

    document.getElementById("nomeTreino").value =
        nomesTreinos[dia] || "";

}



/* =========================================
   SALVAR NOME DO TREINO
========================================= */

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


    alert("Treino salvo!");

}



/* =========================================
   GERAR CAMPOS DAS SÉRIES
========================================= */

function gerarSeries() {

    const quantidade =
        parseInt(
            document.getElementById("series").value
        );


    const container =
        document.getElementById("camposSeries");


    container.innerHTML = "";


    for (let i = 1; i <= quantidade; i++) {

        const label =
            document.createElement("label");


        label.textContent =
            `Repetições - Série ${i}`;


        const input =
            document.createElement("input");


        input.type = "number";

        input.min = "1";

        input.placeholder = "Ex: 12";

        input.className = "repeticaoSerie";


        container.appendChild(label);

        container.appendChild(input);

    }

}



/* =========================================
   REGISTRAR TREINO
========================================= */

function registrarTreino() {

    const dia =
        document.getElementById("diaTreino").value;


    const exercicio =
        document.getElementById("exercicio").value;


    const carga =
        parseFloat(
            document.getElementById("carga").value
        );


    const quantidadeSeries =
        parseInt(
            document.getElementById("series").value
        );


    if (exercicio === "") {

        alert(
            "Cadastre um exercício para esse dia primeiro."
        );

        return;

    }


    if (isNaN(carga) || carga < 0) {

        alert("Informe uma carga válida.");

        return;

    }


    const inputs =
        document.querySelectorAll(".repeticaoSerie");


    let repeticoes = [];


    let valido = true;


    inputs.forEach(function(input) {

        const valor =
            parseInt(input.value);


        if (isNaN(valor) || valor <= 0) {

            valido = false;

        } else {

            repeticoes.push(valor);

        }

    });


    if (!valido) {

        alert(
            "Informe as repetições de todas as séries."
        );

        return;

    }


    const totalRepeticoes =
        repeticoes.reduce(function(total, valor) {

            return total + valor;

        }, 0);


    const volume =
        carga * totalRepeticoes;


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

        carga: carga,

        series: quantidadeSeries,

        repeticoes: repeticoes,

        volume: volume

    };


    treinos.unshift(treino);


    localStorage.setItem(
        "treinos",
        JSON.stringify(treinos)
    );


    mostrarSugestao(treino);


    atualizarTabela();


    limparFormulario();

}



/* =========================================
   PROGRESSÃO DE CARGA
========================================= */

function mostrarSugestao(treino) {

    const resultado =
        document.getElementById("resultado");


    const menorRepeticao =
        Math.min(...treino.repeticoes);


    let novaCarga =
        treino.carga;


    let mensagem = "";


    if (menorRepeticao >= 12) {

        novaCarga =
            treino.carga * 1.05;


        mensagem =
            "Você conseguiu pelo menos 12 repetições em todas as séries. Pode tentar aumentar a carga no próximo treino.";

    }

    else if (menorRepeticao >= 8) {

        mensagem =
            "Mantenha a carga e tente aumentar as repetições antes de subir o peso.";

    }

    else {

        novaCarga =
            treino.carga * 0.95;


        mensagem =
            "Uma das séries ficou abaixo de 8 repetições. Considere reduzir um pouco a carga.";

    }


    resultado.style.display =
        "block";


    resultado.innerHTML = `

        <h3>${treino.exercicio}</h3>

        <p>
            <strong>
                ${nomesDias[treino.dia]}
            </strong>
        </p>

        <br>

        <p>
            Carga utilizada:
            <strong>
                ${treino.carga} kg
            </strong>
        </p>

        <p>
            Repetições:
            <strong>
                ${treino.repeticoes.join(" / ")}
            </strong>
        </p>

        <br>

        <p>
            ${mensagem}
        </p>

        <br>

        <p>
            Próxima carga sugerida:
            <strong>
                ${novaCarga.toFixed(1)} kg
            </strong>
        </p>

    `;

}



/* =========================================
   HISTÓRICO
========================================= */

function atualizarTabela() {

    const lista =
        document.getElementById("listaTreinos");


    lista.innerHTML = "";


    treinos.forEach(function(treino) {

        const linha =
            document.createElement("tr");


        let reps;


        if (Array.isArray(treino.repeticoes)) {

            reps =
                treino.repeticoes.join(" / ");

        } else {

            reps =
                treino.repeticoes;

        }


        const nomeDia =
            nomesDias[treino.dia] ||
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
                ${treino.carga} kg
            </td>

            <td>
                ${treino.series}
            </td>

            <td>
                ${reps}
            </td>

            <td>
                ${Number(treino.volume).toFixed(0)} kg
            </td>

        `;


        lista.appendChild(linha);

    });

}



/* =========================================
   FICHA SEMANAL
========================================= */

function atualizarFichaSemanal() {

    const ficha =
        document.getElementById("fichaSemanal");


    ficha.innerHTML = "";


    Object.keys(nomesDias).forEach(function(dia) {

        const div =
            document.createElement("div");


        div.className =
            "diaSemana";


        const exercicios =
            exerciciosSemana[dia];


        let listaExercicios = "";


        if (exercicios.length === 0) {

            listaExercicios =
                "<p>Nenhum exercício cadastrado.</p>";

        } else {

            listaExercicios =
                "<ul>";


            exercicios.forEach(function(exercicio) {

                listaExercicios +=
                    `<li>${exercicio}</li>`;

            });


            listaExercicios +=
                "</ul>";

        }


        let nomeTreino =
            nomesTreinos[dia] || "Treino não definido";


        div.innerHTML = `

            <h3>
                ${nomesDias[dia]}
            </h3>

            <p class="nomeTreinoSemana">
                ${nomeTreino}
            </p>

            ${listaExercicios}

        `;


        ficha.appendChild(div);

    });

}



/* =========================================
   LIMPAR FORMULÁRIO
========================================= */

function limparFormulario() {

    document.getElementById("carga").value =
        "";


    const inputs =
        document.querySelectorAll(
            ".repeticaoSerie"
        );


    inputs.forEach(function(input) {

        input.value = "";

    });

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


    localStorage.removeItem("treinos");


    atualizarTabela();


    document.getElementById("resultado").style.display =
        "none";

}



/* =========================================
   INICIAR SISTEMA
========================================= */

carregarExerciciosDoDia();

gerarSeries();

atualizarTabela();

atualizarFichaSemanal();
