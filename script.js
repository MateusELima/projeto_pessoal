let treinos = JSON.parse(localStorage.getItem("treinos")) || [];


/* ==============================
   CRIA OS CAMPOS DAS SÉRIES
================================ */

function gerarSeries() {

    const quantidade = parseInt(
        document.getElementById("series").value
    );

    const container = document.getElementById("camposSeries");

    container.innerHTML = "";

    for (let i = 1; i <= quantidade; i++) {

        const label = document.createElement("label");

        label.innerText = `Repetições - Série ${i}`;

        const input = document.createElement("input");

        input.type = "number";
        input.min = "1";
        input.placeholder = `Ex: 12`;
        input.className = "repeticaoSerie";
        input.id = `serie${i}`;

        container.appendChild(label);
        container.appendChild(input);
    }
}


/* ==============================
   REGISTRAR TREINO
================================ */

function registrarTreino() {

    const exercicio =
        document.getElementById("exercicio").value;

    const carga =
        parseFloat(document.getElementById("carga").value);

    const quantidadeSeries =
        parseInt(document.getElementById("series").value);

    const inputsRepeticoes =
        document.querySelectorAll(".repeticaoSerie");


    if (isNaN(carga) || carga < 0) {

        alert("Informe uma carga válida.");

        return;
    }


    let repeticoes = [];

    let camposValidos = true;


    inputsRepeticoes.forEach(function(input) {

        const valor = parseInt(input.value);

        if (isNaN(valor) || valor <= 0) {

            camposValidos = false;

        } else {

            repeticoes.push(valor);

        }

    });


    if (!camposValidos) {

        alert("Informe as repetições de todas as séries.");

        return;
    }


    /* SOMA TOTAL DAS REPETIÇÕES */

    const totalRepeticoes =
        repeticoes.reduce(function(total, valor) {

            return total + valor;

        }, 0);


    /* VOLUME DO TREINO */

    const volume = carga * totalRepeticoes;


    const treino = {

        data: new Date().toLocaleDateString("pt-BR"),

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


/* ==============================
   SUGESTÃO DE CARGA
================================ */

function mostrarSugestao(treino) {

    const resultado =
        document.getElementById("resultado");


    const menorRepeticao =
        Math.min(...treino.repeticoes);


    let novaCarga = treino.carga;

    let mensagem = "";


    /*
        REGRA:

        Todas as séries >= 12
        AUMENTA 5%

        Menor série entre 8 e 11
        MANTÉM

        Alguma série abaixo de 8
        REDUZ 5%
    */


    if (menorRepeticao >= 12) {

        novaCarga = treino.carga * 1.05;

        mensagem = `
            Excelente! Você conseguiu pelo menos
            12 repetições em todas as séries.
            Pode tentar aumentar a carga no próximo treino.
        `;

    }

    else if (menorRepeticao >= 8) {

        mensagem = `
            Continue utilizando a mesma carga.
            Tente aumentar as repetições antes
            de aumentar o peso.
        `;

    }

    else {

        novaCarga = treino.carga * 0.95;

        mensagem = `
            Uma das séries ficou abaixo de 8 repetições.
            Considere reduzir um pouco a carga.
        `;

    }


    resultado.style.display = "block";


    resultado.innerHTML = `

        <h3>${treino.exercicio}</h3>

        <p>
            Carga utilizada:
            <strong>${treino.carga} kg</strong>
        </p>

        <br>

        <p>
            Séries:
            <strong>
                ${treino.repeticoes.join(" / ")}
            </strong>
        </p>

        <br>

        <p>${mensagem}</p>

        <br>

        <p>
            Próxima carga sugerida:

            <strong>
                ${novaCarga.toFixed(1)} kg
            </strong>
        </p>

    `;
}


/* ==============================
   ATUALIZAR HISTÓRICO
================================ */

function atualizarTabela() {

    const lista =
        document.getElementById("listaTreinos");

    lista.innerHTML = "";


    treinos.forEach(function(treino) {

        const linha =
            document.createElement("tr");


        let reps;


        if (Array.isArray(treino.repeticoes)) {

            reps = treino.repeticoes.join(" / ");

        } else {

            /*
            Compatibilidade com os treinos
            salvos na versão anterior.
            */

            reps = treino.repeticoes;

        }


        linha.innerHTML = `

            <td>${treino.data}</td>

            <td>${treino.exercicio}</td>

            <td>${treino.carga} kg</td>

            <td>${treino.series}</td>

            <td>${reps}</td>

            <td>${treino.volume.toFixed(0)} kg</td>

        `;


        lista.appendChild(linha);

    });

}


/* ==============================
   LIMPAR FORMULÁRIO
================================ */

function limparFormulario() {

    document.getElementById("carga").value = "";

    const inputs =
        document.querySelectorAll(".repeticaoSerie");


    inputs.forEach(function(input) {

        input.value = "";

    });

}


/* ==============================
   LIMPAR HISTÓRICO
================================ */

function limparHistorico() {

    const confirmar = confirm(
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

/* ==============================
   EXERCÍCIOS PERSONALIZADOS
================================ */

let exerciciosPersonalizados =
    JSON.parse(localStorage.getItem("exercicios")) || [];


function mostrarCadastroExercicio() {

    const cadastro =
        document.getElementById("cadastroExercicio");

    if (cadastro.style.display === "block") {

        cadastro.style.display = "none";

    } else {

        cadastro.style.display = "block";

        document.getElementById("novoExercicio").focus();

    }
}


function cadastrarExercicio() {

    const input =
        document.getElementById("novoExercicio");

    const nome = input.value.trim();


    if (nome === "") {

        alert("Digite o nome do exercício.");

        return;
    }


    /* VERIFICA SE JÁ EXISTE */

    const select =
        document.getElementById("exercicio");

    const exerciciosExistentes =
        Array.from(select.options).map(function(option) {

            return option.value.toLowerCase();

        });


    if (exerciciosExistentes.includes(nome.toLowerCase())) {

        alert("Esse exercício já está cadastrado.");

        return;
    }


    /* SALVA NO LOCALSTORAGE */

    exerciciosPersonalizados.push(nome);


    localStorage.setItem(
        "exercicios",
        JSON.stringify(exerciciosPersonalizados)
    );


    adicionarExercicioSelect(nome);


    /* SELECIONA O NOVO EXERCÍCIO */

    select.value = nome;


    input.value = "";

    document.getElementById("cadastroExercicio").style.display =
        "none";


    alert("Exercício cadastrado com sucesso!");

}


function adicionarExercicioSelect(nome) {

    const select =
        document.getElementById("exercicio");


    const option =
        document.createElement("option");


    option.value = nome;

    option.textContent = nome;


    select.appendChild(option);

}


function carregarExercicios() {

    exerciciosPersonalizados.forEach(function(nome) {

        adicionarExercicioSelect(nome);

    });

}


/* ==============================
   INICIAR SISTEMA
================================ */

gerarSeries();

atualizarTabela();