var krysskort = {
    loadSpeciesList: function() {
        const response = await fetch('https://cdn.jsdelivr.net/gh/Gavia1981/gavia1981.github.io/krysskort/specieslist.json');
        const myJson = await response.json();
        console.log(myJson);
        console.log("now!");
    }
};
krysskort.loadSpeciesList();
