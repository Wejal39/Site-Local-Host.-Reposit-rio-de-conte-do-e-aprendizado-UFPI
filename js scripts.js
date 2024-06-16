document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('uploadForm');
    const metodoSelect = document.getElementById('metodo');
    const cornellFields = document.getElementById('cornellFields');
    const feynmanFields = document.getElementById('feynmanFields');

    metodoSelect.addEventListener('change', function() {
        if (metodoSelect.value === 'cornell') {
            cornellFields.style.display = 'block';
            feynmanFields.style.display = 'none';
        } else if (metodoSelect.value === 'feynman') {
            cornellFields.style.display = 'none';
            feynmanFields.style.display = 'block';
        } else {
            cornellFields.style.display = 'none';
            feynmanFields.style.display = 'none';
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const data = document.getElementById('data').value;
        const materia = document.getElementById('materia').value;
        const metodo = document.getElementById('metodo').value;

        let novoConteudo = {
            data: data,
            materia: materia,
            metodo: metodo
        };

        if (metodo === 'cornell') {
            novoConteudo.topicos = document.getElementById('topicos').value;
            novoConteudo.anotacoes = document.getElementById('anotacoes').value;
            novoConteudo.resumo = document.getElementById('resumo').value;
        } else if (metodo === 'feynman') {
            novoConteudo.conceitos = document.getElementById('conceitos').value;
            novoConteudo.explicacao = document.getElementById('explicacao').value;
            novoConteudo.lacunas = document.getElementById('lacunas').value;
            novoConteudo.simplificacao = document.getElementById('simplificacao').value;
        }

        const imagem = document.getElementById('imagem').files[0];
        if (imagem) {
            const reader = new FileReader();
            reader.onloadend = function() {
                novoConteudo.imagem = reader.result;
                enviarConteudo(novoConteudo);
            };
            reader.readAsDataURL(imagem);
        } else {
            enviarConteudo(novoConteudo);
        }
    });

    function enviarConteudo(conteudo) {
        fetch('/api/conteudos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(conteudo)
        })
        .then(response => response.json())
        .then(data => {
            alert('Conteúdo adicionado com sucesso!');
            form.reset();
            metodoSelect.dispatchEvent(new Event('change'));
        })
        .catch(error => console.error('Erro:', error));
    }

    function carregarConteudos(filtro = {}) {
        const params = new URLSearchParams(filtro).toString();
        fetch(`/api/conteudos?${params}`)
            .then(response => response.json())
            .then(conteudos => {
                const conteudosDiv = document.getElementById('conteudo');
                conteudosDiv.innerHTML = '';
                conteudos.forEach(c => {
                    const div = document.createElement('div');
                    div.className = 'conteudo-item';
                    div.innerHTML = `
                        <h3>${c.materia} - ${c.data}</h3>
                        <p><strong>Método:</strong> ${c.metodo === 'cornell' ? 'Método de Cornell/Sintético' : 'Método de Feynman/Analítico'}</p>
                        ${c.metodo === 'cornell' ? `
                            <p><strong>Tópicos:</strong> ${c.topicos}</p>
                            <p><strong>Anotações:</strong> ${c.anotacoes}</p>
                            <p><strong>Resumo:</strong> ${c.resumo}</p>
                        ` : `
                            <p><strong>Conceitos:</strong> ${c.conceitos}</p>
                            <p><strong>Explicação:</strong> ${c.explicacao}</p>
                            <p><strong>Lacunas:</strong> ${c.lacunas}</p>
                            <p><strong>Simplificação:</strong> ${c.simplificacao}</p>
                        `}
                        ${c.imagem ? `<img src="${c.imagem}" alt="${c.materia}">` : ''}
                    `;
                    conteudosDiv.appendChild(div);
                });
            })
            .catch(error => console.error('Erro:', error));
    }

    if (document.getElementById('conteudo')) {
        const filtroForm = document.getElementById('filtroForm');
        filtroForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const filtro = {
                data: document.getElementById('data').value,
                materia: document.getElementById('materia').value,
                metodo: document.getElementById('metodo').value
            };
            carregarConteudos(filtro);
        });
        carregarConteudos();
    }
});
