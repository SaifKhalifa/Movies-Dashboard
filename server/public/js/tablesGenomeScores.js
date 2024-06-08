const dataTableBodyId = document.getElementById("dataTableGenomeScoresId")
let datatableSearch;
let table;
let inputText = '';

async function fetchGenomeScores(start, length) {
    const res = await fetch(`/api/genome-scores/get-genome-scores?start=${start}&length=${length}`);
    const data = await res.json();
    return data;
}

const searchButton = document.getElementById("search-btn")
searchButton.addEventListener('click', async ()=>{
    table.data = {
        headings: [

        ],
        data:[],
    }
    table.refresh();
    const res = await fetch(`/api/genome-scores/get-genome-score?query=${inputText}`)
    const data = await res.json();

    const queryData = {};
    queryData.headings = Object.keys(data[0]);
    queryData.headings.shift();


    const values = [];
    for (const v of data) {
        const obj = {
            movieId: v.movieId,
            tagId: v.tagId,
            relevance: v.relevance,
        };
        values.push(Object.values(obj));
    }

    queryData.data = values;
    
    table.insert({
        headings: queryData.headings,
        data: queryData.data,
    });

     inputText='';
     table.refresh();
})

async function genomeScoresData(start, length) {
    const data = await fetchGenomeScores(start, length);
    if (table) {
        const queryData = {};
        queryData.headings = Object.keys(data[0]);
        queryData.headings.shift();


        const values = [];
        for (const v of data) {
            const obj = {
                movieId: v.movieId,
                tagId: v.tagId,
                relevance: v.relevance,
            };
            values.push(Object.values(obj));
        }

        queryData.data = values;

        table.insert({
            headings: queryData.headings,
            data: queryData.data,
        });
    }
}

window.addEventListener('DOMContentLoaded', async event => {
    // Simple-DataTables
    table = new simpleDatatables.DataTable("#datatablesSimple");
    table.on('datatable.search', function(query, matched) {
        inputText = query;
    });
    await genomeScoresData(0, 10); // Load initial data
});

const loadMoreBtn = document.getElementById("genome-scores-load-more");
let start = 10; // Initial start index for loading more
loadMoreBtn.addEventListener("click", async () => {
    await genomeScoresData (start, 10);
    start += 10; // Increment start index for next load
});
