// Inicializa o editor Quill
const editor = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Escreva aqui...',
    modules: {
        toolbar: [
            [{ 'font': [] },
            { 'size': ['small', 'medium', 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['image', 'video']
        ]
    }
});

// Array para armazenar as páginas
let pages = [{ title: 'Página 1', content: '' }];
let currentPage = 0;

// Função para atualizar o nome da página atual exibida
function updateCurrentPageTitle() {
    document.getElementById('current-page-title').textContent = pages[currentPage].title;
}

// Função para adicionar nova página
function addPage() {
    const newPageNumber = pages.length + 1;
    pages.push({ title: `Página ${newPageNumber}`, content: '' });
    currentPage = pages.length - 1;
    loadPage();
    updatePageList();
}

// Função para carregar a página atual no editor
function loadPage() {
    editor.setContents(pages[currentPage].content);
    updateCurrentPageTitle();
    console.log(`${pages[currentPage].title} carregada.`);
}

// Funções para navegação entre páginas
function prevPage() {
    if (currentPage > 0) currentPage--;
    loadPage();
}

function nextPage() {
    if (currentPage < pages.length - 1) currentPage++;
    loadPage();
}

// Função para renomear a página atual
function renamePage() {
    const newTitle = prompt('Digite o novo nome da página:', pages[currentPage].title);
    if (newTitle) {
        pages[currentPage].title = newTitle;
        updatePageList();
        updateCurrentPageTitle();
    }
}

// Função de pesquisa para destacar o primeiro termo encontrado
function search() {
    const searchTerm = document.getElementById('search').value;
    const content = editor.getText();
    const index = content.indexOf(searchTerm);

    if (index !== -1) {
        const length = searchTerm.length;
        editor.setSelection(index, length);
        editor.focus();
    } else {
        alert('Termo não encontrado');
    }
}

// Salva a página atual no array ao sair do editor
editor.on('text-change', () => {
    pages[currentPage].content = editor.getContents();
});

// Função para atualizar a lista de páginas
function updatePageList() {
    const pageList = document.getElementById('pages-list');
    pageList.innerHTML = '';
    pages.forEach((page, index) => {
        const li = document.createElement('li');
        li.textContent = page.title;
        li.onclick = () => {
            currentPage = index;
            loadPage();
        };
        pageList.appendChild(li);
    });
}

// Atualiza a lista de páginas e o nome da página atual na inicialização
updatePageList();
updateCurrentPageTitle();

// Adiciona suporte para arrastar e redimensionar imagens
editor.root.addEventListener('click', function(event) {
    const target = event.target;
    if (target.tagName === 'IMG') {
        if (!target.parentElement.classList.contains('image-container')) {
            const container = document.createElement('div');
            container.classList.add('image-container');
            target.parentNode.insertBefore(container, target);
            container.appendChild(target);
            
            const resizeHandle = document.createElement('div');
            resizeHandle.classList.add('resize-handle');
            container.appendChild(resizeHandle);

            makeDraggable(container);
            makeResizable(resizeHandle, container);
        }
    }
});

// Função para tornar um elemento arrastável
function makeDraggable(element) {
    let offsetX, offsetY;

    element.onmousedown = function(event) {
        offsetX = event.clientX - element.getBoundingClientRect().left;
        offsetY = event.clientY - element.getBoundingClientRect().top;

        document.onmousemove = function(event) {
            element.style.position = 'absolute'; // Garante que o elemento seja posicionado corretamente
            element.style.left = event.clientX - offsetX + 'px';
            element.style.top = event.clientY - offsetY + 'px';
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

// Função para tornar um elemento redimensionável
function makeResizable(handle, container) {
    handle.onmousedown = function(event) {
        document.onmousemove = function(event) {
            const width = event.clientX - container.getBoundingClientRect().left;
            const height = event.clientY - container.getBoundingClientRect().top;
            container.style.width = width + 'px';
            container.style.height = height + 'px';
            container.children[0].style.width = '100%'; // Garante que a imagem ocupe todo o espaço
            container.children[0].style.height = '100%'; // Garante que a imagem ocupe todo o espaço
        };

        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };

        return false; // Evita seleção de texto
    };
}
