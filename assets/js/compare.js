/**
 * Created by Marcelo Henrique on 26/05/2017.
 */
const rule = /^   (?!ENTIDADE|NOME DO EMPREGADO).+[\d]$/gm;

const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] == undefined ? true : sParameterName[1];
        }
    }
};

const name = getUrlParameter("name");
if (name !== "undefined") {
    $(".username").text(" "+name+"!");
}

function sanatize(row) {
    const items = row.split(/\s\s+/);
    return {
        nome: items[1],
        matricula: items[2],
        lotacao: items[3],
        valLiquido: items[7]
    }
}

function becomeTable(customClass){
    return (elem) => {
        return "<tr class='"+customClass+"'><td>"+elem.nome+"</td><td>"+elem.matricula+"</td><td>"+elem.lotacao+"</td><td>"+elem.valLiquido+"</td></tr>"
    }
}

function diffElements(setA, setB) {
    return setA.filter( ea => {
        return setB.filter( eb => {
                //console.log(ea.nome +"!=="+ eb.nome +"="+(ea.nome === eb.nome))
                return ea.nome === eb.nome
        }).length === 0
    })
}

function ordemAlfabetica(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const match = /<td>(.*?)<\/td>/;

    a = match.exec(a)[1];
    b = match.exec(b)[1];
    if (a < b) return -1;
    if (a > b) return 1;
    return 0
}

const antigo = $("#old");
const novo = $("#new");

$( window ).on("load", function() {
    $("#comparar-btn").click( () => {

        //pega fields
        const novos = novo.val().match(rule);
        const antigos = antigo.val().match(rule);

        if (novos !== null && antigos !== null){
            // mapeia para objeto
            const novosObj = novos.map( sanatize );
            const antigosObj = antigos.map( sanatize );

            //pega removidos e adicionados
            let removidos = diffElements(antigosObj, novosObj);
            let adicionados = diffElements(novosObj, antigosObj);

            console.log("Removidos: " + removidos.length);
            console.log("Adicionados: " + adicionados.length);

            removidos = removidos.map( becomeTable("removed") );
            adicionados = adicionados.map( becomeTable("added") );

            $(".main-content-table tbody tr").remove();

            let todos = removidos.concat(adicionados);

            $(".main-content-table").append(todos.sort( ordemAlfabetica ).join(""));
            window.location.href = "#tabela-alterados";
        }
    });
});