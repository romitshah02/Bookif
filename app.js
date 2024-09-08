document.addEventListener('DOMContentLoaded', async () => {

    const hardURL = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${key}`;
    const ebookURL = `https://api.nytimes.com/svc/books/v3/lists/current/e-book-fiction.json?api-key=${key}`;
    const combinedURL = `https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-fiction.json?api-key=${key}`;

    let books = [];
    let sorting = "rank";
    let filtering = "mix";
    const booksPerPage = 5;
    currentPage =1;
    totalPages = 3;
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    const page = document.querySelector('.pagination');
    const pageLinks = document.querySelectorAll('.pagination .page-link');
    document.getElementById("loading").style.display = "block";

    async function fetchbook(url) {
        try {
            const response = await fetch(url);
            const loadingElement = document.getElementById("loading");
            if (loadingElement) {
                loadingElement.style.display = "block";
            }
            
            if (response.status < 400){
                const data = await response.json();
                books = data.results.books
                if (loadingElement) {
                    loadingElement.style.display = "none";
                }
            }else {
                loadingElement.innerHTML = "Too many requests to the server. Please wait a few minutes.";
            }
        }catch {
            const booksContainer = document.getElementById("books");
            booksContainer.innerHTML = '';
            const loadingElement = document.getElementById("loading");
            if (loadingElement) {
                loadingElement.style.display = "block";
                loadingElement.innerHTML = "Too many request to the server wait for few minutes"
            }
        }
        renderBooks();
        
    }

    fetchbook(combinedURL);
    
        
    

    function renderBooks() {
        
        const booksContainer = document.getElementById("books");
        booksContainer.innerHTML = '';

        const start = (currentPage - 1) * booksPerPage;
        const end = start + booksPerPage;
        const paginatedBooks = books.slice(start, end);
        initial();

        for (const book of paginatedBooks) {
            const bookDiv = document.createElement('div');
            bookDiv.className = "single-book";

            const img = document.createElement('img');
            img.src = book.book_image;
            img.className = "book-image";
            img.width = 200;
            img.height = 200;
            
            const rank = document.createElement('div');
            rank.className = "book-rank";
            rank.textContent = `Rank - ${book.rank}`;

            const info = document.createElement('div');
            info.className = "book-info";

            const title = document.createElement('div');
            title.className = "book-title";
            title.textContent = book.title;

            const author = document.createElement('div');
            author.className = "book-author";
            author.textContent = book.author;


            const streak = document.createElement('div');
            streak.className = "book-streak"
            streak.textContent = `Weeks on list ${book.weeks_on_list}`

            const publisher = document.createElement('div');
            publisher.className = "book-publisher";
            publisher.textContent = `Publisher - ${book.publisher}`

            const link = document.createElement('a');
            link.className = "book-link";
            link.setAttribute('href',book.buy_links[0].url)
            link.innerHTML = book.buy_links[0].name
            

            info.appendChild(title);
            info.appendChild(author);
            info.appendChild(streak);
            info.appendChild(publisher);
            info.appendChild(link);

            bookDiv.appendChild(rank);
            bookDiv.appendChild(img);
            bookDiv.appendChild(info);
            booksContainer.appendChild(bookDiv);
        }
    }

    function initial(){
        pageLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        pageLinks.forEach(link => {
            if (parseInt(link.dataset.page) === currentPage) {
            link.parentElement.classList.add('active');
            }
        });

        if (currentPage < 2){
            prev.style.display = "none";
        }else{
            prev.style.display = "block";
        }

        if (currentPage === totalPages){
            next.style.display = "none";
        }else{
            next.style.display = "block";
        }
    }

    function handlePageChange(event) {
        event.preventDefault();
        const target = event.target.closest(".page-link");
        
        if (!target) return;
        

        if (target.id === 'prev') {
        if (currentPage > 1) {
            currentPage--;
        renderBooks();
        }
        } else if (target.id === 'next') {
        if (currentPage < totalPages) {
            currentPage++;
            
            renderBooks();
        }
        } else {
        
        currentPage = parseInt(target.dataset.page);
        renderBooks();
        }
    }
    
    page.addEventListener('click', handlePageChange);

    const sort = document.getElementById('sort');
    sort.addEventListener('change', () => {
        if (sort.value === "rank" && sorting !== 'rank') {
            books.sort((a, b) => a.rank - b.rank);
            sorting = "rank";
        } else if (sort.value === "title" && sorting !== "title") {
            books.sort((a, b) => a.title.localeCompare(b.title));
            sorting = "title";
        } else if (sort.value === "streak" && sorting !== "streak") {
            books.sort((a, b) => b.weeks_on_list - a.weeks_on_list);
            sorting = "streak";
        }

        renderBooks();
    });

    const filter = document.getElementById('filter');
    filter.addEventListener('change',()=>{
        
        if (filter.value === "hard" && filtering !== "hard"){
            fetchbook(hardURL);
            filtering = "hard";
        } else if (filter.value === "ebook" && filtering !== "ebook") {
            fetchbook(ebookURL);
            filtering = "ebook";
        } else{
            fetchbook(combinedURL);
            filtering = "mix";
    }
    sort.value = "rank"; 
    sorting = "rank";
})

   

});
