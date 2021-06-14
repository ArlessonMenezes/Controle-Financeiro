class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    //Metodo para percorrer os atributos e validar  
    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false;
            }
        }
        return true
    } 
}
//Classe para pegar, inserir, registrar e deletar um valor no localStorage
class Bd {
    constructor(){
        let id = localStorage.getItem('id');
        if(id === null){
            localStorage.setItem('id', 0);
        }
    }
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d) {
       let id = this.getProximoId()
       localStorage.setItem(id, JSON.stringify(d))
       localStorage.setItem('id', id);
    }
    recuperarTodosRegistros() {
        //Array despesas
        let despesas = Array()
        let id = localStorage.getItem('id');

        //Recuperar todas as despesas em localStorage
        for(let i = 1; i <= id; i++) {
            //Recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            //Caso exita possobilidade de haver algum indice removido, vamos pular o indice
            if(despesa === null){
                continue;
            }
            despesa.id = i;
            despesas.push(despesa)
        }
        return despesas;  
    }
    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros()
        console.log(despesa) 
        console.log(despesasFiltradas)

        //Ano
        if(despesa.ano != ''){
            console.log('Filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //Mês
        if(despesa.mes != ''){
            console.log('Filtro de mês')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //Dia
        if(despesa.dia != ''){
            console.log('Filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //Tipo
        if(despesa.tipo != ''){
            console.log('Filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //Descrição
        if(despesa.descricao != ''){
            console.log('Filtro de descrição')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //Valor
        if(despesa.valor != ''){
            console.log('Filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    }
    remover(id) {
        localStorage.removeItem(id);
    }
}

let bd = new Bd
//Função para pegar os valores inseridos nos campos
function cadastrarDespesa(){
    
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesas(
        ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value
    )

    if(despesa.validarDados()){
        bd.gravar(despesa);

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso';
        document.getElementById('modal_titulo_div').className = 'modal-header text-success';
        document.getElementById('modal_conteudo').innerHTML = 'Desepsa foi cadastrada com sucesso';
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show');
        
        // Limpando campo 
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    }else {
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro';
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
        document.getElementById('modal_conteudo').innerHTML = 'Erro no registro, verifique se todos os campos foram preenchidos corretamente';
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger';
        //dialog de erro
        $('#modalRegistraDespesa').modal('show');
    }
}
function carregaListaDespesa(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros();
    }

    // Selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    // Percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d) { //utilizando função callback
        //inserindo linha (tr)
        let linha = listaDespesas.insertRow()

        //Inserindo coluna (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 
        //Ajustar o tipo
        switch(parseInt(d.tipo)){
            case 1: d.tipo = 'Alimentação'
                break;
            case 2: d.tipo = 'Educação'
                break;
            case 3: d.tipo = 'Lazer'
                break;
            case 4: d.tipo = 'Saúde'
                break;
            case 5: d.tipo = 'Transporte'
                break;
            case 6: d.tipo = 'Investimentos'
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //Criar botão de exclusão
        let btn = document.createElement("button");
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_ ${d.id}`
        btn.onclick = function() {//remover a despesa
            let id = this.id.replace('id_despesa_ ', '')
            //alert(`Item ${id} deletado`)
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn);
        console.log(despesas)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesas(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa);    

    carregaListaDespesa(despesas, true);
}
